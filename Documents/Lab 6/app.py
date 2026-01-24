from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import requests

from gateway_config import SERVICE_ROUTES, DEFAULT_TIMEOUT
from auth import check_access

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {"origins": "*"}
})


def _find_route(path):
    for route in SERVICE_ROUTES:
        if path.startswith(route["prefix"]):
            return route
    return None


def _filter_headers(headers):
    excluded = {"host", "content-length", "transfer-encoding", "connection"}
    return {k: v for k, v in headers.items() if k.lower() not in excluded}


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "api-gateway",
        "version": "1.0.0"
    }), 200


@app.route("/api", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
@app.route("/api/<path:subpath>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def proxy_request(subpath=None):
    path = request.path
    route = _find_route(path)
    if not route:
        return jsonify({"error": "No service route configured"}), 404

    allowed, error = check_access(route.get("allowed_roles"))
    if not allowed:
        message, status_code = error
        return jsonify({"error": message}), status_code

    target_url = route["base_url"].rstrip("/") + path
    try:
        response = requests.request(
            method=request.method,
            url=target_url,
            params=request.args,
            data=request.get_data(),
            headers=_filter_headers(request.headers),
            timeout=DEFAULT_TIMEOUT
        )
    except requests.RequestException:
        return jsonify({"error": "Service unavailable"}), 503

    excluded_headers = {"content-encoding", "content-length", "transfer-encoding", "connection"}
    response_headers = [
        (k, v) for k, v in response.headers.items()
        if k.lower() not in excluded_headers
    ]
    return Response(response.content, response.status_code, response_headers)


if __name__ == "__main__":
    # Gateway chạy port 5000 (front door cho các microservice)
    app.run(debug=True, host="127.0.0.1", port=5000)
