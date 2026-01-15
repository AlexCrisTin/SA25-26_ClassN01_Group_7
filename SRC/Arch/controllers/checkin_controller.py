from flask import request
from services.checkin_service import CheckInService
from views.checkin_view import CheckInView

class CheckInController:

    def __init__(self):
        self.service = CheckInService()
        self.view = CheckInView()
    
    def process_checkin(self):
        #Xử lý POST /api/checkins
        data = request.json
        try:
            checkin = self.service.process_checkin(
                data.get('booking_id'),
                data.get('receptionist_id'),
                data.get('room_id')
            )
            return self.view.checkin_processed(checkin)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def process_checkout(self):
        #Xử lý POST /api/checkouts
        data = request.json
        try:
            checkout = self.service.process_checkout(
                data.get('booking_id'),
                data.get('checkout_time'),
                data.get('total_amount'),
                data.get('receptionist_id')
            )
            return self.view.checkout_processed(checkout)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def get_checkin(self, checkin_id):
        #Xử lý GET /api/checkins/<checkin_id>
        try:
            checkin = self.service.get_checkin_details(checkin_id)
            return self.view.checkin_found(checkin)
        except ValueError as e:
            return self.view.error_response(str(e), 404)
    
    def get_checkout_summary(self, booking_id):
        #Xử lý GET /api/checkouts/summary/<booking_id> - Lấy thông tin tổng hợp cho checkout
        from flask import request
        from services.booking_service import BookingService
        
        try:
            # Check if booking exists and user has permission
            booking_service = BookingService()
            booking = booking_service.get_booking_details(booking_id)
            
            # Get current user
            current_user = getattr(request, 'current_user', None)
            if not current_user:
                return self.view.error_response("User not authenticated", 401)
            
            # Check permission: user can only view their own booking, unless they are admin/receptionist
            user_role = getattr(current_user, 'role', 'user')
            is_admin_or_receptionist = user_role in ['administrator', 'receptionist']
            
            # Check if booking belongs to current user
            booking_user_id = getattr(booking, 'user_id', None)
            current_user_id = getattr(current_user, 'id', None)
            
            # Convert to string for comparison (IDs might be stored as strings or ints)
            booking_user_id_str = str(booking_user_id) if booking_user_id is not None else None
            current_user_id_str = str(current_user_id) if current_user_id is not None else None
            
            if not is_admin_or_receptionist and booking_user_id_str != current_user_id_str:
                return self.view.error_response("Access denied. You can only view your own booking summary.", 403)
            
            service_requests = self.service.get_service_requests_for_booking(booking_id)
            total_info = self.service.calculate_total_checkout_amount(booking_id)
            return self.view.checkout_summary(service_requests, total_info)
        except ValueError as e:
            return self.view.error_response(str(e), 400)

