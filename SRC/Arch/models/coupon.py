class Coupon:
    """Model: Định nghĩa cấu trúc dữ liệu Coupon"""
    
    def __init__(self, coupon_id, code, discount_type, discount_value, valid_from, valid_to, is_active=True):
        self.id = coupon_id
        self.code = code
        self.discount_type = discount_type  # percentage, fixed_amount
        self.discount_value = discount_value
        self.valid_from = valid_from
        self.valid_to = valid_to
        self.is_active = is_active

    def to_dict(self):
        """Chuyển đổi Coupon object thành dictionary"""
        return {
            "id": self.id,
            "code": self.code,
            "discount_type": self.discount_type,
            "discount_value": self.discount_value,
            "valid_from": self.valid_from,
            "valid_to": self.valid_to,
            "is_active": self.is_active
        }

