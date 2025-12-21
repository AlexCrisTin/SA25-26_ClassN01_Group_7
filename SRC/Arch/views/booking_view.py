from flask import jsonify

class BookingView:
    """View: Xử lý format response cho API"""
    
    @staticmethod
    def success_response(data, status_code=200):
        """Format response thành công"""
        return jsonify(data), status_code
    
    @staticmethod
    def error_response(message, status_code=400):
        """Format response lỗi"""
        return jsonify({"error": message}), status_code
    
    @staticmethod
    def booking_created(booking):
        """Response khi tạo booking thành công"""
        return jsonify(booking.to_dict()), 201
    
    @staticmethod
    def booking_found(booking):
        """Response khi tìm thấy booking"""
        return jsonify(booking.to_dict()), 200

