#!/bin/bash

# Configuration - Simulating Cloud Run Environment
SERVICE_NAME="academy-api-local"
PORT=8080

echo "🚀 Starting Local Deployment Simulation..."
echo "----------------------------------------"

# 1. Run via Docker Compose
echo "🚀 Building and Starting Local Simulation (Production Env)..."

# Export vars for docker-compose
export PORT=$PORT
export ENV_FILE=.env
export COMPOSE_PROJECT_NAME=academy-local-prod

# Check for .env
if [ ! -f .env ]; then
    echo "⚠️  .env file not found! Please create one."
    exit 1
fi

docker-compose -f docker-compose.local-sim.yml up --build

# If you see logs below, the simulation is working!

# If you see logs below, the simulation is working!
