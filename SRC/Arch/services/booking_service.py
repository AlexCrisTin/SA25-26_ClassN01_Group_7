from repository.booking_repository import BookingRepository
from repository.checkin_repository import CheckInRepository
from datetime import datetime

class BookingService:
    #Service: Xử lý logic nghiệp vụ, gọi xuống Repository.

    def __init__(self):
        self.repo = BookingRepository()
        self.checkin_repo = CheckInRepository()

    def create_booking(self, guest_name, room_type, check_in_date, total_price, check_out_date=None):
        #Tạo booking mới với validation
        if total_price <= 0:
            raise ValueError("Invalid Data: Total price must be positive.")
        if not guest_name or not room_type or not check_in_date:
            raise ValueError("Invalid Data: Guest name, room type, and check-in date are required.")
        
        # Date validation
        try:
            check_in = datetime.strptime(check_in_date, "%Y-%m-%d") if isinstance(check_in_date, str) else check_in_date
            today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            if check_in < today:
                raise ValueError("Invalid Data: Check-in date cannot be in the past.")
            
            if check_out_date:
                check_out = datetime.strptime(check_out_date, "%Y-%m-%d") if isinstance(check_out_date, str) else check_out_date
                if check_out <= check_in:
                    raise ValueError("Invalid Data: Check-out date must be after check-in date.")
        except ValueError as e:
            if "Invalid Data" in str(e) or "must be after" in str(e) or "cannot be" in str(e):
                raise
            raise ValueError("Invalid Data: Date format must be YYYY-MM-DD.")
        
        return self.repo.save(guest_name, room_type, check_in_date, total_price, check_out_date)

    def get_booking_details(self, booking_id):
        #Lấy thông tin booking theo ID
        booking = self.repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        return booking

    def get_all_bookings(self):
        #Lấy tất cả bookings
        return self.repo.find_all()
    
    def cancel_booking(self, booking_id):
        #Hủy booking với validation
        booking = self.repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        
        # Check if booking can be cancelled
        if booking.status == 'checked_in':
            raise ValueError(f"Cannot cancel booking {booking_id}: Guest has already checked in.")
        if booking.status == 'checked_out':
            raise ValueError(f"Cannot cancel booking {booking_id}: Guest has already checked out.")
        if booking.status == 'cancelled':
            raise ValueError(f"Booking {booking_id} is already cancelled.")
        
        # Check if check-in exists
        checkin = self.checkin_repo.find_checkin_by_booking_id(booking_id)
        if checkin:
            raise ValueError(f"Cannot cancel booking {booking_id}: Check-in record exists.")
        
        booking.status = 'cancelled'
        self.repo.delete(booking_id)
        return {"message": f"Booking {booking_id} has been cancelled successfully."}
