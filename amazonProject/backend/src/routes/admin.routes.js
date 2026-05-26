import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  getOrders,
  patchOrder,
  postProduct,
  putProduct,
  removeProduct,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/orders", asyncHandler(getOrders));
router.patch("/orders/:orderId", asyncHandler(patchOrder));

router.post("/products", asyncHandler(postProduct));
router.put("/products/:id", asyncHandler(putProduct));
router.delete("/products/:id", asyncHandler(removeProduct));

export default router;
