'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_TERMS = `
Chào mừng bạn đến với **The Tulie Lab**. Website này được vận hành bởi **CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE**.

Bằng việc truy cập, đăng ký tài khoản hoặc sử dụng bất kỳ dịch vụ nào từ hệ thống LMS và cửa hàng sản phẩm số của chúng tôi, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ các điều khoản và điều kiện được quy định dưới đây.

---

## 1. Thông tin về Chủ sở hữu website

- **Tên đơn vị:** CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE
- **Mã số doanh nghiệp:** [Cập nhật MST của bạn tại đây]
- **Địa chỉ:** [Cập nhật địa chỉ trụ sở tại đây]
- **Đại diện pháp luật:** [Cập nhật tên người đại diện]
- **Email hỗ trợ:** support@tulielab.vn

---

## 2. Quy định về Tài khoản người dùng

1. **Đăng ký:** Người dùng phải cung cấp thông tin cá nhân chính xác, bao gồm Họ tên, Email và Số điện thoại liên lạc chính chủ. 

2. **Bảo mật:** Bạn có trách nhiệm bảo mật thông tin đăng nhập. Mọi hoạt động diễn ra dưới tài khoản của bạn sẽ được coi là do chính bạn thực hiện.

3. **Quyền đình chỉ:** Chúng tôi có quyền tạm khóa hoặc chấm dứt tài khoản mà không cần thông báo trước nếu phát hiện thông tin giả mạo, hành vi vi phạm bảo mật hệ thống hoặc dùng chung tài khoản trái phép.

---

## 3. Quyền sở hữu trí tuệ và Bản quyền sản phẩm

1. **Nội dung đào tạo:** Tất cả video, bài giảng, giáo trình, hình ảnh và mã nguồn mẫu trong các khóa học LMS đều thuộc quyền sở hữu độc quyền của **The Tulie Lab**.

2. **Giấy phép sử dụng:** Khi mua khóa học hoặc sản phẩm số, bạn được cấp quyền truy cập/sử dụng cho mục đích học tập cá nhân. 

3. **Hành vi nghiêm cấm:** 
   - Sao chép, phân phối, bán lại, cho thuê nội dung bài giảng dưới mọi hình thức.
   - Quay phim màn hình, tải xuống trái phép video bài giảng.
   - Sử dụng mã nguồn mẫu để phát triển sản phẩm cạnh tranh trực tiếp mà không có sự đồng ý bằng văn bản.

---

## 4. Chính sách bảo vệ quyền lợi người tiêu dùng

1. **Thông tin sản phẩm:** The Tulie Lab cam kết cung cấp thông tin trung thực về đầy đủ về nội dung bài giảng, trình độ yêu cầu và kết quả đạt được sau khóa học.

2. **Hỗ trợ kỹ thuật:** Chúng tôi hỗ trợ học viên giải quyết các lỗi truy cập hệ thống, lỗi thanh toán trong vòng 24-48 giờ làm việc.

3. **Giải quyết tranh chấp:** Mọi khiếu nại phát sinh từ việc sử dụng dịch vụ sẽ được ưu tiên giải quyết thông qua thương lượng, hòa giải. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại Việt Nam để giải quyết.

---

## 5. Giới hạn trách nhiệm

1. **Tính sẵn sàng của hệ thống:** Chúng tôi nỗ lực để hệ thống hoạt động 24/7 nhưng không đảm bảo dịch vụ không bao giờ bị gián đoạn do lỗi kỹ thuật hoặc sự cố hạ tầng internet ngoài tầm kiểm soát.

2. **Kết quả học tập:** Hiệu quả của việc học tập phụ thuộc vào nỗ lực cá nhân của học viên. Chúng tôi không đảm bảo kết quả đầu ra tuyệt đối nếu học viên không tuân thủ lộ trình học tập.

---

## 6. Điều khoản cuối cùng

The Tulie Lab có quyền cập nhật, sửa đổi các điều khoản này để phù hợp với quy định pháp luật và định hướng phát triển của Lab. Các thay đổi có hiệu lực ngay khi được đăng tải trên website chính thức. Việc bạn tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các điều khoản mới.
`;

export default function TermsPage() {
    const [content, setContent] = useState(DEFAULT_TERMS);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const cms = await api.cms.get(['policy_terms']) as any;
                if (cms?.policy_terms) {
                    setContent(cms.policy_terms);
                }
            } catch (e) {
                console.error('Failed to load terms:', e);
            }
        };
        loadContent();
    }, []);

    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-12 border-b pb-6">Điều khoản sử dụng</h1>
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
