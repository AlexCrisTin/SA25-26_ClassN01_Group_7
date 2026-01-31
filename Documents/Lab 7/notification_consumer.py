"""
Lab 7: Event Consumer (Notification Service)
Listens for BookingPlacedEvent from RabbitMQ and processes them
(e.g. simulate sending confirmation email). Demonstrates decoupled EDA.
"""
import pika
import json
import time
import sys

from config import RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD, QUEUE_NAME


def callback(ch, method, properties, body):
    """Called when a message is received from the queue."""
    try:
        data = json.loads(body)
        booking_id = data.get("booking_id")
        guest_email = data.get("guest_email")
        guest_name = data.get("guest_name", "Guest")

        print(" [x] Notification Service received an event.")
        # Simulate heavy email sending logic (processing time)
        time.sleep(1)
        print(f" [OK] SENT CONFIRMATION: Booking {booking_id} confirmed for {guest_name} ({guest_email})")
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except json.JSONDecodeError:
        print(f" [!] Error decoding JSON: {body}")
        ch.basic_reject(delivery_tag=method.delivery_tag, requeue=False)
    except Exception as e:
        print(f" [!] Error processing message: {e}")
        ch.basic_reject(delivery_tag=method.delivery_tag, requeue=False)


def main():
    try:
        print("Notification Service (Consumer) is connecting...")
        credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
        parameters = pika.ConnectionParameters(
            host=RABBITMQ_HOST,
            port=RABBITMQ_PORT,
            credentials=credentials,
        )
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME)
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)
        print(f" [*] Waiting for BookingPlacedEvents on queue '{QUEUE_NAME}'. To exit press CTRL+C")
        channel.start_consuming()
    except pika.exceptions.AMQPConnectionError as e:
        print(f" [!] Connection Error: Could not connect to RabbitMQ. Is it running? {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("Consumer shutting down.")


if __name__ == "__main__":
    main()
