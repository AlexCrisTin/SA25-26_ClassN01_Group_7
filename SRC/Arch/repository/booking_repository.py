from models.booking import Booking

# Giả lập Database trong bộ nhớ
booking_db = {}
next_id = 1

class BookingRepository:
    #Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu.
    
    def save(self, guest_name, room_type, check_in_date, total_price, check_out_date=None, status='pending'):
        global next_id
        booking_id = str(next_id)
        new_booking = Booking(booking_id, guest_name, room_type, check_in_date, total_price, check_out_date, status)
        booking_db[booking_id] = new_booking
        next_id += 1
        return new_booking

    def find_by_id(self, booking_id):
        return booking_db.get(booking_id)

    def find_all(self):
        return list(booking_db.values())
    
    def update(self, booking_id, guest_name=None, room_type=None, check_in_date=None, check_out_date=None, total_price=None, status=None):
        #Cập nhật thông tin booking
        booking = booking_db.get(booking_id)
        if not booking:
            return None
        
        # Update only provided fields
        if guest_name is not None:
            booking.guest_name = guest_name
        if room_type is not None:
            booking.room_type = room_type
        if check_in_date is not None:
            booking.check_in_date = check_in_date
        if check_out_date is not None:
            booking.check_out_date = check_out_date
        if total_price is not None:
            booking.total_price = total_price
        if status is not None:
            booking.status = status
        
        return booking
    
    def delete(self, booking_id):
        #Xóa booking
        if booking_id in booking_db:
            del booking_db[booking_id]
            return True
        return False

