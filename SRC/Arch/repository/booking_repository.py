from models.booking import Booking
from db_config import db_config
from mysql.connector import Error

class BookingRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho Booking.
    
    def save(self, guest_name, room_type, check_in_date, total_price, check_out_date=None, status='pending', user_id=None, room_id=None):
        """Lưu booking mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO bookings (user_id, guest_name, room_type, room_id, check_in_date, check_out_date, total_price, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (user_id, guest_name, room_type, room_id, check_in_date, check_out_date, float(total_price), status)
            cursor.execute(query, values)
            connection.commit()
            
            booking_id = cursor.lastrowid
            return Booking(str(booking_id), guest_name, room_type, check_in_date, total_price, check_out_date, status)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving booking: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_by_id(self, booking_id):
        """Tìm booking theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM bookings WHERE id = %s"
            cursor.execute(query, (booking_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_booking(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding booking: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_all(self):
        """Lấy tất cả bookings"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM bookings ORDER BY created_at DESC"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return [self._row_to_booking(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding bookings: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_user_id(self, user_id):
        """Tìm bookings theo user_id"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM bookings WHERE user_id = %s ORDER BY created_at DESC"
            cursor.execute(query, (user_id,))
            rows = cursor.fetchall()
            
            return [self._row_to_booking(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding bookings: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_room_id(self, room_id):
        """Tìm bookings theo room_id"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM bookings WHERE room_id = %s ORDER BY created_at DESC"
            cursor.execute(query, (room_id,))
            rows = cursor.fetchall()
            
            return [self._row_to_booking(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding bookings: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def update(self, booking_id, guest_name=None, room_type=None, check_in_date=None, check_out_date=None, total_price=None, status=None, room_id=None):
        """Cập nhật thông tin booking"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            # Build dynamic update query
            set_clauses = []
            values = []
            if guest_name is not None:
                set_clauses.append("guest_name = %s")
                values.append(guest_name)
            if room_type is not None:
                set_clauses.append("room_type = %s")
                values.append(room_type)
            if check_in_date is not None:
                set_clauses.append("check_in_date = %s")
                values.append(check_in_date)
            if check_out_date is not None:
                set_clauses.append("check_out_date = %s")
                values.append(check_out_date)
            if total_price is not None:
                set_clauses.append("total_price = %s")
                values.append(float(total_price))
            if status is not None:
                set_clauses.append("status = %s")
                values.append(status)
            if room_id is not None:
                set_clauses.append("room_id = %s")
                values.append(room_id)
            
            if not set_clauses:
                return self.find_by_id(booking_id)
            
            values.append(booking_id)
            query = f"UPDATE bookings SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s"
            cursor.execute(query, values)
            connection.commit()
            
            return self.find_by_id(booking_id)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error updating booking: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def delete(self, booking_id):
        """Xóa booking (thực chất là cancel - set status = 'cancelled')"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = "UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = %s"
            cursor.execute(query, (booking_id,))
            connection.commit()
            
            return cursor.rowcount > 0
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error deleting booking: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def _row_to_booking(self, row):
        """Chuyển đổi database row thành Booking object"""
        from datetime import date, datetime
        
        # Xử lý check_in_date
        if isinstance(row['check_in_date'], (date, datetime)):
            check_in_date = row['check_in_date'].strftime('%Y-%m-%d')
        else:
            check_in_date = str(row['check_in_date'])
        
        # Xử lý check_out_date
        if row['check_out_date']:
            if isinstance(row['check_out_date'], (date, datetime)):
                check_out_date = row['check_out_date'].strftime('%Y-%m-%d')
            else:
                check_out_date = str(row['check_out_date'])
        else:
            check_out_date = None
        
        return Booking(
            str(row['id']),
            row['guest_name'],
            row['room_type'],
            check_in_date,
            float(row['total_price']),
            check_out_date,
            row['status'],
            row.get('room_id'),  # room_id có thể là None
            row.get('user_id')  # user_id có thể là None
        )

