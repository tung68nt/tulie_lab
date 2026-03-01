# Build Stage
FROM node:20-slim AS builder

# Install OpenSSL for Prisma (Debian)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY server/package*.json ./
COPY prisma ./prisma/

# Install dependencies (incl dev for build)
RUN npm ci --include=dev

# Generate Prisma Client
RUN npx prisma generate

# Copy source
COPY server/ .

# Build
RUN npm run build

# Production Stage
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install OpenSSL (for Prisma) and curl (for Healthcheck)
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY server/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy built artifacts and Prisma configuration
RUN mkdir -p /app/uploads
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 8080

# Health check using curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

CMD ["node", "dist/index.js"]
