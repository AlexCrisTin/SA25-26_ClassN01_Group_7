from repository.service_repository import ServiceRepository
from repository.service_request_repository import ServiceRequestRepository

class ServiceService:
    #Service: Xử lý logic nghiệp vụ cho Hotel Service.

    def __init__(self):
        self.repo = ServiceRepository()
        self.service_request_repo = ServiceRequestRepository()

    def create_service(self, service_name, description, price, category):
        #Tạo service mới với validation
        if price <= 0:
            raise ValueError("Invalid Data: Price must be positive.")
        if not service_name:
            raise ValueError("Invalid Data: Service name is required.")
        
        return self.repo.save(service_name, description, price, category)

    def get_service_details(self, service_id):
        #Lấy thông tin service theo ID
        service = self.repo.find_by_id(service_id)
        if not service:
            raise ValueError(f"Service with ID {service_id} not found.")
        return service

    def get_all_services(self):
        #Lấy tất cả services
        return self.repo.find_all()
    
    def get_services_by_category(self, category):
        #Lấy services theo category
        return self.repo.find_by_category(category)
    
    def update_service(self, service_id, service_name=None, description=None, price=None, category=None, is_available=None):
        #Cập nhật thông tin service
        service = self.repo.find_by_id(service_id)
        if not service:
            raise ValueError(f"Service with ID {service_id} not found.")
        
        if price is not None and price <= 0:
            raise ValueError("Invalid Data: Price must be positive.")
        
        # Build update data
        update_data = {}
        if service_name:
            update_data['service_name'] = service_name
        if description is not None:
            update_data['description'] = description
        if price is not None:
            update_data['price'] = float(price)
        if category:
            update_data['category'] = category
        if is_available is not None:
            update_data['is_available'] = is_available
        
        return self.repo.update(service_id, **update_data)
    
    def delete_service(self, service_id):
        #Xóa service với kiểm tra service_requests
        service = self.repo.find_by_id(service_id)
        if not service:
            raise ValueError(f"Service with ID {service_id} not found.")
        
        # Kiểm tra xem có service_requests nào đang sử dụng service này không
        request_count = self.service_request_repo.count_by_service_id(service_id)
        if request_count > 0:
            raise ValueError(f"Không thể xóa dịch vụ này. Dịch vụ đang được sử dụng trong {request_count} yêu cầu dịch vụ. Vui lòng hủy hoặc hoàn thành các yêu cầu dịch vụ trước khi xóa.")
        
        return self.repo.delete(service_id)
    
    def create_service_request(self, booking_id, service_id, quantity=1):
        #Tạo service request mới
        service = self.repo.find_by_id(service_id)
        if not service:
            raise ValueError(f"Service with ID {service_id} not found.")
        
        if quantity <= 0:
            raise ValueError("Invalid Data: Quantity must be positive.")
        
        unit_price = service.price
        total_price = unit_price * quantity
        
        # Save service request to database
        connection = None
        try:
            from db_config import db_config
            from mysql.connector import Error
            
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO service_requests (booking_id, service_id, quantity, unit_price, total_price, status)
                VALUES (%s, %s, %s, %s, %s, 'pending')
            """
            values = (booking_id, service_id, quantity, float(unit_price), float(total_price))
            cursor.execute(query, values)
            connection.commit()
            
            service_request_id = cursor.lastrowid
            
            # Return service request data
            return {
                'id': service_request_id,
                'booking_id': booking_id,
                'service_id': service_id,
                'service_name': service.service_name,
                'quantity': quantity,
                'unit_price': unit_price,
                'total_price': total_price,
                'status': 'pending'
            }
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error creating service request: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def get_all_service_requests(self):
        #Lấy tất cả service requests
        return self.service_request_repo.find_all()
    
    def get_service_request(self, request_id):
        #Lấy thông tin service request theo ID
        request = self.service_request_repo.find_by_id(request_id)
        if not request:
            raise ValueError(f"Service request with ID {request_id} not found.")
        return request
    
    def update_service_request_status(self, request_id, status, notes=None):
        #Cập nhật status của service request
        valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
        if status not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        
        return self.service_request_repo.update_status(request_id, status, notes)