class Service:
    #Model: Định nghĩa cấu trúc dữ liệu Hotel Service
    
    def __init__(self, service_id, service_name, description, price, category):
        self.id = service_id
        self.service_name = service_name
        self.description = description
        self.price = price
        self.category = category  # room_service, food, laundry, etc.
        
        # Validation
        if not service_name:
            raise ValueError("Service name is required.")
        if price <= 0:
            raise ValueError("Price must be positive.")
        if not category:
            raise ValueError("Category is required.")

    def to_dict(self):
        #Chuyển đổi Service object thành dictionary
        return {
            "id": self.id,
            "service_name": self.service_name,
            "description": self.description,
            "price": self.price,
            "category": self.category
        }

