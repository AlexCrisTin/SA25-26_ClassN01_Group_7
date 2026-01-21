from models.payment import Payment
from db_config import db_config
from mysql.connector import Error

class PaymentRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho Payment.
    
    def save(self, booking_id, amount, payment_method, status, transaction_id=None, payment_date=None):
        """Lưu payment mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id, payment_date)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            values = (booking_id, float(amount), payment_method, status, transaction_id, payment_date)
            cursor.execute(query, values)
            connection.commit()
            
            payment_id = cursor.lastrowid
            return Payment(str(payment_id), booking_id, amount, payment_method, status, transaction_id)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving payment: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_by_id(self, payment_id):
        """Tìm payment theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM payments WHERE id = %s"
            cursor.execute(query, (payment_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_payment(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding payment: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_booking_id(self, booking_id):
        """Tìm payments theo booking_id"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM payments WHERE booking_id = %s ORDER BY created_at DESC"
            cursor.execute(query, (booking_id,))
            rows = cursor.fetchall()
            
            return [self._row_to_payment(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding payments: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_all(self):
        """Lấy tất cả payments với thông tin booking"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)

            query = """
                SELECT p.*, b.guest_name, b.room_type
                FROM payments p
                LEFT JOIN bookings b ON p.booking_id = b.id
                ORDER BY p.created_at DESC
            """
            cursor.execute(query)
            rows = cursor.fetchall()

            # Convert rows to payment objects with booking info
            payments = []
            for row in rows:
                payment = self._row_to_payment(row)
                payment.booking = {
                    'guest_name': row.get('guest_name'),
                    'room_type': row.get('room_type')
                } if row.get('guest_name') else None
                payments.append(payment)

            return payments
        except Error as e:
            raise ValueError(f"Error finding payments: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def _row_to_payment(self, row):
        """Chuyển đổi database row thành Payment object"""
        # Convert datetime/date objects to ISO strings for JSON serialization
        payment_date = row.get('payment_date')
        created_at = row.get('created_at')
        try:
            from datetime import datetime, date
            if isinstance(payment_date, (datetime, date)):
                payment_date = payment_date.isoformat()
            if isinstance(created_at, (datetime, date)):
                created_at = created_at.isoformat()
        except Exception:
            pass

        return Payment(
            str(row['id']),
            row['booking_id'],
            float(row['amount']),
            row['payment_method'],
            row['status'],
            row['transaction_id'],
            payment_date,
            created_at
        )

