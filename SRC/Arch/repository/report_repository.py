from models.report import Report

# Giả lập Database trong bộ nhớ
report_db = {}
next_report_id = 1

class ReportRepository:
    """Repository: Thực hiện CRUD trực tiếp lên kho dữ liệu Report."""
    
    def save(self, report_type, generated_date, data, period_start=None, period_end=None):
        global next_report_id
        report_id = str(next_report_id)
        new_report = Report(report_id, report_type, generated_date, data, period_start, period_end)
        report_db[report_id] = new_report
        next_report_id += 1
        return new_report

    def find_by_id(self, report_id):
        return report_db.get(report_id)
    
    def find_by_type(self, report_type):
        return [report for report in report_db.values() if report.report_type == report_type]

    def find_all(self):
        return list(report_db.values())

