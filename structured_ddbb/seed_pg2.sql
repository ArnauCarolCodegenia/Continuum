-- ============================================================
--  MOCK DATA SEED  –  company_b_db  (Company B: NorthStar Logistics)
-- ============================================================

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    role        VARCHAR(50)         NOT NULL DEFAULT 'user',
    company     VARCHAR(150),
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

INSERT INTO users (name, email, role, company, created_at) VALUES
  ('Victor Lane',      'victor@northstar.com',   'admin',   'NorthStar Logistics', '2024-01-08 08:00:00'),
  ('Wendy Stone',      'wendy@northstar.com',    'user',    'NorthStar Logistics', '2024-01-22 09:30:00'),
  ('Xander Reed',      'xander@northstar.com',   'user',    'NorthStar Logistics', '2024-02-06 11:00:00'),
  ('Yara Brooks',      'yara@northstar.com',     'manager', 'NorthStar Logistics', '2024-02-20 14:45:00'),
  ('Zach Price',       'zach@northstar.com',     'user',    'NorthStar Logistics', '2024-03-09 10:20:00'),
  ('Amber Griffin',    'amber@northstar.com',    'user',    'NorthStar Logistics', '2024-03-24 16:15:00'),
  ('Blake Simmons',    'blake@northstar.com',    'manager', 'NorthStar Logistics', '2024-04-10 09:00:00'),
  ('Chloe Hayes',      'chloe@northstar.com',    'user',    'NorthStar Logistics', '2024-04-27 13:30:00'),
  ('Dylan Ford',       'dylan@northstar.com',    'user',    'NorthStar Logistics', '2024-05-08 11:45:00'),
  ('Elena Ward',       'elena@northstar.com',    'admin',   'NorthStar Logistics', '2024-05-22 08:30:00');

-- ─── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150)        NOT NULL,
    category    VARCHAR(100)        NOT NULL,
    price       NUMERIC(10,2)       NOT NULL,
    stock       INT                 NOT NULL DEFAULT 0,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

INSERT INTO products (name, category, price, stock) VALUES
  ('Pallet Jack 3T',            'Logistics',   450.00,  15),
  ('Barcode Scanner',           'Electronics',  89.99,  60),
  ('Thermal Label Printer',     'Electronics', 149.00,  40),
  ('Stretch Wrap 500m',         'Supplies',     24.50, 300),
  ('Hard Hat ANSI',             'Safety',       18.99, 200),
  ('Safety Vest Hi-Vis',        'Safety',       12.50, 250),
  ('Steel Toe Boots',           'Safety',       79.95,  90),
  ('Shipping Scale 150kg',      'Logistics',   199.00,  30),
  ('Forklift Fork Extension',   'Logistics',   220.00,  10),
  ('Warehouse Shelving 2m',     'Furniture',   159.00,  50);

-- ─── ORDERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id          SERIAL PRIMARY KEY,
    user_id     INT             NOT NULL REFERENCES users(id),
    total       NUMERIC(10,2)   NOT NULL,
    status      VARCHAR(50)     NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

INSERT INTO orders (user_id, total, status, created_at) VALUES
  (2,  539.99,  'completed', '2024-02-08 10:00:00'),
  (3,   89.99,  'completed', '2024-02-18 14:30:00'),
  (5,  461.50,  'shipped',   '2024-03-16 09:15:00'),
  (2,   24.50,  'completed', '2024-03-28 16:45:00'),
  (6,  149.00,  'completed', '2024-04-12 11:00:00'),
  (8,   31.49,  'cancelled', '2024-04-22 13:20:00'),
  (9,  199.00,  'shipped',   '2024-05-09 08:45:00'),
  (3,  229.95,  'pending',   '2024-05-25 17:30:00'),
  (4,  450.00,  'processing','2024-06-05 10:10:00'),
  (7,  159.00,  'completed', '2024-06-14 12:00:00');

-- ─── ORDER ITEMS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INT             NOT NULL REFERENCES orders(id),
    product_id  INT             NOT NULL REFERENCES products(id),
    quantity    INT             NOT NULL DEFAULT 1,
    unit_price  NUMERIC(10,2)   NOT NULL
);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1,  2, 1,  89.99),
  (1,  1, 1, 450.00),
  (2,  2, 1,  89.99),
  (3,  5, 2,  18.99),
  (3,  7, 1,  79.95),
  (3,  4, 3,  24.50),
  (4,  4, 1,  24.50),
  (5,  3, 1, 149.00),
  (6,  6, 1,  12.50),
  (6,  5, 1,  18.99),
  (7,  8, 1, 199.00),
  (8,  7, 1,  79.95),
  (8,  3, 1, 149.00),
  (9,  1, 1, 450.00),
  (10,10, 1, 159.00);

-- ─── AUDIT LOG ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
    id          SERIAL PRIMARY KEY,
    user_id     INT             REFERENCES users(id),
    action      VARCHAR(200)    NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

INSERT INTO audit_log (user_id, action, created_at) VALUES
  (1, 'Created product: Pallet Jack 3T',              '2024-01-08 08:15:00'),
  (1, 'Created product: Barcode Scanner',             '2024-01-08 08:20:00'),
  (2, 'Placed order #1',                              '2024-02-08 10:00:00'),
  (3, 'Placed order #2',                              '2024-02-18 14:30:00'),
  (10,'Updated stock for Thermal Label Printer',      '2024-03-01 09:00:00'),
  (5, 'Placed order #3',                              '2024-03-16 09:15:00'),
  (2, 'Placed order #4',                              '2024-03-28 16:45:00'),
  (8, 'Cancelled order #6',                           '2024-04-23 08:00:00'),
  (1, 'Granted admin role to elena@northstar.com',    '2024-05-22 09:00:00'),
  (4, 'Placed order #9',                              '2024-06-05 10:10:00');
