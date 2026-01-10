#!/bin/bash

# ============================================
# StampCoin Platform - Multi-Platform Deployment
# ============================================
# This script deploys to all configured platforms
# Requires: Railway, Vercel, Fly.io CLI tools and authentication

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  StampCoin Multi-Platform Deployment    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check authentication
check_auth() {
    local platform=$1
    local check_cmd=$2
    
    echo -e "${YELLOW}Checking $platform authentication...${NC}"
    if eval "$check_cmd" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ $platform: Authenticated${NC}"
        return 0
    else
        echo -e "${RED}✗ $platform: Not authenticated${NC}"
        return 1
    fi
}

# Pre-flight checks
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Pre-flight Checks${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Build project first
echo -e "${YELLOW}Building project...${NC}"
pnpm build && pnpm build:frontend
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Check CLI tools
echo -e "${YELLOW}Checking CLI tools...${NC}"
RAILWAY_OK=false
FLYIO_OK=false
VERCEL_OK=false

if command_exists railway; then
    echo -e "${GREEN}✓ Railway CLI installed${NC}"
    if check_auth "Railway" "railway whoami"; then
        RAILWAY_OK=true
    fi
else
    echo -e "${YELLOW}⚠ Railway CLI not installed${NC}"
fi

if command_exists flyctl; then
    echo -e "${GREEN}✓ Fly.io CLI installed${NC}"
    if check_auth "Fly.io" "flyctl auth whoami"; then
        FLYIO_OK=true
    fi
else
    echo -e "${YELLOW}⚠ Fly.io CLI not installed${NC}"
fi

if command_exists vercel; then
    echo -e "${GREEN}✓ Vercel CLI installed${NC}"
    if check_auth "Vercel" "vercel whoami"; then
        VERCEL_OK=true
    fi
else
    echo -e "${YELLOW}⚠ Vercel CLI not installed (run: npm i -g vercel)${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Deployment Options${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Available platforms:"
[ "$RAILWAY_OK" = true ] && echo -e "  ${GREEN}1. Railway (Backend + Database)${NC}" || echo -e "  ${RED}1. Railway (Not authenticated)${NC}"
[ "$FLYIO_OK" = true ] && echo -e "  ${GREEN}2. Fly.io (Full Stack)${NC}" || echo -e "  ${RED}2. Fly.io (Not authenticated)${NC}"
[ "$VERCEL_OK" = true ] && echo -e "  ${GREEN}3. Vercel (Frontend Only)${NC}" || echo -e "  ${RED}3. Vercel (Not authenticated)${NC}"
echo "  4. Deploy All (where authenticated)"
echo "  5. Exit"
echo ""

read -p "Select deployment option (1-5): " DEPLOY_OPTION

case $DEPLOY_OPTION in
    1)
        if [ "$RAILWAY_OK" = true ]; then
            echo -e "${BLUE}Deploying to Railway...${NC}"
            ./deploy-railway.sh
        else
            echo -e "${RED}Railway not authenticated. Run: railway login${NC}"
            exit 1
        fi
        ;;
    2)
        if [ "$FLYIO_OK" = true ]; then
            echo -e "${BLUE}Deploying to Fly.io...${NC}"
            flyctl deploy --remote-only
        else
            echo -e "${RED}Fly.io not authenticated. Run: flyctl auth login${NC}"
            exit 1
        fi
        ;;
    3)
        if [ "$VERCEL_OK" = true ]; then
            echo -e "${BLUE}Deploying to Vercel...${NC}"
            vercel --prod
        else
            echo -e "${RED}Vercel not authenticated. Run: vercel login${NC}"
            exit 1
        fi
        ;;
    4)
        echo -e "${BLUE}Deploying to all authenticated platforms...${NC}"
        echo ""
        
        if [ "$FLYIO_OK" = true ]; then
            echo -e "${BLUE}► Deploying to Fly.io...${NC}"
            flyctl deploy --remote-only &
            FLYIO_PID=$!
        fi
        
        if [ "$RAILWAY_OK" = true ]; then
            echo -e "${BLUE}► Deploying to Railway...${NC}"
            railway up &
            RAILWAY_PID=$!
        fi
        
        if [ "$VERCEL_OK" = true ]; then
            echo -e "${BLUE}► Deploying to Vercel...${NC}"
            vercel --prod &
            VERCEL_PID=$!
        fi
        
        # Wait for all deployments
        echo ""
        echo -e "${YELLOW}Waiting for deployments to complete...${NC}"
        
        [ ! -z "$FLYIO_PID" ] && wait $FLYIO_PID && echo -e "${GREEN}✓ Fly.io deployment complete${NC}"
        [ ! -z "$RAILWAY_PID" ] && wait $RAILWAY_PID && echo -e "${GREEN}✓ Railway deployment complete${NC}"
        [ ! -z "$VERCEL_PID" ] && wait $VERCEL_PID && echo -e "${GREEN}✓ Vercel deployment complete${NC}"
        ;;
    5)
        echo "Deployment cancelled."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Deployment Complete! 🚀              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "Check deployment status:"
[ "$RAILWAY_OK" = true ] && echo "  Railway:  railway status"
[ "$FLYIO_OK" = true ] && echo "  Fly.io:   flyctl status"
[ "$VERCEL_OK" = true ] && echo "  Vercel:   vercel inspect"
echo ""
