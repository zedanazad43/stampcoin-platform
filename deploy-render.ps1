# Stampcoin Platform - Render Deployment Guide (Windows PowerShell)
# ============================================

Write-Host "🚀 Stampcoin Platform - Render Deployment Guide" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will guide you through deploying to Render.com" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Prerequisites:" -ForegroundColor Cyan
Write-Host "1. A Render account (free tier available)" -ForegroundColor White
Write-Host "2. A Git repository with the Stampcoin Platform code" -ForegroundColor White
Write-Host "3. Your repository pushed to GitHub/GitLab/Bitbucket" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 1: Create Render Account" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com/" -ForegroundColor White
Write-Host "2. Sign up for a free account" -ForegroundColor White
Write-Host "3. Verify your email address" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 2: Connect Your Repository" -ForegroundColor Cyan
Write-Host "1. Click 'New +' in the Render dashboard" -ForegroundColor White
Write-Host "2. Select 'Web Service'" -ForegroundColor White
Write-Host "3. Connect your GitHub/GitLab/Bitbucket account" -ForegroundColor White
Write-Host "4. Select the Stampcoin Platform repository" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 3: Configure Build Settings" -ForegroundColor Cyan
Write-Host "Configure the following settings:" -ForegroundColor White
Write-Host ""
Write-Host "Name: stampcoin-platform" -ForegroundColor Yellow
Write-Host "Region: Choose the region closest to you" -ForegroundColor Yellow
Write-Host "Branch: main (or your default branch)" -ForegroundColor Yellow
Write-Host "Runtime: Docker" -ForegroundColor Yellow
Write-Host "Build Command: (leave empty for Docker)" -ForegroundColor Yellow
Write-Host "Start Command: (leave empty for Docker)" -ForegroundColor Yellow
Write-Host ""

Write-Host "📦 Step 4: Create PostgreSQL Database" -ForegroundColor Cyan
Write-Host "1. Click 'New +' in the Render dashboard" -ForegroundColor White
Write-Host "2. Select 'PostgreSQL'" -ForegroundColor White
Write-Host "3. Configure:" -ForegroundColor White
Write-Host "   - Name: stampcoin-db" -ForegroundColor Yellow
Write-Host "   - Database: stampcoin" -ForegroundColor Yellow
Write-Host "   - User: stampcoin" -ForegroundColor Yellow
Write-Host "   - Region: Same as your web service" -ForegroundColor Yellow
Write-Host "4. Click 'Create Database'" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 5: Add Environment Variables" -ForegroundColor Cyan
Write-Host "Add the following environment variables to your web service:" -ForegroundColor White
Write-Host ""
Write-Host "DATABASE_URL: (Get from your PostgreSQL database)" -ForegroundColor Yellow
Write-Host "NODE_ENV: production" -ForegroundColor Yellow
Write-Host "PORT: 3000" -ForegroundColor Yellow
Write-Host "JWT_SECRET: (generate a secure random string)" -ForegroundColor Yellow
Write-Host "SESSION_SECRET: (generate a secure random string)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Optional (if needed):" -ForegroundColor Yellow
Write-Host "STRIPE_SECRET_KEY: (your Stripe secret key)" -ForegroundColor White
Write-Host "STRIPE_PUBLISHABLE_KEY: (your Stripe publishable key)" -ForegroundColor White
Write-Host "STRIPE_WEBHOOK_SECRET: (your Stripe webhook secret)" -ForegroundColor White
Write-Host "AWS_ACCESS_KEY_ID: (your AWS access key)" -ForegroundColor White
Write-Host "AWS_SECRET_ACCESS_KEY: (your AWS secret key)" -ForegroundColor White
Write-Host "AWS_REGION: us-east-1" -ForegroundColor White
Write-Host "AWS_S3_BUCKET: (your S3 bucket name)" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 6: Deploy" -ForegroundColor Cyan
Write-Host "1. Click 'Create Web Service'" -ForegroundColor White
Write-Host "2. Render will automatically build and deploy your application" -ForegroundColor White
Write-Host "3. Monitor the deployment logs in the Render dashboard" -ForegroundColor White
Write-Host ""

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Your application will be available at: https://stampcoin-platform.onrender.com" -ForegroundColor White
Write-Host "2. Configure a custom domain (optional)" -ForegroundColor White
Write-Host "3. Set up automatic deployments from your git repository" -ForegroundColor White
Write-Host "4. Monitor your application using Render's dashboard" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "View logs: Go to your service in Render dashboard > Logs" -ForegroundColor White
Write-Host "Redeploy: Go to your service > Manual Deploy > Deploy latest commit" -ForegroundColor White
Write-Host "Scale: Go to your service > Settings > Scale" -ForegroundColor White
Write-Host ""

Write-Host "📚 Additional Resources:" -ForegroundColor Cyan
Write-Host "Render Documentation: https://render.com/docs" -ForegroundColor White
Write-Host "Docker on Render: https://render.com/docs/docker" -ForegroundColor White
Write-Host "Environment Variables: https://render.com/docs/env-vars" -ForegroundColor White
Write-Host ""

Write-Host "❓ Need Help?" -ForegroundColor Yellow
Write-Host "Email: stampcoin.contact@gmail.com" -ForegroundColor White
Write-Host "GitHub Issues: https://github.com/AzadZedan/Stampcoin-platform/issues" -ForegroundColor White
Write-Host ""
