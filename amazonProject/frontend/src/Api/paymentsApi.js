import api from "./apiClient.js";

/** GET /api/payments/config */
export async function getPaymentConfig() {
  const { data } = await api.get("/payments/config");
  return data;
}

/** POST /api/payments/intent — body: { orderId } */
export async function createPaymentIntent({ orderId }) {
  const { data } = await api.post("/payments/intent", { orderId });
  return data;
}

/** POST /api/payments/confirm — body: { orderId, paymentIntentId } */
export async function confirmPayment({ orderId, paymentIntentId }) {
  const { data } = await api.post("/payments/confirm", {
    orderId,
    paymentIntentId,
  });
  return data;
}

/** POST /api/payments/dev-complete — local dev without Stripe keys */
export async function devCompletePayment({ orderId }) {
  const { data } = await api.post("/payments/dev-complete", { orderId });
  return data;
}
