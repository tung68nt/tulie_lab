# 🚀 HƯỚNG DẪN TRIỂN KHAI - Migrate Vercel → Cloud Run

## ⚡ Quick Start (10-20 phút)

### Bước 1: Chạy Setup Script

```bash
./scripts/setup-dns-all.sh
```

Script này sẽ tạo domain mappings trong Google Cloud Run và cho bạn DNS records cần cấu hình.

### Bước 2: Cập Nhật DNS

Vào DNS provider của bạn (nơi quản lý domain `thelab.tulie.vn`) và:

**XÓA records cũ (Vercel):**
- ❌ `CNAME: beta → vercel-dns-017.com`
- ❌ `CNAME: @ → vercel-dns-017.com`
- ❌ `A: 64.29.17.65, 216.198.79.65`

**THÊM records mới (từ output Bước 1):**

Cho **beta.thelab.tulie.vn**:
```
Type: A
Name: beta
Values: [4 IPs từ output script]
TTL: 3600
```

Cho **thelab.tulie.vn**:
```
Type: A
Name: @ (root domain)
Values: [4 IPs từ output script]
TTL: 3600
```

### Bước 3: Verify

Đợi 5-15 phút, sau đó chạy:

```bash
./scripts/verify-dns-all.sh
```

Khi thấy output:
```
✅ Pointing to Google Cloud!
✅ Served by: Google Cloud Run
🎉 SUCCESS! Both domains migrated to Cloud Run
```

→ **Hoàn thành!**

---

## 📚 Tài Liệu Chi Tiết

- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Hướng dẫn từng bước chi tiết
- **[COST_COMPARISON.md](docs/COST_COMPARISON.md)** - So sánh chi phí Vercel vs Cloud Run
- **[CHECKLIST_DNS.md](CHECKLIST_DNS.md)** - Checklist đầy đủ

---

## 🔧 Scripts Có Sẵn

| Script | Mô Tả |
|--------|-------|
| `./scripts/setup-dns-all.sh` | Tạo domain mappings cho cả beta và production |
| `./scripts/setup-dns-beta.sh` | Chỉ setup beta domain |
| `./scripts/verify-dns-all.sh` | Verify cả 2 domains |
| `./scripts/verify-dns-beta.sh` | Verify beta domain |

---

## ❓ FAQ

### Q: Có mất phí không khi chuyển sang Cloud Run?

**A**: Chi phí tương đương hoặc rẻ hơn so với Vercel:
- Free tier: 2M requests/tháng miễn phí
- Traffic vừa: ~$10-20/tháng
- So với Vercel Pro ($20/tháng) + Cloud Run Backend → **Tiết kiệm $5-15/tháng**

Chi tiết: [docs/COST_COMPARISON.md](docs/COST_COMPARISON.md)

### Q: DNS update mất bao lâu?

**A**: Thường 5-15 phút, có thể lên đến 60 phút tùy DNS provider.

### Q: Nếu có lỗi, rollback như thế nào?

**A**:
1. Vào DNS provider
2. Xóa Cloud Run A records
3. Thêm lại Vercel CNAME
4. Đợi DNS propagate (5-15 phút)

### Q: Có cần xóa Vercel project không?

**A**: Không bắt buộc ngay. Sau khi DNS đã chuyển sang Cloud Run và hoạt động ổn định 1-2 ngày, bạn có thể xóa Vercel deployment.

---

## ✅ Success Criteria

Migration thành công khi:

- [ ] `dig beta.thelab.tulie.vn +short` → IPs dạng `216.239.x.x`
- [ ] `dig thelab.tulie.vn +short` → IPs dạng `216.239.x.x`
- [ ] `curl -I https://beta.thelab.tulie.vn` → `server: Google Frontend`
- [ ] `curl -I https://thelab.tulie.vn` → `server: Google Frontend`
- [ ] Website hoạt động bình thường
- [ ] Admin pages accessible (không còn Vercel auth)
- [ ] `./scripts/verify-dns-all.sh` → All ✅

---

## 🎯 Sau Migration

### Xóa Vercel (Optional)

1. Vào https://vercel.com/dashboard
2. Settings → Domains → Remove domains
3. Delete project nếu không cần nữa

### Monitor Chi Phí

Vào Google Cloud Console → Billing để theo dõi chi phí hàng tháng.

### Backup

Vercel deployment vẫn có thể giữ lại như backup plan. Chỉ xóa khi đã chắc chắn Cloud Run hoạt động tốt.

---

## 🆘 Troubleshooting

Nếu gặp vấn đề:

1. **DNS không update**: Xem [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) section Troubleshooting
2. **SSL pending**: Đợi thêm 15-30 phút
3. **Website lỗi**: Check Cloud Run logs:
   ```bash
   gcloud run logs read --service academy-web --region asia-southeast1 --limit 50
   ```

---

## 📊 Current Status

Chạy script này để xem trạng thái hiện tại:

```bash
./scripts/verify-dns-all.sh
```

---

**Ready?** Bắt đầu với `./scripts/setup-dns-all.sh` 🚀
