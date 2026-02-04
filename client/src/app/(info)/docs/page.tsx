'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TableOfContents } from '@/components/TableOfContents';
import { BackToTop } from '@/components/BackToTop';
import { Loader2, BookOpen, ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';

export default function PublicDocsPage() {
    const [title, setTitle] = useState('Hướng dẫn sử dụng hệ thống');
    const [content, setContent] = useState(`# Hướng dẫn sử dụng hệ thống Tulie Academy

Chào mừng bạn đến với **Tulie Academy**! Tài liệu này được biên soạn chi tiết để hỗ trợ bạn - từ người chưa biết gì về công nghệ đến khi thành thạo hệ thống.

---

## <a id="glossary"></a>1. Giải thích thuật ngữ (Glossary)

Trước khi bắt đầu, hãy làm quen với một số từ khóa bạn sẽ gặp thường xuyên:

| Thuật ngữ | Giải nghĩa đơn giản |
| :--- | :--- |
| **SaaS** (Software as a Service) | Phần mềm dùng ngay trên web (như Facebook, Gmail) không cần cài đặt. |
| **Source Code** (Mã nguồn) | Bản thiết kế gốc của phần mềm. Bạn có thể chỉnh sửa nó để tạo ra sản phẩm riêng. |
| **Deploy** (Triển khai) | Đưa website từ máy tính cá nhân lên mạng Internet để mọi người cùng truy cập. |
| **Localhost** | Môi trường chạy thử trên máy tính của riêng bạn (chỉ mình bạn thấy). |
| **Vibe Coding** | Phương pháp lập trình mới: Dùng AI (ChatGPT/Claude) để viết code thay vì tự gõ từng dòng. |
| **Redeem / Giftcode** | Mã kích hoạt khóa học (giống thẻ cào điện thoại). |
| **Checkout** | Bước thanh toán và xác nhận đơn hàng. |
| **Dashboard** | Bảng điều khiển cá nhân, nơi chứa các khóa học bạn đã mua. |

---

## 2. Tài khoản & Bảo mật

### Đăng ký tài khoản
1. Truy cập **[thelab.tulie.vn](https://thelab.tulie.vn)**.
2. Nhấn **Đăng ký** (góc phải).
3. Điền Họ tên, Email, Mật khẩu.
4. Nhấn **Tạo tài khoản**.
   *(Hệ thống tự động đăng nhập ngay sau khi tạo xong)*.

![Hướng dẫn đăng ký tài khoản](/Users/tungnguyen/.gemini/antigravity/brain/5f65a5d1-942b-4cff-85a3-b6b079683214/registration_ui_demo_final_1770177607533.png)

### Quản lý Hồ sơ
- **Cập nhật Avatar**: Nhấn vào ảnh đại diện -> Tải ảnh mới.
- **Đổi mật khẩu**: Nên thay đổi định kỳ 3 tháng/lần để bảo mật.
- **Đăng xuất**: Nếu dùng máy tính công cộng, nhớ đăng xuất sau khi học.

---

## 3. Khám phá Sản phẩm

### Các loại sản phẩm
- **Khóa học Video**: Học qua video quay sẵn theo lộ trình.
- **Combo Tiết kiệm**: Mua nhiều khóa cùng lúc với giá ưu đãi.
- **Sản phẩm số (Digital)**: Template, Ebook, Source Code tải về ngay.

### Tìm kiếm khóa học
1. Vào menu **Khóa học**.
2. Dùng bộ lọc bên trái (Frontend/Backend/AI...).
3. Gõ từ khóa vào ô tìm kiếm (vd: "React", "Next.js").

---

## 4. Quy trình Thanh toán (Checkout)

Quy trình tự động 24/7. Bạn có thể học ngay sau 5 phút thanh toán.

### Các bước mua hàng
1. Chọn khóa học -> Nhấn **Đăng ký ngay**.
2. Tại trang **Checkout**:
   - Nhập **Mã giảm giá** (nếu có).
   - Chọn **Kích hoạt ngay** (cho bản thân) hoặc **Mua mã kích hoạt** (để tặng).
3. điền thông tin xuất hóa đơn VAT (nếu cần).
4. Nhấn **Thanh toán ngay**.
5. Quét mã QR chuyển khoản chính xác theo hướng dẫn.

> [!WARNING]
> **Lưu ý quan trọng**: Vui lòng không tự ý sửa nội dung chuyển khoản. Hệ thống check nội dung tự động để kích hoạt khóa học cho bạn.

---

## 5. Quản lý Đơn hàng

Kiểm tra lại lịch sử mua sắm của bạn:
1. Vào menu Avatar -> **Lịch sử đơn hàng**.
2. Xem trạng thái:
   - **Chờ thanh toán**: Bạn chưa chuyển khoản hoặc hệ thống chưa nhận được tiền.
   - **Đã hoàn thành**: Đã kích hoạt thành công.
   - **Đã hủy**: Giao dịch bị hủy bỏ.

---

## 6. Kích hoạt Khóa học (Redeem)

Dành cho bạn có Voucher hoặc được tặng Giftcode:
1. Vào menu Avatar -> **Kích hoạt bằng mã**.
2. Nhập mã code (in hoa, ví dụ: \`COURSE-KEY-123\`).
3. Nhấn **Kích hoạt**.
   *(Khóa học sẽ xuất hiện ngay lập tức trong Dashboard của bạn)*.

---

## 7. Vào học (Dashboard)

Đây là khu vực học tập chính:
1. Vào menu Avatar -> **Khóa học của tôi**.
2. Chọn khóa học muốn xem.
3. **Giao diện Player**:
   - Bên trái: Danh sách bài học.
   - Bên phải: Video & Tài liệu đính kèm.

> [!CAUTION]
> **Bản quyền**: Video khóa học được bảo vệ bản quyền DRM. Vui lòng không quay màn hình hoặc chia sẻ tài khoản. Hệ thống sẽ khóa tài khoản vĩnh viễn nếu phát hiện vi phạm.

---

## 8. Tài sản số & Downloads

Với các sản phẩm không phải video (Template, Ebook):
1. Vào menu Avatar -> **Sản phẩm số của tôi**.
2. Nhấn nút **Download** (Tải về) hoặc **Truy cập** (Link Google Drive).
3. Lưu trữ file về máy tính cá nhân để sử dụng lâu dài.

---

## 9. Hệ sinh thái Mở rộng

Tulie Academy cung cấp thêm các công cụ hỗ trợ công việc:
- **Vibe Coding App**: Kho thư viện Code Snippet & Prompt AI.
- **Calendar**: Lịch livestream và sự kiện offline.
- **Instructors**: Thông tin và profile của đội ngũ giảng viên/mentor.

---

## 10. Hỗ trợ & Trợ giúp

Gặp khó khăn? Chúng tôi luôn sẵn sàng hỗ trợ:
- **FAQ**: Xem câu hỏi thường gặp cuối trang chủ.
- **Chính sách hoàn tiền (\`/refund\`)**: Cam kết hoàn tiền nếu khóa học không đúng mô tả.
- **Liên hệ**: Nhắn tin qua Fanpage hoặc Zalo (nút chat góc phải màn hình).

---
*Chúc bạn có trải nghiệm học tập tuyệt vời tại Tulie Academy!*
`);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

    useEffect(() => {
        const loadDocs = async () => {
            try {
                // Try fetching from API to see if there's any override
                const settings = await api.admin.settings.get();
                if (settings && settings.SYSTEM_DOC_CONTENT) {
                    setTitle(settings.SYSTEM_DOC_TITLE || 'Hướng dẫn sử dụng hệ thống');
                    setContent(settings.SYSTEM_DOC_CONTENT);
                }
            } catch (error) {
                console.error('Failed to load docs from API, using default content');
                // Keep default content
            } finally {
                setIsLoading(false);
            }
        };

        loadDocs();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Đang tải tài liệu...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background">
                <div className="container py-8 md:py-12">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground font-medium">Tài liệu</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                {title}
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">
                                Hướng dẫn chi tiết cách sử dụng các tính năng trên hệ thống Tulie Academy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Sidebar / TOC */}
                    <div className="lg:col-span-3 lg:border-r border-border/60 lg:pr-8">
                        <aside className="sticky top-24 space-y-6">
                            {/* Mobile TOC Toggle */}
                            {content && (
                                <div className="lg:hidden mb-6">
                                    <button
                                        onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-background text-sm font-medium"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Menu className="w-4 h-4" />
                                            Mục lục tài liệu
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${isMobileTocOpen ? 'rotate-90' : ''}`} />
                                    </button>

                                    {isMobileTocOpen && (
                                        <div className="mt-2 p-4 rounded-lg bg-background border border-border shadow-md animate-in slide-in-from-top-2">
                                            <TableOfContents
                                                content={content}
                                                onItemClick={() => setIsMobileTocOpen(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {content && (
                                <div className="hidden lg:block">
                                    <TableOfContents content={content} />
                                </div>
                            )}
                        </aside>
                    </div>

                    {/* Documentation Content */}
                    <div className="lg:col-span-9">
                        <div className="prose-premium min-h-[500px]">
                            {content ? (
                                <MarkdownRenderer content={content} />
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground italic">Nội dung đang được cập nhật...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <BackToTop />
        </div>
    );
}
