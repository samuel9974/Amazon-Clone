import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import {
  createOrder,
  getOrder,
  getOrders,
} from "../controllers/orders.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getOrders));
router.post("/", asyncHandler(createOrder));
router.get("/:orderId", asyncHandler(getOrder));

export default router;
