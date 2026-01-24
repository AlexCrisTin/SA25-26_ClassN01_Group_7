

CREATE DATABASE IF NOT EXISTS room_service;
USE room_service;



CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    room_type ENUM('single', 'double', 'suite', 'family') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('available', 'occupied', 'maintenance', 'reserved') NOT NULL DEFAULT 'available',
    capacity INT NULL,
    image_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_room_number (room_number),
    INDEX idx_room_type (room_type),
    INDEX idx_status (status),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO rooms (room_number, room_type, price, status, capacity) VALUES
('101', 'single', 500000.00, 'available', 1),
('102', 'single', 500000.00, 'available', 1),
('201', 'double', 800000.00, 'available', 2),
('202', 'double', 800000.00, 'available', 2),
('301', 'suite', 1500000.00, 'available', 4),
('302', 'family', 1200000.00, 'available', 6);