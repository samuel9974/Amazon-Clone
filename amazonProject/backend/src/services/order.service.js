import pool from "../db/db.config.js";
import { HttpError } from "../utils/httpError.js";

const CHECKOUT_LINE_SELECT = `
  SELECT ci.product_id, ci.quantity,
         p.title, p.price, p.stock
  FROM cart_items ci
  INNER JOIN products p ON p.id = ci.product_id
  WHERE ci.user_id = ?
  ORDER BY ci.added_at ASC
`;

const ORDER_ITEM_SELECT = `
  SELECT id, order_id, product_id, product_title, unit_price, quantity
  FROM order_items
  WHERE order_id = ?
`;

function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

function parseOrderId(value) {
  const orderId = Number(value);
  if (!Number.isInteger(orderId) || orderId < 1) {
    throw new HttpError(400, "Invalid order id");
  }
  return orderId;
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

function mapOrder(row, items) {
  return {
    id: row.id,
    userId: row.user_id,
    totalAmount: Number(row.total_amount),
    status: row.status,
    shippingAddress: row.shipping_address,
    createdAt: row.created_at,
    items,
  };
}

async function loadOrderItems(connection, orderId) {
  const [rows] = await connection.query(ORDER_ITEM_SELECT, [orderId]);
  return rows.map(mapOrderItem);
}

export async function placeOrder(userId, { shippingAddress }) {
  const address = shippingAddress?.trim();
  if (!address) {
    throw new HttpError(400, "shippingAddress is required");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [cartLines] = await connection.query(CHECKOUT_LINE_SELECT, [
      userId,
    ]);

    if (!cartLines.length) {
      throw new HttpError(400, "Cart is empty");
    }

    let totalAmount = 0;

    for (const line of cartLines) {
      const qty = line.quantity;
      const stock = line.stock;

      if (qty > stock) {
        throw new HttpError(
          400,
          `Insufficient stock for "${line.title}" (requested ${qty}, available ${stock})`,
        );
      }

      totalAmount += Number(line.price) * qty;
    }

    totalAmount = roundMoney(totalAmount);

    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address)
       VALUES (?, ?, 'PENDING', ?)`,
      [userId, totalAmount, address],
    );

    const orderId = orderResult.insertId;

    for (const line of cartLines) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_title, unit_price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          line.product_id,
          line.title,
          line.price,
          line.quantity,
        ],
      );

      const [stockResult] = await connection.query(
        `UPDATE products
         SET stock = stock - ?
         WHERE id = ? AND stock >= ?`,
        [line.quantity, line.product_id, line.quantity],
      );

      if (stockResult.affectedRows === 0) {
        throw new HttpError(
          409,
          `Could not reserve stock for "${line.title}"`,
        );
      }
    }

    await connection.query("DELETE FROM cart_items WHERE user_id = ?", [
      userId,
    ]);

    await connection.commit();

    return { orderId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listOrders(userId) {
  const [orders] = await pool.query(
    `SELECT id, user_id, total_amount, status, shipping_address, created_at
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
  );

  const result = [];

  for (const order of orders) {
    const [items] = await pool.query(ORDER_ITEM_SELECT, [order.id]);
    result.push(mapOrder(order, items.map(mapOrderItem)));
  }

  return result;
}

export async function getOrderById(userId, orderIdParam) {
  const orderId = parseOrderId(orderIdParam);

  const [orders] = await pool.query(
    `SELECT id, user_id, total_amount, status, shipping_address, created_at
     FROM orders
     WHERE id = ? AND user_id = ?`,
    [orderId, userId],
  );

  if (!orders.length) {
    throw new HttpError(404, "Order not found");
  }

  const items = await loadOrderItems(pool, orderId);
  return mapOrder(orders[0], items);
}
