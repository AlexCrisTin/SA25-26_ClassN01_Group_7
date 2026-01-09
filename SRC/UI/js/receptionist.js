// Receptionist Panel JS
let allBookings = [];

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
});

function switchReceptionTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const tabId = `reception-${tabName}-tab`;
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
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
        const booking = bookings.find(b =>
            b.id.toString() === keyword ||
            (b.guest_name && b.guest_name.toLowerCase().includes(lower))
        );

        if (!booking) {
            resultDiv.innerHTML = '<p class="loading">Không tìm thấy đặt phòng phù hợp.</p>';
            return;
        }

        if (booking.status !== 'confirmed') {
            resultDiv.innerHTML = `
                <p class="loading">
                    Đặt phòng #${booking.id} hiện đang ở trạng thái 
                    "<strong>${getBookingStatusText(booking.status)}</strong>".<br>
                    Chỉ những đặt phòng <strong>Đã Xác Nhận</strong> mới có thể check-in.
                </p>
            `;
            return;
        }

        // Hiển thị thẻ thông tin booking với nút check-in tự động (không cần nhập room_id)
        resultDiv.innerHTML = `
            <div class="report-card">
                <h3>Đặt phòng #${booking.id} - ${booking.guest_name}</h3>
                <p>Loại phòng: <strong>${booking.room_type}</strong></p>
                <p>Ngày nhận: <strong>${formatDate(booking.check_in_date)}</strong></p>
                <p>Ngày trả: <strong>${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</strong></p>
                <p>Tổng tiền: <strong>${booking.total_price ? booking.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</strong></p>
                <p style="color: #666; font-size: 13px; margin-top: 10px;">
                    Hệ thống sẽ tự động chọn một phòng trống phù hợp với loại phòng 
                    <strong>${booking.room_type}</strong> cho khách.
                </p>

                <div style="margin-top: 20px; display:flex; gap:10px; justify-content:flex-end;">
                    <button class="btn-primary" onclick="processCheckin(${booking.id})">
                        Thực Hiện Check-in
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        showNotification('Lỗi khi tìm kiếm đặt phòng: ' + error.message, 'error');
        resultDiv.innerHTML = '<p class="loading">Đã xảy ra lỗi khi tìm kiếm.</p>';
    }
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
        const booking = bookings.find(b =>
            b.id.toString() === keyword ||
            (b.guest_name && b.guest_name.toLowerCase().includes(lower))
        );

        if (!booking) {
            resultDiv.innerHTML = '<p class="loading">Không tìm thấy đặt phòng phù hợp.</p>';
            return;
        }

        if (booking.status !== 'checked_in') {
            resultDiv.innerHTML = `
                <p class="loading">
                    Đặt phòng #${booking.id} hiện đang ở trạng thái 
                    "<strong>${getBookingStatusText(booking.status)}</strong>".<br>
                    Chỉ những đặt phòng <strong>Đã Check-in</strong> mới có thể check-out.
                </p>
            `;
            return;
        }

        currentCheckoutBooking = booking;

        const amount = booking.total_price || 0;

        resultDiv.innerHTML = `
            <div class="report-card">
                <h3>Check-out cho đặt phòng #${booking.id} - ${booking.guest_name}</h3>
                <p>Loại phòng: <strong>${booking.room_type}</strong></p>
                <p>Ngày nhận: <strong>${formatDate(booking.check_in_date)}</strong></p>
                <p>Ngày trả: <strong>${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</strong></p>
                <p>Tổng tiền trong hệ thống: <strong>${amount.toLocaleString('vi-VN')} VNĐ</strong></p>
                <p style="color:#666; font-size:13px; margin-top:8px;">
                    Hệ thống sẽ dùng số tiền trên làm tổng tiền thanh toán khi check-out.
                </p>
                <div style="margin-top: 16px; display:flex; justify-content:flex-end; gap:10px;">
                    <button class="btn-primary" onclick="processCheckout()">
                        Thực Hiện Check-out
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        showNotification('Lỗi khi tìm kiếm đặt phòng: ' + error.message, 'error');
        resultDiv.innerHTML = '<p class="loading">Đã xảy ra lỗi khi tìm kiếm.</p>';
    }
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
        await CheckInAPI.processCheckOut({
            booking_id: currentCheckoutBooking.id,
            total_amount: currentCheckoutBooking.total_price || 0,
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


