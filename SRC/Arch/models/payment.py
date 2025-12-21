class Payment:
    """Model: Định nghĩa cấu trúc dữ liệu Payment"""
    
    def __init__(self, payment_id, booking_id, amount, payment_method, status, transaction_id=None):
        self.id = payment_id
        self.booking_id = booking_id
        self.amount = amount
        self.payment_method = payment_method  # credit_card, cash, bank_transfer
        self.status = status  # pending, completed, failed, refunded
        self.transaction_id = transaction_id

    def to_dict(self):
        """Chuyển đổi Payment object thành dictionary"""
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "amount": self.amount,
            "payment_method": self.payment_method,
            "status": self.status,
            "transaction_id": self.transaction_id
        }

