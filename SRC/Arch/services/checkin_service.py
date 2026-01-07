from repository.checkin_repository import CheckInRepository
from repository.room_repository import RoomRepository
from repository.booking_repository import BookingRepository
from repository.staff_repository import StaffRepository

class CheckInService:
    #Service: Xử lý logic nghiệp vụ cho CheckIn/CheckOut.

    def __init__(self):
        self.checkin_repo = CheckInRepository()
        self.room_repo = RoomRepository()
        self.booking_repo = BookingRepository()
        self.staff_repo = StaffRepository()

    def process_checkin(self, booking_id, room_id, checkin_time=None, receptionist_id=None, guest_count=1, notes=None):
        #Xử lý check-in với validation
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
        
        # Check if room is available
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
        
        # Try to find staff_id from user_id if receptionist_id is provided
        staff_id_for_checkin = None
        if receptionist_id:
            # receptionist_id might be user_id, try to find staff record
            staff = self.staff_repo.find_by_user_id(receptionist_id)
            if staff:
                staff_id_for_checkin = staff.id
            # If not found, set to None (foreign key allows NULL)
        
        # Update room status to occupied
        self.room_repo.update(room_id, status='occupied')
        
        # Update booking status to checked_in and assign room_id
        self.booking_repo.update(booking_id, status='checked_in', room_id=room_id)
        
        return self.checkin_repo.save_checkin(booking_id, room_id, staff_id_for_checkin, guest_count, notes)

    def process_checkout(self, booking_id, checkout_time=None, total_amount=None, receptionist_id=None, additional_charges=0, refund_amount=0, notes=None):
        #Xử lý check-out với validation
        # Check if booking exists
        booking = self.booking_repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        
        # Check if booking is already checked out
        if booking.status == 'checked_out':
            raise ValueError(f"Booking {booking_id} has already been checked out.")
        
        # Check if checked in (by status or check-in record)
        checkin = self.checkin_repo.find_checkin_by_booking_id(booking_id)
        
        # If booking status is checked_in but no check-in record exists, create one
        if booking.status == 'checked_in' and not checkin:
            # Try to get room_id from booking
            if not booking.room_id:
                raise ValueError(f"Cannot checkout: Booking {booking_id} is marked as checked-in but has no room assigned.")
            
            # Try to find staff_id from user_id if receptionist_id is provided
            staff_id_for_checkin = None
            if receptionist_id:
                # receptionist_id might be user_id, try to find staff record
                staff = self.staff_repo.find_by_user_id(receptionist_id)
                if staff:
                    staff_id_for_checkin = staff.id
                # If not found, set to None (foreign key allows NULL)
            
            # Create a check-in record retroactively
            checkin = self.checkin_repo.save_checkin(
                booking_id, 
                booking.room_id, 
                staff_id_for_checkin,  # Use staff.id, not user.id
                1,  # default guest_count
                "Auto-created during checkout"  # notes
            )
        
        # If still no check-in record and status is not checked_in, raise error
        if not checkin and booking.status != 'checked_in':
            raise ValueError(f"Cannot checkout: Booking {booking_id} has not been checked in yet.")
        
        # Check if already checked out (by checking checkout records)
        existing_checkouts = self.checkin_repo.find_all_checkouts()
        existing_checkout = next((c for c in existing_checkouts if c.booking_id == booking_id), None)
        if existing_checkout:
            raise ValueError(f"Booking {booking_id} has already been checked out.")
        
        # Use booking total_price if total_amount not provided
        if total_amount is None:
            total_amount = booking.total_price or 0
        
        # Get room_id from checkin or booking
        room_id = checkin.room_id if checkin else booking.room_id
        
        # Update room status to available
        if room_id:
            room = self.room_repo.find_by_id(room_id)
            if room:
                self.room_repo.update(room_id, status='available')
        
        # Try to find staff_id from user_id if receptionist_id is provided
        staff_id_for_checkout = None
        if receptionist_id:
            # receptionist_id might be user_id, try to find staff record
            staff = self.staff_repo.find_by_user_id(receptionist_id)
            if staff:
                staff_id_for_checkout = staff.id
            # If not found, set to None (foreign key allows NULL)
        
        # Update booking status to checked_out
        self.booking_repo.update(booking_id, status='checked_out')
        
        # payment_status must be one of: 'paid', 'pending', 'partial'
        # Since checkout means payment is completed, use 'paid'
        return self.checkin_repo.save_checkout(booking_id, total_amount, staff_id_for_checkout, additional_charges, refund_amount, 'paid', notes)

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
