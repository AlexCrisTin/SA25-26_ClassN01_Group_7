from flask import request
from services.service_service import ServiceService
from views.service_view import ServiceView

class ServiceController:
    #Controller: Xử lý HTTP requests cho Hotel Service
    
    def __init__(self):
        self.service = ServiceService()
        self.view = ServiceView()
    
    def create_service(self):
        #Xử lý POST /api/services
        data = request.json
        try:
            service = self.service.create_service(
                data.get('service_name'),
                data.get('description'),
                data.get('price'),
                data.get('category')
            )
            return self.view.service_created(service)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def get_service(self, service_id):
        #Xử lý GET /api/services/<service_id>
        try:
            service = self.service.get_service_details(service_id)
            return self.view.service_found(service)
        except ValueError as e:
            return self.view.error_response(str(e), 404)
    
    def get_all_services(self):
        #Xử lý GET /api/services
        try:
            services = self.service.get_all_services()
            return self.view.services_found(services)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def request_service(self):
        #Xử lý POST /api/services/request
        data = request.json
        try:
            # In real implementation, this would create a service request
            service = self.service.get_service_details(data.get('service_id'))
            return self.view.service_requested(service)
        except ValueError as e:
            return self.view.error_response(str(e), 400)

