from persistence.booking_repository import BookingRepository

class BookingService:
    """Layer 2: Xử lý logic nghiệp vụ, gọi xuống Persistence."""

    def __init__(self):
        self.repo = BookingRepository() 

    def create_booking(self, guest_name, room_type, check_in_date, total_price):

        if total_price <= 0:
            raise ValueError("Invalid Data: Total price must be positive.")
        
       
        return self.repo.save(guest_name, room_type, check_in_date, total_price)

    def get_booking_details(self, booking_id):
        booking = self.repo.find_by_id(booking_id)
        if not booking:
            raise ValueError(f"Booking with ID {booking_id} not found.")
        return booking

    def get_all_bookings(self):
        return self.repo.find_all()