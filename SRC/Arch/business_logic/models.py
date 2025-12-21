class Booking:
    def __init__(self, booking_id, guest_name, room_type, check_in_date, total_price):
        self.id = booking_id
        self.guest_name = guest_name
        self.room_type = room_type
        self.check_in_date = check_in_date
        self.total_price = total_price

    def to_dict(self):
 
        return {
            "id": self.id,
            "guest_name": self.guest_name,
            "room_type": self.room_type,
            "check_in_date": self.check_in_date,
            "total_price": self.total_price
        }