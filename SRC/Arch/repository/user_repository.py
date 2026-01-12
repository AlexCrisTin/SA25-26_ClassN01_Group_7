from models.user import User
from db_config import db_config
from mysql.connector import Error

class UserRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho User.
    
    def save(self, username, email, password, full_name, phone, role='user'):
        """Lưu user mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO users (username, email, password, full_name, phone, role)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            values = (username, email, password, full_name, phone, role)
            cursor.execute(query, values)
            connection.commit()
            
            user_id = cursor.lastrowid
            return User(str(user_id), username, email, password, full_name, phone, role)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving user: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_by_id(self, user_id):
        """Tìm user theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM users WHERE id = %s"
            cursor.execute(query, (user_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_user(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding user: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_username(self, username):
        """Tìm user theo username"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM users WHERE username = %s"
            cursor.execute(query, (username,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_user(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding user: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_email(self, email):
        """Tìm user theo email"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM users WHERE email = %s"
            cursor.execute(query, (email,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_user(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding user: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_all(self):
        """Lấy tất cả users"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM users"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return [self._row_to_user(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding users: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def update(self, user_id, **kwargs):
        """Cập nhật thông tin user"""
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
                return None
            
            values.append(user_id)
            query = f"UPDATE users SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
            cursor.execute(query, values)
            connection.commit()
            
            return self.find_by_id(user_id)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error updating user: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def delete(self, user_id):
        """Xóa user khỏi database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = "DELETE FROM users WHERE id = %s"
            cursor.execute(query, (user_id,))
            connection.commit()
            
            return cursor.rowcount > 0
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error deleting user: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def _row_to_user(self, row):
        """Chuyển đổi database row thành User object"""
        return User(
            str(row['id']),
            row['username'],
            row['email'],
            row['password'],
            row['full_name'],
            row['phone'],
            row['role']
        )

