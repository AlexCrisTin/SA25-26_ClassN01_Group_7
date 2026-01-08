from datetime import datetime

class Booking:
    #Model: Định nghĩa cấu trúc dữ liệu Booking
    
    def __init__(self, booking_id, guest_name, room_type, check_in_date, total_price, check_out_date=None, status='pending'):
        self.id = booking_id
        self.guest_name = guest_name
        self.room_type = room_type
        self.check_in_date = check_in_date
        self.check_out_date = check_out_date
        self.total_price = total_price
        self.status = status  # pending, confirmed, cancelled, checked_in, checked_out
        
        # Validation
        if total_price <= 0:
            raise ValueError("Total price must be positive.")
        if not guest_name or not room_type or not check_in_date:
            raise ValueError("Guest name, room type, and check-in date are required.")
        
        # Date validation
        try:
            check_in = datetime.strptime(check_in_date, "%Y-%m-%d") if isinstance(check_in_date, str) else check_in_date
            if check_out_date:
                check_out = datetime.strptime(check_out_date, "%Y-%m-%d") if isinstance(check_out_date, str) else check_out_date
                if check_out <= check_in:
                    raise ValueError("Check-out date must be after check-in date.")
        except ValueError as e:
            if "must be after" in str(e):
                raise
            # Invalid date format - sẽ được validate ở service layer

    def to_dict(self):
        return {
            "id": self.id,
            "guest_name": self.guest_name,
            "room_type": self.room_type,
            "check_in_date": self.check_in_date,
            "check_out_date": self.check_out_date,
            "total_price": self.total_price,
            "status": self.status
        }

