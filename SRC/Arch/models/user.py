class User:
    """Model: Định nghĩa cấu trúc dữ liệu User"""
    
    def __init__(self, user_id, username, email, password, full_name, phone, role='user'):
        self.id = user_id
        self.username = username
        self.email = email
        self.password = password
        self.full_name = full_name
        self.phone = phone
        self.role = role  # user, receptionist, administrator

    def to_dict(self):
        """Chuyển đổi User object thành dictionary"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "phone": self.phone,
            "role": self.role
        }

