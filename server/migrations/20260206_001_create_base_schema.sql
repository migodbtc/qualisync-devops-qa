CREATE DATABASE IF NOT EXISTS fuchsia_atms_db;
USE fuchsia_atms_db;
-- 1. Roles (Admin, Tenant, Staff)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
-- 2. Auth Users (Login Credentials)
-- Every person who logs in must have a record here
CREATE TABLE auth_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
-- 3. Tenants (The Profile/Identity)
-- PK is user_id to enforce 1:1 relationship with auth_users
CREATE TABLE tenants (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    status ENUM('prospect', 'active', 'past') DEFAULT 'prospect',
    FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
);
-- 4. Rooms (The Assets)
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    floor INT,
    type ENUM('studio', '1BR', '2BR', '3BR', 'commercial') DEFAULT 'studio',
    status ENUM('vacant', 'occupied', 'maintenance') DEFAULT 'vacant',
    base_rent DECIMAL(10, 2) NOT NULL
);
-- 5. Leases (The Contract)
-- Links a Tenant to a Room for a specific timeframe
CREATE TABLE leases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    room_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(user_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
-- 6. Payments (The Financials)
-- Logic: Balance = SUM(amount_due) - SUM(amount_paid)
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    due_date DATE NOT NULL,
    paid_date DATE NULL,
    payment_type ENUM('cash', 'bank_transfer', 'credit_card', 'check') NULL,
    status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
    FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE
);
-- 7. Maintenance Requests
CREATE TABLE maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    room_id INT NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'emergency') DEFAULT 'medium',
    status ENUM('open', 'in progress', 'closed') DEFAULT 'open',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(user_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
-- Seed Initial Roles
INSERT INTO roles (name)
VALUES ('admin'),
    ('tenant');