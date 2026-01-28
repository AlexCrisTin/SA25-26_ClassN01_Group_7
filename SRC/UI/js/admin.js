// Admin Panel JavaScript
let currentEditingRoomId = null;
let allRooms = [];
let allBookings = [];
let allStaff = [];
let allServices = [];
let allUsers = [];

// Expose to window for language manager access
window.allRooms = allRooms;
window.allBookings = allBookings;
window.allStaff = allStaff;
window.allServices = allServices;
window.allUsers = allUsers;

// Check admin access on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!AuthManager.requireAuth()) {
        return;
    }

    if (!AuthManager.isAdmin()) {
        const noAccessMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.noAccess') || 'Bạn không có quyền truy cập trang này'
            : 'Bạn không có quyền truy cập trang này';
        showNotification(noAccessMsg, 'error');
        setTimeout(() => {
            window.location.href = AuthManager.getRedirectUrl();
        }, 2000);
        return;
    }

    const user = AuthManager.getCurrentUser();
    document.getElementById('adminUserName').textContent = user.username || user.full_name || 'Admin';

    // Load initial data
    loadRooms();
    // Tab quản lý đặt phòng đã được chuyển sang Receptionist Panel
    loadStaff();
    loadUsers();
    loadServices();

    // Setup form handlers
    setupFormHandlers();
});

// Tab Switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    // Load reports if reports tab is selected
    if (tabName === 'reports') {
        loadReports();
    }
}

// ========== ROOM MANAGEMENT ==========
async function loadRooms() {
    try {
        allRooms = await RoomAPI.getAllRooms();
        window.allRooms = allRooms; // Update window reference
        displayRooms(allRooms);
    } catch (error) {
        const loadErrorMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.loadError') || 'Lỗi khi tải danh sách phòng: '
            : 'Lỗi khi tải danh sách phòng: ';
        showNotification(loadErrorMsg + error.message, 'error');
        const errorMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.dataLoadError') || 'Lỗi khi tải dữ liệu'
            : 'Lỗi khi tải dữ liệu';
        document.getElementById('roomsTableBody').innerHTML = `<tr><td colspan="7" class="loading">${errorMsg}</td></tr>`;
    }
}

function displayRooms(rooms) {
    const tbody = document.getElementById('roomsTableBody');
    
    if (rooms.length === 0) {
        const emptyMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.rooms.empty') || 'Chưa có phòng nào'
            : 'Chưa có phòng nào';
        tbody.innerHTML = `<tr><td colspan="7" class="loading">${emptyMsg}</td></tr>`;
        return;
    }

    tbody.innerHTML = rooms.map(room => `
        <tr>
            <td>${room.id}</td>
            <td>
                ${room.image_url ? 
                    `<img src="${room.image_url}" alt="Room ${room.room_number}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px; vertical-align: middle;">` 
                    : '<span style="color: #999;">No image</span>'
                }
                ${room.room_number}
            </td>
            <td>${room.room_type}</td>
            <td>${room.price ? room.price.toLocaleString('vi-VN') : 'N/A'} VNĐ</td>
            <td><span class="status-badge status-${room.status}">${getRoomStatusText(room.status)}</span></td>
            <td>${room.capacity || 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editRoom(${room.id})">${LanguageManager.getTranslation('common.edit') || 'Sửa'}</button>
                    <button class="btn-delete" onclick="deleteRoom(${room.id})">${LanguageManager.getTranslation('common.delete') || 'Xóa'}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterRooms() {
    const searchTerm = document.getElementById('roomSearch').value.toLowerCase();
    const statusFilter = document.getElementById('roomStatusFilter').value;

    let filtered = allRooms.filter(room => {
        const matchesSearch = !searchTerm || 
            room.room_number.toLowerCase().includes(searchTerm) ||
            room.room_type.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    displayRooms(filtered);
}

function getRoomStatusText(status) {
    if (!status) return status;
    const statusKey = `admin.rooms.status.${status}`;
    return LanguageManager.getTranslation(statusKey) || status;
}

function showAddRoomModal() {
    document.getElementById('addRoomForm').reset();
    document.getElementById('room_image_preview').style.display = 'none';
    document.getElementById('room_image_preview_img').src = '';
    document.getElementById('addRoomModal').style.display = 'block';
}

// Image preview functions
function previewRoomImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('room_image_preview_img').src = e.target.result;
            document.getElementById('room_image_preview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeRoomImage() {
    document.getElementById('room_image').value = '';
    document.getElementById('room_image_preview').style.display = 'none';
    document.getElementById('room_image_preview_img').src = '';
}

function previewEditRoomImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('edit_room_image_preview_img').src = e.target.result;
            document.getElementById('edit_room_image_preview').style.display = 'block';
            document.getElementById('edit_room_current_image').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

function removeEditRoomImage() {
    document.getElementById('edit_room_image').value = '';
    document.getElementById('edit_room_image_preview').style.display = 'none';
    document.getElementById('edit_room_image_preview_img').src = '';
    // Show current image again if exists
    const currentImageDiv = document.getElementById('edit_room_current_image');
    if (currentImageDiv.innerHTML) {
        currentImageDiv.style.display = 'block';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

async function editRoom(roomId) {
    console.log('editRoom called with roomId:', roomId, 'type:', typeof roomId);
    console.log('allRooms:', allRooms);
    
    // Convert roomId to string for comparison (room.id is usually string from API)
    const roomIdStr = String(roomId);
    const room = allRooms.find(r => String(r.id) === roomIdStr);
    
    console.log('Found room:', room);
    
    if (!room) {
        console.error('Room not found with id:', roomId);
        showNotification('Không tìm thấy thông tin phòng', 'error');
        return;
    }

    try {
        currentEditingRoomId = roomId;
        document.getElementById('edit_room_id').value = room.id;
        document.getElementById('edit_room_number').value = room.room_number || '';
        document.getElementById('edit_room_type').value = room.room_type || '';
        document.getElementById('edit_room_price').value = room.price || '';
        document.getElementById('edit_room_status').value = room.status || 'available';
        document.getElementById('edit_room_capacity').value = room.capacity || '';
        
        // Reset image previews
        document.getElementById('edit_room_image').value = '';
        document.getElementById('edit_room_image_preview').style.display = 'none';
        document.getElementById('edit_room_image_preview_img').src = '';
        
        // Show current image if exists
        const currentImageDiv = document.getElementById('edit_room_current_image');
        if (room.image_url) {
            currentImageDiv.innerHTML = `
                <p style="margin-bottom: 5px; font-size: 12px; color: #666;">Ảnh hiện tại:</p>
                <img src="${room.image_url}" alt="Current room image" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid #ddd;">
            `;
            currentImageDiv.style.display = 'block';
        } else {
            currentImageDiv.innerHTML = '';
            currentImageDiv.style.display = 'none';
        }

        // Show modal
        const modal = document.getElementById('editRoomModal');
        if (modal) {
            modal.style.display = 'block';
            console.log('Modal displayed');
        } else {
            console.error('Modal element not found!');
            showNotification('Lỗi: Không tìm thấy form sửa phòng', 'error');
        }
    } catch (error) {
        console.error('Error in editRoom:', error);
        showNotification('Lỗi khi mở form sửa phòng: ' + error.message, 'error');
    }
}

async function deleteRoom(roomId) {
    if (!confirm(`Bạn có chắc chắn muốn xóa phòng này?`)) {
        return;
    }

    try {
        await RoomAPI.deleteRoom(roomId);
        showNotification('Xóa phòng thành công!', 'success');
        loadRooms();
    } catch (error) {
        showNotification('Lỗi khi xóa phòng: ' + error.message, 'error');
    }
}

// ========== BOOKING MANAGEMENT ==========
async function loadBookings() {
    try {
        allBookings = await BookingAPI.getAllBookings();
        window.allBookings = allBookings; // Update window reference
        displayBookings(allBookings);
    } catch (error) {
        showNotification('Lỗi khi tải danh sách đặt phòng: ' + error.message, 'error');
        const tbody = document.getElementById('bookingsTableBody');
        if (tbody) {
            const errorMsg = typeof LanguageManager !== 'undefined'
                ? LanguageManager.getTranslation('admin.dataLoadError') || 'Lỗi khi tải dữ liệu'
                : 'Lỗi khi tải dữ liệu';
            tbody.innerHTML = `<tr><td colspan="8" class="loading">${errorMsg}</td></tr>`;
        }
    }
}

function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    
    // Check if element exists (bookings tab might not be in admin panel)
    if (!tbody) {
        return;
    }
    
    if (bookings.length === 0) {
        const emptyMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.bookings.empty') || 'Chưa có đặt phòng nào'
            : 'Chưa có đặt phòng nào';
        tbody.innerHTML = `<tr><td colspan="8" class="loading">${emptyMsg}</td></tr>`;
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
                    <button class="btn-view" onclick="viewBookingDetail(${booking.id})">${LanguageManager.getTranslation('common.view') || 'Xem'}</button>
                    ${booking.status === 'pending' || booking.status === 'confirmed' ? 
                        `<button class="btn-edit" onclick="updateBookingStatus(${booking.id}, 'confirmed')">${LanguageManager.getTranslation('booking.confirm') || 'Xác Nhận'}</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function filterBookings() {
    const searchInput = document.getElementById('bookingSearch');
    const statusFilterEl = document.getElementById('bookingStatusFilter');
    
    // Check if elements exist (bookings tab might not be in admin panel)
    if (!searchInput || !statusFilterEl) {
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = statusFilterEl.value;

    let filtered = allBookings.filter(booking => {
        const matchesSearch = !searchTerm || 
            booking.guest_name.toLowerCase().includes(searchTerm) ||
            booking.room_type.toLowerCase().includes(searchTerm) ||
            booking.id.toString().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    displayBookings(filtered);
}

function getBookingStatusText(status) {
    if (!status) return status;
    const statusKey = `booking.status.${status}`;
    return LanguageManager.getTranslation(statusKey) || status;
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
        loadBookings();
    } catch (error) {
        showNotification('Lỗi khi cập nhật: ' + error.message, 'error');
    }
}

function viewBookingDetail(bookingId) {
    // In a real app, navigate to booking detail page
    showNotification('Đang mở chi tiết đặt phòng #' + bookingId, 'info');
}

// ========== STAFF MANAGEMENT ==========
async function loadStaff() {
    try {
        allStaff = await StaffAPI.getAllStaff();
        filterStaff();
    } catch (error) {
        const loadErrorMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.loadError') || 'Lỗi khi tải danh sách nhân viên: '
            : 'Lỗi khi tải danh sách nhân viên: ';
        showNotification(loadErrorMsg + error.message, 'error');
        const errorMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.dataLoadError') || 'Lỗi khi tải dữ liệu'
            : 'Lỗi khi tải dữ liệu';
        document.getElementById('staffTableBody').innerHTML = `<tr><td colspan="8" class="loading">${errorMsg}</td></tr>`;
    }
}

function filterStaff() {
    const searchInput = document.getElementById('staffSearch');
    if (!searchInput) {
        displayStaff(allStaff || []);
        return;
    }

    const query = searchInput.value.trim().toLowerCase();
    if (!allStaff || allStaff.length === 0) {
        displayStaff([]);
        return;
    }

    if (!query) {
        displayStaff(allStaff);
        return;
    }

    const filtered = allStaff.filter(s => {
        const fields = [
            s.full_name,
            s.name,
            s.email,
            s.phone,
            s.position,
            s.role,
            s.department,
            s.id
        ];
        return fields.some(f => f && String(f).toLowerCase().includes(query));
    });

    displayStaff(filtered);
}

function displayStaff(staff) {
    const tbody = document.getElementById('staffTableBody');
    
    if (staff.length === 0) {
        const emptyMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.staff.empty') || 'Chưa có nhân viên nào'
            : 'Chưa có nhân viên nào';
        tbody.innerHTML = `<tr><td colspan="8" class="loading">${emptyMsg}</td></tr>`;
        return;
    }

    tbody.innerHTML = staff.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.full_name || s.name || 'N/A'}</td>
            <td>${s.email || 'N/A'}</td>
            <td>${s.phone || 'N/A'}</td>
            <td>${s.position || s.role || 'N/A'}</td>
            <td>${s.department || 'N/A'}</td>
            <td><span class="status-badge ${s.is_active ? 'status-available' : 'status-maintenance'}">${LanguageManager.getTranslation(s.is_active ? 'admin.staff.isActive.true' : 'admin.staff.isActive.false') || (s.is_active ? 'Hoạt Động' : 'Không Hoạt Động')}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-view" onclick="viewStaff(${s.id})">${LanguageManager.getTranslation('common.view') || 'Xem'}</button>
                    <button class="btn-edit" onclick="editStaff(${s.id})">${LanguageManager.getTranslation('common.edit') || 'Sửa'}</button>
                    <button class="btn-delete" onclick="deleteStaff(${s.id})">${LanguageManager.getTranslation('common.delete') || 'Xóa'}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddStaffModal() {
    document.getElementById('addStaffForm').reset();
    document.getElementById('addStaffModal').style.display = 'block';
}

async function viewStaff(staffId) {
    try {
        const staff = await StaffAPI.getStaff(staffId);
        // Populate view modal
        document.getElementById('view_staff_id').textContent = staff.id || 'N/A';
        document.getElementById('view_staff_full_name').textContent = staff.full_name || 'N/A';
        document.getElementById('view_staff_email').textContent = staff.email || 'N/A';
        document.getElementById('view_staff_phone').textContent = staff.phone || 'N/A';
        document.getElementById('view_staff_position').textContent = staff.position || 'N/A';
        document.getElementById('view_staff_department').textContent = staff.department || 'N/A';
        document.getElementById('view_staff_hire_date').textContent = staff.hire_date || 'N/A';
        document.getElementById('view_staff_status').textContent = LanguageManager.getTranslation(staff.is_active ? 'admin.staff.isActive.true' : 'admin.staff.isActive.false') || (staff.is_active ? 'Hoạt Động' : 'Không Hoạt Động');
        document.getElementById('viewStaffModal').style.display = 'block';
    } catch (error) {
        showNotification('Lỗi khi tải thông tin nhân viên: ' + error.message, 'error');
    }
}

async function editStaff(staffId) {
    try {
        const staff = await StaffAPI.getStaff(staffId);
        // Populate edit form
        document.getElementById('edit_staff_id').value = staff.id;
        document.getElementById('edit_staff_full_name').value = staff.full_name || '';
        document.getElementById('edit_staff_email').value = staff.email || '';
        document.getElementById('edit_staff_phone').value = staff.phone || '';
        document.getElementById('edit_staff_position').value = staff.position || '';
        document.getElementById('edit_staff_department').value = staff.department || '';
        document.getElementById('edit_staff_is_active').value = staff.is_active ? 'true' : 'false';
        document.getElementById('editStaffModal').style.display = 'block';
    } catch (error) {
        showNotification('Lỗi khi tải thông tin nhân viên: ' + error.message, 'error');
    }
}

async function deleteStaff(staffId) {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
        return;
    }
    
    try {
        await StaffAPI.deleteStaff(staffId);
        showNotification('Xóa nhân viên thành công!', 'success');
        loadStaff();
    } catch (error) {
        showNotification('Lỗi khi xóa nhân viên: ' + error.message, 'error');
    }
}

// ========== SERVICE MANAGEMENT ==========
async function loadServices() {
    try {
        allServices = await ServiceAPI.getAllServices();
        window.allServices = allServices; // Update window reference
        displayServices(allServices);
    } catch (error) {
        const loadErrorMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.loadError') || 'Lỗi khi tải danh sách dịch vụ: '
            : 'Lỗi khi tải danh sách dịch vụ: ';
        showNotification(loadErrorMsg + error.message, 'error');
        const errorMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.dataLoadError') || 'Lỗi khi tải dữ liệu'
            : 'Lỗi khi tải dữ liệu';
        document.getElementById('servicesTableBody').innerHTML = `<tr><td colspan="6" class="loading">${errorMsg}</td></tr>`;
    }
}

function displayServices(services) {
    const tbody = document.getElementById('servicesTableBody');
    
    if (services.length === 0) {
        const emptyMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.services.empty') || 'Chưa có dịch vụ nào'
            : 'Chưa có dịch vụ nào';
        tbody.innerHTML = `<tr><td colspan="6" class="loading">${emptyMsg}</td></tr>`;
        return;
    }

    tbody.innerHTML = services.map(service => `
        <tr>
            <td>${service.id}</td>
            <td>${service.service_name || service.name}</td>
            <td>${service.description || 'N/A'}</td>
            <td>${service.price ? service.price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</td>
            <td>${service.category || 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-view" onclick="viewService(${service.id})">${LanguageManager.getTranslation('common.view') || 'Xem'}</button>
                    <button class="btn-edit" onclick="editService(${service.id})">${LanguageManager.getTranslation('common.edit') || 'Sửa'}</button>
                    <button class="btn-delete" onclick="deleteService(${service.id})">${LanguageManager.getTranslation('common.delete') || 'Xóa'}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterServices() {
    const searchInput = document.getElementById('serviceSearch');
    if (!searchInput) {
        displayServices(allServices || []);
        return;
    }

    const query = searchInput.value.trim().toLowerCase();
    if (!allServices || allServices.length === 0) {
        displayServices([]);
        return;
    }

    if (!query) {
        displayServices(allServices);
        return;
    }

    const filtered = allServices.filter(s => {
        const fields = [
            s.service_name,
            s.name,
            s.description,
            s.category,
            s.id
        ];
        return fields.some(f => f && String(f).toLowerCase().includes(query));
    });

    displayServices(filtered);
}

function showAddServiceModal() {
    document.getElementById('addServiceForm').reset();
    document.getElementById('addServiceModal').style.display = 'block';
}

async function viewService(serviceId) {
    try {
        const service = await ServiceAPI.getService(serviceId);
        // Populate view modal
        document.getElementById('view_service_id').textContent = service.id || 'N/A';
        document.getElementById('view_service_name').textContent = service.service_name || service.name || 'N/A';
        document.getElementById('view_service_description').textContent = service.description || 'N/A';
        document.getElementById('view_service_price').textContent = service.price ? service.price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A';
        document.getElementById('view_service_category').textContent = service.category || 'N/A';
        const availableText = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.services.available') || 'Có Sẵn'
            : 'Có Sẵn';
        const unavailableText = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.services.unavailable') || 'Không Có Sẵn'
            : 'Không Có Sẵn';
        document.getElementById('view_service_status').textContent = service.is_available !== false ? availableText : unavailableText;
        document.getElementById('viewServiceModal').style.display = 'block';
    } catch (error) {
        showNotification('Lỗi khi tải thông tin dịch vụ: ' + error.message, 'error');
    }
}

async function editService(serviceId) {
    try {
        const service = await ServiceAPI.getService(serviceId);
        // Populate edit form
        document.getElementById('edit_service_id').value = service.id;
        document.getElementById('edit_service_name').value = service.service_name || service.name || '';
        document.getElementById('edit_service_description').value = service.description || '';
        document.getElementById('edit_service_price').value = service.price || '';
        document.getElementById('edit_service_category').value = service.category || '';
        document.getElementById('edit_service_is_available').value = service.is_available !== false ? 'true' : 'false';
        document.getElementById('editServiceModal').style.display = 'block';
    } catch (error) {
        showNotification('Lỗi khi tải thông tin dịch vụ: ' + error.message, 'error');
    }
}

async function deleteService(serviceId) {
    if (!confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) {
        return;
    }
    
    try {
        await ServiceAPI.deleteService(serviceId);
        showNotification('Xóa dịch vụ thành công!', 'success');
        loadServices();
    } catch (error) {
        showNotification('Lỗi khi xóa dịch vụ: ' + error.message, 'error');
    }
}

// ========== REPORTS ==========
let revenueChart = null;
let bookingChart = null;

async function loadReports() {
    try {
        // Load all reports data
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];

        // Load revenue report
        try {
            const revenueReport = await ReportAPI.generateRevenueReport(startDate, today);
            displayRevenueReport(revenueReport);
        } catch (error) {
            console.error('Error loading revenue report:', error);
        }

        // Load booking report
        try {
            const bookingReport = await ReportAPI.generateBookingReport(startDate, today);
            displayBookingReport(bookingReport);
        } catch (error) {
            console.error('Error loading booking report:', error);
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

function displayRevenueReport(report) {
    const container = document.getElementById('revenueReportResult');
    const totalRevenue = report.data?.total_revenue || report.total_revenue || 0;
    const totalPayments = report.data?.total_payments || report.total_payments || 0;
    const averageRevenue = totalPayments > 0 ? totalRevenue / totalPayments : 0;

    const totalRevenueLabel = LanguageManager.getTranslation('admin.reports.revenueStats.totalRevenue') || 'Tổng Doanh Thu:';
    const totalPaymentsLabel = LanguageManager.getTranslation('admin.reports.revenueStats.totalPayments') || 'Số Lượng Thanh Toán:';
    const averageLabel = LanguageManager.getTranslation('admin.reports.revenueStats.averagePerPayment') || 'Trung Bình/Thanh Toán:';
    
    container.innerHTML = `
        <div class="report-stats">
            <p><strong>${totalRevenueLabel}</strong> ${totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>${totalPaymentsLabel}</strong> ${totalPayments}</p>
            <p><strong>${averageLabel}</strong> ${averageRevenue.toLocaleString('vi-VN')} VNĐ</p>
        </div>
    `;

    // Create or update chart
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        if (revenueChart) {
            revenueChart.destroy();
        }
        const revenueLabel = LanguageManager.getTranslation('admin.reports.revenueStats.chartLabels.revenue') || 'Doanh Thu';
        const remainingLabel = LanguageManager.getTranslation('admin.reports.revenueStats.chartLabels.remaining') || 'Còn lại';
        const chartTitle = LanguageManager.getTranslation('admin.reports.revenueStats.chartTitle') || 'Tổng Doanh Thu';
        
        revenueChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [revenueLabel, remainingLabel],
                datasets: [{
                    data: [totalRevenue, Math.max(0, 1000000 - totalRevenue)],
                    backgroundColor: ['#4CAF50', '#E0E0E0']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: chartTitle
                    }
                }
            }
        });
    }
}

function displayBookingReport(report) {
    const container = document.getElementById('bookingReportResult');
    const bookings = report.data?.bookings || report.bookings || [];
    const totalBookings = bookings.length;
    
    // Count by status
    const statusCounts = {
        pending: 0,
        confirmed: 0,
        checked_in: 0,
        checked_out: 0,
        cancelled: 0
    };
    
    bookings.forEach(booking => {
        const status = booking.status || 'pending';
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        }
    });

    const totalBookingsLabel = LanguageManager.getTranslation('admin.reports.bookingStats.totalBookings') || 'Tổng Đặt Phòng:';
    const pendingLabel = LanguageManager.getTranslation('admin.reports.bookingStats.pending') || 'Chờ Xác Nhận:';
    const confirmedLabel = LanguageManager.getTranslation('admin.reports.bookingStats.confirmed') || 'Đã Xác Nhận:';
    const checkedInLabel = LanguageManager.getTranslation('admin.reports.bookingStats.checkedIn') || 'Đã Check-in:';
    const checkedOutLabel = LanguageManager.getTranslation('admin.reports.bookingStats.checkedOut') || 'Đã Check-out:';
    const cancelledLabel = LanguageManager.getTranslation('admin.reports.bookingStats.cancelled') || 'Đã Hủy:';
    
    container.innerHTML = `
        <div class="report-stats">
            <p><strong>${totalBookingsLabel}</strong> ${totalBookings}</p>
            <p><strong>${pendingLabel}</strong> ${statusCounts.pending}</p>
            <p><strong>${confirmedLabel}</strong> ${statusCounts.confirmed}</p>
            <p><strong>${checkedInLabel}</strong> ${statusCounts.checked_in}</p>
            <p><strong>${checkedOutLabel}</strong> ${statusCounts.checked_out}</p>
            <p><strong>${cancelledLabel}</strong> ${statusCounts.cancelled}</p>
        </div>
    `;

    // Create or update chart
    const ctx = document.getElementById('bookingChart');
    if (ctx) {
        if (bookingChart) {
            bookingChart.destroy();
        }
        const chartPendingLabel = LanguageManager.getTranslation('admin.reports.bookingStats.chartLabels.pending') || 'Chờ Xác Nhận';
        const chartConfirmedLabel = LanguageManager.getTranslation('admin.reports.bookingStats.chartLabels.confirmed') || 'Đã Xác Nhận';
        const chartCheckedInLabel = LanguageManager.getTranslation('admin.reports.bookingStats.chartLabels.checkedIn') || 'Đã Check-in';
        const chartCheckedOutLabel = LanguageManager.getTranslation('admin.reports.bookingStats.chartLabels.checkedOut') || 'Đã Check-out';
        const chartCancelledLabel = LanguageManager.getTranslation('admin.reports.bookingStats.chartLabels.cancelled') || 'Đã Hủy';
        const bookingChartTitle = LanguageManager.getTranslation('admin.reports.bookingStats.chartTitle') || 'Báo Cáo Đặt Phòng';
        
        bookingChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [chartPendingLabel, chartConfirmedLabel, chartCheckedInLabel, chartCheckedOutLabel, chartCancelledLabel],
                datasets: [{
                    data: [
                        statusCounts.pending,
                        statusCounts.confirmed,
                        statusCounts.checked_in,
                        statusCounts.checked_out,
                        statusCounts.cancelled
                    ],
                    backgroundColor: [
                        '#FF9800',
                        '#2196F3',
                        '#4CAF50',
                        '#9C27B0',
                        '#F44336'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: bookingChartTitle
                    }
                }
            }
        });
    }
}

// ========== FORM HANDLERS ==========
function setupFormHandlers() {
    // Add Room Form
    document.getElementById('addRoomForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const roomData = {
            room_number: document.getElementById('room_number').value,
            room_type: document.getElementById('room_type').value,
            price: parseFloat(document.getElementById('room_price').value),
            status: document.getElementById('room_status').value,
            capacity: parseInt(document.getElementById('room_capacity').value) || null
        };

        // Handle image upload
        const imageFile = document.getElementById('room_image').files[0];
        if (imageFile) {
            // Convert image to base64
            const reader = new FileReader();
            reader.onload = async function(e) {
                roomData.image_base64 = e.target.result;
                roomData.image_filename = imageFile.name;
                
                try {
                    await RoomAPI.createRoom(roomData);
                    showNotification('Thêm phòng thành công!', 'success');
                    closeModal('addRoomModal');
                    loadRooms();
                } catch (error) {
                    showNotification('Lỗi khi thêm phòng: ' + error.message, 'error');
                }
            };
            reader.readAsDataURL(imageFile);
        } else {
            try {
                await RoomAPI.createRoom(roomData);
                showNotification('Thêm phòng thành công!', 'success');
                closeModal('addRoomModal');
                loadRooms();
            } catch (error) {
                showNotification('Lỗi khi thêm phòng: ' + error.message, 'error');
            }
        }
    });

    // Edit Room Form
    document.getElementById('editRoomForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const roomId = document.getElementById('edit_room_id').value;
        const capacityValue = document.getElementById('edit_room_capacity').value;
        
        const roomData = {
            room_number: document.getElementById('edit_room_number').value,
            room_type: document.getElementById('edit_room_type').value,
            price: parseFloat(document.getElementById('edit_room_price').value),
            status: document.getElementById('edit_room_status').value,
            capacity: capacityValue && capacityValue.trim() !== '' ? parseInt(capacityValue) : null
        };

        // Handle image upload
        const imageFile = document.getElementById('edit_room_image').files[0];
        if (imageFile) {
            // Convert image to base64
            const reader = new FileReader();
            reader.onload = async function(e) {
                roomData.image_base64 = e.target.result;
                roomData.image_filename = imageFile.name;
                
                try {
                    console.log('Updating room with image:', roomId, roomData);
                    await RoomAPI.updateRoom(roomId, roomData);
                    showNotification('Cập nhật phòng thành công!', 'success');
                    closeModal('editRoomModal');
                    loadRooms();
                } catch (error) {
                    console.error('Error updating room:', error);
                    showNotification('Lỗi khi cập nhật phòng: ' + error.message, 'error');
                }
            };
            reader.readAsDataURL(imageFile);
        } else {
            try {
                console.log('Updating room without image:', roomId, roomData);
                await RoomAPI.updateRoom(roomId, roomData);
                showNotification('Cập nhật phòng thành công!', 'success');
                closeModal('editRoomModal');
                loadRooms();
            } catch (error) {
                console.error('Error updating room:', error);
                showNotification('Lỗi khi cập nhật phòng: ' + error.message, 'error');
            }
        }
    });

    // Add Staff Form
    document.getElementById('addStaffForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const staffData = {
            full_name: document.getElementById('staff_full_name').value,
            email: document.getElementById('staff_email').value,
            phone: document.getElementById('staff_phone').value,
            position: document.getElementById('staff_position').value,
            department: document.getElementById('staff_department').value,
            hire_date: document.getElementById('staff_hire_date').value || null
        };

        try {
            await StaffAPI.createStaff(staffData);
            showNotification('Thêm nhân viên thành công!', 'success');
            closeModal('addStaffModal');
            loadStaff();
        } catch (error) {
            showNotification('Lỗi khi thêm nhân viên: ' + error.message, 'error');
        }
    });

    // Edit Staff Form
    document.getElementById('editStaffForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const staffId = document.getElementById('edit_staff_id').value;
        const staffData = {
            full_name: document.getElementById('edit_staff_full_name').value,
            email: document.getElementById('edit_staff_email').value,
            phone: document.getElementById('edit_staff_phone').value,
            position: document.getElementById('edit_staff_position').value,
            department: document.getElementById('edit_staff_department').value,
            is_active: document.getElementById('edit_staff_is_active').value === 'true'
        };

        try {
            await StaffAPI.updateStaff(staffId, staffData);
            showNotification('Cập nhật nhân viên thành công!', 'success');
            closeModal('editStaffModal');
            loadStaff();
        } catch (error) {
            showNotification('Lỗi khi cập nhật nhân viên: ' + error.message, 'error');
        }
    });

    // Add Service Form
    document.getElementById('addServiceForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const serviceData = {
            service_name: document.getElementById('service_name').value,
            description: document.getElementById('service_description').value,
            price: parseFloat(document.getElementById('service_price').value),
            category: document.getElementById('service_category').value || null
        };

        try {
            await ServiceAPI.createService(serviceData);
            showNotification('Thêm dịch vụ thành công!', 'success');
            closeModal('addServiceModal');
            loadServices();
        } catch (error) {
            showNotification('Lỗi khi thêm dịch vụ: ' + error.message, 'error');
        }
    });

    // Edit Service Form
    document.getElementById('editServiceForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const serviceId = document.getElementById('edit_service_id').value;
        const serviceData = {
            service_name: document.getElementById('edit_service_name').value,
            description: document.getElementById('edit_service_description').value,
            price: parseFloat(document.getElementById('edit_service_price').value),
            category: document.getElementById('edit_service_category').value || null,
            is_available: document.getElementById('edit_service_is_available').value === 'true'
        };

        try {
            await ServiceAPI.updateService(serviceId, serviceData);
            showNotification('Cập nhật dịch vụ thành công!', 'success');
            closeModal('editServiceModal');
            loadServices();
        } catch (error) {
            showNotification('Lỗi khi cập nhật dịch vụ: ' + error.message, 'error');
        }
    });

    // Edit User Form
    document.getElementById('editUserForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('edit_user_id').value;
        const userData = {
            full_name: document.getElementById('edit_user_full_name').value,
            email: document.getElementById('edit_user_email').value,
            phone: document.getElementById('edit_user_phone').value || null,
            role: document.getElementById('edit_user_role').value
        };

        try {
            await UserAPI.updateUser(userId, userData);
            showNotification('Cập nhật người dùng thành công!', 'success');
            closeModal('editUserModal');
            loadUsers();
        } catch (error) {
            showNotification('Lỗi khi cập nhật người dùng: ' + error.message, 'error');
        }
    });
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

// Export functions to window
window.switchTab = switchTab;
window.showAddRoomModal = showAddRoomModal;
window.editRoom = editRoom;
window.deleteRoom = deleteRoom;
window.closeModal = closeModal;
window.filterRooms = filterRooms;
window.filterBookings = filterBookings;
window.updateBookingStatus = updateBookingStatus;
window.viewBookingDetail = viewBookingDetail;
window.showAddStaffModal = showAddStaffModal;
window.viewStaff = viewStaff;
window.editStaff = editStaff;
window.deleteStaff = deleteStaff;
window.showAddServiceModal = showAddServiceModal;
window.viewService = viewService;
window.editService = editService;
window.deleteService = deleteService;
window.loadReports = loadReports;
window.previewRoomImage = previewRoomImage;
window.removeRoomImage = removeRoomImage;
window.previewEditRoomImage = previewEditRoomImage;
window.removeEditRoomImage = removeEditRoomImage;

// ========== USER MANAGEMENT ==========
async function loadUsers() {
    try {
        const users = await UserAPI.getAllUsers();
        
        // Sắp xếp users theo cấp bậc: administrator > receptionist > user
        const roleOrder = { 'administrator': 1, 'receptionist': 2, 'user': 3 };
        const sortedUsers = users.sort((a, b) => {
            const roleA = roleOrder[a.role] || 99;
            const roleB = roleOrder[b.role] || 99;
            if (roleA !== roleB) {
                return roleA - roleB;
            }
            // Nếu cùng role, sắp xếp theo tên
            return (a.full_name || '').localeCompare(b.full_name || '');
        });
        
        allUsers = sortedUsers;
        window.allUsers = allUsers; // Update window reference
        displayUsers(sortedUsers);
    } catch (error) {
        showNotification('Lỗi khi tải danh sách người dùng: ' + error.message, 'error');
        const errorMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.dataLoadError') || 'Lỗi khi tải dữ liệu'
            : 'Lỗi khi tải dữ liệu';
        document.getElementById('usersTableBody').innerHTML = `<tr><td colspan="7" class="error">${errorMsg}</td></tr>`;
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!users || users.length === 0) {
        const emptyMsg = typeof LanguageManager !== 'undefined'
            ? LanguageManager.getTranslation('admin.users.empty') || 'Không có người dùng nào'
            : 'Không có người dùng nào';
        tbody.innerHTML = `<tr><td colspan="7" class="empty">${emptyMsg}</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.username || 'N/A'}</td>
            <td>${u.full_name || 'N/A'}</td>
            <td>${u.email || 'N/A'}</td>
            <td>${u.phone || 'N/A'}</td>
            <td><span class="badge badge-${u.role === 'administrator' ? 'admin' : u.role === 'receptionist' ? 'receptionist' : 'user'}">${u.role || 'user'}</span></td>
            <td>
                <button class="btn-view" onclick="viewUser(${u.id})">${LanguageManager.getTranslation('common.view') || 'Xem'}</button>
                <button class="btn-edit" onclick="editUser(${u.id})">${LanguageManager.getTranslation('common.edit') || 'Sửa'}</button>
                <button class="btn-delete" onclick="deleteUser(${u.id})">${LanguageManager.getTranslation('common.delete') || 'Xóa'}</button>
            </td>
        </tr>
    `).join('');
}

async function viewUser(userId) {
    try {
        const user = await UserAPI.getUser(userId);
        document.getElementById('view_user_id').textContent = user.id || 'N/A';
        document.getElementById('view_user_username').textContent = user.username || 'N/A';
        document.getElementById('view_user_full_name').textContent = user.full_name || 'N/A';
        document.getElementById('view_user_email').textContent = user.email || 'N/A';
        document.getElementById('view_user_phone').textContent = user.phone || 'N/A';
        document.getElementById('view_user_role').textContent = user.role || 'user';
        document.getElementById('viewUserModal').style.display = 'block';
    } catch (error) {
        showNotification('Lỗi khi tải thông tin người dùng: ' + error.message, 'error');
    }
}

async function editUser(userId) {
    try {
        const user = await UserAPI.getUser(userId);
        document.getElementById('edit_user_id').value = user.id;
        document.getElementById('edit_user_username').value = user.username || '';
        document.getElementById('edit_user_full_name').value = user.full_name || '';
        document.getElementById('edit_user_email').value = user.email || '';
        document.getElementById('edit_user_phone').value = user.phone || '';
        document.getElementById('edit_user_role').value = user.role || 'user';
        document.getElementById('editUserModal').style.display = 'block';
    } catch (error) {
        showNotification('Lỗi khi tải thông tin người dùng: ' + error.message, 'error');
    }
}

async function deleteUser(userId) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
        return;
    }
    
    try {
        await UserAPI.deleteUser(userId);
        showNotification('Xóa người dùng thành công!', 'success');
        loadUsers();
    } catch (error) {
        showNotification('Lỗi khi xóa người dùng: ' + error.message, 'error');
    }
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const filtered = allUsers.filter(u => 
        (u.username && u.username.toLowerCase().includes(searchTerm)) ||
        (u.full_name && u.full_name.toLowerCase().includes(searchTerm)) ||
        (u.email && u.email.toLowerCase().includes(searchTerm)) ||
        (u.role && u.role.toLowerCase().includes(searchTerm))
    );
    
    // Sắp xếp kết quả tìm kiếm theo cấp bậc
    const roleOrder = { 'administrator': 1, 'receptionist': 2, 'user': 3 };
    const sortedFiltered = filtered.sort((a, b) => {
        const roleA = roleOrder[a.role] || 99;
        const roleB = roleOrder[b.role] || 99;
        if (roleA !== roleB) {
            return roleA - roleB;
        }
        return (a.full_name || '').localeCompare(b.full_name || '');
    });
    
    displayUsers(sortedFiltered);
}

window.loadUsers = loadUsers;
window.viewUser = viewUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.filterUsers = filterUsers;
