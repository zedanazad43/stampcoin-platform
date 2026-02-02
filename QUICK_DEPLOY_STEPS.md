# Quick Deployment Steps - StampCoin Platform

## Current Status
- [x] Vercel CLI installed and authenticated
- [ ] Database setup needed
- [ ] Railway deployment
- [ ] Vercel deployment completion
- [ ] Fly.io deployment

---

## Step 1: Set Up Database (Choose One Option)

### Option A: Railway (Recommended - Fastest)

1. **Login to Railway** (if not already logged in):
   ```powershell
   railway login
   ```

2. **Create Railway Project**:
   ```powershell
   railway init
   ```
   - Choose "Create new project"
   - Name it "stampcoin-platform-db"

3. **Add MySQL Database**:
   ```powershell
   railway add mysql
   ```
   - Wait 30 seconds for database to initialize

4. **Get DATABASE_URL**:
   ```powershell
   railway variables get DATABASE_URL
   ```
   - Copy this URL for Vercel deployment

### Option B: PlanetScale (Free)

1. Go to https://planetscale.com/
2. Sign up and create a database named "stampcoin"
3. Get the DATABASE_URL from the dashboard

### Option C: Render (Free)

1. Go to https://render.com/
2. Create a PostgreSQL database
3. Get the DATABASE_URL

---

## Step 2: Complete Vercel Deployment

Now that you have your DATABASE_URL:

1. **Paste the DATABASE_URL** when prompted by Vercel

2. **Follow the Vercel prompts**:
   - Set up and deploy? [Y/n] Y
   - Which scope? (select your account)
   - Link to existing project? [y/N] N
   - Project name? stampcoin-platform
   - Override settings? [y/N] N

3. **Add Environment Variables**:
   Go to Vercel dashboard > Your Project > Settings > Environment Variables

   Add:
   ```
   DATABASE_URL=your-database-url
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=generate-secure-random-string
   SESSION_SECRET=generate-secure-random-string
   ```

4. **Deploy to Production**:
   ```powershell
   vercel --prod
   ```

5. **Verify Deployment**:
   - Visit https://stampcoin-platform.vercel.app
   - Test application functionality

---

## Step 3: Deploy to Railway (Full Application)

If you used Railway for the database, you can deploy the full application there too:

1. **Add Environment Variables**:
   ```powershell
   railway variables set NODE_ENV=production
   railway variables set PORT=3000
   railway variables set JWT_SECRET=your-secure-random-string
   railway variables set SESSION_SECRET=your-secure-random-string
   ```

2. **Deploy to Railway**:
   ```powershell
   railway up
   ```

3. **Verify Deployment**:
   ```powershell
   railway open
   ```

---

## Step 4: Deploy to Fly.io

1. **Login to Fly.io**:
   ```powershell
   fly auth login
   ```

2. **Initialize Project**:
   ```powershell
   fly launch
   ```
   - App Name? stampcoin-platform
   - Organization? (select your account)
   - Region? (choose closest region)
   - Deploy now? [y/N] N

3. **Create PostgreSQL Database**:
   ```powershell
   fly postgres create
   ```

4. **Attach Database**:
   ```powershell
   fly postgres attach --app stampcoin-platform
   ```

5. **Set Environment Variables**:
   ```powershell
   fly secrets set JWT_SECRET=your-secure-random-string
   fly secrets set SESSION_SECRET=your-secure-random-string
   ```

6. **Deploy**:
   ```powershell
   fly deploy
   ```

7. **Verify Deployment**:
   ```powershell
   fly open
   ```

---

## Step 5: Generate Secure Secrets

Use this PowerShell command to generate secure secrets:

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$secret = [System.Convert]::ToBase64String($bytes)
Write-Host "Your secure secret: $secret"
```

Run this twice to get:
- JWT_SECRET
- SESSION_SECRET

---

## Platform URLs After Deployment

Record your URLs here:

- Railway: https://<your-project-name>.up.railway.app
- Vercel: https://stampcoin-platform.vercel.app
- Fly.io: https://stampcoin-platform.fly.dev

---

## Quick Commands Reference

### Railway
```powershell
railway status      # View status
railway logs        # View logs
railway up          # Redeploy
railway open        # Open in browser
railway variables   # View environment variables
```

### Vercel
```powershell
vercel list         # View deployments
vercel logs         # View logs
vercel              # Deploy to preview
vercel --prod       # Deploy to production
```

### Fly.io
```powershell
fly status          # View status
fly logs            # View logs
fly deploy          # Redeploy
fly open            # Open in browser
fly secrets list    # View secrets
```

---

## Troubleshooting

### Vercel
- **Build fails**: Run `vercel --force`
- **Environment variables**: Check Vercel dashboard > Settings > Environment Variables

### Railway
- **Database issues**: Run `railway variables` to verify DATABASE_URL
- **Deployment fails**: Run `railway logs` to check errors

### Fly.io
- **Database issues**: Run `fly postgres list` and `fly postgres attach`
- **Deployment fails**: Run `fly logs` to check errors

---

## Support

- Email: stampcoin.contact@gmail.com
- GitHub Issues: https://github.com/AzadZedan/Stampcoin-platform/issues

---

**Next Steps:**
1. Set up your database (Step 1)
2. Complete Vercel deployment (Step 2)
3. Deploy to Railway (Step 3)
4. Deploy to Fly.io (Step 4)
5. Test all deployments
6. Configure custom domains (optional)
