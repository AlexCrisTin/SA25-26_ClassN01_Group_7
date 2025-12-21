class CheckIn:
    #Model: Định nghĩa cấu trúc dữ liệu CheckIn
    
    def __init__(self, checkin_id, booking_id, room_id, checkin_time, receptionist_id):
        self.id = checkin_id
        self.booking_id = booking_id
        self.room_id = room_id
        self.checkin_time = checkin_time
        self.receptionist_id = receptionist_id

    def to_dict(self):
        #Chuyển đổi CheckIn object thành dictionary
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "room_id": self.room_id,
            "checkin_time": self.checkin_time,
            "receptionist_id": self.receptionist_id
        }


class CheckOut:
    """Model: Định nghĩa cấu trúc dữ liệu CheckOut"""
    
    def __init__(self, checkout_id, booking_id, checkout_time, total_amount, receptionist_id):
        self.id = checkout_id
        self.booking_id = booking_id
        self.checkout_time = checkout_time
        self.total_amount = total_amount
        self.receptionist_id = receptionist_id

    def to_dict(self):
        """Chuyển đổi CheckOut object thành dictionary"""
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "checkout_time": self.checkout_time,
            "total_amount": self.total_amount,
            "receptionist_id": self.receptionist_id
        }

