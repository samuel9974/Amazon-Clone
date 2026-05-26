import pool from "../db/db.config.js";
import { HttpError } from "../utils/httpError.js";
import { mapProduct } from "../utils/productMapper.js";
import { PRODUCT_SELECT } from "../services/install.service.js";

export async function listProducts(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const size = Math.min(100, Math.max(1, Number(req.query.size) || 50));
  const offset = (page - 1) * size;
  const categorySlug = req.query.category?.trim().toLowerCase();

  let whereClause = "";
  const params = [];

  if (categorySlug) {
    whereClause = "WHERE c.slug = ?";
    params.push(categorySlug);
  }

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ${whereClause}`,
    params,
  );

  const [rows] = await pool.query(
    `${PRODUCT_SELECT}
     ${whereClause}
     ORDER BY p.id ASC
     LIMIT ? OFFSET ?`,
    [...params, size, offset],
  );

  const total = countRows[0].total;

  res.json({
    items: rows.map(mapProduct),
    page,
    size,
    total,
    totalPages: Math.ceil(total / size) || 1,
  });
}

export async function getProductById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, "Invalid product id");
  }

  const [rows] = await pool.query(
    `${PRODUCT_SELECT} WHERE p.id = ?`,
    [id],
  );

  if (!rows.length) {
    throw new HttpError(404, "Product not found");
  }

  res.json(mapProduct(rows[0]));
}
