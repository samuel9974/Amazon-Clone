import pool from "../db/db.config.js";
import { mapCategory } from "../utils/productMapper.js";

export async function listCategories(req, res) {
  const [rows] = await pool.query(
    `SELECT id, name, slug, image_url
     FROM categories
     ORDER BY id ASC`,
  );

  res.json(rows.map(mapCategory));
}
