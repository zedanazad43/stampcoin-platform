# StampCoin Platform - Database Setup Script
# This script will help you set up a database on Railway

param(
    [Parameter(Mandatory=$true)]
    [string]$DatabaseName = "stampcoin"
)

Write-Host "=========================================="
Write-Host "Database Setup for StampCoin Platform"
Write-Host "=========================================="
Write-Host ""

# Check if Railway CLI is installed
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "ERROR: Railway CLI not found. Please install it first."
    Write-Host "Run: npm install -g @railway/cli"
    exit 1
}

# Check if logged in to Railway
Write-Host "Checking Railway authentication..."
try {
    $railwayStatus = railway status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Already logged in to Railway"
    } else {
        Write-Host "WARNING: Not logged in to Railway"
        Write-Host "Please run: railway login"
        exit 1
    }
} catch {
    Write-Host "WARNING: Not logged in to Railway"
    Write-Host "Please run: railway login"
    exit 1
}

Write-Host ""
Write-Host "=========================================="
Write-Host "Creating Database on Railway"
Write-Host "=========================================="
Write-Host ""

# Initialize Railway project if not already done
Write-Host "Checking for existing Railway project..."
$existingProject = railway status 2>&1 | Select-String "Project:"
if ($existingProject) {
    Write-Host "OK: Railway project already exists"
} else {
    Write-Host "Initializing Railway project..."
    railway init
}

# Add MySQL database
Write-Host ""
Write-Host "Adding MySQL database to Railway..."
railway add mysql

Write-Host ""
Write-Host "Waiting for database to initialize (30 seconds)..."
Start-Sleep -Seconds 30

# Get database URL
Write-Host ""
Write-Host "Getting DATABASE_URL from Railway..."
$dbUrl = railway variables get DATABASE_URL

Write-Host ""
Write-Host "=========================================="
Write-Host "Database Setup Complete!"
Write-Host "=========================================="
Write-Host ""
Write-Host "DATABASE_URL: $dbUrl"
Write-Host ""
Write-Host "Copy this DATABASE_URL and use it for:"
Write-Host "  - Vercel deployment"
Write-Host "  - Local development"
Write-Host "  - Other platforms"
Write-Host ""
Write-Host "To view database details, run:"
Write-Host "  railway status"
Write-Host "  railway variables"
Write-Host ""
