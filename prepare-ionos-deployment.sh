#!/bin/bash

##############################################################################
# Quick IONOS Deployment Helper
# Automates the deployment preparation process
##############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         StampCoin - IONOS Deployment Helper                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if .env.deploy exists
if [ ! -f ".env.deploy" ]; then
    echo -e "${YELLOW}⚠ .env.deploy not found!${NC}"
    echo "Creating from template..."
    cp .env.deploy.example .env.deploy
    echo -e "${GREEN}✓ Created .env.deploy${NC}"
    echo ""
    echo -e "${RED}IMPORTANT: Edit .env.deploy and fill in all values before proceeding!${NC}"
    echo ""
    echo "Required values:"
    echo "  - MySQL passwords"
    echo "  - Application secrets"
    echo "  - Pinata API keys"
    echo "  - Blockchain configuration"
    echo "  - Payment gateway credentials"
    echo "  - OAuth credentials"
    echo "  - AWS credentials"
    echo "  - SMTP password"
    echo ""
    echo "Generate secure passwords with:"
    echo "  openssl rand -base64 32  # for passwords"
    echo "  openssl rand -hex 32     # for secrets"
    echo ""
    exit 1
fi

# Check if variables are filled
EMPTY_VARS=$(grep -E '=""$' .env.deploy | wc -l)
if [ $EMPTY_VARS -gt 0 ]; then
    echo -e "${RED}✗ Found $EMPTY_VARS empty variables in .env.deploy${NC}"
    echo ""
    echo "Empty variables:"
    grep -E '=""$' .env.deploy
    echo ""
    echo "Please fill in all required values before deploying."
    exit 1
fi

echo -e "${GREEN}✓ All environment variables are filled${NC}"
echo ""

# Prompt for VPS IP
read -p "Enter your IONOS VPS IP address: " VPS_IP

if [ -z "$VPS_IP" ]; then
    echo -e "${RED}✗ VPS IP is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Preparing deployment files...${NC}"

# Make deployment script executable
chmod +x deploy-ionos.sh
echo -e "${GREEN}✓ Made deploy-ionos.sh executable${NC}"

# Test SSH connection
echo ""
echo -e "${YELLOW}Testing SSH connection to ${VPS_IP}...${NC}"
if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@${VPS_IP} "echo 'SSH connection successful'" 2>/dev/null; then
    echo -e "${GREEN}✓ SSH connection successful${NC}"
else
    echo -e "${RED}✗ Cannot connect to ${VPS_IP}${NC}"
    echo "Please ensure:"
    echo "  1. VPS IP is correct"
    echo "  2. SSH port 22 is open"
    echo "  3. Root access is enabled"
    echo "  4. You have the correct SSH key or password"
    exit 1
fi

# Upload files
echo ""
echo -e "${BLUE}Uploading deployment files to VPS...${NC}"

scp deploy-ionos.sh root@${VPS_IP}:/root/
echo -e "${GREEN}✓ Uploaded deploy-ionos.sh${NC}"

scp .env.deploy root@${VPS_IP}:/root/
echo -e "${GREEN}✓ Uploaded .env.deploy${NC}"

scp ionos-config.yml root@${VPS_IP}:/root/
echo -e "${GREEN}✓ Uploaded ionos-config.yml${NC}"

# Ask about backups
echo ""
read -p "Do you have database/files backups to upload? (y/n): " HAS_BACKUPS

if [ "$HAS_BACKUPS" = "y" ] || [ "$HAS_BACKUPS" = "Y" ]; then
    echo ""
    echo "Please place backup files in the current directory with these names:"
    echo "  - stampcoin_backup_YYYYMMDD.sql.gz (database backup)"
    echo "  - uploads_backup_YYYYMMDD.tar.gz (file uploads)"
    echo "  - ipfs_backup_YYYYMMDD.tar.gz (IPFS data, optional)"
    echo ""
    read -p "Press Enter when ready to upload backups..."
    
    for file in stampcoin_backup_*.sql.gz uploads_backup_*.tar.gz ipfs_backup_*.tar.gz; do
        if [ -f "$file" ]; then
            echo "Uploading $file..."
            scp "$file" root@${VPS_IP}:/root/
            echo -e "${GREEN}✓ Uploaded $file${NC}"
        fi
    done
fi

# Summary
echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              Deployment Files Ready!                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo "All files have been uploaded to your VPS at ${VPS_IP}"
echo ""
echo "Next steps:"
echo ""
echo "1. SSH to your VPS:"
echo -e "   ${YELLOW}ssh root@${VPS_IP}${NC}"
echo ""
echo "2. Run the deployment script:"
echo -e "   ${YELLOW}cd /root${NC}"
echo -e "   ${YELLOW}./deploy-ionos.sh${NC}"
echo ""
echo "3. Monitor the deployment (takes ~10-15 minutes):"
echo -e "   ${YELLOW}tail -f /var/log/syslog${NC}"
echo ""
echo "4. After deployment, verify services:"
echo -e "   ${YELLOW}systemctl status stampcoin${NC}"
echo -e "   ${YELLOW}systemctl status nginx${NC}"
echo -e "   ${YELLOW}systemctl status mysql${NC}"
echo ""
echo "5. Access your website:"
echo -e "   ${YELLOW}https://stampcoin.com${NC}"
echo ""
echo -e "${BLUE}📚 For detailed instructions, see IONOS_MIGRATION_GUIDE.md${NC}"
echo ""

# Ask if user wants to SSH now
read -p "Do you want to SSH to the VPS now? (y/n): " SSH_NOW

if [ "$SSH_NOW" = "y" ] || [ "$SSH_NOW" = "Y" ]; then
    echo ""
    echo "Connecting to ${VPS_IP}..."
    ssh root@${VPS_IP}
fi

echo ""
echo -e "${GREEN}Good luck with your deployment! 🚀${NC}"
