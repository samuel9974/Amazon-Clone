import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.get("/me", requireAuth, asyncHandler(getCurrentUser));

export default router;
