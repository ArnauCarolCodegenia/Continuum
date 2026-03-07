CREATE TABLE facturas (
    id_factura UUID PRIMARY KEY,
    nombre_hotel VARCHAR(255),
    ciudad VARCHAR(255),
    pais VARCHAR(255),
    fecha_factura DATE,
    check_in DATE,
    check_out DATE,
    noches INT,
    tipo_habitacion VARCHAR(100),
    precio_habitacion NUMERIC(10,2),
    minibar_cost NUMERIC(10,2),
    precio_total NUMERIC(10,2),
    moneda VARCHAR(10),
    forma_pago VARCHAR(50),
    canal_reserva VARCHAR(100),
    nombre_usuario VARCHAR(255),
    rating INT,
    observaciones TEXT
);

COPY facturas FROM '/docker-entrypoint-initdb.d/facturas_hoteles_1000.csv' DELIMITER ',' CSV HEADER;
