from flask import Flask
from controllers.booking_controller import BookingController
from controllers.room_controller import RoomController
from controllers.user_controller import UserController
from controllers.service_controller import ServiceController
from controllers.payment_controller import PaymentController
from controllers.coupon_controller import CouponController
from controllers.checkin_controller import CheckInController
from controllers.staff_controller import StaffController
from controllers.report_controller import ReportController

app = Flask(__name__)

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

# ========== BOOKING ROUTES ==========
@app.route('/api/bookings', methods=['POST'])
def create_booking():
    return booking_controller.create_booking()

@app.route('/api/bookings', methods=['GET'])
def get_all_bookings():
    return booking_controller.get_all_bookings()

@app.route('/api/bookings/<booking_id>', methods=['GET'])
def get_booking(booking_id):
    return booking_controller.get_booking(booking_id)

@app.route('/api/bookings/<booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    return booking_controller.cancel_booking(booking_id)

# ========== ROOM ROUTES ==========
@app.route('/api/rooms', methods=['GET'])
def get_all_rooms():
    return room_controller.get_all_rooms()

@app.route('/api/rooms', methods=['POST'])
def create_room():
    return room_controller.create_room()

@app.route('/api/rooms/search', methods=['GET'])
def search_rooms():
    return room_controller.search_rooms()

@app.route('/api/rooms/<room_id>', methods=['GET'])
def get_room(room_id):
    return room_controller.get_room(room_id)

@app.route('/api/rooms/assign', methods=['POST'])
def assign_room():
    return room_controller.assign_room()

# ========== USER ROUTES ==========
@app.route('/api/users', methods=['POST'])
def create_user():
    return user_controller.create_user()

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    return user_controller.get_user(user_id)

@app.route('/api/users/<user_id>/profile', methods=['PUT'])
def update_profile(user_id):
    return user_controller.update_profile(user_id)

# ========== SERVICE ROUTES ==========
@app.route('/api/services', methods=['GET'])
def get_all_services():
    return service_controller.get_all_services()

@app.route('/api/services', methods=['POST'])
def create_service():
    return service_controller.create_service()

@app.route('/api/services/<service_id>', methods=['GET'])
def get_service(service_id):
    return service_controller.get_service(service_id)

@app.route('/api/services/request', methods=['POST'])
def request_service():
    return service_controller.request_service()

# ========== PAYMENT ROUTES ==========
@app.route('/api/payments', methods=['POST'])
def process_payment():
    return payment_controller.process_payment()

@app.route('/api/payments/<payment_id>', methods=['GET'])
def get_payment(payment_id):
    return payment_controller.get_payment(payment_id)

@app.route('/api/bookings/<booking_id>/payments', methods=['GET'])
def get_payments_by_booking(booking_id):
    return payment_controller.get_payments_by_booking(booking_id)

# ========== COUPON ROUTES ==========
@app.route('/api/coupons', methods=['POST'])
def create_coupon():
    return coupon_controller.create_coupon()

@app.route('/api/coupons/<coupon_id>', methods=['GET'])
def get_coupon(coupon_id):
    return coupon_controller.get_coupon(coupon_id)

@app.route('/api/coupons/apply', methods=['POST'])
def apply_coupon():
    return coupon_controller.apply_coupon()

# ========== CHECKIN/CHECKOUT ROUTES ==========
@app.route('/api/checkins', methods=['POST'])
def process_checkin():
    return checkin_controller.process_checkin()

@app.route('/api/checkouts', methods=['POST'])
def process_checkout():
    return checkin_controller.process_checkout()

@app.route('/api/checkins/<checkin_id>', methods=['GET'])
def get_checkin(checkin_id):
    return checkin_controller.get_checkin(checkin_id)

# ========== STAFF ROUTES ==========
@app.route('/api/staff', methods=['GET'])
def get_all_staff():
    return staff_controller.get_all_staff()

@app.route('/api/staff', methods=['POST'])
def create_staff():
    return staff_controller.create_staff()

@app.route('/api/staff/<staff_id>', methods=['GET'])
def get_staff(staff_id):
    return staff_controller.get_staff(staff_id)

@app.route('/api/staff/<staff_id>', methods=['PUT'])
def update_staff(staff_id):
    return staff_controller.update_staff(staff_id)

# ========== REPORT ROUTES ==========
@app.route('/api/reports/revenue', methods=['POST'])
def generate_revenue_report():
    return report_controller.generate_revenue_report()

@app.route('/api/reports/occupancy', methods=['POST'])
def generate_occupancy_report():
    return report_controller.generate_occupancy_report()

@app.route('/api/reports/booking', methods=['POST'])
def generate_booking_report():
    return report_controller.generate_booking_report()

@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    return report_controller.get_report(report_id)

@app.route('/api/reports/type/<report_type>', methods=['GET'])
def get_reports_by_type(report_type):
    return report_controller.get_reports_by_type(report_type)

if __name__ == '__main__':
    app.run(debug=True)
