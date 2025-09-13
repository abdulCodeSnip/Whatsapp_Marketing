import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authenticatedFetch, apiCall } from '../utils/auth';

/**
 * Custom hook that provides authenticated API call functionality
 * Automatically handles 401 responses by logging out the user
 */
export const useAuthenticatedApi = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /**
     * Make an authenticated API call
     * @param {string} endpoint - API endpoint (without base URL)
     * @param {object} options - Fetch options (method, body, headers, etc.)
     * @returns {Promise<Response>} - Fetch response
     */
    const makeApiCall = async (endpoint, options = {}) => {
        return await apiCall(endpoint, options, navigate, dispatch);
    };

    /**
     * Make an authenticated fetch request with full URL
     * @param {string} url - Full URL
     * @param {object} options - Fetch options
     * @returns {Promise<Response>} - Fetch response
     */
    const makeAuthenticatedFetch = async (url, options = {}) => {
        return await authenticatedFetch(url, options, navigate, dispatch);
    };

    /**
     * Helper method for GET requests
     * @param {string} endpoint - API endpoint
     * @returns {Promise<any>} - Parsed JSON response
     */
    const get = async (endpoint) => {
        const response = await makeApiCall(endpoint, { method: 'GET' });
        return await response.json();
    };

    /**
     * Helper method for POST requests
     * @param {string} endpoint - API endpoint
     * @param {any} data - Request body data
     * @returns {Promise<any>} - Parsed JSON response
     */
    const post = async (endpoint, data) => {
        const response = await makeApiCall(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return await response.json();
    };

    /**
     * Helper method for PUT requests
     * @param {string} endpoint - API endpoint
     * @param {any} data - Request body data
     * @returns {Promise<any>} - Parsed JSON response
     */
    const put = async (endpoint, data) => {
        const response = await makeApiCall(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return await response.json();
    };

    /**
     * Helper method for DELETE requests
     * @param {string} endpoint - API endpoint
     * @returns {Promise<any>} - Parsed JSON response
     */
    const del = async (endpoint) => {
        const response = await makeApiCall(endpoint, { method: 'DELETE' });
        return await response.json();
    };

    return {
        makeApiCall,
        makeAuthenticatedFetch,
        get,
        post,
        put,
        delete: del
    };
};
