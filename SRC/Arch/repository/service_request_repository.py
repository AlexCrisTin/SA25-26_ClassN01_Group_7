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
