from repository.wallet_repository import WalletRepository


class WalletService:
    """
    Service: Xử lý nghiệp vụ ví người dùng
    """

    def __init__(self):
        self.repo = WalletRepository()

    def get_wallet(self, user_id):
        if not user_id:
            raise ValueError("User ID is required.")

        wallet = self.repo.get_by_user_id(user_id)
        if wallet:
            return wallet
        # Tự tạo ví nếu chưa có
        return self.repo.create(user_id, balance=0)

    def top_up(self, user_id, amount):
        if not user_id:
            raise ValueError("User ID is required.")
        try:
            amount_value = float(amount)
        except (TypeError, ValueError):
            raise ValueError("Amount must be a number.")
        if amount_value <= 0:
            raise ValueError("Amount must be greater than 0.")

        wallet = self.repo.increase_balance(user_id, amount_value)
        return wallet

