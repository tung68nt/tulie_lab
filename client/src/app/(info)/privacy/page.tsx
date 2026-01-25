'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_PRIVACY = `
**The Tulie Lab** cam kết bảo vệ bí mật thông tin cá nhân của người dùng. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn để tuân thủ pháp luật Việt Nam về Thương mại điện tử.

---

## 1. Mục đích thu thập thông tin cá nhân

Việc thu thập dữ liệu chủ yếu trên website bao gồm: Email, điện thoại, tên đăng nhập, mật khẩu đăng nhập, địa chỉ khách hàng. Đây là các thông tin mà chúng tôi cần bạn cung cấp bắt buộc khi đăng ký sử dụng dịch vụ và để chúng tôi liên hệ xác nhận khi bạn đăng ký sử dụng dịch vụ trên website nhằm đảm bảo quyền lợi cho cho người tiêu dùng.

---

## 2. Phạm vi sử dụng thông tin

Website sử dụng thông tin người dùng cung cấp để:

- Cung cấp các dịch vụ/khóa học đến người dùng.
- Gửi các thông báo về các hoạt động trao đổi thông tin giữa người dùng và website.
- Ngăn ngừa các hoạt động phá hủy tài khoản người dùng hoặc các hoạt động giả mạo người dùng.
- Liên lạc và giải quyết với người dùng trong những trường hợp đặc biệt.
- Không sử dụng thông tin cá nhân của người dùng ngoài mục đích xác nhận và liên hệ có liên quan đến giao dịch tại website.

---

## 3. Thời gian lưu trữ thông tin

Dữ liệu cá nhân của người dùng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ từ người dùng hoặc tự người dùng đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân người dùng sẽ được bảo mật trên máy chủ của The Tulie Lab.

---

## 4. Những người hoặc tổ chức có thể được tiếp cận với thông tin đó

Chúng tôi cam kết không chia sẻ thông tin cá nhân của khách hàng với bất kỳ bên thứ ba nào, ngoại trừ các trường hợp sau:

- Các đối tác cung cấp dịch vụ thanh toán (để thực hiện giao dịch).
- Cơ quan nhà nước có thẩm quyền khi có yêu cầu theo quy định của pháp luật.
- Ban quản trị website, bộ phận kỹ thuật và chăm sóc khách hàng của The Tulie Lab.

---

## 5. Địa chỉ của đơn vị thu thập và quản lý thông tin

- **Tên đơn vị:** CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE
- **Địa chỉ:** [Cập nhật địa chỉ trụ sở của bạn]
- **Email:** support@tulielab.vn

---

## 6. Phương thức và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân

Người dùng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản và chỉnh sửa thông tin cá nhân hoặc yêu cầu chúng tôi thực hiện việc này qua email: support@tulielab.vn.

---

## 7. Cơ chế tiếp nhận và giải quyết khiếu nại của người tiêu dùng

Thông tin cá nhân của người dùng trên website được cam kết bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân. Việc thu thập và sử dụng thông tin của mỗi người dùng chỉ được thực hiện khi có sự đồng ý của khách hàng đó trừ những trường hợp pháp luật có quy định khác.

Khi phát hiện thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi, người dùng gửi email khiếu nại đến support@tulielab.vn kèm theo các bằng chứng liên quan. Ban quản trị cam kết sẽ phản hồi ngay lập tức hoặc muộn nhất là trong vòng 48 giờ làm việc kể từ thời điểm nhận được khiếu nại để cùng người dùng thống nhất phương án giải quyết.
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
                <h1 className="text-3xl font-bold mb-12 border-b pb-6">Chính sách bảo mật</h1>
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
