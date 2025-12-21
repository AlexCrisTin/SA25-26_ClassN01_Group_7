from repository.coupon_repository import CouponRepository
from datetime import datetime

class CouponService:
    #Service: Xử lý logic nghiệp vụ cho Coupon.

    def __init__(self):
        self.repo = CouponRepository()

    def create_coupon(self, code, discount_type, discount_value, valid_from, valid_to, is_active=True):
        #Tạo coupon mới với validation
        if discount_value <= 0:
            raise ValueError("Invalid Data: Discount value must be positive.")
        if discount_type not in ['percentage', 'fixed_amount']:
            raise ValueError("Invalid Data: Discount type must be 'percentage' or 'fixed_amount'.")
        
        # Range validation
        if discount_type == 'percentage':
            if discount_value > 100:
                raise ValueError("Invalid Data: Percentage discount cannot exceed 100%.")
        elif discount_type == 'fixed_amount':
            if discount_value <= 0:
                raise ValueError("Invalid Data: Fixed amount discount must be positive.")
        
        # Date validation
        try:
            from_date = datetime.strptime(valid_from, "%Y-%m-%d") if isinstance(valid_from, str) else valid_from
            to_date = datetime.strptime(valid_to, "%Y-%m-%d") if isinstance(valid_to, str) else valid_to
            if to_date <= from_date:
                raise ValueError("Invalid Data: valid_to must be after valid_from.")
        except ValueError as e:
            if "Invalid Data" in str(e) or "must be after" in str(e):
                raise
            raise ValueError("Invalid Data: Date format must be YYYY-MM-DD.")
        
        # Check if code already exists
        if self.repo.find_by_code(code):
            raise ValueError(f"Coupon code {code} already exists.")
        
        return self.repo.save(code, discount_type, discount_value, valid_from, valid_to, is_active)

    def get_coupon_details(self, coupon_id):
        #Lấy thông tin coupon theo ID
        coupon = self.repo.find_by_id(coupon_id)
        if not coupon:
            raise ValueError(f"Coupon with ID {coupon_id} not found.")
        return coupon
    
    def apply_coupon(self, code):
        #Áp dụng coupon với validation
        coupon = self.repo.find_by_code(code)
        if not coupon:
            raise ValueError(f"Coupon code {code} not found.")
        
        if not coupon.is_active:
            raise ValueError(f"Coupon code {code} is not active.")
        
        # Check date validity
        try:
            current_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            from_date = datetime.strptime(coupon.valid_from, "%Y-%m-%d") if isinstance(coupon.valid_from, str) else coupon.valid_from
            to_date = datetime.strptime(coupon.valid_to, "%Y-%m-%d") if isinstance(coupon.valid_to, str) else coupon.valid_to
            
            if isinstance(from_date, datetime):
                from_date = from_date.replace(hour=0, minute=0, second=0, microsecond=0)
            if isinstance(to_date, datetime):
                to_date = to_date.replace(hour=0, minute=0, second=0, microsecond=0)
            
            if current_date < from_date:
                raise ValueError(f"Coupon code {code} is not yet valid. Valid from {coupon.valid_from}.")
            if current_date > to_date:
                raise ValueError(f"Coupon code {code} has expired. Valid until {coupon.valid_to}.")
        except ValueError as e:
            if "not yet valid" in str(e) or "has expired" in str(e):
                raise
            # Date format error - skip date check if format is invalid
        
        return coupon

    def get_all_coupons(self):
        #Lấy tất cả coupons
        return self.repo.find_all()
