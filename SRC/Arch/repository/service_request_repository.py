from db_config import db_config
from mysql.connector import Error

class ServiceRequestRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho ServiceRequest.
    
    def find_by_booking_id(self, booking_id):
        """Tìm service requests theo booking_id"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = """
                SELECT sr.*, s.service_name, s.category
                FROM service_requests sr
                JOIN services s ON sr.service_id = s.id
                WHERE sr.booking_id = %s AND sr.status != 'cancelled'
                ORDER BY sr.requested_at DESC
            """
            cursor.execute(query, (booking_id,))
            rows = cursor.fetchall()
            
            return rows
        except Error as e:
            raise ValueError(f"Error finding service requests: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def get_total_service_cost(self, booking_id):
        """Tính tổng chi phí dịch vụ của booking (chỉ tính các request đã completed hoặc pending)"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                SELECT COALESCE(SUM(total_price), 0) as total
                FROM service_requests
                WHERE booking_id = %s AND status IN ('pending', 'in_progress', 'completed')
            """
            cursor.execute(query, (booking_id,))
            result = cursor.fetchone()
            
            return float(result[0]) if result and result[0] else 0.0
        except Error as e:
            raise ValueError(f"Error calculating service cost: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def count_by_service_id(self, service_id):
        """Đếm số lượng service requests đang sử dụng service này (bao gồm cả cancelled)"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                SELECT COUNT(*) as count
                FROM service_requests
                WHERE service_id = %s
            """
            cursor.execute(query, (service_id,))
            result = cursor.fetchone()
            
            return result[0] if result else 0
        except Error as e:
            raise ValueError(f"Error counting service requests: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_all(self):
        """Lấy tất cả service requests với thông tin booking và service"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = """
                SELECT sr.*, s.service_name, s.category, b.guest_name, b.room_id, r.room_number
                FROM service_requests sr
                JOIN services s ON sr.service_id = s.id
                JOIN bookings b ON sr.booking_id = b.id
                LEFT JOIN rooms r ON b.room_id = r.id
                ORDER BY sr.requested_at DESC
            """
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return rows
        except Error as e:
            raise ValueError(f"Error finding service requests: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_id(self, request_id):
        """Tìm service request theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = """
                SELECT sr.*, s.service_name, s.category, b.guest_name, b.room_id, r.room_number
                FROM service_requests sr
                JOIN services s ON sr.service_id = s.id
                JOIN bookings b ON sr.booking_id = b.id
                LEFT JOIN rooms r ON b.room_id = r.id
                WHERE sr.id = %s
            """
            cursor.execute(query, (request_id,))
            row = cursor.fetchone()
            
            return row
        except Error as e:
            raise ValueError(f"Error finding service request: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def update_status(self, request_id, status, notes=None):
        """Cập nhật status của service request"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            if notes:
                query = """
                    UPDATE service_requests 
                    SET status = %s, notes = %s, completed_at = CASE WHEN %s = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
                    WHERE id = %s
                """
                cursor.execute(query, (status, notes, status, request_id))
            else:
                query = """
                    UPDATE service_requests 
                    SET status = %s, completed_at = CASE WHEN %s = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
                    WHERE id = %s
                """
                cursor.execute(query, (status, status, request_id))
            
            connection.commit()
            
            return self.find_by_id(request_id)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error updating service request: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
