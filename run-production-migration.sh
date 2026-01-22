#!/bin/bash

# PRODUCTION DATABASE MIGRATION - Run this on your local machine
# This script connects to your production database and applies the schema changes

set -e

echo "🚀 PRODUCTION DATABASE MIGRATION"
echo "=================================="
echo ""
echo "This will apply schema changes to your PRODUCTION database:"
echo "  ✅ Add Course.compareAtPrice column"
echo "  ✅ Add Product.compareAtPrice column"
echo "  ✅ Create Event table"
echo "  ✅ Create EventType enum"
echo ""
echo "⚠️  WARNING: This will modify PRODUCTION database!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

cd "$(dirname "$0")"

# Check if production-migration.sql exists
if [ ! -f "production-migration.sql" ]; then
    echo "❌ Error: production-migration.sql not found!"
    echo "Make sure you're running this from the project root directory."
    exit 1
fi

echo ""
echo "Please enter your PRODUCTION database URL:"
echo "(Format: postgresql://user:password@host:port/database)"
echo ""
read -p "DATABASE_URL: " PROD_DB_URL

if [ -z "$PROD_DB_URL" ]; then
    echo "❌ Error: DATABASE_URL cannot be empty!"
    exit 1
fi

echo ""
echo "🔍 Testing connection..."

# Test connection using psql
if command -v psql &> /dev/null; then
    if psql "$PROD_DB_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Connection successful!"
    else
        echo "❌ Cannot connect to database!"
        echo "Please check your DATABASE_URL and try again."
        exit 1
    fi
else
    echo "⚠️  psql not found. Skipping connection test."
    echo "Proceeding anyway..."
fi

echo ""
echo "🚀 Running migration SQL script..."
echo ""

# Run the SQL migration
if command -v psql &> /dev/null; then
    psql "$PROD_DB_URL" -f production-migration.sql

    if [ $? -eq 0 ]; then
        echo ""
        echo "=================================="
        echo "✅ MIGRATION COMPLETE!"
        echo "=================================="
        echo ""
        echo "Database schema has been updated successfully!"
        echo ""
        echo "🎉 All production issues should now be fixed:"
        echo "  ✅ /admin/courses should load"
        echo "  ✅ /admin/products should load"
        echo "  ✅ /admin/events should work"
        echo "  ✅ Landing pages should load"
        echo "  ✅ Orders page should show course/product names"
        echo ""
        echo "🔄 Your Cloud Run services should pick up the changes automatically."
        echo "   If issues persist, restart the service via Google Cloud Console."
        echo ""
    else
        echo "❌ Migration failed! Check errors above."
        exit 1
    fi
else
    echo "❌ psql command not found!"
    echo ""
    echo "Please install PostgreSQL client tools:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql-client"
    echo ""
    echo "OR run the migration manually:"
    echo "  1. Open pgAdmin, TablePlus, or any database GUI"
    echo "  2. Connect to your production database"
    echo "  3. Execute the contents of: production-migration.sql"
    exit 1
fi
