# CloudFront Configuration for React SPA

## Error Pages Configuration
Configure these error pages in your CloudFront distribution:

### Error Page 1 (403 Forbidden)
- **HTTP Error Code**: 403
- **Error Caching Minimum TTL**: 0
- **Customize Error Response**: Yes
- **Response Page Path**: `/index.html`
- **HTTP Response Code**: 200

### Error Page 2 (404 Not Found)
- **HTTP Error Code**: 404
- **Error Caching Minimum TTL**: 0
- **Customize Error Response**: Yes
- **Response Page Path**: `/index.html`
- **HTTP Response Code**: 200

## Origin Settings
- **Origin Domain**: Your S3 bucket website endpoint
- **Origin Path**: Leave empty
- **Origin Access**: Use OAC (Origin Access Control)

## Default Cache Behavior
- **Path Pattern**: Default (*)
- **Origin**: Your S3 origin
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- **Cache Policy**: CachingOptimized or create custom
- **Origin Request Policy**: CORS-S3Origin

## Additional Cache Behaviors (Optional)
Add these for better performance:

### For API calls (if you have backend API)
- **Path Pattern**: `/api/*`
- **Origin**: Your API origin
- **Cache Policy**: CachingDisabled
- **Origin Request Policy**: AllViewer

### For static assets
- **Path Pattern**: `/assets/*`
- **Cache Policy**: CachingOptimized
- **TTL**: 31536000 (1 year)

## Security Headers (Optional)
Add these response headers for better security:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
