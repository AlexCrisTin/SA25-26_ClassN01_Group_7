// Language Manager
const LanguageManager = {
    currentLanguage: localStorage.getItem('language') || 'vi',
    
    translations: {
        vi: {
            nav: {
                home: 'TRANG CHỦ',
                about: 'GIỚI THIỆU',
                rooms: 'PHÒNG NGHỈ',
                services: 'DỊCH VỤ',
                news: 'TIN TỨC',
                gallery: 'HÌNH ẢNH',
                contact: 'LIÊN HỆ',
                login: 'Đăng Nhập',
                logout: 'Đăng Xuất',
                adminPanel: 'ADMIN PANEL',
                dashboard: 'DASHBOARD'
            },
            hero: {
                subtitle: 'Thuộc quần thể biệt thự cao cấp',
                title: 'Sang trọng & đẳng cấp',
                bookNow: 'ĐẶT PHÒNG NGAY'
            },
            welcome: {
                title: 'Chào mừng đến với Demacia Hotel',
                paragraph1: 'Biệt thự và bungalow của Demacia Hotel được trang bị đầy đủ tiện nghi, nội thất sang trọng kết hợp giữa phong cách truyền thống Việt Nam và hiện đại phương Tây. Đội ngũ nhân viên được đào tạo chuyên nghiệp, tận tâm và nhiệt tình.',
                paragraph2: 'Demacia Hotel tự tin mang đến cho bạn những trải nghiệm cảm xúc nâng cao và những trải nghiệm tốt nhất, tuyệt vời nhất cho kỳ nghỉ của bạn, chắc chắn bạn sẽ không hối tiếc khi lựa chọn chúng tôi.'
            },
            rooms: {
                explore: 'KHÁM PHÁ',
                title: 'Các Hạng Phòng',
                roomPrefix: 'Phòng',
                fromPrice: 'Chỉ từ',
                perNight: 'VNĐ/Đêm',
                capacity: 'Sức chứa',
                people: 'người',
                noRooms: 'Chưa có phòng nào',
                loadError: 'Lỗi khi tải danh sách phòng',
                exploreRooms: 'Khám Phá Phòng Nghỉ',
                exploreDescription: 'Danh sách đầy đủ các loại phòng, giá và tình trạng sẵn sàng cho chuyến nghỉ dưỡng của bạn.',
                listTitle: 'Danh Sách Phòng',
                listDescription: 'Xem toàn bộ các phòng đang mở bán và tình trạng hiện tại.',
                searchPlaceholder: 'Tìm số phòng, loại phòng, trạng thái...'
            },
            services: {
                title: 'Dịch Vụ',
                airport: 'Đưa đón sân bay',
                breakfast: 'Bữa sáng miễn phí',
                tour: 'Hướng dẫn viên du lịch thành phố',
                bbq: 'Tiệc BBQ bãi biển'
            },
            promo: {
                tagline: 'Khám phá. Đi lang thang. Nghỉ ngơi',
                title: 'Một cuộc đi chơi bạn sẽ đặc biệt nhớ tới'
            },
            articles: {
                title: 'Những Bài Viết Nổi Bật',
                sapa: 'CHỢ TÌNH SAPA',
                sapaDesc: 'Chợ tình Sapa được tổ chức tại thị trấn Sapa, đây là phiên chợ của dân tộc Dao được tổ chức vào tối thứ 7 hàng tuần.',
                fansipan: 'NÚI FANSIPAN',
                fansipanDesc: 'Đỉnh Phanxipăng - với độ cao 3.143m so với mực nước biển, nằm về phía Tây Nam thị trấn Sa Pa, huyện Sa Pa.',
                loveWaterfall: 'THÁC TÌNH YÊU',
                loveWaterfallDesc: 'Thác Tình Yêu là một ngọn thác nổi tiếng nằm ở xã San Sả Hồ, cách trung tâm thị trấn Sa Pa 16 km.',
                hamRong: 'NÚI HÀM RỒNG',
                laoChai: 'BẢN LAO CHẢI & TẢ VAN',
                catCat: 'BẢN CÁT CÁT',
                catCatDesc: 'Bản làng lâu đời và đẹp nhất Tây bắc',
                detail: 'CHI TIẾT'
            },
            feedback: {
                title: 'Phản Hồi Khách Hàng',
                customer1: '"Tôi rất thích buổi sáng đi dạo trong khuân viên của khách sạn, không khí rất trong lành và có rất nhiều loài hoa đẹp mà tôi chưa từng được thấy."',
                customer2: '"Chỗ ở rất thoải mái, rộng rãi và đặc biệt là rất thoáng mát và không khí rất trong lành. Tôi rất ưng ý với những món ăn được phục vụ tại khách sạn. Tôi nhất định sẽ quay trở lại đây trong tương lai..."',
                customer3: '"Chất lượng các dịch vụ của khách sạn rất tốt, tôi và gia đình của tôi đã có những trải nghiệm vô cùng tuyệt vời nơi đây."'
            },
            spa: {
                title: 'Spa như chưa từng có trước đây',
                description: 'Ngay từ khi bạn bước vào, mọi cảm giác đều mời bạn thư giãn. Hãy tham gia một cuộc hành trình khám phá và kết nối lại tâm trí, cơ thể và tinh thần - được hướng dẫn bởi các nhà trị liệu Aman giàu kinh nghiệm của chúng tôi. Chúng tôi mong được chào đón bạn.',
                contact: 'LIÊN HỆ'
            },
            gallery: {
                title: 'Hình ảnh'
            },
            footer: {
                contact: 'LIÊN HỆ',
                links: 'ĐƯỜNG DẪN',
                contactLink: 'Liên hệ',
                aboutLink: 'Về chúng tôi',
                newsletter: 'ĐỪNG BỎ LỠ BẤT KỲ BẢN CẬP NHẬT NÀO',
                subscribe: 'ĐĂNG KÝ NGAY'
            },
            auth: {
                loginTitle: 'Đăng Nhập',
                welcomeBack: 'Chào mừng bạn trở lại!',
                username: 'Tên đăng nhập',
                password: 'Mật khẩu',
                rememberMe: 'Ghi nhớ đăng nhập',
                forgotPassword: 'Quên mật khẩu?',
                login: 'Đăng Nhập',
                noAccount: 'Chưa có tài khoản?',
                registerNow: 'Đăng ký ngay',
                backHome: '← Về trang chủ',
                registerTitle: 'Đăng Ký',
                registerSubtitle: 'Tạo tài khoản mới để đặt phòng dễ dàng',
                usernameRequired: 'Tên đăng nhập *',
                emailRequired: 'Email *',
                fullNameRequired: 'Họ và tên *',
                phoneRequired: 'Số điện thoại *',
                passwordRequired: 'Mật khẩu *',
                passwordMinLength: 'Mật khẩu tối thiểu 6 ký tự',
                confirmPasswordRequired: 'Xác nhận mật khẩu *',
                register: 'Đăng Ký',
                haveAccount: 'Đã có tài khoản?',
                loginNow: 'Đăng nhập ngay',
                fullName: 'Họ và tên',
                email: 'Email',
                phone: 'Số điện thoại'
            },
            dashboard: {
                title: 'Dashboard',
                myBookings: 'ĐẶT PHÒNG CỦA TÔI',
                wallet: 'VÍ',
                activeRooms: 'Phòng Đang Sử Dụng',
                noActiveRooms: 'Chưa có phòng đang sử dụng',
                checkinPrompt: 'Bạn chưa check-in vào phòng nào. Vui lòng đến quầy lễ tân để check-in.',
                personalInfo: 'Thông Tin Cá Nhân',
                updateProfile: 'Cập Nhật Thông Tin'
            },
            roomDetail: {
                notFound: 'Không tìm thấy phòng',
                notFoundDesc: 'Phòng bạn yêu cầu không tồn tại hoặc đã bị xóa.',
                backToList: 'Quay lại danh sách phòng',
                description: 'Mô Tả Căn Phòng',
                amenities: 'Tiện Nghi Nổi Bật',
                safety: 'An Toàn & Vệ Sinh',
                dailyCleaning: 'Dọn phòng hàng ngày',
                fireExtinguisher: 'Bình chữa cháy',
                smokeDetector: 'Báo khói',
                disinfection: 'Khử khuẩn định kỳ',
                priceNote: 'Giá mỗi đêm (đã bao gồm thuế và phí cơ bản)',
                status: 'Trạng thái:',
                bookNow: 'Đặt phòng ngay',
                contact: 'Liên hệ tư vấn',
                viewMore: 'Xem thêm phòng khác',
                quickBook: 'Đặt Phòng Nhanh',
                checkInDate: 'Ngày nhận phòng',
                checkOutDate: 'Ngày trả phòng',
                guestCount: 'Số lượng khách',
                specialRequests: 'Ghi chú đặc biệt (tuỳ chọn)',
                specialRequestsPlaceholder: 'Ví dụ: yêu cầu giường phụ, tầng cao, view đẹp...',
                confirmBook: 'Xác nhận đặt phòng và thanh toán'
            },
            payment: {
                title: 'Thanh Toán',
                subtitle: 'Hoàn tất thanh toán cho đặt phòng của bạn',
                bookingInfo: 'Thông Tin Đặt Phòng',
                bookingId: 'Mã Đặt Phòng:',
                guestName: 'Tên Khách:',
                roomType: 'Loại Phòng:',
                checkInDate: 'Ngày Nhận:',
                checkOutDate: 'Ngày Trả:',
                walletBalance: 'Số dư ví của bạn:',
                total: 'Tổng Tiền:',
                method: 'Phương Thức Thanh Toán',
                walletMethod: 'Thanh toán bằng ví (trừ vào số dư ngay)',
                cashMethod: 'Thanh toán tiền mặt tại quầy (bỏ qua bước trừ tiền ví)',
                coupon: 'Mã Giảm Giá (Tùy chọn)',
                couponPlaceholder: 'Nhập mã giảm giá',
                apply: 'Áp Dụng'
            },
            myBookings: {
                title: 'Đặt Phòng Của Tôi',
                newBooking: 'Đặt Phòng Mới',
                filterByStatus: 'Lọc theo trạng thái:',
                noBookings: 'Chưa có đặt phòng nào',
                noBookingsDesc: 'Bắt đầu đặt phòng ngay để trải nghiệm dịch vụ của chúng tôi',
                bookNow: 'Đặt Phòng Ngay',
                cancelTitle: 'Hủy Đặt Phòng',
                cancelDesc: 'Vui lòng cho chúng tôi biết lý do hủy phòng. Lưu ý: tiền đặt cọc (nếu có) sẽ không được hoàn lại.',
                cancelReason: 'Lý do hủy phòng',
                cancelReasonPlaceholder: 'Ví dụ: thay đổi kế hoạch, đặt nhầm ngày, tìm được chỗ khác phù hợp hơn...',
                cancelNote: 'Khi xác nhận hủy, đặt phòng sẽ chuyển sang trạng thái Đã Hủy và tiền đặt cọc (nếu có) sẽ bị khấu trừ theo chính sách khách sạn.',
                confirmCancel: 'Xác nhận hủy'
            },
            wallet: {
                title: 'Ví',
                currentBalance: 'Số dư hiện tại:',
                updatedAt: 'Cập nhật lúc:',
                topupAmount: 'Nhập số tiền muốn nạp (VNĐ)',
                topup: 'Nạp ví'
            },
            contact: {
                title: 'Liên Hệ Với Chúng Tôi',
                subtitle: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7',
                info: 'Thông Tin Liên Hệ',
                address: 'Địa Chỉ',
                phone: 'Điện Thoại',
                email: 'Email',
                hours: 'Giờ Làm Việc',
                hoursDesc: '24/7 - Luôn sẵn sàng phục vụ'
            },
            admin: {
                title: 'Admin Panel',
                subtitle: 'Quản lý hệ thống khách sạn',
                receptionistPanel: 'RECEPTIONIST PANEL',
                manageRooms: 'Quản Lý Phòng',
                manageStaff: 'Quản Lý Nhân Viên',
                manageUsers: 'Quản Lý Người Dùng',
                manageServices: 'Quản Lý Dịch Vụ',
                reports: 'Báo Cáo & Thống Kê',
                rooms: {
                    addRoom: '+ Thêm Phòng Mới',
                    searchPlaceholder: 'Tìm kiếm phòng...',
                    status: {
                        available: 'Available',
                        occupied: 'Occupied',
                        maintenance: 'Maintenance',
                        reserved: 'Reserved'
                    },
                    table: {
                        roomNumber: 'Số Phòng',
                        roomType: 'Loại Phòng',
                        price: 'Giá (VNĐ)',
                        status: 'Trạng Thái',
                        capacity: 'Sức Chứa',
                        actions: 'Thao Tác'
                    }
                },
                staff: {
                    addStaff: '+ Thêm Nhân Viên',
                    searchPlaceholder: 'Tìm theo tên, email, chức vụ, phòng ban',
                    table: {
                        fullName: 'Họ Tên',
                        email: 'Email',
                        phone: 'SĐT',
                        position: 'Chức Vụ',
                        department: 'Phòng Ban',
                        status: 'Trạng Thái',
                        actions: 'Thao Tác'
                    }
                },
                users: {
                    searchPlaceholder: 'Tìm theo tên, email, username, role',
                    table: {
                        username: 'Username',
                        fullName: 'Họ Tên',
                        email: 'Email',
                        phone: 'SĐT',
                        role: 'Vai Trò',
                        actions: 'Thao Tác'
                    }
                },
                services: {
                    addService: '+ Thêm Dịch Vụ',
                    status: {
                        available: 'Có Sẵn',
                        unavailable: 'Không Có Sẵn'
                    },
                    view: {
                        title: 'Thông Tin Dịch Vụ',
                        name: 'Tên Dịch Vụ:',
                        description: 'Mô Tả:',
                        price: 'Giá:',
                        category: 'Danh Mục:',
                        status: 'Trạng Thái:'
                    },
                    edit: {
                        title: 'Sửa Thông Tin Dịch Vụ',
                        name: 'Tên Dịch Vụ *',
                        description: 'Mô Tả',
                        price: 'Giá (VNĐ) *',
                        category: 'Danh Mục',
                        categoryPlaceholder: 'e.g., Spa, Dining, Transport',
                        status: 'Trạng Thái'
                    },
                    add: {
                        title: 'Thêm Dịch Vụ Mới',
                        name: 'Tên Dịch Vụ *',
                        description: 'Mô Tả',
                        price: 'Giá (VNĐ) *',
                        category: 'Danh Mục',
                        categoryPlaceholder: 'e.g., Spa, Dining, Transport',
                        submit: 'Thêm Dịch Vụ'
                    },
                    table: {
                        serviceName: 'Tên Dịch Vụ',
                        description: 'Mô Tả',
                        price: 'Giá (VNĐ)',
                        category: 'Danh Mục',
                        actions: 'Thao Tác'
                    }
                }
            },
            receptionist: {
                title: 'Receptionist Panel',
                subtitle: 'Quản lý đặt phòng, check-in, check-out',
                manageBookings: 'Quản Lý Đặt Phòng',
                checkin: 'Check-in',
                checkout: 'Check-out',
                manageServiceRequests: 'Quản Lý Yêu Cầu Dịch Vụ',
                guestName: 'Tên Khách',
                roomType: 'Loại Phòng',
                checkInDate: 'Ngày Nhận',
                checkOutDate: 'Ngày Trả',
                totalAmount: 'Tổng Tiền',
                status: 'Trạng Thái',
                actions: 'Thao Tác',
                searchBookings: 'Tìm kiếm đặt phòng...',
                processCheckin: 'Xử Lý Check-in',
                processCheckout: 'Xử Lý Check-out',
                searchCheckinPlaceholder: 'Nhập ID đặt phòng hoặc tên khách...',
                searchCheckoutPlaceholder: 'Nhập ID đặt phòng hoặc tên khách...',
                service: 'Dịch Vụ',
                roomNumber: 'Số Phòng',
                quantity: 'Số Lượng',
                price: 'Giá',
                requestTime: 'Thời Gian Yêu Cầu',
                searchServiceRequests: 'Tìm theo tên dịch vụ, tên khách, số phòng...',
                updateServiceRequestStatus: 'Cập Nhật Trạng Thái Yêu Cầu Dịch Vụ',
                statusRequired: 'Trạng Thái *',
                notes: 'Ghi Chú',
                notesPlaceholder: 'Nhập ghi chú (nếu có)',
                update: 'Cập Nhật'
            },
            common: {
                all: 'Tất cả',
                cancel: 'Hủy',
                back: 'Quay lại',
                search: 'Tìm kiếm',
                loading: 'Đang tải dữ liệu...',
                close: 'Đóng',
                update: 'Cập Nhật'
            },
            booking: {
                status: {
                    pending: 'Chờ Xác Nhận',
                    confirmed: 'Đã Xác Nhận',
                    checkedIn: 'Đã Check-in',
                    checkedOut: 'Đã Check-out',
                    cancelled: 'Đã Hủy'
                }
            },
            serviceRequest: {
                status: {
                    pending: 'Chờ Xử Lý',
                    inProgress: 'Đang Xử Lý',
                    completed: 'Đã Hoàn Thành',
                    cancelled: 'Đã Hủy'
                }
            },
            adminMessages: {
                title: 'Quản Lý Tin Nhắn Khách Hàng',
                subtitle: 'Xem và trả lời tin nhắn từ khách hàng',
                customerList: 'Danh Sách Khách Hàng',
                searchPlaceholder: 'Tìm kiếm khách hàng...',
                noMessages: 'Chưa có tin nhắn nào',
                noMessagesDesc: 'Khách hàng sẽ xuất hiện ở đây khi họ gửi tin nhắn',
                selectCustomer: 'Chọn khách hàng để xem tin nhắn',
                selectCustomerDesc: 'Chọn một khách hàng từ danh sách bên trái để bắt đầu trò chuyện'
            }
        },
        en: {
            nav: {
                home: 'HOME',
                about: 'ABOUT',
                rooms: 'ROOMS',
                services: 'SERVICES',
                news: 'NEWS',
                gallery: 'GALLERY',
                contact: 'CONTACT',
                login: 'Login',
                logout: 'Logout',
                adminPanel: 'ADMIN PANEL',
                dashboard: 'DASHBOARD'
            },
            hero: {
                subtitle: 'Part of an upscale villa complex',
                title: 'Luxury & Class',
                bookNow: 'BOOK NOW'
            },
            welcome: {
                title: 'Welcome to Demacia Hotel',
                paragraph1: 'Demacia Hotel\'s villas and bungalows are fully equipped with luxurious furnishings combining traditional Vietnamese and modern Western styles. Our professionally trained staff are dedicated and enthusiastic.',
                paragraph2: 'Demacia Hotel is confident in bringing you enhanced emotional experiences and the best, most wonderful experiences for your vacation. You will definitely not regret choosing us.'
            },
            rooms: {
                explore: 'EXPLORE',
                title: 'Room Categories',
                roomPrefix: 'Room',
                fromPrice: 'From',
                perNight: 'VND/Night',
                capacity: 'Capacity',
                people: 'people',
                noRooms: 'No rooms available',
                loadError: 'Error loading room list',
                exploreRooms: 'Explore Rooms',
                exploreDescription: 'Complete list of room types, prices and availability for your stay.',
                listTitle: 'Room List',
                listDescription: 'View all available rooms and their current status.',
                searchPlaceholder: 'Search room number, type, status...'
            },
            services: {
                title: 'Services',
                airport: 'Airport Transfer',
                breakfast: 'Free Breakfast',
                tour: 'City Tour Guide',
                bbq: 'Beach BBQ Party'
            },
            promo: {
                tagline: 'Explore. Wander. Rest',
                title: 'A trip you will especially remember'
            },
            articles: {
                title: 'Featured Articles',
                sapa: 'SAPA LOVE MARKET',
                sapaDesc: 'Sapa Love Market is held in Sapa town, this is a market of the Dao ethnic group held every Saturday evening.',
                fansipan: 'FANSIPAN MOUNTAIN',
                fansipanDesc: 'Phanxipang Peak - with an altitude of 3,143m above sea level, located southwest of Sa Pa town, Sa Pa district.',
                loveWaterfall: 'LOVE WATERFALL',
                loveWaterfallDesc: 'Love Waterfall is a famous waterfall located in San Sa Ho commune, 16 km from the center of Sa Pa town.',
                hamRong: 'HAM RONG MOUNTAIN',
                laoChai: 'LAO CHAI & TA VAN VILLAGE',
                catCat: 'CAT CAT VILLAGE',
                catCatDesc: 'The oldest and most beautiful village in the Northwest',
                detail: 'DETAILS'
            },
            feedback: {
                title: 'Customer Feedback',
                customer1: '"I really enjoyed the morning walks in the hotel grounds, the air is very fresh and there are many beautiful flowers I have never seen before."',
                customer2: '"The accommodation is very comfortable, spacious and especially very airy with very fresh air. I am very satisfied with the dishes served at the hotel. I will definitely return here in the future..."',
                customer3: '"The quality of the hotel services is very good, my family and I have had wonderful experiences here."'
            },
            spa: {
                title: 'Spa like never before',
                description: 'From the moment you step in, every sensation invites you to relax. Join a journey of discovery and reconnect mind, body and spirit - guided by our experienced Aman therapists. We look forward to welcoming you.',
                contact: 'CONTACT'
            },
            gallery: {
                title: 'Gallery'
            },
            footer: {
                contact: 'CONTACT',
                links: 'LINKS',
                contactLink: 'Contact',
                aboutLink: 'About Us',
                newsletter: 'DON\'T MISS ANY UPDATES',
                subscribe: 'SUBSCRIBE NOW'
            },
            auth: {
                loginTitle: 'Login',
                welcomeBack: 'Welcome back!',
                username: 'Username',
                password: 'Password',
                rememberMe: 'Remember me',
                forgotPassword: 'Forgot password?',
                login: 'Login',
                noAccount: 'Don\'t have an account?',
                registerNow: 'Register now',
                backHome: '← Back to home',
                registerTitle: 'Register',
                registerSubtitle: 'Create a new account to book rooms easily',
                usernameRequired: 'Username *',
                emailRequired: 'Email *',
                fullNameRequired: 'Full Name *',
                phoneRequired: 'Phone Number *',
                passwordRequired: 'Password *',
                passwordMinLength: 'Password must be at least 6 characters',
                confirmPasswordRequired: 'Confirm Password *',
                register: 'Register',
                haveAccount: 'Already have an account?',
                loginNow: 'Login now',
                fullName: 'Full Name',
                email: 'Email',
                phone: 'Phone Number'
            },
            dashboard: {
                title: 'Dashboard',
                myBookings: 'MY BOOKINGS',
                wallet: 'WALLET',
                activeRooms: 'Active Rooms',
                noActiveRooms: 'No active rooms',
                checkinPrompt: 'You haven\'t checked in to any room yet. Please go to the reception desk to check in.',
                personalInfo: 'Personal Information',
                updateProfile: 'Update Information'
            },
            roomDetail: {
                notFound: 'Room Not Found',
                notFoundDesc: 'The room you requested does not exist or has been deleted.',
                backToList: 'Back to Room List',
                description: 'Room Description',
                amenities: 'Featured Amenities',
                safety: 'Safety & Hygiene',
                dailyCleaning: 'Daily Cleaning',
                fireExtinguisher: 'Fire Extinguisher',
                smokeDetector: 'Smoke Detector',
                disinfection: 'Regular Disinfection',
                priceNote: 'Price per night (taxes and basic fees included)',
                status: 'Status:',
                bookNow: 'Book Now',
                contact: 'Contact Consultation',
                viewMore: 'View More Rooms',
                quickBook: 'Quick Booking',
                checkInDate: 'Check-in Date',
                checkOutDate: 'Check-out Date',
                guestCount: 'Number of Guests',
                specialRequests: 'Special Notes (Optional)',
                specialRequestsPlaceholder: 'E.g., extra bed request, high floor, nice view...',
                confirmBook: 'Confirm Booking and Payment'
            },
            payment: {
                title: 'Payment',
                subtitle: 'Complete payment for your booking',
                bookingInfo: 'Booking Information',
                bookingId: 'Booking ID:',
                guestName: 'Guest Name:',
                roomType: 'Room Type:',
                checkInDate: 'Check-in Date:',
                checkOutDate: 'Check-out Date:',
                walletBalance: 'Your Wallet Balance:',
                total: 'Total Amount:',
                method: 'Payment Method',
                walletMethod: 'Pay with wallet (deduct from balance immediately)',
                cashMethod: 'Pay cash at counter (skip wallet deduction step)',
                coupon: 'Coupon Code (Optional)',
                couponPlaceholder: 'Enter coupon code',
                apply: 'Apply'
            },
            myBookings: {
                title: 'My Bookings',
                newBooking: 'New Booking',
                filterByStatus: 'Filter by status:',
                noBookings: 'No bookings yet',
                noBookingsDesc: 'Start booking now to experience our services',
                bookNow: 'Book Now',
                cancelTitle: 'Cancel Booking',
                cancelDesc: 'Please let us know the reason for cancellation. Note: deposit (if any) will not be refunded.',
                cancelReason: 'Cancellation Reason',
                cancelReasonPlaceholder: 'E.g., change of plans, wrong date, found better place...',
                cancelNote: 'When confirmed, the booking will change to Cancelled status and the deposit (if any) will be deducted according to hotel policy.',
                confirmCancel: 'Confirm Cancellation'
            },
            wallet: {
                title: 'Wallet',
                currentBalance: 'Current Balance:',
                updatedAt: 'Updated at:',
                topupAmount: 'Enter amount to top up (VND)',
                topup: 'Top Up'
            },
            contact: {
                title: 'Contact Us',
                subtitle: 'We are always ready to support you 24/7',
                info: 'Contact Information',
                address: 'Address',
                phone: 'Phone',
                email: 'Email',
                hours: 'Working Hours',
                hoursDesc: '24/7 - Always ready to serve'
            },
            admin: {
                title: 'Admin Panel',
                subtitle: 'Hotel system management',
                receptionistPanel: 'RECEPTIONIST PANEL',
                manageRooms: 'Manage Rooms',
                manageStaff: 'Manage Staff',
                manageUsers: 'Manage Users',
                manageServices: 'Manage Services',
                reports: 'Reports & Statistics',
                rooms: {
                    addRoom: '+ Add New Room',
                    searchPlaceholder: 'Search rooms...',
                    status: {
                        available: 'Available',
                        occupied: 'Occupied',
                        maintenance: 'Maintenance',
                        reserved: 'Reserved'
                    },
                    table: {
                        roomNumber: 'Room Number',
                        roomType: 'Room Type',
                        price: 'Price (VND)',
                        status: 'Status',
                        capacity: 'Capacity',
                        actions: 'Actions'
                    }
                },
                staff: {
                    addStaff: '+ Add Staff',
                    searchPlaceholder: 'Search by name, email, position, department',
                    table: {
                        fullName: 'Full Name',
                        email: 'Email',
                        phone: 'Phone',
                        position: 'Position',
                        department: 'Department',
                        status: 'Status',
                        actions: 'Actions'
                    }
                },
                users: {
                    searchPlaceholder: 'Search by name, email, username, role',
                    table: {
                        username: 'Username',
                        fullName: 'Full Name',
                        email: 'Email',
                        phone: 'Phone',
                        role: 'Role',
                        actions: 'Actions'
                    }
                },
                services: {
                    addService: '+ Add Service',
                    status: {
                        available: 'Available',
                        unavailable: 'Unavailable'
                    },
                    view: {
                        title: 'Service Information',
                        name: 'Service Name:',
                        description: 'Description:',
                        price: 'Price:',
                        category: 'Category:',
                        status: 'Status:'
                    },
                    edit: {
                        title: 'Edit Service Information',
                        name: 'Service Name *',
                        description: 'Description',
                        price: 'Price (VND) *',
                        category: 'Category',
                        categoryPlaceholder: 'e.g., Spa, Dining, Transport',
                        status: 'Status'
                    },
                    add: {
                        title: 'Add New Service',
                        name: 'Service Name *',
                        description: 'Description',
                        price: 'Price (VND) *',
                        category: 'Category',
                        categoryPlaceholder: 'e.g., Spa, Dining, Transport',
                        submit: 'Add Service'
                    },
                    table: {
                        serviceName: 'Service Name',
                        description: 'Description',
                        price: 'Price (VND)',
                        category: 'Category',
                        actions: 'Actions'
                    }
                }
            },
            receptionist: {
                title: 'Receptionist Panel',
                subtitle: 'Manage bookings, check-in, check-out',
                manageBookings: 'Manage Bookings',
                checkin: 'Check-in',
                checkout: 'Check-out',
                manageServiceRequests: 'Manage Service Requests',
                guestName: 'Guest Name',
                roomType: 'Room Type',
                checkInDate: 'Check-in Date',
                checkOutDate: 'Check-out Date',
                totalAmount: 'Total Amount',
                status: 'Status',
                actions: 'Actions',
                searchBookings: 'Search bookings...',
                processCheckin: 'Process Check-in',
                processCheckout: 'Process Check-out',
                searchCheckinPlaceholder: 'Enter booking ID or guest name...',
                searchCheckoutPlaceholder: 'Enter booking ID or guest name...',
                service: 'Service',
                roomNumber: 'Room Number',
                quantity: 'Quantity',
                price: 'Price',
                requestTime: 'Request Time',
                searchServiceRequests: 'Search by service name, guest name, room number...',
                updateServiceRequestStatus: 'Update Service Request Status',
                statusRequired: 'Status *',
                notes: 'Notes',
                notesPlaceholder: 'Enter notes (if any)',
                update: 'Update'
            },
            common: {
                all: 'All',
                cancel: 'Cancel',
                back: 'Back',
                search: 'Search',
                loading: 'Loading data...',
                close: 'Close',
                update: 'Update'
            },
            booking: {
                status: {
                    pending: 'Pending Confirmation',
                    confirmed: 'Confirmed',
                    checkedIn: 'Checked In',
                    checkedOut: 'Checked Out',
                    cancelled: 'Cancelled'
                }
            },
            serviceRequest: {
                status: {
                    pending: 'Pending',
                    inProgress: 'In Progress',
                    completed: 'Completed',
                    cancelled: 'Cancelled'
                }
            },
            adminMessages: {
                title: 'Customer Messages Management',
                subtitle: 'View and reply to customer messages',
                customerList: 'Customer List',
                searchPlaceholder: 'Search customers...',
                noMessages: 'No messages yet',
                noMessagesDesc: 'Customers will appear here when they send messages',
                selectCustomer: 'Select a customer to view messages',
                selectCustomerDesc: 'Select a customer from the left list to start chatting'
            }
        }
    },
    
    init: function() {
        this.setLanguage(this.currentLanguage);
    },
    
    setLanguage: function(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        
        // Update page title
        if (lang === 'en') {
            document.title = 'Demacia Hotel - Luxury & Class';
        } else {
            document.title = 'Demacia Hotel - Khách Sạn Sang Trọng & Đẳng Cấp';
        }
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT') {
                    if (element.type === 'email') {
                        // Update placeholder for email inputs
                        element.placeholder = lang === 'en' ? 'Email' : 'Email';
                    } else {
                        element.value = translation;
                    }
                } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });
        
        // Update language button styles
        const langVi = document.getElementById('langVi');
        const langEn = document.getElementById('langEn');
        if (langVi && langEn) {
            if (lang === 'vi') {
                langVi.classList.add('active');
                langEn.classList.remove('active');
            } else {
                langEn.classList.add('active');
                langVi.classList.remove('active');
            }
        }
        
        // Reload dynamic content that depends on language
        if (typeof loadRoomsCarousel === 'function') {
            loadRoomsCarousel();
        }
        if (typeof updateRoomCards === 'function' && typeof loadRoomsOnPageLoad === 'function') {
            loadRoomsOnPageLoad();
        }
    },
    
    getTranslation: function(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return typeof value === 'string' ? value : null;
    }
};

// Initialize language on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        LanguageManager.init();
    });
} else {
    LanguageManager.init();
}

// Export to window for global access
window.LanguageManager = LanguageManager;
