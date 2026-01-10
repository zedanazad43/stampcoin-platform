# StampCoin Platform - IONOS Migration Guide
# Complete step-by-step guide for migrating from current environment to IONOS VPS

## 📋 Pre-Migration Checklist

### 1. Current Environment Audit
- [ ] Document current server specifications
- [ ] List all running services and ports
- [ ] Export all environment variables
- [ ] Backup all databases
- [ ] Backup all file storage
- [ ] Document DNS configuration
- [ ] List all API integrations
- [ ] Document OAuth redirect URLs

### 2. IONOS Account Setup
- [ ] Create IONOS account
- [ ] Verify email and payment method
- [ ] Purchase domain (stampcoin.com)
- [ ] Order VPS Linux XL package
- [ ] Setup email accounts
- [ ] Order SSL Wildcard certificate
- [ ] Activate CDN Pro
- [ ] Enable SiteLock Security

### 3. Prepare Migration Environment
- [ ] Create `.env.deploy` file with all secrets
- [ ] Download `deploy-ionos.sh` script
- [ ] Test backup scripts locally
- [ ] Prepare rollback plan
- [ ] Schedule maintenance window

## 🚀 Migration Process

### Phase 1: IONOS Setup (Day 1)

#### Step 1.1: Domain Purchase
```bash
# On IONOS Control Panel:
1. Go to Domains → Register New Domain
2. Search for "stampcoin.com"
3. Add to cart (1€ first year promotion)
4. Complete purchase
5. Note nameservers: ns1.ionos.de, ns2.ionos.de
```

**Expected Result:** Domain registered and active within 15 minutes

#### Step 1.2: VPS Provisioning
```bash
# On IONOS Control Panel:
1. Go to Server & Cloud → Order Server
2. Select "VPS Linux XL"
   - 8 vCores
   - 16 GB RAM
   - 320 GB NVMe SSD
3. Choose Ubuntu 24.04 LTS
4. Set root password (save securely!)
5. Select Frankfurt datacenter
6. Complete order (20€/month promotional)
```

**Wait Time:** VPS ready in 55 seconds ⚡

**You will receive:**
- VPS IP address (e.g., 217.160.xxx.xxx)
- Root SSH credentials
- Server access panel URL

#### Step 1.3: Initial VPS Access
```bash
# From your local machine:
ssh root@YOUR_VPS_IP

# First login tasks:
# Update password if needed
passwd

# Update system
apt update && apt upgrade -y

# Check specifications
lscpu  # CPU info
free -h  # RAM info
df -h  # Disk space
```

#### Step 1.4: Email Account Setup
```bash
# On IONOS Control Panel:
1. Go to Email → Create Email Address
2. Setup accounts:
   - info@stampcoin.com (50GB)
   - support@stampcoin.com (50GB)
   - payments@stampcoin.com (50GB)
   - noreply@stampcoin.com (10GB)
   - admin@stampcoin.com (50GB)
3. Note SMTP settings:
   - Host: smtp.ionos.de
   - Port: 587 (TLS) or 465 (SSL)
   - Auth: Required
```

### Phase 2: Data Backup & Export (Day 1-2)

#### Step 2.1: Database Backup
```bash
# On current server:
# Full database dump
mysqldump -u root -p stampcoin > stampcoin_backup_$(date +%Y%m%d).sql

# Compress backup
gzip stampcoin_backup_*.sql

# Verify backup
gunzip -t stampcoin_backup_*.sql.gz

# Calculate checksum
sha256sum stampcoin_backup_*.sql.gz > backup_checksum.txt
```

#### Step 2.2: Environment Variables Export
```bash
# On current server:
# Export all environment variables
cd /path/to/current/stampcoin
cat .env > env_backup_$(date +%Y%m%d).txt

# Securely copy to local machine
scp root@current-server:/path/to/env_backup_*.txt ./
```

#### Step 2.3: File Storage Backup
```bash
# Backup uploaded files
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz /path/to/uploads/

# Backup certificates if any
tar -czf certs_backup_$(date +%Y%m%d).tar.gz /etc/letsencrypt/

# Verify archives
tar -tzf uploads_backup_*.tar.gz | head
tar -tzf certs_backup_*.tar.gz | head
```

#### Step 2.4: Docker Volumes Backup (IPFS)
```bash
# If using IPFS Docker
docker exec stampcoin-ipfs ipfs repo stat

# Backup IPFS data
docker run --rm \
  --volumes-from stampcoin-ipfs \
  -v $(pwd):/backup \
  ubuntu tar czf /backup/ipfs_backup_$(date +%Y%m%d).tar.gz /data/ipfs
```

### Phase 3: IONOS Deployment (Day 2-3)

#### Step 3.1: Prepare Deployment Environment File
```bash
# Create .env.deploy on local machine
cat > .env.deploy <<'EOF'
# MySQL Configuration
MYSQL_ROOT_PASSWORD="your_secure_root_password_here"
MYSQL_PASSWORD="your_secure_app_password_here"

# Application Secrets
SESSION_SECRET="your_session_secret_32_chars_min"
JWT_SECRET="your_jwt_secret_32_chars_min"

# IPFS / Pinata
PINATA_API_KEY="your_pinata_api_key"
PINATA_SECRET_KEY="your_pinata_secret_key"

# Blockchain
POLYGON_RPC_URL="https://polygon-rpc.com"
CONTRACT_ADDRESS="0x..."
FUNDER_PRIVATE_KEY="0x..."

# Cex.io Payment
CEX_WALLET_ADDRESS="your_cex_wallet_address"
CEX_API_KEY="your_cex_api_key"
CEX_API_SECRET="your_cex_api_secret"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_SECRET="your_paypal_secret"

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID="your_google_client_id"
GOOGLE_OAUTH_SECRET="your_google_secret"

# Discord OAuth
DISCORD_OAUTH_CLIENT_ID="your_discord_client_id"
DISCORD_OAUTH_SECRET="your_discord_secret"

# AWS Storage
AWS_ACCESS_KEY_ID="your_aws_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret"
AWS_S3_BUCKET="stampcoin-storage"
AWS_REGION="eu-central-1"

# SMTP (IONOS Email)
SMTP_PASSWORD="your_noreply_email_password"

# Domain
DOMAIN="stampcoin.com"
EOF
```

#### Step 3.2: Upload Deployment Files
```bash
# Copy deployment files to VPS
scp deploy-ionos.sh root@YOUR_VPS_IP:/root/
scp .env.deploy root@YOUR_VPS_IP:/root/
scp ionos-config.yml root@YOUR_VPS_IP:/root/

# Copy backup files
scp stampcoin_backup_*.sql.gz root@YOUR_VPS_IP:/root/
scp uploads_backup_*.tar.gz root@YOUR_VPS_IP:/root/
scp ipfs_backup_*.tar.gz root@YOUR_VPS_IP:/root/
```

#### Step 3.3: Run Deployment Script
```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Make script executable
chmod +x deploy-ionos.sh

# Run deployment (will take 10-15 minutes)
./deploy-ionos.sh

# Monitor deployment
tail -f /var/log/syslog
```

**Deployment Script Will:**
1. ✅ Update system packages
2. ✅ Install Node.js 20
3. ✅ Install MySQL 8.0
4. ✅ Install Redis
5. ✅ Install Docker
6. ✅ Configure firewall (UFW)
7. ✅ Setup Fail2Ban
8. ✅ Clone repository
9. ✅ Install dependencies
10. ✅ Run database migrations
11. ✅ Build project
12. ✅ Setup IPFS container
13. ✅ Configure Nginx
14. ✅ Install SSL certificates
15. ✅ Create systemd service
16. ✅ Setup monitoring
17. ✅ Configure automated backups

#### Step 3.4: Restore Database
```bash
# On VPS after deployment:
cd /root

# Decompress backup
gunzip stampcoin_backup_*.sql.gz

# Restore database
mysql -u stampcoin_user -p stampcoin < stampcoin_backup_*.sql

# Verify restoration
mysql -u stampcoin_user -p stampcoin -e "SHOW TABLES;"
mysql -u stampcoin_user -p stampcoin -e "SELECT COUNT(*) FROM users;"
```

#### Step 3.5: Restore File Storage
```bash
# Restore uploads
mkdir -p /var/www/stampcoin/uploads
tar -xzf uploads_backup_*.tar.gz -C /var/www/stampcoin/uploads

# Set permissions
chown -R www-data:www-data /var/www/stampcoin/uploads
```

#### Step 3.6: Restore IPFS Data (if needed)
```bash
# Stop IPFS container
docker stop stampcoin-ipfs

# Restore IPFS data
docker run --rm \
  --volumes-from stampcoin-ipfs \
  -v $(pwd):/backup \
  ubuntu tar xzf /backup/ipfs_backup_*.tar.gz -C /

# Restart IPFS
docker start stampcoin-ipfs
docker logs -f stampcoin-ipfs
```

### Phase 4: DNS Configuration (Day 3)

#### Step 4.1: Configure DNS Records
```bash
# On IONOS Control Panel → Domains → DNS Settings
# Add the following records for stampcoin.com:

# A Records
Type: A
Host: @
Value: YOUR_VPS_IP
TTL: 3600

Type: A
Host: www
Value: YOUR_VPS_IP
TTL: 3600

Type: A
Host: api
Value: YOUR_VPS_IP
TTL: 3600

# MX Record (Email)
Type: MX
Host: @
Value: mx00.ionos.de
Priority: 10
TTL: 3600

Type: MX
Host: @
Value: mx01.ionos.de
Priority: 10
TTL: 3600

# TXT Record (SPF for email)
Type: TXT
Host: @
Value: v=spf1 include:_spf.ionos.de ~all
TTL: 3600

# TXT Record (DMARC)
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@stampcoin.com
TTL: 3600

# CNAME (CDN - optional)
Type: CNAME
Host: cdn
Value: cdn.ionos.com
TTL: 3600
```

**DNS Propagation Time:** 1-48 hours (typically 2-4 hours)

#### Step 4.2: Verify DNS Propagation
```bash
# Check from local machine
dig stampcoin.com +short
dig www.stampcoin.com +short
dig api.stampcoin.com +short

# Check MX records
dig MX stampcoin.com +short

# Check TXT records
dig TXT stampcoin.com +short

# Online tools
# https://dnschecker.org
# https://mxtoolbox.com
```

### Phase 5: SSL & Security (Day 3-4)

#### Step 5.1: Verify SSL Certificates
```bash
# On VPS:
# Check certificate status
certbot certificates

# Test SSL
curl -I https://stampcoin.com
curl -I https://www.stampcoin.com
curl -I https://api.stampcoin.com

# Online SSL test
# https://www.ssllabs.com/ssltest/
```

#### Step 5.2: Configure Security Headers
```bash
# Already configured in Nginx, verify:
curl -I https://stampcoin.com | grep -i "strict-transport-security"
curl -I https://stampcoin.com | grep -i "x-frame-options"
curl -I https://stampcoin.com | grep -i "x-content-type-options"
```

#### Step 5.3: Setup Fail2Ban Monitoring
```bash
# Check Fail2Ban status
fail2ban-client status

# Check specific jails
fail2ban-client status sshd
fail2ban-client status nginx-http-auth

# View banned IPs
fail2ban-client status sshd | grep "Banned IP list"
```

### Phase 6: Application Configuration (Day 4)

#### Step 6.1: Update OAuth Redirect URLs
```bash
# Update in each platform:

# Google Cloud Console
https://console.cloud.google.com/apis/credentials
# Update redirect URI to:
https://stampcoin.com/api/auth/google/callback

# Discord Developer Portal
https://discord.com/developers/applications
# Update redirect URI to:
https://stampcoin.com/api/auth/discord/callback

# Stripe Dashboard
https://dashboard.stripe.com/webhooks
# Update webhook URL to:
https://api.stampcoin.com/api/webhooks/stripe

# PayPal Developer
https://developer.paypal.com
# Update return URL to:
https://stampcoin.com/payment/paypal/return
```

#### Step 6.2: Test Payment Integrations
```bash
# On VPS, check service status
systemctl status stampcoin

# View logs
journalctl -u stampcoin -f

# Test Cex.io integration
curl -X POST https://api.stampcoin.com/api/payment/cex/test

# Test Stripe webhook
stripe listen --forward-to https://api.stampcoin.com/api/webhooks/stripe
```

#### Step 6.3: Configure CDN (Optional)
```bash
# On IONOS Control Panel:
1. Go to CDN → Activate CDN Pro
2. Configure origin: stampcoin.com
3. Enable image optimization
4. Set cache rules:
   - Static assets: 1 year
   - API responses: No cache
   - HTML: 1 hour

# Update Nginx for CDN
# Add to nginx config:
location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
    add_header X-CDN-Origin "IONOS-CDN";
    expires 1y;
}
```

### Phase 7: Testing & Validation (Day 4-5)

#### Step 7.1: Functional Testing Checklist
```bash
# Test matrix:

✅ Frontend
[ ] Homepage loads
[ ] User registration
[ ] User login
[ ] OAuth login (Google)
[ ] OAuth login (Discord)
[ ] Browse stamps
[ ] Search functionality
[ ] View stamp details

✅ Backend API
[ ] GET /api/stamps
[ ] GET /api/archive
[ ] POST /api/auth/register
[ ] POST /api/auth/login
[ ] GET /trpc/stamps.list

✅ Payment Systems
[ ] Cex.io payment info display
[ ] Stripe checkout
[ ] PayPal checkout
[ ] Payment confirmation

✅ NFT Features
[ ] View NFT details
[ ] IPFS metadata loading
[ ] Blockchain verification
[ ] Wallet connection (MetaMask)

✅ Admin Panel
[ ] Admin login
[ ] Stamp management
[ ] User management
[ ] Analytics dashboard
```

#### Step 7.2: Performance Testing
```bash
# Install testing tools
apt install -y apache2-utils

# Test concurrent connections
ab -n 1000 -c 10 https://stampcoin.com/

# Test API endpoint
ab -n 500 -c 5 https://api.stampcoin.com/api/stamps

# Monitor during test
htop
iotop
nethogs
```

#### Step 7.3: Load Testing
```bash
# Install k6 for load testing
wget https://github.com/grafana/k6/releases/download/v0.45.0/k6-v0.45.0-linux-amd64.tar.gz
tar -xzf k6-*.tar.gz
mv k6*/k6 /usr/local/bin/

# Create load test script
cat > load-test.js <<'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let response = http.get('https://stampcoin.com');
  check(response, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
EOF

# Run load test
k6 run load-test.js
```

### Phase 8: Monitoring Setup (Day 5)

#### Step 8.1: Setup Uptime Monitoring
```bash
# Use external services:
# 1. UptimeRobot (https://uptimerobot.com) - Free
# 2. Pingdom (https://pingdom.com)
# 3. StatusCake (https://statuscake.com)

# Monitor these endpoints:
- https://stampcoin.com (HTTP 200)
- https://api.stampcoin.com/health (HTTP 200)
- MySQL port (3306)
- Redis port (6379)
```

#### Step 8.2: Setup Log Monitoring
```bash
# Install logrotate for log management
cat > /etc/logrotate.d/stampcoin <<EOF
/var/log/stampcoin/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload stampcoin > /dev/null 2>&1 || true
    endscript
}
EOF

# Test logrotate
logrotate -f /etc/logrotate.d/stampcoin
```

#### Step 8.3: Setup Alerting
```bash
# Create alert script
cat > /usr/local/bin/stampcoin-alert.sh <<'EOF'
#!/bin/bash

ADMIN_EMAIL="admin@stampcoin.com"

# Check service status
if ! systemctl is-active --quiet stampcoin; then
    echo "StampCoin service is down!" | mail -s "ALERT: Service Down" $ADMIN_EMAIL
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is at ${DISK_USAGE}%!" | mail -s "ALERT: High Disk Usage" $ADMIN_EMAIL
fi

# Check memory
MEM_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100}' | cut -d. -f1)
if [ $MEM_USAGE -gt 90 ]; then
    echo "Memory usage is at ${MEM_USAGE}%!" | mail -s "ALERT: High Memory Usage" $ADMIN_EMAIL
fi
EOF

chmod +x /usr/local/bin/stampcoin-alert.sh

# Add to crontab (every 5 minutes)
(crontab -l; echo "*/5 * * * * /usr/local/bin/stampcoin-alert.sh") | crontab -
```

### Phase 9: Go Live (Day 5-6)

#### Step 9.1: Pre-Launch Checklist
```bash
# Final verification:
[ ] All DNS records propagated
[ ] SSL certificates valid
[ ] All services running
[ ] Database populated
[ ] Payment systems tested
[ ] OAuth working
[ ] Email sending working
[ ] Backups configured
[ ] Monitoring active
[ ] Security hardened
[ ] Performance optimized
[ ] Documentation updated
```

#### Step 9.2: Maintenance Mode (Optional)
```bash
# If gradual migration needed:
# Create maintenance page
cat > /var/www/maintenance.html <<'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>StampCoin - Maintenance</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>🔧 We're Upgrading!</h1>
    <p>StampCoin is currently being upgraded to serve you better.</p>
    <p>We'll be back online shortly.</p>
    <p>Follow us on Twitter for updates: @StampCoin</p>
</body>
</html>
EOF

# Nginx maintenance mode
cat > /etc/nginx/sites-available/maintenance <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    
    ssl_certificate /etc/letsencrypt/live/stampcoin.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stampcoin.com/privkey.pem;
    
    location / {
        root /var/www;
        try_files /maintenance.html =503;
    }
}
EOF

# Enable maintenance mode
ln -sf /etc/nginx/sites-available/maintenance /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Disable maintenance mode (when ready)
rm /etc/nginx/sites-enabled/maintenance
nginx -t && systemctl reload nginx
```

#### Step 9.3: Launch Announcement
```bash
# Prepare announcement:

📧 Email to Users:
Subject: StampCoin Platform Upgrade Complete!

Hi StampCoin Community,

We're excited to announce that StampCoin has been upgraded to a new, more powerful infrastructure!

What's New:
✅ 50% faster page load times
✅ Enhanced security with premium SSL
✅ Better uptime (99.9% SLA)
✅ Improved payment processing
✅ Global CDN for faster access worldwide

What You Need to Do:
- Clear your browser cache
- Re-login to your account
- Update bookmarks to https://stampcoin.com

Thank you for your continued support!

The StampCoin Team
https://stampcoin.com
```

### Phase 10: Post-Launch Monitoring (Week 1)

#### Step 10.1: Daily Checks
```bash
# Run monitoring script daily
/usr/local/bin/stampcoin-monitor.sh

# Check logs for errors
journalctl -u stampcoin --since "1 hour ago" | grep -i error

# Check access logs
tail -100 /var/log/nginx/access.log | grep -v "200\|301\|304"

# Monitor performance
htop
iostat 1 10
```

#### Step 10.2: Performance Optimization
```bash
# Enable MySQL query cache
mysql -e "SET GLOBAL query_cache_size = 67108864;"

# Optimize Redis
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Enable Nginx gzip
# Already configured in nginx.conf

# Monitor and tune
mysqltuner
redis-cli --stat
```

#### Step 10.3: Weekly Maintenance
```bash
# Create weekly maintenance script
cat > /usr/local/bin/stampcoin-weekly.sh <<'EOF'
#!/bin/bash

echo "=== Weekly Maintenance - $(date) ==="

# Update system packages
apt update && apt upgrade -y

# Clean old logs
journalctl --vacuum-time=7d

# Clean old Docker images
docker system prune -f

# Optimize MySQL
mysqlcheck -u root -p --optimize --all-databases

# Check SSL expiry
certbot renew --dry-run

# Generate report
echo "Maintenance completed at $(date)" >> /var/log/weekly-maintenance.log
EOF

chmod +x /usr/local/bin/stampcoin-weekly.sh

# Schedule weekly (Sunday 3 AM)
(crontab -l; echo "0 3 * * 0 /usr/local/bin/stampcoin-weekly.sh") | crontab -
```

## 🔄 Rollback Plan

### If Migration Fails:

#### Step 1: Keep Old Server Running
```bash
# Don't shut down old server until new one is verified
# Keep both running during transition period
```

#### Step 2: Quick DNS Rollback
```bash
# On IONOS DNS Settings:
# Change A records back to old server IP
# Wait for propagation (5-10 minutes with low TTL)
```

#### Step 3: Restore from Backup
```bash
# If data corruption on new server:
mysql -u stampcoin_user -p stampcoin < /var/backups/stampcoin/db_latest.sql.gz
tar -xzf /var/backups/stampcoin/backup_latest.tar.gz -C /var/www/stampcoin/
```

## 📊 Success Metrics

### After Migration, Monitor:
- [ ] Uptime > 99.9%
- [ ] Average response time < 200ms
- [ ] Zero data loss
- [ ] All payments processing
- [ ] No critical errors in logs
- [ ] User login success rate > 99%
- [ ] SSL score A+ on SSL Labs

## 🎯 Timeline Summary

| Day | Phase | Duration |
|-----|-------|----------|
| 1 | IONOS Setup | 2 hours |
| 1-2 | Data Backup | 4 hours |
| 2-3 | Deployment | 6 hours |
| 3 | DNS Configuration | 24 hours (propagation) |
| 3-4 | SSL & Security | 3 hours |
| 4 | App Configuration | 4 hours |
| 4-5 | Testing | 8 hours |
| 5 | Monitoring Setup | 3 hours |
| 5-6 | Go Live | 2 hours |
| **Total** | **~56 hours** | **~1 week** |

## 💡 Tips & Best Practices

1. **Always backup before migration**
2. **Test backups can be restored**
3. **Use low TTL on DNS before migration**
4. **Keep old server running 1 week after migration**
5. **Monitor logs closely first 48 hours**
6. **Have rollback plan ready**
7. **Announce maintenance window to users**
8. **Document everything**
9. **Test payments in sandbox first**
10. **Verify OAuth redirects work**

## 📞 Support Contacts

### IONOS Support
- Phone: +49 (0) 721 170 5000
- Email: support@ionos.de
- Live Chat: https://www.ionos.de/help

### Emergency Contacts
- VPS Issues: 24/7 Support Hotline
- SSL Problems: SSL Certificate Support
- Email Issues: Email Support Team
- Billing: Billing Department

---

**Migration prepared by:** StampCoin DevOps Team  
**Last updated:** January 10, 2026  
**Version:** 1.0.0
