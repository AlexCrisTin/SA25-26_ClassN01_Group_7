from models.booking import Booking

# Giả lập Database trong bộ nhớ
booking_db = {}
next_id = 1

class BookingRepository:
    """Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu."""
    
    def save(self, guest_name, room_type, check_in_date, total_price):
        global next_id
        booking_id = str(next_id)
        new_booking = Booking(booking_id, guest_name, room_type, check_in_date, total_price)
        booking_db[booking_id] = new_booking
        next_id += 1
        return new_booking

    def find_by_id(self, booking_id):
        return booking_db.get(booking_id)

    def find_all(self):
        return list(booking_db.values())

