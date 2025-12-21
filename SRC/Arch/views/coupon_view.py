from flask import jsonify

class CouponView:
    #View: Xử lý format response cho Coupon API
    
    @staticmethod
    def coupon_created(coupon):
        #Response khi tạo coupon thành công
        return jsonify(coupon.to_dict()), 201
    
    @staticmethod
    def coupon_found(coupon):
        #Response khi tìm thấy coupon
        return jsonify(coupon.to_dict()), 200
    
    @staticmethod
    def coupon_applied(coupon):
        #Response khi áp dụng coupon thành công
        return jsonify({"message": "Coupon applied successfully", "coupon": coupon.to_dict()}), 200
    
    @staticmethod
    def error_response(message, status_code=400):
        #Format response lỗi
        return jsonify({"error": message}), status_code

