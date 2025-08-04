-- Database Triggers and Functions Migration
-- Inventory Management System
-- Version: 1.1
-- Date: 2024-12-19

BEGIN;

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to create audit logs
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values, created_at)
        VALUES (COALESCE(current_setting('app.current_user_id', true)::integer, NULL), 
                'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, created_at)
        VALUES (COALESCE(current_setting('app.current_user_id', true)::integer, NULL), 
                'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, created_at)
        VALUES (COALESCE(current_setting('app.current_user_id', true)::integer, NULL), 
                'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD), CURRENT_TIMESTAMP);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'PO-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || 
                           lpad(nextval('purchase_orders_id_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate transfer numbers
CREATE OR REPLACE FUNCTION generate_transfer_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transfer_number IS NULL OR NEW.transfer_number = '' THEN
        NEW.transfer_number := 'TR-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || 
                              lpad(nextval('inventory_transfers_id_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to check inventory availability
CREATE OR REPLACE FUNCTION check_inventory_availability()
RETURNS TRIGGER AS $$
DECLARE
    current_quantity INTEGER;
BEGIN
    -- Get current inventory quantity
    SELECT quantity INTO current_quantity
    FROM inventory
    WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id;
    
    -- If inventory doesn't exist, create it with 0 quantity
    IF current_quantity IS NULL THEN
        INSERT INTO inventory (product_id, warehouse_id, quantity, min_threshold)
        VALUES (NEW.product_id, NEW.warehouse_id, 0, 0);
        current_quantity := 0;
    END IF;
    
    -- Check if there's enough quantity for the transaction
    IF NEW.transaction_type = 'out' AND current_quantity < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient inventory: requested % but only % available', 
                       NEW.quantity, current_quantity;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update inventory after transaction
CREATE OR REPLACE FUNCTION update_inventory_after_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Update inventory quantity based on transaction type
    IF NEW.transaction_type = 'in' THEN
        UPDATE inventory 
        SET quantity = quantity + NEW.quantity,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id;
    ELSIF NEW.transaction_type = 'out' THEN
        UPDATE inventory 
        SET quantity = quantity - NEW.quantity,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id;
    ELSIF NEW.transaction_type = 'adjustment' THEN
        UPDATE inventory 
        SET quantity = NEW.quantity,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to create stock alerts
CREATE OR REPLACE FUNCTION create_stock_alerts()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for low stock alert
    IF NEW.quantity <= NEW.min_threshold AND NEW.quantity > 0 THEN
        INSERT INTO stock_alerts (product_id, warehouse_id, alert_type, message, created_at)
        VALUES (NEW.product_id, NEW.warehouse_id, 'low_stock', 
                'Product is running low on stock. Current quantity: ' || NEW.quantity || 
                ', Minimum threshold: ' || NEW.min_threshold, CURRENT_TIMESTAMP);
    END IF;
    
    -- Check for out of stock alert
    IF NEW.quantity = 0 THEN
        INSERT INTO stock_alerts (product_id, warehouse_id, alert_type, message, created_at)
        VALUES (NEW.product_id, NEW.warehouse_id, 'out_of_stock', 
                'Product is out of stock', CURRENT_TIMESTAMP);
    END IF;
    
    -- Check for overstock alert (if max_threshold is set)
    IF NEW.max_threshold IS NOT NULL AND NEW.quantity > NEW.max_threshold THEN
        INSERT INTO stock_alerts (product_id, warehouse_id, alert_type, message, created_at)
        VALUES (NEW.product_id, NEW.warehouse_id, 'overstock', 
                'Product is overstocked. Current quantity: ' || NEW.quantity || 
                ', Maximum threshold: ' || NEW.max_threshold, CURRENT_TIMESTAMP);
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update timestamp triggers to all tables with updated_at column
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at 
    BEFORE UPDATE ON warehouses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at 
    BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at 
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_transfers_updated_at 
    BEFORE UPDATE ON inventory_transfers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply audit log triggers to main tables
CREATE TRIGGER audit_users
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_products
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_inventory
    AFTER INSERT OR UPDATE OR DELETE ON inventory
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_purchase_orders
    AFTER INSERT OR UPDATE OR DELETE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_inventory_transactions
    AFTER INSERT OR UPDATE OR DELETE ON inventory_transactions
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Apply order number generation trigger
CREATE TRIGGER generate_purchase_order_number
    BEFORE INSERT ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Apply transfer number generation trigger
CREATE TRIGGER generate_inventory_transfer_number
    BEFORE INSERT ON inventory_transfers
    FOR EACH ROW EXECUTE FUNCTION generate_transfer_number();

-- Apply inventory transaction triggers
CREATE TRIGGER check_inventory_before_transaction
    BEFORE INSERT ON inventory_transactions
    FOR EACH ROW EXECUTE FUNCTION check_inventory_availability();

CREATE TRIGGER update_inventory_after_transaction
    AFTER INSERT ON inventory_transactions
    FOR EACH ROW EXECUTE FUNCTION update_inventory_after_transaction();

-- Apply stock alert triggers
CREATE TRIGGER create_stock_alerts_trigger
    AFTER INSERT OR UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION create_stock_alerts();

COMMIT; 