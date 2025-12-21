from flask import jsonify

class PaymentView:
    #View: Xử lý format response cho Payment API
    
    @staticmethod
    def payment_processed(payment):
        #Response khi xử lý payment thành công
        return jsonify(payment.to_dict()), 201
    
    @staticmethod
    def payment_found(payment):
        #Response khi tìm thấy payment
        return jsonify(payment.to_dict()), 200
    
    @staticmethod
    def payments_found(payments):
        #Response khi tìm thấy danh sách payments
        return jsonify([payment.to_dict() for payment in payments]), 200
    
    @staticmethod
    def error_response(message, status_code=400):
        #Format response lỗi
        return jsonify({"error": message}), status_code

