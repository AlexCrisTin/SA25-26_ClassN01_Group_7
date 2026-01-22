from repository.report_repository import ReportRepository
from repository.booking_repository import BookingRepository
from repository.payment_repository import PaymentRepository
from datetime import datetime

class ReportService:
    #Service: Xử lý logic nghiệp vụ cho Report.

    def __init__(self):
        self.repo = ReportRepository()
        self.booking_repo = BookingRepository()
        self.payment_repo = PaymentRepository()

    def generate_revenue_report(self, period_start=None, period_end=None):
        #Tạo báo cáo doanh thu
        payments = self.payment_repo.find_all()
        
        # Filter by period if provided
        if period_start and period_end:
            # In real implementation, filter by date
            pass
        
        total_revenue = sum(p.amount for p in payments if p.status == 'completed')
        total_payments = len([p for p in payments if p.status == 'completed'])
        
        data = {
            "total_revenue": total_revenue,
            "total_payments": total_payments,
            "payments": [p.to_dict() for p in payments if p.status == 'completed']
        }
        
        return self.repo.save('revenue', data, period_start, period_end)

    def generate_occupancy_report(self, period_start=None, period_end=None):
        #Tạo báo cáo tỷ lệ lấp đầy phòng
        bookings = self.booking_repo.find_all()
        
        total_bookings = len(bookings)
        # In real implementation, calculate occupancy rate based on dates
        
        data = {
            "total_bookings": total_bookings,
            "bookings": [b.to_dict() for b in bookings]
        }
        
        return self.repo.save('occupancy', data, period_start, period_end)

    def generate_booking_report(self, period_start=None, period_end=None):
        #Tạo báo cáo booking
        bookings = self.booking_repo.find_all()
        
        data = {
            "total_bookings": len(bookings),
            "bookings": [b.to_dict() for b in bookings]
        }
        
        return self.repo.save('booking', data, period_start, period_end)

    def get_report_details(self, report_id):
        #Lấy thông tin report theo ID
        report = self.repo.find_by_id(report_id)
        if not report:
            raise ValueError(f"Report with ID {report_id} not found.")
        return report
    
    def get_reports_by_type(self, report_type):
        #Lấy reports theo type
        return self.repo.find_by_type(report_type)

    def get_all_reports(self):
        #Lấy tất cả reports
        return self.repo.find_all()
