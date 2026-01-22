from models.report import Report
from db_config import db_config
from mysql.connector import Error
import json
from datetime import date, datetime

class ReportRepository:
    #Repository: Thực hiện CRUD trực tiếp lên MySQL database cho Report.
    
    def save(self, report_type, data, period_start=None, period_end=None, generated_by=None, file_path=None):
        """Lưu report mới vào database"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor()
            
            query = """
                INSERT INTO reports (report_type, period_start, period_end, data, generated_by, file_path)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            # Convert data to JSON string - MySQL JSON type requires string
            if isinstance(data, dict) or isinstance(data, list):
                data_json = json.dumps(data, ensure_ascii=False)
            elif isinstance(data, str):
                # Already a string, try to parse and re-serialize to ensure valid JSON
                try:
                    parsed = json.loads(data)
                    data_json = json.dumps(parsed, ensure_ascii=False)
                except:
                    data_json = data
            else:
                data_json = json.dumps(data, ensure_ascii=False) if data is not None else None
            
            values = (report_type, period_start, period_end, data_json, generated_by, file_path)
            cursor.execute(query, values)
            connection.commit()
            
            report_id = cursor.lastrowid
            # Get the created report to return with timestamp
            report = self.find_by_id(str(report_id))
            return report
        except Error as e:
            if connection:
                connection.rollback()
            raise ValueError(f"Error saving report: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_by_id(self, report_id):
        """Tìm report theo ID"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM reports WHERE id = %s"
            cursor.execute(query, (report_id,))
            row = cursor.fetchone()
            
            if row:
                return self._row_to_report(row)
            return None
        except Error as e:
            raise ValueError(f"Error finding report: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def find_by_type(self, report_type):
        """Tìm reports theo type"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM reports WHERE report_type = %s ORDER BY generated_date DESC"
            cursor.execute(query, (report_type,))
            rows = cursor.fetchall()
            
            return [self._row_to_report(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding reports: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def find_all(self):
        """Lấy tất cả reports"""
        connection = None
        try:
            connection = db_config.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = "SELECT * FROM reports ORDER BY generated_date DESC"
            cursor.execute(query)
            rows = cursor.fetchall()
            
            return [self._row_to_report(row) for row in rows]
        except Error as e:
            raise ValueError(f"Error finding reports: {e}")
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()
    
    def _row_to_report(self, row):
        """Chuyển đổi database row thành Report object"""
        # Parse JSON data
        data = row['data']
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except:
                data = {}
        
        # Handle dates
        generated_date = row['generated_date']
        if isinstance(generated_date, datetime):
            generated_date = generated_date.isoformat()
        
        period_start = row['period_start']
        if period_start and isinstance(period_start, (date, datetime)):
            period_start = period_start.strftime('%Y-%m-%d')
        
        period_end = row['period_end']
        if period_end and isinstance(period_end, (date, datetime)):
            period_end = period_end.strftime('%Y-%m-%d')
        
        return Report(
            str(row['id']),
            row['report_type'],
            generated_date,
            data,
            period_start,
            period_end
        )

