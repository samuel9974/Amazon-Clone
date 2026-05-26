import {
  completePaymentInDev,
  confirmPayment,
  createPaymentIntent,
  getPaymentConfig,
  handleStripeWebhook,
} from "../services/payment.service.js";
import { HttpError } from "../utils/httpError.js";

export async function getConfig(req, res) {
  res.json(getPaymentConfig());
}

export async function createIntent(req, res) {
  const { orderId } = req.body;
  if (!orderId) {
    throw new HttpError(400, "orderId is required");
  }
  const result = await createPaymentIntent(req.user.id, orderId);
  res.status(201).json(result);
}

export async function confirm(req, res) {
  const result = await confirmPayment(req.user.id, req.body);
  res.json(result);
}

export async function devComplete(req, res) {
  const { orderId } = req.body;
  if (!orderId) {
    throw new HttpError(400, "orderId is required");
  }
  const result = await completePaymentInDev(req.user.id, orderId);
  res.json(result);
}

export async function stripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    throw new HttpError(400, "Missing stripe-signature header");
  }

  const result = await handleStripeWebhook(req.body, signature);
  res.json(result);
}
