---
id: rl9bgj
title: Fix thelab.tulie.vn - SSL Certificate Mismatch & Nginx Config
status: done
priority: high
labels:
  - infra
  - ssl
  - nginx
  - urgent
createdAt: '2026-02-15T15:40:42.989Z'
updatedAt: '2026-02-15T16:07:22.484Z'
timeSpent: 0
assignee: '@me'
---
# Fix thelab.tulie.vn - SSL Certificate Mismatch & Nginx Config

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
thelab.tulie.vn is completely inaccessible. Two issues found:
1. HTTPS: SSL certificate mismatch - VPS serves cert valid for mentoring.tulie.vn, not thelab.tulie.vn
2. HTTP: returns 404 - aaPanel Nginx reverse proxy config is missing or misconfigured.

Root cause: aaPanel Nginx on VPS either (a) overrides/shares the SSL certificate from mentoring.tulie.vn site config, or (b) thelab.tulie.vn site was never properly configured with its own SSL cert.

Architecture: Docker containers expose client:3001 and server:5001. aaPanel Nginx on host should reverse-proxy thelab.tulie.vn → localhost:3001 (client) and thelab.tulie.vn/api → localhost:5001 (server), plus handle SSL termination with a valid cert for thelab.tulie.vn.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 thelab.tulie.vn has its own valid SSL certificate (not reusing mentoring.tulie.vn cert)
- [x] #2 HTTPS access to thelab.tulie.vn loads the Next.js client app correctly
- [x] #3 HTTPS access to thelab.tulie.vn/api/health returns {status: ok}
- [x] #4 HTTP to HTTPS redirect works for thelab.tulie.vn
- [x] #5 Nginx config documented/backed up for future reference
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Fix Plan (SSH into VPS required)

### 1. Diagnose on VPS
```bash
ssh vps
# Check aaPanel Nginx config for thelab.tulie.vn
cat /www/server/panel/vhost/nginx/thelab.tulie.vn.conf
# Check SSL cert files
ls -la /www/server/panel/vhost/cert/thelab.tulie.vn/
openssl x509 -in /www/server/panel/vhost/cert/thelab.tulie.vn/fullchain.pem -text -noout | head -20
# Check Docker containers are running
docker ps
curl -sf http://localhost:3001 | head -5
curl -sf http://localhost:5001/api/health
```

### 2. Fix SSL Certificate
Option A: Issue new cert via aaPanel > Website > thelab.tulie.vn > SSL > Let Encrypt (DNS verification)
Option B: Use certbot directly:
```bash
certbot certonly --nginx -d thelab.tulie.vn
```

### 3. Fix Nginx Site Config
Ensure aaPanel config for thelab.tulie.vn has:
- SSL cert pointing to thelab.tulie.vn cert (NOT mentoring.tulie.vn)
- proxy_pass to localhost:3001 for / (client)
- proxy_pass to localhost:5001 for /api (server)
- HTTP→HTTPS redirect

### 4. Reload & Verify
```bash
nginx -t && systemctl reload nginx
curl -I https://thelab.tulie.vn
curl https://thelab.tulie.vn/api/health
```

### 5. Document the Nginx config in project repo for backup
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-02-15 22:49: Fixed SSL cert mismatch. Root cause: /srv/nginx/sites/thelab.tulie.vn.conf had broken certbot symlinks (/etc/letsencrypt/live/thelab.tulie.vn/ archive missing). Updated cert paths to aaPanel-managed cert at /www/server/panel/vhost/cert/thelab.tulie.vn/. Also added proper HTTPS server block with HTTP→HTTPS redirect, security headers, and HSTS.

Config backed up to deploy/nginx/thelab.tulie.vn.conf in repo.

Finalized HeroCircleSection with framer-motion and hover effects.
<!-- SECTION:NOTES:END -->

