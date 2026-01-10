#!/bin/bash

##############################################################################
# StampCoin Platform - IONOS VPS Deployment Script
# Description: Complete deployment automation for IONOS VPS hosting
# Author: StampCoin Team
# Date: January 10, 2026
# Version: 1.0.0
##############################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="stampcoin"
PROJECT_DIR="/var/www/stampcoin"
REPO_URL="https://github.com/Stampcoin-platform/Stampcoin-platform.git"
NODE_VERSION="20"
DOMAIN="stampcoin.com"
VPS_USER="root"

##############################################################################
# Helper Functions
##############################################################################

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║         StampCoin Platform - IONOS VPS Deployment             ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
    print_success "Running as root"
}

##############################################################################
# System Update & Prerequisites
##############################################################################

update_system() {
    print_info "Updating system packages..."
    apt-get update -qq
    apt-get upgrade -y -qq
    apt-get install -y -qq \
        curl \
        wget \
        git \
        build-essential \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        ufw \
        fail2ban \
        unattended-upgrades \
        nginx \
        certbot \
        python3-certbot-nginx
    print_success "System updated and prerequisites installed"
}

##############################################################################
# Node.js Installation
##############################################################################

install_nodejs() {
    print_info "Installing Node.js ${NODE_VERSION}..."
    
    # Remove old Node.js if exists
    apt-get remove -y nodejs npm || true
    
    # Install Node.js via NodeSource
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
    
    # Install pnpm
    npm install -g pnpm@latest
    
    # Verify installations
    node_version=$(node --version)
    npm_version=$(npm --version)
    pnpm_version=$(pnpm --version)
    
    print_success "Node.js ${node_version} installed"
    print_success "npm ${npm_version} installed"
    print_success "pnpm ${pnpm_version} installed"
}

##############################################################################
# MySQL Installation
##############################################################################

install_mysql() {
    print_info "Installing MySQL 8.0..."
    
    # Install MySQL server
    apt-get install -y mysql-server
    
    # Secure MySQL installation
    mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';"
    mysql -e "DELETE FROM mysql.user WHERE User='';"
    mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
    mysql -e "DROP DATABASE IF EXISTS test;"
    mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
    mysql -e "FLUSH PRIVILEGES;"
    
    # Create database and user
    mysql -uroot -p${MYSQL_ROOT_PASSWORD} <<EOF
CREATE DATABASE IF NOT EXISTS ${PROJECT_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${PROJECT_NAME}_user'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON ${PROJECT_NAME}.* TO '${PROJECT_NAME}_user'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    print_success "MySQL installed and configured"
}

##############################################################################
# Redis Installation
##############################################################################

install_redis() {
    print_info "Installing Redis..."
    
    apt-get install -y redis-server
    
    # Configure Redis
    sed -i 's/^supervised no/supervised systemd/' /etc/redis/redis.conf
    sed -i 's/^# maxmemory <bytes>/maxmemory 256mb/' /etc/redis/redis.conf
    sed -i 's/^# maxmemory-policy noeviction/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf
    
    # Enable and start Redis
    systemctl enable redis-server
    systemctl restart redis-server
    
    print_success "Redis installed and configured"
}

##############################################################################
# Docker Installation (for IPFS)
##############################################################################

install_docker() {
    print_info "Installing Docker..."
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    apt-get update -qq
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Enable Docker
    systemctl enable docker
    systemctl start docker
    
    print_success "Docker installed"
}

##############################################################################
# Firewall Configuration
##############################################################################

configure_firewall() {
    print_info "Configuring firewall..."
    
    # Reset UFW
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH, HTTP, HTTPS
    ufw allow 22/tcp comment 'SSH'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    
    # Enable firewall
    ufw --force enable
    
    print_success "Firewall configured"
}

##############################################################################
# Fail2Ban Configuration
##############################################################################

configure_fail2ban() {
    print_info "Configuring Fail2Ban..."
    
    cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
EOF

    systemctl enable fail2ban
    systemctl restart fail2ban
    
    print_success "Fail2Ban configured"
}

##############################################################################
# Project Deployment
##############################################################################

deploy_project() {
    print_info "Deploying StampCoin platform..."
    
    # Create project directory
    mkdir -p ${PROJECT_DIR}
    cd ${PROJECT_DIR}
    
    # Clone repository
    if [ -d "${PROJECT_DIR}/.git" ]; then
        print_info "Repository exists, pulling latest changes..."
        git pull origin main
    else
        print_info "Cloning repository..."
        git clone ${REPO_URL} .
    fi
    
    # Install dependencies
    print_info "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Create .env file
    print_info "Creating environment configuration..."
    cat > .env <<EOF
# Database
DATABASE_URL="mysql://${PROJECT_NAME}_user:${MYSQL_PASSWORD}@localhost:3306/${PROJECT_NAME}"

# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Session
SESSION_SECRET=${SESSION_SECRET}

# JWT
JWT_SECRET=${JWT_SECRET}

# Redis
REDIS_URL="redis://localhost:6379"

# IPFS
IPFS_API_URL="http://localhost:5001"
IPFS_GATEWAY_URL="https://gateway.pinata.cloud"
PINATA_API_KEY=${PINATA_API_KEY}
PINATA_SECRET_KEY=${PINATA_SECRET_KEY}

# Blockchain
POLYGON_RPC_URL=${POLYGON_RPC_URL}
POLYGON_CHAIN_ID=137
CONTRACT_ADDRESS=${CONTRACT_ADDRESS}
FUNDER_PRIVATE_KEY=${FUNDER_PRIVATE_KEY}

# Payment - Cex.io
CEX_USER_ID="162853244"
CEX_WALLET_ADDRESS=${CEX_WALLET_ADDRESS}
CEX_API_KEY=${CEX_API_KEY}
CEX_API_SECRET=${CEX_API_SECRET}

# Payment - Stripe
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}

# Payment - PayPal
PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
PAYPAL_SECRET=${PAYPAL_SECRET}

# OAuth
GOOGLE_OAUTH_CLIENT_ID=${GOOGLE_OAUTH_CLIENT_ID}
GOOGLE_OAUTH_SECRET=${GOOGLE_OAUTH_SECRET}
GOOGLE_OAUTH_REDIRECT=${DOMAIN}/api/auth/google/callback

DISCORD_OAUTH_CLIENT_ID=${DISCORD_OAUTH_CLIENT_ID}
DISCORD_OAUTH_SECRET=${DISCORD_OAUTH_SECRET}
DISCORD_OAUTH_REDIRECT=${DOMAIN}/api/auth/discord/callback

# Storage
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_S3_BUCKET=${AWS_S3_BUCKET}
AWS_REGION=${AWS_REGION}

# Email
SMTP_HOST="smtp.ionos.de"
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER="noreply@${DOMAIN}"
SMTP_PASS=${SMTP_PASSWORD}
SMTP_FROM="StampCoin <noreply@${DOMAIN}>"

# URLs
FRONTEND_URL="https://${DOMAIN}"
BACKEND_URL="https://api.${DOMAIN}"
EOF

    # Run database migrations
    print_info "Running database migrations..."
    pnpm db:push
    
    # Build project
    print_info "Building project..."
    pnpm build
    
    print_success "Project deployed"
}

##############################################################################
# IPFS Setup
##############################################################################

setup_ipfs() {
    print_info "Setting up IPFS..."
    
    # Create docker-compose file for IPFS
    cat > ${PROJECT_DIR}/docker-compose.ipfs.yml <<'EOF'
version: '3.8'

services:
  ipfs:
    image: ipfs/go-ipfs:latest
    container_name: stampcoin-ipfs
    restart: unless-stopped
    environment:
      - IPFS_PROFILE=server
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
    volumes:
      - ipfs-data:/data/ipfs
    networks:
      - stampcoin-network

volumes:
  ipfs-data:

networks:
  stampcoin-network:
    driver: bridge
EOF

    # Start IPFS
    cd ${PROJECT_DIR}
    docker compose -f docker-compose.ipfs.yml up -d
    
    print_success "IPFS container started"
}

##############################################################################
# Nginx Configuration
##############################################################################

configure_nginx() {
    print_info "Configuring Nginx..."
    
    # Remove default config
    rm -f /etc/nginx/sites-enabled/default
    
    # Create main site configuration
    cat > /etc/nginx/sites-available/${PROJECT_NAME} <<EOF
# Rate limiting
limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=general_limit:10m rate=30r/s;

# Upstream backend
upstream backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

# HTTP redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN} api.${DOMAIN};
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://\$host\$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # SSL certificates (will be added by certbot)
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
    
    # Root directory
    root ${PROJECT_DIR}/dist/public;
    index index.html;
    
    # Static files with caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 90s;
    }
    
    # tRPC endpoint
    location /trpc/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # SPA fallback
    location / {
        limit_req zone=general_limit burst=50 nodelay;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}

# API subdomain
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.${DOMAIN};
    
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # Enable site
    ln -sf /etc/nginx/sites-available/${PROJECT_NAME} /etc/nginx/sites-enabled/
    
    # Test configuration
    nginx -t
    
    # Restart Nginx
    systemctl restart nginx
    
    print_success "Nginx configured"
}

##############################################################################
# SSL Certificate Setup
##############################################################################

setup_ssl() {
    print_info "Setting up SSL certificates..."
    
    # Create webroot directory for certbot
    mkdir -p /var/www/certbot
    
    # Obtain SSL certificate
    certbot --nginx \
        -d ${DOMAIN} \
        -d www.${DOMAIN} \
        -d api.${DOMAIN} \
        --non-interactive \
        --agree-tos \
        -m admin@${DOMAIN} \
        --redirect
    
    # Setup auto-renewal
    systemctl enable certbot.timer
    
    print_success "SSL certificates installed"
}

##############################################################################
# Systemd Service
##############################################################################

create_systemd_service() {
    print_info "Creating systemd service..."
    
    cat > /etc/systemd/system/${PROJECT_NAME}.service <<EOF
[Unit]
Description=StampCoin Platform
Documentation=https://github.com/Stampcoin-platform
After=network.target mysql.service redis.service

[Service]
Type=simple
User=root
WorkingDirectory=${PROJECT_DIR}
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=${PROJECT_NAME}

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=${PROJECT_DIR}

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd
    systemctl daemon-reload
    
    # Enable and start service
    systemctl enable ${PROJECT_NAME}
    systemctl start ${PROJECT_NAME}
    
    print_success "Systemd service created and started"
}

##############################################################################
# Monitoring Setup
##############################################################################

setup_monitoring() {
    print_info "Setting up monitoring..."
    
    # Install monitoring tools
    apt-get install -y htop iotop nethogs
    
    # Create monitoring script
    cat > /usr/local/bin/stampcoin-monitor.sh <<'EOF'
#!/bin/bash

echo "=== StampCoin Platform Monitoring ==="
echo ""
echo "System Status:"
echo "- Uptime: $(uptime -p)"
echo "- Load: $(uptime | awk -F'load average:' '{print $2}')"
echo ""
echo "Services:"
systemctl status stampcoin --no-pager -l | grep Active
systemctl status mysql --no-pager -l | grep Active
systemctl status redis --no-pager -l | grep Active
systemctl status nginx --no-pager -l | grep Active
echo ""
echo "Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}"
echo ""
echo "Disk Usage:"
df -h / | tail -n 1
echo ""
echo "Memory Usage:"
free -h | grep Mem
EOF

    chmod +x /usr/local/bin/stampcoin-monitor.sh
    
    print_success "Monitoring tools installed"
}

##############################################################################
# Backup Setup
##############################################################################

setup_backups() {
    print_info "Setting up automated backups..."
    
    # Create backup directory
    mkdir -p /var/backups/${PROJECT_NAME}
    
    # Create backup script
    cat > /usr/local/bin/stampcoin-backup.sh <<EOF
#!/bin/bash

BACKUP_DIR="/var/backups/${PROJECT_NAME}"
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\${BACKUP_DIR}/backup_\${DATE}.tar.gz"

# Database backup
mysqldump -u${PROJECT_NAME}_user -p${MYSQL_PASSWORD} ${PROJECT_NAME} | gzip > \${BACKUP_DIR}/db_\${DATE}.sql.gz

# Project files backup
tar -czf \${BACKUP_FILE} -C ${PROJECT_DIR} --exclude=node_modules --exclude=.git .

# Keep only last 7 days of backups
find \${BACKUP_DIR} -name "*.tar.gz" -mtime +7 -delete
find \${BACKUP_DIR} -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: \${BACKUP_FILE}"
EOF

    chmod +x /usr/local/bin/stampcoin-backup.sh
    
    # Add to crontab (daily at 2 AM)
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/stampcoin-backup.sh >> /var/log/stampcoin-backup.log 2>&1") | crontab -
    
    print_success "Automated backups configured"
}

##############################################################################
# Post-Deployment Checks
##############################################################################

post_deployment_checks() {
    print_info "Running post-deployment checks..."
    
    # Check services
    services=("${PROJECT_NAME}" "mysql" "redis" "nginx")
    for service in "${services[@]}"; do
        if systemctl is-active --quiet ${service}; then
            print_success "${service} is running"
        else
            print_error "${service} is not running"
        fi
    done
    
    # Check ports
    if netstat -tuln | grep -q ":443"; then
        print_success "HTTPS port (443) is listening"
    else
        print_warning "HTTPS port (443) is not listening"
    fi
    
    if netstat -tuln | grep -q ":3000"; then
        print_success "Backend port (3000) is listening"
    else
        print_warning "Backend port (3000) is not listening"
    fi
    
    # Check disk space
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ $disk_usage -lt 80 ]; then
        print_success "Disk usage: ${disk_usage}%"
    else
        print_warning "Disk usage high: ${disk_usage}%"
    fi
}

##############################################################################
# Main Deployment Flow
##############################################################################

main() {
    print_header
    
    # Check if running as root
    check_root
    
    # Load environment variables if exists
    if [ -f ".env.deploy" ]; then
        source .env.deploy
        print_success "Loaded deployment environment variables"
    else
        print_error "Missing .env.deploy file. Please create it with all required variables."
        exit 1
    fi
    
    # Deployment steps
    echo ""
    print_info "Starting deployment process..."
    echo ""
    
    update_system
    install_nodejs
    install_mysql
    install_redis
    install_docker
    configure_firewall
    configure_fail2ban
    deploy_project
    setup_ipfs
    configure_nginx
    setup_ssl
    create_systemd_service
    setup_monitoring
    setup_backups
    
    # Post-deployment
    echo ""
    post_deployment_checks
    
    # Final message
    echo ""
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║            Deployment Completed Successfully! 🎉              ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    print_info "Your StampCoin platform is now running at:"
    echo "  • Frontend: https://${DOMAIN}"
    echo "  • API: https://api.${DOMAIN}"
    echo ""
    print_info "Useful commands:"
    echo "  • Check status: systemctl status ${PROJECT_NAME}"
    echo "  • View logs: journalctl -u ${PROJECT_NAME} -f"
    echo "  • Monitor: /usr/local/bin/stampcoin-monitor.sh"
    echo "  • Backup: /usr/local/bin/stampcoin-backup.sh"
    echo ""
    print_warning "Don't forget to:"
    echo "  1. Configure DNS records to point to this server IP"
    echo "  2. Test all payment integrations"
    echo "  3. Review and secure your environment variables"
    echo "  4. Setup monitoring alerts"
    echo ""
}

# Run main function
main "$@"
