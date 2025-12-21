from .payment import Payment

# Giả lập Database trong bộ nhớ
payment_db = {}
next_payment_id = 1

class PaymentRepository:
    """Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu Payment."""
    
    def save(self, booking_id, amount, payment_method, status, transaction_id=None):
        global next_payment_id
        payment_id = str(next_payment_id)
        new_payment = Payment(payment_id, booking_id, amount, payment_method, status, transaction_id)
        payment_db[payment_id] = new_payment
        next_payment_id += 1
        return new_payment

    def find_by_id(self, payment_id):
        return payment_db.get(payment_id)
    
    def find_by_booking_id(self, booking_id):
        return [payment for payment in payment_db.values() if payment.booking_id == booking_id]

    def find_all(self):
        return list(payment_db.values())

