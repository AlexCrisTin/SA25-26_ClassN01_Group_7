from flask import Flask
from controllers.booking_controller import BookingController

app = Flask(__name__)
booking_controller = BookingController()

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    return booking_controller.create_booking()

@app.route('/api/bookings/<booking_id>', methods=['GET'])
def get_booking(booking_id):
    return booking_controller.get_booking(booking_id)

if __name__ == '__main__':
    app.run(debug=True)