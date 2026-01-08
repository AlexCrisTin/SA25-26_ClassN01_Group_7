from flask import request
from services.checkin_service import CheckInService
from views.checkin_view import CheckInView

class CheckInController:
    #Controller: Xử lý HTTP requests cho CheckIn/CheckOut
    
    def __init__(self):
        self.service = CheckInService()
        self.view = CheckInView()
    
    def process_checkin(self):
        #Xử lý POST /api/checkins
        data = request.json
        try:
            checkin = self.service.process_checkin(
                data.get('booking_id'),
                data.get('room_id'),
                data.get('checkin_time'),
                data.get('receptionist_id')
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

