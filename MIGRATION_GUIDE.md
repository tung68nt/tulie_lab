# 🚀 Migration Guide: Vercel → Cloud Run

## TL;DR - Quick Start

```bash
# Bước 1: Chạy script setup (2 phút)
./scripts/setup-dns-all.sh

# Bước 2: Copy DNS records từ output, cập nhật tại DNS provider (3 phút)

# Bước 3: Đợi DNS propagate (5-15 phút)

# Bước 4: Verify
./scripts/verify-dns-all.sh
```

**Tổng thời gian**: ~10-20 phút

---

## 📋 Chi Tiết Từng Bước

### Bước 1: Tạo Domain Mappings trong Cloud Run (2 phút)

```bash
cd /Users/tungnguyen/Documents/code/tulie_academy
./scripts/setup-dns-all.sh
```

Script này sẽ:
- ✅ Map `betathelab.tulie.vn` → `academy-web-beta`
- ✅ Map `thelab.tulie.vn` → `academy-web`
- ✅ Lấy DNS records cần cấu hình

**Output mẫu**:
```
📝 BETA DOMAIN DNS Records:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Record Type: A
Name: beta
Values:
  - 216.239.32.21
  - 216.239.34.21
  - 216.239.36.21
  - 216.239.38.21

📝 PRODUCTION DOMAIN DNS Records:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Record Type: A
Name: @ (root domain)
Values:
  - 216.239.32.21
  - 216.239.34.21
  - 216.239.36.21
  - 216.239.38.21
```

### Bước 2: Cập Nhật DNS Records (3 phút)

Vào DNS provider của bạn (nơi đăng ký domain `thelab.tulie.vn`):

#### 2.1. XÓA Records Cũ (Vercel)

**Cho BETA (betathelab.tulie.vn):**
- ❌ Xóa: `CNAME: beta → vercel-dns-017.com`
- ❌ Hoặc xóa: `A: 64.29.17.65`
- ❌ Hoặc xóa: `A: 216.198.79.65`

**Cho PRODUCTION (thelab.tulie.vn):**
- ❌ Xóa: `CNAME: @ → vercel-dns-017.com`
- ❌ Hoặc xóa: `A: 64.29.17.1`
- ❌ Hoặc xóa: `A: 216.198.79.1`

#### 2.2. THÊM Records Mới (Cloud Run)

**Cho BETA:**
```
Type: A
Name: beta
Values: (Lấy từ output Bước 1)
  - 216.239.32.21
  - 216.239.34.21
  - 216.239.36.21
  - 216.239.38.21
TTL: 3600 (hoặc Auto)
```

**Cho PRODUCTION:**
```
Type: A
Name: @ (hoặc để trống cho root domain)
Values: (Lấy từ output Bước 1)
  - 216.239.32.21
  - 216.239.34.21
  - 216.239.36.21
  - 216.239.38.21
TTL: 3600 (hoặc Auto)
```

**Lưu ý**:
- Một số DNS provider cho phép thêm nhiều A records cùng lúc
- Một số khác yêu cầu thêm từng record riêng lẻ
- Cả 2 cách đều OK

### Bước 3: Đợi DNS Propagation (5-60 phút)

DNS cần thời gian để propagate. Kiểm tra bằng:

```bash
# Check DNS đã update chưa
dig betathelab.tulie.vn +short
dig thelab.tulie.vn +short

# Nếu thấy IPs dạng 216.239.x.x → ✅ Thành công
# Nếu vẫn thấy 64.29.x.x hoặc CNAME vercel → ⏳ Đợi thêm
```

**Tips để nhanh hơn**:
- Clear DNS cache: `sudo dscacheutil -flushcache` (macOS)
- Check trên Google DNS: `dig @8.8.8.8 thelab.tulie.vn +short`
- Check online: https://dnschecker.org

### Bước 4: Verify Migration (1 phút)

```bash
./scripts/verify-dns-all.sh
```

Bạn sẽ thấy output như:

```
✅ DNS resolved to:
   - 216.239.32.21
   - 216.239.34.21
   ...
✅ Pointing to Google Cloud!

✅ Cloud Run service healthy (HTTP 200)
✅ Domain accessible (HTTP 200)
✅ Served by: Google Cloud Run
✅ SSL Active: CN=GTS CA 1P5

🎉 SUCCESS! Both domains migrated to Cloud Run
```

### Bước 5: Xóa Vercel Deployment (Optional)

Sau khi DNS đã chuyển sang Cloud Run:

1. Vào https://vercel.com/dashboard
2. Chọn project Tulie Lab
3. Settings → Domains → Remove `betathelab.tulie.vn` và `thelab.tulie.vn`
4. (Optional) Delete toàn bộ Vercel project nếu không cần nữa

---

## 🔍 Troubleshooting

### Vấn Đề 1: DNS không update sau 30 phút

**Nguyên nhân**: TTL của DNS record cũ còn cao

**Giải pháp**:
```bash
# Check TTL hiện tại
dig betathelab.tulie.vn

# Nếu TTL còn cao (>3600), đợi thêm hoặc:
# 1. Giảm TTL xuống 300 trước khi update DNS
# 2. Clear DNS cache local
sudo dscacheutil -flushcache

# 3. Check trên nhiều DNS servers
dig @8.8.8.8 betathelab.tulie.vn +short    # Google DNS
dig @1.1.1.1 betathelab.tulie.vn +short    # Cloudflare DNS
```

### Vấn Đề 2: SSL Certificate Pending

**Triệu chứng**: Domain accessible nhưng chưa có HTTPS

**Giải pháp**: Đợi 15-60 phút. Google tự động provision SSL certificate.

Check status:
```bash
gcloud run domain-mappings describe betathelab.tulie.vn \
  --region asia-southeast1 \
  --format="get(status.conditions)"
```

### Vấn Đề 3: "Failed to verify domain ownership"

**Nguyên nhân**: DNS chưa propagate đến Google's nameservers

**Giải pháp**:
1. Đảm bảo DNS records đã được add đúng
2. Đợi thêm 10-30 phút
3. Google sẽ tự động verify khi detect DNS records

### Vấn Đề 4: Website vẫn hiện Vercel

**Nguyên nhân**: Browser cache hoặc DNS cache

**Giải pháp**:
```bash
# 1. Hard refresh browser: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Win)
# 2. Clear browser cache
# 3. Test incognito/private window
# 4. Check DNS:
dig betathelab.tulie.vn +short

# 5. Nếu vẫn thấy Vercel IPs → DNS chưa update
```

---

## ✅ Success Checklist

- [ ] Chạy `./scripts/setup-dns-all.sh` thành công
- [ ] Copy DNS records từ output
- [ ] Vào DNS provider và xóa Vercel records
- [ ] Thêm Cloud Run A records (4 IPs cho mỗi domain)
- [ ] `dig betathelab.tulie.vn +short` → Thấy `216.239.x.x` IPs
- [ ] `dig thelab.tulie.vn +short` → Thấy `216.239.x.x` IPs
- [ ] `curl -I https://betathelab.tulie.vn` → HTTP 200, server: Google Frontend
- [ ] `curl -I https://thelab.tulie.vn` → HTTP 200, server: Google Frontend
- [ ] `./scripts/verify-dns-all.sh` → Tất cả ✅
- [ ] Test website trên browser → Hoạt động bình thường
- [ ] Admin pages accessible (không còn Vercel auth)
- [ ] (Optional) Xóa Vercel deployment

---

## 📊 Timeline Dự Kiến

| Bước | Thời Gian | Tổng Lũy Kế |
|------|-----------|-------------|
| 1. Setup domain mappings | 2 phút | 2 phút |
| 2. Update DNS records | 3 phút | 5 phút |
| 3. DNS propagation | 5-15 phút | 10-20 phút |
| 4. SSL certificate | 0-30 phút | 10-50 phút |
| 5. Verification | 1 phút | 11-51 phút |

**Thường thì**: ~15-20 phút tổng cộng

---

## 🎯 Sau Migration

### Monitoring

Check status định kỳ:
```bash
# Health check
curl https://thelab.tulie.vn/api/health
curl https://betathelab.tulie.vn/api/health

# Logs
gcloud run logs read --service academy-web --region asia-southeast1 --limit 50
gcloud run logs read --service academy-web-beta --region asia-southeast1 --limit 50
```

### Cost Monitoring

```bash
# Check chi phí Cloud Run
gcloud billing accounts list
# Vào Cloud Console → Billing để xem chi tiết
```

### Backup Plan

Nếu có vấn đề nghiêm trọng, rollback về Vercel:
1. Vào DNS provider
2. Xóa Cloud Run A records
3. Thêm lại Vercel CNAME records
4. Đợi DNS propagate (5-15 phút)

---

## 📞 Support

- **Docs**: `/docs/COST_COMPARISON.md`
- **Scripts**: `/scripts/`
- **Cloud Run Console**: https://console.cloud.google.com/run
- **DNS Checker**: https://dnschecker.org
