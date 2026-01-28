from repository.staff_repository import StaffRepository
from datetime import datetime, date
import re

class StaffService:
    #Service: Xử lý logic nghiệp vụ cho Staff.

    def __init__(self):
        self.repo = StaffRepository()

    def create_staff(self, full_name, email, phone, position, department, hire_date, is_active=True):
        #Tạo staff mới với validation
        if not full_name or not email:
            raise ValueError("Invalid Data: Full name and email are required.")
        if not position or not department:
            raise ValueError("Invalid Data: Position and department are required.")

        # Basic email format validation
        email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
        if not re.match(email_pattern, email):
            raise ValueError("Invalid Data: Email format is invalid.")

        # Optional phone validation (digits and reasonable length)
        if phone:
            digits_only = re.sub(r"\D", "", phone)
            if len(digits_only) < 8 or len(digits_only) > 15:
                raise ValueError("Invalid Data: Phone number format is invalid.")

        # Validate hire_date (YYYY-MM-DD, not in the future)
        if hire_date:
            try:
                parsed_hire_date = datetime.strptime(hire_date, "%Y-%m-%d").date() if isinstance(hire_date, str) else hire_date
            except ValueError:
                raise ValueError("Invalid Data: hire_date must be in format YYYY-MM-DD.")
            if parsed_hire_date > date.today():
                raise ValueError("Invalid Data: hire_date cannot be in the future.")

        # Uniqueness checks for email/phone
        existing_staff = self.repo.find_all()
        if any(s.email == email for s in existing_staff):
            raise ValueError(f"Invalid Data: Email {email} already exists for another staff member.")
        if phone and any(s.phone and s.phone == phone for s in existing_staff):
            raise ValueError(f"Invalid Data: Phone number {phone} already exists for another staff member.")
        
        return self.repo.save(full_name, email, phone, position, department, hire_date, is_active)

    def get_staff_details(self, staff_id):
        #Lấy thông tin staff theo ID
        staff = self.repo.find_by_id(staff_id)
        if not staff:
            raise ValueError(f"Staff with ID {staff_id} not found.")
        return staff

    def get_all_staff(self):
        #Lấy tất cả staff
        return self.repo.find_all()
    
    def get_staff_by_position(self, position):
        #Lấy staff theo position
        return self.repo.find_by_position(position)
    
    def get_staff_by_department(self, department):
        #Lấy staff theo department
        return self.repo.find_by_department(department)
    
    def update_staff(self, staff_id, full_name=None, email=None, phone=None, position=None, department=None, is_active=None):
        #Cập nhật thông tin staff
        staff = self.repo.find_by_id(staff_id)
        if not staff:
            raise ValueError(f"Staff with ID {staff_id} not found.")

        # Build update data
        update_data = {}
        if full_name:
            update_data['full_name'] = full_name
        if email:
            # Email format validation
            email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
            if not re.match(email_pattern, email):
                raise ValueError("Invalid Data: Email format is invalid.")

            # Uniqueness check (exclude current staff)
            existing_staff = self.repo.find_all()
            for s in existing_staff:
                if s.id != staff_id and s.email == email:
                    raise ValueError(f"Invalid Data: Email {email} already exists for another staff member.")
            update_data['email'] = email

        if phone:
            digits_only = re.sub(r"\D", "", phone)
            if len(digits_only) < 8 or len(digits_only) > 15:
                raise ValueError("Invalid Data: Phone number format is invalid.")

            existing_staff = self.repo.find_all()
            for s in existing_staff:
                if s.id != staff_id and s.phone and s.phone == phone:
                    raise ValueError(f"Invalid Data: Phone number {phone} already exists for another staff member.")
            update_data['phone'] = phone
        if position:
            update_data['position'] = position
        if department:
            update_data['department'] = department
        if is_active is not None:
            update_data['is_active'] = is_active
        
        return self.repo.update(staff_id, **update_data)
    
    def delete_staff(self, staff_id):
        #Xóa staff
        staff = self.repo.find_by_id(staff_id)
        if not staff:
            raise ValueError(f"Staff with ID {staff_id} not found.")
        
        return self.repo.delete(staff_id)
