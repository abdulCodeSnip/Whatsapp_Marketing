import Cookies from 'js-cookie';
import { authenticatingUser } from '../redux/authentication/loginUser';
import { updateToken, clearAuth } from '../redux/authInformation';

// Auth utility functions
export const authUtils = {
    // Get auth token from cookies
    getToken: () => {
        return Cookies.get("jwtToken");
    },

    // Set auth token and user data in cookies
    setAuthData: (token, email, password, dispatch = null) => {
        Cookies.set("jwtToken", token, { expires: 7 }); // Expires in 7 days
        Cookies.set("email", email, { expires: 7 });
        Cookies.set("password", password, { expires: 7 });
        
        // Update Redux store immediately
        if (dispatch) {
            dispatch(updateToken(token));
        }
    },

    // Clear all authentication data
    clearAuthData: (dispatch = null) => {
        Cookies.remove("jwtToken");
        Cookies.remove("email");
        Cookies.remove("password");
        
        // Clear Redux store immediately
        if (dispatch) {
            dispatch(clearAuth());
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = Cookies.get("jwtToken");
        return !!token && token !== "" && token !== "undefined";
    },

    // Get user credentials from cookies
    getUserCredentials: () => {
        return {
            email: Cookies.get("email"),
            password: Cookies.get("password"),
            token: Cookies.get("jwtToken")
        };
    }
};

// Logout function that clears everything and redirects
export const handleLogout = (navigate = null, dispatch = null) => {
    // Clear all authentication data (including Redux store)
    authUtils.clearAuthData(dispatch);
    
    // Clear user from Redux store if dispatch is provided
    if (dispatch) {
        dispatch(authenticatingUser(null));
    }
    
    // Redirect to login page if navigate is provided
    if (navigate) {
        navigate('/login', { replace: true });
    } else {
        // Fallback: reload page to trigger route protection
        window.location.href = '/login';
    }
};

// Enhanced fetch wrapper that handles authentication and 401 responses
export const authenticatedFetch = async (url, options = {}, navigate = null, dispatch = null) => {
    const token = authUtils.getToken();
    
    // Prepare headers with authentication
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Add authorization header if token exists
    if (token && token !== "" && token !== "undefined") {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Make the fetch request
    const response = await fetch(url, {
        ...options,
        headers
    });

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
        console.warn('401 Unauthorized - Logging out user');
        handleLogout(navigate, dispatch);
        
        // Throw error to prevent further processing
        throw new Error('Authentication failed - user logged out');
    }

    return response;
};

// API wrapper with automatic 401 handling
export const apiCall = async (endpoint, options = {}, navigate = null, dispatch = null) => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}${endpoint}`;
    
    try {
        const response = await authenticatedFetch(url, options, navigate, dispatch);
        
        if (!response.ok && response.status !== 401) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }
        
        return response;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};
