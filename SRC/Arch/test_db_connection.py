"""
Script test ket noi database MySQL
Chay: python test_db_connection.py
"""

import sys
import io

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from db_config import db_config
from mysql.connector import Error

def test_connection():
    """Test kết nối database"""
    print("=" * 50)
    print("Testing Database Connection")
    print("=" * 50)
    
    # Hiển thị thông tin cấu hình (ẩn password)
    print(f"\nDatabase Configuration:")
    print(f"  Host: {db_config.host}")
    print(f"  Port: {db_config.port}")
    print(f"  Database: {db_config.database}")
    print(f"  User: {db_config.user}")
    print(f"  Password: {'*' * len(db_config.password) if db_config.password else '(empty)'}")
    
    # Test kết nối
    print("\n" + "-" * 50)
    print("Attempting to connect...")
    print("-" * 50)
    
    try:
        connection = db_config.get_connection()
        
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"\n[SUCCESS] Connected to MySQL Server")
            print(f"   Server version: {db_info}")
            
            # Test query
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE()")
            database = cursor.fetchone()
            print(f"   Current database: {database[0]}")
            
            # Test tables
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print(f"\n   Tables found: {len(tables)}")
            if tables:
                print("   Table list:")
                for table in tables:
                    print(f"     - {table[0]}")
            else:
                print("   [WARNING] No tables found!")
                print("   Run: mysql -u root -p < database_schema.sql")
            
            cursor.close()
            connection.close()
            print("\n[SUCCESS] Connection test completed successfully!")
            return True
        else:
            print("\n❌ FAILED: Connection established but not connected")
            return False
            
    except Error as e:
        print(f"\n[ERROR] Failed to connect to MySQL")
        print(f"   Error message: {e}")
        print("\n" + "=" * 50)
        print("Troubleshooting:")
        print("=" * 50)
        print("1. Kiem tra MySQL da chay chua:")
        print("   - Windows: net start MySQL80")
        print("   - Linux/Mac: sudo systemctl start mysql")
        print("\n2. Kiem tra thong tin trong file .env:")
        print("   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD")
        if not db_config.password:
            print("   [WARNING] DB_PASSWORD dang trong!")
            print("   - Mo file SRC/Arch/.env va dien mat khau MySQL")
        print("\n3. Kiem tra database da duoc tao chua:")
        print("   - mysql -u root -p < database_schema.sql")
        print("\n4. Kiem tra user co quyen truy cap:")
        print("   - GRANT ALL PRIVILEGES ON hotel_management.* TO 'root'@'localhost';")
        return False

if __name__ == "__main__":
    test_connection()

