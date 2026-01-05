from models.staff import Staff
from db_config import db_config
from mysql.connector import Error
from datetime import date, datetime

class StaffRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho Staff.
    
    def save(self, full_name, email, phone, position, department, hire_date, is_active=True, user_id=None):
        """Lưu staff mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO staff (full_name, email, phone, position, department, hire_date, is_active, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (full_name, email, phone, position, department, hire_date, is_active, user_id)
            cursor.execute(query, values)
            connection.commit()
            
            staff_id = cursor.lastrowid
            return Staff(str(staff_id), full_name, email, phone, position, department, hire_date, is_active)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving staff: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_by_id(self, staff_id):
        """Tìm staff theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM staff WHERE id = %s"
            cursor.execute(query, (staff_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_staff(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding staff: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_all(self):
        """Lấy tất cả staff"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM staff ORDER BY full_name"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return [self._row_to_staff(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding staff: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_position(self, position):
        """Tìm staff theo position"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM staff WHERE position = %s AND is_active = TRUE ORDER BY full_name"
            cursor.execute(query, (position,))
            rows = cursor.fetchall()
            
            return [self._row_to_staff(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding staff: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_department(self, department):
        """Tìm staff theo department"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM staff WHERE department = %s AND is_active = TRUE ORDER BY full_name"
            cursor.execute(query, (department,))
            rows = cursor.fetchall()
            
            return [self._row_to_staff(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding staff: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def update(self, staff_id, **kwargs):
        """Cập nhật thông tin staff"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            # Build dynamic update query
            set_clauses = []
            values = []
            for key, value in kwargs.items():
                if value is not None:
                    set_clauses.append(f"{key} = %s")
                    values.append(value)
            
            if not set_clauses:
                return self.find_by_id(staff_id)
            
            values.append(staff_id)
            query = f"UPDATE staff SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
            cursor.execute(query, values)
            connection.commit()
            
            return self.find_by_id(staff_id)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error updating staff: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def delete(self, staff_id):
        """Xóa staff khỏi database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = "DELETE FROM staff WHERE id = %s"
            cursor.execute(query, (staff_id,))
            connection.commit()
            
            return cursor.rowcount > 0
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error deleting staff: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def _row_to_staff(self, row):
        """Chuyển đổi database row thành Staff object"""
        hire_date = row['hire_date']
        if isinstance(hire_date, (date, datetime)):
            hire_date = hire_date.strftime('%Y-%m-%d')
        
        return Staff(
            str(row['id']),
            row['full_name'],
            row['email'],
            row['phone'],
            row['position'],
            row['department'],
            hire_date,
            bool(row['is_active'])
        )

