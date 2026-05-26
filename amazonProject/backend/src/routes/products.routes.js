import { Router } from "express";
import {
  getProductById,
  listProducts,
} from "../controllers/products.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listProducts));
router.get("/:id", asyncHandler(getProductById));

export default router;
