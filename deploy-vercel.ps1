# Stampcoin Platform - Vercel Deployment Guide (Windows PowerShell)
# ============================================

Write-Host "🚀 Stampcoin Platform - Vercel Deployment Guide" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will guide you through deploying to Vercel.com" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Prerequisites:" -ForegroundColor Cyan
Write-Host "1. A Vercel account (free tier available)" -ForegroundColor White
Write-Host "2. A Git repository with the Stampcoin Platform code" -ForegroundColor White
Write-Host "3. Your repository pushed to GitHub/GitLab/Bitbucket" -ForegroundColor White
Write-Host "4. An external database (PlanetScale, Railway, Render, etc.)" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 1: Create Vercel Account" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com/" -ForegroundColor White
Write-Host "2. Sign up for a free account" -ForegroundColor White
Write-Host "3. Verify your email address" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 2: Install Vercel CLI" -ForegroundColor Cyan
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Installing Vercel CLI..."
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Step 3: Login to Vercel" -ForegroundColor Cyan
Write-Host "Running: vercel login" -ForegroundColor White
vercel login

Write-Host ""
Write-Host "📦 Step 4: Deploy to Vercel" -ForegroundColor Cyan
Write-Host "Running: vercel" -ForegroundColor White
Write-Host ""
Write-Host "Follow the prompts:" -ForegroundColor Yellow
Write-Host "? Set up and deploy '~/path/to/project'? [Y/n] Y" -ForegroundColor White
Write-Host "? Which scope do you want to deploy to? (select your account)" -ForegroundColor White
Write-Host "? Link to existing project? [y/N] N" -ForegroundColor White
Write-Host "? What's your project's name? stampcoin-platform" -ForegroundColor White
Write-Host "? In which directory is your code located? ./ (or press Enter)" -ForegroundColor White
Write-Host "? Want to override the settings? [y/N] N" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 5: Configure Build Settings" -ForegroundColor Cyan
Write-Host "After initial deployment, configure:" -ForegroundColor White
Write-Host ""
Write-Host "Framework Preset: Other" -ForegroundColor Yellow
Write-Host "Build Command: pnpm build && pnpm build:frontend" -ForegroundColor Yellow
Write-Host "Output Directory: dist" -ForegroundColor Yellow
Write-Host "Install Command: pnpm install" -ForegroundColor Yellow
Write-Host ""

Write-Host "📦 Step 6: Add Environment Variables" -ForegroundColor Cyan
Write-Host "Add the following environment variables in Vercel dashboard:" -ForegroundColor White
Write-Host ""
Write-Host "Required:" -ForegroundColor Yellow
Write-Host "DATABASE_URL: (your external database connection string)" -ForegroundColor Yellow
Write-Host "NODE_ENV: production" -ForegroundColor Yellow
Write-Host "PORT: 3000" -ForegroundColor Yellow
Write-Host "JWT_SECRET: (generate a secure random string)" -ForegroundColor Yellow
Write-Host "SESSION_SECRET: (generate a secure random string)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Optional (if needed):" -ForegroundColor Yellow
Write-Host "STRIPE_SECRET_KEY: (your Stripe secret key)" -ForegroundColor White
Write-Host "STRIPE_PUBLISHABLE_KEY: (your Stripe publishable key)" -ForegroundColor White
Write-Host "STRIPE_WEBHOOK_SECRET: (your Stripe webhook secret)" -ForegroundColor White
Write-Host "AWS_ACCESS_KEY_ID: (your AWS access key)" -ForegroundColor White
Write-Host "AWS_SECRET_ACCESS_KEY: (your AWS secret key)" -ForegroundColor White
Write-Host "AWS_REGION: us-east-1" -ForegroundColor White
Write-Host "AWS_S3_BUCKET: (your S3 bucket name)" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 7: Set Up External Database" -ForegroundColor Cyan
Write-Host "Vercel doesn't provide a database service. Use one of:" -ForegroundColor White
Write-Host ""
Write-Host "Option A: PlanetScale (Free)" -ForegroundColor Yellow
Write-Host "1. Go to https://planetscale.com/" -ForegroundColor White
Write-Host "2. Create a free account and database" -ForegroundColor White
Write-Host "3. Get the DATABASE_URL" -ForegroundColor White
Write-Host "4. Add it to Vercel environment variables" -ForegroundColor White
Write-Host ""
Write-Host "Option B: Railway (Free tier available)" -ForegroundColor Yellow
Write-Host "1. Go to https://railway.app/" -ForegroundColor White
Write-Host "2. Create a free account and MySQL database" -ForegroundColor White
Write-Host "3. Get the DATABASE_URL" -ForegroundColor White
Write-Host "4. Add it to Vercel environment variables" -ForegroundColor White
Write-Host ""
Write-Host "Option C: Render (Free tier available)" -ForegroundColor Yellow
Write-Host "1. Go to https://render.com/" -ForegroundColor White
Write-Host "2. Create a free account and PostgreSQL database" -ForegroundColor White
Write-Host "3. Get the DATABASE_URL" -ForegroundColor White
Write-Host "4. Add it to Vercel environment variables" -ForegroundColor White
Write-Host ""

Write-Host "📦 Step 8: Redeploy with Environment Variables" -ForegroundColor Cyan
Write-Host "After adding environment variables:" -ForegroundColor White
Write-Host "1. Go to Vercel dashboard" -ForegroundColor White
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Click 'Redeploy'" -ForegroundColor White
Write-Host "4. Or run: vercel --prod" -ForegroundColor White
Write-Host ""

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Your application will be available at: https://stampcoin-platform.vercel.app" -ForegroundColor White
Write-Host "2. Configure a custom domain (optional)" -ForegroundColor White
Write-Host "3. Set up automatic deployments from your git repository" -ForegroundColor White
Write-Host "4. Monitor your application using Vercel's dashboard" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "Deploy to preview: vercel" -ForegroundColor White
Write-Host "Deploy to production: vercel --prod" -ForegroundColor White
Write-Host "View logs: vercel logs" -ForegroundColor White
Write-Host "View deployments: vercel list" -ForegroundColor White
Write-Host ""

Write-Host "📚 Additional Resources:" -ForegroundColor Cyan
Write-Host "Vercel Documentation: https://vercel.com/docs" -ForegroundColor White
Write-Host "Environment Variables: https://vercel.com/docs/projects/environment-variables" -ForegroundColor White
Write-Host "Custom Domains: https://vercel.com/docs/custom-domains" -ForegroundColor White
Write-Host ""

Write-Host "❓ Need Help?" -ForegroundColor Yellow
Write-Host "Email: stampcoin.contact@gmail.com" -ForegroundColor White
Write-Host "GitHub Issues: https://github.com/AzadZedan/Stampcoin-platform/issues" -ForegroundColor White
Write-Host ""
