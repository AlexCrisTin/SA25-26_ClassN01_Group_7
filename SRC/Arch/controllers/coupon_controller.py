from flask import request
from services.coupon_service import CouponService
from views.coupon_view import CouponView

class CouponController:
    #Controller: Xử lý HTTP requests cho Coupon
    
    def __init__(self):
        self.service = CouponService()
        self.view = CouponView()
    
    def create_coupon(self):
        #Xử lý POST /api/coupons
        data = request.json
        try:
            coupon = self.service.create_coupon(
                data.get('code'),
                data.get('discount_type'),
                data.get('discount_value'),
                data.get('valid_from'),
                data.get('valid_to'),
                data.get('is_active', True)
            )
            return self.view.coupon_created(coupon)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def apply_coupon(self):
        #Xử lý POST /api/coupons/apply
        data = request.json
        try:
            coupon = self.service.apply_coupon(data.get('code'))
            return self.view.coupon_applied(coupon)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def get_coupon(self, coupon_id):
        #Xử lý GET /api/coupons/<coupon_id>
        try:
            coupon = self.service.get_coupon_details(coupon_id)
            return self.view.coupon_found(coupon)
        except ValueError as e:
            return self.view.error_response(str(e), 404)

