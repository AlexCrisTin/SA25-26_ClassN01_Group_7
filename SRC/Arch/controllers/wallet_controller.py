from flask import request
from services.wallet_service import WalletService
from views.wallet_view import WalletView


class WalletController:
    """
    Controller: Xử lý HTTP requests cho ví người dùng
    """

    def __init__(self):
        self.service = WalletService()
        self.view = WalletView()

    def get_my_wallet(self, user_id):
        try:
            wallet = self.service.get_wallet(user_id)
            return self.view.wallet_found(wallet)
        except ValueError as e:
            return self.view.error_response(str(e), 400)

    def top_up(self, user_id):
        data = request.json or {}
        try:
            wallet = self.service.top_up(user_id, data.get("amount"))
            return self.view.wallet_updated(wallet)
        except ValueError as e:
            return self.view.error_response(str(e), 400)

