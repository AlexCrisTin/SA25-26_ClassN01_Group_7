from flask import jsonify


class WalletView:
    @staticmethod
    def success_response(data, status_code=200):
        return jsonify(data), status_code

    @staticmethod
    def error_response(message, status_code=400):
        return jsonify({"error": message}), status_code

    @staticmethod
    def wallet_found(wallet):
        return jsonify(wallet.to_dict()), 200

    @staticmethod
    def wallet_updated(wallet):
        return jsonify(wallet.to_dict()), 200

