from repository.user_repository import UserRepository

class UserService:
    """Service: Xử lý logic nghiệp vụ cho User."""

    def __init__(self):
        self.repo = UserRepository()

    def create_user(self, username, email, password, full_name, phone, role='user'):
        """Tạo user mới với validation"""
        if not username or not email:
            raise ValueError("Invalid Data: Username and email are required.")
        
        # Check if username already exists
        if self.repo.find_by_username(username):
            raise ValueError(f"Username {username} already exists.")
        
        # Check if email already exists
        if self.repo.find_by_email(email):
            raise ValueError(f"Email {email} already exists.")
        
        return self.repo.save(username, email, password, full_name, phone, role)

    def get_user_details(self, user_id):
        """Lấy thông tin user theo ID"""
        user = self.repo.find_by_id(user_id)
        if not user:
            raise ValueError(f"User with ID {user_id} not found.")
        return user
    
    def get_user_by_username(self, username):
        """Lấy user theo username"""
        user = self.repo.find_by_username(username)
        if not user:
            raise ValueError(f"User with username {username} not found.")
        return user

    def get_all_users(self):
        """Lấy tất cả users"""
        return self.repo.find_all()
    
    def update_profile(self, user_id, full_name=None, phone=None, email=None):
        """Cập nhật thông tin profile"""
        user = self.repo.find_by_id(user_id)
        if not user:
            raise ValueError(f"User with ID {user_id} not found.")
        
        if full_name:
            user.full_name = full_name
        if phone:
            user.phone = phone
        if email:
            if self.repo.find_by_email(email) and self.repo.find_by_email(email).id != user_id:
                raise ValueError(f"Email {email} already exists.")
            user.email = email
        
        return user
