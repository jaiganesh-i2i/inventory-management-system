-- Seed Data Migration
-- Inventory Management System
-- Version: 1.2
-- Date: 2024-12-19

BEGIN;

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (username, email, password_hash, role, is_active) VALUES
('admin', 'admin@inventory.com', '$2b$10$rQZ8K9vX8K9vX8K9vX8K9O.8K9vX8K9vX8K9vX8K9vX8K9vX8K9vX8K', 'admin', true),
('manager1', 'manager1@inventory.com', '$2b$10$rQZ8K9vX8K9vX8K9vX8K9O.8K9vX8K9vX8K9vX8K9vX8K9vX8K9vX8K', 'manager', true),
('user1', 'user1@inventory.com', '$2b$10$rQZ8K9vX8K9vX8K9vX8K9O.8K9vX8K9vX8K9vX8K9vX8K9vX8K9vX8K', 'user', true);

-- Insert categories
INSERT INTO categories (name, description, parent_id, is_active) VALUES
('Electronics', 'Electronic devices and components', NULL, true),
('Clothing', 'Apparel and accessories', NULL, true),
('Books', 'Books and publications', NULL, true),
('Home & Garden', 'Home improvement and garden supplies', NULL, true),
('Smartphones', 'Mobile phones and accessories', 1, true),
('Laptops', 'Portable computers', 1, true),
('Men''s Clothing', 'Clothing for men', 2, true),
('Women''s Clothing', 'Clothing for women', 2, true),
('Fiction', 'Fictional books', 3, true),
('Non-Fiction', 'Non-fictional books', 3, true);

-- Insert suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address, contact_info, is_active) VALUES
('TechCorp Inc.', 'John Smith', 'john@techcorp.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA', '{"website": "www.techcorp.com", "payment_terms": "Net 30"}', true),
('Fashion World Ltd.', 'Sarah Johnson', 'sarah@fashionworld.com', '+1-555-0102', '456 Fashion Ave, New York, NY', '{"website": "www.fashionworld.com", "payment_terms": "Net 45"}', true),
('Book Publishers Co.', 'Mike Brown', 'mike@bookpublishers.com', '+1-555-0103', '789 Book Lane, Boston, MA', '{"website": "www.bookpublishers.com", "payment_terms": "Net 30"}', true),
('Home Depot', 'Lisa Davis', 'lisa@homedepot.com', '+1-555-0104', '321 Home Road, Atlanta, GA', '{"website": "www.homedepot.com", "payment_terms": "Net 30"}', true);

-- Insert warehouses
INSERT INTO warehouses (name, location, address, capacity, manager_id, is_active) VALUES
('Main Warehouse', 'New York', '100 Main Street, New York, NY 10001', 10000, 2, true),
('West Coast Hub', 'Los Angeles', '200 West Ave, Los Angeles, CA 90210', 8000, 2, true),
('South Distribution', 'Atlanta', '300 South Blvd, Atlanta, GA 30301', 6000, 2, true),
('East Coast Storage', 'Boston', '400 East Road, Boston, MA 02101', 5000, 2, true);

-- Insert products
INSERT INTO products (name, description, category_id, sku, barcode, specifications, unit_of_measure, is_active) VALUES
('iPhone 15 Pro', 'Latest Apple smartphone with advanced features', 5, 'IPH15PRO-001', '1234567890123', '{"color": "Titanium", "storage": "256GB", "screen": "6.1 inch"}', 'piece', true),
('MacBook Air M2', 'Lightweight laptop with M2 chip', 6, 'MBA-M2-001', '1234567890124', '{"color": "Space Gray", "storage": "512GB", "ram": "8GB"}', 'piece', true),
('Men''s T-Shirt', 'Cotton t-shirt for men', 7, 'TSHIRT-M-001', '1234567890125', '{"material": "Cotton", "size": "M", "color": "Blue"}', 'piece', true),
('Women''s Jeans', 'Denim jeans for women', 8, 'JEANS-W-001', '1234567890126', '{"material": "Denim", "size": "30", "color": "Blue"}', 'piece', true),
('The Great Gatsby', 'Classic novel by F. Scott Fitzgerald', 9, 'BOOK-FITZ-001', '1234567890127', '{"author": "F. Scott Fitzgerald", "pages": "180", "format": "Paperback"}', 'piece', true),
('Garden Hose', '50ft garden hose for outdoor use', 4, 'HOSE-50FT-001', '1234567890128', '{"length": "50ft", "material": "Rubber", "diameter": "5/8 inch"}', 'piece', true),
('Samsung Galaxy S24', 'Android smartphone with advanced camera', 5, 'SAMS24-001', '1234567890129', '{"color": "Black", "storage": "128GB", "screen": "6.2 inch"}', 'piece', true),
('Dell XPS 13', 'Premium ultrabook laptop', 6, 'DELLXPS13-001', '1234567890130', '{"color": "Silver", "storage": "1TB", "ram": "16GB"}', 'piece', true);

-- Insert inventory
INSERT INTO inventory (product_id, warehouse_id, quantity, min_threshold, max_threshold, reserved_quantity) VALUES
(1, 1, 50, 10, 100, 5),
(1, 2, 30, 5, 80, 3),
(2, 1, 25, 5, 50, 2),
(2, 3, 15, 3, 40, 1),
(3, 1, 200, 20, 500, 10),
(3, 2, 150, 15, 400, 8),
(4, 1, 100, 10, 300, 5),
(4, 3, 80, 8, 250, 4),
(5, 1, 75, 5, 200, 3),
(5, 4, 50, 5, 150, 2),
(6, 1, 30, 5, 100, 2),
(6, 3, 25, 3, 80, 1),
(7, 2, 40, 8, 120, 4),
(7, 4, 20, 4, 80, 2),
(8, 1, 15, 3, 60, 1),
(8, 2, 10, 2, 50, 1);

-- Insert purchase orders
INSERT INTO purchase_orders (order_number, supplier_id, status, total_amount, order_date, expected_delivery_date, notes, created_by) VALUES
('PO-20241219-0001', 1, 'received', 25000.00, '2024-12-15', '2024-12-18', 'iPhone 15 Pro order', 1),
('PO-20241219-0002', 2, 'ordered', 5000.00, '2024-12-16', '2024-12-22', 'Clothing order', 1),
('PO-20241219-0003', 3, 'pending', 2000.00, '2024-12-17', '2024-12-25', 'Book order', 1);

-- Insert purchase order items
INSERT INTO purchase_order_items (order_id, product_id, quantity, unit_price, received_quantity) VALUES
(1, 1, 50, 999.00, 50),
(1, 7, 30, 899.00, 30),
(2, 3, 100, 25.00, 0),
(2, 4, 50, 45.00, 0),
(3, 5, 100, 15.00, 0),
(3, 6, 20, 35.00, 0);

-- Insert inventory transactions
INSERT INTO inventory_transactions (product_id, warehouse_id, transaction_type, quantity, reference_type, reference_id, notes, created_by) VALUES
(1, 1, 'in', 50, 'purchase_order', 1, 'Received iPhone 15 Pro from PO-20241219-0001', 1),
(1, 2, 'in', 30, 'purchase_order', 1, 'Received iPhone 15 Pro from PO-20241219-0001', 1),
(7, 2, 'in', 30, 'purchase_order', 1, 'Received Samsung Galaxy S24 from PO-20241219-0001', 1),
(7, 4, 'in', 20, 'purchase_order', 1, 'Received Samsung Galaxy S24 from PO-20241219-0001', 1);

-- Insert stock alerts (some products are low on stock)
INSERT INTO stock_alerts (product_id, warehouse_id, alert_type, message, is_acknowledged, created_at) VALUES
(8, 1, 'low_stock', 'Product is running low on stock. Current quantity: 15, Minimum threshold: 3', false, CURRENT_TIMESTAMP),
(8, 2, 'low_stock', 'Product is running low on stock. Current quantity: 10, Minimum threshold: 2', false, CURRENT_TIMESTAMP);

COMMIT; 