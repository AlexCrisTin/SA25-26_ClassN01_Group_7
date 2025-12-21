from repository.checkin_repository import CheckInRepository
from repository.room_repository import RoomRepository

class CheckInService:
    """Service: Xử lý logic nghiệp vụ cho CheckIn/CheckOut."""

    def __init__(self):
        self.checkin_repo = CheckInRepository()
        self.room_repo = RoomRepository()

    def process_checkin(self, booking_id, room_id, checkin_time, receptionist_id):
        """Xử lý check-in với validation"""
        # Check if room is available
        room = self.room_repo.find_by_id(room_id)
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")
        if room.status != 'available' and room.status != 'reserved':
            raise ValueError(f"Room {room_id} is not available for check-in.")
        
        # Update room status
        room.status = 'occupied'
        
        return self.checkin_repo.save_checkin(booking_id, room_id, checkin_time, receptionist_id)

    def process_checkout(self, booking_id, checkout_time, total_amount, receptionist_id):
        """Xử lý check-out với validation"""
        checkin = self.checkin_repo.find_checkin_by_booking_id(booking_id)
        if not checkin:
            raise ValueError(f"No check-in found for booking {booking_id}.")
        
        # Update room status to available
        room = self.room_repo.find_by_id(checkin.room_id)
        if room:
            room.status = 'available'
        
        return self.checkin_repo.save_checkout(booking_id, checkout_time, total_amount, receptionist_id)

    def get_checkin_details(self, checkin_id):
        """Lấy thông tin check-in theo ID"""
        checkin = self.checkin_repo.find_checkin_by_id(checkin_id)
        if not checkin:
            raise ValueError(f"Check-in with ID {checkin_id} not found.")
        return checkin
    
    def get_checkout_details(self, checkout_id):
        """Lấy thông tin check-out theo ID"""
        checkout = self.checkin_repo.find_checkout_by_id(checkout_id)
        if not checkout:
            raise ValueError(f"Check-out with ID {checkout_id} not found.")
        return checkout
