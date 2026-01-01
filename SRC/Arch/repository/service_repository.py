from models.service import Service
from db_config import db_config
from mysql.connector import Error

class ServiceRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho Service.
    
    def save(self, service_name, description, price, category, is_available=True):
        """Lưu service mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO services (service_name, description, price, category, is_available)
                VALUES (%s, %s, %s, %s, %s)
            """
            values = (service_name, description, float(price), category, is_available)
            cursor.execute(query, values)
            connection.commit()
            
            service_id = cursor.lastrowid
            return Service(str(service_id), service_name, description, price, category)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving service: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_by_id(self, service_id):
        """Tìm service theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM services WHERE id = %s"
            cursor.execute(query, (service_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_service(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding service: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_all(self):
        """Lấy tất cả services"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM services ORDER BY service_name"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return [self._row_to_service(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding services: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_category(self, category):
        """Tìm services theo category"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM services WHERE category = %s AND is_available = TRUE ORDER BY service_name"
            cursor.execute(query, (category,))
            rows = cursor.fetchall()
            
            return [self._row_to_service(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding services: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def _row_to_service(self, row):
        """Chuyển đổi database row thành Service object"""
        return Service(
            str(row['id']),
            row['service_name'],
            row['description'],
            float(row['price']),
            row['category']
        )

