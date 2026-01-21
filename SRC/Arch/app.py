from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from pathlib import Path
from controllers.booking_controller import BookingController
from controllers.room_controller import RoomController
from controllers.user_controller import UserController
from controllers.service_controller import ServiceController
from controllers.payment_controller import PaymentController
from controllers.coupon_controller import CouponController
from controllers.checkin_controller import CheckInController
from controllers.staff_controller import StaffController
from controllers.report_controller import ReportController
from controllers.wallet_controller import WalletController
from middleware.auth import require_auth, require_admin, require_receptionist_or_admin, require_role, optional_auth

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {"origins": "*"},
    r"/uploads/*": {"origins": "*"} 
})


UPLOAD_FOLDER = Path(__file__).parent.parent / 'uploads'
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    """Serve uploaded images - handles paths like 'rooms/image.jpg'"""
    try:
        file_path = UPLOAD_FOLDER / filename
        
        if file_path.exists() and file_path.is_file():
            parent_dir = file_path.parent
            file_name = file_path.name
            return send_from_directory(str(parent_dir), file_name)
        else:
            parts = filename.split('/')
            if len(parts) > 1:
                subdir_name = parts[0]
                file_name = '/'.join(parts[1:])
                subdir_path = UPLOAD_FOLDER / subdir_name
            return "File not found", 404
    except Exception as e:
        print(f"Error serving file {filename}: {str(e)}")
        return f"Error serving file: {str(e)}", 500

# Initialize controllers
booking_controller = BookingController()
room_controller = RoomController()
user_controller = UserController()
service_controller = ServiceController()
payment_controller = PaymentController()
coupon_controller = CouponController()
checkin_controller = CheckInController()
staff_controller = StaffController()
report_controller = ReportController()
wallet_controller = WalletController()

# ========== BOOKING ROUTES ==========
@app.route('/api/bookings', methods=['POST'])
@require_auth 
def create_booking():
    return booking_controller.create_booking()

@app.route('/api/bookings', methods=['GET'])
@require_receptionist_or_admin 
def get_all_bookings():
    return booking_controller.get_all_bookings()

@app.route('/api/bookings/my', methods=['GET'])
@require_auth 
def get_my_bookings():
    user = getattr(request, 'current_user', None)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return booking_controller.get_user_bookings(user.id)

@app.route('/api/bookings/<booking_id>', methods=['GET'])
@require_auth 
def get_booking(booking_id):
    return booking_controller.get_booking(booking_id)

@app.route('/api/bookings/<booking_id>', methods=['PUT'])
@require_receptionist_or_admin 
def update_booking(booking_id):
    return booking_controller.update_booking(booking_id)

@app.route('/api/bookings/<booking_id>', methods=['DELETE'])
@require_auth 
def cancel_booking(booking_id):
    return booking_controller.cancel_booking(booking_id)

# ========== ROOM ROUTES ==========
@app.route('/api/rooms', methods=['GET'])
@optional_auth 
def get_all_rooms():
    return room_controller.get_all_rooms()

@app.route('/api/rooms', methods=['POST'])
@require_admin 
def create_room():
    return room_controller.create_room()

@app.route('/api/rooms/search', methods=['GET'])
@optional_auth 
def search_rooms():
    return room_controller.search_rooms()

@app.route('/api/rooms/<room_id>', methods=['GET'])
@optional_auth 
def get_room(room_id):
    return room_controller.get_room(room_id)

@app.route('/api/rooms/assign', methods=['POST'])
@require_receptionist_or_admin 
def assign_room():
    return room_controller.assign_room()

@app.route('/api/rooms/<room_id>', methods=['PUT'])
@require_admin 
def update_room(room_id):
    return room_controller.update_room(room_id)

@app.route('/api/rooms/<room_id>', methods=['DELETE'])
@require_admin 
def delete_room(room_id):
    return room_controller.delete_room(room_id)

# ========== AUTH ROUTES ==========
@app.route('/api/auth/login', methods=['POST'])
def login():
    return user_controller.login()

# ========== USER ROUTES ==========
@app.route('/api/users', methods=['POST'])
def create_user():
    return user_controller.create_user()

@app.route('/api/users', methods=['GET'])
@require_admin 
def get_all_users():
    return user_controller.get_all_users()

@app.route('/api/users/<user_id>', methods=['GET'])
@require_auth 
def get_user(user_id):
    return user_controller.get_user(user_id)

@app.route('/api/users/<user_id>', methods=['PUT'])
@require_admin 
def update_user(user_id):
    return user_controller.update_user(user_id)

@app.route('/api/users/<user_id>', methods=['DELETE'])
@require_admin 
def delete_user(user_id):
    return user_controller.delete_user(user_id)

@app.route('/api/users/<user_id>/profile', methods=['PUT'])
@require_auth 
def update_profile(user_id):
    return user_controller.update_profile(user_id)

# ========== SERVICE ROUTES ==========
@app.route('/api/services', methods=['GET'])
@optional_auth 
def get_all_services():
    return service_controller.get_all_services()

@app.route('/api/services', methods=['POST'])
@require_admin 
def create_service():
    return service_controller.create_service()

@app.route('/api/services/<service_id>', methods=['GET'])
@optional_auth 
def get_service(service_id):
    return service_controller.get_service(service_id)

@app.route('/api/services/request', methods=['POST'])
@require_auth 
def request_service():
    return service_controller.request_service()

@app.route('/api/services/<service_id>', methods=['PUT'])
@require_admin 
def update_service(service_id):
    return service_controller.update_service(service_id)

@app.route('/api/services/<service_id>', methods=['DELETE'])
@require_admin 
def delete_service(service_id):
    return service_controller.delete_service(service_id)

# ========== SERVICE REQUEST ROUTES ==========
@app.route('/api/service-requests', methods=['GET'])
@require_receptionist_or_admin 
def get_all_service_requests():
    return service_controller.get_all_service_requests()

@app.route('/api/service-requests/<request_id>', methods=['GET'])
@require_receptionist_or_admin 
def get_service_request(request_id):
    return service_controller.get_service_request(request_id)

@app.route('/api/service-requests/<request_id>', methods=['PUT'])
@require_receptionist_or_admin 
def update_service_request_status(request_id):
    return service_controller.update_service_request_status(request_id)

# ========== PAYMENT ROUTES ==========
@app.route('/api/payments', methods=['POST'])
@require_auth 
def process_payment():
    return payment_controller.process_payment()

@app.route('/api/payments/<payment_id>', methods=['GET'])
@require_auth 
def get_payment(payment_id):
    return payment_controller.get_payment(payment_id)

@app.route('/api/bookings/<booking_id>/payments', methods=['GET'])
@require_auth 
def get_payments_by_booking(booking_id):
    return payment_controller.get_payments_by_booking(booking_id)

# ========== COUPON ROUTES ==========
@app.route('/api/coupons', methods=['POST'])
@require_admin 
def create_coupon():
    return coupon_controller.create_coupon()

@app.route('/api/coupons/<coupon_id>', methods=['GET'])
@optional_auth 
def get_coupon(coupon_id):
    return coupon_controller.get_coupon(coupon_id)

@app.route('/api/coupons/apply', methods=['POST'])
@require_auth 
def apply_coupon():
    return coupon_controller.apply_coupon()

# ========== CHECKIN/CHECKOUT ROUTES ==========
@app.route('/api/checkins', methods=['POST'])
@require_receptionist_or_admin 
def process_checkin():
    return checkin_controller.process_checkin()

@app.route('/api/checkouts', methods=['POST'])
@require_receptionist_or_admin 
def process_checkout():
    return checkin_controller.process_checkout()

@app.route('/api/checkins/<checkin_id>', methods=['GET'])
@require_receptionist_or_admin 
def get_checkin(checkin_id):
    return checkin_controller.get_checkin(checkin_id)

@app.route('/api/checkouts/summary/<booking_id>', methods=['GET'])
@require_auth
def get_checkout_summary(booking_id):
    return checkin_controller.get_checkout_summary(booking_id)

@app.route('/api/checkins/cancel', methods=['POST'])
@require_receptionist_or_admin
def cancel_checkin():
    return checkin_controller.cancel_checkin()

# ========== STAFF ROUTES ==========
@app.route('/api/staff', methods=['GET'])
@require_admin 
def get_all_staff():
    return staff_controller.get_all_staff()

@app.route('/api/staff', methods=['POST'])
@require_admin 
def create_staff():
    return staff_controller.create_staff()

@app.route('/api/staff/<staff_id>', methods=['GET'])
@require_admin 
def get_staff(staff_id):
    return staff_controller.get_staff(staff_id)

@app.route('/api/staff/<staff_id>', methods=['PUT'])
@require_admin 
def update_staff(staff_id):
    return staff_controller.update_staff(staff_id)

@app.route('/api/staff/<staff_id>', methods=['DELETE'])
@require_admin 
def delete_staff(staff_id):
    return staff_controller.delete_staff(staff_id)

# ========== REPORT ROUTES ==========
@app.route('/api/reports/revenue', methods=['POST'])
@require_admin 
def generate_revenue_report():
    return report_controller.generate_revenue_report()

@app.route('/api/reports/occupancy', methods=['POST'])
@require_admin 
def generate_occupancy_report():
    return report_controller.generate_occupancy_report()

@app.route('/api/reports/booking', methods=['POST'])
@require_admin 
def generate_booking_report():
    return report_controller.generate_booking_report()

@app.route('/api/reports/<report_id>', methods=['GET'])
@require_admin 
def get_report(report_id):
    return report_controller.get_report(report_id)

@app.route('/api/reports/type/<report_type>', methods=['GET'])
@require_admin 
def get_reports_by_type(report_type):
    return report_controller.get_reports_by_type(report_type)

# ========== WALLET ROUTES ==========
@app.route('/api/wallet', methods=['GET'])
@require_auth 
def get_wallet():
    user = getattr(request, 'current_user', None)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return wallet_controller.get_my_wallet(user.id)

@app.route('/api/wallet/topup', methods=['POST'])
@require_auth 
def top_up_wallet():
    user = getattr(request, 'current_user', None)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return wallet_controller.top_up(user.id)

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
