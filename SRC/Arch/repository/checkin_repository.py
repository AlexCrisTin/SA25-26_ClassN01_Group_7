from models.checkin import CheckIn, CheckOut
from db_config import db_config
from mysql.connector import Error
from datetime import datetime

class CheckInRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho CheckIn/CheckOut.
    
    def save_checkin(self, booking_id, room_id, receptionist_id=None, guest_count=1, notes=None):
        """Lưu check-in mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO checkins (booking_id, room_id, receptionist_id, guest_count, notes)
                VALUES (%s, %s, %s, %s, %s)
            """
            values = (booking_id, room_id, receptionist_id, guest_count, notes)
            cursor.execute(query, values)
            connection.commit()
            
            checkin_id = cursor.lastrowid
            # Get the created checkin to return with timestamp
            checkin = self.find_checkin_by_id(str(checkin_id))
            return checkin
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving checkin: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def save_checkout(self, booking_id, total_amount, receptionist_id=None, additional_charges=0, refund_amount=0, payment_status='pending', notes=None):
        """Lưu check-out mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO checkouts (booking_id, receptionist_id, total_amount, additional_charges, refund_amount, payment_status, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            values = (booking_id, receptionist_id, float(total_amount), float(additional_charges), float(refund_amount), payment_status, notes)
            cursor.execute(query, values)
            connection.commit()
            
            checkout_id = cursor.lastrowid
            # Get the created checkout to return with timestamp
            checkout = self.find_checkout_by_id(str(checkout_id))
            return checkout
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving checkout: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_checkin_by_id(self, checkin_id):
        """Tìm check-in theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM checkins WHERE id = %s"
            cursor.execute(query, (checkin_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_checkin(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding checkin: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_checkout_by_id(self, checkout_id):
        """Tìm check-out theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM checkouts WHERE id = %s"
            cursor.execute(query, (checkout_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_checkout(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding checkout: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_checkin_by_booking_id(self, booking_id):
        """Tìm check-in theo booking_id"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM checkins WHERE booking_id = %s"
            cursor.execute(query, (booking_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_checkin(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding checkin: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_checkout_by_booking_id(self, booking_id):
        """Tìm check-out theo booking_id"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM checkouts WHERE booking_id = %s"
            cursor.execute(query, (booking_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_checkout(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding checkout: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_all_checkins(self):
        """Lấy tất cả check-ins"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM checkins ORDER BY checkin_time DESC"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return [self._row_to_checkin(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding checkins: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_all_checkouts(self):
        """Lấy tất cả check-outs"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM checkouts ORDER BY checkout_time DESC"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return [self._row_to_checkout(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding checkouts: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def _row_to_checkin(self, row):
        """Chuyển đổi database row thành CheckIn object"""
        checkin_time = row['checkin_time']
        if isinstance(checkin_time, datetime):
            checkin_time = checkin_time.isoformat()
        
        return CheckIn(
            str(row['id']),
            row['booking_id'],
            row['room_id'],
            checkin_time,
            row['receptionist_id']
        )
    
    def _row_to_checkout(self, row):
        """Chuyển đổi database row thành CheckOut object"""
        checkout_time = row['checkout_time']
        if isinstance(checkout_time, datetime):
            checkout_time = checkout_time.isoformat()
        
        return CheckOut(
            str(row['id']),
            row['booking_id'],
            checkout_time,
            float(row['total_amount']),
            row['receptionist_id']
        )

