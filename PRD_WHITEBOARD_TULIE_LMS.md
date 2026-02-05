# Product Requirements Document (PRD)
## Whiteboard Collaborative Tool - Tulie LMS
**Phiên bản:** 1.0  
**Ngày tạo:** 05/02/2026  
**Trạng thái:** Draft - Chờ phê duyệt  
**Ứng dụng:** thelab.tulie.vn  

---

## 📋 TỔNG QUAN DỰ ÁN

### 1. Mô Tả Ngắn Gọn
Xây dựng chức năng Whiteboard tích hợp trực tiếp vào Hệ thống Quản Lý Học Tập (LMS) hiện tại của Tulie, cho phép giáo viên:
- Soạn bài giảng trực quan với hỗ trợ đa phương tiện
- Ghi chú, vẽ, chú thích trong quá trình dạy học
- Chia sẻ màn hình trong video call (screen sharing)
- Cấp quyền truy cập link bài giảng cho học viên
- Bảo mật dữ liệu và quản lý phiên làm việc hiệu quả

### 2. Đối Tượng Người Dùng
- **Giáo viên/Người dạy:** Tạo, chỉnh sửa, chia sẻ bài giảng
- **Học viên:** Xem, theo dõi bài giảng được chia sẻ
- **Quản trị viên:** Quản lý whiteboard, kiểm soát quyền hạn, thống kê

### 3. Giá Trị Đem Lại
- ✅ Tăng tương tác trong quá trình dạy học trực tuyến
- ✅ Hỗ trợ cách tiếp cận giáo dục trực quan và hiệu quả
- ✅ Tích hợp seamless với LMS hiện tại
- ✅ Giảm chi phí so với các tool bên thứ ba (Miro, Figma)
- ✅ Bảo mật dữ liệu toàn bộ trong hệ thống nội bộ

---

## 🎯 YÊUCẦU CHỨC NĂNG

### A. CHỨC NĂNG CỐT LÕI

#### 1. **Soạn Bài (Lesson Authoring)**
- Tạo whiteboard mới với tên bài, mô tả
- Hỗ trợ artboards (trang/slide) không giới hạn
- Chỉnh sửa tên và sắp xếp lại thứ tự artboards
- Lưu tự động mỗi 2-5 giây
- Lịch sử thay đổi (version history) - quay lại phiên bản trước
- Trạng thái: Draft → Published → Archived

#### 2. **Công Cụ Vẽ & Ghi Chú**
| Công Cụ | Chức Năng |
|---------|----------|
| **Bút vẽ (Pen)** | Vẽ tự do, độ dày, màu sắc tùy chỉnh |
| **Highlight/Marker** | Đánh dấu nội dung quan trọng |
| **Eraser** | Xóa nội dung vẽ |
| **Hình dạng (Shapes)** | Hộp, vòng tròn, tam giác, đường kẻ, mũi tên |
| **Text** | Thêm text, đổi font, kích cỡ, màu |
| **Image** | Chèn ảnh từ PC, đổi kích thước, xoay |
| **Video/Link** | Embed video, link bên ngoài |
| **Sticky Notes** | Ghi chú nhanh với many màu |
| **Select/Move** | Lựa chọn, di chuyển, xóa đối tượng |
| **Group/Align** | Nhóm, căn chỉnh đối tượng |
| **Undo/Redo** | Hoàn tác/Làm lại |

#### 3. **Chế Độ Xem (View Modes)**
- **Zoom Free Style:** Zoom tự do (0.1x - 10x)
- **Fit to Screen:** Hiển thị toàn bộ bài giảng vừa màn hình
- **Zoom to Selection:** Zoom vào đối tượng được chọn
- **Artboard Navigator:** Thanh cuộn công cụ để chuyển giữa các artboards
- **Presentation Mode:** Toàn màn hình, ẩn UI, bàn phím mũi tên điều hướng

#### 4. **Quản Lý Artboards (Slides)**
- Thêm/xóa artboards
- Sắp xếp lại bằng drag-drop
- Duplicate artboard
- Tên và mô tả cho từng artboard
- Thumbnail preview
- Chỉnh sửa kích thước canvas

#### 5. **Chia Sẻ & Quyền Hạn**
- **Publish Lesson:** Công khai bài giảng
- **Generate Share Link:** Tạo link chia sẻ với:
  - Quyền xem (View only)
  - Quyền chỉnh sửa (Collaborators)
  - Hạn thời gian (Expiry date)
  - Số lần truy cập tối đa (Optional)
- **Student Access Control:** Cấu hình học viên nào có quyền truy cập
- **Revoke Access:** Thu hồi quyền hạn bất kỳ lúc nào

#### 6. **Hỗ Trợ Video Call & Screen Sharing**
- **Toolbar tích hợp:** Nút bắt đầu video call, screen share
- **Realtime Collaboration:** Cập nhật thay đổi real-time cho tất cả người dùng
- **Cursor Tracking:** Hiển thị cursor của người dùng khác với tên
- **Participant List:** Danh sách người tham gia
- **Comment/Chat:** Chat trong suốt quá trình dạy học

#### 7. **Lưu Trữ & Xuất**
- **Auto-save:** Lưu tự động liên tục
- **Manual save:** Lưu thủ công
- **Export as:**
  - PDF (toàn bộ bài giảng hoặc từng artboard)
  - PNG/JPG (từng slide)
  - JSON (dữ liệu gốc)
  - Video (ghi lại quá trình tạo - optional)

#### 8. **Tìm Kiếm & Lọc**
- Tìm kiếm bài giảng theo tên, tag, ngày tạo
- Lọc theo trạng thái (Draft, Published, Archived)
- Sắp xếp theo ngày tạo, cập nhật, tên
- Danh sách/Grid view

---

## 🎨 YÊUCẦU GIAO DIỆN (UI/UX)

### 1. Thiết Kế Tổng Quát
- **Style:** Modern, Clean, Minimalist
- **Tông màu:** Sáng, tươi sáng, thân thiện (tương tự Miro/Figma)
- **Hiệu ứng:** Mượt mà, không lag, 60 FPS
- **Responsive:** Hỗ trợ desktop 1920x1080 trở lên (mobile secondary)
- **Dark Mode:** Optional, có toggle

### 2. Bố Cục Giao Diện
```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo | Tên Bài | Buttons (Save, Share, More)   │
├──────┬──────────────────────────────────────────────────┤
│      │                                                   │
│ Left │         MAIN CANVAS AREA                         │
│ Panel│         (White board)                            │
│      │                                                   │
│Toolbar│                                                   │
│      │                                                   │
├──────┼──────────────────────────────────────────────────┤
│ Artboard Thumbnail Navigator                            │
└──────┴──────────────────────────────────────────────────┘
```

### 3. Thành Phần Giao Diện

#### **Header**
- Logo + Tên dự án
- Breadcrumb (LMS > Bài Giảng > Tên Bài)
- Nút: Save, Share, Publish, Menu (⋮)
- Avatar + Notification

#### **Left Sidebar - Tools**
- Pointer (Select)
- Pen (Custom brush)
- Highlighter
- Eraser
- Shapes (Rectangle, Circle, Triangle, Line, Arrow)
- Text
- Image
- Components (Sticky notes, templates)
- Color picker
- Undo/Redo buttons
- Zoom controls (%, Fit, +/-)

#### **Right Sidebar - Properties** (Context panel)
- Fill color
- Stroke color, width
- Opacity
- Font size, family, weight
- Layer panel
- Alignment tools

#### **Bottom - Artboard Navigator**
- Thumbnail list (scrollable horizontal)
- Add artboard button
- Current artboard indicator
- Artboard count

### 4. Hiệu Ứng & Animation
- Smooth pan/zoom transitions
- Button hover effects
- Fade in/out for dialogs
- Loading skeleton screens
- Toast notifications
- Cursor animation khi collaborate

---

## 🔧 YÊUCẦU KỸ THUẬT

### 1. Stack Công Nghệ Khuyến Nghị

| Layer | Công Nghệ | Lý Do |
|-------|-----------|-------|
| **Frontend** | Next.js 16 + React 19 | Tương thích LMS, SSR/ISR |
| **Canvas/Drawing** | Fabric.js hoặc TldrawJS | API mạnh, collaboration ready |
| **Realtime** | Socket.io hoặc Websocket | Collaboration real-time |
| **Database** | PostgreSQL (nếu LMS dùng) | ACID, secure, scalable |
| **Storage** | Cloud Storage (GCS/S3) | Hình ảnh, export files |
| **Auth** | JWT + Session (hiện tại LMS) | Tích hợp với hệ thống |
| **Deployment** | Google Cloud Run | Yêu cầu user |
| **Cache** | Redis (Upstash) | Real-time sync, performance |
| **CDN** | Cloud CDN / Cloudflare | Load nhanh, global |
| **Styling** | Tailwind CSS | Consistent với LMS |

### 2. Kiến Trúc Ứng Dụng

```
Frontend (Next.js)
  ├─ /app/whiteboard/[id]/page.tsx (Main Editor)
  ├─ /app/whiteboard/create (Create Page)
  ├─ /app/whiteboard/list (List/Dashboard)
  ├─ /app/whiteboard/[id]/view (Student View)
  └─ /components/
      ├─ Canvas (Fabric.js wrapper)
      ├─ Toolbar
      ├─ SidePanel
      ├─ ArtboardNavigator
      └─ Collaboration

Backend (Next.js API Routes)
  ├─ /api/whiteboard/ (CRUD)
  ├─ /api/whiteboard/[id]/share (Share management)
  ├─ /api/whiteboard/[id]/export (Export)
  ├─ /api/ws (WebSocket endpoint)
  └─ /api/auth (Authorization)

Database
  ├─ whiteboards (Lessons)
  ├─ artboards (Slides)
  ├─ artboard_elements (Canvas objects)
  ├─ whiteboard_shares (Share settings)
  ├─ whiteboard_collaborators (Real-time users)
  └─ whiteboard_history (Version control)

External Services
  ├─ Google Cloud Run (Deployment)
  ├─ Cloud Storage (File uploads)
  ├─ Redis (Real-time sync)
  └─ SendGrid/Email Service (Notifications)
```

### 3. Hiệu Năng (Performance)

| Yêu Cầu | Target | Giải Pháp |
|---------|--------|----------|
| **Load Time** | < 2 giây | Lazy load artboards, code splitting |
| **Canvas Lag** | 0 lag (60 FPS) | Optimize re-renders, use OffscreenCanvas |
| **Zoom/Pan** | Instant < 16ms | Hardware acceleration, WebGL |
| **Undo/Redo** | < 100ms | In-memory state management |
| **Collaboration Latency** | < 500ms | Optimistic updates + WebSocket |
| **File Size** | < 5MB/lesson | Compression, lazy loading |
| **Concurrent Users** | 100+ per room | Load balancer, Redis pub/sub |
| **Memory Usage** | < 200MB/user | Efficient canvas rendering |

### 4. Bảo Mật

- **Authentication:** OAuth2/JWT từ LMS hiện tại
- **Authorization:** RBAC (Role-Based Access Control)
- **Data Encryption:** HTTPS, TLS 1.3
- **Database Security:**
  - Parameterized queries (SQL injection prevention)
  - Row-Level Security (RLS) nếu dùng PostgreSQL
  - Encryption at rest (optional)
- **API Security:**
  - Rate limiting (100 req/min per user)
  - CORS configuration
  - CSRF protection
  - Input validation & sanitization
- **File Upload Security:**
  - Scan virus/malware
  - Whitelist file types (jpg, png, pdf, mp4)
  - Max file size 50MB
- **Session Management:**
  - HTTPOnly cookies
  - 24h expiry
  - Secure logout
- **Logging & Monitoring:**
  - Audit trail (who did what, when)
  - Error logging
  - Performance monitoring

### 5. Skalabilité (Scalability)

- **Horizontal Scaling:** Kubernetes/Cloud Run auto-scaling
- **Database Sharding:** Nếu cần (per semester/org)
- **CDN Distribution:** Assets từ edges
- **WebSocket Connection Pool:** Redis adapter
- **Caching Strategy:**
  - Browser cache (static assets)
  - Server cache (artboard previews)
  - Redis cache (user sessions, collab data)

### 6. Accessibility (A11y)

- WCAG 2.1 AA compliance
- Keyboard shortcuts (Undo, Redo, Delete, etc.)
- Screen reader support
- Color contrast ≥ 4.5:1
- ARIA labels on buttons & controls
- Focus management

---

## 📊 PHÂN TÍCH TÍNH KHẢ THI

### 1. Độ Phức Tạp: **TRUNG BÌNH - CAO**

| Thành Phần | Độ Khó | Ước Tính Thời Gian |
|-----------|--------|-------------------|
| Frontend UI (Toolbar, Canvas) | ⭐⭐⭐ | 2-3 tuần |
| Drawing Engine (Fabric.js integration) | ⭐⭐⭐⭐ | 2-3 tuần |
| Real-time Collaboration | ⭐⭐⭐⭐⭐ | 3-4 tuần |
| Backend API | ⭐⭐ | 1-2 tuần |
| Database Design | ⭐⭐ | 1 tuần |
| Export/Integration | ⭐⭐ | 1-2 tuần |
| Testing & QA | ⭐⭐⭐ | 2-3 tuần |
| Deployment & Optimization | ⭐⭐⭐ | 1-2 tuần |
| **TỔNG CỘNG** | - | **14-20 tuần** |

### 2. Rủi Ro & Giải Pháp

| Rủi Ro | Mức Độ | Giải Pháp |
|--------|--------|----------|
| Performance lag khi nhiều users | 🔴 Cao | Test load, optimize canvas, scale horizontally |
| Sync data conflict (real-time) | 🔴 Cao | Implement OT/CRDT, conflict resolution |
| Browser compatibility issues | 🟡 Trung | Polyfills, cross-browser testing |
| Data loss khi crash | 🟡 Trung | Auto-save + recovery, transactional DB |
| Security vulnerabilities | 🔴 Cao | Penetration testing, security audit |
| Integration complexity with LMS | 🟡 Trung | Well-designed API, documentation |

### 3. Tài Nguyên Cần Thiết

- **Team:**
  - 1 Lead Engineer (Full-stack)
  - 1-2 Frontend Engineer
  - 1 Backend Engineer (part-time)
  - 1 DevOps/Infrastructure
  - 1 QA/Tester
  - 1 Product Manager

- **Infrastructure:**
  - Google Cloud Run (compute)
  - Cloud Storage (files)
  - Cloud SQL (PostgreSQL)
  - Redis (Upstash or GCP Memorystore)
  - Cloud CDN

- **Licenses:**
  - Optional: Sentry (error tracking)
  - Optional: Datadog (monitoring)

---

## 🚀 LỘ TRÌNH TRIỂN KHAI (Roadmap)

### **Phase 1: MVP (Weeks 1-6)** ✅ Core Features
- [ ] Canvas básico (Fabric.js integration)
- [ ] Basic drawing tools (Pen, Shapes, Eraser, Text)
- [ ] Artboard management (Add, Delete, Rename)
- [ ] View modes (Zoom, Fit)
- [ ] Save/Load functionality
- [ ] Export as PDF/PNG
- [ ] Basic auth & student view
- [ ] Deployment to Cloud Run

**Deliverable:** Whiteboard editor hoạt động với các features cơ bản

---

### **Phase 2: Collaboration (Weeks 7-12)** 👥 Real-time Features
- [ ] WebSocket setup (Socket.io)
- [ ] Real-time cursor tracking
- [ ] Collaborative drawing
- [ ] Participant list
- [ ] Comments/Chat
- [ ] Version history
- [ ] Performance optimization
- [ ] Load testing & scaling

**Deliverable:** Multi-user collaboration stable

---

### **Phase 3: Advanced Features (Weeks 13-18)** ⚡ Enhancement
- [ ] Video call integration (Jitsi/Twilio)
- [ ] Advanced shapes & components library
- [ ] Color picker & styling panel
- [ ] Layer management & grouping
- [ ] Alignment & distribution tools
- [ ] Template library
- [ ] Search & filtering
- [ ] Audit logging

**Deliverable:** Full-featured whiteboard

---

### **Phase 4: Polish & Launch (Weeks 19-20)** 🎯 Final
- [ ] Security audit & penetration testing
- [ ] Performance optimization & monitoring
- [ ] Documentation & training materials
- [ ] User acceptance testing (UAT)
- [ ] Production deployment
- [ ] Go-live support

**Deliverable:** Sản phẩm production-ready

---

## 📱 YÊUCẦU KHÁC

### 1. Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Not required: IE

### 2. Responsive Design
- **Desktop:** 1920x1080 ~ 3840x2160 (primary)
- **Tablet:** iPad (optional, secondary support)
- **Mobile:** Not required initially

### 3. Localization
- Vietnamese (vi) - Primary
- English (en) - Secondary
- Support i18n structure

### 4. Compliance & Standards
- GDPR: Nếu có EU users
- Data protection: Comply with Vietnamese regulations
- Accessibility: WCAG 2.1 Level AA
- Performance: Lighthouse score ≥ 85

### 5. Analytics & Monitoring
- Track usage: Active users, lessons created, collaborations
- Error tracking: Sentry/Datadog
- Performance monitoring: RUM (Real User Monitoring)
- Lessons learned: Usage analytics

---

## 💰 ƯỚC TÍNH CHI PHÍ

### Infrastructure (Monthly - GCP)
| Service | Estimation | Cost |
|---------|-----------|------|
| Cloud Run (1000 hours/month) | 100-500 hours | $50-100 |
| Cloud SQL (PostgreSQL) | 1TB storage | $50-200 |
| Cloud Storage | 100GB/month | $20-50 |
| Redis/Memorystore | 5GB | $30-50 |
| Cloud CDN | 1TB egress | $30-50 |
| Cloud Monitoring | Standard | Free |
| **Subtotal** | | **$180-450/month** |

### Development (One-time)
| Item | Estimate |
|------|----------|
| Development (14-20 weeks @ $100/hr) | $56,000-80,000 |
| Testing & QA | $5,000-10,000 |
| Infrastructure Setup | $3,000-5,000 |
| Security Audit | $3,000-5,000 |
| Documentation | $1,000-2,000 |
| **Total Dev** | **$68,000-102,000** |

### First Year Total
```
Development: ~$85,000
Infrastructure: $180-450 × 12 = $2,160-5,400
Total Year 1: ~$87,000-90,000
Ongoing (Year 2+): ~$3,000/month
```

---

## ✅ SUCCESS METRICS

### Adoption
- [ ] 100+ lessons created in first month
- [ ] 80%+ of teachers use whiteboard feature
- [ ] 5000+ students access lessons

### Performance
- [ ] Page load < 2 seconds (P95)
- [ ] Canvas lag < 16ms (60 FPS)
- [ ] 99.9% uptime

### User Satisfaction
- [ ] NPS score ≥ 50
- [ ] 4+ star rating
- [ ] <5% support tickets related to whiteboard

### Business
- [ ] Increase course completion rate by 20%
- [ ] Reduce bounce rate by 30%
- [ ] ROI positive within 6 months

---

## 📚 REFERENCES & INSPIRATIONS

1. **Miro:** miro.com - Reference UI/UX
2. **Figma:** figma.com - Collaboration patterns
3. **Fabric.js:** fabricjs.com - Canvas library documentation
4. **TLDraw:** tldraw.com - Open-source whiteboard
5. **Socket.io:** socket.io - Real-time communication
6. **Next.js 16:** nextjs.org - Framework documentation

---

## 📝 APPENDIX

### A. API Endpoints (Summary)
```
POST   /api/whiteboard              - Create
GET    /api/whiteboard              - List all
GET    /api/whiteboard/:id          - Get by ID
PUT    /api/whiteboard/:id          - Update
DELETE /api/whiteboard/:id          - Delete
POST   /api/whiteboard/:id/publish  - Publish
POST   /api/whiteboard/:id/share    - Create share link
GET    /api/whiteboard/share/:token - Access via token
POST   /api/whiteboard/:id/export   - Export lesson
WS     /api/ws                      - WebSocket (real-time)
```

### B. Database Schema (Core Tables)
```sql
-- Lessons/Whiteboards
CREATE TABLE whiteboards (
    id UUID PRIMARY KEY,
    creator_id UUID NOT NULL,
    title VARCHAR(255),
    description TEXT,
    status ENUM('draft', 'published', 'archived'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Artboards (Slides)
CREATE TABLE artboards (
    id UUID PRIMARY KEY,
    whiteboard_id UUID NOT NULL,
    order INT,
    name VARCHAR(255),
    width INT,
    height INT,
    elements JSONB, -- Canvas objects
    created_at TIMESTAMP
);

-- Sharing & Access
CREATE TABLE whiteboard_shares (
    id UUID PRIMARY KEY,
    whiteboard_id UUID NOT NULL,
    share_token VARCHAR(255) UNIQUE,
    permission ENUM('view', 'edit'),
    expires_at TIMESTAMP,
    max_accesses INT,
    access_count INT DEFAULT 0
);

-- Real-time Collaborators
CREATE TABLE whiteboard_collaborators (
    id UUID PRIMARY KEY,
    whiteboard_id UUID NOT NULL,
    user_id UUID NOT NULL,
    cursor_x INT,
    cursor_y INT,
    connected_at TIMESTAMP
);

-- Version History
CREATE TABLE whiteboard_history (
    id UUID PRIMARY KEY,
    whiteboard_id UUID NOT NULL,
    version INT,
    snapshot JSONB, -- Full state
    changed_by UUID,
    created_at TIMESTAMP
);
```

### C. Keyboard Shortcuts
```
Ctrl+Z / Cmd+Z       → Undo
Ctrl+Y / Cmd+Y       → Redo
Delete               → Delete selected
Ctrl+A / Cmd+A       → Select all
Ctrl+C / Cmd+C       → Copy
Ctrl+V / Cmd+V       → Paste
Ctrl+S / Cmd+S       → Save
Ctrl+E / Cmd+E       → Export
Space + Drag         → Pan canvas
1                    → Select tool
2                    → Pen tool
3                    → Text tool
R                    → Rectangle
C                    → Circle
Z                    → Zoom fit
```

---

## ✍️ Phê Duyệt & Ký Tên

| Vai Trò | Tên | Ngày | Ký |
|---------|-----|------|-----|
| Product Manager | ___________ | ___/___/___ | |
| Tech Lead | ___________ | ___/___/___ | |
| Quản Lý Dự Án | ___________ | ___/___/___ | |

---

**Document ID:** PRD-WHITEBOARD-TULIE-001  
**Last Updated:** 05/02/2026  
**Next Review:** 12/02/2026
