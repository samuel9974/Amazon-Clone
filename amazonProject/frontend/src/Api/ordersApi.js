import api from "./apiClient.js";

/** POST /api/orders — body: { shippingAddress } */
export async function createOrder({ shippingAddress }) {
  const { data } = await api.post("/orders", { shippingAddress });
  return data;
}

/** GET /api/orders */
export async function getOrders() {
  const { data } = await api.get("/orders");
  return data;
}

/** GET /api/orders/:orderId */
export async function getOrderById(orderId) {
  const { data } = await api.get(`/orders/${orderId}`);
  return data;
}
