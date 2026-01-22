# Chiến lược Countdown Timer cho Khuyến Mại

## Tổng quan vấn đề

Hiện tại có 2 nơi có thể hiển thị countdown:
1. **Landing Page** - Section countdown cho campaigns
2. **Chi tiết khóa học/sản phẩm** - Countdown cho deal cá nhân

Cần quyết định: Đồng bộ hay độc lập?

---

## Phân tích tâm lý khách hàng

### Khi ĐỒNG BỘ (cùng thời gian kết thúc)
**Ưu điểm:**
- ✅ Tạo cảm giác campaign thực, không gian lận
- ✅ Khách tin tưởng hơn vì nhất quán
- ✅ Dễ quản lý, không bị confuse

**Nhược điểm:**
- ❌ Khi hết hạn, tất cả deal đều mất cùng lúc
- ❌ Khó tạo urgency riêng cho từng sản phẩm

### Khi ĐỘC LẬP (mỗi sản phẩm 1 countdown)
**Ưu điểm:**
- ✅ Linh hoạt: sản phẩm này hết deal, sản phẩm kia vẫn còn
- ✅ Có thể test A/B duration khác nhau
- ✅ Kéo dài thời gian urgency trên site

**Nhược điểm:**
- ❌ Có thể gây nhầm lẫn nếu landing page countdown khác product detail countdown
- ❌ Khách nghĩ mình bị "trick"
- ❌ Khó giải thích logic

---

## Đề xuất: **Hybrid Approach** (Lai 2 cách)

### Cấu trúc đề xuất

```
Campaign (Landing Page Countdown)
├── Product A (Sử dụng campaign countdown)
├── Product B (Sử dụng campaign countdown)
└── Product C (Có countdown riêng, hiển thị countdown sớm hơn)
```

### Logic hoạt động

1. **Campaign-level countdown** (Landing Page):
   - Admin tạo campaign với thời gian bắt đầu/kết thúc
   - Áp dụng cho nhiều sản phẩm cùng lúc
   - Ví dụ: "Black Friday Sale - Kết thúc trong 3 ngày"

2. **Product-level countdown** (Product Detail):
   - Mỗi sản phẩm CÓ THỂ có countdown riêng
   - Nếu sản phẩm thuộc campaign → Hiển thị campaign countdown
   - Nếu không thuộc campaign → Hiển thị product countdown (nếu có)
   - Nếu cả 2 đều có → Hiển thị countdown NÀO KẾT THÚC SỚM HƠN

### Quy tắc ưu tiên

```typescript
function getCountdownToDisplay(product, activeCampaign) {
  // Nếu có campaign countdown
  if (activeCampaign && activeCampaign.endDate) {
    const campaignEnd = new Date(activeCampaign.endDate);

    // Nếu product có countdown riêng
    if (product.saleEndDate) {
      const productEnd = new Date(product.saleEndDate);

      // Hiển thị countdown nào kết thúc sớm hơn
      return campaignEnd < productEnd ? campaignEnd : productEnd;
    }

    // Chỉ có campaign countdown
    return campaignEnd;
  }

  // Không có campaign, chỉ có product countdown
  if (product.saleEndDate) {
    return new Date(product.saleEndDate);
  }

  // Không có countdown nào
  return null;
}
```

---

## Database Schema Changes

### Bảng `campaigns` (Mới)
```prisma
model Campaign {
  id          String   @id @default(uuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  // Relations
  products    Product[]
  courses     Course[]
}
```

### Bảng `products` (Thêm fields)
```prisma
model Product {
  // ... existing fields

  // Campaign relationship
  campaignId     String?
  campaign       Campaign? @relation(fields: [campaignId], references: [id])

  // Individual countdown
  saleStartDate  DateTime?
  saleEndDate    DateTime?

  // ... rest of fields
}
```

### Bảng `courses` (Thêm fields)
```prisma
model Course {
  // ... existing fields

  // Campaign relationship
  campaignId     String?
  campaign       Campaign? @relation(fields: [campaignId], references: [id])

  // Individual countdown
  saleStartDate  DateTime?
  saleEndDate    DateTime?

  // ... rest of fields
}
```

---

## UI/UX Implementation

### Landing Page Countdown
```tsx
// Hiển thị campaign countdown ở top
<div className="campaign-banner">
  <h2>Black Friday Sale</h2>
  <Countdown endDate={campaign.endDate} />
  <p>Giảm giá toàn bộ khóa học</p>
</div>
```

### Product Detail Countdown
```tsx
// Hiển thị countdown động theo logic
function ProductCountdown({ product, campaign }) {
  const endDate = getCountdownToDisplay(product, campaign);

  if (!endDate) return null;

  const isCampaign = campaign && endDate === campaign.endDate;

  return (
    <div className="product-countdown">
      <Countdown endDate={endDate} />
      {isCampaign ? (
        <p>Ưu đãi kết thúc cùng chiến dịch {campaign.name}</p>
      ) : (
        <p>Ưu đãi đặc biệt cho sản phẩm này</p>
      )}
    </div>
  );
}
```

---

## Admin Panel Features

### Campaign Management
1. **Tạo Campaign**:
   - Tên campaign
   - Thời gian bắt đầu/kết thúc
   - Chọn sản phẩm/khóa học áp dụng
   - Toggle active/inactive

2. **Product/Course Settings** (Trong form edit):
   - Dropdown chọn campaign (nếu muốn join campaign)
   - HOẶC set countdown riêng với date picker
   - Preview countdown hiển thị như thế nào

### Validation Rules
- ⚠️ Nếu product đã có countdown riêng, warning khi add vào campaign
- ⚠️ Nếu product countdown kết thúc SAU campaign countdown → Warning
- ✅ Cho phép override: Admin có thể chọn ưu tiên campaign hoặc product countdown

---

## Lợi ích giải pháp này

### Cho Admin
1. ✅ **Linh hoạt tối đa**: Có thể tạo campaign toàn site hoặc deal riêng lẻ
2. ✅ **Dễ quản lý**: Tất cả trong 1 interface
3. ✅ **A/B Testing**: Test campaign vs individual countdown
4. ✅ **Scalable**: Dễ mở rộng thêm features (countdown cho bundles, etc.)

### Cho Khách hàng
1. ✅ **Rõ ràng**: Luôn biết deal nào kết thúc khi nào
2. ✅ **Tin tưởng**: Nhất quán, không cảm giác bị lừa
3. ✅ **Urgency hợp lý**: Countdown thực sự tạo pressure mua
4. ✅ **No confusion**: Logic đơn giản - countdown nào sớm hơn thì hiển thị

---

## Implementation Priority

### Phase 1: Core (Must have)
- [ ] Tạo Campaign model + API
- [ ] Thêm fields vào Product/Course
- [ ] Logic getCountdownToDisplay()
- [ ] UI countdown component reusable

### Phase 2: Admin (Should have)
- [ ] Campaign CRUD trong admin
- [ ] Assign products/courses to campaign
- [ ] Individual countdown picker for products

### Phase 3: Advanced (Nice to have)
- [ ] Recurring campaigns (weekly, monthly)
- [ ] Timezone support
- [ ] Email reminders before countdown ends
- [ ] Analytics: conversion rate by countdown

---

## Tâm lý & Best Practices

### ✅ DO:
- Hiển thị countdown rõ ràng, đủ lớn
- Có message giải thích "Kết thúc sau X giờ"
- Update real-time (mỗi giây)
- Show "Vừa kết thúc" trong 1-2 giờ sau khi hết

### ❌ DON'T:
- Fake countdown (reset lại khi refresh)
- Countdown quá dài (>7 ngày = mất urgency)
- Quá nhiều countdown khác nhau trên cùng 1 trang
- Countdown mà không có deal thực

---

## Monitoring & Analytics

Track các metrics:
- **Conversion rate**: Có countdown vs không có
- **Average time to purchase**: Từ lúc thấy countdown đến lúc mua
- **Bounce rate**: % khách rời đi khi thấy countdown
- **Countdown expiry impact**: Bao nhiêu khách quay lại sau khi hết countdown

---

## Kết luận

**Đề xuất: Triển khai Hybrid Approach**

Lý do:
1. Cân bằng giữa linh hoạt và đơn giản
2. Tâm lý khách hàng: Tin tưởng + Urgency
3. Dễ quản lý cho admin
4. Scalable cho tương lai

Bắt đầu với Phase 1, sau đó mở rộng dần.
