from flask import request
from services.user_service import UserService
from views.user_view import UserView

class UserController:
    #Controller: Xử lý HTTP requests cho User
    
    def __init__(self):
        self.service = UserService()
        self.view = UserView()
    
    def create_user(self):
        #Xử lý POST /api/users
        data = request.json
        try:
            user = self.service.create_user(
                data.get('username'),
                data.get('email'),
                data.get('password'),
                data.get('full_name'),
                data.get('phone'),
                data.get('role', 'user')
            )
            return self.view.user_created(user)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def get_user(self, user_id):
        #Xử lý GET /api/users/<user_id>
        try:
            user = self.service.get_user_details(user_id)
            return self.view.user_found(user)
        except ValueError as e:
            return self.view.error_response(str(e), 404)
    
    def update_profile(self, user_id):
            #Xử lý PUT /api/users/<user_id>/profile
        data = request.json
        try:
            user = self.service.update_profile(
                user_id,
                data.get('full_name'),
                data.get('phone'),
                data.get('email')
            )
            return self.view.profile_updated(user)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def login(self):
        #Xử lý POST /api/auth/login
        data = request.json
        try:
            user = self.service.authenticate_user(
                data.get('username'),
                data.get('password')
            )
            return self.view.login_success(user)
        except ValueError as e:
            return self.view.error_response(str(e), 401)

