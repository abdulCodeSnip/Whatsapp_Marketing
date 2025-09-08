#!/bin/bash

# AWS Deployment Script for React SPA
echo "🚀 Starting AWS deployment process..."

# Build the application
echo "📦 Building application..."
yarn build

# Copy redirect rules to dist folder for different AWS services
echo "📋 Setting up redirect rules..."

# For AWS Amplify/S3
cp _redirects dist/

# Create error document for S3 (copy index.html as 404.html)
cp dist/index.html dist/404.html

echo "✅ Build completed successfully!"
echo "📁 Files are ready in the 'dist' directory"
echo ""
echo "📋 Next steps based on your AWS service:"
echo "🔹 S3 + CloudFront: Upload 'dist' contents to S3, configure CloudFront error pages"
echo "🔹 AWS Amplify: Connect your Git repository, Amplify will use amplify.yml"
echo "🔹 Elastic Beanstalk: Zip the 'dist' folder and deploy"
echo ""
echo "💡 Remember to:"
echo "   - Set CloudFront error pages: 403 and 404 both redirect to /index.html with 200 status"
echo "   - Configure S3 bucket for static website hosting"
echo "   - Set proper CORS headers if needed"
