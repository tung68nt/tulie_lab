# 🚨 FIX LỖI PRODUCTION NGAY

## ❌ Tình trạng hiện tại

Website thelab.tulie.vn đang bị lỗi:
- ❌ `/admin/courses` - Lỗi: Column `Course.compareAtPrice` does not exist
- ❌ `/admin/products` - Lỗi: Unknown error
- ❌ `/p/google-sheets`, `/p/ai`, `/p/vibe-coding` - 404 errors
- ❌ `/admin/orders` - Hiện "N/A" thay vì tên khóa học/sản phẩm

## 🔍 Nguyên nhân

**Code đã deploy lên production rồi**, nhưng **database chưa được migrate**.

GitHub Actions đã cố chạy migration tự động nhưng **không kết nối được database** (sai port hoặc credentials).

## ✅ Giải pháp: Chạy migration thủ công

### Cách 1: Dùng script tự động (KHUYẾN NGHỊ)

```bash
# Chạy lệnh này trong terminal:
./run-production-migration.sh
```

Script sẽ hỏi bạn nhập **PRODUCTION DATABASE_URL** (lấy từ Google Cloud Console hoặc Supabase dashboard).

### Cách 2: Dùng psql command trực tiếp

```bash
# Thay YOUR_PRODUCTION_DB_URL bằng connection string thật:
psql YOUR_PRODUCTION_DB_URL -f production-migration.sql
```

### Cách 3: Dùng database GUI (TablePlus, pgAdmin, etc.)

1. Kết nối đến **production database** (Supabase hoặc Cloud SQL)
2. Mở file `production-migration.sql`
3. Execute toàn bộ script

---

## 📋 Sau khi chạy migration xong

### Kiểm tra website ngay:

| Trang | URL | Kết quả mong đợi |
|-------|-----|------------------|
| Admin Courses | `/admin/courses` | ✅ Hiện danh sách khóa học |
| Admin Products | `/admin/products` | ✅ Hiện danh sách sản phẩm |
| Admin Events | `/admin/events` | ✅ Quản lý sự kiện |
| Landing Pages | `/p/google-sheets` | ✅ Hiện trang hoặc 404 hợp lệ (không phải lỗi 500) |
| Orders | `/admin/orders` | ✅ Hiện tên khóa học/sản phẩm (không còn N/A) |

---

## ❓ Không biết lấy DATABASE_URL ở đâu?

### Nếu dùng Supabase:
1. Vào Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project của bạn
3. Settings → Database → Connection string
4. Copy **Connection Pooling** URL (port 6543)
5. Hoặc **Direct Connection** URL (port 5432)

### Nếu dùng Google Cloud SQL:
1. Vào Google Cloud Console
2. SQL → Instances → chọn database của bạn
3. Connections → Copy connection string
4. Format: `postgresql://username:password@host:5432/database`

### Nếu không rõ:
Check file `.github/workflows/deploy.yml` trong repo:
- Secrets: `BETA_DATABASE_URL` hoặc `DATABASE_URL`
- Bạn cần access vào GitHub Secrets để lấy

---

## 🔧 Nếu vẫn gặp vấn đề

### Migration thất bại:
```bash
# Kiểm tra kết nối:
psql YOUR_DATABASE_URL -c "SELECT 1;"

# Nếu không cài psql:
brew install postgresql  # macOS
```

### Website vẫn lỗi sau khi migrate:
1. Chờ 1-2 phút để Cloud Run reload
2. Hoặc restart service thủ công:
   - Vào Google Cloud Console
   - Cloud Run → chọn `academy-api-beta`
   - Click "EDIT & DEPLOY NEW REVISION"
   - Deploy (không cần đổi gì)

---

## 📞 Cần hỗ trợ?

Migration script **an toàn** và có thể chạy nhiều lần (idempotent). Nó chỉ thêm cột/bảng mới, không xóa dữ liệu.

**Tất cả code đã sẵn sàng** - chỉ cần chạy migration là xong! 🚀
