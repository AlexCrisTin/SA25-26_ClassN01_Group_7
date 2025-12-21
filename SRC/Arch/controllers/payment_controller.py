from flask import request
from services.payment_service import PaymentService
from views.payment_view import PaymentView

class PaymentController:
    """Controller: Xử lý HTTP requests cho Payment"""
    
    def __init__(self):
        self.service = PaymentService()
        self.view = PaymentView()
    
    def process_payment(self):
        """Xử lý POST /api/payments"""
        data = request.json
        try:
            payment = self.service.process_payment(
                data.get('booking_id'),
                data.get('amount'),
                data.get('payment_method'),
                data.get('transaction_id')
            )
            return self.view.payment_processed(payment)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def get_payment(self, payment_id):
        """Xử lý GET /api/payments/<payment_id>"""
        try:
            payment = self.service.get_payment_details(payment_id)
            return self.view.payment_found(payment)
        except ValueError as e:
            return self.view.error_response(str(e), 404)
    
    def get_payments_by_booking(self, booking_id):
        """Xử lý GET /api/bookings/<booking_id>/payments"""
        try:
            payments = self.service.get_payments_by_booking(booking_id)
            return self.view.payments_found(payments)
        except ValueError as e:
            return self.view.error_response(str(e), 400)

