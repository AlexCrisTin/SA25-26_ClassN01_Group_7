from models.coupon import Coupon

# Giả lập Database trong bộ nhớ
coupon_db = {}
next_coupon_id = 1

class CouponRepository:
    """Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu Coupon."""
    
    def save(self, code, discount_type, discount_value, valid_from, valid_to, is_active=True):
        global next_coupon_id
        coupon_id = str(next_coupon_id)
        new_coupon = Coupon(coupon_id, code, discount_type, discount_value, valid_from, valid_to, is_active)
        coupon_db[coupon_id] = new_coupon
        next_coupon_id += 1
        return new_coupon

    def find_by_id(self, coupon_id):
        return coupon_db.get(coupon_id)
    
    def find_by_code(self, code):
        for coupon in coupon_db.values():
            if coupon.code == code:
                return coupon
        return None

    def find_all(self):
        return list(coupon_db.values())

