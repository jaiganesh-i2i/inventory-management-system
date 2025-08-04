-- Common Database Views
-- Inventory Management System
-- Version: 1.0
-- Date: 2024-12-19

-- Inventory Summary View
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

-- Low Stock Alerts View
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

-- Product Performance View
CREATE VIEW product_performance AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.sku,
    c.name as category_name,
    COUNT(DISTINCT i.warehouse_id) as warehouse_count,
    SUM(i.quantity) as total_quantity,
    AVG(i.quantity) as avg_quantity_per_warehouse,
    COUNT(CASE WHEN i.quantity <= i.min_threshold THEN 1 END) as low_stock_warehouses
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
GROUP BY p.id, p.name, p.sku, c.name;

-- Purchase Order Summary View
CREATE VIEW purchase_order_summary AS
SELECT 
    po.id as order_id,
    po.order_number,
    po.status,
    po.total_amount,
    po.order_date,
    po.expected_delivery_date,
    s.name as supplier_name,
    COUNT(poi.id) as item_count,
    SUM(poi.quantity) as total_quantity,
    u.username as created_by
FROM purchase_orders po
JOIN suppliers s ON po.supplier_id = s.id
LEFT JOIN purchase_order_items poi ON po.id = poi.order_id
LEFT JOIN users u ON po.created_by = u.id
GROUP BY po.id, po.order_number, po.status, po.total_amount, po.order_date, 
         po.expected_delivery_date, s.name, u.username;

-- Inventory Transaction Summary View
CREATE VIEW inventory_transaction_summary AS
SELECT 
    it.id as transaction_id,
    p.name as product_name,
    p.sku,
    w.name as warehouse_name,
    it.transaction_type,
    it.quantity,
    it.reference_type,
    it.reference_id,
    it.created_at,
    u.username as created_by
FROM inventory_transactions it
JOIN products p ON it.product_id = p.id
JOIN warehouses w ON it.warehouse_id = w.id
LEFT JOIN users u ON it.created_by = u.id
ORDER BY it.created_at DESC;

-- Stock Alert Summary View
CREATE VIEW stock_alert_summary AS
SELECT 
    sa.id as alert_id,
    p.name as product_name,
    p.sku,
    w.name as warehouse_name,
    sa.alert_type,
    sa.message,
    sa.is_acknowledged,
    sa.created_at,
    u.username as acknowledged_by
FROM stock_alerts sa
JOIN products p ON sa.product_id = p.id
JOIN warehouses w ON sa.warehouse_id = w.id
LEFT JOIN users u ON sa.acknowledged_by = u.id
ORDER BY sa.created_at DESC; 