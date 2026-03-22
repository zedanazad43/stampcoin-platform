# Deploying to Fly.io

## Prerequisites
- Fly.io CLI installed: `brew install flyctl` (macOS) or `choco install flyctl` (Windows)
- Docker installed and running
- Logged into Fly.io: `flyctl auth login`

## Local Testing

### Build locally:
```bash
docker build -t stampcoin-platform:latest .
```

### Run with Docker Compose:
```bash
docker compose up --pull always
```

The app will be available at http://localhost:8080

### Test the API:
```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/status
```

## Deploy to Fly.io

### First deployment:
```bash
flyctl launch --name stampcoin-platform
```

This creates an app on Fly.io. Answer the prompts:
- Region: Choose nearest to your users
- Databases: No (unless you add PostgreSQL later)
- Deploy now: Yes

### Redeploy after changes:
```bash
flyctl deploy
```

### View logs:
```bash
flyctl logs
```

### SSH into the running container:
```bash
flyctl ssh console
```

### Scale the app:
```bash
flyctl scale count=2
```

## Environment Variables

Set secrets on Fly.io:
```bash
flyctl secrets set NODE_ENV=production PORT=8080
```

List secrets:
```bash
flyctl secrets list
```

## Monitoring

Check app status:
```bash
flyctl status
```

View metrics:
```bash
flyctl metrics
```

## Troubleshooting

If deployment fails, check:
1. Logs: `flyctl logs`
2. Status: `flyctl status`
3. Health check passes locally: `docker compose up`

The app serves the frontend from `public/index.html` and provides these API endpoints:
- `GET /api/health` - Health check
- `GET /api/status` - App status
- `POST /api/transaction` - Create a transaction
- `GET /api/transactions` - Get all transactions
