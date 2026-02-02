# StampCoin Platform - Automated Multi-Platform Deployment Script
# This script will deploy to Railway, Vercel, and Fly.io

param(
    [switch]$SkipRailway = $false,
    [switch]$SkipVercel = $false,
    [switch]$SkipFlyIO = $false
)

$ErrorActionPreference = "Stop"
$projectDir = $PSScriptRoot

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Test-CommandExists {
    param($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if(Get-Command $command){return $true}
    }
    Catch {
        return $false
    }
    Finally {
        $ErrorActionPreference=$oldPreference
    }
}

function Generate-Secret {
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
    $rng.GetBytes($bytes)
    $rng.Dispose()
    return [System.Convert]::ToBase64String($bytes)
}

# Change to project directory
Write-ColorOutput Cyan "📂 Changing to project directory..."
Set-Location $projectDir

# Check prerequisites
Write-ColorOutput Cyan "📋 Checking prerequisites..."

if (-not (Test-CommandExists "railway")) {
    Write-ColorOutput Red "❌ Railway CLI not found. Please install it first."
    exit 1
}
Write-ColorOutput Green "✅ Railway CLI found"

if (-not (Test-CommandExists "vercel")) {
    Write-ColorOutput Red "❌ Vercel CLI not found. Please install it first."
    exit 1
}
Write-ColorOutput Green "✅ Vercel CLI found"

if (-not (Test-CommandExists "fly")) {
    Write-ColorOutput Red "❌ Fly.io CLI not found. Please install it first."
    exit 1
}
Write-ColorOutput Green "✅ Fly.io CLI found"

# Generate secrets
Write-ColorOutput Cyan "🔐 Generating secure secrets..."
$jwtSecret = Generate-Secret
$sessionSecret = Generate-Secret
Write-ColorOutput Green "✅ Secrets generated"

# Deploy to Railway
if (-not $SkipRailway) {
    Write-ColorOutput Cyan ""
    Write-ColorOutput Cyan "=========================================="
    Write-ColorOutput Cyan "🚀 Deploying to Railway"
    Write-ColorOutput Cyan "=========================================="

    # Check if already logged in
    try {
        $railwayStatus = railway status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "✅ Already logged in to Railway"
        } else {
            Write-ColorOutput Yellow "⚠️  Not logged in to Railway. Please run: railway login"
            $loginRailway = Read-Host "Login to Railway now? (y/n)"
            if ($loginRailway -eq "y") {
                railway login
            }
        }
    } catch {
        Write-ColorOutput Yellow "⚠️  Not logged in to Railway. Please run: railway login"
        $loginRailway = Read-Host "Login to Railway now? (y/n)"
        if ($loginRailway -eq "y") {
            railway login
        }
    }

    # Initialize project
    Write-ColorOutput Cyan "📦 Initializing Railway project..."
    railway init

    # Add MySQL database
    Write-ColorOutput Cyan "📦 Adding MySQL database..."
    railway add mysql
    Write-ColorOutput Yellow "⏳ Waiting for database to initialize (30 seconds)..."
    Start-Sleep -Seconds 30

    # Set environment variables
    Write-ColorOutput Cyan "📦 Setting environment variables..."
    railway variables set NODE_ENV=production
    railway variables set PORT=3000
    railway variables set JWT_SECRET=$jwtSecret
    railway variables set SESSION_SECRET=$sessionSecret

    # Deploy
    Write-ColorOutput Cyan "📦 Deploying to Railway..."
    railway up

    Write-ColorOutput Green "✅ Railway deployment complete!"
    Write-ColorOutput Cyan "🌐 Railway URL: https://$(railway domain)"
}

# Deploy to Vercel
if (-not $SkipVercel) {
    Write-ColorOutput Cyan ""
    Write-ColorOutput Cyan "=========================================="
    Write-ColorOutput Cyan "🚀 Deploying to Vercel"
    Write-ColorOutput Cyan "=========================================="

    # Check if already logged in
    try {
        $vercelWhoami = vercel whoami 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "✅ Already logged in to Vercel"
        } else {
            Write-ColorOutput Yellow "⚠️  Not logged in to Vercel. Please run: vercel login"
            $loginVercel = Read-Host "Login to Vercel now? (y/n)"
            if ($loginVercel -eq "y") {
                vercel login
            }
        }
    } catch {
        Write-ColorOutput Yellow "⚠️  Not logged in to Vercel. Please run: vercel login"
        $loginVercel = Read-Host "Login to Vercel now? (y/n)"
        if ($loginVercel -eq "y") {
            vercel login
        }
    }

    # Check for external database
    Write-ColorOutput Yellow "⚠️  Vercel requires an external database."
    Write-ColorOutput Cyan "Please set up a database (PlanetScale, Railway, or Render) and get the DATABASE_URL."
    $databaseUrl = Read-Host "Enter your DATABASE_URL"

    if ([string]::IsNullOrWhiteSpace($databaseUrl)) {
        Write-ColorOutput Red "❌ DATABASE_URL is required for Vercel deployment."
        Write-ColorOutput Yellow "Skipping Vercel deployment..."
    } else {
        # Deploy to Vercel
        Write-ColorOutput Cyan "📦 Deploying to Vercel..."
        vercel

        # Set environment variables
        Write-ColorOutput Cyan "📦 Setting environment variables..."
        vercel env add DATABASE_URL production
        vercel env add NODE_ENV production
        vercel env add PORT production
        vercel env add JWT_SECRET production
        vercel env add SESSION_SECRET production

        # Deploy to production
        Write-ColorOutput Cyan "📦 Deploying to Vercel production..."
        vercel --prod

        Write-ColorOutput Green "✅ Vercel deployment complete!"
    }
}

# Deploy to Fly.io
if (-not $SkipFlyIO) {
    Write-ColorOutput Cyan ""
    Write-ColorOutput Cyan "=========================================="
    Write-ColorOutput Cyan "🚀 Deploying to Fly.io"
    Write-ColorOutput Cyan "=========================================="

    # Check if already logged in
    try {
        $flyAuthStatus = fly auth whoami 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "✅ Already logged in to Fly.io"
        } else {
            Write-ColorOutput Yellow "⚠️  Not logged in to Fly.io. Please run: fly auth login"
            $loginFly = Read-Host "Login to Fly.io now? (y/n)"
            if ($loginFly -eq "y") {
                fly auth login
            }
        }
    } catch {
        Write-ColorOutput Yellow "⚠️  Not logged in to Fly.io. Please run: fly auth login"
        $loginFly = Read-Host "Login to Fly.io now? (y/n)"
        if ($loginFly -eq "y") {
            fly auth login
        }
    }

    # Initialize project
    Write-ColorOutput Cyan "📦 Initializing Fly.io project..."
    fly launch --no-deploy

    # Create PostgreSQL database
    Write-ColorOutput Cyan "📦 Creating PostgreSQL database..."
    fly postgres create

    # Attach database to app
    Write-ColorOutput Cyan "📦 Attaching database to app..."
    fly postgres attach --app stampcoin-platform

    # Set environment variables
    Write-ColorOutput Cyan "📦 Setting environment variables..."
    fly secrets set JWT_SECRET=$jwtSecret
    fly secrets set SESSION_SECRET=$sessionSecret

    # Deploy
    Write-ColorOutput Cyan "📦 Deploying to Fly.io..."
    fly deploy

    Write-ColorOutput Green "✅ Fly.io deployment complete!"
    Write-ColorOutput Cyan "🌐 Fly.io URL: https://stampcoin-platform.fly.dev"
}

# Summary
Write-ColorOutput Cyan ""
Write-ColorOutput Cyan "=========================================="
Write-ColorOutput Green "🎉 All Deployments Complete!"
Write-ColorOutput Cyan "=========================================="
Write-ColorOutput Cyan ""
Write-ColorOutput Cyan "📊 Deployment Summary:"
if (-not $SkipRailway) {
    Write-ColorOutput Cyan "  • Railway: https://$(railway domain)"
}
if (-not $SkipVercel) {
    Write-ColorOutput Cyan "  • Vercel: https://stampcoin-platform.vercel.app"
}
if (-not $SkipFlyIO) {
    Write-ColorOutput Cyan "  • Fly.io: https://stampcoin-platform.fly.dev"
}
Write-ColorOutput Cyan ""
Write-ColorOutput Cyan "📝 Next steps:"
Write-ColorOutput Cyan "  1. Test each deployment"
Write-ColorOutput Cyan "  2. Configure custom domains (optional)"
Write-ColorOutput Cyan "  3. Set up monitoring and analytics"
Write-ColorOutput Cyan "  4. Configure backup and scaling"
Write-ColorOutput Cyan ""
