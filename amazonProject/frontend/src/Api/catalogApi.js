import api from "./apiClient.js";

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
 * GET /api/categories — maps API rows for Category.jsx / CatagoryCard
 * { title, name, imglink }
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
