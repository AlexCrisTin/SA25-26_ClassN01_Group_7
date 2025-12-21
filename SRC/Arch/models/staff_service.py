from .staff_repository import StaffRepository

class StaffService:
    """Service: Xử lý logic nghiệp vụ cho Staff."""

    def __init__(self):
        self.repo = StaffRepository()

    def create_staff(self, full_name, email, phone, position, department, hire_date, is_active=True):
        """Tạo staff mới với validation"""
        if not full_name or not email:
            raise ValueError("Invalid Data: Full name and email are required.")
        if not position or not department:
            raise ValueError("Invalid Data: Position and department are required.")
        
        return self.repo.save(full_name, email, phone, position, department, hire_date, is_active)

    def get_staff_details(self, staff_id):
        """Lấy thông tin staff theo ID"""
        staff = self.repo.find_by_id(staff_id)
        if not staff:
            raise ValueError(f"Staff with ID {staff_id} not found.")
        return staff

    def get_all_staff(self):
        """Lấy tất cả staff"""
        return self.repo.find_all()
    
    def get_staff_by_position(self, position):
        """Lấy staff theo position"""
        return self.repo.find_by_position(position)
    
    def get_staff_by_department(self, department):
        """Lấy staff theo department"""
        return self.repo.find_by_department(department)
    
    def update_staff(self, staff_id, full_name=None, email=None, phone=None, position=None, is_active=None):
        """Cập nhật thông tin staff"""
        staff = self.repo.find_by_id(staff_id)
        if not staff:
            raise ValueError(f"Staff with ID {staff_id} not found.")
        
        if full_name:
            staff.full_name = full_name
        if email:
            staff.email = email
        if phone:
            staff.phone = phone
        if position:
            staff.position = position
        if is_active is not None:
            staff.is_active = is_active
        
        return staff

