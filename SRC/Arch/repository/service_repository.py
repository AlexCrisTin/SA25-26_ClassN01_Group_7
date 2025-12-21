from models.service import Service

# Giả lập Database trong bộ nhớ
service_db = {}
next_service_id = 1

class ServiceRepository:
    #Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu Service.
    
    def save(self, service_name, description, price, category):
        global next_service_id
        service_id = str(next_service_id)
        new_service = Service(service_id, service_name, description, price, category)
        service_db[service_id] = new_service
        next_service_id += 1
        return new_service

    def find_by_id(self, service_id):
        return service_db.get(service_id)

    def find_all(self):
        return list(service_db.values())
    
    def find_by_category(self, category):
        return [service for service in service_db.values() if service.category == category]

