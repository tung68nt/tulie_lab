---
description: How to simulate Cloud Run deployment locally using Docker
---

# 🛠 Local Deployment Simulation (Beta/Prod)

This workflow allows you to test exactly what will happen when you deploy to Cloud Run, right on your local machine. This is useful for debugging "It works on my machine but not on production" issues.

## Prerequisites
- Docker Installed and Running.
- `.env` file in the root directory with necessary secrets (DATABASE_URL, JWT_SECRET, etc.).

## Steps

### 1. Prepare Environment
Ensure your `.env` file has the production/beta connection strings if you want to test against the real database (WARNING: be careful with production data).

```bash
# Example .env for Simulation
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="secret"
CLIENT_URL="http://localhost:3000"
```

### 2. Run Simulation Script
We have created a script that builds the Docker image and runs it exactly like Cloud Run does.

```bash
./scripts/simulate-deploy.sh
```

### 3. Verify
Once the container starts, accessing the API:
- **Health Check**: `http://localhost:8080/api/health`
- **API**: `http://localhost:8080/api/...`

### 4. Comparison with GitHub Actions
| Step | GitHub Actions (Real Deploy) | Local Simulation |
|------|------------------------------|------------------|
| **Build** | `docker build ...` | `docker build ...` (Same) |
| **Env Vars** | Injected from GitHub Secrets | Injected from local `.env` file |
| **Runtime** | Google Cloud Run (Managed) | Local Docker Container |
| **Network** | Public Internet | Localhost (Port 8080) |

// turbo
