'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_PRIVACY = `
The Tulie Lab hiểu rằng sự riêng tư của bạn là vô cùng quan trọng. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng dịch vụ của chúng tôi.

## 1. Thông tin chúng tôi thu thập
Chúng tôi thu thập các loại thông tin sau:
- **Thông tin định danh:** Tên, địa chỉ email, số điện thoại khi bạn đăng ký tài khoản.
- **Thông tin thanh toán:** Lịch sử giao dịch và các thông tin cần thiết để xác nhận thanh toán (không bao gồm thông tin thẻ tín dụng trực tiếp nếu thanh toán qua cổng trung gian).
- **Dữ liệu sử dụng:** Thông tin về cách bạn tương tác với các bài lectures, thời gian học tập và tiến độ hoàn thành khóa học.

## 2. Cách chúng tôi sử dụng thông tin
Thông tin của bạn được sử dụng cho các mục đích:
- Cung cấp và duy trì dịch vụ học tập trực tuyến.
- Xác nhận đơn hàng và kích hoạt quyền truy cập khóa học.
- Gửi thông báo về cập nhật nội dung, tính năng mới hoặc các chương trình khuyến mãi (nếu bạn đồng ý nhận).
- Cải thiện chất lượng dịch vụ bài giảng và trải nghiệm người dùng trên hệ thống.

## 3. Bảo mật thông tin
Chúng tôi áp dụng các biện pháp an ninh kỹ thuật và hành chính để bảo vệ dữ liệu cá nhân của bạn khỏi việc truy cập, thay đổi hoặc phá hủy trái phép. Dữ liệu của bạn được lưu trữ trên hệ thống máy chủ an toàn với các giao thức mã hóa hiện đại.

## 4. Chia sẻ thông tin với bên thứ ba
The Tulie Lab cam kết không bán hoặc cho thuê thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp:
- Với các đối tác thanh toán để thực hiện giao dịch của bạn.
- Khi có yêu cầu từ cơ quan pháp luật có thẩm quyền theo quy định của pháp luật Việt Nam.

## 5. Quyền của bạn
Bạn có quyền truy cập, chỉnh sửa thông tin cá nhân của mình bất kỳ lúc nào thông qua trang quản lý tài khoản. Bạn cũng có quyền yêu cầu chúng tôi xóa dữ liệu cá nhân của mình trong các trường hợp cụ thể.
`;

export default function PrivacyPage() {
    const [content, setContent] = useState(DEFAULT_PRIVACY);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const cms = await api.cms.get(['policy_privacy']) as any;
                if (cms?.policy_privacy) {
                    setContent(cms.policy_privacy);
                }
            } catch (e) {
                console.error('Failed to load privacy policy:', e);
            }
        };
        loadContent();
    }, []);

    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Chính sách bảo mật</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
