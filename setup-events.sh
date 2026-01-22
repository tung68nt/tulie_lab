#!/bin/bash

echo "🚀 Starting Event Management System Setup..."

# Navigate to project root
cd "$(dirname "$0")"

echo "📦 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is responding
until docker exec academy_postgres pg_isready -U postgres > /dev/null 2>&1; do
  echo "⏳ PostgreSQL is unavailable - waiting..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run migration
echo "🗄️  Running database migration..."
cd server
npx prisma migrate deploy

# Generate Prisma client (in case it wasn't done)
echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✨ Setup complete! You can now:"
echo "  1. Access admin events page at: http://localhost:3000/admin/events"
echo "  2. View calendar at: http://localhost:3000/calendar"
echo ""
echo "💡 To start the server, run:"
echo "  cd server && npm run dev"
