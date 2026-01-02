from models.room import Room
from db_config import db_config
from mysql.connector import Error

class RoomRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho Room.
    
    def save(self, room_number, room_type, price, status, capacity=None, image_url=None):
        """Lưu room mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO rooms (room_number, room_type, price, status, capacity, image_url)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            values = (room_number, room_type, float(price), status, capacity, image_url)
            cursor.execute(query, values)
            connection.commit()
            
            room_id = cursor.lastrowid
            return Room(str(room_id), room_number, room_type, price, status, capacity, image_url)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving room: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_by_id(self, room_id):
        """Tìm room theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM rooms WHERE id = %s"
            cursor.execute(query, (room_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_room(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding room: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_all(self):
        """Lấy tất cả rooms"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM rooms"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return [self._row_to_room(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding rooms: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_status(self, status):
        """Tìm rooms theo status"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM rooms WHERE status = %s"
            cursor.execute(query, (status,))
            rows = cursor.fetchall()
            
            return [self._row_to_room(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding rooms: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_type(self, room_type):
        """Tìm rooms theo type"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM rooms WHERE room_type = %s"
            cursor.execute(query, (room_type,))
            rows = cursor.fetchall()
            
            return [self._row_to_room(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding rooms: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_number(self, room_number):
        """Tìm room theo room_number"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM rooms WHERE room_number = %s"
            cursor.execute(query, (room_number,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_room(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding room: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def update(self, room_id, room_number=None, room_type=None, price=None, status=None, capacity=None, image_url=None):
        """Cập nhật thông tin phòng"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            # Build dynamic update query
            set_clauses = []
            values = []
            if room_number is not None:
                set_clauses.append("room_number = %s")
                values.append(room_number)
            if room_type is not None:
                set_clauses.append("room_type = %s")
                values.append(room_type)
            if price is not None:
                set_clauses.append("price = %s")
                values.append(float(price))
            if status is not None:
                set_clauses.append("status = %s")
                values.append(status)
            # Handle capacity: update if provided (including None to set to NULL)
            # We'll use a sentinel approach - but for now, only update if not None
            # Frontend should send capacity only when it wants to change it
            if capacity is not None:
                set_clauses.append("capacity = %s")
                values.append(capacity)
            if image_url is not None:
                set_clauses.append("image_url = %s")
                values.append(image_url)
            
            if not set_clauses:
                return self.find_by_id(room_id)
            
            values.append(room_id)
            query = f"UPDATE rooms SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
            cursor.execute(query, values)
            connection.commit()
            
            return self.find_by_id(room_id)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error updating room: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def delete(self, room_id):
        """Xóa phòng khỏi database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = "DELETE FROM rooms WHERE id = %s"
            cursor.execute(query, (room_id,))
            connection.commit()
            
            return cursor.rowcount > 0
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error deleting room: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def _row_to_room(self, row):
        """Chuyển đổi database row thành Room object"""
        return Room(
            str(row['id']),
            row['room_number'],
            row['room_type'],
            float(row['price']),
            row['status'],
            row['capacity'],
            row.get('image_url')  # Get image_url if exists, None otherwise
        )

