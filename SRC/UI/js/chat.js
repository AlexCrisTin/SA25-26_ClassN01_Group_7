// Chat Manager - Handles chat functionality with admin
const ChatManager = {
    currentUser: null,
    messages: [],
    adminResponses: [
        "Xin chào! Tôi có thể giúp gì cho bạn?",
        "Cảm ơn bạn đã liên hệ với Luxe Hotel. Chúng tôi sẽ hỗ trợ bạn ngay.",
        "Tôi hiểu vấn đề của bạn. Để tôi kiểm tra thông tin và phản hồi lại sau.",
        "Chúng tôi rất vui được phục vụ bạn. Bạn có cần hỗ trợ thêm gì không?",
        "Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.",
        "Cảm ơn bạn đã tin tưởng Luxe Hotel. Chúng tôi luôn sẵn sàng hỗ trợ bạn.",
        "Để được hỗ trợ tốt hơn, bạn có thể cung cấp thêm thông tin chi tiết không?",
        "Chúng tôi đã nhận được yêu cầu của bạn và đang xử lý. Vui lòng chờ trong giây lát.",
        "Nếu bạn có bất kỳ câu hỏi nào khác, đừng ngần ngại hỏi chúng tôi nhé!",
        "Chúng tôi rất trân trọng phản hồi của bạn. Cảm ơn bạn đã dành thời gian."
    ],

    // Initialize chat
    init: function(user) {
        this.currentUser = user;
        this.loadMessages();
        this.setupEventListeners();
        this.scrollToBottom();
    },

    // Load messages from localStorage
    loadMessages: function() {
        const savedMessages = localStorage.getItem(`chat_messages_${this.currentUser.id}`);
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
            this.renderMessages();
        }
    },

    // Save messages to localStorage
    saveMessages: function() {
        // Save user's own messages
        localStorage.setItem(`chat_messages_${this.currentUser.id}`, JSON.stringify(this.messages));
        
        // Also save to centralized storage for admin access
        const allChats = this.getAllChats();
        allChats[this.currentUser.id] = {
            userId: this.currentUser.id,
            userName: this.currentUser.full_name || this.currentUser.username || 'User',
            userEmail: this.currentUser.email || '',
            messages: this.messages,
            lastMessageTime: this.messages.length > 0 
                ? this.messages[this.messages.length - 1].timestamp 
                : new Date().toISOString()
        };
        localStorage.setItem('all_chat_messages', JSON.stringify(allChats));
    },

    // Get all chats (for admin)
    getAllChats: function() {
        const allChatsStr = localStorage.getItem('all_chat_messages');
        return allChatsStr ? JSON.parse(allChatsStr) : {};
    },

    // Setup event listeners
    setupEventListeners: function() {
        const chatForm = document.getElementById('chatForm');
        const messageInput = document.getElementById('messageInput');

        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    },

    // Send message
    sendMessage: function() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const message = messageInput.value.trim();

        if (!message) return;

        // Disable input while sending
        messageInput.disabled = true;
        sendBtn.disabled = true;

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        this.messages.push(userMessage);
        this.saveMessages();
        this.renderMessages();
        this.scrollToBottom();

        // Clear input
        messageInput.value = '';
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.focus();

        // Simulate admin response after delay
        setTimeout(() => {
            this.receiveAdminMessage();
        }, 1000 + Math.random() * 2000); // 1-3 seconds delay
    },

    // Receive admin message (simulated)
    receiveAdminMessage: function() {
        // Get a random response or use a contextual one
        const response = this.getAdminResponse();
        
        const adminMessage = {
            id: Date.now(),
            text: response,
            sender: 'admin',
            timestamp: new Date().toISOString()
        };

        this.messages.push(adminMessage);
        this.saveMessages();
        this.renderMessages();
        this.scrollToBottom();
    },

    // Get admin response (can be enhanced with AI or backend API)
    getAdminResponse: function() {
        // Simple random response for now
        // In production, this would call a backend API
        const randomIndex = Math.floor(Math.random() * this.adminResponses.length);
        return this.adminResponses[randomIndex];
    },

    // Render all messages
    renderMessages: function() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        if (this.messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="empty-chat">
                    <div class="empty-chat-icon">💬</div>
                    <p>Chào mừng bạn đến với dịch vụ hỗ trợ của Luxe Hotel!</p>
                    <p style="font-size: 14px; margin-top: 10px;">Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện.</p>
                </div>
            `;
            return;
        }

        chatMessages.innerHTML = this.messages.map(msg => {
            const isUser = msg.sender === 'user';
            const avatar = isUser 
                ? (this.currentUser.full_name || this.currentUser.username || 'U').charAt(0).toUpperCase()
                : 'A';
            const time = this.formatTime(msg.timestamp);

            return `
                <div class="message ${msg.sender}">
                    <div class="message-avatar">${avatar}</div>
                    <div class="message-content">
                        <p class="message-text">${this.escapeHtml(msg.text)}</p>
                        <div class="message-time">${time}</div>
                    </div>
                </div>
            `;
        }).join('');

        this.scrollToBottom();
    },

    // Format timestamp
    formatTime: function(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) {
            return 'Vừa xong';
        } else if (minutes < 60) {
            return `${minutes} phút trước`;
        } else if (minutes < 1440) {
            const hours = Math.floor(minutes / 60);
            return `${hours} giờ trước`;
        } else {
            return date.toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },

    // Escape HTML to prevent XSS
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Scroll to bottom of chat
    scrollToBottom: function() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    },

    // Clear chat history
    clearChat: function() {
        if (confirm('Bạn có chắc chắn muốn xóa lịch sử chat?')) {
            this.messages = [];
            localStorage.removeItem(`chat_messages_${this.currentUser.id}`);
            this.renderMessages();
        }
    }
};

// Export to window
window.ChatManager = ChatManager;

