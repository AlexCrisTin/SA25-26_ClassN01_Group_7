from models.coupon import Coupon
from db_config import db_config
from mysql.connector import Error
from datetime import date, datetime

class CouponRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho Coupon.
    
    def save(self, code, discount_type, discount_value, valid_from, valid_to, is_active=True, max_uses=None, min_purchase_amount=0):
        """Lưu coupon mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO coupons (code, discount_type, discount_value, valid_from, valid_to, is_active, max_uses, min_purchase_amount)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (code, discount_type, float(discount_value), valid_from, valid_to, is_active, max_uses, float(min_purchase_amount))
            cursor.execute(query, values)
            connection.commit()
            
            coupon_id = cursor.lastrowid
            return Coupon(str(coupon_id), code, discount_type, discount_value, valid_from, valid_to, is_active)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving coupon: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_by_id(self, coupon_id):
        """Tìm coupon theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM coupons WHERE id = %s"
            cursor.execute(query, (coupon_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_coupon(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding coupon: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_code(self, code):
        """Tìm coupon theo code"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM coupons WHERE code = %s"
            cursor.execute(query, (code,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_coupon(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding coupon: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_all(self):
        """Lấy tất cả coupons"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM coupons ORDER BY created_at DESC"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return [self._row_to_coupon(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding coupons: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def _row_to_coupon(self, row):
        """Chuyển đổi database row thành Coupon object"""
        # Xử lý dates
        valid_from = row['valid_from']
        if isinstance(valid_from, (date, datetime)):
            valid_from = valid_from.strftime('%Y-%m-%d')
        
        valid_to = row['valid_to']
        if isinstance(valid_to, (date, datetime)):
            valid_to = valid_to.strftime('%Y-%m-%d')
        
        return Coupon(
            str(row['id']),
            row['code'],
            row['discount_type'],
            float(row['discount_value']),
            valid_from,
            valid_to,
            bool(row['is_active'])
        )

