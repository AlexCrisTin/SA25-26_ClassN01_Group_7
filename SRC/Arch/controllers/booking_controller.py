from flask import request
from services.booking_service import BookingService
from views.booking_view import BookingView

class BookingController:  
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
    
    def get_all_bookings(self):
        """Xử lý GET /api/bookings"""
        try:
            bookings = self.service.get_all_bookings()
            return self.view.bookings_found(bookings)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def cancel_booking(self, booking_id):
        """Xử lý DELETE /api/bookings/<booking_id>"""
        try:
            result = self.service.cancel_booking(booking_id)
            return self.view.booking_cancelled(result)
        except ValueError as e:
            return self.view.error_response(str(e), 400)

