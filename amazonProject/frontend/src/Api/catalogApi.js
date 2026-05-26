import axios from "axios";
import { API_BASE } from "./endPoints.js";

const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

export async function fetchAllProducts() {
  const { data } = await api.get("/products", { params: { size: 100 } });
  return data.items;
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function fetchProductsByCategory(slug) {
  const { data } = await api.get("/products", {
    params: { category: slug, size: 100 },
  });
  return data.items;
}

/**
 * GET /api/categories — maps MySQL rows to the same shape as categoryFullInfos.js
 * { title, name, imglink } so Category.jsx and CatagoryCard stay unchanged.
 */
export async function fetchCategories() {
  const { data } = await api.get("/categories");
  const list = Array.isArray(data) ? data : [];
  return list.map((row) => ({
    title: row.title ?? row.name,
    name: row.slug ?? row.name,
    imglink: row.imglink ?? row.imageUrl ?? row.image_url,
  }));
}
