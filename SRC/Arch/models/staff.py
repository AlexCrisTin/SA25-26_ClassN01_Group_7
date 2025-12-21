class Staff:
    #Model: Định nghĩa cấu trúc dữ liệu Staff
    
    def __init__(self, staff_id, full_name, email, phone, position, department, hire_date, is_active=True):
        self.id = staff_id
        self.full_name = full_name
        self.email = email
        self.phone = phone
        self.position = position  # receptionist, manager, cleaner, etc.
        self.department = department
        self.hire_date = hire_date
        self.is_active = is_active

    def to_dict(self):
        #Chuyển đổi Staff object thành dictionary
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "position": self.position,
            "department": self.department,
            "hire_date": self.hire_date,
            "is_active": self.is_active
        }

