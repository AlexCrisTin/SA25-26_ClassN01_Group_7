from db_config import db_config
from mysql.connector import Error
from models.wallet import Wallet


class WalletRepository:
    """
    Repository: Thao tác trực tiếp với bảng wallets
    """

    def __init__(self):
        self._ensure_table()

    def _ensure_table(self):
        """Tạo bảng wallets nếu chưa tồn tại"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS wallets (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id VARCHAR(255) NOT NULL UNIQUE,
                    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
                """
            )
            connection.commit()
        except Error as e:
            raise ValueError(f"Error ensuring wallets table: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def get_by_user_id(self, user_id):
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM wallets WHERE user_id = %s", (user_id,))
            row = cursor.fetchone()
            if row:
                return self._row_to_wallet(row)
            return None
        except Error as e:
            raise ValueError(f"Error fetching wallet: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def create(self, user_id, balance=0):
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO wallets (user_id, balance) VALUES (%s, %s)",
                (user_id, float(balance)),
            )
            connection.commit()
            wallet_id = cursor.lastrowid
            return Wallet(wallet_id, user_id, balance)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error creating wallet: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def increase_balance(self, user_id, amount):
        """
        Tăng (hoặc tạo mới) số dư ví cho user. amount phải > 0.
        """
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                INSERT INTO wallets (user_id, balance)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE balance = balance + VALUES(balance)
                """,
                (user_id, float(amount)),
            )
            connection.commit()
            return self.get_by_user_id(user_id)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error increasing balance: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def decrease_balance(self, user_id, amount):
        """
        Giảm số dư ví cho user. Đảm bảo không âm.
        """
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()

            # Khóa hàng ví để tránh race condition
            cursor.execute("SELECT balance FROM wallets WHERE user_id = %s FOR UPDATE", (user_id,))
            row = cursor.fetchone()
            if not row:
                raise ValueError("Wallet not found for user.")

            current_balance = float(row[0])
            amount_value = float(amount)
            if amount_value <= 0:
                raise ValueError("Amount must be greater than 0.")
            if current_balance < amount_value:
                raise ValueError("Insufficient wallet balance.")

            new_balance = current_balance - amount_value
            cursor.execute(
                "UPDATE wallets SET balance = %s WHERE user_id = %s",
                (new_balance, user_id),
            )
            connection.commit()
            return self.get_by_user_id(user_id)
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error decreasing balance: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def _row_to_wallet(self, row):
        return Wallet(
            row["id"],
            row["user_id"],
            float(row["balance"]),
            row.get("updated_at"),
        )

