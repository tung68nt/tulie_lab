# DNS Setup Checklist - betathelab.tulie.vn

## Quick Start

```bash
# Step 1: Run setup script to create domain mapping
./scripts/setup-dns-beta.sh

# Step 2: Configure DNS at your DNS provider (see output above)

# Step 3: Wait 5-15 minutes, then verify
./scripts/verify-dns-beta.sh
```

## Manual Steps Checklist

### ✅ Before You Start

- [ ] Access to Google Cloud Console (with permission to manage Cloud Run)
- [ ] Access to DNS provider (where thelab.tulie.vn is registered)
- [ ] `gcloud` CLI installed and authenticated

### ✅ Step 1: Create Domain Mapping (1 minute)

```bash
gcloud run domain-mappings create \
  --service academy-web-beta \
  --domain betathelab.tulie.vn \
  --region asia-southeast1
```

Expected output: Domain mapping created successfully

### ✅ Step 2: Get DNS Records (1 minute)

```bash
gcloud run domain-mappings describe betathelab.tulie.vn \
  --region asia-southeast1 \
  --format="value(status.resourceRecords.filter(type:A).rrdata)"
```

You'll get 4 IP addresses like:
- 216.239.32.21
- 216.239.34.21
- 216.239.36.21
- 216.239.38.21

### ✅ Step 3: Update DNS Provider (5 minutes)

Go to your DNS provider dashboard:

**DELETE these old records:**
- [ ] CNAME: `beta` → `vercel-dns-017.com` (or similar)
- [ ] A: `64.29.17.65`
- [ ] A: `216.198.79.65`

**ADD these new A records:**
- [ ] A record: `beta` → `216.239.32.21` (TTL: 3600)
- [ ] A record: `beta` → `216.239.34.21` (TTL: 3600)
- [ ] A record: `beta` → `216.239.36.21` (TTL: 3600)
- [ ] A record: `beta` → `216.239.38.21` (TTL: 3600)

**Note:** Some DNS providers show this as 4 separate A records, some as a single record with 4 values.

### ✅ Step 4: Wait for DNS Propagation (5-60 minutes)

Check DNS propagation:

```bash
# Check if DNS has updated
dig betathelab.tulie.vn +short

# Should show Google Cloud IPs (216.239.x.x), not Vercel IPs
```

Online tools:
- https://dnschecker.org
- https://www.whatsmydns.net

### ✅ Step 5: Verify SSL & Access (Auto, can take 15-60 min)

Cloud Run automatically provisions SSL certificate. Check:

```bash
# Test HTTPS access
curl -I https://betathelab.tulie.vn

# Expected output:
# HTTP/2 200
# server: Google Frontend
```

### ✅ Step 6: Test Application

- [ ] Open https://betathelab.tulie.vn in browser
- [ ] Homepage loads without errors
- [ ] Admin pages accessible: https://betathelab.tulie.vn/admin
- [ ] No "Network Error" messages
- [ ] Check browser console for any errors

### ✅ Step 7: Clean Up Vercel (Optional)

Once DNS is working:

- [ ] Go to Vercel Dashboard
- [ ] Remove domain `betathelab.tulie.vn` from project
- [ ] Or delete entire Vercel deployment if not needed

## Troubleshooting

### Problem: DNS still shows Vercel IPs

**Solution:**
```bash
# Clear local DNS cache
sudo dscacheutil -flushcache  # macOS
sudo systemd-resolve --flush-caches  # Linux
ipconfig /flushdns  # Windows

# Check on Google's DNS
dig @8.8.8.8 betathelab.tulie.vn +short
```

### Problem: SSL Certificate Pending

**Solution:** Wait 15-60 minutes. Check status:
```bash
gcloud run domain-mappings describe betathelab.tulie.vn \
  --region asia-southeast1 \
  --format="get(status.conditions)"
```

### Problem: "Failed to verify domain ownership"

**Solution:**
1. Make sure DNS A records are correctly configured
2. Wait for DNS to propagate fully
3. Google will auto-verify once DNS is detected

### Problem: 404 or 503 errors

**Solution:**
```bash
# Check if Cloud Run service is healthy
curl https://academy-web-beta-qcmix2qxca-as.a.run.app

# Check Cloud Run logs
gcloud run logs read --service academy-web-beta --region asia-southeast1 --limit 50
```

## Verification Commands

```bash
# Run automated verification
./scripts/verify-dns-beta.sh

# Or manual checks:
dig betathelab.tulie.vn +short                    # Check DNS
curl -I https://betathelab.tulie.vn               # Check HTTPS
curl https://betathelab.tulie.vn/api/health       # Check API (if proxied)
```

## Timeline

- **5 minutes**: Create mapping + configure DNS
- **5-15 minutes**: DNS propagation (usually)
- **15-60 minutes**: SSL certificate provisioning
- **Total**: ~30 minutes typically

## For Production Domain (thelab.tulie.vn)

Same process, different values:

```bash
gcloud run domain-mappings create \
  --service academy-web \
  --domain thelab.tulie.vn \
  --region asia-southeast1
```

Then update DNS records for root domain (not subdomain).

## Support

- Full docs: [docs/DNS_SETUP_BETA.md](../docs/DNS_SETUP_BETA.md)
- Check deployment: https://console.cloud.google.com/run
- DNS checker: https://dnschecker.org
