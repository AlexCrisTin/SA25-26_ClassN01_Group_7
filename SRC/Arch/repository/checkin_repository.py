from models.checkin import CheckIn, CheckOut

# Giả lập Database trong bộ nhớ
checkin_db = {}
checkout_db = {}
next_checkin_id = 1
next_checkout_id = 1

class CheckInRepository:
    #Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu CheckIn.
    
    def save_checkin(self, booking_id, room_id, checkin_time, receptionist_id):
        global next_checkin_id
        checkin_id = str(next_checkin_id)
        new_checkin = CheckIn(checkin_id, booking_id, room_id, checkin_time, receptionist_id)
        checkin_db[checkin_id] = new_checkin
        next_checkin_id += 1
        return new_checkin
    
    def save_checkout(self, booking_id, checkout_time, total_amount, receptionist_id):
        global next_checkout_id
        checkout_id = str(next_checkout_id)
        new_checkout = CheckOut(checkout_id, booking_id, checkout_time, total_amount, receptionist_id)
        checkout_db[checkout_id] = new_checkout
        next_checkout_id += 1
        return new_checkout

    def find_checkin_by_id(self, checkin_id):
        return checkin_db.get(checkin_id)
    
    def find_checkout_by_id(self, checkout_id):
        return checkout_db.get(checkout_id)
    
    def find_checkin_by_booking_id(self, booking_id):
        for checkin in checkin_db.values():
            if checkin.booking_id == booking_id:
                return checkin
        return None

    def find_all_checkins(self):
        return list(checkin_db.values())
    
    def find_all_checkouts(self):
        return list(checkout_db.values())

