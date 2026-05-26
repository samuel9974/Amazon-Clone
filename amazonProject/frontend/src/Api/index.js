/**
 * API layer — single entry for backend calls (Frontend Step 1).
 * Pages should import from here or from specific *Api.js files.
 */

export { API_BASE, INSTALL_URL } from "./endPoints.js";

export {
  default as api,
  AUTH_TOKEN_KEY,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  checkApiHealth,
  normalizeApiError,
} from "./apiClient.js";

export * as catalogApi from "./catalogApi.js";
export * as authApi from "./authApi.js";
export * as cartApi from "./cartApi.js";
export * as ordersApi from "./ordersApi.js";
export * as paymentsApi from "./paymentsApi.js";
export * as adminApi from "./adminApi.js";

export {
  fetchAllProducts,
  fetchProductById,
  fetchProductsByCategory,
  fetchCategories,
} from "./catalogApi.js";

export { login, register, getMe, logout } from "./authApi.js";

export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  getCartItemCount,
} from "./cartApi.js";

export { createOrder, getOrders, getOrderById } from "./ordersApi.js";

export {
  getPaymentConfig,
  createPaymentIntent,
  confirmPayment,
  devCompletePayment,
} from "./paymentsApi.js";

export {
  getAdminOrders,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./adminApi.js";
