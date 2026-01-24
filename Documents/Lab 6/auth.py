import os
from flask import request

AUTH_DISABLED = os.getenv("GATEWAY_AUTH_DISABLED", "false").lower() == "true"
DEMO_TOKEN = os.getenv("GATEWAY_DEMO_TOKEN", "demo-token")


def extract_token():
    auth_header = request.headers.get("Authorization", "")
    if auth_header.lower().startswith("bearer "):
        return auth_header[7:].strip()
    return request.headers.get("X-Auth-Token", "").strip()


def validate_token(token):
    if AUTH_DISABLED:
        return True
    return bool(token) and token == DEMO_TOKEN


def get_role():
    return request.headers.get("X-User-Role", "").strip().lower()


def check_access(allowed_roles):
    if AUTH_DISABLED:
        return True, None

    token = extract_token()
    if not validate_token(token):
        return False, ("Unauthorized", 401)

    if allowed_roles:
        role = get_role()
        if not role or role not in [r.lower() for r in allowed_roles]:
            return False, ("Forbidden", 403)

    return True, None
