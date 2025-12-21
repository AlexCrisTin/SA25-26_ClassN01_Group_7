from flask import jsonify

class RoomView:
    #View: Xử lý format response cho Room API
    
    @staticmethod
    def room_created(room):
        #Response khi tạo room thành công
        return jsonify(room.to_dict()), 201
    
    @staticmethod
    def room_found(room):
        #Response khi tìm thấy room
        return jsonify(room.to_dict()), 200
    
    @staticmethod
    def rooms_found(rooms):
        #Response khi tìm thấy danh sách rooms
        return jsonify([room.to_dict() for room in rooms]), 200
    
    @staticmethod
    def room_assigned(room):
        #Response khi gán phòng thành công
        return jsonify({"message": "Room assigned successfully", "room": room.to_dict()}), 200
    
    @staticmethod
    def error_response(message, status_code=400):
            #Format response lỗi
        return jsonify({"error": message}), status_code

