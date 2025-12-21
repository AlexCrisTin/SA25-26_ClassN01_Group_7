from models.staff import Staff

# Giả lập Database trong bộ nhớ
staff_db = {}
next_staff_id = 1

class StaffRepository:
    """Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu Staff."""
    
    def save(self, full_name, email, phone, position, department, hire_date, is_active=True):
        global next_staff_id
        staff_id = str(next_staff_id)
        new_staff = Staff(staff_id, full_name, email, phone, position, department, hire_date, is_active)
        staff_db[staff_id] = new_staff
        next_staff_id += 1
        return new_staff

    def find_by_id(self, staff_id):
        return staff_db.get(staff_id)

    def find_all(self):
        return list(staff_db.values())
    
    def find_by_position(self, position):
        return [staff for staff in staff_db.values() if staff.position == position]
    
    def find_by_department(self, department):
        return [staff for staff in staff_db.values() if staff.department == department]

