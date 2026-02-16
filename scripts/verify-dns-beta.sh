#!/bin/bash

# Verify DNS and Cloud Run setup

DOMAIN="beta.thelab.tulie.vn"
CLOUDRUN_URL="academy-web-beta-qcmix2qxca-as.a.run.app"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 DNS & Deployment Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check 1: DNS Resolution
echo "1️⃣  Checking DNS resolution..."
DNS_IPS=$(dig +short "$DOMAIN" | grep -E '^[0-9]+\.')
if [ -z "$DNS_IPS" ]; then
    echo "❌ No A records found for $DOMAIN"
    echo "Current DNS:"
    dig +short "$DOMAIN"
else
    echo "✅ DNS resolved to:"
    echo "$DNS_IPS"

    # Check if still pointing to Vercel
    if echo "$DNS_IPS" | grep -q "64.29.17\|216.198.79"; then
        echo "⚠️  WARNING: Still pointing to Vercel IPs!"
    else
        echo "✅ Not pointing to Vercel (good)"
    fi
fi

echo ""

# Check 2: Cloud Run Direct Access
echo "2️⃣  Testing Cloud Run direct access..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$CLOUDRUN_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Cloud Run service responding (HTTP $HTTP_CODE)"
else
    echo "❌ Cloud Run service issue (HTTP $HTTP_CODE)"
fi

echo ""

# Check 3: Custom Domain Access
echo "3️⃣  Testing custom domain access..."
DOMAIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "https://$DOMAIN" 2>&1)
if [ "$DOMAIN_CODE" = "200" ]; then
    echo "✅ Custom domain working (HTTP $DOMAIN_CODE)"

    # Check server header
    SERVER=$(curl -s -I "https://$DOMAIN" | grep -i "server:" | cut -d' ' -f2-)
    if echo "$SERVER" | grep -q "Google"; then
        echo "✅ Served by Google Cloud Run"
    elif echo "$SERVER" | grep -q "Vercel"; then
        echo "⚠️  Still served by Vercel"
    fi
else
    echo "❌ Custom domain not accessible (HTTP $DOMAIN_CODE)"
    echo "This is expected if DNS hasn't propagated yet"
fi

echo ""

# Check 4: SSL Certificate
echo "4️⃣  Checking SSL certificate..."
CERT_ISSUER=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -issuer 2>/dev/null | grep -o "CN=.*")
if [ -n "$CERT_ISSUER" ]; then
    echo "✅ SSL Certificate: $CERT_ISSUER"
else
    echo "⚠️  Could not retrieve SSL certificate (might be pending)"
fi

echo ""

# Check 5: API Connectivity
echo "5️⃣  Testing API connectivity from client..."
API_URL="https://academy-api-beta-qcmix2qxca-as.a.run.app/api/health"
API_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
if [ "$API_CODE" = "200" ]; then
    echo "✅ Beta API server responding (HTTP $API_CODE)"
else
    echo "❌ Beta API server issue (HTTP $API_CODE)"
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$DOMAIN_CODE" = "200" ] && [ "$API_CODE" = "200" ]; then
    echo "🎉 All systems operational!"
    echo ""
    echo "✅ DNS configured correctly"
    echo "✅ Cloud Run service healthy"
    echo "✅ API server responding"
    echo "✅ Ready for production use"
else
    echo "⚠️  Some issues detected:"
    echo ""
    [ "$DOMAIN_CODE" != "200" ] && echo "❌ Custom domain not accessible - Check DNS propagation"
    [ "$API_CODE" != "200" ] && echo "❌ API server issue - Check Cloud Run deployment"
    echo ""
    echo "💡 Tips:"
    echo "  - DNS can take 5-60 minutes to propagate"
    echo "  - Check DNS: dig $DOMAIN +short"
    echo "  - Check domain mapping: gcloud run domain-mappings describe $DOMAIN --region asia-southeast1"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
