#!/bin/bash

# ============================================
# StampCoin Domain Setup Script
# إعداد النطاقات تلقائياً
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  StampCoin Domain Setup                  ║${NC}"
echo -e "${BLUE}║  إعداد نطاقات StampCoin                 ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo -e "${RED}✗ Fly.io CLI not installed${NC}"
    echo "Install: curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check authentication
if ! flyctl auth whoami &> /dev/null; then
    echo -e "${RED}✗ Not logged in to Fly.io${NC}"
    echo "Run: flyctl auth login"
    exit 1
fi

echo -e "${GREEN}✓ Fly.io CLI ready${NC}"
echo ""

# Domain configuration
declare -A DOMAINS=(
    ["stampcoin.com"]="primary"
    ["www.stampcoin.com"]="www"
    ["api.stampcoin.com"]="api"
    ["admin.stampcoin.com"]="admin"
    ["docs.stampcoin.com"]="docs"
    ["blog.stampcoin.com"]="blog"
    ["status.stampcoin.com"]="status"
)

# Additional optional domains
declare -A OPTIONAL_DOMAINS=(
    ["stampcoin.io"]="alternate"
    ["www.stampcoin.io"]="www-alt"
    ["stampcoin.app"]="app"
    ["stampcoin.xyz"]="backup"
)

# Function to add domain to Fly.io
add_domain() {
    local domain=$1
    local type=$2
    
    echo -e "${YELLOW}Adding $domain ($type)...${NC}"
    
    if flyctl certs add "$domain" 2>/dev/null; then
        echo -e "${GREEN}✓ $domain added successfully${NC}"
        
        # Get DNS records
        echo -e "${BLUE}DNS Records for $domain:${NC}"
        flyctl certs show "$domain" 2>/dev/null | grep -E "CNAME|Record" || true
        echo ""
        return 0
    else
        echo -e "${RED}✗ Failed to add $domain${NC}"
        return 1
    fi
}

# Function to check domain status
check_domain() {
    local domain=$1
    echo -e "${YELLOW}Checking $domain...${NC}"
    flyctl certs check "$domain" 2>/dev/null || echo -e "${YELLOW}⚠ Not configured yet${NC}"
    echo ""
}

# Main menu
echo "Select domain setup option:"
echo "1. Setup primary domains only (stampcoin.com, www, api)"
echo "2. Setup all recommended domains"
echo "3. Setup custom domain"
echo "4. Check domain status"
echo "5. Remove domain"
echo "6. Generate DNS configuration guide"
echo "7. Exit"
echo ""

read -p "Enter option (1-7): " OPTION

case $OPTION in
    1)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}Setting up primary domains${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        PRIMARY=("stampcoin.com" "www.stampcoin.com" "api.stampcoin.com")
        
        for domain in "${PRIMARY[@]}"; do
            add_domain "$domain" "${DOMAINS[$domain]}"
            sleep 1
        done
        ;;
        
    2)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}Setting up all recommended domains${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        for domain in "${!DOMAINS[@]}"; do
            add_domain "$domain" "${DOMAINS[$domain]}"
            sleep 1
        done
        
        echo ""
        read -p "Add optional domains? (y/n): " ADD_OPTIONAL
        
        if [[ $ADD_OPTIONAL == "y" || $ADD_OPTIONAL == "Y" ]]; then
            for domain in "${!OPTIONAL_DOMAINS[@]}"; do
                add_domain "$domain" "${OPTIONAL_DOMAINS[$domain]}"
                sleep 1
            done
        fi
        ;;
        
    3)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}Add custom domain${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        read -p "Enter domain name: " CUSTOM_DOMAIN
        add_domain "$CUSTOM_DOMAIN" "custom"
        ;;
        
    4)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}Checking domain status${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        flyctl certs list
        echo ""
        
        read -p "Check specific domain? (enter domain or press Enter to skip): " CHECK_DOMAIN
        if [ ! -z "$CHECK_DOMAIN" ]; then
            check_domain "$CHECK_DOMAIN"
        fi
        ;;
        
    5)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}Remove domain${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        read -p "Enter domain to remove: " REMOVE_DOMAIN
        read -p "Are you sure you want to remove $REMOVE_DOMAIN? (yes/no): " CONFIRM
        
        if [ "$CONFIRM" == "yes" ]; then
            flyctl certs remove "$REMOVE_DOMAIN"
            echo -e "${GREEN}✓ $REMOVE_DOMAIN removed${NC}"
        else
            echo "Cancelled"
        fi
        ;;
        
    6)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}DNS Configuration Guide${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        cat << 'EOF'
# DNS Configuration for Namecheap/Cloudflare

## Step 1: Get Fly.io DNS Records
Run: flyctl certs show YOUR-DOMAIN.com

## Step 2: Add to your DNS provider

### Option A: CNAME (Recommended)
Type: CNAME
Host: @
Value: stampcoin-platform.fly.dev
TTL: Automatic

Type: CNAME
Host: www
Value: stampcoin-platform.fly.dev
TTL: Automatic

### Option B: A/AAAA Records
Get IPs from: flyctl ips list

Type: A
Host: @
Value: [IPv4 from flyctl ips list]
TTL: Automatic

Type: AAAA
Host: @
Value: [IPv6 from flyctl ips list]
TTL: Automatic

## Step 3: Wait for propagation (1-48 hours)
Check: https://www.whatsmydns.net

## Step 4: Verify SSL
curl -I https://YOUR-DOMAIN.com

EOF
        ;;
        
    7)
        echo "Goodbye!"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Domain Setup Complete! 🌐            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo "1. Configure DNS records in your domain registrar"
echo "2. Wait 1-48 hours for DNS propagation"
echo "3. Check status: flyctl certs list"
echo "4. Verify: curl -I https://your-domain.com"
echo ""
echo "For detailed guide, see: DOMAIN_SETUP_GUIDE.md"
