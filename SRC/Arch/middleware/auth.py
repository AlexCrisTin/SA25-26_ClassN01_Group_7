"""
Middleware để xử lý authentication và authorization
"""
from functools import wraps
from flask import request, jsonify
from services.user_service import UserService

user_service = UserService()

def get_current_user():
    """Lấy user hiện tại từ request headers"""
    # Có thể dùng token hoặc session, ở đây dùng user_id từ header
    user_id = request.headers.get('X-User-Id')
    if not user_id:
        return None
    
    try:
        user = user_service.get_user_details(user_id)
        return user
    except:
        return None

def require_auth(f):
    """Decorator yêu cầu đăng nhập"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        request.current_user = user
        return f(*args, **kwargs)
    return decorated_function

def require_role(*allowed_roles):
    """Decorator yêu cầu role cụ thể"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = get_current_user()
            if not user:
                return jsonify({"error": "Authentication required"}), 401
            
            if user.role not in allowed_roles:
                return jsonify({
                    "error": f"Access denied. Required roles: {', '.join(allowed_roles)}"
                }), 403
            
            request.current_user = user
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def require_admin(f):
    """Decorator yêu cầu quyền administrator"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        
        if user.role != 'administrator':
            return jsonify({"error": "Access denied. Administrator role required"}), 403
        
        request.current_user = user
        return f(*args, **kwargs)
    return decorated_function

def require_receptionist_or_admin(f):
    """Decorator yêu cầu quyền receptionist hoặc administrator"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        
        if user.role not in ['receptionist', 'administrator']:
            return jsonify({
                "error": "Access denied. Receptionist or Administrator role required"
            }), 403
        
        request.current_user = user
        return f(*args, **kwargs)
    return decorated_function

def optional_auth(f):
    """Decorator cho phép không cần đăng nhập, nhưng nếu có thì lấy user"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        request.current_user = user
        return f(*args, **kwargs)
    return decorated_function

