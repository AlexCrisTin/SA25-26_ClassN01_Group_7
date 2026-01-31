"""
Lab 7: Event Producer (Booking Service)
Simulates the Booking Service publishing a BookingPlacedEvent to RabbitMQ
when a booking is confirmed. Consumer (Notification Service) will process
and send confirmation (e.g. email).
"""
import pika
import json
import time
import sys

from config import RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD, QUEUE_NAME


def get_connection():
    """Create connection to RabbitMQ."""
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    parameters = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        credentials=credentials,
    )
    return pika.BlockingConnection(parameters)


def publish_booking_placed_event(booking_data):
    """
    Connects to RabbitMQ and publishes the BookingPlacedEvent.
    booking_data: dict with keys e.g. booking_id, guest_email, guest_name, room_type, check_in_date, timestamp
    """
    try:
        connection = get_connection()
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME)

        message = json.dumps(booking_data)
        channel.basic_publish(
            exchange="",
            routing_key=QUEUE_NAME,
            body=message,
        )
        print(f" [x] Booking Service published event for Booking ID: {booking_data.get('booking_id', 'N/A')}")
        connection.close()
    except pika.exceptions.AMQPConnectionError as e:
        print(f" [!] Connection Error: Could not connect to RabbitMQ. Is it running? {e}")
        raise


if __name__ == "__main__":
    print("Booking Service (Producer) is starting...")
    # Simulate placing 3 bookings and publishing events
    for i in range(1, 4):
        booking_info = {
            "event_type": "BookingPlacedEvent",
            "booking_id": i,
            "guest_name": f"Guest {i}",
            "guest_email": f"guest{i}@example.com",
            "room_type": "double",
            "check_in_date": "2026-02-01",
            "check_out_date": "2026-02-03",
            "timestamp": time.time(),
        }
        try:
            publish_booking_placed_event(booking_info)
        except pika.exceptions.AMQPConnectionError:
            sys.exit(1)
        time.sleep(2)
    print("Producer finished publishing events.")
