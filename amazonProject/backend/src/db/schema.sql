-- ============================================================
--  Amazon Clone — MySQL schema (Step 1)
--  Source of truth for catalog, users, cart, orders, payments.
--
--  Run from backend folder:
--    mysql -u root -p < src/db/schema.sql
--  Then seed:
--    mysql -u root -p amazon_clone < src/db/seed.sql
-- ============================================================

DROP DATABASE IF EXISTS amazon_clone;
CREATE DATABASE amazon_clone
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE amazon_clone;

-- ------------------------------------------------------------
--  1. users
--  Customer and admin accounts (JWT auth in later steps).
-- ------------------------------------------------------------
CREATE TABLE users (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(190)    NOT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  full_name     VARCHAR(120)    NULL,
  role          ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
  enabled       TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  2. categories
--  Catalog navigation; slug used in URLs (/category/electronics).
--  image_url drives landing-page category cards (no hard-coded JS).
-- ------------------------------------------------------------
CREATE TABLE categories (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name       VARCHAR(120)    NOT NULL,
  slug       VARCHAR(140)    NOT NULL,
  image_url  VARCHAR(500)    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_categories_slug (slug)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  3. products
--  All product listings come from this table (not Fake Store API).
-- ------------------------------------------------------------
CREATE TABLE products (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id  BIGINT UNSIGNED NULL,
  title        VARCHAR(255)    NOT NULL,
  description  TEXT            NULL,
  price        DECIMAL(10,2)   NOT NULL,
  rating       TINYINT         NOT NULL DEFAULT 5,
  stock        INT             NOT NULL DEFAULT 0,
  image_url    VARCHAR(500)    NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_category (category_id),
  KEY idx_products_title (title(100)),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL,
  CONSTRAINT chk_products_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT chk_products_stock CHECK (stock >= 0)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  4. reviews
--  Per-user product reviews; supports rating display on detail pages.
-- ------------------------------------------------------------
CREATE TABLE reviews (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  user_id    BIGINT UNSIGNED NOT NULL,
  rating     TINYINT         NOT NULL,
  comment    TEXT            NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_reviews_user_product (user_id, product_id),
  KEY idx_reviews_product (product_id),
  CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  5. cart_items
--  Server-persisted cart (one row per user + product).
-- ------------------------------------------------------------
CREATE TABLE cart_items (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  quantity   INT             NOT NULL DEFAULT 1,
  added_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cart_user_product (user_id, product_id),
  CONSTRAINT fk_cart_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT chk_cart_quantity CHECK (quantity >= 1)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  6. orders
--  Checkout header — one row per purchase.
-- ------------------------------------------------------------
CREATE TABLE orders (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id           BIGINT UNSIGNED NOT NULL,
  total_amount      DECIMAL(10,2)   NOT NULL,
  status            ENUM('PENDING','PAID','SHIPPED','CANCELLED')
                                    NOT NULL DEFAULT 'PENDING',
  shipping_address  VARCHAR(500)    NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (status),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  7. order_items
--  Snapshotted line items (price/title frozen at checkout time).
-- ------------------------------------------------------------
CREATE TABLE order_items (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id      BIGINT UNSIGNED NOT NULL,
  product_id    BIGINT UNSIGNED NULL,
  product_title VARCHAR(255)    NOT NULL,
  unit_price    DECIMAL(10,2)   NOT NULL,
  quantity      INT             NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT chk_order_items_quantity CHECK (quantity >= 1)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  8. payments
--  Money movement separate from order fulfillment (Stripe in Step 7).
-- ------------------------------------------------------------
CREATE TABLE payments (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id            BIGINT UNSIGNED NOT NULL,
  provider            VARCHAR(50)     NOT NULL DEFAULT 'STRIPE',
  provider_payment_id VARCHAR(255)    NULL,
  amount              DECIMAL(10,2)   NOT NULL,
  currency            CHAR(3)         NOT NULL DEFAULT 'USD',
  status              ENUM('PENDING','SUCCEEDED','FAILED','REFUNDED')
                                      NOT NULL DEFAULT 'PENDING',
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_payments_order (order_id),
  KEY idx_payments_status (status),
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
