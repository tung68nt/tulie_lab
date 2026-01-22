#!/bin/bash

# Quick DNS Setup Script for beta.thelab.tulie.vn
# Run this script to get DNS records for configuration

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Cloud Run Domain Mapping Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

DOMAIN="beta.thelab.tulie.vn"
SERVICE="academy-web-beta"
REGION="asia-southeast1"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI not found"
    echo "Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "📍 Domain: $DOMAIN"
echo "🚀 Service: $SERVICE"
echo "🌏 Region: $REGION"
echo ""

# Check if mapping already exists
echo "🔍 Checking existing domain mappings..."
if gcloud run domain-mappings describe "$DOMAIN" --region "$REGION" &> /dev/null; then
    echo "⚠️  Domain mapping already exists!"
    echo ""
    echo "Do you want to delete and recreate? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🗑️  Deleting existing mapping..."
        gcloud run domain-mappings delete "$DOMAIN" --region "$REGION" --quiet
        echo "✅ Deleted"
    else
        echo "ℹ️  Showing existing mapping..."
    fi
else
    echo "✅ No existing mapping found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Creating Domain Mapping"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if ! gcloud run domain-mappings describe "$DOMAIN" --region "$REGION" &> /dev/null; then
    gcloud run domain-mappings create \
        --service "$SERVICE" \
        --domain "$DOMAIN" \
        --region "$REGION"

    echo ""
    echo "✅ Domain mapping created!"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: DNS Records to Configure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get DNS records
gcloud run domain-mappings describe "$DOMAIN" \
    --region "$REGION" \
    --format="table[box](status.resourceRecords.name,status.resourceRecords.type,status.resourceRecords.rrdata)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Configuration Instructions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Extract A records only
A_RECORDS=$(gcloud run domain-mappings describe "$DOMAIN" \
    --region "$REGION" \
    --format="value(status.resourceRecords.filter(type:A).rrdata)" | tr ';' '\n')

echo "📝 Add these A records to your DNS provider:"
echo ""
echo "Record Type: A"
echo "Name: beta (or beta.thelab.tulie.vn)"
echo "Values:"
echo "$A_RECORDS" | while read -r ip; do
    if [ -n "$ip" ]; then
        echo "  - $ip"
    fi
done
echo "TTL: 3600 (or Auto)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Remove Old Vercel DNS Records"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🗑️  Delete these OLD records from your DNS:"
echo "  - CNAME: beta → vercel-dns-017.com"
echo "  - A: 64.29.17.65"
echo "  - A: 216.198.79.65"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Verify After DNS Propagation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏳ Wait 5-15 minutes for DNS propagation, then run:"
echo ""
echo "   dig $DOMAIN +short"
echo ""
echo "Expected: You should see Google Cloud IPs (not Vercel IPs)"
echo ""
echo "Test the website:"
echo "   curl -I https://$DOMAIN"
echo ""
echo "Expected: HTTP/2 200 with 'server: Google Frontend'"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Domain mapping setup complete!"
echo ""
echo "📚 Full documentation: docs/DNS_SETUP_BETA.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
