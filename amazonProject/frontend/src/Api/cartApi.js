import api from "./apiClient.js";

/** GET /api/cart */
export async function getCart() {
  const { data } = await api.get("/cart");
  return data;
}

/** POST /api/cart — body: { productId, quantity } */
export async function addToCart({ productId, quantity = 1 }) {
  const { data } = await api.post("/cart", { productId, quantity });
  return data;
}

/** PATCH /api/cart/:productId — body: { quantity } */
export async function updateCartItem(productId, { quantity }) {
  const { data } = await api.patch(`/cart/${productId}`, { quantity });
  return data;
}

/** DELETE /api/cart/:productId */
export async function removeCartItem(productId) {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
}

/** Sum of line quantities (for header badge) */
export function getCartItemCount(cart) {
  if (!cart?.items?.length) return 0;
  return cart.items.reduce((sum, line) => sum + line.quantity, 0);
}
