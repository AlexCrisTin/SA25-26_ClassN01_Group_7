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
                perNight: 'VNĐ/đêm',
                capacity: 'Sức chứa',
                people: 'người',
                noRooms: 'Hiện chưa có phòng nào',
                noRoomsDesc: 'Vui lòng quay lại sau hoặc thử tìm kiếm khác.',
                loadError: 'Lỗi khi tải dữ liệu phòng: ',
                loading: 'Đang tải danh sách phòng...',
                exploreRooms: 'Khám Phá Phòng Nghỉ',
                exploreDescription: 'Danh sách đầy đủ các loại phòng, giá và tình trạng sẵn sàng cho chuyến nghỉ dưỡng của bạn.',
                listTitle: 'Danh Sách Phòng',
                listDescription: 'Xem toàn bộ các phòng đang mở bán và tình trạng hiện tại.',
                searchPlaceholder: 'Tìm số phòng, loại phòng, trạng thái...',
                roomTypeFallback: 'Loại phòng',
                guests: 'khách',
                wifiFree: 'Wifi miễn phí',
                contact: 'Liên hệ'
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
                updateProfile: 'Cập Nhật Thông Tin',
                loadingRooms: 'Đang tải thông tin phòng...',
                updateSuccess: 'Cập nhật thông tin thành công!',
                updateError: 'Lỗi khi cập nhật: ',
                loadError: 'Lỗi khi tải thông tin phòng',
                unknownError: 'Đã xảy ra lỗi không xác định',
                reload: 'Tải Lại',
                bookingPrefix: 'Đặt phòng',
                bookingId: 'Mã đặt phòng',
                inUse: 'Đang sử dụng',
                checkInDate: 'Ngày nhận',
                checkOutDate: 'Ngày trả',
                totalPrice: 'Tổng tiền',
                room: 'Phòng',
                service: 'Dịch vụ',
                orderService: 'Đặt Dịch Vụ',
                viewOrderedServices: 'Xem Dịch Vụ Đã Đặt',
                viewDetails: 'Xem Chi Tiết',
                selectService: 'Chọn dịch vụ bạn muốn sử dụng',
                loadingServices: 'Đang tải danh sách dịch vụ...',
                free: 'Miễn phí',
                orderNow: 'Đặt Ngay',
                noServices: 'Không có dịch vụ nào',
                noServicesDesc: 'Hiện tại chưa có dịch vụ nào khả dụng',
                loadServicesError: 'Lỗi khi tải danh sách dịch vụ',
                confirmOrderService: 'Bạn có chắc chắn muốn đặt dịch vụ "{serviceName}" với giá {price} VNĐ?',
                orderServiceSuccess: 'Đặt dịch vụ thành công!',
                orderServiceError: 'Lỗi khi đặt dịch vụ: ',
                orderedServices: 'Dịch Vụ Đã Đặt',
                quantity: 'Số lượng',
                unitPrice: 'Đơn giá',
                totalServiceCost: 'Tổng chi phí dịch vụ',
                noOrderedServices: 'Chưa có dịch vụ nào được đặt'
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
                confirmBook: 'Xác nhận đặt phòng và thanh toán',
                morePhotos: 'ảnh khác',
                roomTypeFallback: 'Phòng Nghỉ',
                maxCapacity: 'Sức chứa tối đa',
                capacity: 'Sức chứa',
                contactPrice: 'Liên hệ để biết giá',
                cannotBook: 'Không thể đặt phòng',
                selectOther: 'Vui lòng chọn phòng khác.',
                defaultDescription: 'Phòng được thiết kế hiện đại, nội thất cao cấp, phù hợp cho các kỳ nghỉ dưỡng thoải mái.',
                bedroom: 'Phòng ngủ',
                bedroomSub: 'Tiện nghi và ấm cúng',
                bathroom: 'Phòng tắm',
                bathroomSub: 'Sạch sẽ, hiện đại',
                privateBathroom: 'Phòng tắm riêng',
                flexiblePolicy: 'Chính sách linh hoạt',
                capacitySub: 'Phù hợp gia đình/nhóm',
                policy: 'Chính sách',
                policySub: 'Thông tin vật nuôi, hút thuốc',
                defaultAmenity1: 'Wi-Fi miễn phí',
                defaultAmenity2: 'Điều hòa không khí',
                defaultAmenity3: 'TV màn hình phẳng',
                defaultAmenity4: 'Bữa sáng miễn phí',
                roomNotFoundReload: 'Không tìm thấy thông tin phòng. Vui lòng tải lại trang.',
                statusOccupied: 'Phòng đang có khách. Vui lòng chọn phòng khác.',
                statusMaintenance: 'Phòng đang bảo trì. Vui lòng chọn phòng khác.',
                statusReserved: 'Phòng đã được đặt trước. Vui lòng chọn phòng khác.',
                statusUnavailable: 'Phòng không khả dụng. Vui lòng chọn phòng khác.',
                selectDates: 'Vui lòng chọn ngày nhận và trả phòng.',
                checkoutAfterCheckin: 'Ngày trả phòng phải sau ngày nhận phòng.',
                guest: 'Khách',
                bookingError: 'Có lỗi xảy ra khi chuẩn bị đặt phòng: '
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
                apply: 'Áp Dụng',
                subtotal: 'Tổng Tiền:',
                discount: 'Giảm Giá:',
                finalAmount: 'Thành Tiền:',
                confirmPayment: 'Xác Nhận Thanh Toán',
                successTitle: 'Thanh Toán Thành Công!',
                successDesc: 'Đặt phòng của bạn đã được xác nhận',
                paymentId: 'Mã Thanh Toán:',
                viewMyBookings: 'Xem Đặt Phòng Của Tôi',
                checkIn: 'Nhận phòng',
                checkOut: 'Trả phòng',
                roomAndGuests: 'Phòng và Khách',
                priceDetails: 'Chi tiết giá:',
                serviceFee: 'Phí dịch vụ',
                tax: 'Thuế',
                totalVND: 'Tổng VNĐ',
                bookingNotFound: 'Không tìm thấy thông tin đặt phòng',
                loadError: 'Lỗi khi tải thông tin đặt phòng: ',
                draftNotFound: 'Không tìm thấy dữ liệu đặt phòng tạm.',
                loadDraftError: 'Lỗi khi tải thông tin đặt phòng tạm: ',
                guest: 'Khách',
                notCreated: '(chưa tạo)',
                walletSuccess: 'Thanh toán bằng ví thành công!',
                bookingWalletSuccess: 'Đặt phòng và thanh toán bằng ví thành công!',
                cashRecorded: 'Đã ghi nhận thanh toán tiền mặt. Vui lòng thanh toán tại quầy khi nhận phòng.',
                bookingCashSuccess: 'Đặt phòng thành công. Vui lòng thanh toán tiền mặt tại quầy khi nhận phòng.',
                alreadyPaid: 'Đặt phòng này đã được thanh toán trước đó.',
                paymentError: 'Lỗi khi thanh toán: ',
                enterCoupon: 'Vui lòng nhập mã giảm giá',
                couponSuccess: 'Áp dụng mã giảm giá thành công!',
                invalidCoupon: 'Mã giảm giá không hợp lệ',
                night: 'đêm',
                nights: 'đêm',
                room: 'phòng',
                adults: 'người lớn'
            },
            myBookings: {
                title: 'Đặt Phòng Của Tôi',
                newBooking: 'Đặt Phòng Mới',
                filterByStatus: 'Lọc theo trạng thái:',
                noBookings: 'Chưa có đặt phòng nào',
                noBookingsDesc: 'Bắt đầu đặt phòng ngay để trải nghiệm dịch vụ của chúng tôi',
                bookNow: 'Đặt Phòng Ngay',
                cancel: 'Hủy Phòng',
                cancelTitle: 'Hủy Đặt Phòng',
                cancelDesc: 'Vui lòng cho chúng tôi biết lý do hủy phòng. Lưu ý: tiền đặt cọc (nếu có) sẽ không được hoàn lại.',
                cancelReason: 'Lý do hủy phòng',
                cancelReasonPlaceholder: 'Ví dụ: thay đổi kế hoạch, đặt nhầm ngày, tìm được chỗ khác phù hợp hơn...',
                cancelNote: 'Khi xác nhận hủy, đặt phòng sẽ chuyển sang trạng thái Đã Hủy và tiền đặt cọc (nếu có) sẽ bị khấu trừ theo chính sách khách sạn.',
                confirmCancel: 'Xác nhận hủy',
                loading: 'Đang tải danh sách đặt phòng...',
                loadError: 'Lỗi khi tải danh sách đặt phòng: ',
                noBookingsWithStatus: 'Không có đặt phòng nào với trạng thái này',
                viewingBooking: 'Đang mở chi tiết đặt phòng #',
                editFeatureComing: 'Chức năng sửa đặt phòng đang được phát triển',
                cancelReasonRequired: 'Vui lòng nhập lý do hủy phòng.',
                cancelling: 'Đang hủy đặt phòng...',
                cancelSuccess: 'Hủy đặt phòng thành công! Tiền đặt cọc (nếu có) sẽ không được hoàn lại.',
                cancelError: 'Lỗi khi hủy đặt phòng: ',
                table: {
                    bookingId: 'Mã Đặt Phòng',
                    guestName: 'Tên Khách',
                    roomType: 'Loại Phòng',
                    checkInDate: 'Ngày Nhận',
                    checkOutDate: 'Ngày Trả',
                    totalPrice: 'Tổng Tiền',
                    status: 'Trạng Thái',
                    actions: 'Thao Tác'
                }
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
                hoursDesc: '24/7 - Luôn sẵn sàng phục vụ',
                adminName: 'Admin Demacia Hotel',
                customerSupport: 'Hỗ trợ khách hàng',
                active: 'Đang hoạt động',
                welcomeMessage: 'Chào mừng bạn đến với dịch vụ hỗ trợ của Demacia Hotel!',
                startConversation: 'Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện.',
                messagePlaceholder: 'Nhập tin nhắn của bạn...'
            },
            chat: {
                justNow: 'Vừa xong',
                minutesAgo: 'phút trước',
                hoursAgo: 'giờ trước',
                confirmClear: 'Bạn có chắc chắn muốn xóa lịch sử chat?',
                adminResponse1: 'Xin chào! Tôi có thể giúp gì cho bạn?',
                adminResponse2: 'Cảm ơn bạn đã liên hệ với Demacia Hotel. Chúng tôi sẽ hỗ trợ bạn ngay.',
                adminResponse3: 'Tôi hiểu vấn đề của bạn. Để tôi kiểm tra thông tin và phản hồi lại sau.',
                adminResponse4: 'Chúng tôi rất vui được phục vụ bạn. Bạn có cần hỗ trợ thêm gì không?',
                adminResponse5: 'Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.',
                adminResponse6: 'Cảm ơn bạn đã tin tưởng Demacia Hotel. Chúng tôi luôn sẵn sàng hỗ trợ bạn.',
                adminResponse7: 'Để được hỗ trợ tốt hơn, bạn có thể cung cấp thêm thông tin chi tiết không?',
                adminResponse8: 'Chúng tôi đã nhận được yêu cầu của bạn và đang xử lý. Vui lòng chờ trong giây lát.',
                adminResponse9: 'Nếu bạn có bất kỳ câu hỏi nào khác, đừng ngần ngại hỏi chúng tôi nhé!',
                adminResponse10: 'Chúng tôi rất trân trọng phản hồi của bạn. Cảm ơn bạn đã dành thời gian.'
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
                noAccess: 'Bạn không có quyền truy cập trang này',
                loadError: 'Lỗi khi tải danh sách: ',
                dataLoadError: 'Lỗi khi tải dữ liệu',
                rooms: {
                    addRoom: '+ Thêm Phòng Mới',
                    searchPlaceholder: 'Tìm kiếm phòng...',
                    status: {
                        available: 'Trống',
                        occupied: 'Đã Thuê',
                        maintenance: 'Bảo Trì',
                        reserved: 'Đã Đặt'
                    },
                    add: {
                        title: 'Thêm Phòng Mới',
                        roomNumber: 'Số Phòng *',
                        roomType: 'Loại Phòng *',
                        roomTypePlaceholder: 'e.g., Triple, Senior, Connecting',
                        price: 'Giá (VNĐ) *',
                        status: 'Trạng Thái',
                        capacity: 'Sức Chứa',
                        image: 'Ảnh Phòng',
                        removeImage: 'Xóa ảnh',
                        submit: 'Thêm Phòng'
                    },
                    edit: {
                        title: 'Sửa Thông Tin Phòng',
                        roomNumber: 'Số Phòng *',
                        roomType: 'Loại Phòng *',
                        price: 'Giá (VNĐ) *',
                        status: 'Trạng Thái',
                        capacity: 'Sức Chứa',
                        image: 'Ảnh Phòng',
                        removeImage: 'Xóa ảnh'
                    },
                    table: {
                        roomNumber: 'Số Phòng',
                        roomType: 'Loại Phòng',
                        price: 'Giá (VNĐ)',
                        status: 'Trạng Thái',
                        capacity: 'Sức Chứa',
                        actions: 'Thao Tác'
                    },
                    empty: 'Chưa có phòng nào'
                },
                staff: {
                    addStaff: '+ Thêm Nhân Viên',
                    searchPlaceholder: 'Tìm theo tên, email, chức vụ, phòng ban',
                    add: {
                        title: 'Thêm Nhân Viên Mới',
                        fullName: 'Họ Tên *',
                        email: 'Email *',
                        phone: 'Số Điện Thoại *',
                        position: 'Chức Vụ *',
                        positionPlaceholder: 'e.g., Receptionist, Housekeeper',
                        department: 'Phòng Ban *',
                        hireDate: 'Ngày Tuyển Dụng',
                        submit: 'Thêm Nhân Viên'
                    },
                    edit: {
                        title: 'Sửa Thông Tin Nhân Viên',
                        fullName: 'Họ Tên *',
                        email: 'Email *',
                        phone: 'Số Điện Thoại *',
                        position: 'Chức Vụ *',
                        positionPlaceholder: 'e.g., Receptionist, Housekeeper',
                        department: 'Phòng Ban *',
                        status: 'Trạng Thái',
                        submit: 'Cập Nhật'
                    },
                    view: {
                        title: 'Thông Tin Nhân Viên',
                        id: 'ID:',
                        fullName: 'Họ Tên:',
                        email: 'Email:',
                        phone: 'Số Điện Thoại:',
                        position: 'Chức Vụ:',
                        department: 'Phòng Ban:',
                        hireDate: 'Ngày Tuyển Dụng:',
                        status: 'Trạng Thái:'
                    },
                    table: {
                        fullName: 'Họ Tên',
                        email: 'Email',
                        phone: 'SĐT',
                        position: 'Chức Vụ',
                        department: 'Phòng Ban',
                        status: 'Trạng Thái',
                        actions: 'Thao Tác'
                    },
                    isActive: {
                        true: 'Hoạt Động',
                        false: 'Không Hoạt Động'
                    },
                    empty: 'Chưa có nhân viên nào'
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
                    },
                    view: {
                        title: 'Thông Tin Người Dùng',
                        id: 'ID:',
                        username: 'Username:',
                        fullName: 'Họ Tên:',
                        email: 'Email:',
                        phone: 'Số Điện Thoại:',
                        role: 'Vai Trò:'
                    },
                    edit: {
                        title: 'Sửa Thông Tin Người Dùng',
                        username: 'Username',
                        fullName: 'Họ Tên *',
                        email: 'Email *',
                        phone: 'Số Điện Thoại',
                        role: 'Vai Trò *',
                        submit: 'Cập Nhật'
                    },
                    roles: {
                        user: 'User',
                        receptionist: 'Receptionist',
                        administrator: 'Administrator'
                    },
                    empty: 'Không có người dùng nào'
                },
                bookings: {
                    empty: 'Chưa có đặt phòng nào'
                },
                services: {
                    addService: '+ Thêm Dịch Vụ',
                    empty: 'Chưa có dịch vụ nào',
                    available: 'Có Sẵn',
                    unavailable: 'Không Có Sẵn',
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
                paymentHistory: 'Lịch Sử Thanh Toán',
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
                bookingId: 'ID Đặt Phòng',
                paymentAmount: 'Số Tiền',
                paymentMethod: 'Phương Thức',
                paymentDate: 'Ngày Thanh Toán',
                transactionId: 'Mã Giao Dịch',
                searchPaymentHistory: 'Tìm theo tên khách, ID đặt phòng...',
                paymentMethods: {
                    cash: 'Ví Điện Tử',
                    credit_card: 'Thẻ Tín Dụng',
                    bank_transfer: 'Chuyển Khoản'
                },
                paymentStatuses: {
                    completed: 'Hoàn Thành',
                    pending: 'Chờ Xử Lý',
                    failed: 'Thất Bại',
                    refunded: 'Đã Hoàn Tiền'
                },
                searchServiceRequests: 'Tìm theo tên dịch vụ, tên khách, số phòng...',
                updateServiceRequestStatus: 'Cập Nhật Trạng Thái Yêu Cầu Dịch Vụ',
                statusRequired: 'Trạng Thái *',
                notes: 'Ghi Chú',
                notesPlaceholder: 'Nhập ghi chú (nếu có)',
                update: 'Cập Nhật',
                updateStatusSuccess: 'Cập nhật trạng thái thành công!',
                updateStatusError: 'Lỗi khi cập nhật: ',
                serviceRequests: {
                    updateSuccess: 'Cập nhật trạng thái yêu cầu dịch vụ thành công!',
                    updateError: 'Lỗi khi cập nhật trạng thái: '
                },
                checkin: {
                    bookingTitle: 'Đặt phòng',
                    roomType: 'Loại phòng:',
                    assignedRoom: 'Phòng đã đặt:',
                    room: 'Phòng',
                    autoAssign: 'Hệ thống sẽ tự động chọn một phòng trống phù hợp với loại phòng',
                    forGuest: 'cho khách.',
                    checkInDate: 'Ngày nhận:',
                    checkOutDate: 'Ngày trả:',
                    totalPrice: 'Tổng tiền:',
                    back: 'Quay Lại',
                    process: 'Thực Hiện Check-in',
                    processing: 'Đang xử lý check-in...',
                    success: 'Check-in thành công! Hệ thống đã tự động assign phòng.',
                    error: 'Đã xảy ra lỗi khi check-in.',
                    searching: 'Đang tìm kiếm đặt phòng...',
                    notFound: 'Không tìm thấy đặt phòng phù hợp.',
                    searchError: 'Đã xảy ra lỗi khi tìm kiếm.',
                    bookingNotFound: 'Không tìm thấy đặt phòng',
                    loadError: 'Lỗi khi tải thông tin đặt phòng:',
                    foundButCannotCheckin: 'Tìm thấy {count} đặt phòng nhưng không có đặt phòng nào có thể check-in.',
                    onlyConfirmed: 'Chỉ những đặt phòng <strong>Đã Xác Nhận</strong> mới có thể check-in.',
                    foundCanCheckin: 'Tìm thấy {count} đặt phòng có thể check-in:',
                    selectBooking: 'Vui lòng chọn đặt phòng muốn check-in:',
                    selectToCheckin: 'Chọn để Check-in'
                },
                checkout: {
                    title: 'Check-out cho đặt phòng',
                    bookingTitle: 'Đặt phòng',
                    roomType: 'Loại phòng:',
                    checkInDate: 'Ngày nhận:',
                    checkOutDate: 'Ngày trả:',
                    totalPrice: 'Tổng tiền:',
                    serviceCost: 'Chi phí dịch vụ phát sinh:',
                    serviceTotal: 'Tổng chi phí dịch vụ:',
                    noServices: 'Không có dịch vụ phát sinh',
                    quantity: 'Số lượng:',
                    back: 'Quay Lại',
                    process: 'Thực Hiện Check-out',
                    processing: 'Đang xử lý check-out...',
                    error: 'Đã xảy ra lỗi khi check-out.',
                    searching: 'Đang tìm kiếm đặt phòng...',
                    notFound: 'Không tìm thấy đặt phòng phù hợp.',
                    searchError: 'Đã xảy ra lỗi khi tìm kiếm.',
                    bookingNotFound: 'Không tìm thấy đặt phòng',
                    notCheckedIn: 'Đặt phòng này chưa được check-in',
                    loadError: 'Lỗi khi tải thông tin đặt phòng:',
                    service: 'Dịch vụ',
                    paymentDetails: 'Chi tiết thanh toán:',
                    roomPrice: 'Giá phòng:',
                    total: 'Tổng cộng:',
                    success: 'Check-out thành công!',
                    foundButCannotCheckout: 'Tìm thấy {count} đặt phòng nhưng không có đặt phòng nào có thể check-out.',
                    onlyCheckedIn: 'Chỉ những đặt phòng <strong>Đã Check-in</strong> mới có thể check-out.',
                    foundCanCheckout: 'Tìm thấy {count} đặt phòng có thể check-out:',
                    selectBooking: 'Vui lòng chọn đặt phòng muốn check-out:',
                    selectToCheckout: 'Chọn để Check-out'
                }
            },
            common: {
                all: 'Tất cả',
                cancel: 'Hủy',
                back: 'Quay lại',
                search: 'Tìm kiếm',
                loading: 'Đang tải dữ liệu...',
                close: 'Đóng',
                update: 'Cập Nhật',
                edit: 'Sửa',
                delete: 'Xóa',
                view: 'Xem'
            },
            booking: {
                confirm: 'Xác Nhận',
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
                perNight: 'VND/night',
                capacity: 'Capacity',
                people: 'people',
                noRooms: 'No rooms available',
                noRoomsDesc: 'Please come back later or try a different search.',
                loadError: 'Error loading room data: ',
                loading: 'Loading room list...',
                exploreRooms: 'Explore Rooms',
                exploreDescription: 'Complete list of room types, prices and availability for your stay.',
                listTitle: 'Room List',
                listDescription: 'View all available rooms and their current status.',
                searchPlaceholder: 'Search room number, type, status...',
                roomTypeFallback: 'Room Type',
                guests: 'guests',
                wifiFree: 'Free WiFi',
                contact: 'Contact'
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
                updateProfile: 'Update Information',
                loadingRooms: 'Loading room information...',
                updateSuccess: 'Information updated successfully!',
                updateError: 'Error updating: ',
                loadError: 'Error loading room information',
                unknownError: 'An unknown error occurred',
                reload: 'Reload',
                bookingPrefix: 'Booking',
                bookingId: 'Booking ID',
                inUse: 'In Use',
                checkInDate: 'Check-in Date',
                checkOutDate: 'Check-out Date',
                totalPrice: 'Total Price',
                room: 'Room',
                service: 'Service',
                orderService: 'Order Service',
                viewOrderedServices: 'View Ordered Services',
                viewDetails: 'View Details',
                selectService: 'Select the service you want to use',
                loadingServices: 'Loading services list...',
                free: 'Free',
                orderNow: 'Order Now',
                noServices: 'No services available',
                noServicesDesc: 'Currently no services are available',
                loadServicesError: 'Error loading services list',
                confirmOrderService: 'Are you sure you want to order service "{serviceName}" for {price} VND?',
                orderServiceSuccess: 'Service ordered successfully!',
                orderServiceError: 'Error ordering service: ',
                orderedServices: 'Ordered Services',
                quantity: 'Quantity',
                unitPrice: 'Unit Price',
                totalServiceCost: 'Total Service Cost',
                noOrderedServices: 'No services ordered yet'
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
                confirmBook: 'Confirm Booking and Payment',
                morePhotos: 'more photos',
                roomTypeFallback: 'Room',
                maxCapacity: 'Max capacity',
                capacity: 'Capacity',
                contactPrice: 'Contact for price',
                cannotBook: 'Cannot book',
                selectOther: 'Please select another room.',
                defaultDescription: 'Modern designed room with premium furniture, perfect for comfortable stays.',
                bedroom: 'Bedroom',
                bedroomSub: 'Comfortable and cozy',
                bathroom: 'Bathroom',
                bathroomSub: 'Clean and modern',
                privateBathroom: 'Private bathroom',
                flexiblePolicy: 'Flexible policy',
                capacitySub: 'Suitable for families/groups',
                policy: 'Policy',
                policySub: 'Pet and smoking information',
                defaultAmenity1: 'Free Wi-Fi',
                defaultAmenity2: 'Air conditioning',
                defaultAmenity3: 'Flat screen TV',
                defaultAmenity4: 'Free breakfast',
                roomNotFoundReload: 'Room information not found. Please reload the page.',
                statusOccupied: 'Room is occupied. Please select another room.',
                statusMaintenance: 'Room is under maintenance. Please select another room.',
                statusReserved: 'Room is reserved. Please select another room.',
                statusUnavailable: 'Room is unavailable. Please select another room.',
                selectDates: 'Please select check-in and check-out dates.',
                checkoutAfterCheckin: 'Check-out date must be after check-in date.',
                guest: 'Guest',
                bookingError: 'Error preparing booking: '
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
                apply: 'Apply',
                subtotal: 'Subtotal:',
                discount: 'Discount:',
                finalAmount: 'Final Amount:',
                confirmPayment: 'Confirm Payment',
                successTitle: 'Payment Successful!',
                successDesc: 'Your booking has been confirmed',
                paymentId: 'Payment ID:',
                viewMyBookings: 'View My Bookings',
                checkIn: 'Check-in',
                checkOut: 'Check-out',
                roomAndGuests: 'Room and Guests',
                priceDetails: 'Price Details:',
                serviceFee: 'Service Fee',
                tax: 'Tax',
                totalVND: 'Total VND',
                bookingNotFound: 'Booking information not found',
                loadError: 'Error loading booking information: ',
                draftNotFound: 'Draft booking data not found.',
                loadDraftError: 'Error loading draft booking information: ',
                guest: 'Guest',
                notCreated: '(not created)',
                walletSuccess: 'Wallet payment successful!',
                bookingWalletSuccess: 'Booking and wallet payment successful!',
                cashRecorded: 'Cash payment recorded. Please pay at the counter when checking in.',
                bookingCashSuccess: 'Booking successful. Please pay cash at the counter when checking in.',
                alreadyPaid: 'This booking has already been paid.',
                paymentError: 'Payment error: ',
                enterCoupon: 'Please enter coupon code',
                couponSuccess: 'Coupon applied successfully!',
                invalidCoupon: 'Invalid coupon code',
                night: 'night',
                nights: 'nights',
                room: 'room',
                adults: 'adults'
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
                confirmCancel: 'Confirm Cancellation',
                loading: 'Loading bookings...',
                loadError: 'Error loading bookings: ',
                noBookingsWithStatus: 'No bookings with this status',
                viewingBooking: 'Opening booking details #',
                editFeatureComing: 'Edit booking feature is under development',
                cancelReasonRequired: 'Please enter cancellation reason.',
                cancelling: 'Cancelling booking...',
                cancelSuccess: 'Booking cancelled successfully! Deposit (if any) will not be refunded.',
                cancelError: 'Error cancelling booking: ',
                table: {
                    bookingId: 'Booking ID',
                    guestName: 'Guest Name',
                    roomType: 'Room Type',
                    checkInDate: 'Check-in Date',
                    checkOutDate: 'Check-out Date',
                    totalPrice: 'Total Price',
                    status: 'Status',
                    actions: 'Actions'
                }
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
                hoursDesc: '24/7 - Always ready to serve',
                adminName: 'Admin Demacia Hotel',
                customerSupport: 'Customer Support',
                active: 'Active',
                welcomeMessage: 'Welcome to Demacia Hotel support service!',
                startConversation: 'Send a message to start the conversation.',
                messagePlaceholder: 'Type your message...'
            },
            chat: {
                justNow: 'Just now',
                minutesAgo: 'minutes ago',
                hoursAgo: 'hours ago',
                confirmClear: 'Are you sure you want to clear chat history?',
                adminResponse1: 'Hello! How can I help you?',
                adminResponse2: 'Thank you for contacting Demacia Hotel. We will assist you right away.',
                adminResponse3: 'I understand your issue. Let me check the information and get back to you.',
                adminResponse4: 'We are happy to serve you. Do you need any additional support?',
                adminResponse5: 'Your information has been recorded. We will contact you as soon as possible.',
                adminResponse6: 'Thank you for trusting Demacia Hotel. We are always ready to support you.',
                adminResponse7: 'To better assist you, could you provide more detailed information?',
                adminResponse8: 'We have received your request and are processing it. Please wait a moment.',
                adminResponse9: 'If you have any other questions, please don\'t hesitate to ask us!',
                adminResponse10: 'We greatly appreciate your feedback. Thank you for your time.'
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
                noAccess: 'You do not have access to this page',
                loadError: 'Error loading list: ',
                dataLoadError: 'Error loading data',
                rooms: {
                    addRoom: '+ Add New Room',
                    searchPlaceholder: 'Search rooms...',
                    status: {
                        available: 'Available',
                        occupied: 'Occupied',
                        maintenance: 'Maintenance',
                        reserved: 'Reserved'
                    },
                    add: {
                        title: 'Add New Room',
                        roomNumber: 'Room Number *',
                        roomType: 'Room Type *',
                        roomTypePlaceholder: 'e.g., Triple, Senior, Connecting',
                        price: 'Price (VND) *',
                        status: 'Status',
                        capacity: 'Capacity',
                        image: 'Room Image',
                        removeImage: 'Remove Image',
                        submit: 'Add Room'
                    },
                    edit: {
                        title: 'Edit Room Information',
                        roomNumber: 'Room Number *',
                        roomType: 'Room Type *',
                        price: 'Price (VND) *',
                        status: 'Status',
                        capacity: 'Capacity',
                        image: 'Room Image',
                        removeImage: 'Remove Image'
                    },
                    table: {
                        roomNumber: 'Room Number',
                        roomType: 'Room Type',
                        price: 'Price (VND)',
                        status: 'Status',
                        capacity: 'Capacity',
                        actions: 'Actions'
                    },
                    empty: 'No rooms available'
                },
                staff: {
                    addStaff: '+ Add Staff',
                    searchPlaceholder: 'Search by name, email, position, department',
                    add: {
                        title: 'Add New Staff',
                        fullName: 'Full Name *',
                        email: 'Email *',
                        phone: 'Phone *',
                        position: 'Position *',
                        positionPlaceholder: 'e.g., Receptionist, Housekeeper',
                        department: 'Department *',
                        hireDate: 'Hire Date',
                        submit: 'Add Staff'
                    },
                    edit: {
                        title: 'Edit Staff Information',
                        fullName: 'Full Name *',
                        email: 'Email *',
                        phone: 'Phone *',
                        position: 'Position *',
                        positionPlaceholder: 'e.g., Receptionist, Housekeeper',
                        department: 'Department *',
                        status: 'Status',
                        submit: 'Update'
                    },
                    view: {
                        title: 'Staff Information',
                        id: 'ID:',
                        fullName: 'Full Name:',
                        email: 'Email:',
                        phone: 'Phone:',
                        position: 'Position:',
                        department: 'Department:',
                        hireDate: 'Hire Date:',
                        status: 'Status:'
                    },
                    table: {
                        fullName: 'Full Name',
                        email: 'Email',
                        phone: 'Phone',
                        position: 'Position',
                        department: 'Department',
                        status: 'Status',
                        actions: 'Actions'
                    },
                    isActive: {
                        true: 'Active',
                        false: 'Inactive'
                    },
                    empty: 'No staff available'
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
                    },
                    view: {
                        title: 'User Information',
                        id: 'ID:',
                        username: 'Username:',
                        fullName: 'Full Name:',
                        email: 'Email:',
                        phone: 'Phone:',
                        role: 'Role:'
                    },
                    edit: {
                        title: 'Edit User Information',
                        username: 'Username',
                        fullName: 'Full Name *',
                        email: 'Email *',
                        phone: 'Phone',
                        role: 'Role *',
                        submit: 'Update'
                    },
                    roles: {
                        user: 'User',
                        receptionist: 'Receptionist',
                        administrator: 'Administrator'
                    },
                    empty: 'No users available'
                },
                bookings: {
                    empty: 'No bookings available'
                },
                services: {
                    addService: '+ Add Service',
                    empty: 'No services available',
                    available: 'Available',
                    unavailable: 'Unavailable',
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
                paymentHistory: 'Payment History',
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
                bookingId: 'Booking ID',
                paymentAmount: 'Amount',
                paymentMethod: 'Method',
                paymentDate: 'Payment Date',
                transactionId: 'Transaction ID',
                searchPaymentHistory: 'Search by guest name, booking ID...',
                paymentMethods: {
                    cash: 'Digital Wallet',
                    credit_card: 'Credit Card',
                    bank_transfer: 'Bank Transfer'
                },
                paymentStatuses: {
                    completed: 'Completed',
                    pending: 'Pending',
                    failed: 'Failed',
                    refunded: 'Refunded'
                },
                searchServiceRequests: 'Search by service name, guest name, room number...',
                updateServiceRequestStatus: 'Update Service Request Status',
                statusRequired: 'Status *',
                notes: 'Notes',
                notesPlaceholder: 'Enter notes (if any)',
                update: 'Update',
                updateStatusSuccess: 'Status updated successfully!',
                updateStatusError: 'Error updating status: ',
                serviceRequests: {
                    updateSuccess: 'Service request status updated successfully!',
                    updateError: 'Error updating status: '
                },
                checkin: {
                    bookingTitle: 'Booking',
                    roomType: 'Room Type:',
                    assignedRoom: 'Assigned Room:',
                    room: 'Room',
                    autoAssign: 'The system will automatically select an available room matching the room type',
                    forGuest: 'for the guest.',
                    checkInDate: 'Check-in Date:',
                    checkOutDate: 'Check-out Date:',
                    totalPrice: 'Total Price:',
                    back: 'Back',
                    process: 'Process Check-in',
                    processing: 'Processing check-in...',
                    success: 'Check-in successful! The system has automatically assigned a room.',
                    error: 'An error occurred during check-in.',
                    searching: 'Searching for bookings...',
                    notFound: 'No matching bookings found.',
                    searchError: 'An error occurred during search.',
                    bookingNotFound: 'Booking not found',
                    loadError: 'Error loading booking information:',
                    foundButCannotCheckin: 'Found {count} booking(s) but none can be checked in or cancelled.',
                    onlyConfirmedOrCheckedIn: 'Only <strong>Confirmed</strong> bookings (for check-in) or <strong>Checked-in</strong> bookings (for cancel check-in) are shown.',
                    foundCanCheckin: 'Found {count} booking(s) that can be checked in:',
                    selectBooking: 'Please select the booking you want to check in:',
                    selectToCheckin: 'Select to Check-in'
                },
                checkout: {
                    title: 'Check-out for booking',
                    bookingTitle: 'Booking',
                    roomType: 'Room Type:',
                    checkInDate: 'Check-in Date:',
                    checkOutDate: 'Check-out Date:',
                    totalPrice: 'Total Price:',
                    serviceCost: 'Additional Service Costs:',
                    serviceTotal: 'Total Service Cost:',
                    noServices: 'No additional services',
                    quantity: 'Quantity:',
                    back: 'Back',
                    process: 'Process Check-out',
                    processing: 'Processing check-out...',
                    error: 'An error occurred during check-out.',
                    searching: 'Searching for bookings...',
                    notFound: 'No matching bookings found.',
                    searchError: 'An error occurred during search.',
                    bookingNotFound: 'Booking not found',
                    notCheckedIn: 'This booking has not been checked in',
                    loadError: 'Error loading booking information:',
                    service: 'Service',
                    paymentDetails: 'Payment Details:',
                    roomPrice: 'Room Price:',
                    total: 'Total:',
                    success: 'Check-out successful!',
                    foundButCannotCheckout: 'Found {count} booking(s) but none can be checked out.',
                    onlyCheckedIn: 'Only <strong>Checked In</strong> bookings can be checked out.',
                    foundCanCheckout: 'Found {count} booking(s) that can be checked out:',
                    selectBooking: 'Please select the booking you want to check out:',
                    selectToCheckout: 'Select to Check-out'
                }
            },
            common: {
                all: 'All',
                cancel: 'Cancel',
                cancelBooking: 'Cancel Booking',
                back: 'Back',
                search: 'Search',
                loading: 'Loading data...',
                close: 'Close',
                update: 'Update',
                edit: 'Edit',
                delete: 'Delete',
                view: 'View'
            },
            booking: {
                confirm: 'Confirm',
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
        // Reload rooms list if on rooms.html page
        if (document.getElementById('roomsGrid')) {
            if (typeof filterRoomsList === 'function') {
                filterRoomsList();
            } else if (window.allRooms && Array.isArray(window.allRooms) && typeof renderRoomsGrid === 'function') {
                renderRoomsGrid(window.allRooms);
            }
        }
        
        // Reload room detail if on room-detail.html page
        if (document.getElementById('roomDetail') && window.currentRoom && typeof renderRoomDetail === 'function') {
            renderRoomDetail(window.currentRoom);
        }
        
        // Reload dashboard checked-in rooms if on dashboard.html page
        if (document.getElementById('checkedInRooms') && window.currentBookingsData && typeof displayCheckedInRooms === 'function') {
            const roomsData = Object.values(window.currentBookingsData).map(data => ({
                booking: data.booking,
                room: data.room,
                checkoutSummary: data.checkoutSummary
            }));
            if (roomsData.length > 0) {
                displayCheckedInRooms(roomsData);
            }
        }
        
        // Reload payment page if on payment.html page
        if (document.getElementById('paymentFormContainer')) {
            if (window.currentBooking && typeof updateBookingSummaryCard === 'function') {
                updateBookingSummaryCard(window.currentBooking);
            } else if (window.bookingDraft && typeof updateBookingSummaryCard === 'function') {
                updateBookingSummaryCard(window.bookingDraft);
            }
            if (typeof loadWalletBalance === 'function') {
                loadWalletBalance();
            }
        }
        
        // Reload admin panel data if on admin page
        // Use setTimeout to ensure the page is ready and variables are accessible
        setTimeout(() => {
            // Try to refresh displays with existing data first
            if (typeof displayRooms === 'function') {
                if (window.allRooms && Array.isArray(window.allRooms) && window.allRooms.length > 0) {
                    displayRooms(window.allRooms);
                } else if (typeof loadRooms === 'function') {
                    loadRooms();
                }
            }
            
            if (typeof displayStaff === 'function') {
                if (window.allStaff && Array.isArray(window.allStaff) && window.allStaff.length > 0) {
                    displayStaff(window.allStaff);
                } else if (typeof loadStaff === 'function') {
                    loadStaff();
                }
            }
            
            if (typeof displayUsers === 'function') {
                if (window.allUsers && Array.isArray(window.allUsers) && window.allUsers.length > 0) {
                    displayUsers(window.allUsers);
                } else if (typeof loadUsers === 'function') {
                    loadUsers();
                }
            }
            
            if (typeof displayServices === 'function') {
                if (window.allServices && Array.isArray(window.allServices) && window.allServices.length > 0) {
                    displayServices(window.allServices);
                } else if (typeof loadServices === 'function') {
                    loadServices();
                }
            }
            
            if (typeof displayBookings === 'function') {
                // Only reload bookings if the bookings table exists (check for bookingsTableBody)
                const bookingsTableBody = document.getElementById('bookingsTableBody');
                if (bookingsTableBody) {
                    if (window.allBookings && Array.isArray(window.allBookings) && window.allBookings.length > 0) {
                        displayBookings(window.allBookings);
                    } else if (typeof loadBookings === 'function') {
                        loadBookings();
                    }
                }
            }
            
            // Reload receptionist panel data if on receptionist page
            if (typeof displayServiceRequests === 'function') {
                if (window.allServiceRequests && Array.isArray(window.allServiceRequests) && window.allServiceRequests.length > 0) {
                    displayServiceRequests(window.allServiceRequests);
                } else if (typeof loadServiceRequests === 'function') {
                    loadServiceRequests();
                }
            }
        }, 100);
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
