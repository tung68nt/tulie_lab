# 🚀 QUICK PRODUCTION FIX GUIDE

## Run this SQL script on production database:

### Option 1: Using psql command line
```bash
psql $DATABASE_URL -f production-migration.sql
```

### Option 2: Using database GUI (pgAdmin, TablePlus, etc.)
1. Connect to production database
2. Open `production-migration.sql` file
3. Execute the entire script

### Option 3: Using Prisma CLI on production server
```bash
cd /path/to/tulie_academy/server
cat ../production-migration.sql | npx prisma db execute --stdin
```

## After running SQL migration:

### On Production Server:
```bash
# 1. Navigate to project
cd /path/to/tulie_academy

# 2. Pull latest code
git pull origin main

# 3. Rebuild server
cd server
npx prisma generate
npm run build

# 4. Rebuild client (if needed)
cd ../client
npm run build

# 5. Restart application
pm2 restart all
# or
docker-compose restart
# or your restart command
```

## What the SQL script does:

✅ Adds `Course.compareAtPrice` column (DECIMAL)
✅ Adds `Product.compareAtPrice` column (DECIMAL)
✅ Creates `EventType` enum (WEBINAR, WORKSHOP, COURSE, MEETUP, OTHER)
✅ Creates `Event` table with all fields
✅ Creates indexes on Event.date and Event.isActive
✅ Verifies all changes were applied successfully

## Expected Results After Migration + Restart:

| Page | Before | After |
|------|--------|-------|
| /admin/courses | ❌ Column error | ✅ Loads |
| /admin/products | ❌ Unknown error | ✅ Loads |
| /admin/events | ❌ Not accessible | ✅ Works |
| /p/google-sheets | ❌ 404 | ✅ Loads or proper 404 |
| /admin/orders | ⚠️ Shows N/A | ✅ Shows data |

## Troubleshooting:

### If SQL script fails:
- Check database connection
- Ensure you have admin privileges
- Look for error messages in output

### If pages still error after restart:
1. Check server logs: `pm2 logs` or `docker logs`
2. Verify Prisma client was regenerated: `npx prisma generate`
3. Ensure build completed: `npm run build`

---

**The SQL script is safe to run multiple times** - it checks if each change exists before applying it.
