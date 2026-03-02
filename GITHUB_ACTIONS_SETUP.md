# 🚀 Hướng Dẫn Setup DNS Qua GitHub Actions

## Tôi Đã Làm Gì

Vì không thể chạy `gcloud` trực tiếp từ máy local, tôi đã tạo một **GitHub Actions workflow** để setup DNS mapping tự động.

Workflow này sẽ chạy trên GitHub (có quyền access Google Cloud) và tự động:
1. Tạo domain mappings trong Cloud Run
2. Lấy DNS records cần cấu hình
3. Hiển thị hướng dẫn chi tiết

## ⚡ Cách Sử dụng (2 Phút)

### Bước 1: Trigger Workflow

1. Vào GitHub repo: https://github.com/tung68nt/tulie_lab
2. Click tab **Actions**
3. Tìm workflow **"Setup DNS Mapping (Manual)"** bên trái
4. Click **"Run workflow"** (nút xanh bên phải)
5. Chọn:
   - Branch: `beta`
   - Domain: `both` (để setup cả beta và production)
6. Click **"Run workflow"** màu xanh

### Bước 2: Xem Output

1. Đợi workflow chạy xong (~1-2 phút)
2. Click vào workflow run để xem output
3. Expand các steps để xem DNS records

**Bạn sẽ thấy output như:**

```
📝 DNS Records to configure:
┌───────────────────────┬──────┬──────────────────┐
│ NAME                  │ TYPE │ RRDATA          │
├───────────────────────┼──────┼──────────────────┤
│ betathelab.tulie.vn  │ A    │ 216.239.32.21   │
│ betathelab.tulie.vn  │ A    │ 216.239.34.21   │
│ betathelab.tulie.vn  │ A    │ 216.239.36.21   │
│ betathelab.tulie.vn  │ A    │ 216.239.38.21   │
└───────────────────────┴──────┴──────────────────┘

📋 A Records (for DNS provider):
216.239.32.21
216.239.34.21
216.239.36.21
216.239.38.21
```

### Bước 3: Update DNS

Copy 4 IP addresses từ output và:

1. Vào DNS provider (nơi quản lý `thelab.tulie.vn`)
2. **XÓA** Vercel records cũ:
   - CNAME: `beta → vercel-dns-017.com`
   - CNAME: `@ → vercel-dns-017.com`
3. **THÊM** A records mới:
   ```
   Type: A
   Name: beta
   Values: 216.239.32.21, 216.239.34.21, 216.239.36.21, 216.239.38.21
   TTL: 3600

   Type: A
   Name: @ (root domain)
   Values: 216.239.32.21, 216.239.34.21, 216.239.36.21, 216.239.38.21
   TTL: 3600
   ```

### Bước 4: Verify

Đợi 5-15 phút, sau đó:

```bash
# Check DNS
dig betathelab.tulie.vn +short
dig thelab.tulie.vn +short

# Should see: 216.239.x.x IPs (not 64.29.x.x)
```

Hoặc chạy script verify:
```bash
./scripts/verify-dns-all.sh
```

---

## 🎯 Visual Guide

### 1. Vào GitHub Actions

![GitHub Actions Tab](https://via.placeholder.com/800x200/0366d6/ffffff?text=GitHub+%3E+Actions+Tab)

URL: https://github.com/tung68nt/tulie_lab/actions

### 2. Chọn Workflow

Tìm **"Setup DNS Mapping (Manual)"** ở sidebar bên trái

### 3. Run Workflow

Click nút **"Run workflow"** màu xanh:

![Run Workflow Button](https://via.placeholder.com/400x300/28a745/ffffff?text=Run+Workflow+%3E+Select+both+%3E+Run)

### 4. Xem Output

Click vào workflow run → Expand steps → Copy DNS records

---

## 📋 Các Options

Khi run workflow, bạn có thể chọn:

| Option | Mô Tả |
|--------|-------|
| `both` | Setup cả beta và production (Recommended) |
| `beta` | Chỉ setup betathelab.tulie.vn |
| `prod` | Chỉ setup thelab.tulie.vn |

---

## ✅ Checklist

- [ ] Trigger workflow trên GitHub Actions
- [ ] Đợi workflow chạy xong (~1-2 phút)
- [ ] Copy DNS records từ output
- [ ] Vào DNS provider
- [ ] Xóa Vercel CNAME/A records cũ
- [ ] Thêm 4 A records mới cho mỗi domain
- [ ] Đợi DNS propagate (5-15 phút)
- [ ] Verify với `dig` hoặc `./scripts/verify-dns-all.sh`
- [ ] Test website: https://betathelab.tulie.vn & https://thelab.tulie.vn
- [ ] Confirm "server: Google Frontend" trong response headers

---

## 🆘 Nếu Có Lỗi

### Workflow Failed

**Lỗi**: "Permission denied" hoặc "Authentication failed"

**Giải pháp**:
- Check GitHub secrets có đầy đủ không:
  - `GCP_PROJECT_ID`
  - `GCP_SA_KEY`
- Service account có quyền Cloud Run Admin không

### DNS Không Update

**Lỗi**: Sau 30 phút vẫn thấy Vercel IPs

**Giải pháp**:
1. Clear DNS cache: `sudo dscacheutil -flushcache`
2. Check trên Google DNS: `dig @8.8.8.8 betathelab.tulie.vn +short`
3. Verify DNS records đã add đúng chưa

---

## 🎉 Sau Khi Xong

Khi cả 2 domains đã migrate thành công:

1. Test kỹ website và admin pages
2. Monitor logs: https://console.cloud.google.com/run
3. (Optional) Xóa Vercel deployment sau 1-2 ngày
4. Enjoy 100% Cloud Run với chi phí tiết kiệm hơn!

---

**Sẵn sàng? Vào GitHub Actions và trigger workflow!** 🚀

Link: https://github.com/tung68nt/tulie_lab/actions/workflows/setup-dns-mapping.yml
