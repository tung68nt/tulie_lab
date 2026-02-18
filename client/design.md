# Tulie Academy — Design System

> Tài liệu tham chiếu chuẩn cho toàn bộ giao diện. Mọi trang và component phải tuân thủ các token, spacing, và quy tắc trong tài liệu này.

---

## 1. Color Tokens

Tất cả màu sắc được định nghĩa bằng CSS variables (HSL) trong `globals.css`. **KHÔNG hardcode giá trị màu trực tiếp.**

### Light Mode (`:root`)

| Token | HSL Value | Mô tả | Tailwind Class |
|---|---|---|---|
| `--background` | `0 0% 100%` | Nền trang | `bg-background` |
| `--foreground` | `0 0% 5%` | Text chính | `text-foreground` |
| `--card` | `0 0% 100%` | Nền card | `bg-card` |
| `--card-foreground` | `0 0% 5%` | Text trong card | `text-card-foreground` |
| `--popover` | `0 0% 100%` | Nền dropdown/popover | `bg-popover` |
| `--popover-foreground` | `0 0% 5%` | Text popover | `text-popover-foreground` |
| `--primary` | `0 0% 9%` | Brand color (gần đen) | `bg-primary` / `text-primary` |
| `--primary-foreground` | `0 0% 98%` | Text trên primary | `text-primary-foreground` |
| `--secondary` | `0 0% 96%` | Nền phụ (gần trắng) | `bg-secondary` |
| `--secondary-foreground` | `0 0% 9%` | Text trên secondary | `text-secondary-foreground` |
| `--muted` | `0 0% 96%` | Nền mờ nhạt | `bg-muted` |
| `--muted-foreground` | `0 0% 35%` | Text phụ / placeholder | `text-muted-foreground` |
| `--accent` | `0 0% 96%` | Hover / focus background | `bg-accent` |
| `--accent-foreground` | `0 0% 9%` | Text trên accent | `text-accent-foreground` |
| `--destructive` | `0 84% 60%` | Đỏ — lỗi, xóa | `bg-destructive` |
| `--success` | `142 76% 36%` | Xanh lá — thành công | `bg-success` |
| `--border` | `0 0% 90%` | Viền mặc định | `border-border` |
| `--input` | `0 0% 90%` | Viền input | `border-input` |
| `--ring` | `0 0% 5%` | Focus ring | `ring-ring` |

### Dark Mode (`.dark`)

| Token | HSL Value |
|---|---|
| `--background` | `0 0% 4%` |
| `--foreground` | `0 0% 98%` |
| `--card` | `0 0% 7%` |
| `--primary` | `0 0% 98%` |
| `--primary-foreground` | `0 0% 9%` |
| `--secondary` | `0 0% 15%` |
| `--muted` | `0 0% 15%` |
| `--muted-foreground` | `0 0% 64%` |
| `--border` | `0 0% 18%` |
| `--input` | `0 0% 18%` |
| `--ring` | `0 0% 83%` |

---

## 2. Typography

**Font**: `Inter` (Google Fonts), sans-serif

### Heading Scale

| Level | Desktop | Mobile | Weight | Tracking | Line Height |
|---|---|---|---|---|---|
| `h1` | `text-4xl` (2.25rem) | `text-3xl` (1.875rem) | `600` (semibold) | `tracking-tight` | `1.3` |
| `h2` | `text-3xl` (1.875rem) | `text-2xl` (1.5rem) | `600` (semibold) | `tracking-tight` | `1.4` |
| `h3` | `text-2xl` (1.5rem) | `text-xl` (1.25rem) | `600` (semibold) | `tracking-tight` | `1.4` |
| `h4` | `text-xl` (1.25rem) | `text-xl` | `700` (bold) | `tracking-tight` | `normal` |

### Body Text

| Element | Size | Color | Line Height |
|---|---|---|---|
| `p`, `ul`, `ol` | `text-base` (1rem) | `text-muted-foreground` | `leading-relaxed` |
| Small text | `text-sm` (0.875rem) | `text-muted-foreground` | — |
| Extra small | `text-xs` (0.75rem) | `text-muted-foreground` | — |

### Vietnamese Descenders

Tất cả heading (`h1`→`h4`) có thêm `pb-[0.15em] -mb-[0.15em]` để tạo khoảng cho ký tự có đuôi dưới (g, p, y, ậ, ộ...) mà không ảnh hưởng layout.

### Quy tắc bắt buộc

- ⛔ **Font weight tối đa `700`** — KHÔNG dùng `font-extrabold` (800) hay `font-black` (900)
- ⛔ **KHÔNG dùng `uppercase`** — bất kỳ đâu, kể cả heading, label, button, badge, nav, tab, sidebar
- ⛔ **KHÔNG dùng `italic`** — bất kỳ đâu, kể cả text nhấn mạnh
- ⛔ **KHÔNG dùng `letter-spacing`** — bất kỳ đâu, kể cả heading, label, button, badge, sidebar. Không `tracking-wide`, `tracking-widest`, `letter-spacing: 0.05em` etc.
- Font weight khuyến nghị: `500-600` cho heading, `400-500` cho body, `700` chỉ cho `h4`

---

## 3. Spacing & Layout

### Container

| Property | Value |
|---|---|
| Max width | `1200px` (tại breakpoint `2xl`) |
| Padding (mobile) | `1rem` (16px) |
| Padding (tablet+) | `2rem` (32px) |
| Center | `margin: 0 auto` |
| Classes | `.page-container`, `.content-container` → `@apply container` |
| Admin | `.admin-container` → `max-w-[1200px] mx-auto` |

### Section Spacing

| Breakpoint | Padding block |
|---|---|
| Default (mobile) | `3.5rem` (56px) |
| `md` (768px) | `5rem` (80px) |
| `lg` (1024px) | `7rem` (112px) |
| Class | `.section` |

### Common Spacing Values

| Context | Value | Tailwind |
|---|---|---|
| Card padding | `2rem` (32px) | `p-8` |
| Card header → content gap | `0` (remove top padding) | `pt-0` |
| Gap giữa items trong grid | `1.5rem` (24px) | `gap-6` |
| Gap giữa button actions | `0.75rem` (12px) | `gap-3` |
| Heading → content gap | `0.375rem` (6px) | `space-y-1.5` |
| Dialog content padding | `1.5rem` (24px) | `p-6` |
| Title → description gap | `0.5rem` (8px) | `mb-2` |

### Page Spacing Rules

```
Section gap:    section class (56px → 80px → 112px responsive)
Card gap:       p-8 (32px) cho header/content/footer
Form gap:       space-y-4 (16px) giữa các form fields
Button gap:     gap-2 (8px) hoặc gap-3 (12px) giữa actions
List item gap:  space-y-2 (8px) hoặc gap-4 (16px)
```

---

## 4. Border Radius

| Token | Value | Tailwind |
|---|---|---|
| `--radius` (base) | `0.75rem` (12px) | `rounded-lg` |
| `lg` | `0.75rem` | `rounded-lg` |
| `md` | `calc(--radius - 2px)` = `0.625rem` (10px) | `rounded-md` |
| `sm` | `calc(--radius - 4px)` = `0.5rem` (8px) | `rounded-sm` |

### Usage Convention

| Element | Radius | Tailwind |
|---|---|---|
| Button (default) | `12px` | `rounded-xl` |
| Button (sm) | `8px` | `rounded-lg` |
| Card | `12px` | `rounded-xl` |
| Input / Select | `6px` | `rounded-md` |
| Badge / Tag | full | `rounded-full` |
| Dialog | `16px` | `rounded-2xl` |
| Checkbox | `2px` | `rounded-sm` |

---

## 5. Shadows

### Light Mode

| Level | Value | Tailwind |
|---|---|---|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | `shadow-sm` |
| `--shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | `shadow` |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), ...` | `shadow-md` |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), ...` | `shadow-lg` |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), ...` | `shadow-xl` |

### Dark Mode

Tất cả opacity tăng lên `0.3-0.4` (thay vì `0.05-0.1`) để shadow vẫn nhìn thấy trên nền tối.

---

## 6. Components Reference

### 6.1 Button

**File**: `components/Button.tsx`

| Variant | Mô tả |
|---|---|
| `default` | Nền đen, text trắng (đảo trong dark) |
| `destructive` | Nền đỏ, text trắng |
| `secondary` | Nền zinc-100 + border nhẹ |
| `outline` | Chỉ border, nền trong suốt |
| `ghost` | Không border, hover mới hiện nền |
| `link` | Chỉ text + underline khi hover |
| `inverted` | Foreground/background đảo ngược |
| `light` | Trắng mờ + backdrop blur |
| `white` | Trắng + border + shadow |

| Size | Height | Padding | Font size |
|---|---|---|---|
| `default` | `h-11` (44px) | `px-5 py-2.5` | `text-sm` |
| `sm` | `h-9` (36px) | `px-3.5` | `text-[13px]` |
| `lg` | `h-12` (48px) | `px-8` | `text-base` |
| `icon` | `h-11 w-11` | — | — |

**Effects**: `active:scale-[0.97]`, `transition-all duration-300`, focus ring

### 6.2 Card

**File**: `components/Card.tsx`

| Part | Padding | Styles |
|---|---|---|
| `Card` | — | `rounded-xl border bg-card shadow-sm overflow-hidden` |
| `CardHeader` | `p-8` + `space-y-1.5` | Flex column |
| `CardTitle` | — | `font-semibold leading-none tracking-tight` |
| `CardDescription` | — | `text-sm text-muted-foreground` |
| `CardContent` | `p-8 pt-0` | — |
| `CardFooter` | `p-8 pt-0` | `flex items-center` |

### 6.3 Badge

**File**: `components/Badge.tsx`

| Variant | Style |
|---|---|
| `default` | Primary bg + primary-foreground text |
| `secondary` | Secondary bg + secondary-foreground text |
| `destructive` | Destructive bg + destructive-foreground text |
| `outline` | Border only + bg-background |
| `yellow` | Yellow-500 bg + white text |

| Size | Height | Font | Padding |
|---|---|---|---|
| `sm` | `22px` | `10px` | `px-2` |
| `md` | `28px` | `12px` | `px-2.5` |
| `lg` | `32px` | `14px` | `px-3.5` |

**Extra props**: `showDot`, `dotColor`, `animate`, `bold`

### 6.4 SectionTag

**File**: `components/SectionTag.tsx`

8 variants: `default`, `light`, `dark`, `black-pill`, `yellow`, `red`, `primary`, `outline`

Có `StatusDot` tích hợp. Auto-detect: "Miễn phí" → green dot.

### 6.5 Input

**File**: `components/Input.tsx`

```
h-9 | rounded-md | border-input | bg-background | px-4 py-2 | text-sm
focus: ring-1 ring-ring
```

### 6.6 Textarea

**File**: `components/Textarea.tsx`

```
rounded-md | border-input | bg-background | px-3 py-2 | text-sm | min-h-[80px] | resize-y
focus: ring-2 ring-primary ring-offset-1
```

### 6.7 Select

**File**: `components/Select.tsx` — Radix UI primitive

```
h-9 | rounded-md | border-input | px-3 py-2 | text-sm | shadow-sm
focus: ring-1 ring-ring
```

Sub-components: `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`, `SelectGroup`, `SelectLabel`, `SelectSeparator`

Popup: `rounded-md border bg-popover shadow-md` + animate in/out

### 6.8 MultiSelect

**File**: `components/MultiSelect.tsx` — Custom component

Tags hiển thị: `bg-neutral-900 text-white px-2 py-0.5 rounded text-xs`
Popup: `bg-card border-border rounded-md shadow-lg`

### 6.9 Switch

**File**: `components/Switch.tsx` — Radix UI primitive

```
h-[24px] w-[44px] | rounded-full
checked: bg-primary | unchecked: bg-input
Thumb: h-5 w-5 rounded-full bg-background shadow-lg
```

### 6.10 Checkbox

**File**: `components/Checkbox.tsx` — Radix UI primitive

```
h-4 w-4 | rounded-sm | border-primary
checked: bg-primary text-primary-foreground
```

### 6.11 Label

**File**: `components/Label.tsx` — Radix UI primitive

```
text-sm font-medium leading-none
```

### 6.12 Tabs

**File**: `components/Tabs.tsx` — Custom (React Context)

```
TabsList: flex border-b border-border mb-4
TabsTrigger (active): text-primary border-b-2 border-primary
TabsTrigger (inactive): text-muted-foreground hover:text-foreground
TabsContent: animate-in fade-in duration-300
```

### 6.13 Pagination

**File**: `components/Pagination.tsx`

```
Button outline, h-12 w-12, rounded-lg
Text: "Trang X / Y (Z bản ghi)"
```

### 6.14 LoadingSpinner

**File**: `components/LoadingSpinner.tsx`

```
w-12 h-12 | border-4 border-zinc-200 border-t-zinc-950 | rounded-full animate-spin
```

### 6.15 StatusDot

**File**: `components/StatusDot.tsx`

8 colors: `white`, `black`, `primary`, `green`, `red`, `blue`, `yellow`, `auto`

Có `animate` prop → ping effect

### 6.16 ConfirmDialog

**File**: `components/ConfirmDialog.tsx`

4 variants: `danger` (red), `warning` (orange), `info` (blue), `success` (green)

```
Overlay: bg-black/50 backdrop-blur-sm | z-[20000]
Dialog: bg-background border rounded-2xl shadow-2xl max-w-md
animate-in fade-in zoom-in-95 duration-300
```

### 6.17 FadeIn

**File**: `components/animations/FadeIn.tsx` — Framer Motion

5 directions: `up`, `down`, `left`, `right`, `none`

```
Default: opacity 0 → 1, translateY 20px → 0
Duration: 0.5s | Ease: [0.21, 0.47, 0.32, 0.98]
Trigger: whileInView, once: true
```

---

## 7. Animations & Effects

### CSS Animations

| Animation | Duration | Usage |
|---|---|---|
| `animate-float` | `10s ease-in-out infinite` | Background decorations |
| `animate-float-delayed` | `12s ease-in-out infinite` | Secondary decoration |
| `animate-breathe` | `2s ease-in-out infinite` | Scale pulse (0.95→1) |
| `animate-pulse-slow` | `8s cubic-bezier infinite` | Subtle opacity pulse |
| `accordion-down/up` | `0.2s ease-out` | Collapsible content |

### Transition Standard

```css
transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
```

Button press: `active:scale-[0.97]`
Card hover: `translateY(-6px) scale(1.01)` + shadow increase

---

## 8. Utility Classes

### Glass Effect

```css
.glass {
  background: hsl(var(--background) / 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid hsl(var(--border) / 0.4);
}
```

### Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--muted-foreground)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Card Hover

```css
.card-hover:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.05), ...;
  border-color: hsl(var(--primary) / 0.2);
}
```

### Border Premium

```css
.border-premium {
  border: 1px solid hsl(var(--primary) / 0.05);
  background: hsl(var(--background) / 0.4);
  backdrop-filter: blur(40px);
  box-shadow: shadow-sm;
  ring: 1px white/10;
}
```

### Dot Grid Backgrounds

| Class | Uso |
|---|---|
| `.bg-dot-grid` | Current color dots |
| `.bg-dot-grid-light` | Black 7% opacity dots |
| `.bg-dot-grid-dark` | White 7% opacity dots |
| `.bg-dot-white` | White 15% opacity dots |
| `.bg-dot-black` | Black 15% opacity dots |

### Section Dark

```css
.section-dark     → bg-black text-white relative overflow-hidden
.section-dark-dot → Dot pattern overlay with radial mask fade
```

---

## 9. Do & Don't

### ✅ DO

- Dùng CSS variable tokens (`bg-primary`, `text-muted-foreground`) thay vì hardcode
- Dùng `cn()` utility để merge classes
- Dùng `Inter` font cho toàn bộ UI
- Dùng `rounded-xl` cho cards/buttons, `rounded-full` cho badges/tags
- Dùng `p-8` cho card padding, `gap-6` cho grid spacing
- Dùng `.section` class cho section spacing (responsive tự động)
- Dùng `text-sm` cho body text trong components
- Dùng `font-semibold` (`600`) cho heading, `font-medium` (`500`) cho labels
- Dùng `transition-all duration-300` cho mọi interactive element
- Dùng FadeIn component cho scroll reveal animations

### ❌ DON'T

- ❌ Hardcode colors (`text-gray-600`, `bg-[#333]`) → dùng tokens
- ❌ Dùng `uppercase` / `text-transform: uppercase` — **bất kỳ đâu**
- ❌ Dùng `italic` / `font-style: italic` — **bất kỳ đâu**
- ❌ Dùng font-weight > `700` (`font-extrabold`, `font-black`) — **tối đa `700`**
- ❌ Dùng `letter-spacing` bất kỳ đâu (heading, button, label, badge, sidebar…)
- ❌ Dùng padding không nhất quán giữa các card
- ❌ Dùng `shadow` inline — dùng `--shadow-*` tokens
- ❌ Tự viết animation mới khi đã có sẵn (float, breathe, pulse-slow)
- ❌ Dùng `z-index` > `20000` (reserved cho dialog overlay)
- ❌ Override font-family ngoài Excalidraw scope

---

## 10. File Structure

```
components/
├── Button.tsx          ← Primitive: 9 variants, 4 sizes
├── Card.tsx            ← Primitive: Card + Header/Title/Description/Content/Footer
├── Badge.tsx           ← Primitive: 5 variants, 3 sizes, StatusDot integration
├── Input.tsx           ← Primitive: text input
├── Textarea.tsx        ← Primitive: multiline input
├── Select.tsx          ← Primitive: Radix Select (full sub-components)
├── MultiSelect.tsx     ← Custom: multi-value select with tags
├── Switch.tsx          ← Primitive: Radix Switch toggle
├── Checkbox.tsx        ← Primitive: Radix Checkbox
├── Label.tsx           ← Primitive: Radix Label
├── Tabs.tsx            ← Custom: Context-based tabs
├── Pagination.tsx      ← Custom: page navigation
├── LoadingSpinner.tsx  ← Custom: spinner + text
├── StatusDot.tsx       ← Custom: colored dot with ping animation
├── SectionTag.tsx      ← Custom: pill tag with 8 variants
├── ConfirmDialog.tsx   ← Custom: modal dialog with 4 severity variants
├── Collapsible.tsx     ← Primitive: Radix Collapsible
├── Portal.tsx          ← Utility: React Portal
├── BackToTop.tsx       ← Utility: scroll-to-top button
├── DotPatternBackground.tsx
├── animations/
│   └── FadeIn.tsx      ← Framer Motion scroll reveal
└── ui/
    └── DotPatternBackground.tsx
```

---

*Cập nhật lần cuối: 2026-02-16*
