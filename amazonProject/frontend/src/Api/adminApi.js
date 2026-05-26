import api from "./apiClient.js";

/** GET /api/admin/orders */
export async function getAdminOrders() {
  const { data } = await api.get("/admin/orders");
  return data;
}

/** PATCH /api/admin/orders/:orderId — body: { status } */
export async function updateOrderStatus(orderId, { status }) {
  const { data } = await api.patch(`/admin/orders/${orderId}`, { status });
  return data;
}

/** POST /api/admin/products */
export async function createProduct(product) {
  const { data } = await api.post("/admin/products", product);
  return data;
}

/** PUT /api/admin/products/:id */
export async function updateProduct(id, product) {
  const { data } = await api.put(`/admin/products/${id}`, product);
  return data;
}

/** DELETE /api/admin/products/:id */
export async function deleteProduct(id) {
  await api.delete(`/admin/products/${id}`);
}
