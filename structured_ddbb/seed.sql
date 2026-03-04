-- ============================================================
--  MOCK DATA SEED  –  mockdb
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

-- ─── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150)        NOT NULL,
    category    VARCHAR(100)        NOT NULL,
    price       NUMERIC(10,2)       NOT NULL,
    stock       INT                 NOT NULL DEFAULT 0,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ─── ORDERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id          SERIAL PRIMARY KEY,
    user_id     INT             NOT NULL REFERENCES users(id),
    total       NUMERIC(10,2)   NOT NULL,
    status      VARCHAR(50)     NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ─── ORDER ITEMS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INT             NOT NULL REFERENCES orders(id),
    product_id  INT             NOT NULL REFERENCES products(id),
    quantity    INT             NOT NULL DEFAULT 1,
    unit_price  NUMERIC(10,2)   NOT NULL
);

-- ─── AUDIT LOG ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
    id          SERIAL PRIMARY KEY,
    user_id     INT             REFERENCES users(id),
    action      VARCHAR(200)    NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);
