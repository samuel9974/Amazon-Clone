import api, { clearAuthToken, setAuthToken } from "./apiClient.js";

/** POST /api/auth/login */
export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  setAuthToken(data.token);
  return data;
}

/** POST /api/auth/register */
export async function register({ email, password, fullName }) {
  const { data } = await api.post("/auth/register", {
    email,
    password,
    fullName,
  });
  setAuthToken(data.token);
  return data;
}

/** GET /api/auth/me */
export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export function logout() {
  clearAuthToken();
}
