// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Loading State Helper
function setLoading(element, isLoading) {
    if (isLoading) {
        element.disabled = true;
        element.dataset.originalText = element.textContent;
        element.textContent = 'Đang xử lý...';
    } else {
        element.disabled = false;
        if (element.dataset.originalText) {
            element.textContent = element.dataset.originalText;
        }
    }
}

// Room Search Functionality
async function searchAvailableRooms(checkinDate, checkoutDate, roomType = null) {
    try {
        showNotification('Đang tìm kiếm phòng...', 'info');
        const rooms = await RoomAPI.searchRooms(roomType, 'available');
        
        if (rooms && rooms.length > 0) {
            return rooms;
        } else {
            showNotification('Không tìm thấy phòng trống phù hợp', 'warning');
            return [];
        }
    } catch (error) {
        showNotification('Lỗi khi tìm kiếm phòng: ' + error.message, 'error');
        return [];
    }
}

// Booking Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const adults = document.getElementById('adults').value;
            const children = document.getElementById('children').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Validate dates
            if (new Date(checkout) <= new Date(checkin)) {
                showNotification('Ngày trả phòng phải sau ngày nhận phòng!', 'error');
                return;
            }
            
            // Check if guest name is provided (you might want to add this field)
            const guestName = prompt('Vui lòng nhập tên khách hàng:');
            if (!guestName) {
                showNotification('Vui lòng nhập tên khách hàng', 'error');
                return;
            }
            
            // Search for available rooms first
            setLoading(submitBtn, true);
            const availableRooms = await searchAvailableRooms(checkin, checkout);
            
            if (availableRooms.length === 0) {
                setLoading(submitBtn, false);
                return;
            }
            
            // Use first available room type (or let user select)
            const selectedRoom = availableRooms[0];
            const roomType = selectedRoom.room_type || 'standard';
            
            // Calculate number of nights
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
            
            // Calculate total price (room price * nights)
            const totalPrice = selectedRoom.price * nights;
            
            // Prepare booking data
            const bookingData = {
                guest_name: guestName,
                room_type: roomType,
                check_in_date: checkin,
                check_out_date: checkout,
                total_price: totalPrice
            };
            
            try {
                // Create booking via API
                const booking = await BookingAPI.createBooking(bookingData);
                
                showNotification('Đặt phòng thành công! Mã đặt phòng: ' + booking.id, 'success');
                
                // Reset form
                bookingForm.reset();
                
                // Optionally redirect to booking confirmation
                // window.location.href = `booking-confirmation.html?id=${booking.id}`;
                
            } catch (error) {
                showNotification('Lỗi khi đặt phòng: ' + error.message, 'error');
            } finally {
                setLoading(submitBtn, false);
            }
        });
    }
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput) {
        checkinInput.setAttribute('min', today);
        checkinInput.addEventListener('change', function() {
            if (checkoutInput) {
                checkoutInput.setAttribute('min', this.value);
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a, .footer-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Book Now Button Handler
    const bookNowBtn = document.querySelector('.book-now-btn');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', function() {
            const bookingSection = document.querySelector('.booking-form-section');
            if (bookingSection) {
                bookingSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Explore Rooms Button Handler - Load rooms from API
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', async function() {
            const roomsSection = document.getElementById('rooms');
            if (roomsSection) {
                roomsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Load rooms from API
                try {
                    const rooms = await RoomAPI.getAllRooms();
                    if (rooms && rooms.length > 0) {
                        updateRoomCards(rooms);
                    }
                } catch (error) {
                    console.error('Error loading rooms:', error);
                }
            }
        });
    }
    
    // Function to update room cards with API data
    async function updateRoomCards(rooms) {
        const roomTypesGrid = document.querySelector('.room-types-grid');
        if (!roomTypesGrid) return;
        
        // Clear existing cards
        roomTypesGrid.innerHTML = '';
        
        // Group rooms by type and get cheapest price
        const roomTypes = {};
        rooms.forEach(room => {
            if (!roomTypes[room.room_type] || room.price < roomTypes[room.room_type].price) {
                roomTypes[room.room_type] = room;
            }
        });
        
        // Create cards for each room type
        Object.values(roomTypes).forEach(room => {
            const card = document.createElement('div');
            card.className = 'room-card';
            card.innerHTML = `
                <img src="images/room-${room.room_type.toLowerCase()}.jpg" alt="Phòng ${room.room_type}" onerror="this.src='https://via.placeholder.com/400x250?text=${room.room_type}'">
                <h3>Phòng ${room.room_type}</h3>
                <p class="room-price">Chỉ từ ${room.price.toLocaleString('vi-VN')} VNĐ/Đêm</p>
            `;
            roomTypesGrid.appendChild(card);
        });
    }
    
    // Load rooms on page load
    async function loadRoomsOnPageLoad() {
        try {
            const rooms = await RoomAPI.getAllRooms();
            if (rooms && rooms.length > 0) {
                updateRoomCards(rooms);
            }
        } catch (error) {
            console.error('Error loading rooms on page load:', error);
        }
    }
    
    // Load rooms when page loads
    loadRoomsOnPageLoad();
    
    // Play Button Handler (Video)
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            // In a real application, this would open a video modal or play video
            alert('Video sẽ được phát tại đây');
        });
    }
    
    // Spa Navigation Arrows
    const spaNavArrows = document.querySelectorAll('.nav-arrow');
    spaNavArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            // In a real application, this would navigate through spa carousel
            const dots = document.querySelectorAll('.spa-pagination .dot');
            const activeDot = document.querySelector('.spa-pagination .dot.active');
            const currentIndex = Array.from(dots).indexOf(activeDot);
            
            dots.forEach(dot => dot.classList.remove('active'));
            
            if (this.textContent === '→') {
                const nextIndex = (currentIndex + 1) % dots.length;
                dots[nextIndex].classList.add('active');
            } else {
                const prevIndex = (currentIndex - 1 + dots.length) % dots.length;
                dots[prevIndex].classList.add('active');
            }
        });
    });
    
    // Spa Pagination Dots
    const spaDots = document.querySelectorAll('.spa-pagination .dot');
    spaDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            spaDots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Newsletter Form Handler
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // In a real application, this would send to backend
            console.log('Newsletter subscription:', email);
            alert('Cảm ơn bạn đã đăng ký nhận bản tin!');
            this.reset();
        });
    }
    
    // View More Button Handler (Gallery)
    const viewMoreBtn = document.querySelector('.view-more-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function() {
            // In a real application, this would load more images
            alert('Đang tải thêm hình ảnh...');
        });
    }
    
    // Detail Buttons Handler (Articles)
    const detailButtons = document.querySelectorAll('.detail-btn');
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleTitle = this.closest('.article-card').querySelector('h3').textContent;
            // In a real application, this would navigate to article detail page
            alert(`Đang mở bài viết: ${articleTitle}`);
        });
    });
    
    // Contact Button Handler (Spa Section)
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        } else {
            navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Image lazy loading (if needed)
    const images = document.querySelectorAll('img');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
});

