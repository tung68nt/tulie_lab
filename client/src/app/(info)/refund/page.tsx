'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_REFUND = `
Tại The Tulie Lab, chúng tôi cam kết mang lại giá trị thực tiễn cho học viên. Chính sách hoàn tiền này được thiết kế để đảm bảo quyền lợi của bạn khi tham gia các khóa học và sử dụng sản phẩm của chúng tôi.

---

## 1. Điều kiện hoàn tiền
Chúng tôi hỗ trợ hoàn tiền 100% trong các trường hợp sau:
- **Lỗi kỹ thuật nghiêm trọng:** Bạn không thể truy cập nội dung khóa học hoặc sử dụng sản phẩm do lỗi từ hệ thống của chúng tôi mà không được khắc phục trong vòng 48 giờ làm việc.
- **Nội dung không đúng mô tả:** Nội dung khóa học thực tế khác xa so với giới thiệu và đề cương đã công bố trên website.
- **Yêu cầu trong thời hạn:** Bạn gửi yêu cầu hoàn tiền trong vòng 03 ngày kể từ thời điểm thanh toán thành công và chưa xem quá 20% tổng dung lượng bài giảng của khóa học.

---

## 2. Các trường hợp không được hoàn tiền
- Yêu cầu gửi sau thời hạn 03 ngày kể từ ngày mua.
- Bạn đã hoàn thành hoặc đã xem quá 20% nội dung khóa học.
- Lý do chủ quan từ phía người học như: không còn nhu cầu học, không có thời gian, hoặc đã nắm vững kiến thức.
- Các sản phẩm là template, mã nguồn hoặc tài liệu số có thể tải về trực tiếp.

---

## 3. Quy trình thực hiện
Để gửi yêu cầu hoàn tiền, vui lòng thực hiện các bước sau:
1. Gửi email tới địa chỉ **support@tulielab.vn**.
2. Tiêu đề email: [Yêu cầu hoàn tiền] - [Mã đơn hàng] - [Họ tên].
3. Cung cấp lý do chi tiết và hình ảnh minh họa (nếu có lỗi kỹ thuật).

Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 02 ngày làm việc. Nếu được chấp nhận, tiền sẽ được chuyển trả vào tài khoản ngân hàng của bạn trong vòng 05 - 07 ngày làm việc.
`;

export default function RefundPage() {
    const [content, setContent] = useState(DEFAULT_REFUND);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const cms = await api.cms.get(['policy_refund']) as any;
                if (cms?.policy_refund) {
                    setContent(cms.policy_refund);
                }
            } catch (e) {
                console.error('Failed to load refund policy:', e);
            }
        };
        loadContent();
    }, []);

    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-12 border-b pb-6">Chính sách hoàn tiền</h1>
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
