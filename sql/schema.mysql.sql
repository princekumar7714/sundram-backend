-- Sundram Agri - MySQL schema (generated for Sequelize mapping)
-- Run this in your MySQL client after creating the database.

-- Example:
-- CREATE DATABASE sundram_agri;
-- USE sundram_agri;

SET FOREIGN_KEY_CHECKS = 0;

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  images JSON NULL,
  category VARCHAR(255) NULL,
  description TEXT NULL,
  stock INT NOT NULL DEFAULT 0,
  rating DECIMAL(5,2) NULL,
  numReviews INT NOT NULL DEFAULT 0,
  featured BOOLEAN NULL,
  discount DECIMAL(10,2) NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE,

  street VARCHAR(255) NULL,
  city VARCHAR(255) NULL,
  state VARCHAR(255) NULL,
  zipCode VARCHAR(50) NULL,
  country VARCHAR(255) NULL,

  phone VARCHAR(50) NULL,

  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_users_email (email),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- WISHLIST
CREATE TABLE IF NOT EXISTS wishlist (
  userId BIGINT UNSIGNED NOT NULL,
  productId BIGINT UNSIGNED NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userId, productId),
  CONSTRAINT fk_wishlist_user
    FOREIGN KEY (userId) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_wishlist_product
    FOREIGN KEY (productId) REFERENCES products (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  KEY idx_wishlist_productId (productId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ORDER ITEMS helper (optional). Keeping orderItems as JSON to match current structure.
-- If you prefer normalized tables later, we can refactor.


CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

  userId BIGINT UNSIGNED NOT NULL,
  orderItems JSON NULL,

  shipping_fullName VARCHAR(255) NULL,
  shipping_phone VARCHAR(50) NULL,
  shipping_address TEXT NULL,
  shipping_city VARCHAR(255) NULL,
  shipping_state VARCHAR(255) NULL,
  shipping_pincode VARCHAR(50) NULL,

  paymentMethod VARCHAR(50) NOT NULL DEFAULT 'COD',
  totalPrice DECIMAL(10,2) NOT NULL,

  isPaid BOOLEAN NOT NULL DEFAULT FALSE,
  paidAt DATETIME NULL,

  isDelivered BOOLEAN NOT NULL DEFAULT FALSE,
  deliveredAt DATETIME NULL,

  orderStatus VARCHAR(50) NOT NULL DEFAULT 'Pending',

  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (userId) REFERENCES users (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  KEY idx_orders_orderStatus (orderStatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

