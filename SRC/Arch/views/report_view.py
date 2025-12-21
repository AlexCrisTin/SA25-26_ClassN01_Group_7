from flask import jsonify

class ReportView:
    """View: Xử lý format response cho Report API"""
    
    @staticmethod
    def report_generated(report):
        """Response khi tạo report thành công"""
        return jsonify(report.to_dict()), 201
    
    @staticmethod
    def report_found(report):
        """Response khi tìm thấy report"""
        return jsonify(report.to_dict()), 200
    
    @staticmethod
    def reports_found(reports):
        """Response khi tìm thấy danh sách reports"""
        return jsonify([report.to_dict() for report in reports]), 200
    
    @staticmethod
    def error_response(message, status_code=400):
        """Format response lỗi"""
        return jsonify({"error": message}), status_code

