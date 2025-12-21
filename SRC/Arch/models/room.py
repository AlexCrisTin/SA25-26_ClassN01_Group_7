class Room:
    #Model: Định nghĩa cấu trúc dữ liệu Room
    
    def __init__(self, room_id, room_number, room_type, price, status, capacity=None):
        self.id = room_id
        self.room_number = room_number
        self.room_type = room_type  # single, double, suite, etc.
        self.price = price
        self.status = status  # available, occupied, maintenance, reserved
        self.capacity = capacity
        
        # Validation
        if price <= 0:
            raise ValueError("Price must be positive.")
        if not room_number:
            raise ValueError("Room number is required.")
        valid_statuses = ['available', 'occupied', 'maintenance', 'reserved']
        if status not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
        if capacity is not None and capacity <= 0:
            raise ValueError("Capacity must be positive.")

    def to_dict(self):
        #Chuyển đổi Room object thành dictionary
        return {
            "id": self.id,
            "room_number": self.room_number,
            "room_type": self.room_type,
            "price": self.price,
            "status": self.status,
            "capacity": self.capacity
        }

