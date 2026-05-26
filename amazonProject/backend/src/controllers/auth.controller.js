import {
  login,
  register,
  toPublicUser,
} from "../services/auth.service.js";

export async function registerUser(req, res) {
  const result = await register(req.body);
  res.status(201).json(result);
}

export async function loginUser(req, res) {
  const result = await login(req.body);
  res.json(result);
}

export async function getCurrentUser(req, res) {
  res.json(toPublicUser(req.user));
}
