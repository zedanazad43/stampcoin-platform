#!/usr/bin/env bash
set -euo pipefail

# This script helps you set Stripe/PayPal secrets on Vercel, Railway, and Fly.io
# It will prompt you for values (leave blank to skip any provider).

ask() {
  local var="$1"; local prompt="$2"
  read -r -p "$prompt: " "$var" || true
  eval "export $var=\"${!var:-}\""
}

info() { printf "\n[INFO] %s\n" "$*"; }
success() { printf "\n[SUCCESS] %s\n" "$*"; }
warn() { printf "\n[WARN] %s\n" "$*"; }

info "Collecting Stripe keys (leave blank to skip)"
ask STRIPE_SECRET_KEY "Stripe Secret Key (sk_live_... or sk_test_...)"
ask STRIPE_PUBLISHABLE_KEY "Stripe Publishable Key (pk_live_... or pk_test_...)"
ask STRIPE_WEBHOOK_SECRET "Stripe Webhook Signing Secret (whsec_...)"

info "Collecting PayPal credentials (leave blank to skip)"
ask PAYPAL_CLIENT_ID "PayPal Client ID"
ask PAYPAL_CLIENT_SECRET "PayPal Client Secret"
ask PAYPAL_MODE "PayPal Mode (sandbox/live)"

info "Other (optional)"
ask DATABASE_URL "DATABASE_URL (MySQL connection string)"

printf "\nSelect targets to configure (y/N):\n"
read -r -p "Vercel? (y/N) " DO_VERCEL || true
read -r -p "Railway? (y/N) " DO_RAILWAY || true
read -r -p "Fly.io? (y/N) " DO_FLY || true

if [[ "${DO_VERCEL,,}" == "y" ]]; then
  info "Configuring Vercel env vars (production)"
  if command -v vercel >/dev/null 2>&1; then
    [[ -n "${STRIPE_SECRET_KEY:-}" ]] && printf "%s" "$STRIPE_SECRET_KEY" | vercel env add STRIPE_SECRET_KEY production || true
    [[ -n "${STRIPE_PUBLISHABLE_KEY:-}" ]] && printf "%s" "$STRIPE_PUBLISHABLE_KEY" | vercel env add STRIPE_PUBLISHABLE_KEY production || true
    [[ -n "${STRIPE_WEBHOOK_SECRET:-}" ]] && printf "%s" "$STRIPE_WEBHOOK_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET production || true
    [[ -n "${PAYPAL_CLIENT_ID:-}" ]] && printf "%s" "$PAYPAL_CLIENT_ID" | vercel env add PAYPAL_CLIENT_ID production || true
    [[ -n "${PAYPAL_CLIENT_SECRET:-}" ]] && printf "%s" "$PAYPAL_CLIENT_SECRET" | vercel env add PAYPAL_CLIENT_SECRET production || true
    [[ -n "${PAYPAL_MODE:-}" ]] && printf "%s" "$PAYPAL_MODE" | vercel env add PAYPAL_MODE production || true
    printf "true" | vercel env add PAYPAL_ENABLED production || true
    [[ -n "${DATABASE_URL:-}" ]] && printf "%s" "$DATABASE_URL" | vercel env add DATABASE_URL production || true
    success "Vercel env vars attempted."
  else
    warn "Vercel CLI not found. Install with: npm i -g vercel"
  fi
fi

if [[ "${DO_RAILWAY,,}" == "y" ]]; then
  info "Configuring Railway variables"
  if command -v railway >/dev/null 2>&1; then
    [[ -n "${STRIPE_SECRET_KEY:-}" ]] && railway variables set STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" || true
    [[ -n "${STRIPE_PUBLISHABLE_KEY:-}" ]] && railway variables set STRIPE_PUBLISHABLE_KEY="$STRIPE_PUBLISHABLE_KEY" || true
    [[ -n "${STRIPE_WEBHOOK_SECRET:-}" ]] && railway variables set STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET" || true
    [[ -n "${PAYPAL_CLIENT_ID:-}" ]] && railway variables set PAYPAL_CLIENT_ID="$PAYPAL_CLIENT_ID" || true
    [[ -n "${PAYPAL_CLIENT_SECRET:-}" ]] && railway variables set PAYPAL_CLIENT_SECRET="$PAYPAL_CLIENT_SECRET" || true
    [[ -n "${PAYPAL_MODE:-}" ]] && railway variables set PAYPAL_MODE="$PAYPAL_MODE" || true
    railway variables set PAYPAL_ENABLED=true || true
    [[ -n "${DATABASE_URL:-}" ]] && railway variables set DATABASE_URL="$DATABASE_URL" || true
    success "Railway env vars set."
  else
    warn "Railway CLI not found. Install with: npm i -g @railway/cli"
  fi
fi

if [[ "${DO_FLY,,}" == "y" ]]; then
  info "Configuring Fly.io secrets"
  if command -v fly >/dev/null 2>&1; then
    [[ -n "${STRIPE_SECRET_KEY:-}" ]] && fly secrets set STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" || true
    [[ -n "${STRIPE_PUBLISHABLE_KEY:-}" ]] && fly secrets set STRIPE_PUBLISHABLE_KEY="$STRIPE_PUBLISHABLE_KEY" || true
    [[ -n "${STRIPE_WEBHOOK_SECRET:-}" ]] && fly secrets set STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET" || true
    [[ -n "${PAYPAL_CLIENT_ID:-}" ]] && fly secrets set PAYPAL_CLIENT_ID="$PAYPAL_CLIENT_ID" || true
    [[ -n "${PAYPAL_CLIENT_SECRET:-}" ]] && fly secrets set PAYPAL_CLIENT_SECRET="$PAYPAL_CLIENT_SECRET" || true
    [[ -n "${PAYPAL_MODE:-}" ]] && fly secrets set PAYPAL_MODE="$PAYPAL_MODE" || true
    fly secrets set PAYPAL_ENABLED=true || true
    [[ -n "${DATABASE_URL:-}" ]] && fly secrets set DATABASE_URL="$DATABASE_URL" || true
    success "Fly.io secrets set."
  else
    warn "Fly.io CLI not found. Install with: curl -L https://fly.io/install.sh | sh"
  fi
fi

success "All done. Redeploy your apps to apply changes."
