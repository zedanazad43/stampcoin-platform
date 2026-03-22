#!/bin/bash
# Stampcoin Platform - Quick Deploy Script

set -e

echo "🚀 Stampcoin Platform Deployment"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker.${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Node.js found${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Build Docker image
echo -e "${BLUE}Building Docker image...${NC}"
docker build -t stampcoin-platform:latest .
echo -e "${GREEN}✓ Docker image built${NC}"

# Ask for deployment platform
echo -e "${BLUE}Select deployment target:${NC}"
echo "1) Local Docker Compose"
echo "2) Fly.io"
echo "3) Render.com"
echo "4) Exit"

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo -e "${BLUE}Starting with Docker Compose...${NC}"
        docker compose up -d
        echo -e "${GREEN}✓ App running on http://localhost:8080${NC}"
        echo "Health check: curl http://localhost:8080/health"
        ;;
    2)
        echo -e "${BLUE}Deploying to Fly.io...${NC}"
        if ! command -v flyctl &> /dev/null; then
            echo -e "${RED}❌ Fly CLI not found. Install with: brew install flyctl${NC}"
            exit 1
        fi
        
        read -p "Enter app name (stampcoin-platform): " app_name
        app_name=${app_name:-stampcoin-platform}
        
        flyctl launch --name "$app_name"
        
        read -p "Enter SYNC_TOKEN (leave blank to generate): " sync_token
        if [ -z "$sync_token" ]; then
            sync_token=$(openssl rand -base64 32)
        fi
        
        flyctl secrets set SYNC_TOKEN="$sync_token"
        echo -e "${GREEN}✓ App deployed to Fly.io${NC}"
        echo "View dashboard: flyctl open"
        ;;
    3)
        echo -e "${BLUE}Opening Render deployment...${NC}"
        echo "1. Go to https://render.com/dashboard"
        echo "2. Click 'New +' → 'Web Service'"
        echo "3. Connect your GitHub repo"
        echo "4. Configure as per DEPLOYMENT.md"
        open "https://render.com/dashboard" 2>/dev/null || echo "Visit: https://render.com/dashboard"
        ;;
    4)
        echo "Cancelled."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}Deployment complete!${NC}"
