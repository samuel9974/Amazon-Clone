import { Router } from "express";
import { installDatabase } from "../controllers/install.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(installDatabase));
router.post("/", asyncHandler(installDatabase));

export default router;
