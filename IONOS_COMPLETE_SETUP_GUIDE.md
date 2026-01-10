# StampCoin Platform - IONOS Complete Setup Guide
## Comprehensive guide for domain, hosting, and deployment

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Package Selection](#package-selection)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Technical Configuration](#technical-configuration)
5. [Deployment](#deployment)
6. [Security](#security)
7. [Monitoring](#monitoring)
8. [Optimization](#optimization)
9. [Troubleshooting](#troubleshooting)
10. [Pricing Breakdown](#pricing-breakdown)

---

## 🎯 Overview

### What is IONOS?
IONOS (formerly 1&1) is one of Europe's largest web hosting and cloud services providers, with:
- 8+ million customers worldwide
- 10 data centers globally
- 90,000+ servers
- GDPR compliant (EU-based)
- 24/7 multilingual support

### Why IONOS for StampCoin?
✅ **Performance**: NVMe SSD, 1 Gbps network, 99.9% uptime SLA  
✅ **Security**: DDoS protection, SSL certificates, automated backups  
✅ **Scalability**: Easy upgrade from VPS to dedicated servers  
✅ **Location**: Frankfurt datacenter (low latency for EU/MENA)  
✅ **Compliance**: GDPR compliant, important for user data protection  
✅ **Support**: German engineering quality, 24/7 support in Arabic/English  
✅ **Pricing**: Competitive rates with frequent promotions  

---

## 📦 Package Selection

### Recommended: Professional Bundle

```yaml
Package: StampCoin Professional Bundle
Monthly Cost: €76 (~$83 USD)
Annual Cost: €912 (~$995 USD)
One-time Setup: €40

Includes:
  Domain:
    - stampcoin.com (1€ first year, then 15€/year)
    - stampcoin.io (39€/year)
  
  VPS Hosting:
    - VPS Linux XL
    - 8 vCores
    - 16 GB RAM
    - 320 GB NVMe SSD
    - Unlimited bandwidth
    - Frankfurt datacenter
    - Price: 20€/month (promotional), regular 40€/month
  
  Security:
    - SSL Wildcard Certificate (8.33€/month)
    - SiteLock Security Pro (14.99€/month)
    - Premium Backups (7.99€/month)
  
  Email:
    - 5 Email Business Pro accounts (15€/month)
    - 50 GB storage per mailbox
    - Spam/virus protection
  
  Performance:
    - CDN Pro (10€/month)
    - 50+ global edge locations
    - Image optimization

Value Proposition:
  - Enterprise-grade infrastructure
  - Complete security suite
  - Ready for production traffic
  - Scalable to 10,000+ users
```

---

## 🚀 Step-by-Step Setup

### Phase 1: Account Creation & Domain Purchase

#### 1.1 Create IONOS Account
```
1. Visit: https://www.ionos.de
2. Click "Registrieren" (Register)
3. Fill in details:
   - Email: your-email@example.com
   - Password: Strong password (12+ characters)
   - Name and address information
4. Verify email address
5. Add payment method (Credit Card, PayPal, or SEPA)
```

#### 1.2 Purchase Domain
```
Navigation: IONOS Dashboard → Domains → Domain kaufen

Domain Search:
  Search: "stampcoin"
  
Available Options:
  ✅ stampcoin.com - 1€ (first year) → ADD TO CART
  ✅ stampcoin.io - 39€/year → ADD TO CART
  ✅ stampcoin.net - 1€ (first year) → Optional
  ✅ stampcoin.de - 1€ (first year) → Optional
  ✅ stampcoin.ae - 29€/year → Optional (Arab market)

Domain Privacy:
  ☑ Enable Whois Privacy Protection (Included Free)
  ☑ Domain Lock (Included Free)

Complete Purchase
  Total: 40€ for .com + .io (first year)
  
Confirmation:
  - Email with domain confirmation
  - Nameservers: ns1.ionos.de, ns2.ionos.de
  - Control panel access
```

#### 1.3 Order VPS Server
```
Navigation: IONOS Dashboard → Server & Cloud → VPS bestellen

Server Selection:
  Package: VPS Linux XL
  
  Specifications:
    CPU: 8 vCores
    RAM: 16 GB
    Storage: 320 GB NVMe SSD
    Bandwidth: Unlimited
    Network: 1 Gbps
  
  Operating System:
    Select: Ubuntu 24.04 LTS (recommended)
    Or: Debian 12, CentOS 8
  
  Datacenter Location:
    Select: Frankfurt, Germany (EU)
    Benefits: GDPR compliant, low latency to Europe/MENA
  
  Additional Options:
    ☑ Automated Snapshots - 5€/month
    ☑ Premium Backup - 7.99€/month
    ☐ IPv6 address (included free)
  
  Server Name: stampcoin-production
  Root Password: [Generate strong password]

Complete Order:
  Promotional Price: 20€/month (first 6 months)
  Regular Price: 40€/month (after promotion)
  Setup Time: 55 seconds ⚡

Confirmation:
  - Server IP address (e.g., 217.160.123.45)
  - SSH access credentials
  - Server management panel URL
```

#### 1.4 Setup Email Accounts
```
Navigation: IONOS Dashboard → Email → E-Mail-Adresse erstellen

Email Package: Business Email Pro
Price: 3€/month per mailbox

Create Accounts:
  1. info@stampcoin.com
     Storage: 50 GB
     Purpose: General inquiries
     
  2. support@stampcoin.com
     Storage: 50 GB
     Purpose: Customer support
     
  3. payments@stampcoin.com
     Storage: 50 GB
     Purpose: Payment notifications
     
  4. noreply@stampcoin.com
     Storage: 10 GB
     Purpose: Automated system emails
     
  5. admin@stampcoin.com
     Storage: 50 GB
     Purpose: Administrative access

SMTP Configuration:
  Incoming Mail (IMAP):
    Server: imap.ionos.de
    Port: 993 (SSL/TLS)
    
  Outgoing Mail (SMTP):
    Server: smtp.ionos.de
    Port: 587 (STARTTLS)
    Port: 465 (SSL/TLS)
    Authentication: Required

Webmail Access:
  URL: https://mail.ionos.de
  Or: Configure Outlook, Thunderbird, Apple Mail
```

#### 1.5 Order SSL Certificate
```
Navigation: IONOS Dashboard → SSL-Zertifikat → Wildcard SSL

SSL Package: Wildcard SSL Certificate
Price: 8.33€/month (99€/year with 20% discount)

Coverage:
  *.stampcoin.com (all subdomains)
  Examples:
    - stampcoin.com
    - www.stampcoin.com
    - api.stampcoin.com
    - cdn.stampcoin.com

Features:
  - 256-bit encryption
  - 99.9% browser recognition
  - Mobile device support
  - Automatic renewal option
  - Green address bar (EV SSL)

Installation:
  - Automatic installation available
  - Or manual CSR generation
```

#### 1.6 Activate Security Services
```
Navigation: IONOS Dashboard → Sicherheit

SiteLock Security Pro:
  Price: 14.99€/month
  
  Features:
    ☑ Daily malware scanning
    ☑ Vulnerability detection
    ☑ Automatic malware removal
    ☑ Firewall protection
    ☑ DDoS mitigation
    ☑ Trust seal for website
    ☑ PCI compliance scanning

  Activate: YES (recommended for payment handling)

CodeGuard Backup:
  Price: 7.99€/month
  
  Features:
    ☑ Daily automatic backups
    ☑ Unlimited storage
    ☑ One-click restore
    ☑ File change monitoring
    ☑ Database backup included
  
  Activate: YES (critical for data protection)
```

#### 1.7 Activate CDN
```
Navigation: IONOS Dashboard → CDN → CDN Pro aktivieren

CDN Package: IONOS CDN Pro
Price: 10€/month

Edge Locations (50+ worldwide):
  Europe:
    - Frankfurt, Germany
    - London, UK
    - Paris, France
    - Amsterdam, Netherlands
    - Madrid, Spain
    - Stockholm, Sweden
  
  North America:
    - New York, USA
    - Los Angeles, USA
    - Toronto, Canada
  
  Asia Pacific:
    - Tokyo, Japan
    - Singapore
    - Mumbai, India
    - Sydney, Australia
  
  Middle East:
    - Dubai, UAE
  
  Latin America:
    - São Paulo, Brazil

Configuration:
  Origin Server: stampcoin.com
  
  Cache Rules:
    Images (jpg, png, gif, svg): 1 year
    CSS/JS: 1 month
    HTML: 1 hour
    API: No cache
  
  Optimization:
    ☑ Image compression
    ☑ WebP conversion
    ☑ Lazy loading
    ☑ Minification

Benefits:
  - 50-70% faster page loads globally
  - Reduced server load
  - Better SEO ranking
  - DDoS protection at edge
```

---

### Phase 2: VPS Initial Configuration

#### 2.1 First SSH Connection
```bash
# From your local machine (Linux/Mac):
ssh root@217.160.123.45

# First time login:
# Verify server fingerprint
# Accept and continue

# Windows users - use PuTTY:
# Download from: https://www.putty.org
# Enter IP: 217.160.123.45
# Port: 22
# Connection type: SSH
# Click "Open"
```

#### 2.2 Initial Server Hardening
```bash
# Update system
apt update && apt upgrade -y

# Create non-root user (optional but recommended)
adduser stampcoin
usermod -aG sudo stampcoin

# Setup SSH key authentication (more secure)
# On your local machine:
ssh-keygen -t ed25519 -C "stampcoin-deploy"

# Copy public key to server
ssh-copy-id root@217.160.123.45

# Test key-based login
ssh root@217.160.123.45

# Disable password authentication (after key works)
nano /etc/ssh/sshd_config
# Find and change:
# PasswordAuthentication no
# PermitRootLogin prohibit-password

# Restart SSH
systemctl restart sshd

# Setup automatic security updates
apt install unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

#### 2.3 Basic Tools Installation
```bash
# Essential tools
apt install -y \
  curl \
  wget \
  git \
  vim \
  htop \
  iotop \
  nethogs \
  tree \
  zip \
  unzip \
  software-properties-common \
  build-essential

# Check installations
git --version
curl --version
```

---

### Phase 3: DNS Configuration

#### 3.1 Access DNS Settings
```
Navigation: IONOS Dashboard → Domains → stampcoin.com → DNS Einstellungen
```

#### 3.2 Configure DNS Records
```dns
# A Record - Main domain
Type: A
Name: @
Value: 217.160.123.45 (your VPS IP)
TTL: 3600 (1 hour)

# A Record - www subdomain
Type: A
Name: www
Value: 217.160.123.45
TTL: 3600

# A Record - API subdomain
Type: A
Name: api
Value: 217.160.123.45
TTL: 3600

# CNAME - CDN
Type: CNAME
Name: cdn
Value: cdn.ionos.com
TTL: 3600

# MX Records - Email (Primary)
Type: MX
Name: @
Value: mx00.ionos.de
Priority: 10
TTL: 3600

# MX Records - Email (Backup)
Type: MX
Name: @
Value: mx01.ionos.de
Priority: 10
TTL: 3600

# TXT Record - SPF (Email authentication)
Type: TXT
Name: @
Value: v=spf1 include:_spf.ionos.de ~all
TTL: 3600

# TXT Record - DKIM (Email signing)
Type: TXT
Name: default._domainkey
Value: [Generated by IONOS Email settings]
TTL: 3600

# TXT Record - DMARC (Email policy)
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@stampcoin.com
TTL: 3600

# CAA Record - SSL Certificate Authority
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
TTL: 3600
```

#### 3.3 Verify DNS Propagation
```bash
# Wait 5-10 minutes after changes

# Check A record
dig stampcoin.com +short
# Should return: 217.160.123.45

# Check MX records
dig MX stampcoin.com +short
# Should return: 10 mx00.ionos.de, 10 mx01.ionos.de

# Check TXT records
dig TXT stampcoin.com +short
# Should return SPF record

# Online verification:
# https://dnschecker.org
# https://mxtoolbox.com/SuperTool.aspx
```

---

### Phase 4: Complete Deployment

#### 4.1 Prepare Environment File
```bash
# On your local machine, create .env.deploy

# MySQL Configuration
MYSQL_ROOT_PASSWORD="Generate_32_char_strong_password_here"
MYSQL_PASSWORD="Generate_32_char_app_password_here"

# Application Secrets (generate with: openssl rand -hex 32)
SESSION_SECRET="your_session_secret_64_characters_minimum_length"
JWT_SECRET="your_jwt_secret_64_characters_minimum_length"

# IPFS / Pinata
PINATA_API_KEY="your_pinata_api_key_from_pinata_cloud"
PINATA_SECRET_KEY="your_pinata_secret_key_from_pinata_cloud"

# Blockchain (Polygon Mainnet)
POLYGON_RPC_URL="https://polygon-rpc.com"
CONTRACT_ADDRESS="0x..." # Your deployed NFT contract
FUNDER_PRIVATE_KEY="0x..." # Private key for gas funding

# Cex.io Payment
CEX_USER_ID="162853244"
CEX_WALLET_ADDRESS="your_cex_wallet_address"
CEX_API_KEY="your_cex_api_key"
CEX_API_SECRET="your_cex_api_secret"

# Stripe (Production keys)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# PayPal (Production credentials)
PAYPAL_CLIENT_ID="your_paypal_production_client_id"
PAYPAL_SECRET="your_paypal_production_secret"
PAYPAL_MODE="live"

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID="your_google_client_id"
GOOGLE_OAUTH_SECRET="your_google_client_secret"

# Discord OAuth
DISCORD_OAUTH_CLIENT_ID="your_discord_client_id"
DISCORD_OAUTH_SECRET="your_discord_client_secret"

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_S3_BUCKET="stampcoin-production-storage"
AWS_REGION="eu-central-1"

# IONOS Email SMTP
SMTP_PASSWORD="your_noreply_email_password"

# Domain
DOMAIN="stampcoin.com"
```

#### 4.2 Upload and Run Deployment Script
```bash
# Make script executable
chmod +x deploy-ionos.sh

# Upload to server
scp deploy-ionos.sh root@217.160.123.45:/root/
scp .env.deploy root@217.160.123.45:/root/
scp ionos-config.yml root@217.160.123.45:/root/

# SSH to server
ssh root@217.160.123.45

# Run deployment (takes 10-15 minutes)
cd /root
./deploy-ionos.sh

# Monitor progress
tail -f /var/log/syslog
```

#### 4.3 Post-Deployment Verification
```bash
# Check all services
systemctl status stampcoin
systemctl status mysql
systemctl status redis
systemctl status nginx

# Check if ports are listening
netstat -tuln | grep -E ':80|:443|:3000|:3306|:6379'

# Check IPFS container
docker ps | grep ipfs

# Test website
curl -I https://stampcoin.com
curl -I https://api.stampcoin.com

# View application logs
journalctl -u stampcoin -f

# Check Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🔐 Security Configuration

### SSL/TLS Hardening
```bash
# Test SSL configuration
openssl s_client -connect stampcoin.com:443

# Check SSL rating
# Visit: https://www.ssllabs.com/ssltest/
# Enter: stampcoin.com
# Target: A+ rating

# Nginx SSL optimization (already in deploy script)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_stapling on;
ssl_stapling_verify on;
```

### Firewall Rules
```bash
# UFW (Uncomplicated Firewall) - already configured by script

# View current rules
ufw status verbose

# Additional rules if needed
ufw allow from YOUR_OFFICE_IP to any port 22  # Restrict SSH
ufw limit 22/tcp  # Rate limit SSH

# Advanced: Block countries (if needed)
apt install xtables-addons-common
# Configure GeoIP blocking
```

### Fail2Ban Configuration
```bash
# Check Fail2Ban status
fail2ban-client status

# View banned IPs
fail2ban-client status sshd
fail2ban-client status nginx-http-auth

# Unban IP if needed
fail2ban-client set sshd unbanip 1.2.3.4

# Custom jail for application
cat >> /etc/fail2ban/jail.local <<EOF
[stampcoin-api]
enabled = true
port = http,https
filter = stampcoin-api
logpath = /var/log/nginx/access.log
maxretry = 10
findtime = 60
bantime = 3600
EOF

# Create filter
cat > /etc/fail2ban/filter.d/stampcoin-api.conf <<EOF
[Definition]
failregex = ^<HOST>.*"POST /api/auth/login.*" 401
            ^<HOST>.*"POST /api/.*" 429
ignoreregex =
EOF

# Restart Fail2Ban
systemctl restart fail2ban
```

---

## 📊 Monitoring & Alerts

### Setup Monitoring Dashboard
```bash
# Install monitoring tools
apt install -y prometheus node-exporter grafana

# Configure Prometheus
cat > /etc/prometheus/prometheus.yml <<EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
  
  - job_name: 'stampcoin'
    static_configs:
      - targets: ['localhost:3000']
EOF

# Start services
systemctl enable --now prometheus
systemctl enable --now node-exporter
systemctl enable --now grafana-server

# Access Grafana
# URL: http://217.160.123.45:3000
# Default login: admin/admin
```

### Setup UptimeRobot
```
1. Visit: https://uptimerobot.com
2. Create free account
3. Add monitors:

   Monitor 1: Main Website
   - Type: HTTP(s)
   - URL: https://stampcoin.com
   - Check interval: 5 minutes
   - Alert: Email + SMS
   
   Monitor 2: API Health
   - Type: HTTP(s)
   - URL: https://api.stampcoin.com/health
   - Check interval: 5 minutes
   - Alert: Email
   
   Monitor 3: MySQL Port
   - Type: Port
   - IP: 217.160.123.45
   - Port: 3306
   - Check interval: 5 minutes
   
   Monitor 4: Redis Port
   - Type: Port
   - IP: 217.160.123.45
   - Port: 6379
   - Check interval: 5 minutes
```

### Email Alerts
```bash
# Install mail utilities
apt install -y mailutils

# Configure postfix to use IONOS SMTP
dpkg-reconfigure postfix
# Select: Internet Site
# System mail name: stampcoin.com

# Test email
echo "Test email from StampCoin server" | mail -s "Test" admin@stampcoin.com

# Setup monitoring alerts
cat > /usr/local/bin/alert-check.sh <<'EOF'
#!/bin/bash

ADMIN_EMAIL="admin@stampcoin.com"

# Check service
if ! systemctl is-active --quiet stampcoin; then
    echo "StampCoin service DOWN!" | mail -s "CRITICAL: Service Down" $ADMIN_EMAIL
fi

# Check disk
DISK=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK -gt 85 ]; then
    echo "Disk usage: ${DISK}%" | mail -s "WARNING: High Disk Usage" $ADMIN_EMAIL
fi

# Check memory
MEM=$(free | grep Mem | awk '{printf "%.0f", ($3/$2)*100}')
if [ $MEM -gt 90 ]; then
    echo "Memory usage: ${MEM}%" | mail -s "WARNING: High Memory" $ADMIN_EMAIL
fi

# Check SSL expiry
DAYS=$(echo | openssl s_client -servername stampcoin.com -connect stampcoin.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2 | xargs -I{} date -d {} +%s)
NOW=$(date +%s)
DAYS_LEFT=$(( ($DAYS - $NOW) / 86400 ))
if [ $DAYS_LEFT -lt 30 ]; then
    echo "SSL expires in ${DAYS_LEFT} days!" | mail -s "WARNING: SSL Expiring" $ADMIN_EMAIL
fi
EOF

chmod +x /usr/local/bin/alert-check.sh

# Run every 15 minutes
(crontab -l; echo "*/15 * * * * /usr/local/bin/alert-check.sh") | crontab -
```

---

## ⚡ Performance Optimization

### MySQL Tuning
```bash
# Install tuning script
wget https://raw.githubusercontent.com/major/MySQLTuner-perl/master/mysqltuner.pl
chmod +x mysqltuner.pl

# Run analysis
./mysqltuner.pl

# Apply recommended settings
nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add optimizations:
[mysqld]
# InnoDB settings
innodb_buffer_pool_size = 8G  # 50% of RAM
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Query cache
query_cache_type = 1
query_cache_size = 256M

# Connection pool
max_connections = 200
thread_cache_size = 100

# Restart MySQL
systemctl restart mysql
```

### Redis Optimization
```bash
# Edit Redis config
nano /etc/redis/redis.conf

# Optimize settings:
maxmemory 1gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000

# Enable persistence
appendonly yes
appendfsync everysec

# Restart Redis
systemctl restart redis-server
```

### Nginx Optimization
```nginx
# Already configured in deploy script
# Additional tuning if needed:

http {
    # Worker processes (= CPU cores)
    worker_processes auto;
    worker_connections 2048;
    
    # Keepalive
    keepalive_timeout 65;
    keepalive_requests 100;
    
    # Buffers
    client_body_buffer_size 128k;
    client_max_body_size 50m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    
    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;
    
    # Gzip (already enabled)
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### CDN Configuration
```
IONOS Control Panel → CDN → Settings

Cache Rules:
  Static Assets (images, fonts):
    - Cache TTL: 1 year
    - Query string: Ignore
  
  CSS/JavaScript:
    - Cache TTL: 1 month
    - Query string: Include (for versioning)
  
  HTML:
    - Cache TTL: 1 hour
    - Query string: Include
  
  API Responses:
    - Cache TTL: None (no cache)

Optimization:
  ✅ Image compression (80% quality)
  ✅ WebP conversion (automatic)
  ✅ Lazy loading
  ✅ Minification (CSS/JS)
  ✅ Brotli compression

Purge Cache:
  - Automatic: On deployment
  - Manual: Dashboard button
  - API: https://api.ionos.com/cdn/purge
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: Website Not Loading
```bash
# Check Nginx status
systemctl status nginx

# Check error logs
tail -50 /var/log/nginx/error.log

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx

# Check firewall
ufw status
# Ensure ports 80 and 443 are open

# Check DNS
dig stampcoin.com
# Verify IP matches your VPS
```

#### Issue 2: SSL Certificate Errors
```bash
# Check certificate status
certbot certificates

# Renew certificate
certbot renew --force-renewal

# Check certificate files
ls -la /etc/letsencrypt/live/stampcoin.com/

# Test SSL
openssl s_client -connect stampcoin.com:443 -servername stampcoin.com

# If failed, regenerate
certbot delete --cert-name stampcoin.com
certbot --nginx -d stampcoin.com -d www.stampcoin.com -d api.stampcoin.com
```

#### Issue 3: Application Not Starting
```bash
# Check service status
systemctl status stampcoin

# View logs
journalctl -u stampcoin -n 100 --no-pager

# Check for errors
journalctl -u stampcoin -p err -n 50

# Manual start (for debugging)
cd /var/www/stampcoin
NODE_ENV=production pnpm start

# Check dependencies
cd /var/www/stampcoin
pnpm install

# Rebuild
pnpm build

# Restart service
systemctl restart stampcoin
```

#### Issue 4: Database Connection Errors
```bash
# Check MySQL status
systemctl status mysql

# Check MySQL logs
tail -50 /var/log/mysql/error.log

# Test connection
mysql -u stampcoin_user -p stampcoin
# If fails, recreate user

# Check grants
mysql -uroot -p
SHOW GRANTS FOR 'stampcoin_user'@'localhost';

# Reset password if needed
ALTER USER 'stampcoin_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

#### Issue 5: High CPU/Memory Usage
```bash
# Monitor in real-time
htop

# Check process
ps aux --sort=-%cpu | head -10  # Top CPU
ps aux --sort=-%mem | head -10  # Top Memory

# Check application
pm2 logs  # If using PM2
journalctl -u stampcoin -f

# Restart if needed
systemctl restart stampcoin

# Check for memory leaks
node --trace-warnings --trace-deprecation /var/www/stampcoin/dist/index.js
```

#### Issue 6: Email Not Sending
```bash
# Test SMTP connection
telnet smtp.ionos.de 587

# Check SMTP logs
tail -50 /var/log/mail.log

# Test with PHP
php -r "mail('test@example.com', 'Test', 'Test email');"

# Verify SPF record
dig TXT stampcoin.com

# Check DMARC
dig TXT _dmarc.stampcoin.com

# Test email deliverability
# Use: https://www.mail-tester.com
```

---

## 💰 Detailed Pricing Breakdown

### Initial Costs

```
Domain Registration (Year 1):
  stampcoin.com            €1.00
  stampcoin.io             €39.00
  Domain Privacy           FREE
  ──────────────────────────────
  Subtotal                 €40.00

VPS Hosting (Month 1):
  VPS Linux XL             €20.00  (promotional)
  Setup Fee                €0.00   (waived)
  ──────────────────────────────
  Subtotal                 €20.00

Security (Month 1):
  SSL Wildcard             €8.33
  SiteLock Security Pro    €14.99
  Premium Backups          €7.99
  ──────────────────────────────
  Subtotal                 €31.31

Email (Month 1):
  5x Business Pro          €15.00  (5 x €3)
  ──────────────────────────────
  Subtotal                 €15.00

Performance (Month 1):
  CDN Pro                  €10.00
  ──────────────────────────────
  Subtotal                 €10.00

══════════════════════════════════
FIRST MONTH TOTAL:         €116.31
══════════════════════════════════
```

### Monthly Recurring (After Promotions)

```
VPS Hosting:              €40.00  (after 6 months)
Security Suite:           €31.31
Email (5 accounts):       €15.00
CDN Pro:                  €10.00
──────────────────────────────────
Monthly Total:            €96.31

Annual Total:             €1,155.72
```

### Annual Renewal Costs

```
Domain Renewals:
  stampcoin.com           €15.00
  stampcoin.io            €39.00
  ──────────────────────────────
  Domain Total            €54.00

Hosting & Services:       €1,155.72

══════════════════════════════════
TOTAL YEAR 2+:            €1,209.72
══════════════════════════════════
```

### Cost Optimization Options

```
Startup Package (Minimal):
  .com domain             €1.00
  VPS M (4GB)             €10.00/mo
  Free SSL                €0.00
  2 email accounts        €6.00/mo
  Basic security          €0.00
  No CDN                  €0.00
  ──────────────────────────────
  Monthly Cost            €16.00
  Annual Cost             ~€200

Professional Package (Recommended):
  Current selection       €76.00/mo
  Annual Cost             ~€912

Enterprise Package (Scale):
  Multiple domains        €80.00/yr
  VPS XXL (32GB)          €60.00/mo
  Dedicated IP            €5.00/mo
  Complete security       €30.00/mo
  Unlimited email         €25.00/mo
  Premium CDN             €20.00/mo
  Priority support        Included
  ──────────────────────────────
  Monthly Cost            €140.00
  Annual Cost             ~€1,760
```

### ROI Analysis

```
Monthly Infrastructure Cost: €76
Expected Monthly Users: 1,000
Cost per User: €0.076 (7.6 cents)

If Average Transaction: €50
Platform Fee (3%): €1.50
Transaction Volume Needed: 51 transactions/month
Break-even Point: ~5% user conversion

With 10% conversion (100 transactions):
  Revenue: €150
  Profit: €74
  ROI: 97%
```

---

## 📞 Support & Resources

### IONOS Support Channels

```
🇩🇪 Germany:
  Phone: +49 (0) 721 170 5000
  Hours: 24/7
  
🇬🇧 International:
  Phone: +44 (0) 20 3129 9950
  Hours: 24/7

📧 Email:
  support@ionos.de
  Response: Within 24 hours

💬 Live Chat:
  https://www.ionos.de/help
  Available: 24/7

📚 Documentation:
  https://www.ionos.de/hilfe
  Tutorials, guides, videos
```

### Useful Resources

```
IONOS Control Panel:
  https://my.ionos.de

Email Webmail:
  https://mail.ionos.de

Server Control Panel:
  https://cloud.ionos.de

DNS Management:
  https://my.ionos.de/dns

SSL Management:
  https://my.ionos.de/ssl

Billing & Invoices:
  https://my.ionos.de/billing
```

### Emergency Contacts

```
Critical Service Outage:
  +49 (0) 721 170 5000
  Select: Option 1 → Emergency

Security Incident:
  abuse@ionos.de
  Response: Immediate

Billing Issues:
  billing@ionos.de
  Response: Within 24 hours

Technical Support:
  support@ionos.de
  Response: Within 2 hours (priority customers)
```

---

## ✅ Final Checklist

```
Pre-Purchase:
  [ ] IONOS account created
  [ ] Payment method added
  [ ] Budget approved (~€76/month)

Purchase Complete:
  [ ] Domain registered (stampcoin.com)
  [ ] VPS ordered and provisioned
  [ ] Email accounts created
  [ ] SSL certificate ordered
  [ ] Security services activated
  [ ] CDN activated

Configuration:
  [ ] DNS records configured
  [ ] A records point to VPS IP
  [ ] MX records configured
  [ ] SPF/DKIM/DMARC records added
  [ ] SSL verified

Deployment:
  [ ] .env.deploy created with all secrets
  [ ] deploy-ionos.sh uploaded
  [ ] Deployment script executed successfully
  [ ] All services running
  [ ] Database migrated
  [ ] Files restored

Testing:
  [ ] Website loads on stampcoin.com
  [ ] API accessible at api.stampcoin.com
  [ ] SSL certificate valid (A+ rating)
  [ ] User registration works
  [ ] Login works (email + OAuth)
  [ ] Payments functional (test mode)
  [ ] Email sending works
  [ ] NFT features work

Production:
  [ ] Switch payment to live mode
  [ ] Update OAuth redirects
  [ ] Monitoring configured
  [ ] Backups verified
  [ ] Alerts configured
  [ ] Documentation updated
  [ ] Team trained

Post-Launch:
  [ ] Monitor for 48 hours
  [ ] Review logs daily
  [ ] Test all features
  [ ] Check performance metrics
  [ ] Verify backups working
  [ ] Security scan passed
```

---

**Setup Guide Version:** 1.0.0  
**Last Updated:** January 10, 2026  
**Prepared by:** StampCoin DevOps Team

**For assistance, contact:** admin@stampcoin.com

---

🎉 **You're now ready to deploy StampCoin on IONOS!**
