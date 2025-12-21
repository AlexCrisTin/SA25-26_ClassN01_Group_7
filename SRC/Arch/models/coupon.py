class Coupon:
    #Model: Định nghĩa cấu trúc dữ liệu Coupon
    
    def __init__(self, coupon_id, code, discount_type, discount_value, valid_from, valid_to, is_active=True):
        self.id = coupon_id
        self.code = code
        self.discount_type = discount_type  # percentage, fixed_amount
        self.discount_value = discount_value
        self.valid_from = valid_from
        self.valid_to = valid_to
        self.is_active = is_active
        
        # Validation
        if not code:
            raise ValueError("Coupon code is required.")
        if discount_value <= 0:
            raise ValueError("Discount value must be positive.")
        valid_types = ['percentage', 'fixed_amount']
        if discount_type not in valid_types:
            raise ValueError(f"Discount type must be one of: {', '.join(valid_types)}")
        if discount_type == 'percentage' and discount_value > 100:
            raise ValueError("Percentage discount cannot exceed 100%.")

    def to_dict(self):
        #Chuyển đổi Coupon object thành dictionary
        return {
            "id": self.id,
            "code": self.code,
            "discount_type": self.discount_type,
            "discount_value": self.discount_value,
            "valid_from": self.valid_from,
            "valid_to": self.valid_to,
            "is_active": self.is_active
        }

