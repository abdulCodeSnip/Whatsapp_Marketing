import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authUtils } from '../utils/auth';
import { updateToken, clearAuth } from '../redux/authInformation';

/**
 * Hook to sync authentication state between cookies and Redux store
 * This ensures that the Redux store is always up to date with the current auth state
 */
export const useAuthSync = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const syncAuthState = () => {
            const token = authUtils.getToken();
            
            if (token && token !== "undefined" && token !== "") {
                // Token exists, update Redux store
                dispatch(updateToken(token));
            } else {
                // No valid token, clear Redux store
                dispatch(clearAuth());
            }
        };

        // Sync on mount
        syncAuthState();

        // Optional: Listen for storage events to sync across tabs
        const handleStorageChange = (e) => {
            if (e.key === 'jwtToken') {
                syncAuthState();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [dispatch]);
};
