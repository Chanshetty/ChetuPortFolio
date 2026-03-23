# ─────────────────────────────────────────────────────────────
# Dockerfile for Laxman Portfolio
# Multi-stage build for production-ready image
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Base ─────────────────────────────────────────────
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# ── Stage 2: Dependencies ─────────────────────────────────────
FROM base AS deps

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# ── Stage 3: Production ───────────────────────────────────────
FROM node:20-alpine AS production

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser  -S nodeuser -u 1001

# Set working directory
WORKDIR /app

# Copy production dependencies from deps stage
COPY --from=deps --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodeuser:nodejs . .

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "server.js"]