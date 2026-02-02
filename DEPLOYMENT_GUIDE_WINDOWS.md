# StampCoin Platform - Windows Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Cloud Deployment Options](#cloud-deployment-options)
3. [Database Setup Options](#database-setup-options)

---

## Local Development Setup

### Prerequisites
- Node.js 22+ (already installed: v24.12.0)
- pnpm 10+ (already installed: 10.4.1)
- MySQL 8+ OR SQLite OR Cloud Database

### Option 1: Using Cloud Database (Recommended for Local Dev)

#### Step 1: Create a Free MySQL Database

**Option A: PlanetScale (Free)**
1. Go to https://planetscale.com/
2. Sign up for a free account
3. Create a new database named "stampcoin"
4. Get the connection string from the dashboard
5. Copy the DATABASE_URL

**Option B: Railway (Free tier available)**
1. Go to https://railway.app/
2. Sign up for a free account
3. Create a new project
4. Add a MySQL database service
5. Get the DATABASE_URL from the database service

**Option C: Render (Free tier available)**
1. Go to https://render.com/
2. Sign up for a free account
3. Create a new PostgreSQL database (free tier)
4. Get the DATABASE_URL

#### Step 2: Configure Environment Variables

1. Create a `.env` file in the project root (already created from `.env.local.example`)
2. Update the DATABASE_URL with your cloud database connection string:
   ```env
   DATABASE_URL=mysql://user:password@host:3306/database
   ```

#### Step 3: Initialize Database

```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
pnpm db:push
```

#### Step 4: Run Development Server

```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
pnpm dev
```

The application will be available at http://localhost:3000

---

## Cloud Deployment Options

### Option 1: Railway Deployment (Recommended)

#### Prerequisites
- Railway account (free tier available)
- Git repository with the project

#### Deployment Steps

**Method 1: Using Railway CLI**

1. Install Railway CLI:
   ```powershell
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```powershell
   railway login
   ```

3. Initialize or link project:
   ```powershell
   railway init
   # or
   railway link
   ```

4. Add MySQL database:
   ```powershell
   railway add mysql
   ```

5. Deploy:
   ```powershell
   railway up
   ```

**Method 2: Using Railway Dashboard**

1. Go to https://railway.app/
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select the StampCoin Platform repository
6. Railway will automatically detect the Dockerfile and deploy
7. Add environment variables in the project settings
8. Add a MySQL database service
9. Update the DATABASE_URL environment variable

### Option 2: Render Deployment

#### Prerequisites
- Render account (free tier available)
- Git repository with the project

#### Deployment Steps

1. Go to https://render.com/
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure build settings:
   - Build Command: `pnpm build && pnpm build:frontend`
   - Start Command: `node dist/index.js`
6. Add environment variables
7. Create a PostgreSQL database
8. Update the DATABASE_URL environment variable
9. Deploy

### Option 3: Vercel Deployment

#### Prerequisites
- Vercel account (free tier available)
- Git repository with the project
- External database (PlanetScale, Railway, etc.)

#### Deployment Steps

1. Go to https://vercel.com/
2. Click "New Project"
3. Import your Git repository
4. Configure build settings:
   - Framework Preset: Other
   - Build Command: `pnpm build && pnpm build:frontend`
   - Output Directory: `dist`
5. Add environment variables
6. Deploy

### Option 4: Fly.io Deployment

#### Prerequisites
- Fly.io account (free tier available)
- Fly.io CLI installed

#### Deployment Steps

1. Install Fly.io CLI:
   ```powershell
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. Login:
   ```powershell
   fly auth login
   ```

3. Initialize:
   ```powershell
   fly launch
   ```

4. Deploy:
   ```powershell
   fly deploy
   ```

---

## Database Setup Options

### Option 1: Cloud MySQL (Recommended)

See [Local Development Setup - Option 1](#option-1-using-cloud-database-recommended-for-local-dev)

### Option 2: Local MySQL Installation

#### Install MySQL on Windows

1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Select "Developer Default" setup type
4. Complete the installation
5. Set root password during installation
6. Create a database:
   ```sql
   CREATE DATABASE stampcoin;
   CREATE USER 'stampcoin'@'localhost' IDENTIFIED BY 'stampcoin123';
   GRANT ALL PRIVILEGES ON stampcoin.* TO 'stampcoin'@'localhost';
   FLUSH PRIVILEGES;
   ```

7. Update `.env` file:
   ```env
   DATABASE_URL=mysql://stampcoin:stampcoin123@localhost:3306/stampcoin
   ```

### Option 3: SQLite (For Local Development Only)

#### Modify Project to Use SQLite

1. Install SQLite dependencies:
   ```powershell
   pnpm add better-sqlite3
   pnpm add -D @types/better-sqlite3
   ```

2. Create SQLite database configuration:
   - Modify `server/db.ts` to use SQLite instead of MySQL
   - Update Drizzle schema to use SQLite dialect

3. Update `.env` file:
   ```env
   DATABASE_URL=file:./stampcoin.db
   ```

4. Initialize database:
   ```powershell
   pnpm db:push
   ```

---

## Quick Start Commands

### Local Development with Cloud Database
```powershell
# 1. Set up cloud database and get DATABASE_URL
# 2. Update .env file
# 3. Initialize database
pnpm db:push

# 4. Run development server
pnpm dev
```

### Build for Production
```powershell
# Build frontend and backend
pnpm build:frontend
pnpm build

# Start production server
pnpm start
```

### Deploy to Railway
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add database
railway add mysql

# Deploy
railway up
```

---

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   - The server will automatically find an available port
   - Check the console output for the actual port being used

2. **Database connection failed**
   - Verify DATABASE_URL is correct
   - Check if database is running
   - Verify network connectivity

3. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
   - Check Node.js version: `node --version` (should be 22+)
   - Check pnpm version: `pnpm --version` (should be 10+)

4. **Windows-specific issues**
   - Make sure you're using PowerShell or Command Prompt
   - Some bash scripts won't work on Windows
   - Use the Windows-compatible commands provided in this guide

---

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Fly.io Documentation](https://fly.io/docs/)
- [PlanetScale Documentation](https://docs.planetscale.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## Support

For issues or questions:
- Email: stampcoin.contact@gmail.com
- GitHub Issues: https://github.com/AzadZedan/Stampcoin-platform/issues
