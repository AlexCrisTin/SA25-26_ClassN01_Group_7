from flask import Flask, jsonify
from flask_cors import CORS
from controllers.room_controller import RoomController

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {"origins": "*"}
})

# Initialize controller
room_controller = RoomController()

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint để kiểm tra service có hoạt động không"""
    return jsonify({
        "status": "healthy",
        "service": "room-service",
        "version": "1.0.0"
    }), 200

# ========== ROOM ROUTES ==========
@app.route('/api/rooms', methods=['GET'])
def get_all_rooms():
    """Lấy tất cả rooms"""
    return room_controller.get_all_rooms()

@app.route('/api/rooms/search', methods=['GET'])
def search_rooms():
    """Tìm kiếm rooms"""
    return room_controller.search_rooms()

@app.route('/api/rooms/<room_id>', methods=['GET'])
def get_room(room_id):
    """Lấy thông tin room theo ID"""
    return room_controller.get_room(room_id)

@app.route('/api/rooms', methods=['POST'])
def create_room():
    """Tạo room mới"""
    return room_controller.create_room()

@app.route('/api/rooms/<room_id>', methods=['PUT'])
def update_room(room_id):
    """Cập nhật room"""
    return room_controller.update_room(room_id)

@app.route('/api/rooms/<room_id>', methods=['DELETE'])
def delete_room(room_id):
    """Xóa room"""
    return room_controller.delete_room(room_id)

if __name__ == '__main__':
    # Chạy trên port 5001 để không conflict với monolith (port 5000)
    app.run(debug=True, host='127.0.0.1', port=5001)
