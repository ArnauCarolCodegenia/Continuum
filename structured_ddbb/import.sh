#!/bin/sh
# ============================================================
#  import.sh  –  Pull data from MySQL (Company A) and
#                PostgreSQL 2 (Company B) into mockdb
# ============================================================
set -e

# ── Connection config ────────────────────────────────────────
MOCKDB_HOST="${MOCKDB_HOST:-postgres}"
MOCKDB_PORT="${MOCKDB_PORT:-5432}"
MOCKDB_USER="${MOCKDB_USER:-admin}"
MOCKDB_PASS="${MOCKDB_PASS:-admin1234}"
MOCKDB_NAME="${MOCKDB_NAME:-mockdb}"

MYSQL_HOST="${MYSQL_HOST:-mysql}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_USER="${MYSQL_USER:-admin}"
MYSQL_PASS="${MYSQL_PASS:-admin1234}"
MYSQL_DB="${MYSQL_DB:-company_a_db}"

PG2_HOST="${PG2_HOST:-postgres2}"
PG2_PORT="${PG2_PORT:-5432}"
PG2_USER="${PG2_USER:-admin}"
PG2_PASS="${PG2_PASS:-admin1234}"
PG2_DB="${PG2_DB:-company_b_db}"

export PGPASSWORD="$MOCKDB_PASS"

echo "========================================"
echo " Import started: $(date)"
echo "========================================"

# ── Helper: run SQL on mockdb ────────────────────────────────
mockdb() {
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" -c "$1"
}

# ─────────────────────────────────────────────────────────────
#  1. Truncate mockdb (preserves schema, clears all rows)
# ─────────────────────────────────────────────────────────────
echo ">> Truncating mockdb tables..."
mockdb "TRUNCATE TABLE audit_log, order_items, orders, products, users RESTART IDENTITY CASCADE;"

echo ">> Tables truncated."

# ─────────────────────────────────────────────────────────────
#  2. Import from MySQL – Company A (SolarTech Industries)
# ─────────────────────────────────────────────────────────────
echo ">> Importing from MySQL (Company A: SolarTech Industries)..."

mysql_query() {
  mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" -sN -e "$1"
}

# -- Users
mysql_query "SELECT name, email, role, company, created_at FROM users ORDER BY id;" | \
while IFS=$'\t' read -r name email role company created_at; do
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO users (name, email, role, company, created_at) VALUES ('$(echo "$name" | sed "s/'/''/g")', '$(echo "$email" | sed "s/'/''/g")', '$(echo "$role" | sed "s/'/''/g")', '$(echo "$company" | sed "s/'/''/g")', '$created_at') ON CONFLICT (email) DO NOTHING;"
done
echo "   Users (Company A) done."

# -- Products (company-specific, offset IDs handled by SERIAL)
mysql_query "SELECT name, category, price, stock FROM products ORDER BY id;" | \
while IFS=$'\t' read -r name category price stock; do
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO products (name, category, price, stock) VALUES ('$(echo "$name" | sed "s/'/''/g")', '$(echo "$category" | sed "s/'/''/g")', $price, $stock);"
done
echo "   Products (Company A) done."

# -- Orders: map source user_id to mockdb user_id via email
mysql_query "
  SELECT u.email, o.total, o.status, o.created_at
  FROM orders o JOIN users u ON o.user_id = u.id
  ORDER BY o.id;
" | \
while IFS=$'\t' read -r email total status created_at; do
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO orders (user_id, total, status, created_at)
        SELECT id, $total, '$(echo "$status" | sed "s/'/''/g")', '$created_at'
        FROM users WHERE email = '$(echo "$email" | sed "s/'/''/g")';"
done
echo "   Orders (Company A) done."

# -- Order items: map via email + position offsets
# We use a temp approach: export with product name, re-map by product name
mysql_query "
  SELECT o.id, p.name, oi.quantity, oi.unit_price, u.email, o.created_at
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.id
  JOIN products p ON oi.product_id = p.id
  JOIN users u ON o.user_id = u.id
  ORDER BY oi.id;
" | \
while IFS=$'\t' read -r src_order_id product_name quantity unit_price user_email order_date; do
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        SELECT o.id, p.id, $quantity, $unit_price
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN products p ON p.name = '$(echo "$product_name" | sed "s/'/''/g")'
        WHERE u.email = '$(echo "$user_email" | sed "s/'/''/g")'
          AND o.created_at = '$order_date'
          AND o.total IS NOT NULL
        LIMIT 1;"
done
echo "   Order items (Company A) done."

# -- Audit log
mysql_query "
  SELECT u.email, al.action, al.created_at
  FROM audit_log al LEFT JOIN users u ON al.user_id = u.id
  ORDER BY al.id;
" | \
while IFS=$'\t' read -r email action created_at; do
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO audit_log (user_id, action, created_at)
        SELECT id, '$(echo "$action" | sed "s/'/''/g")', '$created_at'
        FROM users WHERE email = '$(echo "$email" | sed "s/'/''/g")';"
done
echo "   Audit log (Company A) done."

# ─────────────────────────────────────────────────────────────
#  3. Import from PostgreSQL 2 – Company B (NorthStar Logistics)
# ─────────────────────────────────────────────────────────────
echo ">> Importing from PostgreSQL 2 (Company B: NorthStar Logistics)..."

export PGPASSWORD="$PG2_PASS"
pg2_query() {
  psql -h "$PG2_HOST" -p "$PG2_PORT" -U "$PG2_USER" -d "$PG2_DB" -tA -F $'\t' -c "$1"
}

export PGPASSWORD="$MOCKDB_PASS"

# -- Users
export PGPASSWORD="$PG2_PASS"
pg2_query "SELECT name, email, role, company, created_at FROM users ORDER BY id;" | \
while IFS=$'\t' read -r name email role company created_at; do
  export PGPASSWORD="$MOCKDB_PASS"
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO users (name, email, role, company, created_at) VALUES ('$(echo "$name" | sed "s/'/''/g")', '$(echo "$email" | sed "s/'/''/g")', '$(echo "$role" | sed "s/'/''/g")', '$(echo "$company" | sed "s/'/''/g")', '$created_at') ON CONFLICT (email) DO NOTHING;"
  export PGPASSWORD="$PG2_PASS"
done
export PGPASSWORD="$MOCKDB_PASS"
echo "   Users (Company B) done."

# -- Products
export PGPASSWORD="$PG2_PASS"
pg2_query "SELECT name, category, price, stock FROM products ORDER BY id;" | \
while IFS=$'\t' read -r name category price stock; do
  export PGPASSWORD="$MOCKDB_PASS"
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO products (name, category, price, stock) VALUES ('$(echo "$name" | sed "s/'/''/g")', '$(echo "$category" | sed "s/'/''/g")', $price, $stock);"
  export PGPASSWORD="$PG2_PASS"
done
export PGPASSWORD="$MOCKDB_PASS"
echo "   Products (Company B) done."

# -- Orders
export PGPASSWORD="$PG2_PASS"
pg2_query "
  SELECT u.email, o.total, o.status, o.created_at
  FROM orders o JOIN users u ON o.user_id = u.id
  ORDER BY o.id;
" | \
while IFS=$'\t' read -r email total status created_at; do
  export PGPASSWORD="$MOCKDB_PASS"
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO orders (user_id, total, status, created_at)
        SELECT id, $total, '$(echo "$status" | sed "s/'/''/g")', '$created_at'
        FROM users WHERE email = '$(echo "$email" | sed "s/'/''/g")';"
  export PGPASSWORD="$PG2_PASS"
done
export PGPASSWORD="$MOCKDB_PASS"
echo "   Orders (Company B) done."

# -- Order items
export PGPASSWORD="$PG2_PASS"
pg2_query "
  SELECT o.id, p.name, oi.quantity, oi.unit_price, u.email, o.created_at
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.id
  JOIN products p ON oi.product_id = p.id
  JOIN users u ON o.user_id = u.id
  ORDER BY oi.id;
" | \
while IFS=$'\t' read -r src_order_id product_name quantity unit_price user_email order_date; do
  export PGPASSWORD="$MOCKDB_PASS"
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        SELECT o.id, p.id, $quantity, $unit_price
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN products p ON p.name = '$(echo "$product_name" | sed "s/'/''/g")'
        WHERE u.email = '$(echo "$user_email" | sed "s/'/''/g")'
          AND o.created_at = '$order_date'
        LIMIT 1;"
  export PGPASSWORD="$PG2_PASS"
done
export PGPASSWORD="$MOCKDB_PASS"
echo "   Order items (Company B) done."

# -- Audit log
export PGPASSWORD="$PG2_PASS"
pg2_query "
  SELECT u.email, al.action, al.created_at
  FROM audit_log al LEFT JOIN users u ON al.user_id = u.id
  ORDER BY al.id;
" | \
while IFS=$'\t' read -r email action created_at; do
  export PGPASSWORD="$MOCKDB_PASS"
  psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
    -c "INSERT INTO audit_log (user_id, action, created_at)
        SELECT id, '$(echo "$action" | sed "s/'/''/g")', '$created_at'
        FROM users WHERE email = '$(echo "$email" | sed "s/'/''/g")';"
  export PGPASSWORD="$PG2_PASS"
done
export PGPASSWORD="$MOCKDB_PASS"
echo "   Audit log (Company B) done."

# ─────────────────────────────────────────────────────────────
#  4. Summary
# ─────────────────────────────────────────────────────────────
echo ""
echo ">> Import complete. Summary:"
psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
  -c "SELECT company, COUNT(*) AS users FROM users GROUP BY company ORDER BY company;"
psql -h "$MOCKDB_HOST" -p "$MOCKDB_PORT" -U "$MOCKDB_USER" -d "$MOCKDB_NAME" \
  -c "SELECT 'products' AS tbl, COUNT(*) FROM products UNION ALL SELECT 'orders', COUNT(*) FROM orders UNION ALL SELECT 'order_items', COUNT(*) FROM order_items UNION ALL SELECT 'audit_log', COUNT(*) FROM audit_log;"
echo "========================================"
echo " Import finished: $(date)"
echo "========================================"
