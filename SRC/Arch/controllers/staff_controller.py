from flask import request
from services.staff_service import StaffService
from views.staff_view import StaffView

class StaffController:
    """Controller: Xử lý HTTP requests cho Staff"""
    
    def __init__(self):
        self.service = StaffService()
        self.view = StaffView()
    
    def create_staff(self):
        """Xử lý POST /api/staff"""
        data = request.json
        try:
            staff = self.service.create_staff(
                data.get('full_name'),
                data.get('email'),
                data.get('phone'),
                data.get('position'),
                data.get('department'),
                data.get('hire_date'),
                data.get('is_active', True)
            )
            return self.view.staff_created(staff)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def get_staff(self, staff_id):
        """Xử lý GET /api/staff/<staff_id>"""
        try:
            staff = self.service.get_staff_details(staff_id)
            return self.view.staff_found(staff)
        except ValueError as e:
            return self.view.error_response(str(e), 404)
    
    def get_all_staff(self):
        """Xử lý GET /api/staff"""
        try:
            staff_list = self.service.get_all_staff()
            return self.view.staff_list_found(staff_list)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def update_staff(self, staff_id):
        """Xử lý PUT /api/staff/<staff_id>"""
        data = request.json
        try:
            staff = self.service.update_staff(
                staff_id,
                data.get('full_name'),
                data.get('email'),
                data.get('phone'),
                data.get('position'),
                data.get('is_active')
            )
            return self.view.staff_updated(staff)
        except ValueError as e:
            return self.view.error_response(str(e), 400)

