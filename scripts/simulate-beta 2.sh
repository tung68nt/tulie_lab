#!/bin/bash

# Configuration - Simulating Cloud Run Environment (BETA)
SERVICE_NAME="academy-api-beta-local"
PORT=8080

echo "🚀 Starting Local BETA Deployment Simulation..."
echo "----------------------------------------"

# 1. Run via Docker Compose
echo "🚀 Building and Starting Local Simulation (Beta Env)..."

# Export vars for docker-compose
export PORT=$PORT
export ENV_FILE=.env.beta
export COMPOSE_PROJECT_NAME=academy-local-beta

# Check for .env.beta
if [ ! -f .env.beta ]; then
    echo "⚠️  .env.beta file not found!"
    exit 1
fi

docker-compose -f docker-compose.local-sim.yml up --build

# If you see logs below, the simulation is working!

# If you see logs below, the simulation is working!
