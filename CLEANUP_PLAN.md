# HỆ THỐNG DỌN DẸP - ACADEMY TULIE

## 🔴 NGHIÊM TRỌNG - XỬ LÝ NGAY

### 1. Files trùng lặp cần xóa
```bash
# File seed trùng (có khoảng trắng trong tên)
server/src/seed-demo-course 2.ts  # XÓA - duplicate

# Files .env thừa
.env.beta                          # XÓA - không sử dụng
server/.env.local                  # XÓA - chỉ giữ .env
server/.env.supabase               # XÓA - không dùng Supabase
```

### 2. Documentation trùng lặp - Consolidate thành 1 file
```bash
AUDIT_REPORT.md              # Merge vào DOCS.md
COUNTDOWN_STRATEGY.md        # Merge vào DOCS.md
DEPLOYMENT.md                # GIỮ - rename thành DEPLOYMENT_GUIDE.md
FIX_PRODUCTION_NOW.md        # XÓA - đã fix xong
PRODUCTION_DEPLOY.md         # Merge vào DEPLOYMENT_GUIDE.md
PRODUCTION_DEPLOYMENT.md     # Merge vào DEPLOYMENT_GUIDE.md
PRODUCT_REDESIGN_SUMMARY.md  # Move vào /docs
QUICK_FIX.md                 # XÓA - đã fix xong
```

### 3. Scripts không dùng
```bash
scripts/simulate-deploy.sh        # XÓA
scripts/simulate-deploy-beta.sh   # XÓA
scripts/simulate-deploy-2.sh      # XÓA
scripts/simulate-beta.sh          # XÓA
emergency-fix.sh                  # XÓA
fix-all.sh                        # XÓA
setup-events.sh                   # Kiểm tra trước khi xóa
```

### 4. SQL files orphaned
```bash
add-product-gallery.sql      # Move vào /migrations hoặc xóa
complete-migration.sql       # Move vào /migrations hoặc xóa
production-migration.sql     # Move vào /migrations hoặc xóa
seed-landing-pages.sql       # Move vào /migrations hoặc xóa
scripts/*.sql                # Review và move/xóa
```

## 🟠 ƯU TIÊN CAO

### 5. Seed files consolidation
```bash
# Giữ:
server/prisma/seed-products.ts
server/prisma/seed-landing-page.ts

# Xóa hoặc move vào /archive:
server/src/seed.ts
server/src/seed-demo-course.ts
server/src/seed-demo-users.ts
server/src/seed-products.ts  # Duplicate với prisma/seed-products.ts
```

### 6. Diagnostic/utility scripts
```bash
server/src/diag-courses.ts   # Move vào /scripts/diagnostics/
server/src/find-admin.ts     # Move vào /scripts/utils/
server/src/metrics.ts        # XÓA - chỉ 142 bytes
```

## 🟡 CẢI THIỆN

### 7. Code patterns cần refactor
- [ ] Thay 123 console.log bằng structured logging (Winston/Pino)
- [ ] Thống nhất error response format
- [ ] Add environment variable validation
- [ ] Implement API versioning
- [ ] Add refresh token mechanism

### 8. Security improvements
- [ ] Remove credentials from .env.example
- [ ] Add rate limiting to webhook endpoints
- [ ] Implement request ID tracking
- [ ] Add file upload validation
- [ ] Set up error monitoring (Sentry)

### 9. Performance optimization
- [ ] Implement Redis caching strategy
- [ ] Add database query optimization
- [ ] Set up CDN for static assets
- [ ] Add more database indices
- [ ] Implement image optimization

### 10. Missing features to complete
- [ ] Subscription management UI
- [ ] Product download tracking
- [ ] Marketing analytics dashboard
- [ ] Public event calendar
- [ ] Birthday coupon automation

## CLEANUP COMMANDS

### Safe to delete immediately:
```bash
rm "server/src/seed-demo-course 2.ts"
rm .env.beta
rm server/.env.local
rm server/.env.supabase
rm FIX_PRODUCTION_NOW.md
rm QUICK_FIX.md
rm scripts/simulate-*.sh
rm emergency-fix.sh
rm fix-all.sh
```

### Review before delete:
```bash
# Check if these are used anywhere first
grep -r "setup-events" .
grep -r "seed.ts" .
grep -r "metrics.ts" .
```

### Move to archive:
```bash
mkdir -p archive/old-docs
mv AUDIT_REPORT.md archive/old-docs/
mv COUNTDOWN_STRATEGY.md archive/old-docs/
mv PRODUCT_REDESIGN_SUMMARY.md archive/old-docs/
```

## EXECUTION PLAN

1. **Backup first**: Create git branch `cleanup/system-maintenance`
2. **Delete safe files**: Run delete commands above
3. **Consolidate docs**: Merge into DEPLOYMENT_GUIDE.md
4. **Test**: Ensure nothing breaks
5. **Commit**: "chore: cleanup unused files and consolidate documentation"
6. **Security audit**: Review all .env files
7. **Performance audit**: Add caching and optimization
