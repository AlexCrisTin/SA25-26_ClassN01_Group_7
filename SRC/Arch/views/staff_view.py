from flask import jsonify

class StaffView:
    """View: Xử lý format response cho Staff API"""
    
    @staticmethod
    def staff_created(staff):
        """Response khi tạo staff thành công"""
        return jsonify(staff.to_dict()), 201
    
    @staticmethod
    def staff_found(staff):
        """Response khi tìm thấy staff"""
        return jsonify(staff.to_dict()), 200
    
    @staticmethod
    def staff_list_found(staff_list):
        """Response khi tìm thấy danh sách staff"""
        return jsonify([staff.to_dict() for staff in staff_list]), 200
    
    @staticmethod
    def staff_updated(staff):
        """Response khi cập nhật staff thành công"""
        return jsonify({"message": "Staff updated successfully", "staff": staff.to_dict()}), 200
    
    @staticmethod
    def error_response(message, status_code=400):
        """Format response lỗi"""
        return jsonify({"error": message}), status_code

