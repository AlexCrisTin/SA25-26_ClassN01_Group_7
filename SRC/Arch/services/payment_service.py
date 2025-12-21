from repository.payment_repository import PaymentRepository

class PaymentService:
    """Service: Xử lý logic nghiệp vụ cho Payment."""

    def __init__(self):
        self.repo = PaymentRepository()

    def process_payment(self, booking_id, amount, payment_method, transaction_id=None):
        """Xử lý thanh toán với validation"""
        if amount <= 0:
            raise ValueError("Invalid Data: Amount must be positive.")
        if not payment_method:
            raise ValueError("Invalid Data: Payment method is required.")
        
        # Process payment (giả lập)
        status = 'completed'  # Trong thực tế sẽ gọi payment gateway
        
        return self.repo.save(booking_id, amount, payment_method, status, transaction_id)

    def get_payment_details(self, payment_id):
        """Lấy thông tin payment theo ID"""
        payment = self.repo.find_by_id(payment_id)
        if not payment:
            raise ValueError(f"Payment with ID {payment_id} not found.")
        return payment
    
    def get_payments_by_booking(self, booking_id):
        """Lấy tất cả payments của một booking"""
        return self.repo.find_by_booking_id(booking_id)

    def get_all_payments(self):
        """Lấy tất cả payments"""
        return self.repo.find_all()
