import os

DEFAULT_TIMEOUT = int(os.getenv("GATEWAY_TIMEOUT", "10"))

SERVICE_ROUTES = [
    {
        "name": "room-service",
        "prefix": "/api/rooms",
        "base_url": os.getenv("ROOM_SERVICE_URL", "http://127.0.0.1:5001"),
        # Leave empty to skip role checks for this route.
        "allowed_roles": ["admin", "receptionist", "user"],
    }
]
