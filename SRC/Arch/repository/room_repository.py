from models.room import Room

# Giả lập Database trong bộ nhớ
room_db = {}
next_room_id = 1

class RoomRepository:
            #Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu Room.
    
    def save(self, room_number, room_type, price, status, capacity=None):
        global next_room_id
        room_id = str(next_room_id)
        new_room = Room(room_id, room_number, room_type, price, status, capacity)
        room_db[room_id] = new_room
        next_room_id += 1
        return new_room

    def find_by_id(self, room_id):
        return room_db.get(room_id)

    def find_all(self):
        return list(room_db.values())
    
    def find_by_status(self, status):
        return [room for room in room_db.values() if room.status == status]
    
    def find_by_type(self, room_type):
        return [room for room in room_db.values() if room.room_type == room_type]
    
    def update(self, room_id, room_number=None, room_type=None, price=None, status=None, capacity=None):
        #Cập nhật thông tin phòng
        room = room_db.get(room_id)
        if not room:
            return None
        
        # Update only provided fields
        if room_number is not None:
            room.room_number = room_number
        if room_type is not None:
            room.room_type = room_type
        if price is not None:
            room.price = price
        if status is not None:
            room.status = status
        if capacity is not None:
            room.capacity = capacity
        
        return room
    
    def delete(self, room_id):
        #Xóa phòng khỏi database
        if room_id in room_db:
            del room_db[room_id]
            return True
        return False

