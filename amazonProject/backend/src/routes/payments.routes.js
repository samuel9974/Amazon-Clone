import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import {
  confirm,
  createIntent,
  devComplete,
  getConfig,
} from "../controllers/payments.controller.js";

const router = Router();

router.get("/config", asyncHandler(getConfig));

router.use(requireAuth);

router.post("/intent", asyncHandler(createIntent));
router.post("/confirm", asyncHandler(confirm));
router.post("/dev-complete", asyncHandler(devComplete));

export default router;
