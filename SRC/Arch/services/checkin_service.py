from repository.checkin_repository import CheckInRepository
from repository.room_repository import RoomRepository
from repository.booking_repository import BookingRepository
from repository.staff_repository import StaffRepository
from repository.service_request_repository import ServiceRequestRepository

class CheckInService:
    #Service: Xử lý logic nghiệp vụ cho CheckIn/CheckOut.

    def __init__(self):
        self.checkin_repo = CheckInRepository()
        self.room_repo = RoomRepository()
        self.booking_repo = BookingRepository()
        self.staff_repo = StaffRepository()
        self.service_request_repo = ServiceRequestRepository()
    
    def process_checkin(self, booking_id, receptionist_id, room_id=None):
        """
        Xử lý check-in với validation.
        Nếu không truyền room_id, hệ thống sẽ tự động chọn một phòng trống phù hợp
        với loại phòng đã đặt (booking.room_type).
        """
        # Check if booking exists
        booking = self.booking_repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        
        # Check if booking is cancelled
        if booking.status == 'cancelled':
            raise ValueError(f"Cannot check-in cancelled booking {booking_id}.")
        
        # Check if already checked in
        existing_checkin = self.checkin_repo.find_checkin_by_booking_id(booking_id)
        if existing_checkin:
            raise ValueError(f"Booking {booking_id} has already been checked in.")
        
        # Tự động chọn phòng trống nếu room_id không được truyền lên
        if room_id is None:
            rooms_by_type = self.room_repo.find_by_type(booking.room_type)
            available_rooms = [r for r in rooms_by_type if r.status in ['available', 'reserved']]
            
            if not available_rooms:
                raise ValueError(f"No available rooms of type '{booking.room_type}' for check-in.")
            
            # Chọn phòng đầu tiên phù hợp
            room = available_rooms[0]
            room_id = room.id
        else:
            room = self.room_repo.find_by_id(room_id)
            if not room:
                raise ValueError(f"Room with ID {room_id} not found.")
        
        # Validate room status
        valid_statuses = ['available', 'reserved']
        if room.status not in valid_statuses:
            raise ValueError(f"Room {room_id} is not available for check-in. Current status: {room.status}")
        
        # Check room type match (optional but recommended)
        if room.room_type != booking.room_type:
            raise ValueError(f"Room type mismatch: Room is {room.room_type}, but booking requires {booking.room_type}.")
        
        # Update room status trong database
        self.room_repo.update(room_id, status='occupied')
        
        # Update booking status + gán room_id cho booking trong database
        self.booking_repo.update(booking_id, status='checked_in', room_id=room_id)

        # Đảm bảo receptionist_id hợp lệ với bảng staff (FK constraint)
        valid_receptionist_id = None
        if receptionist_id:
            try:
                # receptionist_id từ frontend là user.id; nếu không khớp staff.id,
                # ta không gán để tránh lỗi FK (sẽ lưu NULL)
                staff = self.staff_repo.find_by_id(receptionist_id)
                if staff:
                    valid_receptionist_id = staff.id
            except Exception:
                valid_receptionist_id = None
        
        # Lưu bản ghi check-in (thời gian checkin do DB tự sinh)
        return self.checkin_repo.save_checkin(booking_id, room_id, valid_receptionist_id)

    def process_checkout(self, booking_id, checkout_time, total_amount=None, receptionist_id=None):
        #Xử lý check-out với validation
        # Check if booking exists
        booking = self.booking_repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        
        # Check if checked in
        checkin = self.checkin_repo.find_checkin_by_booking_id(booking_id)
        if not checkin:
            raise ValueError(f"Cannot checkout: No check-in found for booking {booking_id}.")
        
        # Check if already checked out
        existing_checkouts = self.checkin_repo.find_all_checkouts()
        existing_checkout = next((c for c in existing_checkouts if c.booking_id == booking_id), None)
        if existing_checkout:
            raise ValueError(f"Booking {booking_id} has already been checked out.")
        
        # Tính tổng tiền: booking.total_price + chi phí dịch vụ
        booking_base_price = booking.total_price or 0.0
        service_cost = self.service_request_repo.get_total_service_cost(booking_id)
        
        # Nếu total_amount không được truyền, tự động tính
        if total_amount is None:
            total_amount = booking_base_price + service_cost
        
        # Update room status to available trong database
        room = self.room_repo.find_by_id(checkin.room_id)
        if room:
            self.room_repo.update(room.id, status='available')
        
        # Update booking status trong database
        self.booking_repo.update(booking_id, status='checked_out')

        # Đảm bảo receptionist_id hợp lệ với bảng staff (FK constraint)
        valid_receptionist_id = None
        if receptionist_id:
            try:
                staff = self.staff_repo.find_by_id(receptionist_id)
                if staff:
                    valid_receptionist_id = staff.id
            except Exception:
                valid_receptionist_id = None

        # Lưu bản ghi checkout; checkout_time do DB tự sinh, total_amount là tổng tiền cuối cùng
        return self.checkin_repo.save_checkout(booking_id, total_amount, valid_receptionist_id)
    
    def get_service_requests_for_booking(self, booking_id):
        """Lấy danh sách service requests của booking"""
        return self.service_request_repo.find_by_booking_id(booking_id)
    
    def calculate_total_checkout_amount(self, booking_id):
        """Tính tổng tiền checkout bao gồm cả dịch vụ"""
        booking = self.booking_repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        
        booking_base_price = booking.total_price or 0.0
        service_cost = self.service_request_repo.get_total_service_cost(booking_id)
        
        return {
            'booking_price': booking_base_price,
            'service_cost': service_cost,
            'total_amount': booking_base_price + service_cost
        }

    def get_checkin_details(self, checkin_id):
        #Lấy thông tin check-in theo ID
        checkin = self.checkin_repo.find_checkin_by_id(checkin_id)
        if not checkin:
            raise ValueError(f"Check-in with ID {checkin_id} not found.")
        return checkin
    
    def get_checkout_details(self, checkout_id):
        #Lấy thông tin check-out theo ID
        checkout = self.checkin_repo.find_checkout_by_id(checkout_id)
        if not checkout:
            raise ValueError(f"Check-out with ID {checkout_id} not found.")
        return checkout

    def cancel_checkin(self, booking_id, receptionist_id=None):
        """Hủy check-in: reset room về available, booking về confirmed, xóa check-in record"""
        # Check if check-in exists
        checkin = self.checkin_repo.find_checkin_by_booking_id(booking_id)
        if not checkin:
            raise ValueError(f"No check-in found for booking {booking_id}.")

        # Check if booking is still checked in
        booking = self.booking_repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        if booking.status != 'checked_in':
            raise ValueError(f"Cannot cancel check-in: Booking {booking_id} is not checked in (status: {booking.status}).")

        # Reset room status to available
        room = self.room_repo.find_by_id(checkin.room_id)
        if room:
            self.room_repo.update(room.id, status='available')

        # Reset booking status to confirmed
        self.booking_repo.update(booking_id, status='confirmed')

        # Delete check-in record (có thể cần log cho audit trail)
        # Note: Trong thực tế có thể cần lưu log thay vì xóa hoàn toàn
        # self.checkin_repo.delete_checkin(checkin.id)

        return {"message": f"Check-in for booking {booking_id} has been cancelled successfully."}
