import Stripe from "stripe";
import pool from "../db/db.config.js";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

let stripeClient = null;

function getStripe() {
  if (!env.stripe.isConfigured) {
    throw new HttpError(
      503,
      "Stripe is not configured. Add STRIPE_SECRET_KEY to backend/.env (test key from Stripe Dashboard).",
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(env.stripe.secretKey);
  }
  return stripeClient;
}

function parseOrderId(value) {
  const orderId = Number(value);
  if (!Number.isInteger(orderId) || orderId < 1) {
    throw new HttpError(400, "Invalid order id");
  }
  return orderId;
}

async function getPayableOrder(userId, orderId) {
  const [rows] = await pool.query(
    `SELECT id, user_id, total_amount, status
     FROM orders
     WHERE id = ? AND user_id = ?`,
    [orderId, userId],
  );

  if (!rows.length) {
    throw new HttpError(404, "Order not found");
  }

  const order = rows[0];

  if (order.status === "PAID") {
    throw new HttpError(400, "Order is already paid");
  }

  if (order.status !== "PENDING") {
    throw new HttpError(400, `Order cannot be paid (status: ${order.status})`);
  }

  return order;
}

export async function markOrderPaid(orderId, paymentIntentId, amount) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      "SELECT status FROM orders WHERE id = ? FOR UPDATE",
      [orderId],
    );

    if (!orders.length) {
      throw new HttpError(404, "Order not found");
    }

    if (orders[0].status === "PAID") {
      await connection.commit();
      return { orderId, status: "PAID", alreadyPaid: true };
    }

    await connection.query(
      `INSERT INTO payments (order_id, provider, provider_payment_id, amount, currency, status)
       VALUES (?, 'STRIPE', ?, ?, 'USD', 'SUCCEEDED')
       ON DUPLICATE KEY UPDATE
         provider_payment_id = VALUES(provider_payment_id),
         amount = VALUES(amount),
         status = 'SUCCEEDED'`,
      [orderId, paymentIntentId, amount],
    );

    await connection.query("UPDATE orders SET status = 'PAID' WHERE id = ?", [
      orderId,
    ]);

    await connection.commit();
    return { orderId, status: "PAID" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function createPaymentIntent(userId, orderIdParam) {
  const orderId = parseOrderId(orderIdParam);
  const order = await getPayableOrder(userId, orderId);
  const stripe = getStripe();

  const amountCents = Math.round(Number(order.total_amount) * 100);
  if (amountCents < 50) {
    throw new HttpError(400, "Order total is below Stripe minimum ($0.50)");
  }

  const [existingPayments] = await pool.query(
    "SELECT provider_payment_id, status FROM payments WHERE order_id = ?",
    [orderId],
  );

  let paymentIntent;

  if (existingPayments[0]?.provider_payment_id) {
    paymentIntent = await stripe.paymentIntents.retrieve(
      existingPayments[0].provider_payment_id,
    );

    if (paymentIntent.status === "succeeded") {
      const paid = await markOrderPaid(
        orderId,
        paymentIntent.id,
        order.total_amount,
      );
      return {
        orderId,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: Number(order.total_amount),
        publishableKey: env.stripe.publishableKey || null,
        ...paid,
      };
    }
  } else {
    paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      metadata: {
        orderId: String(orderId),
        userId: String(userId),
      },
      automatic_payment_methods: { enabled: true },
    });

    await pool.query(
      `INSERT INTO payments (order_id, provider, provider_payment_id, amount, currency, status)
       VALUES (?, 'STRIPE', ?, ?, 'USD', 'PENDING')`,
      [orderId, paymentIntent.id, order.total_amount],
    );
  }

  return {
    orderId,
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    amount: Number(order.total_amount),
    publishableKey: env.stripe.publishableKey || null,
  };
}

export async function confirmPayment(userId, { orderId, paymentIntentId }) {
  const oid = parseOrderId(orderId);
  const order = await getPayableOrder(userId, oid);

  if (!paymentIntentId) {
    throw new HttpError(400, "paymentIntentId is required");
  }

  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.metadata.orderId !== String(oid)) {
    throw new HttpError(400, "Payment intent does not match this order");
  }

  if (paymentIntent.metadata.userId !== String(userId)) {
    throw new HttpError(403, "Payment intent does not belong to this user");
  }

  const expectedCents = Math.round(Number(order.total_amount) * 100);
  if (paymentIntent.amount !== expectedCents) {
    throw new HttpError(400, "Payment amount does not match order total");
  }

  if (paymentIntent.status === "succeeded") {
    return markOrderPaid(oid, paymentIntent.id, order.total_amount);
  }

  if (
    paymentIntent.status === "requires_confirmation" ||
    paymentIntent.status === "requires_action"
  ) {
    throw new HttpError(
      402,
      "Payment requires additional customer action in Stripe",
    );
  }

  throw new HttpError(
    400,
    `Payment not completed (Stripe status: ${paymentIntent.status})`,
  );
}

export async function handleStripeWebhook(rawBody, signature) {
  if (!env.stripe.webhookSecret) {
    throw new HttpError(
      503,
      "STRIPE_WEBHOOK_SECRET is not configured on the server",
    );
  }

  const stripe = getStripe();
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    env.stripe.webhookSecret,
  );

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = Number(paymentIntent.metadata?.orderId);

    if (!orderId) {
      throw new HttpError(400, "Webhook missing orderId metadata");
    }

    await markOrderPaid(
      orderId,
      paymentIntent.id,
      paymentIntent.amount / 100,
    );
  }

  return { received: true, type: event.type };
}

/** Local dev only — mark PENDING order paid without Stripe keys */
export async function completePaymentInDev(userId, orderIdParam) {
  if (env.isProd) {
    throw new HttpError(403, "Dev payment completion is disabled in production");
  }

  if (env.stripe.isConfigured) {
    throw new HttpError(
      400,
      "Stripe is configured — use /api/payments/intent and Stripe.js instead",
    );
  }

  const orderId = parseOrderId(orderIdParam);
  const order = await getPayableOrder(userId, orderId);

  return markOrderPaid(
    orderId,
    `dev_${orderId}_${Date.now()}`,
    order.total_amount,
  );
}

export function getPaymentConfig() {
  return {
    stripeEnabled: env.stripe.isConfigured,
    publishableKey: env.stripe.publishableKey || null,
    devMode: !env.isProd && !env.stripe.isConfigured,
  };
}
