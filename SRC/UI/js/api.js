// API Service - Centralized API calls for Hotel Management System
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get current user ID from localStorage
function getCurrentUserId() {
    try {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            const user = JSON.parse(userStr);
            return user.id || user.user?.id;
        }
    } catch (e) {
        console.error('Error getting current user:', e);
    }
    return null;
}

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null, requireAuth = false) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Add X-User-Id header if user is logged in
    const userId = getCurrentUserId();
    if (userId) {
        options.headers['X-User-Id'] = userId;
    } else if (requireAuth) {
        throw new Error('Authentication required. Please login first.');
    }

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        // Check if response is ok before trying to parse JSON
        let result;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                result = await response.json();
            } catch (jsonError) {
                throw new Error(`Invalid JSON response: ${response.status} ${response.statusText}`);
            }
        } else {
            // If not JSON, get text response
            const text = await response.text();
            throw new Error(`Unexpected response format: ${text || response.statusText}`);
        }
        
        if (!response.ok) {
            // Handle authentication/authorization errors
            if (response.status === 401) {
                // Clear user data if unauthorized
                localStorage.removeItem('currentUser');
                throw new Error('Session expired. Please login again.');
            } else if (response.status === 403) {
                throw new Error(result.error || 'Access denied. You do not have permission to perform this action.');
            }
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ========== ROOM API ==========
const RoomAPI = {
    // Get all rooms
    getAllRooms: async () => {
        return await apiCall('/rooms', 'GET');
    },

    // Search rooms by type and status
    searchRooms: async (roomType = null, status = 'available') => {
        const params = new URLSearchParams();
        if (roomType) params.append('room_type', roomType);
        if (status) params.append('status', status);
        
        const queryString = params.toString();
        const endpoint = queryString ? `/rooms/search?${queryString}` : '/rooms/search';
        return await apiCall(endpoint, 'GET');
    },

    // Get room by ID
    getRoom: async (roomId) => {
        return await apiCall(`/rooms/${roomId}`, 'GET');
    },

    // Create room (Admin only)
    createRoom: async (roomData) => {
        return await apiCall('/rooms', 'POST', roomData, true);
    },

    // Update room (Admin only)
    updateRoom: async (roomId, roomData) => {
        return await apiCall(`/rooms/${roomId}`, 'PUT', roomData);
    },

    // Delete room (Admin only)
    deleteRoom: async (roomId) => {
        return await apiCall(`/rooms/${roomId}`, 'DELETE');
    },

    // Assign room to booking
    assignRoom: async (roomId, bookingId) => {
        return await apiCall('/rooms/assign', 'POST', { room_id: roomId, booking_id: bookingId });
    }
};

// ========== BOOKING API ==========
const BookingAPI = {
    // Create new booking
    createBooking: async (bookingData) => {
        return await apiCall('/bookings', 'POST', bookingData);
    },

    // Get all bookings (Admin/Receptionist only)
    getAllBookings: async () => {
        return await apiCall('/bookings', 'GET');
    },

    // Get my bookings (Current user)
    getMyBookings: async () => {
        return await apiCall('/bookings/my', 'GET');
    },

    // Get booking by ID
    getBooking: async (bookingId) => {
        return await apiCall(`/bookings/${bookingId}`, 'GET');
    },

    // Update booking
    updateBooking: async (bookingId, bookingData) => {
        return await apiCall(`/bookings/${bookingId}`, 'PUT', bookingData);
    },

    // Cancel booking
    cancelBooking: async (bookingId) => {
        return await apiCall(`/bookings/${bookingId}`, 'DELETE');
    }
};

// ========== AUTH API ==========
const AuthAPI = {
    // Login
    login: async (username, password) => {
        return await apiCall('/auth/login', 'POST', { username, password });
    }
};

// ========== USER API ==========
const UserAPI = {
    // Create new user (Register)
    createUser: async (userData) => {
        return await apiCall('/users', 'POST', userData);
    },

    // Get all users (Admin only)
    getAllUsers: async () => {
        return await apiCall('/users', 'GET');
    },

    // Get user by ID
    getUser: async (userId) => {
        return await apiCall(`/users/${userId}`, 'GET');
    },

    // Update user (Admin only)
    updateUser: async (userId, userData) => {
        return await apiCall(`/users/${userId}`, 'PUT', userData);
    },

    // Delete user (Admin only)
    deleteUser: async (userId) => {
        return await apiCall(`/users/${userId}`, 'DELETE');
    },

    // Update user profile
    updateProfile: async (userId, profileData) => {
        return await apiCall(`/users/${userId}/profile`, 'PUT', profileData);
    }
};

// ========== SERVICE REQUEST API ==========
const ServiceRequestAPI = {
    // Get all service requests
    getAllServiceRequests: async () => {
        return await apiCall('/service-requests', 'GET');
    },

    // Get service request by ID
    getServiceRequest: async (requestId) => {
        return await apiCall(`/service-requests/${requestId}`, 'GET');
    },

    // Update service request status
    updateServiceRequestStatus: async (requestId, status, notes = null) => {
        const data = { status };
        if (notes) {
            data.notes = notes;
        }
        return await apiCall(`/service-requests/${requestId}`, 'PUT', data);
    }
};

// ========== PAYMENT API ==========
const PaymentAPI = {
    // Process payment
    processPayment: async (paymentData) => {
        return await apiCall('/payments', 'POST', paymentData);
    },

    // Get payment by ID
    getPayment: async (paymentId) => {
        return await apiCall(`/payments/${paymentId}`, 'GET');
    },

    // Get payments by booking ID
    getPaymentsByBooking: async (bookingId) => {
        return await apiCall(`/bookings/${bookingId}/payments`, 'GET');
    },

    // Get all payments
    getAllPayments: async () => {
        return await apiCall('/payments', 'GET');
    }
};

// ========== SERVICE API ==========
const ServiceAPI = {
    // Get all services
    getAllServices: async () => {
        return await apiCall('/services', 'GET');
    },

    // Get service by ID
    getService: async (serviceId) => {
        return await apiCall(`/services/${serviceId}`, 'GET');
    },

    // Create service (Admin only)
    createService: async (serviceData) => {
        return await apiCall('/services', 'POST', serviceData);
    },

    // Request service
    requestService: async (serviceData) => {
        return await apiCall('/services/request', 'POST', serviceData);
    },

    // Update service (Admin only)
    updateService: async (serviceId, serviceData) => {
        return await apiCall(`/services/${serviceId}`, 'PUT', serviceData);
    },

    // Delete service (Admin only)
    deleteService: async (serviceId) => {
        return await apiCall(`/services/${serviceId}`, 'DELETE');
    }
};

// ========== STAFF API ==========
const StaffAPI = {
    // Get all staff
    getAllStaff: async () => {
        return await apiCall('/staff', 'GET');
    },

    // Get staff by ID
    getStaff: async (staffId) => {
        return await apiCall(`/staff/${staffId}`, 'GET');
    },

    // Create staff (Admin only)
    createStaff: async (staffData) => {
        return await apiCall('/staff', 'POST', staffData);
    },

    // Update staff (Admin only)
    updateStaff: async (staffId, staffData) => {
        return await apiCall(`/staff/${staffId}`, 'PUT', staffData);
    },

    // Delete staff (Admin only)
    deleteStaff: async (staffId) => {
        return await apiCall(`/staff/${staffId}`, 'DELETE');
    }
};

// ========== REPORT API ==========
const ReportAPI = {
    // Generate revenue report
    generateRevenueReport: async (periodStart, periodEnd) => {
        return await apiCall('/reports/revenue', 'POST', { period_start: periodStart, period_end: periodEnd });
    },

    // Generate occupancy report
    generateOccupancyReport: async (periodStart, periodEnd) => {
        return await apiCall('/reports/occupancy', 'POST', { period_start: periodStart, period_end: periodEnd });
    },

    // Generate booking report
    generateBookingReport: async (periodStart, periodEnd) => {
        return await apiCall('/reports/booking', 'POST', { period_start: periodStart, period_end: periodEnd });
    },

    // Get report by ID
    getReport: async (reportId) => {
        return await apiCall(`/reports/${reportId}`, 'GET');
    },

    // Get reports by type
    getReportsByType: async (reportType) => {
        return await apiCall(`/reports/type/${reportType}`, 'GET');
    }
};

// ========== COUPON API ==========
const CouponAPI = {
    // Apply coupon
    applyCoupon: async (couponData) => {
        return await apiCall('/coupons/apply', 'POST', couponData);
    },

    // Get coupon by ID
    getCoupon: async (couponId) => {
        return await apiCall(`/coupons/${couponId}`, 'GET');
    }
};

// ========== CHECKIN/CHECKOUT API ==========
const CheckInAPI = {
    // Process check-in
    processCheckIn: async (checkInData) => {
        return await apiCall('/checkins', 'POST', checkInData);
    },

    // Process check-out
    processCheckOut: async (checkOutData) => {
        return await apiCall('/checkouts', 'POST', checkOutData);
    },

    // Get check-in by ID
    getCheckIn: async (checkInId) => {
        return await apiCall(`/checkins/${checkInId}`, 'GET');
    },

    // Get checkout summary (service requests and total)
    getCheckoutSummary: async (bookingId) => {
        return await apiCall(`/checkouts/summary/${bookingId}`, 'GET');
    }
};

// ========== WALLET API ==========
const WalletAPI = {
    getMyWallet: async () => {
        return await apiCall('/wallet', 'GET', null, true);
    },
    topUp: async (amount) => {
        return await apiCall('/wallet/topup', 'POST', { amount }, true);
    }
};

// Export API objects
window.AuthAPI = AuthAPI;
window.RoomAPI = RoomAPI;
window.BookingAPI = BookingAPI;
window.UserAPI = UserAPI;
window.PaymentAPI = PaymentAPI;
window.ServiceAPI = ServiceAPI;
window.ServiceRequestAPI = ServiceRequestAPI;
window.StaffAPI = StaffAPI;
window.ReportAPI = ReportAPI;
window.CouponAPI = CouponAPI;
window.CheckInAPI = CheckInAPI;
window.WalletAPI = WalletAPI;

