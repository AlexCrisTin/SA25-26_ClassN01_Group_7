class User:
    #Model: Định nghĩa cấu trúc dữ liệu User
    
    def __init__(self, user_id, username, email, password, full_name, phone, role='user'):
        self.id = user_id
        self.username = username
        self.email = email
        self.password = password
        self.full_name = full_name
        self.phone = phone
        self.role = role  # user, receptionist, administrator
        
        # Validation
        if not username or not email:
            raise ValueError("Username and email are required.")
        valid_roles = ['user', 'receptionist', 'administrator']
        if role not in valid_roles:
            raise ValueError(f"Role must be one of: {', '.join(valid_roles)}")
        # Basic email format validation
        if '@' not in email or '.' not in email.split('@')[1]:
            raise ValueError("Invalid email format.")

    def to_dict(self):
        #Chuyển đổi User object thành dictionary
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "phone": self.phone,
            "role": self.role
        }

