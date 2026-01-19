# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install ffmpeg for video processing and OpenSSL for Prisma
RUN apk add --no-cache ffmpeg openssl libc6-compat

# Copy package files for production deps only
COPY package*.json ./

# Copy Prisma files and generate client (needed for postinstall script)
COPY prisma ./prisma/

# Install production dependencies only
# We use --omit=dev and --ignore-scripts to avoid running postinstall (prisma generate)
# which would fail because prisma CLI is in devDependencies.
RUN npm ci --omit=dev --ignore-scripts

# Copy generated Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Start server
CMD ["node", "dist/index.js"]
