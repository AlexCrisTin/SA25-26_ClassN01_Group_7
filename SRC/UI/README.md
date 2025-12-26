# Luxe Hotel - Website UI

Giao diện website cho hệ thống quản lý khách sạn Luxe Hotel.

## Cấu trúc thư mục

```
SRC/UI/
├── index.html          # Trang chủ chính
├── css/
│   └── style.css      # File CSS chính
├── js/
│   └── script.js       # File JavaScript cho các tính năng tương tác
├── images/            # Thư mục chứa hình ảnh
└── README.md          # File hướng dẫn này
```

## Các sections trong trang

1. **Top Header** - Thông tin liên hệ và mạng xã hội
2. **Navigation Bar** - Menu điều hướng chính
3. **Hero Section** - Banner chính với nút "Khám phá phòng"
4. **Booking Form** - Form đặt phòng
5. **Welcome Section** - Giới thiệu về khách sạn
6. **Room Types** - Hiển thị các loại phòng (Triple, Senior, Connecting)
7. **Services** - Các dịch vụ (Đưa đón sân bay, Bữa sáng, Tour guide, BBQ)
8. **Promotional Video** - Section video quảng cáo
9. **Featured Articles** - Các bài viết nổi bật về Sapa
10. **Customer Feedback** - Phản hồi từ khách hàng
11. **Spa Section** - Giới thiệu dịch vụ spa
12. **Gallery** - Thư viện hình ảnh
13. **Footer** - Thông tin liên hệ, links, newsletter

## Hình ảnh cần thiết

Các hình ảnh sau cần được đặt trong thư mục `images/`:

### Hero & Background
- `hero-room.jpg` - Hình ảnh phòng khách sạn cho hero section
- `spa-bg.jpg` - Background cho spa section
- `promo-video-bg.jpg` - Background cho video section

### Rooms
- `hotel-lobby.jpg` - Sảnh khách sạn
- `room-triple.jpg` - Phòng Triple
- `room-senior.jpg` - Phòng Senior
- `room-connecting.jpg` - Phòng Connecting

### Services
- `service-airport.jpg` - Dịch vụ đưa đón sân bay
- `service-breakfast.jpg` - Bữa sáng
- `service-tour.jpg` - Hướng dẫn viên
- `service-bbq.jpg` - Tiệc BBQ

### Articles
- `article-sapa-market.jpg` - Chợ Tình Sapa
- `article-fansipan.jpg` - Núi Fansipan
- `article-love-waterfall.jpg` - Thác Tình Yêu
- `article-ham-rong.jpg` - Núi Hàm Rồng
- `article-lao-chai.jpg` - Bản Lao Chải
- `article-cat-cat.jpg` - Bản Cát Cát

### Customers
- `customer-1.jpg` - Avatar khách hàng 1
- `customer-2.jpg` - Avatar khách hàng 2
- `customer-3.jpg` - Avatar khách hàng 3
- `tripadvisor-logo.png` - Logo TripAdvisor
- `booking-logo.png` - Logo Booking.com

### Spa & Gallery
- `spa-treatment.jpg` - Hình ảnh spa treatment
- `gallery-1.jpg` đến `gallery-6.jpg` - Hình ảnh gallery

## Cách sử dụng

### 1. Cài đặt Dependencies

```bash
# Cài đặt Python dependencies
pip install -r requirements.txt
```

### 2. Chạy Backend API

```bash
# Từ thư mục gốc dự án
cd SRC/Arch
python app.py
```

Backend sẽ chạy tại `http://localhost:5000`

### 3. Chạy Frontend

Có 2 cách:

**Cách 1: Mở trực tiếp file HTML**
- Mở `SRC/UI/index.html` trong trình duyệt
- Lưu ý: Một số tính năng API có thể không hoạt động do CORS

**Cách 2: Chạy local server (Khuyến nghị)**
```bash
# Từ thư mục SRC/UI
cd SRC/UI

# Python
python -m http.server 8000

# Hoặc Node.js
npx http-server -p 8000
```

4. Truy cập `http://localhost:8000`

### 4. Cấu hình API URL

Nếu backend chạy ở port khác, cập nhật trong `SRC/UI/js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Thay đổi port nếu cần
```

## Tích hợp với Backend API

Frontend đã được tích hợp với backend API thông qua file `api.js`. Tất cả các API calls đã được implement:

### API Services Available

- **RoomAPI**: `getAllRooms()`, `searchRooms()`, `getRoom()`, `createRoom()`, `updateRoom()`, `deleteRoom()`, `assignRoom()`
- **BookingAPI**: `createBooking()`, `getAllBookings()`, `getBooking()`, `updateBooking()`, `cancelBooking()`
- **UserAPI**: `createUser()`, `getUser()`, `updateProfile()`
- **PaymentAPI**: `processPayment()`, `getPayment()`, `getPaymentsByBooking()`
- **ServiceAPI**: `getAllServices()`, `getService()`, `requestService()`
- **CouponAPI**: `applyCoupon()`, `getCoupon()`
- **CheckInAPI**: `processCheckIn()`, `processCheckOut()`, `getCheckIn()`

### Features Đã Implement

✅ **Booking Form**: Tự động tìm phòng trống và tạo booking
✅ **Room Search**: Tìm kiếm phòng theo type và status
✅ **Room Loading**: Tự động load danh sách phòng từ API
✅ **Error Handling**: Notification system cho success/error messages
✅ **Loading States**: Hiển thị trạng thái loading khi gọi API

## Responsive Design

Website đã được thiết kế responsive và hỗ trợ:
- Desktop (1200px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Tất cả các hình ảnh hiện tại là placeholder paths, cần thay thế bằng hình ảnh thực tế
- Một số tính năng như video player, image carousel cần được implement đầy đủ
- Form validation có thể được mở rộng thêm
- Có thể thêm loading states và error handling

