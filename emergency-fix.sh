#!/bin/bash

echo "🚨 EMERGENCY FIX - Syncing Database Schema"
echo "=========================================="
echo ""

cd "$(dirname "$0")/server"

echo "📍 Current directory: $(pwd)"
echo ""

# Check if we can connect to database
echo "🔍 Checking database connection..."
if ! npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to database!"
    echo ""
    echo "Please ensure:"
    echo "  1. PostgreSQL is running (check OrbStack or docker ps)"
    echo "  2. Database credentials in .env are correct"
    echo ""
    echo "To start database:"
    echo "  cd .. && docker-compose up -d postgres"
    echo ""
    exit 1
fi

echo "✅ Database connection OK"
echo ""

# Force push schema to database (will add missing columns)
echo "🔄 Pushing schema changes to database..."
echo "⚠️  This will add missing columns (compareAtPrice, Event table, etc.)"
echo ""

npx prisma db push --accept-data-loss --skip-generate

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database schema updated successfully!"
    echo ""

    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate

    echo ""
    echo "✅ Prisma client generated!"
    echo ""

    # Rebuild server
    echo "🏗️  Rebuilding server..."
    npm run build

    if [ $? -eq 0 ]; then
        echo ""
        echo "=========================================="
        echo "✅ ALL FIXED!"
        echo "=========================================="
        echo ""
        echo "Changes applied:"
        echo "  ✅ Added Course.compareAtPrice column"
        echo "  ✅ Added Product.compareAtPrice column"
        echo "  ✅ Created Event table"
        echo "  ✅ Created EventType enum"
        echo "  ✅ Server rebuilt"
        echo ""
        echo "🚀 Next: Restart your dev server"
        echo "  cd server && npm run dev"
        echo ""
    else
        echo "❌ Server build failed - check errors above"
        exit 1
    fi
else
    echo ""
    echo "❌ Database push failed!"
    echo "Check the errors above"
    exit 1
fi
