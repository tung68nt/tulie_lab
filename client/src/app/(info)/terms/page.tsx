'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_TERMS = `
## 1. Chấp thuận các điều khoản
Bằng việc truy cập và sử dụng website The Tulie Lab, bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.

---

## 2. Quyền sở hữu trí tuệ
Tất cả nội dung được cung cấp trên The Tulie Lab, bao gồm nhưng không giới hạn ở: bài giảng, video, hình ảnh, mã nguồn, tài liệu mẫu và thiết kế giao diện, đều thuộc quyền sở hữu trí tuệ của **CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE**.

Bạn được cấp quyền truy cập để phục vụ mục đích học tập cá nhân. Nghiêm cấm mọi hành vi sao chép, phân phối, thương mại hóa hoặc sử dụng lại nội dung mà không có sự đồng ý bằng văn bản từ chúng tôi.

---

## 3. Tài khoản người dùng
Khi đăng ký tài khoản, bạn có trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động xảy ra dưới tài khoản của mình. Bạn đồng ý cung cấp thông tin chính xác và cập nhật để đảm bảo quyền lợi khi sử dụng dịch vụ.

---

## 4. Quy định sử dụng dịch vụ
- Không sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào.
- Không cố gắng can thiệp vào hoạt động của hệ thống hoặc xâm nhập trái phép dữ liệu.
- Mỗi tài khoản khóa học chỉ dành cho một người sử dụng duy nhất. Hành vi chia sẻ tài khoản có thể dẫn đến việc đình chỉ tài khoản vĩnh viễn mà không hoàn tiền.

---

## 5. Giới hạn trách nhiệm
Chúng tôi luôn nỗ lực để cung cấp nội dung chất lượng nhất, tuy nhiên The Tulie Lab không đảm bảo rằng dịch vụ sẽ không bao giờ có sai sót hoặc gián đoạn. Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.

---

## 6. Thay đổi điều khoản
Chúng tôi có quyền cập nhật các điều khoản này bất kỳ lúc nào để phù hợp với quy định pháp luật hoặc thay đổi trong hoạt động kinh doanh. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.
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
