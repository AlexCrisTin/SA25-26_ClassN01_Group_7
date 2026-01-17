// Receptionist Panel JS
let allBookings = [];
let allServiceRequests = [];

// Expose to window for language manager access
window.allBookings = allBookings;
window.allServiceRequests = allServiceRequests;

document.addEventListener('DOMContentLoaded', async function() {
    // Chỉ cho phép receptionist hoặc admin
    if (!AuthManager.requireAuth()) {
        return;
    }
    if (!AuthManager.isReceptionist()) {
        showNotification('Bạn không có quyền truy cập trang này', 'error');
        setTimeout(() => {
            window.location.href = AuthManager.getRedirectUrl();
        }, 1500);
        return;
    }

    const user = AuthManager.getCurrentUser();
    document.getElementById('receptionUserName').textContent = user.username || user.full_name || 'Receptionist';

    // Ẩn link ADMIN PANEL nếu không phải admin (chỉ receptionist)
    if (!AuthManager.isAdmin()) {
        const adminNav = document.getElementById('navAdmin');
        if (adminNav) {
            adminNav.style.display = 'none';
        }
    }

    await loadBookings();
    
    // Load service requests when service-requests tab is active
    const serviceRequestsTab = document.getElementById('reception-service-requests-tab');
    if (serviceRequestsTab && serviceRequestsTab.classList.contains('active')) {
        await loadServiceRequests();
    }
    
    // Setup form handler for update service request
    const updateServiceRequestForm = document.getElementById('updateServiceRequestForm');
    if (updateServiceRequestForm) {
        updateServiceRequestForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const requestId = document.getElementById('update_request_id').value;
            const status = document.getElementById('update_request_status').value;
            const notes = document.getElementById('update_request_notes').value || null;
            
            try {
                await ServiceRequestAPI.updateServiceRequestStatus(requestId, status, notes);
                showNotification('Cập nhật trạng thái yêu cầu dịch vụ thành công!', 'success');
                closeModal('updateServiceRequestModal');
                loadServiceRequests();
            } catch (error) {
                showNotification('Lỗi khi cập nhật trạng thái: ' + error.message, 'error');
            }
        });
    }
});

function switchReceptionTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const tabId = `reception-${tabName}-tab`;
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
    
    // Load service requests when switching to service-requests tab
    if (tabName === 'service-requests') {
        loadServiceRequests();
    }
}

// Reuse booking list for receptionist
async function loadBookings() {
    try {
        allBookings = await BookingAPI.getAllBookings();
        displayBookings(allBookings);
    } catch (error) {
        console.error(error);
        showNotification('Lỗi khi tải danh sách đặt phòng: ' + error.message, 'error');
        const tbody = document.getElementById('bookingsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" class="loading">Lỗi khi tải dữ liệu</td></tr>';
        }
    }
}

function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;

    if (!bookings || bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">Chưa có đặt phòng nào</td></tr>';
        return;
    }

    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>#${booking.id}</td>
            <td>${booking.guest_name}</td>
            <td>${booking.room_type}</td>
            <td>${formatDate(booking.check_in_date)}</td>
            <td>${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</td>
            <td>${booking.total_price ? booking.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</td>
            <td><span class="status-badge status-${booking.status}">${getBookingStatusText(booking.status)}</span></td>
            <td>
                <div class="action-buttons">
                    ${booking.status === 'pending' ? `<button class="btn-edit" onclick="updateBookingStatus(${booking.id}, 'confirmed')">Xác Nhận</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function filterBookings() {
    const searchTerm = document.getElementById('bookingSearch').value.toLowerCase();
    const statusFilter = document.getElementById('bookingStatusFilter').value;

    let filtered = allBookings.filter(booking => {
        const matchesSearch = !searchTerm ||
            (booking.guest_name && booking.guest_name.toLowerCase().includes(searchTerm)) ||
            (booking.room_type && booking.room_type.toLowerCase().includes(searchTerm)) ||
            booking.id.toString().includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    displayBookings(filtered);
}

function getBookingStatusText(status) {
    const statusMap = {
        'pending': 'Chờ Xác Nhận',
        'confirmed': 'Đã Xác Nhận',
        'cancelled': 'Đã Hủy',
        'checked_in': 'Đã Check-in',
        'checked_out': 'Đã Check-out'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

async function updateBookingStatus(bookingId, status) {
    try {
        await BookingAPI.updateBooking(bookingId, { status });
        showNotification('Cập nhật trạng thái thành công!', 'success');
        await loadBookings();
    } catch (error) {
        showNotification('Lỗi khi cập nhật: ' + error.message, 'error');
    }
}

// Check-in search & processing (auto-assign room)
async function searchCheckinBooking() {
    const keyword = document.getElementById('checkinBookingSearch').value.trim();
    const resultDiv = document.getElementById('checkinBookingResult');

    if (!keyword) {
        showNotification('Vui lòng nhập ID đặt phòng hoặc tên khách', 'error');
        return;
    }

    resultDiv.innerHTML = '<p class="loading">Đang tìm kiếm đặt phòng...</p>';

    try {
        // Ưu tiên dùng dữ liệu đã load, nếu chưa thì gọi API
        const bookings = allBookings && allBookings.length > 0
            ? allBookings
            : await BookingAPI.getAllBookings();

        const lower = keyword.toLowerCase();
        // Tìm tất cả bookings khớp (không chỉ booking đầu tiên)
        const matchedBookings = bookings.filter(b =>
            b.id.toString() === keyword ||
            (b.guest_name && b.guest_name.toLowerCase().includes(lower))
        );

        if (matchedBookings.length === 0) {
            resultDiv.innerHTML = '<p class="loading">Không tìm thấy đặt phòng phù hợp.</p>';
            return;
        }

        // Lọc chỉ những booking có thể check-in (status = 'confirmed')
        const checkinableBookings = matchedBookings.filter(b => b.status === 'confirmed');

        if (checkinableBookings.length === 0) {
            // Hiển thị thông báo nếu tất cả bookings đều không thể check-in
            const statusMessages = matchedBookings.map(b => 
                `Đặt phòng #${b.id}: ${getBookingStatusText(b.status)}`
            ).join('<br>');
            
            resultDiv.innerHTML = `
                <p class="loading">
                    Tìm thấy ${matchedBookings.length} đặt phòng nhưng không có đặt phòng nào có thể check-in.<br><br>
                    ${statusMessages}<br><br>
                    Chỉ những đặt phòng <strong>Đã Xác Nhận</strong> mới có thể check-in.
                </p>
            `;
            return;
        }

        // Nếu chỉ có 1 booking, hiển thị trực tiếp
        if (checkinableBookings.length === 1) {
            await displayCheckinBooking(checkinableBookings[0]);
            return;
        }

        // Nếu có nhiều bookings, hiển thị danh sách để chọn
        resultDiv.innerHTML = `
            <div style="margin-bottom: 16px;">
                <h3 style="margin: 0 0 8px 0; color: #333;">Tìm thấy ${checkinableBookings.length} đặt phòng có thể check-in:</h3>
                <p style="color: #666; font-size: 14px; margin: 0;">Vui lòng chọn đặt phòng muốn check-in:</p>
            </div>
            ${checkinableBookings.map(booking => `
                <div class="report-card" style="margin-bottom: 16px;">
                    <h4 style="margin: 0 0 12px 0; color: #333;">Đặt phòng #${booking.id} - ${booking.guest_name}</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px;">
                        <div>
                            <p style="margin: 0; color: #999; font-size: 12px; margin-bottom: 4px;">Loại phòng</p>
                            <p style="margin: 0; font-weight: 500; color: #333;">${booking.room_type}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #999; font-size: 12px; margin-bottom: 4px;">Ngày nhận</p>
                            <p style="margin: 0; font-weight: 500; color: #333;">${formatDate(booking.check_in_date)}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #999; font-size: 12px; margin-bottom: 4px;">Ngày trả</p>
                            <p style="margin: 0; font-weight: 500; color: #333;">${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #999; font-size: 12px; margin-bottom: 4px;">Tổng tiền</p>
                            <p style="margin: 0; font-weight: 500; color: #333;">${booking.total_price ? booking.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn-primary" onclick="displayCheckinBookingDetails(${booking.id})">
                            Chọn để Check-in
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    } catch (error) {
        console.error(error);
        showNotification('Lỗi khi tìm kiếm đặt phòng: ' + error.message, 'error');
        resultDiv.innerHTML = '<p class="loading">Đã xảy ra lỗi khi tìm kiếm.</p>';
    }
}

async function displayCheckinBookingDetails(bookingId) {
    const resultDiv = document.getElementById('checkinBookingResult');
    
    try {
        // Tìm booking từ danh sách
        const bookings = allBookings && allBookings.length > 0
            ? allBookings
            : await BookingAPI.getAllBookings();
        
        const booking = bookings.find(b => b.id.toString() === bookingId.toString());
        
        if (!booking) {
            showNotification('Không tìm thấy đặt phòng', 'error');
            return;
        }
        
        await displayCheckinBooking(booking);
    } catch (error) {
        console.error(error);
        showNotification('Lỗi khi tải thông tin đặt phòng: ' + error.message, 'error');
    }
}

async function displayCheckinBooking(booking) {
    const resultDiv = document.getElementById('checkinBookingResult');
    
    // Fetch room information nếu có room_id
    let roomNumber = null;
    if (booking.room_id) {
        try {
            const room = await RoomAPI.getRoom(booking.room_id);
            roomNumber = room.room_number;
        } catch (error) {
            console.warn('Could not fetch room info:', error);
        }
    }

    // Hiển thị thẻ thông tin booking với số phòng (nếu có)
    let roomInfoHtml = '';
    if (roomNumber) {
        roomInfoHtml = `<p>Phòng đã đặt: <strong>Phòng ${roomNumber}</strong></p>`;
    } else {
        roomInfoHtml = `
            <p style="color: #666; font-size: 13px; margin-top: 10px;">
                Hệ thống sẽ tự động chọn một phòng trống phù hợp với loại phòng 
                <strong>${booking.room_type}</strong> cho khách.
            </p>
        `;
    }

    resultDiv.innerHTML = `
        <div class="report-card">
            <h3>Đặt phòng #${booking.id} - ${booking.guest_name}</h3>
            <p>Loại phòng: <strong>${booking.room_type}</strong></p>
            ${roomInfoHtml}
            <p>Ngày nhận: <strong>${formatDate(booking.check_in_date)}</strong></p>
            <p>Ngày trả: <strong>${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</strong></p>
            <p>Tổng tiền: <strong>${booking.total_price ? booking.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</strong></p>

            <div style="margin-top: 20px; display:flex; gap:10px; justify-content:flex-end;">
                <button class="btn-secondary" onclick="searchCheckinBooking()" style="background: #f5f5f5; color: #333; border: 1px solid #ddd; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    Quay Lại
                </button>
                <button class="btn-primary" onclick="processCheckin(${booking.id})">
                    Thực Hiện Check-in
                </button>
            </div>
        </div>
    `;
}

async function processCheckin(bookingId) {
    const resultDiv = document.getElementById('checkinBookingResult');
    const currentUser = AuthManager.getCurrentUser();

    if (!currentUser) {
        showNotification('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error');
        return;
    }

    resultDiv.innerHTML = '<p class="loading">Đang xử lý check-in...</p>';

    try {
        // Không cần room_id: backend tự động chọn phòng trống phù hợp
        await CheckInAPI.processCheckIn({
            booking_id: bookingId,
            receptionist_id: currentUser.id
        });

        showNotification('Check-in thành công! Hệ thống đã tự động assign phòng.', 'success');
        resultDiv.innerHTML = '';
        await loadBookings(); // Cập nhật lại danh sách đặt phòng và trạng thái
    } catch (error) {
        showNotification('Lỗi khi check-in: ' + error.message, 'error');
        resultDiv.innerHTML = '<p class="loading">Đã xảy ra lỗi khi check-in.</p>';
    }
}

let currentCheckoutBooking = null;

// Check-out search & processing
async function searchCheckoutBooking() {
    const keyword = document.getElementById('checkoutBookingSearch').value.trim();
    const resultDiv = document.getElementById('checkoutBookingResult');

    if (!keyword) {
        showNotification('Vui lòng nhập ID đặt phòng hoặc tên khách', 'error');
        return;
    }

    resultDiv.innerHTML = '<p class="loading">Đang tìm kiếm đặt phòng...</p>';

    try {
        const bookings = allBookings && allBookings.length > 0
            ? allBookings
            : await BookingAPI.getAllBookings();

        const lower = keyword.toLowerCase();
        // Tìm tất cả bookings khớp (không chỉ booking đầu tiên)
        const matchedBookings = bookings.filter(b =>
            b.id.toString() === keyword ||
            (b.guest_name && b.guest_name.toLowerCase().includes(lower))
        );

        if (matchedBookings.length === 0) {
            resultDiv.innerHTML = '<p class="loading">Không tìm thấy đặt phòng phù hợp.</p>';
            return;
        }

        // Lọc chỉ những booking có thể check-out (status = 'checked_in')
        const checkoutableBookings = matchedBookings.filter(b => b.status === 'checked_in');

        if (checkoutableBookings.length === 0) {
            // Hiển thị thông báo nếu tất cả bookings đều không thể check-out
            const statusMessages = matchedBookings.map(b => 
                `Đặt phòng #${b.id}: ${getBookingStatusText(b.status)}`
            ).join('<br>');
            
            resultDiv.innerHTML = `
                <p class="loading">
                    Tìm thấy ${matchedBookings.length} đặt phòng nhưng không có đặt phòng nào có thể check-out.<br><br>
                    ${statusMessages}<br><br>
                    Chỉ những đặt phòng <strong>Đã Check-in</strong> mới có thể check-out.
                </p>
            `;
            return;
        }

        // Nếu chỉ có 1 booking, hiển thị trực tiếp
        if (checkoutableBookings.length === 1) {
            await displayCheckoutBookingDetails(checkoutableBookings[0].id);
            return;
        }

        // Nếu có nhiều bookings, hiển thị danh sách để chọn
        resultDiv.innerHTML = `
            <div style="margin-bottom: 16px;">
                <h3 style="margin: 0 0 8px 0; color: #333;">Tìm thấy ${checkoutableBookings.length} đặt phòng có thể check-out:</h3>
                <p style="color: #666; font-size: 14px; margin: 0;">Vui lòng chọn đặt phòng muốn check-out:</p>
            </div>
            ${checkoutableBookings.map(booking => `
                <div class="report-card" style="margin-bottom: 16px;">
                    <h4 style="margin: 0 0 12px 0; color: #333;">Đặt phòng #${booking.id} - ${booking.guest_name}</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px;">
                        <div>
                            <p style="margin: 0; color: #999; font-size: 12px; margin-bottom: 4px;">Loại phòng</p>
                            <p style="margin: 0; font-weight: 500; color: #333;">${booking.room_type}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #999; font-size: 12px; margin-bottom: 4px;">Ngày nhận</p>
                            <p style="margin: 0; font-weight: 500; color: #333;">${formatDate(booking.check_in_date)}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #999; font-size: 12px; margin-bottom: 4px;">Ngày trả</p>
                            <p style="margin: 0; font-weight: 500; color: #333;">${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #999; font-size: 12px; margin-bottom: 4px;">Tổng tiền</p>
                            <p style="margin: 0; font-weight: 500; color: #333;">${booking.total_price ? booking.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn-primary" onclick="displayCheckoutBookingDetails(${booking.id})">
                            Chọn để Check-out
                        </button>
                    </div>
                </div>
            `).join('')}
        `;
    } catch (error) {
        console.error(error);
        showNotification('Lỗi khi tìm kiếm đặt phòng: ' + error.message, 'error');
        resultDiv.innerHTML = '<p class="loading">Đã xảy ra lỗi khi tìm kiếm.</p>';
    }
}

async function displayCheckoutBookingDetails(bookingId) {
    const resultDiv = document.getElementById('checkoutBookingResult');
    
    try {
        // Tìm booking từ danh sách
        const bookings = allBookings && allBookings.length > 0
            ? allBookings
            : await BookingAPI.getAllBookings();
        
        const booking = bookings.find(b => b.id.toString() === bookingId.toString());
        
        if (!booking) {
            showNotification('Không tìm thấy đặt phòng', 'error');
            return;
        }
        
        if (booking.status !== 'checked_in') {
            showNotification('Đặt phòng này chưa được check-in', 'error');
            return;
        }
        
        currentCheckoutBooking = booking;

        // Load checkout summary (service requests and total)
        try {
            const summary = await CheckInAPI.getCheckoutSummary(booking.id);
            displayCheckoutSummary(booking, summary);
        } catch (error) {
            console.warn('Could not load checkout summary, using booking price only:', error);
            // Fallback to booking price only
            const amount = booking.total_price || 0;
            currentCheckoutBooking.totalAmount = amount;
            resultDiv.innerHTML = `
                <div class="report-card">
                    <h3>Check-out cho đặt phòng #${booking.id} - ${booking.guest_name}</h3>
                    <p>Loại phòng: <strong>${booking.room_type}</strong></p>
                    <p>Ngày nhận: <strong>${formatDate(booking.check_in_date)}</strong></p>
                    <p>Ngày trả: <strong>${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</strong></p>
                    <p>Tổng tiền: <strong>${amount.toLocaleString('vi-VN')} VNĐ</strong></p>
                    <div style="margin-top: 20px; display:flex; justify-content:flex-end; gap:10px;">
                        <button class="btn-secondary" onclick="searchCheckoutBooking()" style="background: #f5f5f5; color: #333; border: 1px solid #ddd; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Quay Lại
                        </button>
                        <button class="btn-primary" onclick="processCheckout()">
                            Thực Hiện Check-out
                        </button>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error(error);
        showNotification('Lỗi khi tải thông tin đặt phòng: ' + error.message, 'error');
    }
}

function displayCheckoutSummary(booking, summary) {
    const resultDiv = document.getElementById('checkoutBookingResult');
    
    const bookingPrice = summary.booking_price || booking.total_price || 0;
    const serviceCost = summary.service_cost || 0;
    const totalAmount = summary.total_amount || (bookingPrice + serviceCost);
    
    // Store total amount for checkout
    currentCheckoutBooking.totalAmount = totalAmount;
    
    let serviceRequestsHtml = '';
    if (summary.service_requests && summary.service_requests.length > 0) {
        serviceRequestsHtml = `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <h4 style="margin: 0 0 12px 0; color: #333; font-size: 16px;">Chi phí dịch vụ phát sinh:</h4>
                <div style="background: #f9f9f9; border-radius: 8px; padding: 12px;">
                    ${summary.service_requests.map(sr => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                            <div>
                                <p style="margin: 0; font-weight: 500; color: #333;">${sr.service_name || 'Dịch vụ'}</p>
                                <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
                                    Số lượng: ${sr.quantity || 1} • 
                                    ${sr.status === 'completed' ? '✅ Đã hoàn thành' : sr.status === 'in_progress' ? '⏳ Đang xử lý' : '⏸️ Chờ xử lý'}
                                </p>
                            </div>
                            <strong style="color: #0066cc;">${(sr.total_price || 0).toLocaleString('vi-VN')} VNĐ</strong>
                        </div>
                    `).join('')}
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; margin-top: 8px; border-top: 2px solid #0066cc;">
                        <strong style="color: #333;">Tổng chi phí dịch vụ:</strong>
                        <strong style="color: #0066cc; font-size: 16px;">${serviceCost.toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                </div>
            </div>
        `;
    } else {
        serviceRequestsHtml = `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #999; font-size: 14px; margin: 0;">Không có dịch vụ phát sinh</p>
            </div>
        `;
    }
    
    resultDiv.innerHTML = `
        <div class="report-card">
            <h3>Check-out cho đặt phòng #${booking.id} - ${booking.guest_name}</h3>
            <p>Loại phòng: <strong>${booking.room_type}</strong></p>
            <p>Ngày nhận: <strong>${formatDate(booking.check_in_date)}</strong></p>
            <p>Ngày trả: <strong>${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</strong></p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <h4 style="margin: 0 0 12px 0; color: #333; font-size: 16px;">Chi tiết thanh toán:</h4>
                <div style="background: #f9f9f9; border-radius: 8px; padding: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="color: #666;">Giá phòng:</span>
                        <strong style="color: #333;">${bookingPrice.toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="color: #666;">Chi phí dịch vụ:</span>
                        <strong style="color: #333;">${serviceCost.toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; margin-top: 8px; border-top: 2px solid #0066cc;">
                        <strong style="color: #333; font-size: 18px;">Tổng thanh toán:</strong>
                        <strong style="color: #0066cc; font-size: 20px;">${totalAmount.toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                </div>
            </div>
            
            ${serviceRequestsHtml}
            
            <div style="margin-top: 20px; display:flex; justify-content:flex-end; gap:10px;">
                <button class="btn-secondary" onclick="searchCheckoutBooking()" style="background: #f5f5f5; color: #333; border: 1px solid #ddd; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    Quay Lại
                </button>
                <button class="btn-primary" onclick="processCheckout()">
                    Thực Hiện Check-out
                </button>
            </div>
        </div>
    `;
}

async function processCheckout() {
    const resultDiv = document.getElementById('checkoutBookingResult');

    if (!currentCheckoutBooking) {
        showNotification('Không tìm thấy thông tin đặt phòng để check-out.', 'error');
        return;
    }

    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
        showNotification('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error');
        return;
    }

    resultDiv.innerHTML = '<p class="loading">Đang xử lý check-out...</p>';

    try {
        // Use totalAmount if available (includes service costs), otherwise use booking price
        const totalAmount = currentCheckoutBooking.totalAmount || currentCheckoutBooking.total_price || 0;
        
        await CheckInAPI.processCheckOut({
            booking_id: currentCheckoutBooking.id,
            total_amount: totalAmount,
            receptionist_id: currentUser.id
        });

        showNotification('Check-out thành công!', 'success');
        currentCheckoutBooking = null;
        resultDiv.innerHTML = '';
        await loadBookings();
    } catch (error) {
        showNotification('Lỗi khi check-out: ' + error.message, 'error');
        resultDiv.innerHTML = '<p class="loading">Đã xảy ra lỗi khi check-out.</p>';
    }
}

// Export
window.switchReceptionTab = switchReceptionTab;
window.filterBookings = filterBookings;
window.updateBookingStatus = updateBookingStatus;
window.searchCheckinBooking = searchCheckinBooking;
window.searchCheckoutBooking = searchCheckoutBooking;
        window.processCheckin = processCheckin;
        window.processCheckout = processCheckout;
        window.displayCheckinBookingDetails = displayCheckinBookingDetails;
        window.displayCheckoutBookingDetails = displayCheckoutBookingDetails;

// ========== SERVICE REQUEST MANAGEMENT ==========
async function loadServiceRequests() {
    try {
        const requests = await ServiceRequestAPI.getAllServiceRequests();
        allServiceRequests = requests;
        window.allServiceRequests = allServiceRequests; // Update window reference
        displayServiceRequests(requests);
    } catch (error) {
        showNotification('Lỗi khi tải danh sách yêu cầu dịch vụ: ' + error.message, 'error');
        document.getElementById('serviceRequestsTableBody').innerHTML = '<tr><td colspan="9" class="error">Lỗi khi tải dữ liệu</td></tr>';
    }
}

function displayServiceRequests(requests) {
    const tbody = document.getElementById('serviceRequestsTableBody');
    if (!requests || requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty">Không có yêu cầu dịch vụ nào</td></tr>';
        return;
    }

    tbody.innerHTML = requests.map(req => {
        const statusLabel = req.status || 'pending';
        const statusClass = 
            statusLabel === 'completed' ? 'status-completed' :
            statusLabel === 'in_progress' ? 'status-in-progress' :
            statusLabel === 'cancelled' ? 'status-cancelled' : 'status-pending';
        
        const requestedAt = req.requested_at ? new Date(req.requested_at).toLocaleString('vi-VN') : 'N/A';
        const totalPrice = req.total_price ? parseFloat(req.total_price).toLocaleString('vi-VN') + ' VNĐ' : 'N/A';
        
        return `
            <tr>
                <td>${req.id}</td>
                <td>${req.service_name || 'N/A'}</td>
                <td>${req.guest_name || 'N/A'}</td>
                <td>${req.room_number || 'N/A'}</td>
                <td>${req.quantity || 1}</td>
                <td>${totalPrice}</td>
                <td><span class="badge ${statusClass}">${getStatusLabel(statusLabel)}</span></td>
                <td>${requestedAt}</td>
                <td>
                    <button class="btn-edit" onclick="updateServiceRequestStatus(${req.id})">Cập Nhật</button>
                </td>
            </tr>
        `;
    }).join('');
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Chờ Xử Lý',
        'in_progress': 'Đang Xử Lý',
        'completed': 'Đã Hoàn Thành',
        'cancelled': 'Đã Hủy'
    };
    return labels[status] || status;
}

async function updateServiceRequestStatus(requestId) {
    try {
        const request = await ServiceRequestAPI.getServiceRequest(requestId);
        document.getElementById('update_request_id').value = request.id;
        document.getElementById('update_request_service_name').value = request.service_name || 'N/A';
        document.getElementById('update_request_guest_name').value = request.guest_name || 'N/A';
        document.getElementById('update_request_room_number').value = request.room_number || 'N/A';
        document.getElementById('update_request_status').value = request.status || 'pending';
        document.getElementById('update_request_notes').value = request.notes || '';
        document.getElementById('updateServiceRequestModal').style.display = 'block';
    } catch (error) {
        showNotification('Lỗi khi tải thông tin yêu cầu dịch vụ: ' + error.message, 'error');
    }
}

function filterServiceRequests() {
    const searchTerm = document.getElementById('serviceRequestSearch').value.toLowerCase();
    const statusFilter = document.getElementById('serviceRequestStatusFilter').value;
    
    let filtered = allServiceRequests || [];
    
    if (searchTerm) {
        filtered = filtered.filter(req => 
            (req.service_name && req.service_name.toLowerCase().includes(searchTerm)) ||
            (req.guest_name && req.guest_name.toLowerCase().includes(searchTerm)) ||
            (req.room_number && req.room_number.toLowerCase().includes(searchTerm)) ||
            (req.category && req.category.toLowerCase().includes(searchTerm))
        );
    }
    
    if (statusFilter !== 'all') {
        filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    displayServiceRequests(filtered);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

window.loadServiceRequests = loadServiceRequests;
window.updateServiceRequestStatus = updateServiceRequestStatus;
window.filterServiceRequests = filterServiceRequests;
window.closeModal = closeModal;

