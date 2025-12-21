class Room:
    """Model: Định nghĩa cấu trúc dữ liệu Room"""
    
    def __init__(self, room_id, room_number, room_type, price, status, capacity=None):
        self.id = room_id
        self.room_number = room_number
        self.room_type = room_type  # single, double, suite, etc.
        self.price = price
        self.status = status  # available, occupied, maintenance, reserved
        self.capacity = capacity

    def to_dict(self):
        """Chuyển đổi Room object thành dictionary"""
        return {
            "id": self.id,
            "room_number": self.room_number,
            "room_type": self.room_type,
            "price": self.price,
            "status": self.status,
            "capacity": self.capacity
        }

