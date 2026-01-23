export default function PrivacyPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Chính sách bảo mật</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p>The Tulie Lab cam kết bảo mật thông tin cá nhân của khách hàng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.</p>
                    <h3>1. Thu thập thông tin</h3>
                    <p>Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản, mua hàng hoặc liên hệ với chúng tôi (Email, SĐT, Tên...).</p>
                    <h3>2. Sử dụng thông tin</h3>
                    <p>Thông tin được sử dụng để xử lý đơn hàng, gửi thông báo khóa học và hỗ trợ kỹ thuật.</p>
                    {/* Add more placeholder content as needed */}
                    <p><em>(Nội dung chi tiết đang được cập nhật...)</em></p>
                </div>
            </div>
        </div>
    );
}
