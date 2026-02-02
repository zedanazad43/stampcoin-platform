# StampCoin Platform - Quick Start Guide (Windows)

## 🚀 Quick Start Options

### Option 1: Run Locally with Cloud Database (Recommended)

#### Step 1: Set Up Cloud Database

**Choose one of the following free options:**

**A. PlanetScale**
1. Go to https://planetscale.com/
2. Sign up and create a database named "stampcoin"
3. Get the DATABASE_URL from the dashboard

**B. Railway**
1. Go to https://railway.app/
2. Create a new project
3. Add a MySQL database
4. Get the DATABASE_URL from the database service

**C. Render**
1. Go to https://render.com/
2. Create a PostgreSQL database
3. Get the DATABASE_URL

#### Step 2: Configure Environment

1. Open the `.env` file in the project root
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
pnpm dev
```

Your application will be available at http://localhost:3000

---

### Option 2: Deploy to Cloud (Recommended)

#### Choose Your Platform:

**A. Railway (Easiest)**
```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
.\deploy-railway.ps1
```

**B. Render**
```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
.\deploy-render.ps1
```

**C. Vercel**
```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
.\deploy-vercel.ps1
```

**D. Fly.io**
```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
.\deploy-flyio.ps1
```

---

## 📋 Common Commands

### Local Development

```powershell
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
pnpm build:frontend

# Start production server
pnpm start

# Type check
pnpm check

# Format code
pnpm format

# Run tests
pnpm test
```

### Database

```powershell
# Push database schema
pnpm db:push

# Initialize archive
pnpm init:archive

# Export stamps
pnpm export:stamps
```

---

## 🔧 Troubleshooting

### Port 3000 Already in Use

The server will automatically find an available port. Check the console output for the actual port.

### Database Connection Failed

1. Verify DATABASE_URL is correct
2. Check if database is running
3. Verify network connectivity

### Build Errors

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
pnpm install
```

### Windows-Specific Issues

1. Make sure you're using PowerShell
2. Some bash scripts won't work on Windows
3. Use the Windows-compatible scripts provided

---

## 📚 Additional Resources

- [Full Deployment Guide](DEPLOYMENT_GUIDE_WINDOWS.md)
- [Railway Deployment](deploy-railway.ps1)
- [Render Deployment](deploy-render.ps1)
- [Vercel Deployment](deploy-vercel.ps1)
- [Fly.io Deployment](deploy-flyio.ps1)

---

## ❓ Need Help?

- Email: stampcoin.contact@gmail.com
- GitHub Issues: https://github.com/AzadZedan/Stampcoin-platform/issues

---

## 🎯 What's Next?

1. **Explore the Platform**
   - Visit http://localhost:3000 (or your cloud URL)
   - Browse the stamp collection
   - Test the marketplace features

2. **Customize**
   - Update the branding
   - Add your own stamps
   - Configure payment providers

3. **Deploy to Production**
   - Choose a cloud platform
   - Follow the deployment guide
   - Configure custom domain

4. **Monitor and Scale**
   - Set up monitoring
   - Configure analytics
   - Scale as needed

---

**Happy deploying! 🚀**
