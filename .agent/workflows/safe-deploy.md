---
description: Safe deployment workflow to avoid Vietnix DDoS false positive detection
---

# Safe Deploy Workflow

## Problem
Vietnix monitoring system at IP 14.225.204.150 flags frequent outbound connections (git fetch, docker pull, health check curls) as DDoS attacks.

## Protections Applied

### 1. GitHub Actions Level
- **Concurrency control**: `cancel-in-progress: true` cancels previous runs when new push arrives
- **Path filters**: Only triggers on actual code changes (`server/**`, `client/**`, `prisma/**`)

### 2. VPS Deploy Level
- **Deploy lock**: File-based lock (`/tmp/deploy-{beta,prod}.lock`) prevents parallel deploys
- **Rate limit**: Minimum 2 minutes between deploys (`/tmp/last-deploy-{beta,prod}.timestamp`)
- **Shallow fetch**: `git fetch --depth=1` minimizes git network traffic

### 3. Health Check Level
- **10 attempts** (reduced from 20)
- **15s interval** (increased from 10s)
- **Localhost first**: Only checks domain externally ONCE after internal checks pass
- **Shorter timeouts**: 5s for localhost, 10s for domain

## Best Practices for Developers

### DO
// turbo-all
1. Squash commits before pushing to beta/main
```bash
git rebase -i HEAD~N
```

2. Use feature branches and merge via PR
```bash
git checkout -b feature/my-feature
# ... work ...
git push origin feature/my-feature
# Create PR, merge to beta
```

3. Test locally before pushing
```bash
docker compose -f docker-compose.local-sim.yml up -d
```

### DON'T
- Push multiple small commits in rapid succession to beta/main
- Run manual `workflow_dispatch` while auto-deploy is running  
- Push to both beta and main at the same time (doubles VPS traffic)

## Emergency: If DDoS Detected Again

1. **Pause workflows**: Go to GitHub Actions → disable workflows temporarily
2. **Contact Vietnix**: Request whitelist for GitHub IPs (`140.82.112.0/20`, `192.30.252.0/22`) and GHCR IPs
3. **Check VPS**: SSH in and run:
```bash
# Check for suspicious outbound connections
ss -tnp | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head 20

# Check if any deploy is stuck in a loop
cat /tmp/deploy-*.lock /tmp/last-deploy-*.timestamp 2>/dev/null

# Check running containers
docker ps
```
4. **Manual deploy** (if needed): Use `workflow_dispatch` from GitHub Actions UI (one at a time)
