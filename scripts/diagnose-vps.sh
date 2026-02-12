#!/bin/bash
# VPS Diagnostic Script for Tulie Deployment

echo "🔍 Checking VPS Status..."

# 1. Check Directory
echo "📁 Checking deployment directory /srv/thelab.tulie.vn..."
if [ -d "/srv/thelab.tulie.vn" ]; then
    echo "✅ Directory exists."
    ls -la /srv/thelab.tulie.vn
else
    echo "❌ Directory /srv/thelab.tulie.vn NOT found!"
fi

# 2. Check Port 80/443
echo "🔌 Checking ports 80 and 443..."
NETSTAT_80=$(netstat -tuln | grep :80)
if [ -n "$NETSTAT_80" ]; then
    echo "⚠️ Port 80 is already occupied by:"
    echo "$NETSTAT_80"
else
    echo "✅ Port 80 is free."
fi

# 3. Check Docker
echo "🐳 Checking Docker status..."
docker --version && docker compose version || echo "❌ Docker or Docker Compose not found!"

# 4. Check .env.production
echo "🔑 Checking .env.production..."
if [ -f "/srv/thelab.tulie.vn/.env.production" ]; then
    echo "✅ .env.production exists."
else
    echo "❌ .env.production is MISSING in /srv/thelab.tulie.vn!"
fi
