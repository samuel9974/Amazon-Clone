import { Router } from "express";
import pool from "../db/db.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import authRoutes from "./auth.routes.js";
import productsRoutes from "./products.routes.js";
import categoriesRoutes from "./categories.routes.js";
import cartRoutes from "./cart.routes.js";
import ordersRoutes from "./orders.routes.js";
import paymentsRoutes from "./payments.routes.js";
import adminRoutes from "./admin.routes.js";

const api = Router();

api.get(
  "/health",
  asyncHandler(async (req, res) => {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      database: env.db.name,
      environment: env.nodeEnv,
    });
  }),
);

api.use("/auth", authRoutes);
api.use("/products", productsRoutes);
api.use("/categories", categoriesRoutes);
api.use("/cart", cartRoutes);
api.use("/orders", ordersRoutes);
api.use("/payments", paymentsRoutes);
api.use("/admin", adminRoutes);

export default api;
