-- Create Database
CREATE DATABASE IF NOT EXISTS ams_db;
USE ams_db;

-- 1. Users Table (Admins, Employees)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    course VARCHAR(100),
    enrollment_date DATE,
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    client_name VARCHAR(100),
    budget DECIMAL(10, 2),
    start_date DATE,
    end_date DATE,
    status ENUM('planning', 'in-progress', 'completed') DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Transactions Table (for both Revenue/Payments and Expenses)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(100), -- e.g., 'Course Fee', 'Salary', 'Rent', 'Software'
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Running Costs Table
CREATE TABLE IF NOT EXISTS running_costs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rc_id VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data for Dashboard
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@learnlike.in', 'hashed_password', 'admin');

INSERT INTO transactions (title, amount, type, category, status, transaction_date) VALUES 
('Course Fee - Rahul Sharma', 15000.00, 'income', 'Course Fee', 'completed', '2026-07-20'),
('Trainer Salary - Amit Kumar', 45000.00, 'expense', 'Salary', 'completed', '2026-07-19'),
('Project Advance - TechCorp', 50000.00, 'income', 'Project Advance', 'pending', '2026-07-18'),
('Office Rent - July', 15000.00, 'expense', 'Rent', 'completed', '2026-07-15');
