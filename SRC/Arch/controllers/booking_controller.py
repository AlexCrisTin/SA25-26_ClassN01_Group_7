from flask import request
from models.booking_service import BookingService
from views.booking_view import BookingView

class BookingController:
    """Controller: Xử lý HTTP requests và điều phối giữa Service và View"""
    
    def __init__(self):
        self.service = BookingService()
        self.view = BookingView()
    
    def create_booking(self):
        """Xử lý POST /api/bookings"""
        data = request.json
        try:
            booking = self.service.create_booking(
                data.get('guest_name'),
                data.get('room_type'),
                data.get('check_in_date'),
                data.get('total_price')
            )
            return self.view.booking_created(booking)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def get_booking(self, booking_id):
        """Xử lý GET /api/bookings/<booking_id>"""
        try:
            booking = self.service.get_booking_details(booking_id)
            return self.view.booking_found(booking)
        except ValueError as e:
            return self.view.error_response(str(e), 404)

