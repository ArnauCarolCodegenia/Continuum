-- ============================================================
--  MOCK DATA SEED  –  company_a_db  (Company A: SolarTech Industries)
-- ============================================================

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    role        VARCHAR(50)         NOT NULL DEFAULT 'user',
    company     VARCHAR(150),
    created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, role, company, created_at) VALUES
  ('Liam Foster',      'liam@solartech.com',    'admin',   'SolarTech Industries', '2024-01-05 08:00:00'),
  ('Mia Collins',      'mia@solartech.com',     'user',    'SolarTech Industries', '2024-01-20 09:30:00'),
  ('Noah Turner',      'noah@solartech.com',    'user',    'SolarTech Industries', '2024-02-03 11:00:00'),
  ('Olivia Parker',    'olivia@solartech.com',  'manager', 'SolarTech Industries', '2024-02-18 14:45:00'),
  ('Parker Adams',     'parker@solartech.com',  'user',    'SolarTech Industries', '2024-03-07 10:20:00'),
  ('Quinn Baker',      'quinn@solartech.com',   'user',    'SolarTech Industries', '2024-03-22 16:15:00'),
  ('Rachel Evans',     'rachel@solartech.com',  'manager', 'SolarTech Industries', '2024-04-08 09:00:00'),
  ('Sam Mitchell',     'sam@solartech.com',     'user',    'SolarTech Industries', '2024-04-25 13:30:00'),
  ('Taylor Ross',      'taylor@solartech.com',  'user',    'SolarTech Industries', '2024-05-05 11:45:00'),
  ('Uma Stewart',      'uma@solartech.com',     'admin',   'SolarTech Industries', '2024-05-20 08:30:00');

-- ─── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150)        NOT NULL,
    category    VARCHAR(100)        NOT NULL,
    price       DECIMAL(10,2)       NOT NULL,
    stock       INT                 NOT NULL DEFAULT 0,
    created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, price, stock) VALUES
  ('Solar Panel 400W',          'Energy',      299.99,  50),
  ('Battery Pack 10kWh',        'Energy',      999.00,  20),
  ('Inverter 3kW',              'Energy',      449.95,  35),
  ('Solar Cable 10m',           'Cables',       18.50, 200),
  ('Mounting Bracket Set',      'Accessories',  55.00,  80),
  ('Charge Controller 60A',     'Energy',      129.00,  60),
  ('Smart Energy Monitor',      'Electronics', 189.99,  45),
  ('Junction Box IP68',         'Accessories',  22.00, 150),
  ('DC Circuit Breaker 40A',    'Electrical',   34.00, 100),
  ('Solar Optimiser Kit',       'Energy',       89.99,  40);

-- ─── ORDERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT            NOT NULL,
    total       DECIMAL(10,2)  NOT NULL,
    status      VARCHAR(50)    NOT NULL DEFAULT 'pending',
    created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO orders (user_id, total, status, created_at) VALUES
  (2,  318.49,  'completed', '2024-02-05 10:00:00'),
  (3,  999.00,  'completed', '2024-02-15 14:30:00'),
  (5,  467.95,  'shipped',   '2024-03-14 09:15:00'),
  (2,   55.00,  'completed', '2024-03-25 16:45:00'),
  (6,  129.00,  'completed', '2024-04-08 11:00:00'),
  (8,   56.50,  'cancelled', '2024-04-20 13:20:00'),
  (9,  189.99,  'shipped',   '2024-05-06 08:45:00'),
  (3,  323.99,  'pending',   '2024-05-22 17:30:00'),
  (4,  449.95,  'processing','2024-06-03 10:10:00'),
  (7,   89.99,  'completed', '2024-06-12 12:00:00');

-- ─── ORDER ITEMS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT            NOT NULL,
    product_id  INT            NOT NULL,
    quantity    INT            NOT NULL DEFAULT 1,
    unit_price  DECIMAL(10,2)  NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1,  1, 1, 299.99),
  (1,  4, 1,  18.50),
  (2,  2, 1, 999.00),
  (3,  3, 1, 449.95),
  (3,  4, 1,  18.50),
  (4,  5, 1,  55.00),
  (5,  6, 1, 129.00),
  (6,  4, 2,  18.50),
  (6,  8, 1,  22.00),
  (7,  7, 1, 189.99),
  (8,  1, 1, 299.99),
  (8,  8, 1,  22.00),
  (9,  3, 1, 449.95),
  (10,10, 1,  89.99);

-- ─── AUDIT LOG ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT             NULL,
    action      VARCHAR(200)    NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO audit_log (user_id, action, created_at) VALUES
  (1, 'Created product: Solar Panel 400W',          '2024-01-05 08:15:00'),
  (1, 'Created product: Battery Pack 10kWh',        '2024-01-05 08:20:00'),
  (2, 'Placed order #1',                            '2024-02-05 10:00:00'),
  (3, 'Placed order #2',                            '2024-02-15 14:30:00'),
  (10,'Updated stock for Inverter 3kW',             '2024-03-01 09:00:00'),
  (5, 'Placed order #3',                            '2024-03-14 09:15:00'),
  (2, 'Placed order #4',                            '2024-03-25 16:45:00'),
  (8, 'Cancelled order #6',                         '2024-04-21 08:00:00'),
  (1, 'Granted admin role to uma@solartech.com',    '2024-05-20 09:00:00'),
  (4, 'Placed order #9',                            '2024-06-03 10:10:00');
