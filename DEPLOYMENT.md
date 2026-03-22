# Stampcoin Platform - Complete Deployment Guide

## Overview
Stampcoin Platform is a blockchain-powered marketplace for digital stamps with integrated wallet and token management. This guide covers deployment to multiple platforms.

## Prerequisites

### Local Development
- Node.js 18+ 
- Docker & Docker Compose
- Git

### Cloud Deployment
- Fly.io CLI: `brew install flyctl` (macOS) or `choco install flyctl` (Windows)
- Render account: https://render.com
- GitHub account with Actions enabled

## Project Structure

```
stampcoin-platform/
├── server.js              # Main Express server
├── wallet.js              # Wallet/balance management
├── market.js              # Marketplace logic
├── blockchain.js          # Token/blockchain simulation
├── public/                # Frontend assets (HTML, CSS, JS)
├── Dockerfile             # Production Docker image
├── docker-compose.yml     # Local development stack
├── fly.toml              # Fly.io configuration
├── render.yaml           # Render deployment config
└── .env.example          # Environment variables template
```

## Quick Start - Local Development

### 1. Clone and Setup
```bash
cd stampcoin-platform
cp .env.example .env
npm install
```

### 2. Run Locally
```bash
npm start
# Server runs on http://localhost:8080
```

### 3. Run with Docker Compose
```bash
docker compose up --pull always
# Access at http://localhost:8080
```

## Testing the APIs

### Health Check
```bash
curl http://localhost:8080/health
# Response: {"status":"ok","timestamp":"...","service":"Stampcoin Platform","version":"2.0.0"}
```

### Create a Wallet
```bash
curl -X POST http://localhost:8080/api/wallet/create \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","userName":"Alice"}'
```

### Get Wallet
```bash
curl http://localhost:8080/api/wallet/user1
```

### List Market Items
```bash
curl http://localhost:8080/api/market/items
```

### Get Token Info
```bash
curl http://localhost:8080/api/token
```

### Get Blockchain Info
```bash
curl http://localhost:8080/api/blockchain/info
```

### Mint Tokens (requires SYNC_TOKEN)
```bash
curl -X POST http://localhost:8080/api/blockchain/mint \
  -H "Authorization: Bearer your-sync-token" \
  -H "Content-Type: application/json" \
  -d '{"toAddress":"user1","amount":1000}'
```

## Cloud Deployment

### Option 1: Fly.io (Recommended)

#### First Deployment
```bash
# Install Fly CLI
flyctl auth signup  # or login if existing account

# Launch app
flyctl launch --name stampcoin-platform

# Follow prompts:
# - Region: Choose closest to users
# - Databases: No (unless adding PostgreSQL)
# - Deploy now: Yes
```

#### Set Secrets
```bash
flyctl secrets set SYNC_TOKEN=$(openssl rand -base64 32)
flyctl secrets set STP_CONTRACT_ADDRESS=0x...
flyctl secrets set ALLOWED_ORIGINS=https://stampcoin-platform.fly.dev
```

#### Redeploy after changes
```bash
flyctl deploy
```

#### Monitor
```bash
flyctl logs                 # View live logs
flyctl status              # Check app status
flyctl metrics             # View metrics
flyctl ssh console         # SSH into container
```

#### Scale
```bash
flyctl scale count=3       # Run 3 instances
flyctl scale memory=512    # Increase memory to 512MB
```

### Option 2: Render.com

#### First Deployment
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Enter:
   - **Name**: stampcoin-platform
   - **Runtime**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `NODE_ENV=production`
   - `SYNC_TOKEN=<strong-token>`
   - `STP_CONTRACT_ADDRESS=<address>`
6. Click "Deploy"

#### Update Environment
1. Dashboard → Service → Environment
2. Add or update variables
3. Changes auto-trigger redeploy

#### Manual Redeploy
```bash
curl --request POST \
  --url https://api.render.com/deploy/srv-<SERVICE_ID>?key=<API_KEY>
```

### Option 3: GitHub Pages (Frontend Only)

For static frontend hosting:
```bash
npm run build
# Push to gh-pages branch
git subtree push --prefix public origin gh-pages
```

## Environment Variables

Required for production:
```
NODE_ENV=production
PORT=8080
SYNC_TOKEN=<secure-random-token>
STP_CONTRACT_ADDRESS=0x1234...
ALLOWED_ORIGINS=https://your-domain.com
```

Generate SYNC_TOKEN:
```bash
openssl rand -base64 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Docker Deployment

### Build Image
```bash
docker build -t stampcoin-platform:latest .
```

### Run Container
```bash
docker run -d \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -e SYNC_TOKEN=<token> \
  --name stampcoin \
  stampcoin-platform:latest
```

### Docker Compose
```bash
docker compose up -d
docker compose logs -f              # View logs
docker compose down                 # Stop services
```

## CI/CD Pipeline

The `.github/workflows/deploy.yml` automatically:
1. Runs tests on every push
2. Builds Docker image
3. Pushes to GitHub Container Registry
4. Deploys to Fly.io on main branch
5. Triggers Render deployment

### GitHub Secrets Required
```
FLY_API_TOKEN          # From flyctl auth token
RENDER_API_KEY         # From Render dashboard
RENDER_SERVICE_ID      # Your Render service ID
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `SYNC_TOKEN`
- [ ] Configure `ALLOWED_ORIGINS` with your domain
- [ ] Set `STP_CONTRACT_ADDRESS` for blockchain operations
- [ ] Enable HTTPS (auto-handled by Fly.io/Render)
- [ ] Configure database if using persistent storage
- [ ] Set up monitoring/alerting
- [ ] Configure backups for data files
- [ ] Test all APIs with production token
- [ ] Set up CI/CD pipeline
- [ ] Monitor logs and health checks
- [ ] Configure SSL certificates

## Troubleshooting

### App won't start
```bash
# Check logs
docker logs stampcoin
# or
flyctl logs
```

### Port already in use
```bash
# Find and kill process using port 8080
lsof -i :8080
kill -9 <PID>
```

### CORS errors
```
Verify ALLOWED_ORIGINS includes your domain
curl -H "Origin: http://your-domain" http://localhost:8080/health
```

### Wallet/Market data not persisting
```
Ensure volumes are mounted:
docker compose up
# Check volume persistence
docker volume ls
```

### Docker image too large
```
Use multi-stage build (already configured)
Check .dockerignore for excluded files
```

## API Reference

Full API documentation: `GET /api/info`

### Core Endpoints
- **Wallet**: `/api/wallet/*` - Create, transfer, check balance
- **Market**: `/api/market/items` - List, buy, sell items
- **Blockchain**: `/api/blockchain/*` - Token info, minting, balance
- **Health**: `/health` - Service health status
- **Sync**: `/sync` - Data synchronization (requires token)

## Performance Tips

1. **Enable caching**: Use CloudFlare or CDN
2. **Database**: Switch to PostgreSQL for production
3. **Load balancing**: Use Fly.io/Render auto-scaling
4. **Monitoring**: Set up error tracking (Sentry)
5. **CDN**: Serve static assets from CDN

## Security Best Practices

1. ✅ Use non-root user in container
2. ✅ Enable HTTPS (auto in production)
3. ✅ Validate all inputs (implemented)
4. ✅ Rate limiting (add to Express middleware)
5. ✅ CORS configured properly
6. ✅ Environment variables for secrets
7. ✅ JWT tokens for authentication (in SYNC_TOKEN)

## Next Steps

1. **Database**: Add PostgreSQL for persistent storage
2. **Authentication**: Implement JWT with OAuth
3. **Frontend**: Enhance UI with React/Vue
4. **Blockchain**: Deploy real STP contract to BSC
5. **Mobile**: Create native apps
6. **Analytics**: Add Mixpanel/Amplitude tracking

## Support

- GitHub: https://github.com/zedanazad43/stampcoin-platform
- Issues: https://github.com/zedanazad43/stampcoin-platform/issues
- Email: stampcoin.contact@gmail.com

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Maintainer**: Stampcoin Team
