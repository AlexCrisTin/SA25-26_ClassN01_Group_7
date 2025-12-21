from repository.coupon_repository import CouponRepository
from datetime import datetime

class CouponService:
    """Service: Xử lý logic nghiệp vụ cho Coupon."""

    def __init__(self):
        self.repo = CouponRepository()

    def create_coupon(self, code, discount_type, discount_value, valid_from, valid_to, is_active=True):
        """Tạo coupon mới với validation"""
        if discount_value <= 0:
            raise ValueError("Invalid Data: Discount value must be positive.")
        if discount_type not in ['percentage', 'fixed_amount']:
            raise ValueError("Invalid Data: Discount type must be 'percentage' or 'fixed_amount'.")
        
        # Check if code already exists
        if self.repo.find_by_code(code):
            raise ValueError(f"Coupon code {code} already exists.")
        
        return self.repo.save(code, discount_type, discount_value, valid_from, valid_to, is_active)

    def get_coupon_details(self, coupon_id):
        """Lấy thông tin coupon theo ID"""
        coupon = self.repo.find_by_id(coupon_id)
        if not coupon:
            raise ValueError(f"Coupon with ID {coupon_id} not found.")
        return coupon
    
    def apply_coupon(self, code):
        """Áp dụng coupon với validation"""
        coupon = self.repo.find_by_code(code)
        if not coupon:
            raise ValueError(f"Coupon code {code} not found.")
        
        if not coupon.is_active:
            raise ValueError(f"Coupon code {code} is not active.")
        
        # Check validity (giả lập - trong thực tế cần check date)
        # current_date = datetime.now()
        # if current_date < coupon.valid_from or current_date > coupon.valid_to:
        #     raise ValueError(f"Coupon code {code} is expired or not yet valid.")
        
        return coupon

    def get_all_coupons(self):
        """Lấy tất cả coupons"""
        return self.repo.find_all()
