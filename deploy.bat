@echo off
REM Stampcoin Platform - Windows Quick Deploy Script

setlocal enabledelayedexpansion

echo.
echo ========================================
echo  Stampcoin Platform Deployment
echo ========================================
echo.

REM Check prerequisites
echo Checking prerequisites...

where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Docker not found. Please install Docker Desktop.
    pause
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js not found. Please install Node.js 18+.
    pause
    exit /b 1
)

echo OK - Docker and Node.js found
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: npm install failed
    pause
    exit /b 1
)
echo OK - Dependencies installed
echo.

REM Build Docker image
echo Building Docker image...
call docker build -t stampcoin-platform:latest .
if %ERRORLEVEL% NEQ 0 (
    echo Error: Docker build failed
    pause
    exit /b 1
)
echo OK - Docker image built
echo.

REM Ask for deployment platform
echo Select deployment target:
echo 1 - Local Docker Compose
echo 2 - Fly.io
echo 3 - Render.com
echo 4 - Exit
echo.

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo Starting with Docker Compose...
    call docker compose up -d
    echo OK - App running on http://localhost:8080
    echo Health check: curl http://localhost:8080/health
) else if "%choice%"=="2" (
    echo Deploying to Fly.io...
    where flyctl >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Error: Fly CLI not found. Install with: choco install flyctl
        pause
        exit /b 1
    )
    
    set /p app_name="Enter app name (stampcoin-platform): "
    if "!app_name!"=="" set app_name=stampcoin-platform
    
    call flyctl launch --name !app_name!
    
    set /p sync_token="Enter SYNC_TOKEN (leave blank to generate): "
    if "!sync_token!"=="" (
        for /f "delims=" %%i in ('powershell -Command "[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))"') do set sync_token=%%i
    )
    
    call flyctl secrets set SYNC_TOKEN=!sync_token!
    echo OK - App deployed to Fly.io
    echo View dashboard: flyctl open
) else if "%choice%"=="3" (
    echo Opening Render deployment...
    echo 1. Go to https://render.com/dashboard
    echo 2. Click 'New +' / 'Web Service'
    echo 3. Connect your GitHub repo
    echo 4. Configure as per DEPLOYMENT.md
    start https://render.com/dashboard
) else if "%choice%"=="4" (
    echo Cancelled.
    exit /b 0
) else (
    echo Invalid choice
    exit /b 1
)

echo.
echo Deployment complete!
echo.
pause
