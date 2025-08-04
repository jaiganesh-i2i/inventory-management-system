# Database Schema Design

## 1. Entity Relationship Diagram (ERD)

### 1.1 High-Level ERD

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INVENTORY MANAGEMENT SYSTEM                          │
│                              DATABASE SCHEMA                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   USERS     │    │  CATEGORIES │    │  SUPPLIERS  │    │  WAREHOUSES │  │
│  │             │    │             │    │             │    │             │  │
│  │ id (PK)     │    │ id (PK)     │    │ id (PK)     │    │ id (PK)     │  │
│  │ username    │    │ name        │    │ name        │    │ name        │  │
│  │ email       │    │ description │    │ contact_info│    │ location    │  │
│  │ password_hash│   │ created_at  │    │ created_at  │    │ capacity    │  │
│  │ role        │    └─────────────┘    └─────────────┘    │ created_at  │  │
│  │ created_at  │             │                   │        └─────────────┘  │
│  └─────────────┘             │                   │                │        │
│         │                    │                   │                │        │
│         │                    │                   │                │        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │ AUDIT_LOGS  │    │   PRODUCTS  │    │  INVENTORY  │    │STOCK_ALERTS │  │
│  │             │    │             │    │             │    │             │  │
│  │ id (PK)     │    │ id (PK)     │    │ id (PK)     │    │ id (PK)     │  │
│  │ user_id (FK)│    │ name        │    │ product_id  │    │ product_id  │  │
│  │ action      │    │ description │    │ warehouse_id│    │ warehouse_id│  │
│  │ table_name  │    │ category_id │    │ quantity    │    │ alert_type  │  │
│  │ record_id   │    │ sku         │    │ min_threshold│   │ message     │  │
│  │ old_values  │    │ specifications│   │ created_at  │    │ is_acknowledged│
│  │ new_values  │    │ created_at  │    │ updated_at  │    │ created_at  │  │
│  │ created_at  │    │ updated_at  │    └─────────────┘    └─────────────┘  │
│  └─────────────┘    └─────────────┘             │                   │        │
│         │                    │                   │                   │        │
│         │                    │                   │                   │        │
│         │                    │                   │                   │        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │PURCHASE_    │    │PURCHASE_    │    │ INVENTORY_  │    │ INVENTORY_  │  │
│  │ ORDERS      │    │ORDER_ITEMS  │    │ TRANSACTIONS│    │ TRANSFERS   │  │
│  │             │    │             │    │             │    │             │  │
│  │ id (PK)     │    │ id (PK)     │    │ id (PK)     │    │ id (PK)     │  │
│  │ supplier_id │    │ order_id    │    │ product_id  │    │ product_id  │  │
│  │ status      │    │ product_id  │    │ warehouse_id│    │ from_warehouse│
│  │ total_amount│    │ quantity    │    │ transaction_type│ to_warehouse │  │
│  │ created_at  │    │ unit_price  │    │ quantity    │    │ quantity    │  │
│  │ updated_at  │    │ created_at  │    │ reference_id│    │ transfer_date│
│  └─────────────┘    └─────────────┘    │ created_at  │    │ created_at  │  │
│         │                   │          └─────────────┘    └─────────────┘  │
│         │                   │                                 │            │
│         └───────────────────┼─────────────────────────────────┘            │
│                             │                                               │
│                             │                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   REPORTS   │    │   REPORTS   │    │   REPORTS   │    │   REPORTS   │  │
│  │  INVENTORY  │    │  TURNOVER   │    │   SALES     │    │  ANALYTICS  │  │
│  │             │    │             │    │             │    │             │  │
│  │ id (PK)     │    │ id (PK)     │    │ id (PK)     │    │ id (PK)     │  │
│  │ report_date │    │ product_id  │    │ report_date │    │ metric_name │  │
│  │ total_items │    │ turnover_rate│   │ total_sales │    │ metric_value│  │
│  │ total_value │    │ period_start│    │ items_sold  │    │ report_date │  │
│  │ created_at  │    │ period_end  │    │ created_at  │    │ created_at  │  │
│  └─────────────┘    │ created_at  │    └─────────────┘    └─────────────┘  │
│                     └─────────────┘                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Relationship Mapping

#### **One-to-Many Relationships:**
- **Categories → Products**: One category can have many products
- **Suppliers → Purchase_Orders**: One supplier can have many purchase orders
- **Warehouses → Inventory**: One warehouse can have many inventory items
- **Products → Inventory**: One product can be in many warehouses
- **Products → Purchase_Order_Items**: One product can be in many order items
- **Purchase_Orders → Purchase_Order_Items**: One order can have many items
- **Users → Audit_Logs**: One user can generate many audit logs

#### **Many-to-Many Relationships:**
- **Products ↔ Warehouses**: Through Inventory table
- **Products ↔ Purchase_Orders**: Through Purchase_Order_Items table

## 2. Table Definitions

### 2.1 Core Tables

#### **USERS Table**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### **CATEGORIES Table**
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
```

#### **SUPPLIERS Table**
```sql
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    contact_info JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_suppliers_email ON suppliers(email);
```

#### **WAREHOUSES Table**
```sql
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500),
    address TEXT,
    capacity INTEGER,
    manager_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_warehouses_name ON warehouses(name);
CREATE INDEX idx_warehouses_manager_id ON warehouses(manager_id);
```

#### **PRODUCTS Table**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    specifications JSONB,
    unit_of_measure VARCHAR(50) DEFAULT 'piece',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
```

#### **INVENTORY Table**
```sql
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
    min_threshold INTEGER DEFAULT 0,
    max_threshold INTEGER,
    reserved_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id)
);

-- Indexes
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse_id ON inventory(warehouse_id);
CREATE INDEX idx_inventory_quantity ON inventory(quantity);
CREATE INDEX idx_inventory_low_stock ON inventory(product_id, warehouse_id) 
    WHERE quantity <= min_threshold;
```

### 2.2 Transaction Tables

#### **PURCHASE_ORDERS Table**
```sql
CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    status VARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'ordered', 'received', 'cancelled')),
    total_amount DECIMAL(10,2) DEFAULT 0,
    order_date DATE DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_purchase_orders_order_date ON purchase_orders(order_date);
CREATE INDEX idx_purchase_orders_order_number ON purchase_orders(order_number);
```

#### **PURCHASE_ORDER_ITEMS Table**
```sql
CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    received_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_purchase_order_items_order_id ON purchase_order_items(order_id);
CREATE INDEX idx_purchase_order_items_product_id ON purchase_order_items(product_id);
```

#### **INVENTORY_TRANSACTIONS Table**
```sql
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    transaction_type VARCHAR(50) NOT NULL 
        CHECK (transaction_type IN ('in', 'out', 'adjustment', 'transfer')),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50) 
        CHECK (reference_type IN ('purchase_order', 'transfer', 'adjustment', 'manual')),
    reference_id INTEGER,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_inventory_transactions_product_id ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_warehouse_id ON inventory_transactions(warehouse_id);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_inventory_transactions_created_at ON inventory_transactions(created_at);
```

#### **INVENTORY_TRANSFERS Table**
```sql
CREATE TABLE inventory_transfers (
    id SERIAL PRIMARY KEY,
    transfer_number VARCHAR(50) UNIQUE NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    from_warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    to_warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status VARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'in_transit', 'completed', 'cancelled')),
    transfer_date DATE DEFAULT CURRENT_DATE,
    expected_arrival_date DATE,
    actual_arrival_date DATE,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (from_warehouse_id != to_warehouse_id)
);

-- Indexes
CREATE INDEX idx_inventory_transfers_product_id ON inventory_transfers(product_id);
CREATE INDEX idx_inventory_transfers_from_warehouse ON inventory_transfers(from_warehouse_id);
CREATE INDEX idx_inventory_transfers_to_warehouse ON inventory_transfers(to_warehouse_id);
CREATE INDEX idx_inventory_transfers_status ON inventory_transfers(status);
```

### 2.3 Alert and Reporting Tables

#### **STOCK_ALERTS Table**
```sql
CREATE TABLE stock_alerts (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    alert_type VARCHAR(50) NOT NULL 
        CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock', 'expiry')),
    message TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_by INTEGER REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_stock_alerts_product_id ON stock_alerts(product_id);
CREATE INDEX idx_stock_alerts_warehouse_id ON stock_alerts(warehouse_id);
CREATE INDEX idx_stock_alerts_type ON stock_alerts(alert_type);
CREATE INDEX idx_stock_alerts_acknowledged ON stock_alerts(is_acknowledged);
```

#### **AUDIT_LOGS Table**
```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 2.4 Reporting Tables

#### **INVENTORY_REPORTS Table**
```sql
CREATE TABLE inventory_reports (
    id SERIAL PRIMARY KEY,
    report_date DATE NOT NULL,
    total_products INTEGER DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    total_value DECIMAL(15,2) DEFAULT 0,
    low_stock_items INTEGER DEFAULT 0,
    out_of_stock_items INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_inventory_reports_date ON inventory_reports(report_date);
```

#### **TURNOVER_REPORTS Table**
```sql
CREATE TABLE turnover_reports (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    beginning_quantity INTEGER DEFAULT 0,
    ending_quantity INTEGER DEFAULT 0,
    total_in INTEGER DEFAULT 0,
    total_out INTEGER DEFAULT 0,
    turnover_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_turnover_reports_product_id ON turnover_reports(product_id);
CREATE INDEX idx_turnover_reports_period ON turnover_reports(period_start, period_end);
```

## 3. Constraints and Relationships

### 3.1 Foreign Key Constraints

```sql
-- Add foreign key constraints with proper cascade rules
ALTER TABLE products 
    ADD CONSTRAINT fk_products_category 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE inventory 
    ADD CONSTRAINT fk_inventory_product 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE inventory 
    ADD CONSTRAINT fk_inventory_warehouse 
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE;

ALTER TABLE purchase_orders 
    ADD CONSTRAINT fk_purchase_orders_supplier 
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT;

ALTER TABLE purchase_order_items 
    ADD CONSTRAINT fk_purchase_order_items_order 
    FOREIGN KEY (order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE;

ALTER TABLE purchase_order_items 
    ADD CONSTRAINT fk_purchase_order_items_product 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;
```

### 3.2 Check Constraints

```sql
-- Ensure positive quantities
ALTER TABLE inventory 
    ADD CONSTRAINT chk_inventory_quantity_positive 
    CHECK (quantity >= 0);

ALTER TABLE inventory 
    ADD CONSTRAINT chk_inventory_reserved_positive 
    CHECK (reserved_quantity >= 0);

-- Ensure valid status values
ALTER TABLE purchase_orders 
    ADD CONSTRAINT chk_purchase_order_status 
    CHECK (status IN ('pending', 'approved', 'ordered', 'received', 'cancelled'));

-- Ensure transfer between different warehouses
ALTER TABLE inventory_transfers 
    ADD CONSTRAINT chk_transfer_different_warehouses 
    CHECK (from_warehouse_id != to_warehouse_id);
```

## 4. Indexes for Performance

### 4.1 Composite Indexes

```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_inventory_product_warehouse ON inventory(product_id, warehouse_id);
CREATE INDEX idx_purchase_orders_supplier_status ON purchase_orders(supplier_id, status);
CREATE INDEX idx_inventory_transactions_product_date ON inventory_transactions(product_id, created_at);
CREATE INDEX idx_stock_alerts_product_warehouse_type ON stock_alerts(product_id, warehouse_id, alert_type);
```

### 4.2 Partial Indexes

```sql
-- Partial indexes for active records
CREATE INDEX idx_products_active ON products(id) WHERE is_active = true;
CREATE INDEX idx_suppliers_active ON suppliers(id) WHERE is_active = true;
CREATE INDEX idx_warehouses_active ON warehouses(id) WHERE is_active = true;

-- Partial index for low stock alerts
CREATE INDEX idx_inventory_low_stock ON inventory(product_id, warehouse_id) 
    WHERE quantity <= min_threshold;
```

## 5. Triggers and Functions

### 5.1 Update Timestamp Trigger

```sql
-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5.2 Audit Log Trigger

```sql
-- Function to create audit logs
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
        VALUES (current_setting('app.current_user_id', true)::integer, 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
        VALUES (current_setting('app.current_user_id', true)::integer, 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values)
        VALUES (current_setting('app.current_user_id', true)::integer, 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Apply audit trigger to critical tables
CREATE TRIGGER audit_products_trigger AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_inventory_trigger AFTER INSERT OR UPDATE OR DELETE ON inventory
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

## 6. Views for Common Queries

### 6.1 Inventory Summary View

```sql
CREATE VIEW inventory_summary AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.sku,
    c.name as category_name,
    w.id as warehouse_id,
    w.name as warehouse_name,
    i.quantity,
    i.min_threshold,
    i.max_threshold,
    CASE 
        WHEN i.quantity <= i.min_threshold THEN 'Low Stock'
        WHEN i.quantity = 0 THEN 'Out of Stock'
        WHEN i.quantity >= i.max_threshold THEN 'Overstock'
        ELSE 'Normal'
    END as stock_status
FROM products p
JOIN inventory i ON p.id = i.product_id
JOIN warehouses w ON i.warehouse_id = w.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true AND w.is_active = true;
```

### 6.2 Low Stock Alerts View

```sql
CREATE VIEW low_stock_alerts_view AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.sku,
    w.id as warehouse_id,
    w.name as warehouse_name,
    i.quantity,
    i.min_threshold,
    (i.min_threshold - i.quantity) as shortage_amount
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN warehouses w ON i.warehouse_id = w.id
WHERE i.quantity <= i.min_threshold
    AND p.is_active = true 
    AND w.is_active = true;
```

## 7. Data Migration Strategy

### 7.1 Initial Data Setup

```sql
-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and components'),
('Clothing', 'Apparel and accessories'),
('Books', 'Books and publications'),
('Home & Garden', 'Home improvement and garden supplies'),
('Sports', 'Sports equipment and accessories');

-- Insert default admin user
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@inventory.com', '$2b$10$...', 'admin');

-- Insert sample warehouse
INSERT INTO warehouses (name, location, capacity) VALUES
('Main Warehouse', '123 Main St, City, State', 10000),
('Secondary Warehouse', '456 Oak Ave, City, State', 5000);
```

### 7.2 Migration Scripts

```sql
-- Migration script template
-- migration_001_initial_schema.sql

BEGIN;

-- Create tables
-- (All table creation SQL from above)

-- Create indexes
-- (All index creation SQL from above)

-- Create triggers
-- (All trigger creation SQL from above)

-- Create views
-- (All view creation SQL from above)

-- Insert initial data
-- (All initial data insertion SQL from above)

COMMIT;
```

---

**Document Version**: 1.0
**Last Updated**: 2024-12-19
**Next Review**: After Phase 1 completion 