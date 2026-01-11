#!/bin/bash

# Configuration - Simulating Cloud Run Environment
SERVICE_NAME="academy-api-local"
PORT=8080

echo "🚀 Starting Local Deployment Simulation..."
echo "----------------------------------------"

# 1. Build Docker Image (Mimics GitHub Actions 'Build Docker image' step)
echo "📦 Building Docker image..."
docker build -t $SERVICE_NAME:latest ./server

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo "✅ Docker build successful!"

# 2. Run Container (Mimics Cloud Run runtime)
echo "🏃 Running container..."
echo "   - Mapping container port $PORT to host port $PORT"
echo "   - Injecting environment variables from .env"

# Ensure .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found! Please create one with DATABASE_URL, etc."
    exit 1
fi

# Run Docker with env vars
# Note: We use --env-file .env to load all local secrets into the container
# In Cloud Run, these are injected via GitHub Secrets/Console
docker run --rm -p $PORT:$PORT \
  --name $SERVICE_NAME \
  --env-file .env \
  -e PORT=$PORT \
  -e NODE_ENV=production \
  $SERVICE_NAME:latest

# If you see logs below, the simulation is working!
