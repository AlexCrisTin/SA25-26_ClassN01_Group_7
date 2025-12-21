from .service_repository import ServiceRepository

class ServiceService:
    """Service: Xử lý logic nghiệp vụ cho Hotel Service."""

    def __init__(self):
        self.repo = ServiceRepository()

    def create_service(self, service_name, description, price, category):
        """Tạo service mới với validation"""
        if price <= 0:
            raise ValueError("Invalid Data: Price must be positive.")
        if not service_name:
            raise ValueError("Invalid Data: Service name is required.")
        
        return self.repo.save(service_name, description, price, category)

    def get_service_details(self, service_id):
        """Lấy thông tin service theo ID"""
        service = self.repo.find_by_id(service_id)
        if not service:
            raise ValueError(f"Service with ID {service_id} not found.")
        return service

    def get_all_services(self):
        """Lấy tất cả services"""
        return self.repo.find_all()
    
    def get_services_by_category(self, category):
        """Lấy services theo category"""
        return self.repo.find_by_category(category)

