#!/bin/bash

# Quick DNS Setup for BOTH beta and production domains
# This script creates domain mappings for both domains

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Cloud Run Domain Mapping - FULL MIGRATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

REGION="asia-southeast1"

# Check gcloud
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI not found"
    echo "Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "📍 Region: $REGION"
echo ""

# ============================================
# BETA DOMAIN
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  BETA: beta.thelab.tulie.vn → academy-web-beta"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BETA_DOMAIN="beta.thelab.tulie.vn"
BETA_SERVICE="academy-web-beta"

# Check if mapping exists
if gcloud run domain-mappings describe "$BETA_DOMAIN" --region "$REGION" &> /dev/null; then
    echo "⚠️  Beta domain mapping already exists!"
    echo "Do you want to delete and recreate? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🗑️  Deleting existing beta mapping..."
        gcloud run domain-mappings delete "$BETA_DOMAIN" --region "$REGION" --quiet
        echo "✅ Deleted"
    else
        echo "ℹ️  Skipping beta domain mapping creation"
    fi
fi

if ! gcloud run domain-mappings describe "$BETA_DOMAIN" --region "$REGION" &> /dev/null; then
    echo "🔧 Creating beta domain mapping..."
    gcloud run domain-mappings create \
        --service "$BETA_SERVICE" \
        --domain "$BETA_DOMAIN" \
        --region "$REGION"
    echo "✅ Beta mapping created!"
fi

echo ""

# ============================================
# PRODUCTION DOMAIN
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  PRODUCTION: thelab.tulie.vn → academy-web"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PROD_DOMAIN="thelab.tulie.vn"
PROD_SERVICE="academy-web"

# Check if mapping exists
if gcloud run domain-mappings describe "$PROD_DOMAIN" --region "$REGION" &> /dev/null; then
    echo "⚠️  Production domain mapping already exists!"
    echo "Do you want to delete and recreate? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🗑️  Deleting existing production mapping..."
        gcloud run domain-mappings delete "$PROD_DOMAIN" --region "$REGION" --quiet
        echo "✅ Deleted"
    else
        echo "ℹ️  Skipping production domain mapping creation"
    fi
fi

if ! gcloud run domain-mappings describe "$PROD_DOMAIN" --region "$REGION" &> /dev/null; then
    echo "🔧 Creating production domain mapping..."
    gcloud run domain-mappings create \
        --service "$PROD_SERVICE" \
        --domain "$PROD_DOMAIN" \
        --region "$REGION"
    echo "✅ Production mapping created!"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  DNS Records to Configure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📝 BETA DOMAIN DNS Records:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
BETA_IPS=$(gcloud run domain-mappings describe "$BETA_DOMAIN" \
    --region "$REGION" \
    --format="value(status.resourceRecords.filter(type:A).rrdata)" | tr ';' '\n')

echo "Record Type: A"
echo "Name: beta"
echo "Values:"
echo "$BETA_IPS" | while read -r ip; do
    if [ -n "$ip" ]; then
        echo "  - $ip"
    fi
done
echo ""

echo "📝 PRODUCTION DOMAIN DNS Records:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PROD_IPS=$(gcloud run domain-mappings describe "$PROD_DOMAIN" \
    --region "$REGION" \
    --format="value(status.resourceRecords.filter(type:A).rrdata)" | tr ';' '\n')

echo "Record Type: A"
echo "Name: @ (root domain)"
echo "Values:"
echo "$PROD_IPS" | while read -r ip; do
    if [ -n "$ip" ]; then
        echo "  - $ip"
    fi
done
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Action Items"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔧 Go to your DNS provider and:"
echo ""
echo "1. DELETE old Vercel records:"
echo "   ❌ CNAME: beta → vercel-dns-017.com"
echo "   ❌ CNAME: @ → vercel-dns-017.com"
echo "   ❌ A: 64.29.17.65, 216.198.79.65"
echo ""
echo "2. ADD new Cloud Run A records (from above)"
echo ""
echo "3. Wait 5-15 minutes for DNS propagation"
echo ""
echo "4. Verify with:"
echo "   dig beta.thelab.tulie.vn +short"
echo "   dig thelab.tulie.vn +short"
echo ""
echo "5. Test:"
echo "   curl -I https://beta.thelab.tulie.vn"
echo "   curl -I https://thelab.tulie.vn"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Domain mappings created successfully!"
echo ""
echo "📚 Next steps: Update DNS records at your DNS provider"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
