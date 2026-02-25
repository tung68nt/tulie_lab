#!/bin/bash
# ==============================================
# Manual Deployment Script for Academy Tulie
# Run this on the VPS to deploy manually
# Usage: cd /opt/academy-tulie && bash scripts/deploy.sh
# ==============================================

set -e

DEPLOY_DIR="/opt/academy-tulie"
ENV_FILE="$DEPLOY_DIR/.env.production"

echo "🚀 Deploying Academy Tulie..."

# Ensure we're in the right directory
cd "$DEPLOY_DIR"

# Check env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env.production not found! Run setup-vps.sh first."
    exit 1
fi

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Build and start with Docker Compose
echo "🏗️ Building images..."
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" build

echo "🚀 Starting services..."
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 5

# Run database migrations
echo "🗄️ Running migrations..."
docker compose -f docker-compose.prod.yml exec -T server npx prisma migrate deploy

# Clean up old images
echo "🧹 Cleaning up..."
docker image prune -f

# Health check
echo "🩺 Checking health..."
for i in {1..20}; do
    echo "  Attempt $i..."
    CURL_OUT=$(curl -sf http://localhost:5001/api/health || echo "CURL_ERROR")
    if echo "$CURL_OUT" | grep -q '"status":"ok"'; then
        echo ""
        echo "✅ Deployment successful!"
        echo "📊 Service status:"
        docker compose -f docker-compose.prod.yml ps
        exit 0
    fi
    
    if [ "$CURL_OUT" != "CURL_ERROR" ]; then
        echo "  API Response: $CURL_OUT"
    fi
    sleep 10
done

echo ""
echo "❌ Health check failed. Check logs:"
docker compose -f docker-compose.prod.yml logs --tail 100
exit 1
