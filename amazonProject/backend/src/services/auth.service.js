import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/db.config.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

const USER_SELECT =
  "id, email, full_name AS fullName, role, enabled, created_at AS createdAt";

//convert a user to a public user
export function toPublicUser(row) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName ?? row.full_name ?? null,
    role: row.role,
  };
}

//sign a token
function signToken(userId, role) {
  return jwt.sign({ sub: userId, role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

function normalizeEmail(email) {
  return email?.trim().toLowerCase() ?? "";
}

//assert the credentials are valid
function assertCredentials(email, password) {
  if (!email) {
    throw new HttpError(400, "Email is required");
  }
  if (!password) {
    throw new HttpError(400, "Password is required");
  }
  if (password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters");
  }
}

//find a user by id
export async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT ${USER_SELECT} FROM users WHERE id = ?`,
    [id],
  );
  return rows[0] ?? null;
}

//register a new user
export async function register({ email, password, fullName }) {
  const normalizedEmail = normalizeEmail(email);
  assertCredentials(normalizedEmail, password);

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [
    normalizedEmail,
  ]);
  if (existing.length) {
    throw new HttpError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);
  const [result] = await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES (?, ?, ?, 'USER')`,
    [normalizedEmail, passwordHash, fullName?.trim() || null],
  );

  const user = await findUserById(result.insertId);
  return {
    token: signToken(user.id, user.role),
    user: toPublicUser(user),
  };
}

export async function login({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  const [rows] = await pool.query(
    `SELECT id, email, full_name, role, enabled, password_hash
     FROM users WHERE email = ?`,
    [normalizedEmail],
  );

  if (!rows.length) {
    throw new HttpError(401, "Invalid email or password");
  }

  const row = rows[0];
  if (!row.enabled) {
    throw new HttpError(403, "Account is disabled");
  }

  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }

  return {
    token: signToken(row.id, row.role),
    user: toPublicUser(row),
  };
}
