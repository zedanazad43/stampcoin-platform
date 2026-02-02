# StampCoin Platform - Manual Deployment Guide

This guide provides step-by-step instructions for deploying to Railway, Vercel, and Fly.io.

## Prerequisites

Before starting, make sure you have:
- Railway CLI installed (v4.23.2)
- Vercel CLI installed (v50.4.5)
- Fly.io CLI installed (v0.4.0)
- Node.js installed (v24.12.0)
- pnpm installed (v10.4.1)

---

## Part 1: Railway Deployment

### Step 1: Login to Railway

Open PowerShell and run:
```powershell
railway login
```

This will open your browser. Follow the prompts to authenticate with Railway.

### Step 2: Initialize Railway Project

```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
railway init
```

Follow the prompts:
- Select "Create new project"
- Choose a project name (e.g., "stampcoin-platform")

### Step 3: Add MySQL Database

```powershell
railway add mysql
```

Wait for the database to initialize (about 30 seconds).

### Step 4: Generate and Set Environment Variables

Generate secure secrets (you can use an online generator or PowerShell):
```powershell
# Generate JWT_SECRET
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$jwtSecret = [System.Convert]::ToBase64String($bytes)
Write-Host "JWT_SECRET: $jwtSecret"

# Generate SESSION_SECRET
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$sessionSecret = [System.Convert]::ToBase64String($bytes)
Write-Host "SESSION_SECRET: $sessionSecret"
```

Set environment variables:
```powershell
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set JWT_SECRET=your-jwt-secret-here
railway variables set SESSION_SECRET=your-session-secret-here
```

### Step 5: Deploy to Railway

```powershell
railway up
```

Wait for the deployment to complete. Your application will be available at:
`https://<your-project-name>.up.railway.app`

### Step 6: Verify Deployment

```powershell
railway status
railway logs
railway open
```

---

## Part 2: Vercel Deployment

### Step 1: Login to Vercel

```powershell
vercel login
```

This will open your browser. Follow the prompts to authenticate with Vercel.

### Step 2: Set Up External Database

Vercel doesn't provide a database service. Choose one of the following:

#### Option A: PlanetScale (Free)
1. Go to https://planetscale.com/
2. Sign up and create a database named "stampcoin"
3. Get the DATABASE_URL from the dashboard

#### Option B: Railway
1. Create a new Railway project
2. Add a MySQL database
3. Get the DATABASE_URL from the database service

#### Option C: Render
1. Go to https://render.com/
2. Create a PostgreSQL database
3. Get the DATABASE_URL

### Step 3: Deploy to Vercel

```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
vercel
```

Follow the prompts:
- Set up and deploy? [Y/n] Y
- Which scope? (select your account)
- Link to existing project? [y/N] N
- Project name? stampcoin-platform
- Override settings? [y/N] N

### Step 4: Add Environment Variables

Go to Vercel dashboard:
1. Visit https://vercel.com/dashboard
2. Select your project
3. Go to Settings > Environment Variables

Add the following variables:
```
DATABASE_URL=your-database-url
NODE_ENV=production
PORT=3000
JWT_SECRET=your-jwt-secret-here
SESSION_SECRET=your-session-secret-here
```

### Step 5: Deploy to Production

```powershell
vercel --prod
```

Your application will be available at:
`https://stampcoin-platform.vercel.app`

### Step 6: Verify Deployment

```powershell
vercel list
vercel logs
```

---

## Part 3: Fly.io Deployment

### Step 1: Login to Fly.io

```powershell
fly auth login
```

This will open your browser. Follow the prompts to authenticate with Fly.io.

### Step 2: Initialize Fly.io Project

```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
fly launch
```

Follow the prompts:
- App Name? stampcoin-platform
- Organization? (select your account)
- Region? (choose a region close to you)
- Deploy now? [y/N] N

### Step 3: Create PostgreSQL Database

```powershell
fly postgres create
```

Follow the prompts to create the database.

### Step 4: Attach Database to App

```powershell
fly postgres attach --app stampcoin-platform
```

This will automatically set the DATABASE_URL environment variable.

### Step 5: Set Environment Variables

```powershell
fly secrets set JWT_SECRET=your-jwt-secret-here
fly secrets set SESSION_SECRET=your-session-secret-here
```

### Step 6: Deploy to Fly.io

```powershell
fly deploy
```

Wait for the deployment to complete. Your application will be available at:
`https://stampcoin-platform.fly.dev`

### Step 7: Verify Deployment

```powershell
fly status
fly logs
fly open
```

---

## Part 4: Post-Deployment Configuration

### For All Platforms:

1. **Test Your Application**
   - Visit your deployment URLs
   - Test all features
   - Check database connectivity

2. **Configure Custom Domains (Optional)**
   - Add your domain to the platform dashboard
   - Update DNS records
   - Wait for SSL certificate

3. **Set Up Monitoring**
   - Configure error tracking
   - Set up uptime monitoring
   - Configure analytics

4. **Configure Backups**
   - Set up database backups
   - Configure backup retention
   - Test restore process

5. **Scale as Needed**
   - Monitor resource usage
   - Adjust scaling settings
   - Configure auto-scaling

---

## Part 5: Troubleshooting

### Railway Issues

**Deployment fails**
```powershell
railway logs
railway up
```

**Database connection issues**
```powershell
railway variables
# Verify DATABASE_URL is correct
```

### Vercel Issues

**Build fails**
```powershell
vercel --force
```

**Environment variables not working**
- Check Vercel dashboard > Settings > Environment Variables
- Ensure variables are set for production environment

### Fly.io Issues

**Database connection issues**
```powershell
fly postgres list
fly postgres attach --app stampcoin-platform
```

**Deployment fails**
```powershell
fly logs
fly deploy
```

---

## Part 6: Maintenance Commands

### Railway
```powershell
railway status        # View status
railway logs          # View logs
railway up            # Redeploy
railway open          # Open in browser
railway variables     # View environment variables
```

### Vercel
```powershell
vercel list           # View deployments
vercel logs           # View logs
vercel                # Deploy to preview
vercel --prod         # Deploy to production
```

### Fly.io
```powershell
fly status            # View status
fly logs              # View logs
fly deploy            # Redeploy
fly open              # Open in browser
fly secrets list      # View secrets
```

---

## Part 7: Platform Comparison

| Feature | Railway | Vercel | Fly.io |
|---------|---------|--------|--------|
| Free Tier | Yes | Yes | Yes |
| Database Included | Yes | No | Yes |
| Easy Setup | Yes | Yes | Yes |
| Custom Domains | Yes | Yes | Yes |
| SSL/HTTPS | Yes | Yes | Yes |
| Auto-scaling | Yes | Yes | Yes |
| Global CDN | Yes | Yes | Yes |

---

## Part 8: Recommended Strategy

1. **Primary Deployment**: Railway
   - Easiest to set up
   - Includes database
   - Good free tier

2. **Backup Deployment**: Fly.io
   - Good alternative
   - Includes database
   - Good performance

3. **Frontend-Only**: Vercel
   - Best for static frontend
   - Requires external database
   - Excellent CDN

---

## Part 9: Support

If you encounter issues:
- Email: stampcoin.contact@gmail.com
- GitHub Issues: https://github.com/AzadZedan/Stampcoin-platform/issues

---

## Part 10: Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Fly.io Documentation](https://fly.io/docs/)
- [PlanetScale Documentation](https://docs.planetscale.com/)

---

**Happy deploying!**
