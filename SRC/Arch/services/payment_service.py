from repository.payment_repository import PaymentRepository
from repository.booking_repository import BookingRepository
from services.wallet_service import WalletService

class PaymentService:
    #Service: Xử lý logic nghiệp vụ cho Payment.

    def __init__(self):
        self.repo = PaymentRepository()
        self.booking_repo = BookingRepository()
        self.wallet_service = WalletService()

    def process_payment(self, booking_id, amount, payment_method, transaction_id=None, user_id=None):
        #Xử lý thanh toán với validation
        if amount <= 0:
            raise ValueError("Invalid Data: Amount must be positive.")
        if not payment_method:
            raise ValueError("Invalid Data: Payment method is required.")
        
        # Validate payment method
        valid_methods = ['credit_card', 'cash', 'bank_transfer']
        if payment_method not in valid_methods:
            raise ValueError(f"Invalid Data: Payment method must be one of: {', '.join(valid_methods)}")
        
        # Check if booking exists
        booking = self.booking_repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Invalid Data: Booking with ID {booking_id} not found.")
        
        # Check if booking is cancelled
        if booking.status == 'cancelled':
            raise ValueError(f"Cannot process payment for cancelled booking {booking_id}.")
        
        # Check total payment amount
        existing_payments = self.repo.find_by_booking_id(booking_id)
        total_paid = sum(p.amount for p in existing_payments if p.status == 'completed')
        remaining = booking.total_price - total_paid
        if remaining <= 0:
            raise ValueError("Invalid Data: Booking has already been fully paid.")
        if amount > remaining:
            # Chỉ cho phép thanh toán tối đa bằng phần còn lại
            amount = remaining

        # Nếu dùng ví (cash trong hệ thống demo này), trừ tiền trong ví trước
        if payment_method == 'cash' and user_id is not None:
            # Nếu ví không đủ, báo lỗi rõ ràng
            wallet = self.wallet_service.get_wallet(user_id)
            if wallet.balance < amount:
                raise ValueError("Insufficient wallet balance to complete payment.")
            # Trừ ví
            self.wallet_service.deduct(user_id, amount)

        # Process payment (giả lập)
        status = 'completed'  # Trong thực tế sẽ gọi payment gateway

        payment = self.repo.save(booking_id, amount, payment_method, status, transaction_id)

        # Note: Payment completion does NOT automatically confirm booking
        # Receptionist must manually confirm booking after verifying payment
        # This ensures proper workflow: Payment -> Receptionist Review -> Confirmation

        return payment

    def get_payment_details(self, payment_id):
        #Lấy thông tin payment theo ID
        payment = self.repo.find_by_id(payment_id)
        if not payment:
            raise ValueError(f"Payment with ID {payment_id} not found.")
        return payment
    
    def get_payments_by_booking(self, booking_id):
        #Lấy tất cả payments của một booking
        return self.repo.find_by_booking_id(booking_id)

    def get_all_payments(self):
        #Lấy tất cả payments với thông tin booking
        return self.repo.find_all()

    def get_payments_by_booking(self, booking_id):
        #Lấy tất cả payments của một booking
        return self.repo.find_by_booking_id(booking_id)
