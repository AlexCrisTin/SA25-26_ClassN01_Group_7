from datetime import datetime


class Wallet:
    """
    Model: Đại diện số dư ví của người dùng
    """

    def __init__(self, wallet_id, user_id, balance, updated_at=None):
        self.id = wallet_id
        self.user_id = user_id
        self.balance = float(balance or 0)
        self.updated_at = updated_at

        if self.balance < 0:
            raise ValueError("Balance cannot be negative.")
        if not user_id:
            raise ValueError("User ID is required for wallet.")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "balance": self.balance,
            "updated_at": self.updated_at.isoformat() if isinstance(self.updated_at, datetime) else self.updated_at,
        }

