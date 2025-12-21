from flask import request
from models.room_service import RoomService
from views.room_view import RoomView

class RoomController:
    """Controller: Xử lý HTTP requests cho Room"""
    
    def __init__(self):
        self.service = RoomService()
        self.view = RoomView()
    
    def search_rooms(self):
        """Xử lý GET /api/rooms/search"""
        room_type = request.args.get('room_type')
        status = request.args.get('status', 'available')
        
        try:
            rooms = self.service.search_rooms(room_type, status)
            return self.view.rooms_found(rooms)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def get_room(self, room_id):
        """Xử lý GET /api/rooms/<room_id>"""
        try:
            room = self.service.get_room_details(room_id)
            return self.view.room_found(room)
        except ValueError as e:
            return self.view.error_response(str(e), 404)
    
    def get_all_rooms(self):
        """Xử lý GET /api/rooms"""
        try:
            rooms = self.service.get_all_rooms()
            return self.view.rooms_found(rooms)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def create_room(self):
        """Xử lý POST /api/rooms"""
        data = request.json
        try:
            room = self.service.create_room(
                data.get('room_number'),
                data.get('room_type'),
                data.get('price'),
                data.get('status', 'available'),
                data.get('capacity')
            )
            return self.view.room_created(room)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def assign_room(self):
        """Xử lý POST /api/rooms/assign"""
        data = request.json
        try:
            room = self.service.assign_room(
                data.get('room_id'),
                data.get('booking_id')
            )
            return self.view.room_assigned(room)
        except ValueError as e:
            return self.view.error_response(str(e), 400)

