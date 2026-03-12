# Multi-stage production Dockerfile for Stampcoin Platform
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for reproducible builds
RUN npm ci --production --silent && \
    npm cache clean --force

# Production stage
FROM node:18-alpine

WORKDIR /app

# Set metadata
LABEL org.opencontainers.image.title="Stampcoin Platform"
LABEL org.opencontainers.image.description="Blockchain-powered digital stamps, wallet and marketplace"
LABEL org.opencontainers.image.version="2.0.0"

# Install production dependencies only from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY server.js .
COPY wallet.js .
COPY market.js .
COPY blockchain.js .
COPY public ./public

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

# Environment configuration
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "server.js"]
