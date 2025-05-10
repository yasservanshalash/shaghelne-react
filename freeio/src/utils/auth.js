// Constants
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Local storage keys
export const TOKEN_KEY = 'auth-token';
export const USER_KEY = 'auth-user';

// Helper functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    // Set token to Auth header
    setAuthHeader(token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    // Remove Auth header
    removeAuthHeader();
  }
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const getAuthUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Initialize auth state from localStorage
export const initializeAuth = () => {
  const token = getAuthToken();
  const user = getAuthUser();
  
  if (token) {
    setAuthHeader(token);
  }
  
  return {
    user,
    token,
    isAuthenticated: !!(user && token),
  };
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  removeAuthHeader();
};

// Axios config helpers (if you're using axios)
export const setAuthHeader = (token) => {
  if (window.axios) {
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const removeAuthHeader = () => {
  if (window.axios) {
    delete window.axios.defaults.headers.common['Authorization'];
  }
};

// JWT helpers
export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );

    const { exp } = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;
    
    return exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Auth API requests helpers
export const authApi = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return await response.json();
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return await response.json();
  },
  
  logout: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    clearAuth();
  },
  
  updateProfile: async (profileData, token) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }
    
    return await response.json();
  },
}; 