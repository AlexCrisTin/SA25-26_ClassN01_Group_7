from repository.room_repository import RoomRepository

class RoomService:
    """Service: Xử lý logic nghiệp vụ cho Room."""

    def __init__(self):
        self.repo = RoomRepository()

    def create_room(self, room_number, room_type, price, status, capacity=None):
        """Tạo phòng mới với validation"""
        if price <= 0:
            raise ValueError("Invalid Data: Price must be positive.")
        if not room_number:
            raise ValueError("Invalid Data: Room number is required.")
        
        return self.repo.save(room_number, room_type, price, status, capacity)

    def get_room_details(self, room_id):
        """Lấy thông tin phòng theo ID"""
        room = self.repo.find_by_id(room_id)
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")
        return room

    def get_all_rooms(self):
        """Lấy tất cả phòng"""
        return self.repo.find_all()
    
    def search_rooms(self, room_type=None, status='available'):
        """Tìm kiếm phòng theo type và status"""
        if room_type:
            rooms = self.repo.find_by_type(room_type)
        else:
            rooms = self.repo.find_all()
        
        if status:
            rooms = [room for room in rooms if room.status == status]
        
        return rooms
    
    def assign_room(self, room_id, booking_id):
        """Gán phòng cho booking"""
        room = self.repo.find_by_id(room_id)
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")
        if room.status != 'available':
            raise ValueError(f"Room {room_id} is not available.")
        
        room.status = 'occupied'
        return room
