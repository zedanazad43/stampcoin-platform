# Stampcoin Platform - Fly.io Deployment Guide (Windows PowerShell)
# ============================================

Write-Host "🚀 Stampcoin Platform - Fly.io Deployment Guide" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will guide you through deploying to Fly.io" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Prerequisites:" -ForegroundColor Cyan
Write-Host "1. A Fly.io account (free tier available)" -ForegroundColor White
Write-Host "2. Fly.io CLI installed" -ForegroundColor White
Write-Host "3. A Git repository with the Stampcoin Platform code" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 1: Install Fly.io CLI" -ForegroundColor Cyan
$flyInstalled = Get-Command fly -ErrorAction SilentlyContinue
if (-not $flyInstalled) {
    Write-Host "Installing Fly.io CLI..." -ForegroundColor Yellow
    Write-Host "Running: iwr https://fly.io/install.ps1 -useb | iex" -ForegroundColor White
    iwr https://fly.io/install.ps1 -useb | iex
    Write-Host "✅ Fly.io CLI installed" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Please close and reopen your terminal to use the fly command" -ForegroundColor Yellow
    Write-Host "   Then run this script again" -ForegroundColor Yellow
    exit
} else {
    Write-Host "✅ Fly.io CLI already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Step 2: Login to Fly.io" -ForegroundColor Cyan
Write-Host "Running: fly auth login" -ForegroundColor White
fly auth login

Write-Host ""
Write-Host "📦 Step 3: Initialize Fly.io Project" -ForegroundColor Cyan
Write-Host "Running: fly launch" -ForegroundColor White
Write-Host ""
Write-Host "Follow the prompts:" -ForegroundColor Yellow
Write-Host "? Creating a new app in your current directory" -ForegroundColor White
Write-Host "? App Name: stampcoin-platform (or press Enter for default)" -ForegroundColor White
Write-Host "? Select Organization: (select your account)" -ForegroundColor White
Write-Host "? Select Region: (choose a region close to you)" -ForegroundColor White
Write-Host "? Would you like to deploy now? [y/N] N" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 4: Add MySQL Database" -ForegroundColor Cyan
Write-Host "Running: fly postgres create" -ForegroundColor White
fly postgres create

Write-Host ""
Write-Host "📦 Step 5: Attach Database to App" -ForegroundColor Cyan
Write-Host "Running: fly postgres attach --app stampcoin-platform" -ForegroundColor White
fly postgres attach --app stampcoin-platform

Write-Host ""
Write-Host "📦 Step 6: Configure Environment Variables" -ForegroundColor Cyan
Write-Host "Add the following environment variables:" -ForegroundColor White
Write-Host ""
Write-Host "Required:" -ForegroundColor Yellow
Write-Host "DATABASE_URL: (automatically set by fly postgres attach)" -ForegroundColor Yellow
Write-Host "NODE_ENV: production" -ForegroundColor Yellow
Write-Host "PORT: 3000" -ForegroundColor Yellow
Write-Host "JWT_SECRET: (generate a secure random string)" -ForegroundColor Yellow
Write-Host "SESSION_SECRET: (generate a secure random string)" -ForegroundColor Yellow
Write-Host ""
Write-Host "To set environment variables:" -ForegroundColor White
Write-Host "fly secrets set JWT_SECRET=your-secret-here" -ForegroundColor White
Write-Host "fly secrets set SESSION_SECRET=your-secret-here" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 7: Deploy to Fly.io" -ForegroundColor Cyan
Write-Host "Running: fly deploy" -ForegroundColor White
fly deploy

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Your application will be available at: https://stampcoin-platform.fly.dev" -ForegroundColor White
Write-Host "2. Configure a custom domain (optional)" -ForegroundColor White
Write-Host "3. Set up automatic deployments from your git repository" -ForegroundColor White
Write-Host "4. Monitor your application using Fly.io dashboard" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "View logs: fly logs" -ForegroundColor White
Write-Host "View status: fly status" -ForegroundColor White
Write-Host "Open app: fly open" -ForegroundColor White
Write-Host "Scale: fly scale count 2" -ForegroundColor White
Write-Host "SSH into app: fly ssh console" -ForegroundColor White
Write-Host ""

Write-Host "📚 Additional Resources:" -ForegroundColor Cyan
Write-Host "Fly.io Documentation: https://fly.io/docs/" -ForegroundColor White
Write-Host "PostgreSQL on Fly.io: https://fly.io/docs/reference/postgres/" -ForegroundColor White
Write-Host "Environment Variables: https://fly.io/docs/reference/secrets/" -ForegroundColor White
Write-Host ""

Write-Host "❓ Need Help?" -ForegroundColor Yellow
Write-Host "Email: stampcoin.contact@gmail.com" -ForegroundColor White
Write-Host "GitHub Issues: https://github.com/AzadZedan/Stampcoin-platform/issues" -ForegroundColor White
Write-Host ""
