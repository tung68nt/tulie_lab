#!/bin/bash

# Comprehensive verification script for both domains

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Full DNS & Cloud Run Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BETA_DOMAIN="betathelab.tulie.vn"
PROD_DOMAIN="thelab.tulie.vn"
BETA_CLOUDRUN="academy-web-beta-qcmix2qxca-as.a.run.app"
PROD_CLOUDRUN="academy-web-qcmix2qxca-as.a.run.app"

check_domain() {
    local DOMAIN=$1
    local CLOUDRUN=$2
    local LABEL=$3

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$LABEL: $DOMAIN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # 1. DNS Resolution
    echo "1️⃣  DNS Resolution"
    DNS_IPS=$(dig +short "$DOMAIN" | grep -E '^[0-9]+\.')
    if [ -z "$DNS_IPS" ]; then
        echo "❌ No A records found"
        CNAME=$(dig +short "$DOMAIN" | grep -v '^[0-9]')
        if [ -n "$CNAME" ]; then
            echo "   Current CNAME: $CNAME"
            if echo "$CNAME" | grep -q "vercel"; then
                echo "   ⚠️  Still pointing to Vercel!"
            fi
        fi
    else
        echo "✅ DNS resolved to:"
        echo "$DNS_IPS" | while read -r ip; do
            echo "   - $ip"
        done

        # Check if Vercel IPs
        if echo "$DNS_IPS" | grep -qE "64.29.17|216.198.79"; then
            echo "   ⚠️  WARNING: Still pointing to Vercel IPs!"
        elif echo "$DNS_IPS" | grep -qE "216.239"; then
            echo "   ✅ Pointing to Google Cloud!"
        fi
    fi
    echo ""

    # 2. Cloud Run Direct Access
    echo "2️⃣  Cloud Run Service Health"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$CLOUDRUN" 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Cloud Run service healthy (HTTP $HTTP_CODE)"
    else
        echo "❌ Cloud Run service issue (HTTP $HTTP_CODE)"
    fi
    echo ""

    # 3. Custom Domain Access
    echo "3️⃣  Custom Domain Access"
    DOMAIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "https://$DOMAIN" 2>/dev/null)
    if [ "$DOMAIN_CODE" = "200" ]; then
        echo "✅ Domain accessible (HTTP $DOMAIN_CODE)"

        # Check server
        SERVER=$(curl -s -I "https://$DOMAIN" 2>/dev/null | grep -i "server:" | cut -d' ' -f2- | tr -d '\r')
        if [ -n "$SERVER" ]; then
            if echo "$SERVER" | grep -qi "Google"; then
                echo "✅ Served by: Google Cloud Run"
            elif echo "$SERVER" | grep -qi "Vercel"; then
                echo "⚠️  Served by: Vercel (DNS not updated yet)"
            else
                echo "ℹ️  Served by: $SERVER"
            fi
        fi
    elif [ "$DOMAIN_CODE" = "401" ]; then
        echo "⚠️  Domain returns 401 (Vercel auth protection)"
    else
        echo "❌ Domain not accessible (HTTP $DOMAIN_CODE)"
        echo "   This is expected if DNS hasn't propagated yet"
    fi
    echo ""

    # 4. SSL Certificate
    echo "4️⃣  SSL Certificate"
    CERT_INFO=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -issuer -subject 2>/dev/null)
    if [ -n "$CERT_INFO" ]; then
        ISSUER=$(echo "$CERT_INFO" | grep "issuer" | grep -o "CN=.*")
        echo "✅ SSL Active: $ISSUER"
    else
        echo "⚠️  SSL certificate check failed (might be pending)"
    fi
    echo ""
}

# Check Beta
check_domain "$BETA_DOMAIN" "$BETA_CLOUDRUN" "🟦 BETA"

# Check Production
check_domain "$PROD_DOMAIN" "$PROD_CLOUDRUN" "🟩 PRODUCTION"

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if both domains are on Cloud Run
BETA_ON_GCP=$(dig +short "$BETA_DOMAIN" | grep -E '^216.239')
PROD_ON_GCP=$(dig +short "$PROD_DOMAIN" | grep -E '^216.239')

if [ -n "$BETA_ON_GCP" ] && [ -n "$PROD_ON_GCP" ]; then
    echo "🎉 SUCCESS! Both domains migrated to Cloud Run"
    echo ""
    echo "✅ betathelab.tulie.vn → Google Cloud Run"
    echo "✅ thelab.tulie.vn → Google Cloud Run"
    echo ""
    echo "🗑️  You can now:"
    echo "   1. Delete Vercel deployments"
    echo "   2. Archive/remove Vercel project"
elif [ -z "$BETA_ON_GCP" ] || [ -z "$PROD_ON_GCP" ]; then
    echo "⏳ DNS Migration In Progress"
    echo ""
    [ -z "$BETA_ON_GCP" ] && echo "⏳ betathelab.tulie.vn - Still on Vercel, waiting for DNS"
    [ -n "$BETA_ON_GCP" ] && echo "✅ betathelab.tulie.vn - Migrated to Cloud Run"
    [ -z "$PROD_ON_GCP" ] && echo "⏳ thelab.tulie.vn - Still on Vercel, waiting for DNS"
    [ -n "$PROD_ON_GCP" ] && echo "✅ thelab.tulie.vn - Migrated to Cloud Run"
    echo ""
    echo "💡 DNS propagation can take 5-60 minutes"
    echo "   Run this script again to check progress"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
