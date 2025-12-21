from flask import jsonify

class CheckInView:
    """View: Xử lý format response cho CheckIn/CheckOut API"""
    
    @staticmethod
    def checkin_processed(checkin):
        """Response khi xử lý check-in thành công"""
        return jsonify(checkin.to_dict()), 201
    
    @staticmethod
    def checkout_processed(checkout):
        """Response khi xử lý check-out thành công"""
        return jsonify(checkout.to_dict()), 201
    
    @staticmethod
    def checkin_found(checkin):
        """Response khi tìm thấy check-in"""
        return jsonify(checkin.to_dict()), 200
    
    @staticmethod
    def error_response(message, status_code=400):
        """Format response lỗi"""
        return jsonify({"error": message}), status_code

