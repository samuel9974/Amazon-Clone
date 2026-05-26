import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import {
  addCartItem,
  deleteCartItem,
  getUserCart,
  patchCartItem,
} from "../controllers/cart.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getUserCart));
router.post("/", asyncHandler(addCartItem));
router.patch("/:productId", asyncHandler(patchCartItem));
router.delete("/:productId", asyncHandler(deleteCartItem));

export default router;
