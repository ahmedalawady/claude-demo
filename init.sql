-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    before_state TEXT,
    after_state TEXT,
    diff TEXT,
    changed_by VARCHAR(100) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_name (table_name),
    INDEX idx_changed_at (changed_at),
    INDEX idx_changed_by (changed_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed demo data for users table audit
INSERT INTO audit_log (table_name, record_id, action, before_state, after_state, diff, changed_by, changed_at) VALUES
('users', 1, 'INSERT', NULL, '{"id": 1, "name": "John Doe", "email": "john@example.com", "role": "admin", "status": "active"}', NULL, 'system', '2024-02-01 10:00:00'),
('users', 2, 'INSERT', NULL, '{"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "user", "status": "active"}', NULL, 'admin_user', '2024-02-01 10:15:00'),
('users', 1, 'UPDATE', '{"id": 1, "name": "John Doe", "email": "john@example.com", "role": "admin", "status": "active"}', '{"id": 1, "name": "John Doe", "email": "john.doe@example.com", "role": "admin", "status": "active"}', '{"email": {"old": "john@example.com", "new": "john.doe@example.com"}}', 'john_doe', '2024-02-02 14:30:00'),
('users', 2, 'UPDATE', '{"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "user", "status": "active"}', '{"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "moderator", "status": "active"}', '{"role": {"old": "user", "new": "moderator"}}', 'admin_user', '2024-02-03 09:00:00'),
('users', 3, 'INSERT', NULL, '{"id": 3, "name": "Bob Johnson", "email": "bob@example.com", "role": "user", "status": "active"}', NULL, 'admin_user', '2024-02-04 11:20:00');

-- Seed demo data for products table audit
INSERT INTO audit_log (table_name, record_id, action, before_state, after_state, diff, changed_by, changed_at) VALUES
('products', 101, 'INSERT', NULL, '{"id": 101, "name": "Laptop", "price": 999.99, "stock": 50, "category": "Electronics"}', NULL, 'system', '2024-02-01 08:00:00'),
('products', 102, 'INSERT', NULL, '{"id": 102, "name": "Mouse", "price": 29.99, "stock": 200, "category": "Electronics"}', NULL, 'admin_user', '2024-02-01 08:30:00'),
('products', 101, 'UPDATE', '{"id": 101, "name": "Laptop", "price": 999.99, "stock": 50, "category": "Electronics"}', '{"id": 101, "name": "Laptop", "price": 899.99, "stock": 50, "category": "Electronics"}', '{"price": {"old": 999.99, "new": 899.99}}', 'price_manager', '2024-02-05 10:00:00'),
('products', 101, 'UPDATE', '{"id": 101, "name": "Laptop", "price": 899.99, "stock": 50, "category": "Electronics"}', '{"id": 101, "name": "Laptop", "price": 899.99, "stock": 45, "category": "Electronics"}', '{"stock": {"old": 50, "new": 45}}', 'inventory_system', '2024-02-06 15:30:00'),
('products', 103, 'INSERT', NULL, '{"id": 103, "name": "Keyboard", "price": 79.99, "stock": 100, "category": "Electronics"}', NULL, 'admin_user', '2024-02-07 09:00:00'),
('products', 102, 'UPDATE', '{"id": 102, "name": "Mouse", "price": 29.99, "stock": 200, "category": "Electronics"}', '{"id": 102, "name": "Mouse", "price": 24.99, "stock": 200, "category": "Electronics"}', '{"price": {"old": 29.99, "new": 24.99}}', 'price_manager', '2024-02-08 12:00:00');

-- Seed demo data for orders table audit
INSERT INTO audit_log (table_name, record_id, action, before_state, after_state, diff, changed_by, changed_at) VALUES
('orders', 1001, 'INSERT', NULL, '{"id": 1001, "customer_id": 1, "total": 1029.98, "status": "pending", "created_at": "2024-02-05 10:00:00"}', NULL, 'order_system', '2024-02-05 10:00:00'),
('orders', 1001, 'UPDATE', '{"id": 1001, "customer_id": 1, "total": 1029.98, "status": "pending", "created_at": "2024-02-05 10:00:00"}', '{"id": 1001, "customer_id": 1, "total": 1029.98, "status": "processing", "created_at": "2024-02-05 10:00:00"}', '{"status": {"old": "pending", "new": "processing"}}', 'payment_system', '2024-02-05 10:15:00'),
('orders', 1001, 'UPDATE', '{"id": 1001, "customer_id": 1, "total": 1029.98, "status": "processing", "created_at": "2024-02-05 10:00:00"}', '{"id": 1001, "customer_id": 1, "total": 1029.98, "status": "shipped", "created_at": "2024-02-05 10:00:00"}', '{"status": {"old": "processing", "new": "shipped"}}', 'shipping_system', '2024-02-06 14:00:00'),
('orders', 1002, 'INSERT', NULL, '{"id": 1002, "customer_id": 2, "total": 54.98, "status": "pending", "created_at": "2024-02-07 11:30:00"}', NULL, 'order_system', '2024-02-07 11:30:00'),
('orders', 1002, 'UPDATE', '{"id": 1002, "customer_id": 2, "total": 54.98, "status": "pending", "created_at": "2024-02-07 11:30:00"}', '{"id": 1002, "customer_id": 2, "total": 54.98, "status": "cancelled", "created_at": "2024-02-07 11:30:00"}', '{"status": {"old": "pending", "new": "cancelled"}}', 'customer_support', '2024-02-07 15:00:00');

-- Seed demo data for settings table audit
INSERT INTO audit_log (table_name, record_id, action, before_state, after_state, diff, changed_by, changed_at) VALUES
('settings', 1, 'INSERT', NULL, '{"id": 1, "key": "maintenance_mode", "value": "false", "updated_at": "2024-02-01 00:00:00"}', NULL, 'system', '2024-02-01 00:00:00'),
('settings', 1, 'UPDATE', '{"id": 1, "key": "maintenance_mode", "value": "false", "updated_at": "2024-02-01 00:00:00"}', '{"id": 1, "key": "maintenance_mode", "value": "true", "updated_at": "2024-02-10 03:00:00"}', '{"value": {"old": "false", "new": "true"}}', 'admin_user', '2024-02-10 03:00:00'),
('settings', 1, 'UPDATE', '{"id": 1, "key": "maintenance_mode", "value": "true", "updated_at": "2024-02-10 03:00:00"}', '{"id": 1, "key": "maintenance_mode", "value": "false", "updated_at": "2024-02-10 05:00:00"}', '{"value": {"old": "true", "new": "false"}}', 'admin_user', '2024-02-10 05:00:00'),
('settings', 2, 'INSERT', NULL, '{"id": 2, "key": "max_upload_size", "value": "10MB", "updated_at": "2024-02-11 10:00:00"}', NULL, 'admin_user', '2024-02-11 10:00:00'),
('settings', 2, 'UPDATE', '{"id": 2, "key": "max_upload_size", "value": "10MB", "updated_at": "2024-02-11 10:00:00"}', '{"id": 2, "key": "max_upload_size", "value": "50MB", "updated_at": "2024-02-12 14:00:00"}', '{"value": {"old": "10MB", "new": "50MB"}}', 'tech_lead', '2024-02-12 14:00:00');

-- Seed demo data for permissions table audit
INSERT INTO audit_log (table_name, record_id, action, before_state, after_state, diff, changed_by, changed_at) VALUES
('permissions', 1, 'INSERT', NULL, '{"id": 1, "user_id": 1, "resource": "users", "actions": ["read", "write", "delete"]}', NULL, 'system', '2024-02-01 10:00:00'),
('permissions', 2, 'INSERT', NULL, '{"id": 2, "user_id": 2, "resource": "products", "actions": ["read"]}', NULL, 'admin_user', '2024-02-01 10:30:00'),
('permissions', 2, 'UPDATE', '{"id": 2, "user_id": 2, "resource": "products", "actions": ["read"]}', '{"id": 2, "user_id": 2, "resource": "products", "actions": ["read", "write"]}', '{"actions": {"old": ["read"], "new": ["read", "write"]}}', 'admin_user', '2024-02-03 09:15:00'),
('permissions', 3, 'INSERT', NULL, '{"id": 3, "user_id": 3, "resource": "orders", "actions": ["read"]}', NULL, 'admin_user', '2024-02-04 11:30:00'),
('permissions', 1, 'DELETE', '{"id": 1, "user_id": 1, "resource": "users", "actions": ["read", "write", "delete"]}', NULL, NULL, 'security_admin', '2024-02-13 16:00:00');

-- Add more recent activity for variety
INSERT INTO audit_log (table_name, record_id, action, before_state, after_state, diff, changed_by, changed_at) VALUES
('users', 4, 'INSERT', NULL, '{"id": 4, "name": "Alice Williams", "email": "alice@example.com", "role": "user", "status": "active"}', NULL, 'admin_user', '2024-02-14 08:00:00'),
('products', 104, 'INSERT', NULL, '{"id": 104, "name": "Monitor", "price": 299.99, "stock": 30, "category": "Electronics"}', NULL, 'admin_user', '2024-02-14 09:00:00'),
('orders', 1003, 'INSERT', NULL, '{"id": 1003, "customer_id": 3, "total": 379.98, "status": "pending", "created_at": "2024-02-14 10:00:00"}', NULL, 'order_system', '2024-02-14 10:00:00'),
('users', 1, 'UPDATE', '{"id": 1, "name": "John Doe", "email": "john.doe@example.com", "role": "admin", "status": "active"}', '{"id": 1, "name": "John Doe", "email": "john.doe@example.com", "role": "super_admin", "status": "active"}', '{"role": {"old": "admin", "new": "super_admin"}}', 'system_admin', '2024-02-15 11:00:00'),
('products', 102, 'DELETE', '{"id": 102, "name": "Mouse", "price": 24.99, "stock": 200, "category": "Electronics"}', NULL, NULL, 'admin_user', '2024-02-15 14:00:00');

-- Show inserted data count
SELECT
    table_name,
    COUNT(*) as record_count
FROM audit_log
GROUP BY table_name
ORDER BY table_name;

SELECT '✅ Database initialized with demo data!' as status;
