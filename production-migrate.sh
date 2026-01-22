#!/bin/bash

# Production Database Migration Script
# Run this on production server after deploying new code

echo "🚀 Production Database Migration"
echo "================================="
echo ""
echo "⚠️  WARNING: This will modify the production database!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

cd "$(dirname "$0")/server"

echo ""
echo "📍 Running in: $(pwd)"
echo ""

# Check database connection
echo "🔍 Testing database connection..."
if ! npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to database!"
    echo "Check your DATABASE_URL in .env"
    exit 1
fi
echo "✅ Database connected"
echo ""

# Show current schema status
echo "📊 Checking migration status..."
npx prisma migrate status
echo ""

# Push schema changes
echo "🔄 Applying schema changes..."
echo "   - Adding Course.compareAtPrice"
echo "   - Adding Product.compareAtPrice"
echo "   - Creating Event table"
echo "   - Creating EventType enum"
echo ""

npx prisma db push --accept-data-loss

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Migration failed!"
    exit 1
fi

echo ""
echo "✅ Database schema updated!"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"
echo ""

# Build application
echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "✅ Build completed"
echo ""

echo "================================="
echo "✅ MIGRATION COMPLETE!"
echo "================================="
echo ""
echo "Next steps:"
echo "  1. Restart your production server:"
echo "     pm2 restart all"
echo "     # or your restart command"
echo ""
echo "  2. Verify the fixes:"
echo "     - /admin/courses should load"
echo "     - /admin/products should load"
echo "     - /admin/events should work"
echo "     - Landing pages should load"
echo ""
