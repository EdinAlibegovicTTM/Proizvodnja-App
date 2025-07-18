-- Kreiranje tabela za Proizvodnja Premium aplikaciju

-- Tabela korisnika
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    permissions TEXT[], -- Array dozvola
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela kupaca
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    tax_number VARCHAR(20),
    discount_rate DECIMAL(5,2) DEFAULT 0,
    payment_terms VARCHAR(50),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela proizvoda
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    unit VARCHAR(10) DEFAULT 'kom',
    length DECIMAL(8,2),
    width DECIMAL(8,2),
    height DECIMAL(8,2),
    price DECIMAL(10,2),
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela ponuda
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    offer_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code VARCHAR(100),
    customer_id INTEGER REFERENCES customers(id),
    offer_date DATE NOT NULL,
    delivery_date DATE,
    payment_terms VARCHAR(100),
    parity VARCHAR(50),
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, rejected
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stavke ponude
CREATE TABLE offer_items (
    id SERIAL PRIMARY KEY,
    offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT
);

-- Tabela radnih naloga
CREATE TABLE work_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    offer_id INTEGER REFERENCES offers(id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, paused, completed, cancelled
    assigned_to INTEGER REFERENCES users(id),
    start_date DATE,
    due_date DATE,
    completion_date DATE,
    sort_order INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stavke radnih naloga
CREATE TABLE work_order_items (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER REFERENCES work_orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity DECIMAL(10,2) NOT NULL,
    completed_quantity DECIMAL(10,2) DEFAULT 0,
    notes TEXT
);

-- Tabela paketa (za QR kodove)
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    qr_code VARCHAR(100) UNIQUE NOT NULL,
    package_date DATE NOT NULL,
    work_order_id INTEGER REFERENCES work_orders(id),
    status VARCHAR(20) DEFAULT 'active', -- active, completed, processed
    location VARCHAR(50) DEFAULT 'production',
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stavke paketa
CREATE TABLE package_items (
    id SERIAL PRIMARY KEY,
    package_id INTEGER REFERENCES packages(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela trupaca
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    qr_code VARCHAR(100) UNIQUE NOT NULL,
    plate_number VARCHAR(20),
    plate_color VARCHAR(20),
    log_class VARCHAR(10),
    length DECIMAL(8,2) NOT NULL,
    diameter DECIMAL(8,2) NOT NULL,
    volume DECIMAL(8,3) NOT NULL,
    receipt_item_number INTEGER,
    measured_length DECIMAL(8,2),
    measured_diameter DECIMAL(8,2),
    measured_volume DECIMAL(8,3),
    volume_difference DECIMAL(8,3),
    status VARCHAR(20) DEFAULT 'in_stock', -- in_stock, in_processing, processed
    forestry VARCHAR(50),
    branch VARCHAR(50),
    department_number VARCHAR(20),
    carrier VARCHAR(50),
    receipt_number VARCHAR(50),
    receipt_date DATE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela procesa dorade
CREATE TABLE processing (
    id SERIAL PRIMARY KEY,
    process_date DATE NOT NULL,
    machine VARCHAR(50),
    start_time TIME,
    end_time TIME,
    pause_duration INTEGER DEFAULT 0, -- u minutima
    input_package_ids INTEGER[], -- Array ID-jeva ulaznih paketa
    output_package_id INTEGER
);

-- Tabela za audit trail (log aktivnosti)
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id),
    username VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip VARCHAR(50),
    location VARCHAR(100)
);
