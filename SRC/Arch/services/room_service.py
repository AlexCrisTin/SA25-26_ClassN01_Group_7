from repository.room_repository import RoomRepository
from repository.booking_repository import BookingRepository
from utils.image_handler import save_image_from_base64, delete_image

class RoomService:
    #Service: Xử lý logic nghiệp vụ cho Room.

    def __init__(self):
        self.repo = RoomRepository()
        self.booking_repo = BookingRepository()

    def create_room(self, room_number, room_type, price, status, capacity=None, image_base64=None, image_filename=None):
        #Tạo phòng mới với validation
        if price <= 0:
            raise ValueError("Invalid Data: Price must be positive.")
        if not room_number:
            raise ValueError("Invalid Data: Room number is required.")
        
        # Validate status
        valid_statuses = ['available', 'occupied', 'maintenance', 'reserved']
        if status not in valid_statuses:
            raise ValueError(f"Invalid Data: Status must be one of: {', '.join(valid_statuses)}")
        
        # Validate capacity
        if capacity is not None and capacity <= 0:
            raise ValueError("Invalid Data: Capacity must be positive.")
        
        # Check if room_number already exists
        existing_rooms = self.repo.find_all()
        for room in existing_rooms:
            if room.room_number == room_number:
                raise ValueError(f"Invalid Data: Room number {room_number} already exists.")
        
        # Handle image upload
        image_url = None
        if image_base64:
            try:
                image_url = save_image_from_base64(image_base64, image_filename)
            except Exception as e:
                raise ValueError(f"Invalid Data: Error saving image - {str(e)}")
        
        return self.repo.save(room_number, room_type, price, status, capacity, image_url)

    def get_room_details(self, room_id):
        #Lấy thông tin phòng theo ID
        room = self.repo.find_by_id(room_id)
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")
        return room

    def get_all_rooms(self):
        #Lấy tất cả phòng
        return self.repo.find_all()
    
    def search_rooms(self, room_type=None, status='available', check_in_date=None, check_out_date=None):
        #Tìm kiếm phòng theo type và status
        #Nếu có check_in_date và check_out_date, kiểm tra availability theo khoảng thời gian
        if room_type and check_in_date and check_out_date:
            # Sử dụng logic kiểm tra overlap từ BookingRepository
            return self.booking_repo.find_available_rooms_by_date_range(room_type, check_in_date, check_out_date)
        else:
            # Logic cũ: chỉ lọc theo status (không kiểm tra ngày)
            if room_type:
                rooms = self.repo.find_by_type(room_type)
            else:
                rooms = self.repo.find_all()

            if status:
                rooms = [room for room in rooms if room.status == status]

            return rooms
    
    def assign_room(self, room_id, booking_id):
        #Gán phòng cho booking
        room = self.repo.find_by_id(room_id)
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")
        
        # Validate room status
        if room.status == 'occupied':
            raise ValueError(f"Room {room_id} is already occupied.")
        if room.status == 'maintenance':
            raise ValueError(f"Room {room_id} is under maintenance and cannot be assigned.")
        if room.status not in ['available', 'reserved']:
            raise ValueError(f"Room {room_id} is not available for assignment. Current status: {room.status}")
        
        room.status = 'reserved'  # Reserve room when assigned to booking
        return room
    
    def update_room(self, room_id, room_number=None, room_type=None, price=None, status=None, capacity=None, image_base64=None, image_filename=None):
        #Cập nhật thông tin phòng với validation
        room = self.repo.find_by_id(room_id)
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")
        
        # Business Rule: Cannot update room if it's occupied (unless changing status)
        if room.status == 'occupied' and status != 'occupied' and status is not None:
            raise ValueError(f"Cannot update room {room_id}: Room is currently occupied.")
        
        # Validate price if provided
        if price is not None and price <= 0:
            raise ValueError("Invalid Data: Price must be positive.")
        
        # Validate status if provided
        if status is not None:
            valid_statuses = ['available', 'occupied', 'maintenance', 'reserved']
            if status not in valid_statuses:
                raise ValueError(f"Invalid Data: Status must be one of: {', '.join(valid_statuses)}")
        
        # Validate capacity if provided
        if capacity is not None and capacity <= 0:
            raise ValueError("Invalid Data: Capacity must be positive.")
        
        # Business Rule: Check if room_number already exists (if changing room_number)
        if room_number is not None and room_number != room.room_number:
            existing_rooms = self.repo.find_all()
            for existing_room in existing_rooms:
                if existing_room.room_number == room_number and existing_room.id != room_id:
                    raise ValueError(f"Invalid Data: Room number {room_number} already exists.")
        
        # Handle image upload
        image_url = None
        if image_base64:
            # Delete old image if exists
            if room.image_url:
                delete_image(room.image_url)
            
            try:
                image_url = save_image_from_base64(image_base64, image_filename)
            except Exception as e:
                raise ValueError(f"Invalid Data: Error saving image - {str(e)}")
        
        return self.repo.update(room_id, room_number, room_type, price, status, capacity, image_url)
    
    def delete_room(self, room_id):
        #Xóa phòng với validation
        room = self.repo.find_by_id(room_id)
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")
        
        # Business Rule: Cannot delete room if it's occupied or reserved
        if room.status == 'occupied':
            raise ValueError(f"Cannot delete room {room_id}: Room is currently occupied.")
        if room.status == 'reserved':
            raise ValueError(f"Cannot delete room {room_id}: Room is reserved for a booking.")
        
        # In a real system, you might also check if there are any active bookings
        # For now, we'll allow deletion if status is 'available' or 'maintenance'
        
        result = self.repo.delete(room_id)
        if not result:
            raise ValueError(f"Failed to delete room {room_id}.")
        
        return {"message": f"Room {room_id} has been deleted successfully."}