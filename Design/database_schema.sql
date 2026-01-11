CREATE DATABASE IF NOT EXISTS hotel_management;
USE hotel_management;

-- 1. BẢNG USERS (Người dùng - Khách hàng & Nhân viên)

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'receptionist', 'administrator') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. BẢNG STAFF (Nhân viên - có thể tích hợp vào users)

CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(50) NOT NULL, 
    department VARCHAR(50),
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    user_id INT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_position (position),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. BẢNG ROOMS (Phòng khách sạn)

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    room_type VARCHAR(50) NOT NULL, 
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    status ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available',
    capacity INT CHECK (capacity > 0),
    image_url VARCHAR(500), -- URL path to room image
    description TEXT,
    amenities TEXT, -- JSON hoặc text mô tả tiện nghi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_room_number (room_number),
    INDEX idx_room_type (room_type),
    INDEX idx_status (status),
    INDEX idx_room_type_status (room_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG BOOKINGS (Đặt phòng)

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Khách hàng đặt phòng (có thể NULL nếu đặt không cần tài khoản)
    guest_name VARCHAR(100) NOT NULL,
    room_type VARCHAR(50) NOT NULL, -- Loại phòng yêu cầu
    room_id INT, -- Phòng cụ thể được gán (NULL nếu chưa gán)
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
    status ENUM('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out') DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_room_id (room_id),
    INDEX idx_room_type (room_type),
    INDEX idx_status (status),
    INDEX idx_check_in_date (check_in_date),
    INDEX idx_check_out_date (check_out_date),
    INDEX idx_dates (check_in_date, check_out_date),
    CONSTRAINT chk_checkout_after_checkin CHECK (check_out_date IS NULL OR check_out_date > check_in_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 5. BẢNG PAYMENTS (Thanh toán)

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method ENUM('credit_card', 'cash', 'bank_transfer', 'wallet') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100), -- ID giao dịch từ payment gateway
    payment_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_status (status),
    INDEX idx_payment_method (payment_method),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 6. BẢNG SERVICES (Dịch vụ khách sạn)

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    category VARCHAR(50) NOT NULL, -- room_service, food, laundry, transportation, tour, etc.
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 7. BẢNG SERVICE_REQUESTS (Yêu cầu dịch vụ)

CREATE TABLE service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL, -- Giá tại thời điểm yêu cầu
    total_price DECIMAL(10, 2) NOT NULL, -- quantity * unit_price
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
    INDEX idx_booking_id (booking_id),
    INDEX idx_service_id (service_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 8. BẢNG COUPONS (Mã giảm giá)

CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    max_uses INT, -- Số lần sử dụng tối đa (NULL = không giới hạn)
    current_uses INT DEFAULT 0, -- Số lần đã sử dụng
    min_purchase_amount DECIMAL(10, 2) DEFAULT 0, -- Giá trị đơn hàng tối thiểu
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_valid_dates (valid_from, valid_to),
    INDEX idx_is_active (is_active),
    CONSTRAINT chk_coupon_dates CHECK (valid_to >= valid_from),
    CONSTRAINT chk_percentage_discount CHECK (
        discount_type != 'percentage' OR discount_value <= 100
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 9. BẢNG COUPON_USAGES (Lịch sử sử dụng coupon)

CREATE TABLE coupon_usages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT NOT NULL,
    booking_id INT NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE RESTRICT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_coupon_id (coupon_id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_used_at (used_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 10. BẢNG CHECKINS (Nhận phòng)

CREATE TABLE checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE, -- Một booking chỉ có một check-in
    room_id INT NOT NULL,
    receptionist_id INT, -- Nhân viên lễ tân xử lý check-in
    checkin_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guest_count INT DEFAULT 1 CHECK (guest_count > 0),
    notes TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
    FOREIGN KEY (receptionist_id) REFERENCES staff(id) ON DELETE SET NULL,
    INDEX idx_booking_id (booking_id),
    INDEX idx_room_id (room_id),
    INDEX idx_receptionist_id (receptionist_id),
    INDEX idx_checkin_time (checkin_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 11. BẢNG CHECKOUTS (Trả phòng)

CREATE TABLE checkouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE, -- Một booking chỉ có một check-out
    receptionist_id INT, -- Nhân viên lễ tân xử lý check-out
    checkout_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL, -- Tổng số tiền thanh toán (bao gồm dịch vụ)
    additional_charges DECIMAL(10, 2) DEFAULT 0, -- Phí phát sinh (damage, minibar, etc.)
    refund_amount DECIMAL(10, 2) DEFAULT 0, -- Số tiền hoàn lại (nếu có)
    payment_status ENUM('paid', 'pending', 'partial') DEFAULT 'pending',
    notes TEXT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (receptionist_id) REFERENCES staff(id) ON DELETE SET NULL,
    INDEX idx_booking_id (booking_id),
    INDEX idx_receptionist_id (receptionist_id),
    INDEX idx_checkout_time (checkout_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 12. BẢNG REPORTS (Báo cáo)

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_type ENUM('revenue', 'occupancy', 'booking', 'service', 'customer') NOT NULL,
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    period_start DATE,
    period_end DATE,
    data JSON, -- Lưu trữ dữ liệu báo cáo dạng JSON
    generated_by INT, -- Người tạo báo cáo
    file_path VARCHAR(255), -- Đường dẫn file báo cáo (nếu export)
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_report_type (report_type),
    INDEX idx_generated_date (generated_date),
    INDEX idx_period (period_start, period_end),
    CONSTRAINT chk_report_period CHECK (period_end IS NULL OR period_end >= period_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 13. BẢNG WALLETS (Ví người dùng)

CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE, -- Liên kết với users.id
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_wallet_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Trigger: Cập nhật số lần sử dụng coupon
DELIMITER //
CREATE TRIGGER after_coupon_usage_insert
AFTER INSERT ON coupon_usages
FOR EACH ROW
BEGIN
    UPDATE coupons 
    SET current_uses = current_uses + 1
    WHERE id = NEW.coupon_id;
END//
DELIMITER ;

-- Trigger: Cập nhật trạng thái phòng khi check-in
DELIMITER //
CREATE TRIGGER after_checkin_insert
AFTER INSERT ON checkins
FOR EACH ROW
BEGIN
    -- Cập nhật trạng thái phòng thành occupied
    UPDATE rooms SET status = 'occupied' WHERE id = NEW.room_id;
    -- Cập nhật trạng thái booking thành checked_in
    UPDATE bookings SET status = 'checked_in' WHERE id = NEW.booking_id;
END//
DELIMITER ;

-- Trigger: Cập nhật trạng thái phòng khi check-out
DELIMITER //
CREATE TRIGGER after_checkout_insert
AFTER INSERT ON checkouts
FOR EACH ROW
BEGIN
    -- Lấy room_id từ checkin
    UPDATE rooms r
    INNER JOIN checkins c ON r.id = c.room_id
    SET r.status = 'available'
    WHERE c.booking_id = NEW.booking_id;
    
    -- Cập nhật trạng thái booking thành checked_out
    UPDATE bookings SET status = 'checked_out' WHERE id = NEW.booking_id;
END//
DELIMITER ;
    
-- VIEWS (Các view hữu ích)

-- View: Thông tin booking đầy đủ
CREATE VIEW v_booking_details AS
SELECT 
    b.id,
    b.guest_name,
    b.room_type,
    r.room_number,
    b.check_in_date,
    b.check_out_date,
    b.total_price,
    b.status,
    u.full_name AS customer_name,
    u.email AS customer_email,
    u.phone AS customer_phone,
    ci.checkin_time,
    co.checkout_time,
    co.total_amount AS checkout_amount
FROM bookings b
LEFT JOIN users u ON b.user_id = u.id
LEFT JOIN rooms r ON b.room_id = r.id
LEFT JOIN checkins ci ON b.id = ci.booking_id
LEFT JOIN checkouts co ON b.id = co.booking_id;

-- View: Doanh thu theo ngày
CREATE VIEW v_daily_revenue AS
SELECT 
    DATE(p.payment_date) AS payment_date,
    COUNT(DISTINCT p.booking_id) AS booking_count,
    SUM(p.amount) AS total_revenue,
    COUNT(p.id) AS payment_count
FROM payments p
WHERE p.status = 'completed' AND p.payment_date IS NOT NULL
GROUP BY DATE(p.payment_date);

-- View: Tỷ lệ lấp đầy phòng (Occupancy Rate)
CREATE VIEW v_room_occupancy AS
SELECT 
    r.id,
    r.room_number,
    r.room_type,
    COUNT(DISTINCT b.id) AS total_bookings,
    SUM(DATEDIFF(COALESCE(b.check_out_date, DATE_ADD(b.check_in_date, INTERVAL 1 DAY)), b.check_in_date)) AS total_nights
FROM rooms r
LEFT JOIN bookings b ON r.id = b.room_id AND b.status IN ('confirmed', 'checked_in', 'checked_out')
GROUP BY r.id, r.room_number, r.room_type;


-- Procedure: Tìm phòng trống trong khoảng thời gian
DELIMITER //
CREATE PROCEDURE sp_find_available_rooms(
    IN p_room_type VARCHAR(50),
    IN p_check_in DATE,
    IN p_check_out DATE
)
BEGIN
    SELECT r.*
    FROM rooms r
    WHERE r.room_type = p_room_type
      AND r.status = 'available'
      AND r.id NOT IN (
          SELECT DISTINCT b.room_id
          FROM bookings b
          WHERE b.room_id IS NOT NULL
            AND b.status NOT IN ('cancelled', 'checked_out')
            AND (
                (b.check_in_date <= p_check_in AND b.check_out_date > p_check_in)
                OR (b.check_in_date < p_check_out AND b.check_out_date >= p_check_out)
                OR (b.check_in_date >= p_check_in AND b.check_out_date <= p_check_out)
            )
      )
    ORDER BY r.room_number;
END//
DELIMITER ;

-- Insert sample users
INSERT INTO users (username, email, password, full_name, phone, role) VALUES
('admin', 'admin@hotel.com', 'admin', 'Administrator', '0123456789', 'administrator'),
('reception', 'reception@hotel.com', 'reception', 'Receptionist', '0987654321', 'receptionist');

-- Insert sample rooms
INSERT INTO rooms (room_number, room_type, price, status, capacity) VALUES
('101', 'single', 500000.00, 'available', 1),
('102', 'double', 800000.00, 'available', 2),
('201', 'triple', 1200000.00, 'available', 3),
('202', 'senior', 1500000.00, 'available', 2),
('301', 'connecting', 2000000.00, 'available', 4),
('302', 'suite', 3000000.00, 'available', 2);

-- Insert sample services
INSERT INTO services (service_name, description, price, category) VALUES
('Airport Transfer', 'Dịch vụ đưa đón sân bay', 200000.00, 'transportation'),
('Breakfast', 'Bữa sáng buffet', 0, 'food'),
('Tour Guide', 'Hướng dẫn viên du lịch', 500000.00, 'tour'),
('BBQ Party', 'Tiệc BBQ ngoài trời', 800000.00, 'food'),
('Laundry', 'Dịch vụ giặt ủi', 100000.00, 'room_service'),
('Spa Treatment', 'Dịch vụ spa và massage', 600000.00, 'room_service');

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, valid_from, valid_to, is_active, max_uses) VALUES
('WELCOME10', 'percentage', 10.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), TRUE, 100),
('SUMMER2024', 'fixed_amount', 200000.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 6 MONTH), TRUE, 50),
('VIP50', 'percentage', 50.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), TRUE, 10);


