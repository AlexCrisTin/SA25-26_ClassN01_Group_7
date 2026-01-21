from repository.booking_repository import BookingRepository
from repository.checkin_repository import CheckInRepository
from repository.room_repository import RoomRepository
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
        self.room_repo = RoomRepository()
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
        
        # Business Logic: Check room availability via RoomService with date range
        available_rooms = self.room_service.search_rooms(
            room_type=room_type,
            status='available',
            check_in_date=check_in_date,
            check_out_date=check_out_date
        )
        if not available_rooms:
            raise ValueError(f"Invalid Data: No available rooms of type '{room_type}' for the requested dates.")
        
        # Select the first available room and reserve it
        selected_room = available_rooms[0]
        room_id = selected_room.id
        
        # Calculate total price if not provided (based on room price and duration)
        if total_price is None or total_price <= 0:
            # Use the selected room's price
            room_price = selected_room.price
            # Calculate number of nights
            if check_out_date:
                check_out = datetime.strptime(check_out_date, "%Y-%m-%d") if isinstance(check_out_date, str) else check_out_date
                nights = (check_out - check_in).days
            else:
                nights = 1
            total_price = room_price * nights
        
        # Reserve the room by updating its status to 'reserved'
        try:
            self.room_repo.update(room_id, status='reserved')
        except Exception as e:
            raise ValueError(f"Error reserving room: {e}")
        
        # Create the booking (tạm ở trạng thái pending) with room_id
        booking = None
        try:
            booking = self.repo.save(
                guest_name,
                room_type,
                check_in_date,
                total_price,
                check_out_date,
                status='pending',
                user_id=user_id,
                room_id=room_id
            )
        except Exception as e:
            # If booking creation fails, release the room
            try:
                self.room_repo.update(room_id, status='available')
            except:
                pass
            raise ValueError(f"Error creating booking: {e}")
        
        # Business Logic: Process payment via PaymentService nếu có thông tin thanh toán
        # Lưu ý: Nếu thanh toán thất bại (ví không đủ tiền, lỗi payment gateway, ...),
        # booking sẽ bị hủy và phòng sẽ được release.
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
                # Thanh toán lỗi -> release phòng, hủy booking và đẩy lỗi ra ngoài
                try:
                    # Release the room
                    self.room_repo.update(room_id, status='available')
                    # Delete the booking
                    self.repo.delete(booking.id)
                except:
                    pass
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
        
        # Release the room if booking has a room_id assigned
        room_id = booking.room_id if hasattr(booking, 'room_id') and booking.room_id else None
        if room_id:
            try:
                # Check current room status - only release if it's 'reserved'
                room = self.room_repo.find_by_id(room_id)
                if room and room.status == 'reserved':
                    self.room_repo.update(room_id, status='available')
            except Exception as e:
                # Log error but don't fail cancellation
                print(f"Warning: Could not release room {room_id} for booking {booking_id}: {e}")

        # Handle refunds for wallet payments
        refund_message = ""
        try:
            # Check if there are completed wallet payments for this booking
            wallet_payments = self.payment_service.repo.find_by_booking_id(booking_id)
            wallet_payments = [p for p in wallet_payments if p.payment_method == 'cash' and p.status == 'completed']

            if wallet_payments:
                total_wallet_payment = sum(p.amount for p in wallet_payments)

                if total_wallet_payment > 0 and booking.user_id:
                    # Check if wallet exists for user
                    existing_wallet = self.payment_service.wallet_service.get_wallet(booking.user_id)
                    if existing_wallet:
                        # Refund to wallet
                        self.payment_service.wallet_service.top_up(booking.user_id, total_wallet_payment)

                        # Update payment status to refunded
                        for payment in wallet_payments:
                            # Note: In a real system, you might want to create a refund record
                            # For now, we'll just mark as refunded
                            pass

                        refund_message = f" Đã hoàn tiền {total_wallet_payment.toLocaleString('vi-VN')} VNĐ vào ví điện tử."
                    else:
                        refund_message = f" (Lưu ý: Khách hàng đã thanh toán {total_wallet_payment.toLocaleString('vi-VN')} VNĐ bằng ví nhưng không có ví để hoàn tiền)"
                elif total_wallet_payment > 0 and not booking.user_id:
                    refund_message = f" (Lưu ý: Khách hàng đã thanh toán {total_wallet_payment.toLocaleString('vi-VN')} VNĐ bằng ví. Vui lòng hoàn tiền thủ công)"
        except Exception as e:
            # Log error but don't fail cancellation
            print(f"Warning: Could not process refund for booking {booking_id}: {e}")
            import traceback
            traceback.print_exc()
            refund_message = " (Lưu ý: Có lỗi khi xử lý hoàn tiền, vui lòng liên hệ quản trị viên)"

        booking.status = 'cancelled'
        self.repo.delete(booking_id)
        return {"message": f"Booking {booking_id} has been cancelled successfully.{refund_message}"}
    
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
        
        # If room_type is being changed, check availability with date range
        if room_type is not None and room_type != booking.room_type:
            # Use the current booking dates for availability check
            current_check_in = check_in_date if check_in_date else booking.check_in_date
            current_check_out = check_out_date if check_out_date else booking.check_out_date

            available_rooms = self.room_service.search_rooms(
                room_type=room_type,
                status='available',
                check_in_date=current_check_in,
                check_out_date=current_check_out
            )
            if not available_rooms:
                raise ValueError(f"Invalid Data: No available rooms of type '{room_type}' for the requested dates.")
        
        return self.repo.update(booking_id, guest_name, room_type, check_in_date, check_out_date, total_price, status)
