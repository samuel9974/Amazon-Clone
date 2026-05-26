USE amazon_clone;

SELECT 'users' AS entity, COUNT(*) AS total FROM users
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews;

SELECT id, name, slug FROM categories ORDER BY id;
