# 🔧 Production Configuration Guide

## Quick Start

Run the interactive configuration script:

```bash
./configure-production.sh
```

Or configure services manually using the commands below.

## 📦 IPFS Storage (For NFT Metadata)

### Option 1: Pinata (Recommended)

Sign up at https://pinata.cloud and get:
- API Key
- API Secret
- JWT Token

```bash
flyctl secrets set \
  PINATA_API_KEY="your_api_key" \
  PINATA_API_SECRET="your_api_secret" \
  PINATA_JWT="your_jwt_token"
```

### Option 2: nft.storage

Sign up at https://nft.storage and get your API key:

```bash
flyctl secrets set NFT_STORAGE_API_KEY="your_api_key"
```

### Verify Configuration

```bash
flyctl secrets list | grep -i pinata
flyctl secrets list | grep -i nft
```

---

## 🤖 AI Authentication Services

### Google Cloud Vision

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Vision API
4. Create service account and download JSON key
5. Extract the API key

```bash
flyctl secrets set GOOGLE_VISION_API_KEY="your_api_key"
```

### Azure Computer Vision

1. Go to https://portal.azure.com
2. Create "Computer Vision" resource
3. Get endpoint and key

```bash
flyctl secrets set \
  AZURE_VISION_ENDPOINT="https://your-resource.cognitiveservices.azure.com/" \
  AZURE_VISION_KEY="your_api_key"
```

### Verify Configuration

```bash
flyctl secrets list | grep -i vision
```

---

## 🔗 Smart Contract Deployment

### Infura (Ethereum Node Access)

1. Sign up at https://infura.io
2. Create project → Copy Project ID

```bash
flyctl secrets set INFURA_API_KEY="your_project_id"
```

### Alchemy (Backup Provider)

1. Sign up at https://www.alchemy.com
2. Create app → Copy API key

```bash
flyctl secrets set ALCHEMY_API_KEY="your_api_key"
```

### Wallet Private Key

⚠️ **SECURITY WARNING**: Never commit private keys to git!

1. Export private key from MetaMask or hardware wallet
2. Fund with test ETH/MATIC for deployment

```bash
flyctl secrets set PRIVATE_KEY="0x..."
```

### Contract Verification

For automatic verification on block explorers:

```bash
# Etherscan
flyctl secrets set ETHERSCAN_API_KEY="your_api_key"

# PolygonScan
flyctl secrets set POLYGONSCAN_API_KEY="your_api_key"
```

### Verify Configuration

```bash
flyctl secrets list | grep -i infura
flyctl secrets list | grep -i alchemy
flyctl secrets list | grep -i private
```

---

## 📊 Analytics Configuration

### Umami (Recommended - Privacy-Focused)

1. Deploy Umami instance (or use https://cloud.umami.is)
2. Create website
3. Copy endpoint and website ID

Update environment variables in `fly.toml`:

```toml
[env]
  VITE_ANALYTICS_ENDPOINT = "https://analytics.yourdomain.com"
  VITE_ANALYTICS_WEBSITE_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Then deploy:

```bash
flyctl deploy
```

### Alternative: Plausible

1. Sign up at https://plausible.io
2. Add your domain
3. Get tracking script

Update `fly.toml` with Plausible configuration, then deploy.

---

## 🔐 OAuth Configuration

Current settings are in `fly.toml`:

```toml
[env]
  VITE_OAUTH_PORTAL_URL = "https://stampcoin-oauth.fly.dev"
  VITE_APP_ID = "stampcoin-platform"
```

To update:

1. Edit `fly.toml`
2. Run `flyctl deploy`

---

## ✅ Verification Checklist

### Required (Already Configured)
- ✅ Database URL
- ✅ AWS S3 credentials
- ✅ Stripe API key
- ✅ JWT secret

### Optional (Configure as Needed)
- [ ] IPFS storage (Pinata or nft.storage)
- [ ] AI authentication (Google Vision or Azure)
- [ ] Smart contracts (Infura, Alchemy, private key)
- [ ] Analytics (Umami, Plausible, or Google Analytics)
- [ ] OAuth (if using custom portal)

### Check Current Secrets

```bash
flyctl secrets list
```

### View Recent Deployments

```bash
flyctl history
```

### Monitor Logs

```bash
flyctl logs -f
```

---

## 🚀 After Configuration

### 1. Test Services

```bash
# Test authentication endpoint
curl https://stampcoin-platform.fly.dev/api/health

# Test marketplace
curl https://stampcoin-platform.fly.dev/marketplace

# Test expert endpoints
curl https://stampcoin-platform.fly.dev/expert/leaderboard
```

### 2. Monitor Deployment

```bash
# Watch logs in real-time
flyctl logs -f

# Check machine status
flyctl status

# View metrics
flyctl metrics
```

### 3. Test Features

Visit https://stampcoin-platform.fly.dev and test:

- [ ] Expert application (`/expert/apply`)
- [ ] Expert dashboard (`/expert/dashboard`)
- [ ] Partnership proposal (`/partnership/propose`)
- [ ] Marketplace (`/marketplace`)
- [ ] Payment checkout

### 4. Enable Smart Contracts (Optional)

If you configured smart contract secrets:

```bash
cd contracts

# Test deployment to testnet
npx hardhat run scripts/deploy.ts --network mumbai

# Deploy to mainnet (after testing)
npx hardhat run scripts/deploy.ts --network polygon
```

---

## 📋 Configuration Reference

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `PINATA_API_KEY` | Secret | IPFS image storage | `abc123...` |
| `PINATA_API_SECRET` | Secret | IPFS authentication | `xyz789...` |
| `NFT_STORAGE_API_KEY` | Secret | NFT metadata storage | `api_key_...` |
| `GOOGLE_VISION_API_KEY` | Secret | AI image analysis | `abc123...` |
| `AZURE_VISION_ENDPOINT` | Secret | Azure AI endpoint | `https://...` |
| `AZURE_VISION_KEY` | Secret | Azure AI key | `abc123...` |
| `INFURA_API_KEY` | Secret | Ethereum nodes | `project_id_...` |
| `ALCHEMY_API_KEY` | Secret | Blockchain access | `api_key_...` |
| `PRIVATE_KEY` | Secret | Wallet for deployment | `0x...` |
| `ETHERSCAN_API_KEY` | Secret | Contract verification | `api_key_...` |
| `VITE_ANALYTICS_ENDPOINT` | Env | Analytics service URL | `https://analytics.io` |
| `VITE_ANALYTICS_WEBSITE_ID` | Env | Analytics tracking ID | `uuid_...` |
| `VITE_OAUTH_PORTAL_URL` | Env | OAuth server URL | `https://oauth.io` |
| `VITE_APP_ID` | Env | App identifier | `stampcoin-platform` |

---

## 🔒 Security Best Practices

1. **Never commit secrets to git**
   - Use `flyctl secrets set` not environment files
   - .gitignore includes `.env` files

2. **Rotate keys regularly**
   ```bash
   flyctl secrets set <NAME>="<NEW_VALUE>"
   ```

3. **Use service accounts**
   - Don't use personal API keys
   - Create dedicated accounts per service

4. **Monitor secret access**
   - Review `flyctl logs` for any errors
   - Set up alerts for failed authentications

5. **Backup critical data**
   - Keep local copies of API keys securely
   - Use password manager (1Password, LastPass, etc.)

---

## 🆘 Troubleshooting

### Secrets Not Updating

```bash
# Clear and redeploy
flyctl deploy --strategy=immediate

# Check if secrets are set
flyctl secrets list
```

### Service Connection Errors

```bash
# Check logs for detailed errors
flyctl logs -a stampcoin-platform | grep -i error

# Test connectivity
flyctl ssh console
# Then inside: curl https://api.service.com/health
```

### IPFS Upload Failing

```bash
# Verify Pinata credentials
curl -H "Authorization: Bearer $PINATA_JWT" \
  https://api.pinata.cloud/data/testAuthentication
```

### AI Service Errors

```bash
# Test Google Vision
curl -X POST https://vision.googleapis.com/v1/images:annotate \
  -H "Content-Type: application/json" \
  -d '{"requests": [...]}'
```

---

## 📞 Support

- **Fly.io Docs:** https://fly.io/docs
- **Pinata Support:** https://support.pinata.cloud
- **Google Cloud:** https://cloud.google.com/support
- **Azure Support:** https://azure.microsoft.com/support
- **Infura Support:** https://infura.io/support

---

**Last Updated:** January 5, 2026  
**Status:** Production Ready
