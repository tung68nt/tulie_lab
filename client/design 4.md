# Tulie Academy — Design System (shadcn/ui Defaults)

> Tài liệu tham chiếu chuẩn cho toàn bộ giao diện tuân thủ nguyên gốc shadcn/ui.

---

## 1. Color Tokens

Tất cả màu sắc được định nghĩa bằng CSS variables (HSL) trong `globals.css` theo preset Neutral của shadcn/ui.

### Light Mode (`:root`)

| Token | HSL Value | Tailwind Class |
|---|---|---|
| `--background` | `0 0% 100%` | `bg-background` |
| `--foreground` | `0 0% 3.9%` | `text-foreground` |
| `--card` | `0 0% 100%` | `bg-card` |
| `--card-foreground` | `0 0% 3.9%` | `text-card-foreground` |
| `--popover` | `0 0% 100%` | `bg-popover` |
| `--popover-foreground` | `0 0% 3.9%` | `text-popover-foreground` |
| `--primary` | `0 0% 9%` | `bg-primary` / `text-primary` |
| `--primary-foreground` | `0 0% 98%` | `text-primary-foreground` |
| `--secondary` | `0 0% 96.1%` | `bg-secondary` |
| `--secondary-foreground` | `0 0% 9%` | `text-secondary-foreground` |
| `--muted` | `0 0% 96.1%` | `bg-muted` |
| `--muted-foreground` | `0 0% 45.1%` | `text-muted-foreground` |
| `--accent` | `0 0% 96.1%` | `bg-accent` |
| `--accent-foreground` | `0 0% 9%` | `text-accent-foreground` |
| `--destructive` | `0 84.2% 60.2%` | `bg-destructive` |
| `--border` | `0 0% 89.8%` | `border-border` |
| `--input` | `0 0% 89.8%` | `border-input` |
| `--ring` | `0 0% 3.9%` | `ring-ring` |

### Radius

`--radius: 0.5rem` (8px). Mọi component Button, Card, Input đều sử dụng biến này (`rounded-md`, `rounded-lg`).

---

## 2. Typography

**Font**: `Inter` (hoặc font gốc của shadcn), sans-serif.

### Quy tắc bắt buộc (Shadcn strict)

- ⛔ **KHÔNG dùng `uppercase`** — tại bất kỳ đâu (heading, button, badge, sidebar liên kết). Tất cả hiển thị dạng sentence case hoặc title case.
- ⛔ **KHÔNG dùng `italic`** — không in nghiêng.
- ⛔ **KHÔNG dùng `letter-spacing`** — (tracking-wide, tracking-tight, tracking-tighter). Mọi văn bản giữ khoảng cách ký tự nguyên bản mặc định của Inter.
- Font weight tối đa là `700` (bold). Khuyến nghị dùng `500` (medium) hoặc `600` (semibold) cho các tựa đề.

---

## 3. Component Guidelines

### Buttons (`components/ui/button.tsx`)

- Dùng `variant: default | secondary | outline | ghost | link | destructive`
- Mặc định: Nền đen (primary), chữ trắng (primary-foreground), viền bo tròn theo `--radius`.
- Kích thước: `default`, `sm`, `lg`, `icon`.

### Cards (`components/ui/card.tsx`)

- Container tĩnh với viền bao quanh (border), nền trắng (hoặc đen dark mode), shadow mặc định của tailwind (`shadow-sm`).
- **Không có hover effect lơ lửng, không có premium border highlight.** Mọi thứ giữ nguyên trạng đơn giản.

### Badges (`components/ui/badge.tsx`)

- Dùng cho trạng thái nhỏ, thông báo.
- Variants: `default`, `secondary`, `destructive`, `outline`.
- Kích thước vừa vặn, không cầu kỳ. Trạng thái hoạt động nên dùng chữ text-muted-foreground hoặc màu xám nhạt (`outline`/`secondary`), tránh màu xanh/đỏ lòe loẹt sai tone Neutral.

---

## 4. Do & Don't

### ✅ DO
- Tái sử dụng các preset component từ cli `npx shadcn-ui@latest add [component]`
- Tuân thủ thiết kế tối giản, sắc nét.
- Giữ khoảng cách đều đặn dựa theo Tailwind base scale (`p-4`, `p-6`, `p-8`).

### ❌ DON'T
- Không tạo các biến thể màu tuỳ chỉnh như `success` hay `warning` trừ khi bắt buộc (dùng text-muted-foreground hoặc icon thay thế).
- Không thêm các animation rắc rối (glow, pulse-slow, float).
- Không overlay các thành phần (glassmorphism/backdrop-blur) mà chỉ sử dụng bảng màu bệt (solid) cho background và border.
