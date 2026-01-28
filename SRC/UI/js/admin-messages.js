// Admin Messages Manager - Handles admin chat management
const AdminMessagesManager = {
    allChats: {},
    selectedUserId: null,
    selectedUser: null,

    // Initialize
    init: function() {
        this.loadAllChats();
        this.renderUsersList();
        this.setupEventListeners();
    },

    // Load all chats from localStorage
    loadAllChats: function() {
        const allChatsStr = localStorage.getItem('all_chat_messages');
        this.allChats = allChatsStr ? JSON.parse(allChatsStr) : {};
    },

    // Get all chats (sorted by last message time)
    getAllChatsSorted: function() {
        return Object.values(this.allChats).sort((a, b) => {
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });
    },

    // Render users list
    renderUsersList: function(searchTerm = '') {
        const usersList = document.getElementById('usersList');
        if (!usersList) return;

        const chats = this.getAllChatsSorted();
        const filteredChats = chats.filter(chat => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (
                chat.userName.toLowerCase().includes(term) ||
                chat.userEmail.toLowerCase().includes(term) ||
                (chat.messages && chat.messages.some(msg => 
                    msg.text.toLowerCase().includes(term)
                ))
            );
        });

        if (filteredChats.length === 0) {
            const emptyTitle = searchTerm
                ? LanguageManager.getTranslation('adminMessages.noResults')
                : LanguageManager.getTranslation('adminMessages.noMessages');
            const emptyDesc = searchTerm
                ? LanguageManager.getTranslation('adminMessages.noResultsDesc')
                : LanguageManager.getTranslation('adminMessages.noMessagesDesc');

            usersList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>${emptyTitle}</h3>
                    <p>${emptyDesc}</p>
                </div>
            `;
            return;
        }

        usersList.innerHTML = filteredChats.map(chat => {
            const userMessages = chat.messages || [];
            const userMessageCount = userMessages.filter(m => m.sender === 'user').length;
            const lastMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
            const lastMessageText = lastMessage ? this.truncateText(lastMessage.text, 30) : 'Chưa có tin nhắn';
            const lastMessageTime = lastMessage ? this.formatTime(lastMessage.timestamp) : '';
            const isActive = this.selectedUserId === chat.userId;
            const avatar = chat.userName.charAt(0).toUpperCase();

            return `
                <div class="user-item ${isActive ? 'active' : ''}" onclick="AdminMessagesManager.selectUser('${chat.userId}')">
                    <div class="user-avatar">${avatar}</div>
                    <div class="user-info">
                        <div class="user-name">${this.escapeHtml(chat.userName)}</div>
                        <div class="user-email">${this.escapeHtml(chat.userEmail || '')}</div>
                    </div>
                    <div class="user-meta">
                        ${userMessageCount > 0 ? `<span class="message-count">${userMessageCount}</span>` : ''}
                        ${lastMessageTime ? `<div class="last-message-time">${lastMessageTime}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Select user to chat
    selectUser: function(userId) {
        this.selectedUserId = userId;
        this.selectedUser = this.allChats[userId];
        
        if (!this.selectedUser) {
            return;
        }

        this.renderUsersList(document.getElementById('userSearch')?.value || '');
        // Force full render when selecting a new user
        this.renderChatPanel(true);
    },

    // Render chat panel
    renderChatPanel: function(forceFullRender = false) {
        const chatPanel = document.getElementById('chatPanel');
        if (!chatPanel || !this.selectedUser) return;

        const messages = this.selectedUser.messages || [];
        const userName = this.selectedUser.userName;
        const userEmail = this.selectedUser.userEmail;
        const avatar = userName.charAt(0).toUpperCase();

        // Check if chat panel already exists
        const existingChatMessages = document.getElementById('chatMessages');
        const existingForm = document.getElementById('chatForm');

        // Only render full panel if it doesn't exist or forceFullRender is true
        if (!existingChatMessages || forceFullRender) {
            chatPanel.innerHTML = `
                <div class="chat-header">
                    <div class="chat-header-avatar">${avatar}</div>
                    <div class="chat-header-info">
                        <h3>${this.escapeHtml(userName)}</h3>
                        <p>${this.escapeHtml(userEmail || '')}</p>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages">
                    ${messages.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">💬</div>
                            <h3>Chưa có tin nhắn nào</h3>
                            <p>Bắt đầu trò chuyện với ${this.escapeHtml(userName)}</p>
                        </div>
                    ` : messages.map(msg => this.renderMessage(msg, userName)).join('')}
                </div>
                <div class="chat-input-container">
                    <form class="chat-input-form" id="chatForm" onsubmit="AdminMessagesManager.sendMessage(event)">
                        <input 
                            type="text" 
                            class="chat-input" 
                            id="messageInput" 
                            placeholder="Nhập tin nhắn trả lời..."
                            autocomplete="off"
                        >
                        <button type="submit" class="send-btn" id="sendBtn">
                            ➤
                        </button>
                    </form>
                </div>
            `;
        } else {
            // Only update messages container
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                if (messages.length === 0) {
                    chatMessages.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">💬</div>
                            <h3>Chưa có tin nhắn nào</h3>
                            <p>Bắt đầu trò chuyện với ${this.escapeHtml(userName)}</p>
                        </div>
                    `;
                } else {
                    chatMessages.innerHTML = messages.map(msg => this.renderMessage(msg, userName)).join('');
                }
            }
        }

        this.scrollToBottom();
    },

    // Render single message
    renderMessage: function(msg, userName) {
        const isUser = msg.sender === 'user';
        const avatar = isUser ? userName.charAt(0).toUpperCase() : 'A';
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
    },

    // Send message as admin
    sendMessage: function(event) {
        event.preventDefault();
        
        if (!this.selectedUser) return;

        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const message = messageInput.value.trim();

        if (!message) return;

        // Disable input while sending
        messageInput.disabled = true;
        sendBtn.disabled = true;

        // Create admin message
        const adminMessage = {
            id: Date.now(),
            text: message,
            sender: 'admin',
            timestamp: new Date().toISOString()
        };

        // Add message to selected user's chat
        if (!this.selectedUser.messages) {
            this.selectedUser.messages = [];
        }
        this.selectedUser.messages.push(adminMessage);
        this.selectedUser.lastMessageTime = adminMessage.timestamp;

        // Update in allChats
        this.allChats[this.selectedUserId] = this.selectedUser;

        // Save to localStorage
        localStorage.setItem('all_chat_messages', JSON.stringify(this.allChats));
        
        // Also update user's own chat storage
        localStorage.setItem(`chat_messages_${this.selectedUserId}`, JSON.stringify(this.selectedUser.messages));

        // Only update messages, don't re-render entire panel
        this.updateMessagesOnly();
        this.renderUsersList(document.getElementById('userSearch')?.value || '');

        // Clear input
        messageInput.value = '';
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.focus();

        showNotification('Đã gửi tin nhắn thành công!', 'success');
    },

    // Update only messages container without re-rendering form
    updateMessagesOnly: function() {
        if (!this.selectedUser) return;

        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) {
            // If messages container doesn't exist, render full panel
            this.renderChatPanel(true);
            return;
        }

        const messages = this.selectedUser.messages || [];
        const userName = this.selectedUser.userName;

        if (messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>Chưa có tin nhắn nào</h3>
                    <p>Bắt đầu trò chuyện với ${this.escapeHtml(userName)}</p>
                </div>
            `;
        } else {
            chatMessages.innerHTML = messages.map(msg => this.renderMessage(msg, userName)).join('');
        }

        this.scrollToBottom();
    },

    // Filter users
    filterUsers: function() {
        const searchInput = document.getElementById('userSearch');
        const searchTerm = searchInput ? searchInput.value : '';
        this.renderUsersList(searchTerm);
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Refresh chats periodically
        setInterval(() => {
            const previousMessagesCount = this.selectedUser ? (this.selectedUser.messages || []).length : 0;
            
            this.loadAllChats();
            
            if (this.selectedUserId) {
                const updatedUser = this.allChats[this.selectedUserId];
                if (updatedUser) {
                    const currentMessagesCount = (updatedUser.messages || []).length;
                    
                    // Only update if messages changed
                    if (currentMessagesCount !== previousMessagesCount) {
                        this.selectedUser = updatedUser;
                        // Only update messages, not the entire panel
                        this.updateMessagesOnly();
                    }
                }
            }
            
            // Update users list (this is lightweight)
            this.renderUsersList(document.getElementById('userSearch')?.value || '');
        }, 2000); // Refresh every 2 seconds
    },

    // Scroll to bottom
    scrollToBottom: function() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
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

    // Truncate text
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // Escape HTML
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Export to window
window.AdminMessagesManager = AdminMessagesManager;

