from repository.room_repository import RoomRepository

class RoomService:
    #Service: Xử lý logic nghiệp vụ cho Room (đơn giản hóa cho microservice).

    def __init__(self):
        self.repo = RoomRepository()

    def create_room(self, room_number, room_type, price, status, capacity=None, image_url=None):
        #Tạo phòng mới với validation
        if price <= 0:
            raise ValueError("Price must be positive.")
        if not room_number:
            raise ValueError("Room number is required.")

        # Validate status
        valid_statuses = ['available', 'occupied', 'maintenance', 'reserved']
        if status not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")

        # Validate capacity
        if capacity is not None and capacity <= 0:
            raise ValueError("Capacity must be positive.")

        # Check if room_number already exists
        existing_rooms = self.repo.find_all()
        for room in existing_rooms:
            if room.room_number == room_number:
                raise ValueError(f"Room number {room_number} already exists.")

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

    def search_rooms(self, room_type=None, status='available'):
        #Tìm kiếm phòng theo type và status
        if room_type:
            rooms = self.repo.find_by_type(room_type)
        else:
            rooms = self.repo.find_all()

        if status:
            rooms = [room for room in rooms if room.status == status]

        return rooms

    def update_room(self, room_id, room_number=None, room_type=None, price=None, status=None, capacity=None, image_url=None):
        #Cập nhật thông tin phòng với validation
        room = self.repo.find_by_id(room_id)
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")

        # Validate price if provided
        if price is not None and price <= 0:
            raise ValueError("Price must be positive.")

        # Validate status if provided
        if status is not None:
            valid_statuses = ['available', 'occupied', 'maintenance', 'reserved']
            if status not in valid_statuses:
                raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")

        # Validate capacity if provided
        if capacity is not None and capacity <= 0:
            raise ValueError("Capacity must be positive.")

        # Check if room_number already exists (if changing room_number)
        if room_number is not None and room_number != room.room_number:
            existing_rooms = self.repo.find_all()
            for existing_room in existing_rooms:
                if existing_room.room_number == room_number and existing_room.id != room_id:
                    raise ValueError(f"Room number {room_number} already exists.")

        return self.repo.update(room_id, room_number, room_type, price, status, capacity, image_url)

    def delete_room(self, room_id):
        #Xóa phòng với validation cơ bản
        room = self.repo.find_by_id(room_id)
        if not room:
            raise ValueError(f"Room with ID {room_id} not found.")

        # Business Rule: Cannot delete room if it's occupied
        if room.status == 'occupied':
            raise ValueError(f"Cannot delete room {room_id}: Room is currently occupied.")

        result = self.repo.delete(room_id)
        if not result:
            raise ValueError(f"Failed to delete room {room_id}.")

        return {"message": f"Room {room_id} has been deleted successfully."}
