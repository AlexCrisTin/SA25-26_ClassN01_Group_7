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
                loadError: 'Lỗi khi tải danh sách phòng'
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
                loadError: 'Error loading room list'
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
