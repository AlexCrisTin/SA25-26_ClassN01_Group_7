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

    // Helper: Get path to UI root from current location
    _getPathToRoot: () => {
        const path = window.location.pathname;
        // Check if we're in a subfolder (auth/, user/, admin/, public/)
        if (path.includes('/auth/') || path.includes('/user/') || 
            path.includes('/admin/') || path.includes('/public/')) {
            return '../';
        }
        // We're at root level
        return '';
    },
    
    // Get redirect URL based on user role
    // Automatically calculates correct path based on current location
    getRedirectUrl: () => {
        const user = AuthManager.getCurrentUser();
        const rootPath = AuthManager._getPathToRoot();
        
        if (!user) {
            return rootPath + 'auth/login.html';
        }

        // Admin redirects to admin panel
        if (user.role === 'administrator') {
            return rootPath + 'admin/admin.html';
        }

        // Receptionist redirects to receptionist panel
        if (user.role === 'receptionist') {
            return rootPath + 'admin/receptionist.html';
        }

        // Normal users go to dashboard
        return rootPath + 'user/dashboard.html';
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
        const rootPath = AuthManager._getPathToRoot();
        window.location.href = rootPath + 'index.html';
    },

    // Redirect to login if not authenticated
    requireAuth: (redirectTo = null) => {
        if (!AuthManager.isLoggedIn()) {
            if (!redirectTo) {
                const rootPath = AuthManager._getPathToRoot();
                redirectTo = rootPath + 'auth/login.html';
            }
            window.location.href = redirectTo;
            return false;
        }
        return true;
    },

    // Block admin from accessing user pages (booking, dashboard, etc.)
    blockAdminAccess: (redirectTo = null) => {
        if (AuthManager.isAdmin()) {
            showNotification('Admin không có quyền truy cập trang này', 'error');
            setTimeout(() => {
                if (!redirectTo) {
                    const rootPath = AuthManager._getPathToRoot();
                    redirectTo = rootPath + 'admin/admin.html';
                }
                window.location.href = redirectTo;
            }, 1500);
            return false;
        }
        return true;
    }
};

// Export to window
window.AuthManager = AuthManager;

