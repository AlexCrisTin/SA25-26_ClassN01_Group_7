from flask import request
from services.report_service import ReportService
from views.report_view import ReportView

class ReportController:
    #Controller: Xử lý HTTP requests cho Report
    
    def __init__(self):
        self.service = ReportService()
        self.view = ReportView()
    
    def generate_revenue_report(self):
        #Xử lý POST /api/reports/revenue
        data = request.json or {}
        try:
            report = self.service.generate_revenue_report(
                data.get('period_start'),
                data.get('period_end')
            )
            return self.view.report_generated(report)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def generate_occupancy_report(self):
        #Xử lý POST /api/reports/occupancy
        data = request.json or {}
        try:
            report = self.service.generate_occupancy_report(
                data.get('period_start'),
                data.get('period_end')
            )
            return self.view.report_generated(report)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def generate_booking_report(self):
        #Xử lý POST /api/reports/booking
        data = request.json or {}
        try:
            report = self.service.generate_booking_report(
                data.get('period_start'),
                data.get('period_end')
            )
            return self.view.report_generated(report)
        except ValueError as e:
            return self.view.error_response(str(e), 400)
    
    def get_report(self, report_id):
        #Xử lý GET /api/reports/<report_id>
        try:
            report = self.service.get_report_details(report_id)
            return self.view.report_found(report)
        except ValueError as e:
            return self.view.error_response(str(e), 404)
    
    def get_reports_by_type(self, report_type):
        #Xử lý GET /api/reports/type/<report_type>
        try:
            reports = self.service.get_reports_by_type(report_type)
            return self.view.reports_found(reports)
        except ValueError as e:
            return self.view.error_response(str(e), 400)

