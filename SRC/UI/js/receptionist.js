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

    // Load dữ liệu khi chuyển tab
    if (tabName === 'checkin') {
        loadCheckinBookings();
    } else if (tabName === 'checkout') {
        loadCheckoutBookings();
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
        // Reload check-in tab nếu đang mở
        const checkinTab = document.getElementById('reception-checkin-tab');
        if (checkinTab && checkinTab.classList.contains('active')) {
            await loadCheckinBookings();
        }
    } catch (error) {
        showNotification('Lỗi khi cập nhật: ' + error.message, 'error');
    }
}

// ========== CHECK-IN FUNCTIONS ==========
let checkinBookings = [];

async function loadCheckinBookings() {
    try {
        const allBookings = await BookingAPI.getAllBookings();
        // Chỉ lấy booking đã confirmed (chưa check-in)
        checkinBookings = allBookings.filter(b => b.status === 'confirmed');
        displayCheckinBookings(checkinBookings);
    } catch (error) {
        console.error(error);
        const tbody = document.getElementById('checkinBookingsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">Lỗi khi tải dữ liệu</td></tr>';
        }
    }
}

function displayCheckinBookings(bookings) {
    const tbody = document.getElementById('checkinBookingsTableBody');
    if (!tbody) return;

    if (!bookings || bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Chưa có đặt phòng nào cần check-in</td></tr>';
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
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="showCheckinModal(${booking.id})">Check-in</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterCheckinBookings() {
    const searchTerm = document.getElementById('checkinBookingSearch').value.toLowerCase();
    let filtered = checkinBookings.filter(booking => {
        return !searchTerm ||
            (booking.guest_name && booking.guest_name.toLowerCase().includes(searchTerm)) ||
            (booking.room_type && booking.room_type.toLowerCase().includes(searchTerm)) ||
            booking.id.toString().includes(searchTerm);
    });
    displayCheckinBookings(filtered);
}

async function showCheckinModal(bookingId) {
    try {
        const booking = await BookingAPI.getBooking(bookingId);
        if (!booking || booking.status !== 'confirmed') {
            showNotification('Booking không hợp lệ hoặc đã được xử lý', 'error');
            return;
        }

        // Lấy danh sách phòng trống cùng loại
        const rooms = await RoomAPI.searchRooms(booking.room_type, 'available');
        
        if (!rooms || rooms.length === 0) {
            showNotification('Không có phòng trống cùng loại', 'error');
            return;
        }

        // Hiển thị modal chọn phòng
        const roomOptions = rooms.map(r => 
            `<option value="${r.id}">Phòng ${r.room_number} - ${r.room_type} (${r.price.toLocaleString('vi-VN')} VNĐ/đêm)</option>`
        ).join('');

        const modal = `
            <div id="checkinModal" class="modal" style="display: block;">
                <div class="modal-content">
                    <span class="close" onclick="closeCheckinModal()">&times;</span>
                    <h2>Check-in Booking #${booking.id}</h2>
                    <div style="margin-bottom: 20px;">
                        <p><strong>Tên khách:</strong> ${booking.guest_name}</p>
                        <p><strong>Loại phòng:</strong> ${booking.room_type}</p>
                        <p><strong>Ngày nhận:</strong> ${formatDate(booking.check_in_date)}</p>
                        <p><strong>Ngày trả:</strong> ${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</p>
                    </div>
                    <form id="checkinForm">
                        <div class="form-group">
                            <label>Chọn Phòng *</label>
                            <select id="checkinRoomId" required>
                                <option value="">-- Chọn phòng --</option>
                                ${roomOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Số lượng khách</label>
                            <input type="number" id="checkinGuestCount" min="1" value="1" required>
                        </div>
                        <div class="form-group">
                            <label>Ghi chú</label>
                            <textarea id="checkinNotes" rows="3" placeholder="Ghi chú về check-in..."></textarea>
                        </div>
                        <button type="submit" class="btn-primary">Xác Nhận Check-in</button>
                        <button type="button" class="btn-secondary" onclick="closeCheckinModal()">Hủy</button>
                    </form>
                </div>
            </div>
        `;

        // Xóa modal cũ nếu có
        const oldModal = document.getElementById('checkinModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', modal);

        // Xử lý submit form
        document.getElementById('checkinForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            await processCheckin(bookingId);
        });
    } catch (error) {
        showNotification('Lỗi khi tải thông tin booking: ' + error.message, 'error');
    }
}

async function processCheckin(bookingId) {
    const roomId = document.getElementById('checkinRoomId').value;
    const guestCount = parseInt(document.getElementById('checkinGuestCount').value) || 1;
    const notes = document.getElementById('checkinNotes').value || null;

    if (!roomId) {
        showNotification('Vui lòng chọn phòng', 'error');
        return;
    }

    try {
        const user = AuthManager.getCurrentUser();
        // Lấy receptionist_id từ staff table hoặc dùng user_id
        const receptionistId = user.id; // Tạm thời dùng user_id

        const checkinData = {
            booking_id: bookingId,
            room_id: parseInt(roomId),
            guest_count: guestCount,
            notes: notes,
            receptionist_id: receptionistId
        };

        await CheckInAPI.processCheckIn(checkinData);
        showNotification('Check-in thành công!', 'success');
        closeCheckinModal();
        await loadCheckinBookings();
        await loadBookings(); // Reload tab bookings
    } catch (error) {
        showNotification('Lỗi khi check-in: ' + error.message, 'error');
    }
}

function closeCheckinModal() {
    const modal = document.getElementById('checkinModal');
    if (modal) modal.remove();
}

// ========== CHECK-OUT FUNCTIONS ==========
let checkoutBookings = [];

async function loadCheckoutBookings() {
    try {
        const allBookings = await BookingAPI.getAllBookings();
        // Chỉ lấy booking đã checked_in (chưa check-out)
        checkoutBookings = allBookings.filter(b => b.status === 'checked_in');
        displayCheckoutBookings(checkoutBookings);
    } catch (error) {
        console.error(error);
        const tbody = document.getElementById('checkoutBookingsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">Lỗi khi tải dữ liệu</td></tr>';
        }
    }
}

function displayCheckoutBookings(bookings) {
    const tbody = document.getElementById('checkoutBookingsTableBody');
    if (!tbody) return;

    if (!bookings || bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Chưa có đặt phòng nào cần check-out</td></tr>';
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
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="showCheckoutModal(${booking.id})">Check-out</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterCheckoutBookings() {
    const searchTerm = document.getElementById('checkoutBookingSearch').value.toLowerCase();
    let filtered = checkoutBookings.filter(booking => {
        return !searchTerm ||
            (booking.guest_name && booking.guest_name.toLowerCase().includes(searchTerm)) ||
            (booking.room_type && booking.room_type.toLowerCase().includes(searchTerm)) ||
            booking.id.toString().includes(searchTerm);
    });
    displayCheckoutBookings(filtered);
}

async function showCheckoutModal(bookingId) {
    try {
        const booking = await BookingAPI.getBooking(bookingId);
        if (!booking || booking.status !== 'checked_in') {
            showNotification('Booking không hợp lệ hoặc chưa check-in', 'error');
            return;
        }

        const modal = `
            <div id="checkoutModal" class="modal" style="display: block;">
                <div class="modal-content">
                    <span class="close" onclick="closeCheckoutModal()">&times;</span>
                    <h2>Check-out Booking #${booking.id}</h2>
                    <div style="margin-bottom: 20px;">
                        <p><strong>Tên khách:</strong> ${booking.guest_name}</p>
                        <p><strong>Loại phòng:</strong> ${booking.room_type}</p>
                        <p><strong>Ngày nhận:</strong> ${formatDate(booking.check_in_date)}</p>
                        <p><strong>Ngày trả:</strong> ${booking.check_out_date ? formatDate(booking.check_out_date) : 'N/A'}</p>
                        <p><strong>Giá phòng:</strong> ${booking.total_price ? booking.total_price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</p>
                    </div>
                    <form id="checkoutForm">
                        <div class="form-group">
                            <label>Tổng tiền phòng</label>
                            <input type="number" id="checkoutTotalAmount" value="${booking.total_price || 0}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Phí phát sinh (VNĐ)</label>
                            <input type="number" id="checkoutAdditionalCharges" min="0" value="0" placeholder="Minibar, dịch vụ, damage...">
                        </div>
                        <div class="form-group">
                            <label>Số tiền hoàn lại (VNĐ)</label>
                            <input type="number" id="checkoutRefundAmount" min="0" value="0" placeholder="Nếu có hoàn tiền...">
                        </div>
                        <div class="form-group">
                            <label>Ghi chú</label>
                            <textarea id="checkoutNotes" rows="3" placeholder="Ghi chú về check-out..."></textarea>
                        </div>
                        <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px;">
                            <strong>Tổng thanh toán: <span id="checkoutFinalAmount">${booking.total_price || 0}</span> VNĐ</strong>
                        </div>
                        <button type="submit" class="btn-primary">Xác Nhận Check-out</button>
                        <button type="button" class="btn-secondary" onclick="closeCheckoutModal()">Hủy</button>
                    </form>
                </div>
            </div>
        `;

        // Xóa modal cũ nếu có
        const oldModal = document.getElementById('checkoutModal');
        if (oldModal) oldModal.remove();

        document.body.insertAdjacentHTML('beforeend', modal);

        // Tính tổng tiền khi thay đổi
        const totalInput = document.getElementById('checkoutTotalAmount');
        const chargesInput = document.getElementById('checkoutAdditionalCharges');
        const refundInput = document.getElementById('checkoutRefundAmount');
        const finalAmountSpan = document.getElementById('checkoutFinalAmount');

        function updateFinalAmount() {
            const total = parseFloat(totalInput.value) || 0;
            const charges = parseFloat(chargesInput.value) || 0;
            const refund = parseFloat(refundInput.value) || 0;
            const final = total + charges - refund;
            finalAmountSpan.textContent = final.toLocaleString('vi-VN');
        }

        chargesInput.addEventListener('input', updateFinalAmount);
        refundInput.addEventListener('input', updateFinalAmount);

        // Xử lý submit form
        document.getElementById('checkoutForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            await processCheckout(bookingId);
        });
    } catch (error) {
        showNotification('Lỗi khi tải thông tin booking: ' + error.message, 'error');
    }
}

async function processCheckout(bookingId) {
    const totalAmount = parseFloat(document.getElementById('checkoutTotalAmount').value) || 0;
    const additionalCharges = parseFloat(document.getElementById('checkoutAdditionalCharges').value) || 0;
    const refundAmount = parseFloat(document.getElementById('checkoutRefundAmount').value) || 0;
    const notes = document.getElementById('checkoutNotes').value || null;

    const finalAmount = totalAmount + additionalCharges - refundAmount;

    if (finalAmount < 0) {
        showNotification('Tổng tiền không hợp lệ', 'error');
        return;
    }

    try {
        const user = AuthManager.getCurrentUser();
        const receptionistId = user.id; // Tạm thời dùng user_id

        const checkoutData = {
            booking_id: bookingId,
            total_amount: finalAmount,
            additional_charges: additionalCharges,
            refund_amount: refundAmount,
            notes: notes,
            receptionist_id: receptionistId
        };

        await CheckInAPI.processCheckOut(checkoutData);
        showNotification('Check-out thành công!', 'success');
        closeCheckoutModal();
        await loadCheckoutBookings();
        await loadBookings(); // Reload tab bookings
    } catch (error) {
        showNotification('Lỗi khi check-out: ' + error.message, 'error');
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.remove();
}

// Export
window.switchReceptionTab = switchReceptionTab;
window.filterBookings = filterBookings;
window.updateBookingStatus = updateBookingStatus;
window.filterCheckinBookings = filterCheckinBookings;
window.filterCheckoutBookings = filterCheckoutBookings;
window.showCheckinModal = showCheckinModal;
window.showCheckoutModal = showCheckoutModal;
window.closeCheckinModal = closeCheckinModal;
window.closeCheckoutModal = closeCheckoutModal;


