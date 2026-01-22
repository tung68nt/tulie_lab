# 🚀 PRODUCTION DEPLOYMENT GUIDE

## ❌ Current Issues on Production

Your production site (thelab.tulie.vn) is showing these errors because the database schema is outdated:

1. ❌ `/admin/courses` - Error: Column `Course.compareAtPrice` does not exist
2. ❌ `/admin/products` - Error: Column `Product.compareAtPrice` does not exist
3. ❌ `/p/google-sheets`, `/p/ai`, `/p/vibe-coding` - 404 errors
4. ❌ Event management system not in database

## ✅ Solution: Run Migration on Production

### Step 1: Connect to Production Server

```bash
ssh your-production-server
# or however you access your production server
```

### Step 2: Navigate to Project Directory

```bash
cd /path/to/your/production/academy_tulie
```

### Step 3: Pull Latest Code

```bash
git pull origin main
```

### Step 4: Run Migration Script

```bash
chmod +x production-migrate.sh
./production-migrate.sh
```

This script will:
- ✅ Add `compareAtPrice` column to Course and Product tables
- ✅ Create Event table and EventType enum
- ✅ Generate Prisma client
- ✅ Build the application

### Step 5: Restart Production Server

```bash
# If using PM2:
pm2 restart all

# If using Docker:
docker-compose restart

# If using systemd:
sudo systemctl restart your-app-service
```

---

## 📋 What Changed in Latest Code

### Database Schema Changes:
```sql
-- Add to Course table
ALTER TABLE "Course" ADD COLUMN "compareAtPrice" DECIMAL(12,0);

-- Add to Product table
ALTER TABLE "Product" ADD COLUMN "compareAtPrice" DECIMAL(12,0);

-- Create Event table
CREATE TABLE "Event" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP(3) NOT NULL,
    time TEXT,
    type "EventType" NOT NULL DEFAULT 'WEBINAR',
    link TEXT,
    isActive BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL
);

-- Create EventType enum
CREATE TYPE "EventType" AS ENUM ('WEBINAR', 'WORKSHOP', 'COURSE', 'MEETUP', 'OTHER');
```

### Code Changes:
1. **Landing Pages Routes** - Fixed route order to prevent 404s
2. **Admin Sidebar** - Added Events to LMS section
3. **Orders Page** - Fixed data mapping for items display
4. **Events System** - Complete CRUD for calendar events

---

## 🧪 Verification After Deployment

Once migration is complete and server restarted, verify:

| Page | URL | Expected Result |
|------|-----|-----------------|
| Admin Courses | `/admin/courses` | ✅ Loads course list |
| Admin Products | `/admin/products` | ✅ Loads product list |
| Admin Events | `/admin/events` | ✅ Shows event management |
| Landing Pages | `/p/google-sheets`, `/p/ai`, `/p/vibe-coding` | ✅ Loads pages OR shows "not found" if no data (not 500 error) |
| Calendar | `/calendar` | ✅ Loads calendar |
| Orders | `/admin/orders` | ✅ Shows orders with course/product names |

---

## 🔧 Alternative: Manual Migration

If the script doesn't work, run manually:

```bash
cd server

# 1. Push schema to database
npx prisma db push --accept-data-loss

# 2. Generate Prisma client
npx prisma generate

# 3. Build application
npm run build

# 4. Restart server
pm2 restart all  # or your restart command
```

---

## ⚠️ Important Notes

1. **Backup First**: Consider backing up your database before migration
2. **Downtime**: There might be brief downtime during migration
3. **Data Loss**: `--accept-data-loss` is safe here as we're only ADDING columns, not removing
4. **Test After**: Always verify all pages work after deployment

---

## 📞 Need Help?

If you encounter issues:

1. Check server logs: `pm2 logs` or `docker logs your-container`
2. Check database connection: `npx prisma db execute --stdin <<< "SELECT 1;"`
3. Verify .env has correct DATABASE_URL

---

## 📝 Commits to Deploy

Latest commits include all fixes:
- `26ffebc` - Fix admin orders page data mapping
- `dfc27a9` - Comprehensive system audit and fixes
- `6dd9a3d` - Event migration and setup script
- `9291d2b` - Event management system

All code is ready in `main` branch. Just need to:
1. Pull latest code
2. Run migration
3. Restart server

**Everything will work after these 3 steps!** 🎉
