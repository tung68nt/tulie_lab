#!/bin/bash
# ============================================
# Migrate VPS from /opt/academy-tulie to /srv/ multi-site layout
# Usage: bash scripts/migrate-to-srv.sh
# ============================================

set -euo pipefail

SITE_DOMAIN="thelab.tulie.vn"
OLD_DIR="/opt/academy-tulie"
NEW_DIR="/srv/${SITE_DOMAIN}"
NGINX_DIR="/srv/nginx"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

echo "============================================"
echo "  Multi-Site Migration: /opt → /srv/"
echo "============================================"
echo ""

# ----------------------------------------
# Step 1: Stop existing containers
# ----------------------------------------
echo "→ Step 1: Stopping existing containers..."
if [ -d "$OLD_DIR" ]; then
    cd "$OLD_DIR"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down 2>/dev/null || true
    echo "  ✓ Containers stopped"
else
    echo "  ⚠ $OLD_DIR does not exist, skipping stop"
fi

# ----------------------------------------
# Step 2: Create /srv/ structure
# ----------------------------------------
echo ""
echo "→ Step 2: Creating /srv/ directory structure..."
mkdir -p "$NEW_DIR"
mkdir -p "$NGINX_DIR/sites"
mkdir -p /var/www/certbot
echo "  ✓ Created $NEW_DIR"
echo "  ✓ Created $NGINX_DIR/sites"

# ----------------------------------------
# Step 3: Move project files
# ----------------------------------------
echo ""
echo "→ Step 3: Moving project files..."
if [ -d "$OLD_DIR" ] && [ "$OLD_DIR" != "$NEW_DIR" ]; then
    # Move everything except Docker volumes (they're managed by Docker)
    cp -a "$OLD_DIR/." "$NEW_DIR/"
    echo "  ✓ Files copied to $NEW_DIR"
    echo "  ⚠ Old directory kept at $OLD_DIR (remove manually after verification)"
else
    echo "  ⚠ Already at target location or old dir missing"
fi

# ----------------------------------------
# Step 4: Add port config to .env.production
# ----------------------------------------
echo ""
echo "→ Step 4: Updating .env.production with port config..."
cd "$NEW_DIR"
if ! grep -q "CLIENT_PORT" "$ENV_FILE" 2>/dev/null; then
    cat >> "$ENV_FILE" << 'EOF'

# ============================================
# Multi-Site Port Configuration
# Each site uses unique ports to avoid conflicts
# ============================================
COMPOSE_PROJECT_NAME=tulie
CLIENT_PORT=3001
SERVER_PORT=5001
EOF
    echo "  ✓ Added CLIENT_PORT=3001, SERVER_PORT=5001"
else
    echo "  ⚠ Port config already exists in $ENV_FILE"
fi

# ----------------------------------------
# Step 5: Install shared Nginx
# ----------------------------------------
echo ""
echo "→ Step 5: Setting up shared Nginx..."

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "  Installing Nginx..."
    apt-get update -qq && apt-get install -y -qq nginx certbot python3-certbot-nginx
    echo "  ✓ Nginx + Certbot installed"
else
    echo "  ✓ Nginx already installed"
fi

# Copy shared Nginx config
if [ -f "$NEW_DIR/deploy/nginx/nginx.conf" ]; then
    cp "$NEW_DIR/deploy/nginx/nginx.conf" "$NGINX_DIR/nginx.conf"
    echo "  ✓ Main nginx.conf → $NGINX_DIR/nginx.conf"
fi

# Copy site config
if [ -f "$NEW_DIR/deploy/nginx/sites/${SITE_DOMAIN}.conf" ]; then
    cp "$NEW_DIR/deploy/nginx/sites/${SITE_DOMAIN}.conf" "$NGINX_DIR/sites/${SITE_DOMAIN}.conf"
    echo "  ✓ Site config → $NGINX_DIR/sites/${SITE_DOMAIN}.conf"
fi

# Link to Nginx
ln -sf "$NGINX_DIR/nginx.conf" /etc/nginx/nginx.conf
echo "  ✓ Symlinked /etc/nginx/nginx.conf → $NGINX_DIR/nginx.conf"

# Test Nginx config
nginx -t 2>&1 && echo "  ✓ Nginx config test passed" || echo "  ✗ Nginx config test FAILED"

# ----------------------------------------
# Step 6: Pull latest and rebuild
# ----------------------------------------
echo ""
echo "→ Step 6: Pulling latest code and starting containers..."
cd "$NEW_DIR"
git pull origin main 2>/dev/null || true

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build
echo "  ✓ Containers started"

# ----------------------------------------
# Step 7: Restart Nginx
# ----------------------------------------
echo ""
echo "→ Step 7: Starting host Nginx..."
systemctl enable nginx
systemctl restart nginx
echo "  ✓ Host Nginx started"

# ----------------------------------------
# Step 8: Verify
# ----------------------------------------
echo ""
echo "→ Step 8: Verification..."
sleep 5

echo "  Containers:"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null || docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps

echo ""
echo "  Health checks:"
CLIENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "ERR")
SERVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/health 2>/dev/null || echo "ERR")
NGINX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null || echo "ERR")

echo "  Client  (localhost:3001): $CLIENT_STATUS"
echo "  Server  (localhost:5001): $SERVER_STATUS"
echo "  Nginx   (localhost:80):   $NGINX_STATUS"

echo ""
echo "============================================"
echo "  Migration Complete!"
echo "============================================"
echo ""
echo "  Site:  $NEW_DIR"
echo "  Nginx: $NGINX_DIR"
echo ""
echo "  Next steps:"
echo "  1. Point DNS for $SITE_DOMAIN → $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_IP')"
echo "  2. Run: certbot --nginx -d $SITE_DOMAIN"
echo "  3. Remove old dir: rm -rf $OLD_DIR"
echo ""
