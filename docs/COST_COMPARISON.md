# So Sánh Chi Phí: Vercel vs Cloud Run

## 📊 Cấu Hình Hiện Tại

### Cloud Run (Đã Deploy)
```yaml
Frontend (academy-web + academy-web-beta):
  - Min instances: 0 (scale to zero khi không dùng)
  - Max instances: 10
  - Memory: 512 MB
  - CPU: 1 vCPU

Backend (academy-api + academy-api-beta):
  - Min instances: 0 (scale to zero khi không dùng)
  - Max instances: 10
  - Memory: 512 MB
  - CPU: 1 vCPU
```

## 💰 Chi Phí Chi Tiết

### Option 1: Vercel + Cloud Run (Hiện Tại)

#### Vercel Pricing
| Tier | Giá/Tháng | Giới Hạn | Ghi Chú |
|------|-----------|----------|---------|
| **Hobby (Free)** | $0 | - 100 GB bandwidth/tháng<br>- Unlimited deployments<br>- **CÓ ADS** Vercel badge | Đủ dùng nhưng có ads |
| **Pro** | **$20/tháng** | - 1 TB bandwidth<br>- No ads<br>- Commercial use | Nếu muốn bỏ ads |

#### Cloud Run (Backend Only)
**Chi phí thực tế**: ~$5-15/tháng (chỉ backend)

**Tổng**: $0-20/tháng (Vercel) + $5-15/tháng (Cloud Run) = **$5-35/tháng**

---

### Option 2: 100% Cloud Run (Đề Xuất)

#### Cloud Run Pricing (Tháng 1/2026)

**Free Tier (MIỄN PHÍ mỗi tháng):**
- ✅ 2 triệu requests
- ✅ 360,000 GB-seconds (CPU time)
- ✅ 180,000 vCPU-seconds
- ✅ 1 GB network egress (Mỹ/Châu Âu)

**Giá sau Free Tier:**
- CPU: $0.00002400/vCPU-second
- Memory: $0.00000250/GB-second
- Requests: $0.40/1 triệu requests
- Network egress: $0.12/GB (Asia)

#### Tính Toán Chi Phí Thực Tế

**Giả sử traffic vừa phải (startup/small business):**

| Metric | Lượng/Tháng | Trong Free Tier? | Chi Phí Vượt |
|--------|-------------|------------------|--------------|
| **Requests** | 500K requests | ✅ YES (trong 2M) | $0 |
| **CPU Time** | 100K vCPU-seconds | ✅ YES (trong 180K) | $0 |
| **Memory** | 200K GB-seconds | ✅ PARTIAL (180K free) | $0.05 |
| **Network** | 5 GB | ❌ NO (1 GB free) | $0.48 |

**Tổng Cloud Run**: ~**$0.50-3/tháng** (traffic thấp)
**Tổng Cloud Run**: ~**$5-15/tháng** (traffic trung bình)
**Tổng Cloud Run**: ~**$20-50/tháng** (traffic cao)

---

## 📈 So Sánh Tổng Thể

| Phương Án | Chi Phí/Tháng | Ưu Điểm | Nhược Điểm |
|-----------|---------------|---------|------------|
| **Vercel Free + Cloud Run** | ~$5-15 | - Vercel Edge Network tốt<br>- Preview deployments tự động | - Có Vercel ads/badge<br>- 2 platforms khác nhau<br>- Phức tạp hơn |
| **Vercel Pro + Cloud Run** | ~$25-35 | - Không có ads<br>- Vercel Edge Network | - **ĐẮT NHẤT**<br>- Dư thừa (frontend đã có Cloud Run) |
| **100% Cloud Run** | ~$0.50-15 | - **RẺ NHẤT**<br>- Đơn giản nhất<br>- 1 platform duy nhất<br>- Free tier lớn | - Không có Vercel Edge Network |

## 🎯 Khuyến Nghị

### Cho Startup / Side Project / MVP:
👉 **Dùng 100% Cloud Run**

**Lý do:**
1. **TIẾT KIỆM**: ~$10-20/tháng vs $25-35 nếu dùng Vercel Pro
2. **Free Tier Lớn**: 2M requests miễn phí mỗi tháng
3. **Scale to Zero**: Không traffic = gần như $0
4. **Đơn giản**: 1 platform, dễ quản lý

### Khi Nào Nên Dùng Vercel?

Chỉ nên dùng Vercel khi:
- ❌ **KHÔNG** dùng nếu đã có Cloud Run
- ✅ Cần global edge network cực kỳ tốt (CDN toàn cầu)
- ✅ Team chỉ biết deploy frontend, không muốn học Cloud Run
- ✅ Cần Vercel-specific features (Preview URLs, Analytics, etc.)

## 💡 Thực Tế Chi Phí Academy Tulie

**Nếu bạn đang ở giai đoạn:**

### Giai Đoạn 1: MVP / Beta Testing (hiện tại)
- Traffic: < 100K requests/tháng
- Users: < 1000
- **Cloud Run**: ~**$1-5/tháng** (hầu hết trong free tier)
- **Vercel Free**: $0 (nhưng có ads)
- **Khuyến nghị**: **100% Cloud Run** → Tiết kiệm + Chuyên nghiệp

### Giai Đoạn 2: Growth (vài tháng tới)
- Traffic: 500K - 2M requests/tháng
- Users: 1K - 10K
- **Cloud Run**: ~**$5-15/tháng** (một phần trong free tier)
- **Vercel Pro**: $20/tháng (cố định)
- **Khuyến nghị**: **100% Cloud Run** → Vẫn rẻ hơn

### Giai Đoạn 3: Scale (sau 6-12 tháng)
- Traffic: > 5M requests/tháng
- Users: > 50K
- **Cloud Run**: ~**$50-150/tháng**
- **Vercel Pro**: $20/tháng (nhưng sẽ cần Enterprise)
- **Khuyến nghị**: **Tùy business**, có thể cần CDN riêng

## 🔍 Chi Tiết Cụ thể Cho Bạn

**Config hiện tại (min-instances: 0)**:
- Khi KHÔNG có traffic → **$0/giờ** (scale to zero)
- Khi CÓ traffic → Chỉ tính phí khi instance đang chạy
- Storage (container image): ~$0.10/GB/tháng (rất ít)

**Ước tính thực tế cho Academy Tulie:**

```
Frontend (2 services: main + beta):
  - Beta traffic thấp: ~$0.50/tháng
  - Main traffic vừa: ~$3-8/tháng
  - Subtotal: ~$3.50-8.50/tháng

Backend (2 services: main + beta):
  - Beta traffic thấp: ~$1/tháng
  - Main traffic vừa: ~$5-10/tháng
  - Subtotal: ~$6-11/tháng

TOTAL: ~$10-20/tháng
```

**So với Vercel Pro + Cloud Run**: Tiết kiệm ~$5-15/tháng

## ✅ Kết Luận

**Trả lời câu hỏi**: "Có mất chi phí Cloud Run không khi không dùng Vercel?"

**Có**, nhưng:
1. Chi phí **THẤP HƠN** so với dùng Vercel Pro + Cloud Run
2. Chi phí **TƯƠNG ĐƯƠNG** nếu dùng Vercel Free (có ads) + Cloud Run
3. Với free tier của Cloud Run, ở giai đoạn hiện tại bạn có thể chỉ tốn ~**$5-15/tháng** cho toàn bộ hệ thống

**Khuyến nghị cuối cùng**:
👉 **Migrate 100% sang Cloud Run**, tiết kiệm chi phí + đơn giản hơn + chuyên nghiệp hơn

---

## 📝 Bonus: Cách Giảm Chi Phí Cloud Run

1. **Enable Cloud CDN** (cache static assets): Giảm requests đến Cloud Run
2. **Optimize Docker image**: Image nhỏ hơn → pull nhanh hơn → rẻ hơn
3. **Set request timeout thấp**: Tránh instances chạy quá lâu
4. **Monitor & Alert**: Set alert khi chi phí > $X để phát hiện sớm

Bạn muốn tôi giúp setup Cloud CDN để giảm chi phí thêm không?
