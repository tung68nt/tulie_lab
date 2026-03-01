# Build stage
FROM node:22-slim AS builder

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files from root context
COPY server/package*.json ./
COPY server/prisma ./prisma/

# Install dependencies (incl dev for build)
RUN npm ci --include=dev

# Generate Prisma Client (Explicit path)
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy source
COPY server/ .

# Build (seed and scripts are excluded in tsconfig.json)
RUN npm run build

# Runtime stage
FROM node:22-slim AS runner

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY server/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy built app
COPY --from=builder /app/dist ./dist

# Set env
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# Start app
CMD ["node", "dist/index.js"]
