# Railway Deployment Guide for StampCoin Platform

This guide will walk you through deploying your StampCoin Platform to Railway.

## Prerequisites

Before you begin, make sure you have:

1. **Railway Account**: Create an account at [railway.app](https://railway.app)
2. **Railway CLI**: Install the Railway CLI
   ```powershell
   npm install -g @railway/cli
   ```
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Login to Railway

```powershell
railway login
```

This will open a browser window where you can authenticate with Railway.

## Step 2: Initialize Railway Project

If this is your first time deploying to Railway:

```powershell
railway init
```

This will create a new Railway project and link it to your current directory.

If you already have a Railway project:

```powershell
railway link
```

This will link your current directory to an existing Railway project.

## Step 3: Add MySQL Database

```powershell
railway add mysql
```

This will add a MySQL database to your Railway project.

## Step 4: Configure Environment Variables

Railway will automatically set some environment variables, but you need to add additional ones:

### Get the Database URL

```powershell
railway variables get DATABASE_URL
```

### Add Required Environment Variables

```powershell
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set JWT_SECRET=your-jwt-secret-here
railway variables set SESSION_SECRET=your-session-secret-here
```

### Add Additional Environment Variables (if needed)

Based on your application, you may need to add:

```powershell
# Stripe (if using Stripe payments)
railway variables set STRIPE_SECRET_KEY=your-stripe-secret-key
railway variables set STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# AWS S3 (if using S3 storage)
railway variables set AWS_ACCESS_KEY_ID=your-aws-access-key
railway variables set AWS_SECRET_ACCESS_KEY=your-aws-secret-key
railway variables set AWS_REGION=your-aws-region
railway variables set AWS_S3_BUCKET=your-s3-bucket-name

# IPFS (if using IPFS)
railway variables set IPFS_GATEWAY_URL=your-ipfs-gateway-url
railway variables set IPFS_API_KEY=your-ipfs-api-key

# OAuth (if using OAuth)
railway variables set GOOGLE_CLIENT_ID=your-google-client-id
railway variables set GOOGLE_CLIENT_SECRET=your-google-client-secret
railway variables set GITHUB_CLIENT_ID=your-github-client-id
railway variables set GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Step 5: Deploy to Railway

```powershell
railway up
```

This will:
1. Build your application using the Dockerfile
2. Deploy it to Railway
3. Start your application

## Step 6: Monitor Deployment

You can monitor your deployment in real-time:

```powershell
railway logs
```

## Step 7: Get Your Application URL

```powershell
railway domain
```

This will show you the URL where your application is deployed.

## Step 8: Verify Deployment

Open your application URL in a browser and check:

1. **Health Check**: Visit `https://your-app-url.railway.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`
2. **Main Page**: Visit `https://your-app-url.railway.app/`
   - Should show your StampCoin Platform

## Troubleshooting

### Build Fails

Check the build logs:
```powershell
railway logs
```

Common issues:
- **Dependencies**: Make sure all dependencies are listed in package.json
- **Build Scripts**: Ensure build scripts work locally
- **Dockerfile**: Verify Dockerfile is correct

### Application Won't Start

Check the application logs:
```powershell
railway logs
```

Common issues:
- **Port**: Ensure PORT environment variable is set
- **Database**: Check DATABASE_URL is correct
- **Environment Variables**: Verify all required variables are set

### Database Connection Issues

1. Check DATABASE_URL:
   ```powershell
   railway variables get DATABASE_URL
   ```

2. Verify database is running:
   ```powershell
   railway status
   ```

3. Check database logs:
   ```powershell
   railway logs --service mysql
   ```

## Updating Your Deployment

After making changes to your code:

```powershell
railway up
```

This will rebuild and redeploy your application.

## Scaling Your Application

To scale your application:

```powershell
railway scale
```

This will allow you to add more instances or increase resources.

## Setting Up Custom Domain

1. Go to your Railway project in the browser
2. Click on your service
3. Go to "Settings" > "Domains"
4. Add your custom domain
5. Update your DNS records

## Monitoring and Logs

View logs:
```powershell
railway logs
```

View metrics:
- Go to your Railway project in the browser
- Click on your service
- Go to "Metrics"

## Database Management

### Access Database Shell

```powershell
railway mysql
```

### Backup Database

```powershell
railway backup
```

### Restore Database

```powershell
railway restore <backup-id>
```

## Environment Variables Management

List all variables:
```powershell
railway variables
```

Get a specific variable:
```powershell
railway variables get VARIABLE_NAME
```

Set a variable:
```powershell
railway variables set VARIABLE_NAME=value
```

Delete a variable:
```powershell
railway variables delete VARIABLE_NAME
```

## Best Practices

1. **Environment Variables**: Never commit secrets to your repository
2. **Database**: Use Railway's managed MySQL for production
3. **Logs**: Monitor logs regularly for issues
4. **Backups**: Set up regular database backups
5. **Scaling**: Scale based on traffic and performance needs

## Next Steps

After successful deployment:

1. **Set up monitoring**: Configure alerts for errors and performance issues
2. **Set up backups**: Configure automatic database backups
3. **Configure custom domain**: Set up your custom domain
4. **Set up CI/CD**: Configure automatic deployments on push
5. **Monitor performance**: Use Railway's metrics to monitor performance

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Reference](https://docs.railway.app/reference/cli)
- [StampCoin Platform Documentation](./README.md)

## Support

If you encounter issues:

1. Check Railway logs: `railway logs`
2. Check Railway status: https://status.railway.app
3. Contact Railway support: https://railway.app/support
4. Check StampCoin Platform documentation

## Quick Reference

```powershell
# Login
railway login

# Initialize project
railway init

# Link to existing project
railway link

# Add database
railway add mysql

# Set environment variables
railway variables set KEY=value

# Deploy
railway up

# View logs
railway logs

# Get domain
railway domain

# Scale
railway scale

# Access database
railway mysql

# Backup database
railway backup

# Restore database
railway restore <backup-id>
```

## Success Criteria

Your deployment is successful when:

✅ Application builds without errors
✅ Application starts and runs without errors
✅ Health check endpoint returns `{"status":"ok"}`
✅ Main page loads correctly
✅ Database connection works
✅ All features work as expected

Congratulations! Your StampCoin Platform is now deployed on Railway! 🎉
