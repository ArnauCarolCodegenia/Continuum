CREATE TABLE facturas (
    invoice_id UUID PRIMARY KEY,
    hotel_name VARCHAR(255),
    hotel_city VARCHAR(255),
    country VARCHAR(255),
    tax_id VARCHAR(50),
    invoice_date DATE,
    check_in DATE,
    check_out DATE,
    nights INT,
    room_type VARCHAR(100),
    room_cost NUMERIC(10,2),
    breakfast_cost NUMERIC(10,2),
    minibar_cost NUMERIC(10,2),
    extras_total NUMERIC(10,2),
    tax_rate NUMERIC(5,2),
    tax_amount NUMERIC(10,2),
    total_amount NUMERIC(10,2),
    currency VARCHAR(10),
    payment_method VARCHAR(50),
    booking_channel VARCHAR(100),
    guest_name VARCHAR(255)
);

COPY facturas FROM '/docker-entrypoint-initdb.d/facturas_hoteles_1000.csv' DELIMITER ',' CSV HEADER;
