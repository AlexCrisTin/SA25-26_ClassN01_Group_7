class Payment:
    #Model: Định nghĩa cấu trúc dữ liệu Payment
    
    def __init__(self, payment_id, booking_id, amount, payment_method, status, transaction_id=None):
        self.id = payment_id
        self.booking_id = booking_id
        self.amount = amount
        self.payment_method = payment_method  # credit_card, cash, bank_transfer
        self.status = status  # pending, completed, failed, refunded
        self.transaction_id = transaction_id
        
        # Validation
        if amount <= 0:
            raise ValueError("Amount must be positive.")
        if not payment_method:
            raise ValueError("Payment method is required.")
        valid_methods = ['credit_card', 'cash', 'bank_transfer']
        if payment_method not in valid_methods:
            raise ValueError(f"Payment method must be one of: {', '.join(valid_methods)}")
        valid_statuses = ['pending', 'completed', 'failed', 'refunded']
        if status not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")

    def to_dict(self):
        #Chuyển đổi Payment object thành dictionary
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "amount": self.amount,
            "payment_method": self.payment_method,
            "status": self.status,
            "transaction_id": self.transaction_id
        }

