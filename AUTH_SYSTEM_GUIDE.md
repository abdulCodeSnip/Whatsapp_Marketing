# Authentication System Implementation Guide

## Overview

This implementation provides a comprehensive authentication system that automatically handles JWT tokens, cookies, and 401 responses. When the API returns a 401 status code, the user will be automatically logged out and redirected to the login page.

## Key Features

✅ **Automatic 401 Handling**: Users are automatically logged out when API returns 401  
✅ **Proper Cookie Management**: Secure cookie handling with expiration  
✅ **Centralized Auth Logic**: All authentication logic in one place  
✅ **Easy-to-use Hooks**: Simple hooks for making authenticated API calls  
✅ **Redux Integration**: Seamless integration with existing Redux store  

## Files Created/Modified

### New Files:
- `src/utils/auth.js` - Core authentication utilities
- `src/hooks/useAuthenticatedApi.js` - Hook for authenticated API calls
- `AUTH_SYSTEM_GUIDE.md` - This documentation

### Modified Files:
- `src/Components/Authentication/Login.jsx` - Updated to use new auth utilities
- `src/Components/SideBar.jsx` - Updated logout and authentication logic
- `src/App.jsx` - Updated route protection
- `src/routes/Dashboard.jsx` - Updated API calls to use authenticated fetch
- `src/hooks/useFetchTemplates.js` - Example of updated hook

## How to Use

### 1. Making API Calls (Recommended Method)

Use the `useAuthenticatedApi` hook for all API calls:

```javascript
import { useAuthenticatedApi } from '../hooks/useAuthenticatedApi';

const MyComponent = () => {
    const api = useAuthenticatedApi();

    const fetchData = async () => {
        try {
            // GET request
            const templates = await api.get('/templates');
            
            // POST request
            const newTemplate = await api.post('/templates', templateData);
            
            // PUT request
            const updated = await api.put('/templates/123', updateData);
            
            // DELETE request
            const deleted = await api.delete('/templates/123');
        } catch (error) {
            // Handle error (user will be auto-logged out on 401)
            console.error('API call failed:', error);
        }
    };

    return (
        // Your component JSX
    );
};
```

### 2. Direct Auth Utilities Usage

For more control, use the auth utilities directly:

```javascript
import { authUtils, authenticatedFetch, handleLogout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const MyComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const checkAuth = () => {
        // Check if user is authenticated
        if (authUtils.isAuthenticated()) {
            console.log('User is logged in');
        }
    };

    const makeCustomCall = async () => {
        try {
            const response = await authenticatedFetch(
                'https://api.example.com/data',
                { method: 'GET' },
                navigate,
                dispatch
            );
            const data = await response.json();
        } catch (error) {
            // Handle error
        }
    };

    const logout = () => {
        handleLogout(navigate, dispatch);
    };
};
```

### 3. Auth Utilities Reference

```javascript
// Check authentication status
authUtils.isAuthenticated() // returns boolean

// Get auth token
authUtils.getToken() // returns JWT token or undefined

// Set authentication data (used in login)
authUtils.setAuthData(token, email, password)

// Clear all auth data
authUtils.clearAuthData()

// Get user credentials
authUtils.getUserCredentials() // returns { email, password, token }
```

## Migration Guide

### For Existing Hooks

Replace manual fetch calls with the authenticated API hook:

**Before:**
```javascript
const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/templates`, {
    method: "GET",
    headers: {
        "Authorization": authInformation?.token
    }
});
```

**After:**
```javascript
import { useAuthenticatedApi } from './useAuthenticatedApi';

const MyHook = () => {
    const api = useAuthenticatedApi();
    
    const fetchData = async () => {
        const result = await api.get('/templates');
    };
};
```

### For Components with API Calls

1. Import the hook: `import { useAuthenticatedApi } from '../hooks/useAuthenticatedApi';`
2. Use the hook: `const api = useAuthenticatedApi();`
3. Replace fetch calls with hook methods: `api.get()`, `api.post()`, etc.

## Security Features

### Cookie Management
- Cookies are set with 7-day expiration
- Proper cookie removal on logout
- Secure token storage

### Automatic Logout
- 401 responses trigger immediate logout
- All authentication data is cleared
- User is redirected to login page
- Redux store is updated

### Token Validation
- Tokens are validated before API calls
- Empty or undefined tokens are handled gracefully
- Automatic authentication checks

## Testing the Implementation

1. **Login Flow**: Test that login sets cookies properly
2. **API Calls**: Verify that API calls include proper Authorization headers
3. **401 Handling**: Test that 401 responses log the user out automatically
4. **Route Protection**: Ensure protected routes redirect to login when not authenticated
5. **Logout**: Verify that logout clears all data and redirects properly

## Troubleshooting

### Common Issues:

1. **"Authentication failed - user logged out" error**: This is expected behavior when API returns 401
2. **Infinite redirect loops**: Check that route protection logic is correct
3. **Token not being sent**: Ensure you're using the authenticated fetch methods
4. **Cookies not clearing**: Verify that logout function is being called properly

### Debug Tips:

- Check browser's Application tab for cookie values
- Monitor Network tab for Authorization headers
- Check Redux DevTools for authentication state
- Look for console warnings about missing credentials

## Next Steps

To complete the migration:

1. Update all remaining hooks to use `useAuthenticatedApi`
2. Replace all manual fetch calls with authenticated versions
3. Test all authentication flows thoroughly
4. Update any custom API handling to use the new utilities

This system ensures that your application handles authentication tokens properly and provides a smooth user experience with automatic logout on authentication failures.
