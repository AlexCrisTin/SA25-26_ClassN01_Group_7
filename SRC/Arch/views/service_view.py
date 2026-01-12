from flask import jsonify

class ServiceView:
    #View: Xử lý format response cho Service API
    
    @staticmethod
    def service_created(service):
        #Response khi tạo service thành công
        return jsonify(service.to_dict()), 201
    
    @staticmethod
    def service_found(service):
        #Response khi tìm thấy service
        return jsonify(service.to_dict()), 200
    
    @staticmethod
    def services_found(services):
        #Response khi tìm thấy danh sách services
        return jsonify([service.to_dict() for service in services]), 200
    
    @staticmethod
    def service_requested(service_request):
        #Response khi request service thành công
        return jsonify({"message": "Service requested successfully", "service_request": service_request}), 201
    
    @staticmethod
    def service_updated(service):
        #Response khi cập nhật service thành công
        return jsonify({"message": "Service updated successfully", "service": service.to_dict()}), 200
    
    @staticmethod
    def service_deleted():
        #Response khi xóa service thành công
        return jsonify({"message": "Service deleted successfully"}), 200
    
    @staticmethod
    def service_requests_found(requests):
        #Response khi tìm thấy danh sách service requests
        return jsonify(requests), 200
    
    @staticmethod
    def service_request_found(request):
        #Response khi tìm thấy service request
        return jsonify(request), 200
    
    @staticmethod
    def service_request_updated(request):
        #Response khi cập nhật service request thành công
        return jsonify({"message": "Service request updated successfully", "service_request": request}), 200
    
    @staticmethod
    def error_response(message, status_code=400):
            #Format response lỗi
        return jsonify({"error": message}), status_code

