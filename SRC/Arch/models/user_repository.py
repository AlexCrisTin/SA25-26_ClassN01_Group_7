from .user import User

# Giả lập Database trong bộ nhớ
user_db = {}
next_user_id = 1

class UserRepository:
    """Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu User."""
    
    def save(self, username, email, password, full_name, phone, role='user'):
        global next_user_id
        user_id = str(next_user_id)
        new_user = User(user_id, username, email, password, full_name, phone, role)
        user_db[user_id] = new_user
        next_user_id += 1
        return new_user

    def find_by_id(self, user_id):
        return user_db.get(user_id)
    
    def find_by_username(self, username):
        for user in user_db.values():
            if user.username == username:
                return user
        return None
    
    def find_by_email(self, email):
        for user in user_db.values():
            if user.email == email:
                return user
        return None

    def find_all(self):
        return list(user_db.values())

