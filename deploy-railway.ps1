# Stampcoin Platform - Railway Deployment Script (Windows PowerShell)
# ============================================

Write-Host "🚀 Deploying Stampcoin Platform to Railway..." -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI not found!" -ForegroundColor Red
    Write-Host "Installing Railway CLI..."
    npm install -g @railway/cli
    Write-Host "✅ Railway CLI installed" -ForegroundColor Green
}

Write-Host "📦 Step 1: Login to Railway" -ForegroundColor Cyan
railway login

Write-Host ""
Write-Host "📦 Step 2: Initialize or Link Project" -ForegroundColor Cyan
$newProject = Read-Host "Is this a new project? (y/n)"

if ($newProject -eq "y") {
    railway init
    Write-Host "✅ Project created" -ForegroundColor Green
} else {
    railway link
    Write-Host "✅ Project linked" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Step 3: Add MySQL Database" -ForegroundColor Cyan
$addMySQL = Read-Host "Add MySQL database? (y/n)"

if ($addMySQL -eq "y") {
    Write-Host "Adding MySQL service..."
    railway add mysql
    Write-Host "✅ MySQL added" -ForegroundColor Green
    Write-Host "⏳ Waiting for MySQL to initialize (30 seconds)..."
    Start-Sleep -Seconds 30

    Write-Host ""
    Write-Host "📦 Step 4: Get Database URL" -ForegroundColor Cyan
    Write-Host "Getting DATABASE_URL from Railway..."
    $dbUrl = railway variables get DATABASE_URL
    Write-Host "DATABASE_URL: $dbUrl"
}

Write-Host ""
Write-Host "📦 Step 5: Deploy Application" -ForegroundColor Cyan
Write-Host "Deploying to Railway..."
railway up

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit your Railway dashboard to view the deployment"
Write-Host "2. Add any additional environment variables needed"
Write-Host "3. Configure custom domain (optional)"
Write-Host ""
Write-Host "🌐 Your application URL:" -ForegroundColor Cyan
railway domain
