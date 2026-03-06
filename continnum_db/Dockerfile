FROM postgres:16

# Copy initialization script and the CSV file
COPY init_facturas.sql /docker-entrypoint-initdb.d/1_init.sql
COPY facturas_hoteles_1000.csv /docker-entrypoint-initdb.d/facturas_hoteles_1000.csv
