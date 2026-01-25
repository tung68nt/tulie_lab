'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_PAYMENT_GUIDE = `
Để đảm bảo quyền lợi và sự thuận tiện cho khách hàng, **The Tulie Lab** áp dụng quy trình thanh toán và giao nhận sản phẩm số theo các tiêu chuẩn thương mại điện tử hiện hành.

---

## 1. Các phương thức thanh toán

Chúng tôi hỗ trợ các phương thức thanh toán linh hoạt sau:

### 1.1. Chuyển khoản ngân hàng (Auto QR)

- Đây là phương thức nhanh nhất và được hệ thống ưu tiên. 
- Bạn chỉ cần mở ứng dụng ngân hàng và quét mã QR hiển thị tại trang thanh toán.
- Hệ thống sẽ tự động điền **Số tiền** và **Nội dung chuyển khoản**. Vui lòng không thay đổi các thông tin này để việc kích hoạt diễn ra tự động.

### 1.2. Thanh toán qua Cổng trung gian (MoMo, ZaloPay...)

- (Nếu hệ thống có tích hợp) Bạn thực hiện theo hướng dẫn trên màn hình của nhà cung cấp dịch vụ thanh toán.

---

## 2. Chính sách Giao nhận sản phẩm số

Vì sản phẩm của chúng tôi là nội dung số (khóa học trực tuyến, template, mã nguồn), quy trình giao nhận được thực hiện như sau:

1. **Phương thức giao hàng:** Hệ thống tự động kích hoạt quyền truy cập vào tài khoản của khách hàng hoặc gửi link tải về qua Email đăng ký.

2. **Thời gian giao hàng:** 
   - Đối với thanh toán tự động (QR Code thành công): Kích hoạt ngay lập tức (trong vòng **30 giây - 02 phút**).
   - Đối với các trường hợp thanh toán thủ công hoặc có sự cố: Thời gian kích hoạt tối đa là **24 giờ** kể từ khi chúng tôi nhận được bằng chứng thanh toán thành công.

3. **Phí vận chuyển:** Hoàn toàn miễn phí.

---

## 3. Bảo mật giao dịch thanh toán

1. **Cam kết:** Chúng tôi cam kết đảm bảo thực hiện nghiêm túc các biện pháp bảo mật cần thiết cho mọi hoạt động thanh toán thực hiện trên website.

2. **Hạ tầng bảo mật:** Website sử dụng chứng chỉ bảo mật SSL để mã hóa thông tin thanh toán của khách hàng.

3. **Lưu ý:** Khách hàng không nên cung cấp chi tiết thông tin thanh toán cho bất kỳ ai bằng e-mail hoặc các hình thức liên lạc khác. Chúng tôi không chịu trách nhiệm về những mất mát khách hàng có thể gánh chịu do việc trao đổi thông tin thanh toán không an toàn.

---

## 4. Giải quyết sự cố thanh toán

Trong trường hợp bạn đã thanh toán thành công nhưng chưa nhận được sản phẩm sau 10 phút:

- Kiểm tra hòm thư **Spam/Rác** nếu là link tải về.
- Chụp ảnh màn hình biên lai giao dịch thành công.
- Liên hệ ngay với bộ phận hỗ trợ qua Hotline/Zalo: [Cập nhật số điện thoại] hoặc gửi yêu cầu tới **support@tulielab.vn**.

Chúng tôi sẽ kiểm tra và thực hiện kích hoạt thủ công ngay khi xác nhận được dòng tiền từ tài khoản phía chúng tôi.
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
