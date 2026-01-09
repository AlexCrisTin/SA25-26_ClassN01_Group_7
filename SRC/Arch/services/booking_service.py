from repository.booking_repository import BookingRepository
from repository.checkin_repository import CheckInRepository
from services.room_service import RoomService
from services.payment_service import PaymentService
from datetime import datetime, timedelta

class BookingService:
    #Service: Xử lý logic nghiệp vụ, gọi xuống Repository.
    #Coordinates the reservation process: checks room availability via RoomService,
    #processes financial transactions via PaymentService, and calculates total costs.

    def __init__(self):
        self.repo = BookingRepository()
        self.checkin_repo = CheckInRepository()
        self.room_service = RoomService()
        self.payment_service = PaymentService()

    def create_booking(self, guest_name, room_type, check_in_date, total_price=None,
                       check_out_date=None, payment_method=None, payment_amount=None,
                       user_id=None):
        #Tạo booking mới với validation
        #Coordinates reservation: checks room availability, calculates costs, processes payment
        
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
            else:
                # Default check-out: 1 day after check-in
                check_out = check_in + timedelta(days=1)
                check_out_date = check_out.strftime("%Y-%m-%d")
        except ValueError as e:
            if "Invalid Data" in str(e) or "must be after" in str(e) or "cannot be" in str(e):
                raise
            raise ValueError("Invalid Data: Date format must be YYYY-MM-DD.")
        
        # Business Logic: Check room availability via RoomService
        available_rooms = self.room_service.search_rooms(room_type=room_type, status='available')
        if not available_rooms:
            raise ValueError(f"Invalid Data: No available rooms of type '{room_type}' for the requested dates.")
        
        # Calculate total price if not provided (based on room price and duration)
        if total_price is None or total_price <= 0:
            # Use the first available room's price
            room_price = available_rooms[0].price
            # Calculate number of nights
            if check_out_date:
                check_out = datetime.strptime(check_out_date, "%Y-%m-%d") if isinstance(check_out_date, str) else check_out_date
                nights = (check_out - check_in).days
            else:
                nights = 1
            total_price = room_price * nights
        
        # Create the booking (tạm ở trạng thái pending)
        booking = self.repo.save(
            guest_name,
            room_type,
            check_in_date,
            total_price,
            check_out_date,
            status='pending',
            user_id=user_id
        )
        
        # Business Logic: Process payment via PaymentService nếu có thông tin thanh toán
        # Lưu ý: Nếu thanh toán thất bại (ví không đủ tiền, lỗi payment gateway, ...),
        # booking sẽ bị hủy và lỗi được trả về cho client.
        if payment_method and payment_amount:
            try:
                self.payment_service.process_payment(
                    booking.id,
                    payment_amount,
                    payment_method,
                    user_id=user_id
                )
                # Payment được xử lý nhưng booking vẫn 'pending' cho đến khi lễ tân xác nhận
            except ValueError as e:
                # Thanh toán lỗi -> hủy booking vừa tạo và đẩy lỗi ra ngoài
                try:
                    self.repo.delete(booking.id)
                finally:
                    raise
        
        return booking

    def get_booking_details(self, booking_id):
        #Lấy thông tin booking theo ID
        booking = self.repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        return booking

    def get_all_bookings(self):
        #Lấy tất cả bookings
        return self.repo.find_all()
    
    def get_user_bookings(self, user_id):
        #Lấy bookings của user cụ thể
        if not user_id:
            raise ValueError("User ID is required.")
        return self.repo.find_by_user_id(user_id)
    
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
    
    def update_booking(self, booking_id, guest_name=None, room_type=None, check_in_date=None, check_out_date=None, total_price=None, status=None):
        #Cập nhật thông tin booking với validation
        booking = self.repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        
        # Business Rule: Cannot update booking if already checked in or checked out
        if booking.status == 'checked_in':
            raise ValueError(f"Cannot update booking {booking_id}: Guest has already checked in.")
        if booking.status == 'checked_out':
            raise ValueError(f"Cannot update booking {booking_id}: Guest has already checked out.")
        if booking.status == 'cancelled':
            raise ValueError(f"Cannot update booking {booking_id}: Booking is cancelled.")
        
        # Date validation if dates are being updated
        if check_in_date is not None or check_out_date is not None:
            try:
                check_in = datetime.strptime(check_in_date, "%Y-%m-%d") if check_in_date else datetime.strptime(booking.check_in_date, "%Y-%m-%d") if isinstance(booking.check_in_date, str) else booking.check_in_date
                check_out = datetime.strptime(check_out_date, "%Y-%m-%d") if check_out_date else (datetime.strptime(booking.check_out_date, "%Y-%m-%d") if booking.check_out_date and isinstance(booking.check_out_date, str) else booking.check_out_date)
                
                if check_out and check_out <= check_in:
                    raise ValueError("Invalid Data: Check-out date must be after check-in date.")
                
                today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                if check_in < today:
                    raise ValueError("Invalid Data: Check-in date cannot be in the past.")
            except ValueError as e:
                if "Invalid Data" in str(e) or "must be after" in str(e) or "cannot be" in str(e):
                    raise
                raise ValueError("Invalid Data: Date format must be YYYY-MM-DD.")
        
        # Validate total_price if provided
        if total_price is not None and total_price <= 0:
            raise ValueError("Invalid Data: Total price must be positive.")
        
        # If room_type is being changed, check availability
        if room_type is not None and room_type != booking.room_type:
            available_rooms = self.room_service.search_rooms(room_type=room_type, status='available')
            if not available_rooms:
                raise ValueError(f"Invalid Data: No available rooms of type '{room_type}'.")
        
        return self.repo.update(booking_id, guest_name, room_type, check_in_date, check_out_date, total_price, status)
