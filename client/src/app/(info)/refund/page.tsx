'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_REFUND = `
Tại **The Tulie Lab**, chúng tôi cam kết mang lại trải nghiệm học tập tốt nhất cho học viên. Tuy nhiên, do đặc thù của các sản phẩm số (khóa học trực tuyến, template, mã nguồn) là nội dung có thể được tiêu thụ ngay sau khi truy cập, chính sách hoàn tiền của chúng tôi được quy định cụ thể như sau:

---

## 1. Điều kiện được yêu cầu hoàn tiền

Chúng tôi sẽ xem xét hoàn trả 100% học phí hoặc giá trị đơn hàng nếu rơi vào một trong các trường hợp sau:

1. **Lỗi kỹ thuật hệ thống:** Bạn không thể truy cập khóa học hoặc sử dụng sản phẩm do lỗi từ phía máy chủ của The Tulie Lab và chúng tôi không thể khắc phục được trong vòng 48 giờ làm việc kể từ khi nhận được thông báo.

2. **Nội dung sai lệch nghiêm trọng:** Nội dung khóa học thực tế khác xa (trên 50%) so với mô tả, đề cương đã được công bố trên website tại thời điểm bạn thực hiện thanh toán.

3. **Thanh toán trùng:** Bạn vô tình thực hiện thanh toán nhiều lần cho cùng một sản phẩm/khóa học.

---

## 2. Các trường hợp không được hoàn tiền

Chúng tôi rất tiếc không thể hỗ trợ hoàn tiền trong các tình huống sau:

- Khách hàng đã mở xem quá **20% tổng số bài giảng** của khóa học (hệ thống có log record thời gian học của từng tài khoản).
- Khách hàng đã tải xuống các tài liệu đính kèm, mã nguồn mẫu hoặc template có trong sản phẩm.
- Các lý do chủ quan từ phía khách hàng như: máy tính không đủ cấu hình, không có thời gian học, thay đổi nhu cầu cá nhân hoặc cảm thấy kiến thức không phù hợp sau khi đã xem phần lớn nội dung.
- Quá thời hạn **03 ngày** kể từ ngày thanh toán đơn hàng thành công.

---

## 3. Thời hạn và quy trình thực hiện

### 1. Thời hạn yêu cầu

Mọi yêu cầu hoàn tiền phải được gửi về cho chúng tôi trong vòng **72 giờ (03 ngày)** kể từ thời điểm giao dịch thành công.

### 2. Hồ sơ yêu cầu

Khách hàng gửi yêu cầu qua email **support@tulielab.vn** với tiêu đề: **[Yêu cầu hoàn tiền] - [Mã đơn hàng] - [Họ tên]**.

Trong email vui lòng ghi rõ lý do yêu cầu hoàn tiền và đính kèm hình ảnh biên lai thanh toán hoặc ảnh chụp lỗi kỹ thuật (nếu có).

### 3. Thời gian xử lý

The Tulie Lab sẽ phản hồi về tính hợp lệ của yêu cầu trong vòng **02 ngày làm việc**. Nếu yêu cầu được chấp nhận, tiền sẽ được hoàn về cho khách hàng qua tài khoản ngân hàng hoặc phương thức thanh toán ban đầu trong vòng **05 - 07 ngày làm việc**.

---

## 4. Liên hệ hỗ trợ

Nếu bạn có bất kỳ thắc mắc nào về chính sách này, vui lòng liên hệ:

- **Email:** support@tulielab.vn
- **Hotline/Zalo:** [Cập nhật số hotline của bạn]
- **Địa chỉ:** [Cập nhật địa chỉ trụ sở]
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
