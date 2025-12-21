class Report:
    """Model: Định nghĩa cấu trúc dữ liệu Report"""
    
    def __init__(self, report_id, report_type, generated_date, data, period_start=None, period_end=None):
        self.id = report_id
        self.report_type = report_type  # revenue, occupancy, booking, etc.
        self.generated_date = generated_date
        self.data = data  # Dictionary chứa dữ liệu báo cáo
        self.period_start = period_start
        self.period_end = period_end

    def to_dict(self):
        """Chuyển đổi Report object thành dictionary"""
        return {
            "id": self.id,
            "report_type": self.report_type,
            "generated_date": self.generated_date,
            "data": self.data,
            "period_start": self.period_start,
            "period_end": self.period_end
        }

