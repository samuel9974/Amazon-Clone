/** Maps a DB row to the shape expected by the React product cards. */
export function mapProduct(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    image: row.image_url,
    category: row.category_slug ?? null,
    rating: {
      rate: Number(row.rating),
      count: Number(row.review_count ?? 0),
    },
    stock: row.stock,
  };
}

export function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    imageUrl: row.image_url,
    title: row.name,
    imglink: row.image_url,
  };
}
