export default function PrivacyPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Chính sách bảo mật</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <div className="space-y-6">
                        <p>The Tulie Lab hiểu rằng sự riêng tư của bạn là vô cùng quan trọng. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng dịch vụ của chúng tôi.</p>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">1. Thông tin chúng tôi thu thập</h2>
                            <p>Chúng tôi thu thập các loại thông tin sau:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Thông tin định danh:</strong> Tên, địa chỉ email, số điện thoại khi bạn đăng ký tài khoản.</li>
                                <li><strong>Thông tin thanh toán:</strong> Lịch sử giao dịch và các thông tin cần thiết để xác nhận thanh toán (không bao gồm thông tin thẻ tín dụng trực tiếp nếu thanh toán qua cổng trung gian).</li>
                                <li><strong>Dữ liệu sử dụng:</strong> Thông tin về cách bạn tương tác với các bài giảng, thời gian học tập và tiến độ hoàn thành khóa học.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">2. Cách chúng tôi sử dụng thông tin</h2>
                            <p>Thông tin của bạn được sử dụng cho các mục đích:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Cung cấp và duy trì dịch vụ học tập trực tuyến.</li>
                                <li>Xác nhận đơn hàng và kích hoạt quyền truy cập khóa học.</li>
                                <li>Gửi thông báo về cập nhật nội dung, tính năng mới hoặc các chương trình khuyến mãi (nếu bạn đồng ý nhận).</li>
                                <li>Cải thiện chất lượng dịch vụ bài giảng và trải nghiệm người dùng trên hệ thống.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">3. Bảo mật thông tin</h2>
                            <p>Chúng tôi áp dụng các biện pháp an ninh kỹ thuật và hành chính để bảo vệ dữ liệu cá nhân của bạn khỏi việc truy cập, thay đổi hoặc phá hủy trái phép. Dữ liệu của bạn được lưu trữ trên hệ thống máy chủ an toàn với các giao thức mã hóa hiện đại.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">4. Chia sẻ thông tin với bên thứ ba</h2>
                            <p>The Tulie Lab cam kết không bán hoặc cho thuê thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Với các đối tác thanh toán để thực hiện giao dịch của bạn.</li>
                                <li>Khi có yêu cầu từ cơ quan pháp luật có thẩm quyền theo quy định của pháp luật Việt Nam.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">5. Quyền của bạn</h2>
                            <p>Bạn có quyền truy cập, chỉnh sửa thông tin cá nhân của mình bất kỳ lúc nào thông qua trang quản lý tài khoản. Bạn cũng có quyền yêu cầu chúng tôi xóa dữ liệu cá nhân của mình trong các trường hợp cụ thể.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
