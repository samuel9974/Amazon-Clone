-- ============================================================
--  Seed data — 4 categories, products, reviews
--  Applied by: mysql … < seed.sql  OR  GET http://localhost:5001/install
-- ============================================================

USE amazon_clone;

INSERT INTO users (email, password_hash, full_name, role) VALUES
  ('admin@amazon.local',
   '$2b$10$.u0sudvssBiyQn/dbYhBTe2TMc9mFWJP0Udi5qvvh8zWc2tUEop76',
   'Site Admin', 'ADMIN'),
  ('user@amazon.local',
   '$2b$10$6MlffLADNuLiXsujiV1UhuZ4j.InUjqPsXM2KVL3548mNBhBwktUq',
   'Demo User',  'USER');

-- 4 categories: Electronics, Jewelry, Men's & Women's Clothing
INSERT INTO categories (name, slug, image_url) VALUES
  ('Electronics', 'electronics',
   'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_TV_2X._SY304_CB4325179003_.jpg'),
  ('Jewelry', 'jewelry',
   'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'),
  ('Men''s Clothing', 'mens-clothing',
   'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'),
  ('Women''s Clothing', 'womens-clothing',
   'https://images-na.ssl-images-amazon.com/images/G/01/softlines/shopbop/ingress/2023/March/mp_20230219_ff_desktopsinglecategory_desktop_379x304_1._SY304_CBe163539047_.jpg');

-- Products: 1=Electronics, 2=Jewelry, 3=Men's, 4=Women's
INSERT INTO products (category_id, title, description, price, rating, stock, image_url) VALUES
  (1, 'Echo Dot (5th Gen) Smart Speaker',
   'Voice-controlled smart speaker with Alexa. Stream music and control smart home devices.',
   49.99, 5, 120,
   'https://images.unsplash.com/photo-1558002038-1055907df827?w=600'),
  (1, '4K Fire TV Stick',
   'Stream in 4K with Dolby Vision and Alexa voice remote included.',
   149.99, 4, 85,
   'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600'),
  (1, 'Wireless Noise-Cancelling Headphones',
   'Over-ear Bluetooth headphones with 30-hour battery life.',
   199.99, 4, 40,
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),

  (2, 'Sterling Silver Pendant Necklace',
   'Minimalist pendant on an 18-inch sterling silver chain.',
   89.99, 5, 45,
   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600'),
  (2, 'Classic Gold-Tone Watch',
   'Water-resistant analog watch with leather strap.',
   129.00, 4, 30,
   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
  (2, 'Pearl Stud Earrings Set',
   'Hypoallergenic faux-pearl studs for everyday wear.',
   34.99, 5, 80,
   'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'),

  (3, 'Men''s Classic Fit Cotton T-Shirt (Pack of 3)',
   'Soft breathable cotton tees in black, navy, and heather gray.',
   29.99, 4, 150,
   'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'),
  (3, 'Men''s Slim Fit Jeans',
   'Stretch denim with a modern slim fit and five-pocket styling.',
   54.99, 4, 90,
   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'),
  (3, 'Men''s Lightweight Bomber Jacket',
   'Versatile jacket for spring and fall. Zip front, side pockets.',
   79.99, 5, 55,
   'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'),

  (4, 'Women''s Floral Midi Dress',
   'Flowy A-line dress with short sleeves. Machine washable.',
   49.99, 5, 70,
   'https://images.unsplash.com/photo-1595777457583-95e059d58199?w=600'),
  (4, 'Women''s Crossbody Handbag',
   'Compact purse with adjustable strap and interior zip pocket.',
   44.99, 4, 65,
   'https://images.unsplash.com/photo-1548039185-0669ebb641a7?w=600'),
  (4, 'Women''s Casual Sneakers',
   'Lightweight lace-up sneakers with cushioned insole.',
   59.99, 4, 100,
   'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600');

INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
  (1, 2, 5, 'Setup took two minutes. Alexa responds quickly.'),
  (4, 2, 5, 'Beautiful necklace — exactly as pictured.'),
  (7, 2, 4, 'Great fit and comfortable fabric.'),
  (10, 2, 5, 'Love this dress for summer outings.'),
  (11, 1, 4, 'Perfect size crossbody for everyday use.');
