#!/bin/bash

# Configuration
# Remote Supabase Credentials (Direct Connection)
REMOTE_HOST="aws-1-ap-southeast-2.pooler.supabase.com"
REMOTE_PORT="5432"
REMOTE_USER="postgres.jlreyzyvtylrmgaacuqs"
REMOTE_DB="postgres"
REMOTE_PASS="0wWZeKFeyM6buTc9"

# Local Container
LOCAL_CONTAINER="tulie_academy_postgres"
LOCAL_DB="tulie_academy"
LOCAL_USER="postgres"

set -o pipefail

echo "🚀 Starting Database Synchronization..."
echo "from: $REMOTE_HOST ($REMOTE_DB)"
echo "to:   $LOCAL_CONTAINER ($LOCAL_DB)"
echo "----------------------------------------"

# Check if local container is running
if [ ! "$(docker ps -q -f name=$LOCAL_CONTAINER)" ]; then
    echo "❌ Error: Local container '$LOCAL_CONTAINER' is not running."
    echo "Please run 'docker-compose up -d postgres' first."
    exit 1
fi

echo "⏳ Dumping remote database and restoring locally..."
echo "This may take a while depending on database size..."

# Pipe dump directly to restore
# Using postgres:15-alpine image to ensure tool compatibility
docker run --rm \
    -e PGPASSWORD=$REMOTE_PASS \
    postgres:alpine \
    pg_dump \
    -h $REMOTE_HOST \
    -p $REMOTE_PORT \
    -U $REMOTE_USER \
    -d $REMOTE_DB \
    --clean \
    --if-exists \
    --no-owner \
    --no-acl \
    | docker exec -i $LOCAL_CONTAINER psql -U $LOCAL_USER -d $LOCAL_DB

if [ $? -eq 0 ]; then
    echo "----------------------------------------"
    echo "✅ Database synchronization completed successfully!"
else
    echo "----------------------------------------"
    echo "❌ Synchronization failed."
fi
