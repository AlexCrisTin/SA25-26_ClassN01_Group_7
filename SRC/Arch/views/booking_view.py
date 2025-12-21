from flask import jsonify

class BookingView:
    """View: Xử lý format response cho API"""
    @staticmethod
    def success_response(data, status_code=200):
        return jsonify(data), status_code
    
    @staticmethod
    def error_response(message, status_code=400):
        return jsonify({"error": message}), status_code
    
    @staticmethod
    def booking_created(booking):
        return jsonify(booking.to_dict()), 201
    
    @staticmethod
    def booking_found(booking):
        return jsonify(booking.to_dict()), 200
    
    @staticmethod
    def bookings_found(bookings):
        """Response khi tìm thấy danh sách bookings"""
        return jsonify([booking.to_dict() for booking in bookings]), 200
    
    @staticmethod
    def booking_cancelled(result):
        """Response khi hủy booking thành công"""
        return jsonify(result), 200

