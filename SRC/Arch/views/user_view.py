from flask import jsonify

class UserView:
    #View: Xử lý format response cho User API
    
    @staticmethod
    def user_created(user):
        #Response khi tạo user thành công
        return jsonify(user.to_dict()), 201
    
    @staticmethod
    def user_found(user):
        #Response khi tìm thấy user
        return jsonify(user.to_dict()), 200
    
    @staticmethod
    def profile_updated(user):
        #Response khi cập nhật profile thành công
        return jsonify({"message": "Profile updated successfully", "user": user.to_dict()}), 200
    
    @staticmethod
    def login_success(user_data):
        #Response khi login thành công
        return jsonify({
            "message": "Login successful",
            "user": user_data
        }), 200
    
    @staticmethod
    def error_response(message, status_code=400):
        #Format response lỗi
        return jsonify({"error": message}), status_code

