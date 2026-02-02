# StampCoin Platform - Multi-Platform Deployment Guide

This guide will help you deploy the StampCoin Platform to Railway, Vercel, and Fly.io.

## 📋 Prerequisites

✅ Railway CLI (v4.23.2) - Installed
✅ Vercel CLI (v50.4.5) - Installed
✅ Fly.io CLI (v0.4.0) - Installed
✅ Node.js (v24.12.0) - Installed
✅ pnpm (v10.4.1) - Installed

---

## 🚀 Deployment Options

### Option 1: Railway Deployment (Recommended)

Railway is the easiest option as it provides both hosting and database services.

#### Step 1: Login to Railway

```powershell
railway login
```

This will open your browser to authenticate with Railway.

#### Step 2: Initialize Project

```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
railway init
```

Follow the prompts:
- Select "Create new project"
- Choose a project name (e.g., "stampcoin-platform")

#### Step 3: Add MySQL Database

```powershell
railway add mysql
```

Wait for the database to initialize (about 30 seconds).

#### Step 4: Get Database URL

```powershell
railway variables
```

Copy the DATABASE_URL value.

#### Step 5: Add Environment Variables

```powershell
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set JWT_SECRET=your-secure-random-string
railway variables set SESSION_SECRET=your-secure-random-string
```

#### Step 6: Deploy

```powershell
railway up
```

Your application will be deployed and available at:
`https://<your-project-name>.up.railway.app`

---

### Option 2: Vercel Deployment

Vercel is great for frontend deployment, but requires an external database.

#### Step 1: Login to Vercel

```powershell
vercel login
```

This will open your browser to authenticate with Vercel.

#### Step 2: Set Up External Database

Choose one of the following:

**A. PlanetScale (Free)**
1. Go to https://planetscale.com/
2. Create a database named "stampcoin"
3. Get the DATABASE_URL

**B. Railway**
1. Create a new Railway project
2. Add a MySQL database
3. Get the DATABASE_URL

#### Step 3: Deploy to Vercel

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

#### Step 4: Add Environment Variables

Go to Vercel dashboard > Your Project > Settings > Environment Variables

Add:
```
DATABASE_URL=your-database-url
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secure-random-string
SESSION_SECRET=your-secure-random-string
```

#### Step 5: Redeploy

```powershell
vercel --prod
```

Your application will be available at:
`https://stampcoin-platform.vercel.app`

---

### Option 3: Fly.io Deployment

Fly.io provides both hosting and database services.

#### Step 1: Login to Fly.io

```powershell
fly auth login
```

This will open your browser to authenticate with Fly.io.

#### Step 2: Initialize Project

```powershell
cd "c:\Users\azadz\OneDrive\المستندات\stampcoin-platform\Stampcoin-platform.worktrees\Compare-&-pull-request"
fly launch
```

Follow the prompts:
- App Name? stampcoin-platform
- Organization? (select your account)
- Region? (choose a region close to you)
- Deploy now? [y/N] N

#### Step 3: Create PostgreSQL Database

```powershell
fly postgres create
```

Follow the prompts to create the database.

#### Step 4: Attach Database to App

```powershell
fly postgres attach --app stampcoin-platform
```

This will automatically set the DATABASE_URL environment variable.

#### Step 5: Add Additional Environment Variables

```powershell
fly secrets set JWT_SECRET=your-secure-random-string
fly secrets set SESSION_SECRET=your-secure-random-string
```

#### Step 6: Deploy

```powershell
fly deploy
```

Your application will be available at:
`https://stampcoin-platform.fly.dev`

---

## 🔄 Managing Deployments

### Railway

```powershell
# View logs
railway logs

# View status
railway status

# Redeploy
railway up

# Open in browser
railway open
```

### Vercel

```powershell
# View logs
vercel logs

# View deployments
vercel list

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Fly.io

```powershell
# View logs
fly logs

# View status
fly status

# Redeploy
fly deploy

# Open in browser
fly open
```

---

## 📊 Platform Comparison

| Feature | Railway | Vercel | Fly.io |
|---------|---------|--------|--------|
| Free Tier | ✅ | ✅ | ✅ |
| Database Included | ✅ | ❌ | ✅ |
| Easy Setup | ✅ | ✅ | ✅ |
| Custom Domains | ✅ | ✅ | ✅ |
| SSL/HTTPS | ✅ | ✅ | ✅ |
| Auto-scaling | ✅ | ✅ | ✅ |
| Global CDN | ✅ | ✅ | ✅ |

---

## 🎯 Recommended Deployment Strategy

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

## 📝 Environment Variables Reference

### Required Variables

```
DATABASE_URL=your-database-connection-string
NODE_ENV=production
PORT=3000
JWT_SECRET=generate-secure-random-string
SESSION_SECRET=generate-secure-random-string
```

### Optional Variables

```
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

---

## 🔧 Troubleshooting

### Railway

**Issue: Deployment fails**
```powershell
# Check logs
railway logs

# Redeploy
railway up
```

### Vercel

**Issue: Build fails**
```powershell
# Clear cache and redeploy
vercel --force
```

### Fly.io

**Issue: Database connection fails**
```powershell
# Check database status
fly postgres list

# Reattach database
fly postgres attach --app stampcoin-platform
```

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Fly.io Documentation](https://fly.io/docs/)
- [PlanetScale Documentation](https://docs.planetscale.com/)

---

## ❓ Need Help?

- Email: stampcoin.contact@gmail.com
- GitHub Issues: https://github.com/AzadZedan/Stampcoin-platform/issues

---

**Happy deploying! 🚀**
