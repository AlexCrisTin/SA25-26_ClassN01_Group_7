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

// Check-in search & processing
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

        // Hiển thị thẻ thông tin booking kèm form nhập room_id để check-in
        resultDiv.innerHTML = `
            <div class="report-card">
                <h3>Đặt phòng #${booking.id} - ${booking.guest_name}</h3>
                <p>Loại phòng: <strong>${booking.room_type}</strong></p>
                <p>Ngày nhận: <strong>${formatDate(booking.check_in_date)}</strong></p>
                <p>Ngày trả: <strong>${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</strong></p>
                <p>Tổng tiền: <strong>${booking.total_price ? booking.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</strong></p>

                <div style="margin-top: 15px;">
                    <label for="checkinRoomIdInput" style="display:block; font-size:13px; margin-bottom:4px;">
                        ID phòng để check-in (đã được gán cho khách)
                    </label>
                    <input 
                        type="number" 
                        id="checkinRoomIdInput" 
                        placeholder="Nhập ID phòng, ví dụ: 1" 
                        style="width:100%; padding:8px 10px; border:1px solid #d1d5db; border-radius:6px; font-size:13px;"
                    >
                </div>

                <div style="margin-top: 15px; display:flex; gap:10px; justify-content:flex-end;">
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
    const roomIdInput = document.getElementById('checkinRoomIdInput');
    const resultDiv = document.getElementById('checkinBookingResult');

    if (!roomIdInput) {
        showNotification('Không tìm thấy ô nhập ID phòng.', 'error');
        return;
    }

    const roomId = roomIdInput.value.trim();
    if (!roomId) {
        showNotification('Vui lòng nhập ID phòng để check-in.', 'error');
        return;
    }

    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
        showNotification('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error');
        return;
    }

    try {
        await CheckInAPI.processCheckIn({
            booking_id: bookingId,
            room_id: parseInt(roomId, 10),
            checkin_time: new Date().toISOString(),
            receptionist_id: currentUser.id
        });

        showNotification('Check-in thành công!', 'success');
        resultDiv.innerHTML = '';
        await loadBookings(); // Cập nhật lại danh sách đặt phòng và trạng thái
    } catch (error) {
        showNotification('Lỗi khi check-in: ' + error.message, 'error');
    }
}

// Placeholder cho check-out (có thể triển khai tương tự sau)
function searchCheckoutBooking() {
    const keyword = document.getElementById('checkoutBookingSearch').value.trim();
    if (!keyword) {
        showNotification('Vui lòng nhập ID đặt phòng hoặc tên khách', 'error');
        return;
    }
    showNotification('Tính năng check-out chi tiết có thể được bổ sung sau (demo).', 'info');
}

// Export
window.switchReceptionTab = switchReceptionTab;
window.filterBookings = filterBookings;
window.updateBookingStatus = updateBookingStatus;
window.searchCheckinBooking = searchCheckinBooking;
window.searchCheckoutBooking = searchCheckoutBooking;
window.processCheckin = processCheckin;


