/**
 * Your Express API — all catalog data comes from MySQL (not Fake Store).
 */
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

/** One-time database setup (creates tables + seed) */
export const INSTALL_URL =
  import.meta.env.VITE_INSTALL_URL || "http://localhost:5001/install";
