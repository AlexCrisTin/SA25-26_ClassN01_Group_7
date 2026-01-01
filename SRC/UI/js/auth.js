// Authentication Management
const AuthManager = {
    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Set current user in localStorage
    setCurrentUser: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    // Clear current user (logout)
    clearCurrentUser: () => {
        localStorage.removeItem('currentUser');
    },

    // Check if user is logged in
    isLoggedIn: () => {
        return AuthManager.getCurrentUser() !== null;
    },

    // Check if user is admin
    isAdmin: () => {
        const user = AuthManager.getCurrentUser();
        return user && user.role === 'administrator';
    },

    // Check if user is receptionist
    isReceptionist: () => {
        const user = AuthManager.getCurrentUser();
        return user && (user.role === 'receptionist' || user.role === 'administrator');
    },

    // Login function
    login: async (username, password) => {
        try {
            const response = await AuthAPI.login(username, password);
            if (response.user) {
                AuthManager.setCurrentUser(response.user);
                return { success: true, user: response.user };
            }
            throw new Error('Invalid response from server');
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get redirect URL based on user role
    getRedirectUrl: () => {
        const user = AuthManager.getCurrentUser();
        if (!user) {
            return 'login.html';
        }
        
        // Admin redirects to admin panel
        if (user.role === 'administrator') {
            return 'admin.html';
        }
        
        // Other users go to dashboard
        return 'dashboard.html';
    },

    // Register function
    register: async (userData) => {
        try {
            const user = await UserAPI.createUser(userData);
            // Auto login after registration
            if (user) {
                AuthManager.setCurrentUser(user);
                return { success: true, user: user };
            }
            throw new Error('Registration failed');
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Logout function
    logout: () => {
        AuthManager.clearCurrentUser();
        window.location.href = 'index.html';
    },

    // Redirect to login if not authenticated
    requireAuth: (redirectTo = 'login.html') => {
        if (!AuthManager.isLoggedIn()) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    },

    // Block admin from accessing user pages (booking, dashboard, etc.)
    blockAdminAccess: (redirectTo = 'admin.html') => {
        if (AuthManager.isAdmin()) {
            showNotification('Admin không có quyền truy cập trang này', 'error');
            setTimeout(() => {
                window.location.href = redirectTo;
            }, 1500);
            return false;
        }
        return true;
    }
};

// Export to window
window.AuthManager = AuthManager;

