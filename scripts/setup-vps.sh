#!/bin/bash
# ==============================================
# VPS Setup Script for Academy Tulie
# Run this ONCE on a fresh Vietnix VPS
# Usage: ssh root@your-vps-ip 'bash -s' < scripts/setup-vps.sh
# ==============================================

set -e

DOMAIN="thelab.tulie.vn"
DEPLOY_DIR="/opt/academy-tulie"
DEPLOY_USER="deploy"

echo "🚀 Setting up VPS for Academy Tulie..."

# 1. Update system
echo "📦 Updating system..."
apt-get update && apt-get upgrade -y

# 2. Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

# 3. Install Docker Compose plugin
echo "🐳 Installing Docker Compose..."
if ! docker compose version &> /dev/null; then
    apt-get install -y docker-compose-plugin
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

# 4. Create deploy user
echo "👤 Creating deploy user..."
if ! id "$DEPLOY_USER" &> /dev/null; then
    useradd -m -s /bin/bash -G docker "$DEPLOY_USER"
    echo "✅ User '$DEPLOY_USER' created"
else
    usermod -aG docker "$DEPLOY_USER"
    echo "✅ User '$DEPLOY_USER' already exists, added to docker group"
fi

# 5. Setup firewall
echo "🔥 Configuring firewall..."
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
echo "✅ Firewall configured (SSH, HTTP, HTTPS)"

# 6. Install Certbot for SSL
echo "🔒 Installing Certbot..."
apt-get install -y certbot
echo "✅ Certbot installed"

# 7. Clone repository
echo "📂 Setting up project directory..."
if [ ! -d "$DEPLOY_DIR" ]; then
    mkdir -p "$DEPLOY_DIR"
    echo "⚠️  Please clone the repository manually:"
    echo "    git clone https://github.com/tung68nt/tulie_lab.git $DEPLOY_DIR"
else
    echo "✅ Project directory exists"
fi

# 8. Create .env.production from template
echo "📝 Creating environment file..."
if [ ! -f "$DEPLOY_DIR/.env.production" ]; then
    cat > "$DEPLOY_DIR/.env.production" << 'EOF'
# =========================================
# Academy Tulie - Production Environment
# =========================================

# PostgreSQL
POSTGRES_USER=tulie
POSTGRES_PASSWORD=CHANGE_ME_TO_STRONG_PASSWORD
POSTGRES_DB=tulie_academy

# Application
JWT_SECRET=CHANGE_ME_TO_RANDOM_STRING
CLIENT_URL=https://thelab.tulie.vn

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudflare R2 (keep existing values)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_DOMAIN=

# Email (SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Payment
SEPAY_API_KEY=
SEPAY_SECRET_KEY=

# AI (optional)
ANTHROPIC_BASE_URL=
ANTHROPIC_MODEL=
ANTHROPIC_AUTH_TOKEN=
EOF
    echo "✅ .env.production created - PLEASE EDIT IT WITH YOUR VALUES!"
else
    echo "✅ .env.production already exists"
fi

# 9. Set ownership
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_DIR"

# 10. Setup SSH key for GitHub Actions
echo ""
echo "=========================================="
echo "✅ VPS SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "📋 Next steps:"
echo "  1. Clone the repository:"
echo "     git clone https://github.com/tung68nt/tulie_lab.git $DEPLOY_DIR"
echo ""
echo "  2. Edit the environment file:"
echo "     nano $DEPLOY_DIR/.env.production"
echo ""
echo "  3. Setup SSH key for deploy user (for GitHub Actions):"
echo "     su - $DEPLOY_USER"
echo "     ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ''"
echo "     cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys"
echo "     cat ~/.ssh/deploy_key  # Copy this to GitHub Secret VPS_SSH_KEY"
echo ""
echo "  4. Get SSL certificate:"
echo "     certbot certonly --standalone -d $DOMAIN"
echo ""
echo "  5. Start the application:"
echo "     cd $DEPLOY_DIR"
echo "     docker compose -f docker-compose.prod.yml --env-file .env.production up -d"
echo ""
echo "  6. Add GitHub Secrets:"
echo "     VPS_HOST = your-vps-ip"
echo "     VPS_USER = $DEPLOY_USER"
echo "     VPS_SSH_KEY = (from step 3)"
echo ""
echo "  7. Update Cloudflare DNS:"
echo "     A record: thelab.tulie.vn → your-vps-ip"
echo "=========================================="
