import pool from "../db/db.config.js";
import { HttpError } from "../utils/httpError.js";
import { mapProduct } from "../utils/productMapper.js";

const CART_LINE_SELECT = `
  SELECT ci.product_id, ci.quantity,
         p.id, p.title, p.description, p.price, p.rating, p.stock, p.image_url,
         c.slug AS category_slug,
         (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id) AS review_count
  FROM cart_items ci
  INNER JOIN products p ON p.id = ci.product_id
  LEFT JOIN categories c ON c.id = p.category_id
`;

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

function mapCartRow(row) {
  const product = mapProduct(row);
  return {
    productId: row.product_id,
    quantity: row.quantity,
    product,
  };
}

function buildCartPayload(rows) {
  const items = rows.map(mapCartRow);
  const total = roundMoney(
    items.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
  );
  return { items, total };
}

async function fetchCartRows(userId) {
  const [rows] = await pool.query(
    `${CART_LINE_SELECT}
     WHERE ci.user_id = ?
     ORDER BY ci.added_at ASC`,
    [userId],
  );
  return rows;
}

async function getProductStock(productId) {
  const [rows] = await pool.query(
    "SELECT id, stock FROM products WHERE id = ?",
    [productId],
  );
  if (!rows.length) {
    throw new HttpError(404, "Product not found");
  }
  return rows[0];
}

function parseQuantity(value, fieldName = "quantity") {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new HttpError(400, `${fieldName} must be a positive integer`);
  }
  return quantity;
}

function parseProductId(value) {
  const productId = Number(value);
  if (!Number.isInteger(productId) || productId < 1) {
    throw new HttpError(400, "Invalid product id");
  }
  return productId;
}

function assertStockAvailable(stock, quantity) {
  if (quantity > stock) {
    throw new HttpError(400, `Only ${stock} item(s) available in stock`);
  }
}

export async function getCart(userId) {
  const rows = await fetchCartRows(userId);
  return buildCartPayload(rows);
}

export async function addToCart(userId, { productId, quantity }) {
  const pid = parseProductId(productId);
  const qty = parseQuantity(quantity);
  const product = await getProductStock(pid);
  assertStockAvailable(product.stock, qty);

  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
    [userId, pid, qty],
  );

  return getCart(userId);
}

export async function updateCartItem(userId, productIdParam, { quantity }) {
  const productId = parseProductId(productIdParam);
  const qty = parseQuantity(quantity);

  const product = await getProductStock(productId);
  assertStockAvailable(product.stock, qty);

  const [result] = await pool.query(
    `UPDATE cart_items SET quantity = ?
     WHERE user_id = ? AND product_id = ?`,
    [qty, userId, productId],
  );

  if (result.affectedRows === 0) {
    throw new HttpError(404, "Cart item not found");
  }

  return getCart(userId);
}

export async function removeFromCart(userId, productIdParam) {
  const productId = parseProductId(productIdParam);

  const [result] = await pool.query(
    "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
    [userId, productId],
  );

  if (result.affectedRows === 0) {
    throw new HttpError(404, "Cart item not found");
  }

  return getCart(userId);
}
