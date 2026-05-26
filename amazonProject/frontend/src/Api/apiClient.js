import axios from "axios";
import { API_BASE } from "./endPoints.js";

/** localStorage key for JWT (Frontend Step 3+ uses AuthContext) */
export const AUTH_TOKEN_KEY = "amazon_token";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getAuthToken()) {
      clearAuthToken();
      // Frontend Step 3: AuthContext will listen for this event
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(normalizeApiError(error));
  },
);

/**
 * Backend errors: { message, statusCode }
 * Network errors: friendly message
 */
export function normalizeApiError(error) {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.code === "ERR_NETWORK") {
    return new Error(
      "Cannot reach the API. Start the backend (npm run dev in backend/) and ensure MySQL is running.",
    );
  }
  return error;
}

export async function checkApiHealth() {
  const { data } = await api.get("/health");
  return data;
}

export default api;
