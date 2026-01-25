export default function PaymentGuidePage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Hướng dẫn thanh toán</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <div className="space-y-6">
                        <p>Để giúp bạn tiếp cận các khóa học và sản phẩm của The Tulie Lab một cách nhanh chóng nhất, chúng tôi áp dụng quy trình thanh toán tự động hiện đại.</p>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">1. Chuyển khoản ngân hàng (Auto QR)</h2>
                            <p>Đây là phương thức thanh toán nhanh nhất và được khuyến khích sử dụng. Sau khi nhấn "Thanh toán" tại giỏ hàng, hệ thống sẽ hiển thị một mã QR kèm theo số tiền và nội dung chuyển khoản được định danh duy nhất cho đơn hàng của bạn.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Bước 1:</strong> Mở ứng dụng Ngân hàng (Mobile Banking) của bạn.</li>
                                <li><strong>Bước 2:</strong> Chọn tính năng "Quét mã QR".</li>
                                <li><strong>Bước 3:</strong> Quét mã QR hiển thị trên màn hình đơn hàng. Hệ thống sẽ tự động điền Số tiền và Nội dung chuyển khoản.</li>
                                <li><strong>Bước 4:</strong> Xác nhận giao dịch thành công.</li>
                            </ul>
                            <div className="bg-zinc-50 border-l-4 border-zinc-900 p-4 mt-4 text-sm">
                                <strong>Lưu ý quan trọng:</strong> Vui lòng không thay đổi nội dung chuyển khoản tự động để hệ thống có thể nhận diện và kích hoạt đơn hàng ngay lập tức.
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">2. Quy trình kích hoạt tự động</h2>
                            <p>Ngay sau khi giao dịch của bạn được ngân hàng xác nhận thành công:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Hệ thống The Tulie Lab sẽ nhận tín hiệu và tự động chuyển trạng thái đơn hàng sang <strong>Đã thanh toán</strong>.</li>
                                <li>Khóa học/Sản phẩm sẽ được thêm vào tài khoản của bạn ngay lập tức.</li>
                                <li>Bạn sẽ nhận được email xác nhận kèm theo hóa đơn và hướng dẫn bắt đầu học tập.</li>
                                <li>Toàn bộ quy trình thường chỉ mất từ <strong>30 giây đến 2 phút</strong>.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">3. Hỗ trợ sự cố thanh toán</h2>
                            <p>Nếu sau 10 phút bạn đã thanh toán thành công nhưng đơn hàng vẫn ở trạng thái "Chờ thanh toán", vui lòng thực hiện:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Chụp ảnh màn hình biên lai giao dịch thành công.</li>
                                <li>Liên hệ với chúng tôi qua Zalo hỗ trợ hoặc gửi email tới <strong>support@tulielab.vn</strong>.</li>
                                <li>Chúng tôi sẽ kiểm tra và kích hoạt thủ công cho bạn trong vòng 15 phút.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
