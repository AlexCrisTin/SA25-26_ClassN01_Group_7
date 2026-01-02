// Admin Panel JavaScript
let currentEditingRoomId = null;
let allRooms = [];
let allBookings = [];
let allStaff = [];
let allServices = [];

// Check admin access on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!AuthManager.requireAuth()) {
        return;
    }

    if (!AuthManager.isAdmin()) {
        showNotification('Bạn không có quyền truy cập trang này', 'error');
        setTimeout(() => {
            window.location.href = AuthManager.getRedirectUrl();
        }, 2000);
        return;
    }

    const user = AuthManager.getCurrentUser();
    document.getElementById('adminUserName').textContent = user.username || user.full_name || 'Admin';

    // Load initial data
    loadRooms();
    loadBookings();
    loadStaff();
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
}

// ========== ROOM MANAGEMENT ==========
async function loadRooms() {
    try {
        allRooms = await RoomAPI.getAllRooms();
        displayRooms(allRooms);
    } catch (error) {
        showNotification('Lỗi khi tải danh sách phòng: ' + error.message, 'error');
        document.getElementById('roomsTableBody').innerHTML = '<tr><td colspan="7" class="loading">Lỗi khi tải dữ liệu</td></tr>';
    }
}

function displayRooms(rooms) {
    const tbody = document.getElementById('roomsTableBody');
    
    if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Chưa có phòng nào</td></tr>';
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
                    <button class="btn-edit" onclick="editRoom(${room.id})">Sửa</button>
                    <button class="btn-delete" onclick="deleteRoom(${room.id})">Xóa</button>
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
    const statusMap = {
        'available': 'Trống',
        'occupied': 'Đã Thuê',
        'maintenance': 'Bảo Trì',
        'reserved': 'Đã Đặt'
    };
    return statusMap[status] || status;
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
    const room = allRooms.find(r => r.id === roomId);
    if (!room) return;

    currentEditingRoomId = roomId;
    document.getElementById('edit_room_id').value = room.id;
    document.getElementById('edit_room_number').value = room.room_number;
    document.getElementById('edit_room_type').value = room.room_type;
    document.getElementById('edit_room_price').value = room.price;
    document.getElementById('edit_room_status').value = room.status;
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

    document.getElementById('editRoomModal').style.display = 'block';
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
        displayBookings(allBookings);
    } catch (error) {
        showNotification('Lỗi khi tải danh sách đặt phòng: ' + error.message, 'error');
        document.getElementById('bookingsTableBody').innerHTML = '<tr><td colspan="8" class="loading">Lỗi khi tải dữ liệu</td></tr>';
    }
}

function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
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
                    <button class="btn-view" onclick="viewBookingDetail(${booking.id})">Xem</button>
                    ${booking.status === 'pending' || booking.status === 'confirmed' ? 
                        `<button class="btn-edit" onclick="updateBookingStatus(${booking.id}, 'confirmed')">Xác Nhận</button>` : ''}
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
            booking.guest_name.toLowerCase().includes(searchTerm) ||
            booking.room_type.toLowerCase().includes(searchTerm) ||
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
        displayStaff(allStaff);
    } catch (error) {
        showNotification('Lỗi khi tải danh sách nhân viên: ' + error.message, 'error');
        document.getElementById('staffTableBody').innerHTML = '<tr><td colspan="8" class="loading">Lỗi khi tải dữ liệu</td></tr>';
    }
}

function displayStaff(staff) {
    const tbody = document.getElementById('staffTableBody');
    
    if (staff.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">Chưa có nhân viên nào</td></tr>';
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
            <td><span class="status-badge status-available">Hoạt Động</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-view" onclick="viewStaff(${s.id})">Xem</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddStaffModal() {
    document.getElementById('addStaffForm').reset();
    document.getElementById('addStaffModal').style.display = 'block';
}

function viewStaff(staffId) {
    showNotification('Đang mở thông tin nhân viên #' + staffId, 'info');
}

// ========== SERVICE MANAGEMENT ==========
async function loadServices() {
    try {
        allServices = await ServiceAPI.getAllServices();
        displayServices(allServices);
    } catch (error) {
        showNotification('Lỗi khi tải danh sách dịch vụ: ' + error.message, 'error');
        document.getElementById('servicesTableBody').innerHTML = '<tr><td colspan="6" class="loading">Lỗi khi tải dữ liệu</td></tr>';
    }
}

function displayServices(services) {
    const tbody = document.getElementById('servicesTableBody');
    
    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Chưa có dịch vụ nào</td></tr>';
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
                    <button class="btn-view" onclick="viewService(${service.id})">Xem</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddServiceModal() {
    document.getElementById('addServiceForm').reset();
    document.getElementById('addServiceModal').style.display = 'block';
}

function viewService(serviceId) {
    showNotification('Đang mở thông tin dịch vụ #' + serviceId, 'info');
}

// ========== REPORTS ==========
async function generateRevenueReport() {
    const startDate = document.getElementById('revenueStartDate').value;
    const endDate = document.getElementById('revenueEndDate').value;

    if (!startDate || !endDate) {
        showNotification('Vui lòng chọn khoảng thời gian', 'error');
        return;
    }

    try {
        showNotification('Đang tạo báo cáo doanh thu...', 'info');
        const report = await ReportAPI.generateRevenueReport(startDate, endDate);
        displayRevenueReport(report);
    } catch (error) {
        showNotification('Lỗi khi tạo báo cáo: ' + error.message, 'error');
    }
}

function displayRevenueReport(report) {
    const container = document.getElementById('revenueReportResult');
    container.innerHTML = `
        <div class="report-result">
            <h4>Báo Cáo Doanh Thu</h4>
            <p><strong>Tổng Doanh Thu:</strong> ${report.total_revenue ? report.total_revenue.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</p>
            <p><strong>Số Lượng Đặt Phòng:</strong> ${report.total_bookings || 0}</p>
            <p><strong>Trung Bình/Đặt Phòng:</strong> ${report.average_revenue ? report.average_revenue.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</p>
        </div>
    `;
}

async function generateOccupancyReport() {
    const startDate = document.getElementById('occupancyStartDate').value;
    const endDate = document.getElementById('occupancyEndDate').value;

    if (!startDate || !endDate) {
        showNotification('Vui lòng chọn khoảng thời gian', 'error');
        return;
    }

    try {
        showNotification('Đang tạo báo cáo tỷ lệ lấp đầy...', 'info');
        const report = await ReportAPI.generateOccupancyReport(startDate, endDate);
        displayOccupancyReport(report);
    } catch (error) {
        showNotification('Lỗi khi tạo báo cáo: ' + error.message, 'error');
    }
}

function displayOccupancyReport(report) {
    const container = document.getElementById('occupancyReportResult');
    const occupancyRate = report.occupancy_rate ? (report.occupancy_rate * 100).toFixed(2) : 0;
    container.innerHTML = `
        <div class="report-result">
            <h4>Báo Cáo Tỷ Lệ Lấp Đầy</h4>
            <p><strong>Tỷ Lệ Lấp Đầy:</strong> ${occupancyRate}%</p>
            <p><strong>Tổng Phòng:</strong> ${report.total_rooms || 0}</p>
            <p><strong>Phòng Đã Thuê:</strong> ${report.occupied_rooms || 0}</p>
            <p><strong>Phòng Trống:</strong> ${report.available_rooms || 0}</p>
        </div>
    `;
}

async function generateBookingReport() {
    const startDate = document.getElementById('bookingStartDate').value;
    const endDate = document.getElementById('bookingEndDate').value;

    if (!startDate || !endDate) {
        showNotification('Vui lòng chọn khoảng thời gian', 'error');
        return;
    }

    try {
        showNotification('Đang tạo báo cáo đặt phòng...', 'info');
        const report = await ReportAPI.generateBookingReport(startDate, endDate);
        displayBookingReport(report);
    } catch (error) {
        showNotification('Lỗi khi tạo báo cáo: ' + error.message, 'error');
    }
}

function displayBookingReport(report) {
    const container = document.getElementById('bookingReportResult');
    container.innerHTML = `
        <div class="report-result">
            <h4>Báo Cáo Đặt Phòng</h4>
            <p><strong>Tổng Đặt Phòng:</strong> ${report.total_bookings || 0}</p>
            <p><strong>Đã Xác Nhận:</strong> ${report.confirmed || 0}</p>
            <p><strong>Chờ Xác Nhận:</strong> ${report.pending || 0}</p>
            <p><strong>Đã Hủy:</strong> ${report.cancelled || 0}</p>
        </div>
    `;
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
        const roomData = {
            room_number: document.getElementById('edit_room_number').value,
            room_type: document.getElementById('edit_room_type').value,
            price: parseFloat(document.getElementById('edit_room_price').value),
            status: document.getElementById('edit_room_status').value,
            capacity: parseInt(document.getElementById('edit_room_capacity').value) || null
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
                    await RoomAPI.updateRoom(roomId, roomData);
                    showNotification('Cập nhật phòng thành công!', 'success');
                    closeModal('editRoomModal');
                    loadRooms();
                } catch (error) {
                    showNotification('Lỗi khi cập nhật phòng: ' + error.message, 'error');
                }
            };
            reader.readAsDataURL(imageFile);
        } else {
            try {
                await RoomAPI.updateRoom(roomId, roomData);
                showNotification('Cập nhật phòng thành công!', 'success');
                closeModal('editRoomModal');
                loadRooms();
            } catch (error) {
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
window.showAddServiceModal = showAddServiceModal;
window.viewService = viewService;
window.generateRevenueReport = generateRevenueReport;
window.generateOccupancyReport = generateOccupancyReport;
window.generateBookingReport = generateBookingReport;
window.previewRoomImage = previewRoomImage;
window.removeRoomImage = removeRoomImage;
window.previewEditRoomImage = previewEditRoomImage;
window.removeEditRoomImage = removeEditRoomImage;

