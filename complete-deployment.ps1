# StampCoin Platform - Complete Deployment Automation Script
# This script will handle all deployments: Railway, Vercel, and Fly.io

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
Write-ColorOutput Cyan "Changing to project directory..."
Set-Location $projectDir

# Check prerequisites
Write-ColorOutput Cyan "Checking prerequisites..."

if (-not (Test-CommandExists "railway")) {
    Write-ColorOutput Red "ERROR: Railway CLI not found. Please install it first."
    exit 1
}
Write-ColorOutput Green "OK: Railway CLI found"

if (-not (Test-CommandExists "vercel")) {
    Write-ColorOutput Red "ERROR: Vercel CLI not found. Please install it first."
    exit 1
}
Write-ColorOutput Green "OK: Vercel CLI found"

if (-not (Test-CommandExists "fly")) {
    Write-ColorOutput Red "ERROR: Fly.io CLI not found. Please install it first."
    exit 1
}
Write-ColorOutput Green "OK: Fly.io CLI found"

# Generate secrets
Write-ColorOutput Cyan "Generating secure secrets..."
$jwtSecret = Generate-Secret
$sessionSecret = Generate-Secret
Write-ColorOutput Green "OK: Secrets generated"

# Save secrets to file for reference
$secretsFile = Join-Path $projectDir "deployment-secrets.txt"
@"
JWT_SECRET=$jwtSecret
SESSION_SECRET=$sessionSecret
"@ | Out-File -FilePath $secretsFile -Encoding utf8
Write-ColorOutput Cyan "Secrets saved to: $secretsFile"

# Deploy to Railway
if (-not $SkipRailway) {
    Write-ColorOutput Cyan ""
    Write-ColorOutput Cyan "=========================================="
    Write-ColorOutput Cyan "Deploying to Railway"
    Write-ColorOutput Cyan "=========================================="

    # Check if already logged in
    try {
        $railwayStatus = railway status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "OK: Already logged in to Railway"
        } else {
            Write-ColorOutput Yellow "WARNING: Not logged in to Railway. Please run: railway login"
            $loginRailway = Read-Host "Login to Railway now? (y/n)"
            if ($loginRailway -eq "y") {
                railway login
            }
        }
    } catch {
        Write-ColorOutput Yellow "WARNING: Not logged in to Railway. Please run: railway login"
        $loginRailway = Read-Host "Login to Railway now? (y/n)"
        if ($loginRailway -eq "y") {
            railway login
        }
    }

    # Link to existing project or initialize new one
    Write-ColorOutput Cyan "Linking to Railway project..."
    $linkProject = Read-Host "Do you want to link to existing Railway project? (y/n)"
    if ($linkProject -eq "y") {
        railway link
    } else {
        railway init
    }

    # Check if MySQL database exists
    Write-ColorOutput Cyan "Checking for MySQL database..."
    $hasDatabase = $false
    try {
        $dbUrl = railway variables get DATABASE_URL 2>&1
        if ($LASTEXITCODE -eq 0) {
            $hasDatabase = $true
            Write-ColorOutput Green "OK: Database already exists"
        }
    } catch {
        $hasDatabase = $false
    }

    if (-not $hasDatabase) {
        Write-ColorOutput Cyan "Adding MySQL database..."
        railway add mysql
        Write-ColorOutput Yellow "Waiting for database to initialize (30 seconds)..."
        Start-Sleep -Seconds 30
    }

    # Get DATABASE_URL
    Write-ColorOutput Cyan "Getting DATABASE_URL..."
    $databaseUrl = railway variables get DATABASE_URL
    Write-ColorOutput Green "OK: DATABASE_URL retrieved"

    # Set environment variables
    Write-ColorOutput Cyan "Setting environment variables..."
    railway variables set NODE_ENV=production
    railway variables set PORT=3000
    railway variables set JWT_SECRET=$jwtSecret
    railway variables set SESSION_SECRET=$sessionSecret

    # Deploy
    Write-ColorOutput Cyan "Deploying to Railway..."
    railway up

    Write-ColorOutput Green "OK: Railway deployment complete!"
    $railwayDomain = railway domain
    Write-ColorOutput Cyan "Railway URL: https://$railwayDomain"

    # Save DATABASE_URL for Vercel
    $databaseUrlFile = Join-Path $projectDir "database-url.txt"
    $databaseUrl | Out-File -FilePath $databaseUrlFile -Encoding utf8
    Write-ColorOutput Cyan "DATABASE_URL saved to: $databaseUrlFile"
}

# Deploy to Vercel
if (-not $SkipVercel) {
    Write-ColorOutput Cyan ""
    Write-ColorOutput Cyan "=========================================="
    Write-ColorOutput Cyan "Deploying to Vercel"
    Write-ColorOutput Cyan "=========================================="

    # Check if already logged in
    try {
        $vercelWhoami = vercel whoami 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "OK: Already logged in to Vercel"
        } else {
            Write-ColorOutput Yellow "WARNING: Not logged in to Vercel. Please run: vercel login"
            $loginVercel = Read-Host "Login to Vercel now? (y/n)"
            if ($loginVercel -eq "y") {
                vercel login
            }
        }
    } catch {
        Write-ColorOutput Yellow "WARNING: Not logged in to Vercel. Please run: vercel login"
        $loginVercel = Read-Host "Login to Vercel now? (y/n)"
        if ($loginVercel -eq "y") {
            vercel login
        }
    }

    # Check for DATABASE_URL
    $databaseUrl = ""
    $databaseUrlFile = Join-Path $projectDir "database-url.txt"
    if (Test-Path $databaseUrlFile) {
        $databaseUrl = Get-Content $databaseUrlFile
        Write-ColorOutput Green "OK: DATABASE_URL found from Railway deployment"
    } else {
        Write-ColorOutput Yellow "WARNING: DATABASE_URL not found. Please set up a database (PlanetScale, Railway, or Render) and get the DATABASE_URL."
        $databaseUrl = Read-Host "Enter your DATABASE_URL"
    }

    if ([string]::IsNullOrWhiteSpace($databaseUrl)) {
        Write-ColorOutput Red "ERROR: DATABASE_URL is required for Vercel deployment."
        Write-ColorOutput Yellow "Skipping Vercel deployment..."
    } else {
        # Deploy to Vercel
        Write-ColorOutput Cyan "Deploying to Vercel..."
        vercel --yes

        # Set environment variables
        Write-ColorOutput Cyan "Setting environment variables..."
        vercel env add DATABASE_URL production --yes
        vercel env add NODE_ENV production --yes
        vercel env add PORT production --yes
        vercel env add JWT_SECRET production --yes
        vercel env add SESSION_SECRET production --yes

        # Update environment variables with actual values
        vercel env rm DATABASE_URL production --yes
        vercel env rm NODE_ENV production --yes
        vercel env rm PORT production --yes
        vercel env rm JWT_SECRET production --yes
        vercel env rm SESSION_SECRET production --yes

        # Add environment variables with values
        $env:DATABASE_URL = $databaseUrl
        $env:NODE_ENV = "production"
        $env:PORT = "3000"
        $env:JWT_SECRET = $jwtSecret
        $env:SESSION_SECRET = $sessionSecret

        # Deploy to production
        Write-ColorOutput Cyan "Deploying to Vercel production..."
        vercel --prod --yes

        Write-ColorOutput Green "OK: Vercel deployment complete!"
    }
}

# Deploy to Fly.io
if (-not $SkipFlyIO) {
    Write-ColorOutput Cyan ""
    Write-ColorOutput Cyan "=========================================="
    Write-ColorOutput Cyan "Deploying to Fly.io"
    Write-ColorOutput Cyan "=========================================="

    # Check if already logged in
    try {
        $flyAuthStatus = fly auth whoami 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "OK: Already logged in to Fly.io"
        } else {
            Write-ColorOutput Yellow "WARNING: Not logged in to Fly.io. Please run: fly auth login"
            $loginFly = Read-Host "Login to Fly.io now? (y/n)"
            if ($loginFly -eq "y") {
                fly auth login
            }
        }
    } catch {
        Write-ColorOutput Yellow "WARNING: Not logged in to Fly.io. Please run: fly auth login"
        $loginFly = Read-Host "Login to Fly.io now? (y/n)"
        if ($loginFly -eq "y") {
            fly auth login
        }
    }

    # Initialize project
    Write-ColorOutput Cyan "Initializing Fly.io project..."
    fly launch --no-deploy --yes

    # Create PostgreSQL database
    Write-ColorOutput Cyan "Creating PostgreSQL database..."
    fly postgres create --yes

    # Attach database to app
    Write-ColorOutput Cyan "Attaching database to app..."
    fly postgres attach --app stampcoin-platform --yes

    # Set environment variables
    Write-ColorOutput Cyan "Setting environment variables..."
    fly secrets set JWT_SECRET=$jwtSecret
    fly secrets set SESSION_SECRET=$sessionSecret

    # Deploy
    Write-ColorOutput Cyan "Deploying to Fly.io..."
    fly deploy

    Write-ColorOutput Green "OK: Fly.io deployment complete!"
    Write-ColorOutput Cyan "Fly.io URL: https://stampcoin-platform.fly.dev"
}

# Summary
Write-ColorOutput Cyan ""
Write-ColorOutput Cyan "=========================================="
Write-ColorOutput Green "All Deployments Complete!"
Write-ColorOutput Cyan "=========================================="
Write-ColorOutput Cyan ""
Write-ColorOutput Cyan "Deployment Summary:"
if (-not $SkipRailway) {
    Write-ColorOutput Cyan "  - Railway: https://$railwayDomain"
}
if (-not $SkipVercel) {
    Write-ColorOutput Cyan "  - Vercel: https://stampcoin-platform.vercel.app"
}
if (-not $SkipFlyIO) {
    Write-ColorOutput Cyan "  - Fly.io: https://stampcoin-platform.fly.dev"
}
Write-ColorOutput Cyan ""
Write-ColorOutput Cyan "Next steps:"
Write-ColorOutput Cyan "  1. Test each deployment"
Write-ColorOutput Cyan "  2. Configure custom domains (optional)"
Write-ColorOutput Cyan "  3. Set up monitoring and analytics"
Write-ColorOutput Cyan "  4. Configure backup and scaling"
Write-ColorOutput Cyan ""
Write-ColorOutput Cyan "Files created:"
Write-ColorOutput Cyan "  - deployment-secrets.txt (contains your secrets)"
Write-ColorOutput Cyan "  - database-url.txt (contains DATABASE_URL)"
Write-ColorOutput Cyan ""
Write-ColorOutput Yellow "IMPORTANT: Keep these files secure and do not commit them to version control!"
Write-ColorOutput Cyan ""
