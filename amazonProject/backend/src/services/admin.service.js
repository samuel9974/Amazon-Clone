import pool from "../db/db.config.js";
import { HttpError } from "../utils/httpError.js";
import { mapProduct } from "../utils/productMapper.js";
import { PRODUCT_SELECT } from "./install.service.js";

const ORDER_STATUSES = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

const ORDER_ITEM_SELECT = `
  SELECT id, order_id, product_id, product_title, unit_price, quantity
  FROM order_items
  WHERE order_id = ?
`;

function parseId(value, label = "id") {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, `Invalid ${label}`);
  }
  return id;
}

function mapOrderItem(row) {
  return {
    id: row.id,
    productId: row.product_id,
    productTitle: row.product_title,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
  };
}

function mapAdminOrder(row, items) {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    totalAmount: Number(row.total_amount),
    status: row.status,
    shippingAddress: row.shipping_address,
    createdAt: row.created_at,
    items,
  };
}

async function fetchProductById(productId) {
  const [rows] = await pool.query(`${PRODUCT_SELECT} WHERE p.id = ?`, [
    productId,
  ]);
  if (!rows.length) {
    throw new HttpError(404, "Product not found");
  }
  return mapProduct(rows[0]);
}

async function resolveCategoryId(categoryId, categorySlug) {
  if (categoryId != null && categoryId !== "") {
    const id = Number(categoryId);
    if (!Number.isInteger(id) || id < 1) {
      throw new HttpError(400, "Invalid categoryId");
    }
    const [rows] = await pool.query("SELECT id FROM categories WHERE id = ?", [
      id,
    ]);
    if (!rows.length) {
      throw new HttpError(400, "Category not found");
    }
    return id;
  }

  if (categorySlug) {
    const [rows] = await pool.query(
      "SELECT id FROM categories WHERE slug = ?",
      [categorySlug.trim().toLowerCase()],
    );
    if (!rows.length) {
      throw new HttpError(400, "Category not found");
    }
    return rows[0].id;
  }

  return null;
}

function assertRating(rating) {
  const value = Number(rating);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new HttpError(400, "rating must be an integer between 1 and 5");
  }
  return value;
}

export async function listAllOrders() {
  const [orders] = await pool.query(
    `SELECT o.id, o.user_id, o.total_amount, o.status, o.shipping_address, o.created_at,
            u.email AS user_email
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`,
  );

  const result = [];

  for (const order of orders) {
    const [items] = await pool.query(ORDER_ITEM_SELECT, [order.id]);
    result.push(mapAdminOrder(order, items.map(mapOrderItem)));
  }

  return result;
}

export async function updateOrderStatus(orderIdParam, { status }) {
  const orderId = parseId(orderIdParam, "order id");

  if (!status || !ORDER_STATUSES.includes(status)) {
    throw new HttpError(
      400,
      `status must be one of: ${ORDER_STATUSES.join(", ")}`,
    );
  }

  const [result] = await pool.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, orderId],
  );

  if (result.affectedRows === 0) {
    throw new HttpError(404, "Order not found");
  }

  if (status === "PAID") {
    const [orders] = await pool.query(
      "SELECT total_amount FROM orders WHERE id = ?",
      [orderId],
    );
    await pool.query(
      `INSERT INTO payments (order_id, provider, provider_payment_id, amount, currency, status)
       VALUES (?, 'MANUAL', ?, ?, 'USD', 'SUCCEEDED')
       ON DUPLICATE KEY UPDATE status = 'SUCCEEDED', provider = 'MANUAL'`,
      [orderId, `admin_${orderId}`, orders[0].total_amount],
    );
  }

  const [orders] = await pool.query(
    `SELECT o.id, o.user_id, o.total_amount, o.status, o.shipping_address, o.created_at,
            u.email AS user_email
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     WHERE o.id = ?`,
    [orderId],
  );

  const [items] = await pool.query(ORDER_ITEM_SELECT, [orderId]);
  return mapAdminOrder(orders[0], items.map(mapOrderItem));
}

export async function createProduct(data) {
  const title = data.title?.trim();
  if (!title) {
    throw new HttpError(400, "title is required");
  }

  const price = Number(data.price);
  if (Number.isNaN(price) || price < 0) {
    throw new HttpError(400, "price must be a non-negative number");
  }

  const stock = data.stock == null ? 0 : Number(data.stock);
  if (!Number.isInteger(stock) || stock < 0) {
    throw new HttpError(400, "stock must be a non-negative integer");
  }

  const rating = data.rating == null ? 5 : assertRating(data.rating);
  const categoryId = await resolveCategoryId(data.categoryId, data.categorySlug);
  const imageUrl = data.imageUrl?.trim() || null;
  const description = data.description?.trim() || null;

  const [result] = await pool.query(
    `INSERT INTO products (category_id, title, description, price, rating, stock, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [categoryId, title, description, price, rating, stock, imageUrl],
  );

  return fetchProductById(result.insertId);
}

export async function updateProduct(productIdParam, data) {
  const productId = parseId(productIdParam, "product id");

  const [existing] = await pool.query("SELECT id FROM products WHERE id = ?", [
    productId,
  ]);
  if (!existing.length) {
    throw new HttpError(404, "Product not found");
  }

  const fields = [];
  const values = [];

  if (data.title !== undefined) {
    const title = data.title?.trim();
    if (!title) throw new HttpError(400, "title cannot be empty");
    fields.push("title = ?");
    values.push(title);
  }

  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description?.trim() || null);
  }

  if (data.price !== undefined) {
    const price = Number(data.price);
    if (Number.isNaN(price) || price < 0) {
      throw new HttpError(400, "price must be a non-negative number");
    }
    fields.push("price = ?");
    values.push(price);
  }

  if (data.stock !== undefined) {
    const stock = Number(data.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      throw new HttpError(400, "stock must be a non-negative integer");
    }
    fields.push("stock = ?");
    values.push(stock);
  }

  if (data.rating !== undefined) {
    fields.push("rating = ?");
    values.push(assertRating(data.rating));
  }

  if (data.imageUrl !== undefined) {
    fields.push("image_url = ?");
    values.push(data.imageUrl?.trim() || null);
  }

  if (data.categoryId !== undefined || data.categorySlug !== undefined) {
    const categoryId = await resolveCategoryId(data.categoryId, data.categorySlug);
    fields.push("category_id = ?");
    values.push(categoryId);
  }

  if (!fields.length) {
    throw new HttpError(400, "No valid fields to update");
  }

  values.push(productId);
  await pool.query(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, values);

  return fetchProductById(productId);
}

export async function deleteProduct(productIdParam) {
  const productId = parseId(productIdParam, "product id");

  const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
    productId,
  ]);

  if (result.affectedRows === 0) {
    throw new HttpError(404, "Product not found");
  }
}
