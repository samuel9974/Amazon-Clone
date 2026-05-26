import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import { findUserById } from "../services/auth.service.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Authentication required"));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    const user = await findUserById(payload.sub);

    if (!user || !user.enabled) {
      return next(new HttpError(401, "Invalid or expired token"));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new HttpError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(new HttpError(401, "Authentication required"));
  }
  if (req.user.role !== "ADMIN") {
    return next(new HttpError(403, "Admin access required"));
  }
  next();
}
