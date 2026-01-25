'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_PAYMENT_GUIDE = `
Để giúp bạn tiếp cận các khóa học và sản phẩm của The Tulie Lab một cách nhanh chóng nhất, chúng tôi áp dụng quy trình thanh toán tự động hiện đại.

---

## 1. Chuyển khoản ngân hàng (Auto QR)
Đây là phương thức thanh toán nhanh nhất và được khuyến khích sử dụng. Sau khi nhấn "Thanh toán" tại giỏ hàng, hệ thống sẽ hiển thị một mã QR kèm theo số tiền và nội dung chuyển khoản được định danh duy nhất cho đơn hàng của bạn.

- **Bước 1:** Mở ứng dụng Ngân hàng (Mobile Banking) của bạn.
- **Bước 2:** Chọn tính năng "Quét mã QR".
- **Bước 3:** Quét mã QR hiển thị trên màn hình đơn hàng. Hệ thống sẽ tự động điền Số tiền và Nội dung chuyển khoản.
- **Bước 4:** Xác nhận giao dịch thành công.

> **Lưu ý quan trọng:** Vui lòng không thay đổi nội dung chuyển khoản tự động để hệ thống có thể nhận diện và kích hoạt đơn hàng ngay lập tức.

---

## 2. Quy trình kích hoạt tự động
Ngay sau khi giao dịch của bạn được ngân hàng xác nhận thành công:
- Hệ thống The Tulie Lab sẽ nhận tín hiệu và tự động chuyển trạng thái đơn hàng sang **Đã thanh toán**.
- Khóa học/Sản phẩm sẽ được thêm vào tài khoản của bạn ngay lập tức.
- Bạn sẽ nhận được email xác nhận kèm theo hóa đơn và hướng dẫn bắt đầu học tập.
- Toàn bộ quy trình thường chỉ mất từ **30 giây đến 2 phút**.

---

## 3. Hỗ trợ sự cố thanh toán
Nếu sau 10 phút bạn đã thanh toán thành công nhưng đơn hàng vẫn ở trạng thái "Chờ thanh toán", vui lòng thực hiện:
- Chụp ảnh màn hình biên lai giao dịch thành công.
- Liên hệ với chúng tôi qua Zalo hỗ trợ hoặc gửi email tới **support@tulielab.vn**.
- Chúng tôi sẽ kiểm tra và kích hoạt thủ công cho bạn trong vòng 15 phút.
`;

export default function PaymentGuidePage() {
    const [content, setContent] = useState(DEFAULT_PAYMENT_GUIDE);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const cms = await api.cms.get(['policy_payment_guide']) as any;
                if (cms?.policy_payment_guide) {
                    setContent(cms.policy_payment_guide);
                }
            } catch (e) {
                console.error('Failed to load payment guide:', e);
            }
        };
        loadContent();
    }, []);

    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-12 border-b pb-6">Hướng dẫn thanh toán</h1>
                <div className="prose prose-zinc dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                    prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:mb-6
                    prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-li:mb-2
                    prose-hr:my-10 prose-hr:border-zinc-100 dark:prose-hr:border-zinc-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
