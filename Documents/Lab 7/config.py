# RabbitMQ connection configuration for Lab 7 (EDA)
# Used by both Producer (Booking Service) and Consumer (Notification Service)

import os

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "guest")

# Queue name for booking events (BookingPlacedEvent / BookingConfirmedEvent)
QUEUE_NAME = os.getenv("QUEUE_NAME", "booking_events")
