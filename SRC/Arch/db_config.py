import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
from pathlib import Path


env_path = Path(__file__).parent / '.env'
if not env_path.exists():
    env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)

class DatabaseConfig:
    """Cấu hình kết nối database MySQL"""
    
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.port = int(os.getenv('DB_PORT', 3306))
        self.database = os.getenv('DB_NAME', 'hotel_management')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', '')
    
    def get_connection(self):
        """Tạo và trả về connection đến MySQL database"""
        try:
            connection = mysql.connector.connect(
                host=self.host,
                port=self.port,
                database=self.database,
                user=self.user,
                password=self.password,
                autocommit=False
            )
            if connection.is_connected():
                return connection
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            raise
    
    def test_connection(self):
        """Test kết nối database"""
        try:
            connection = self.get_connection()
            if connection.is_connected():
                db_info = connection.get_server_info()
                print(f"Connected to MySQL Server version {db_info}")
                connection.close()
                return True
        except Error as e:
            print(f"Error: {e}")
            return False


db_config = DatabaseConfig()

