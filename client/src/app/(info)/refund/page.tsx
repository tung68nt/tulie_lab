export default function RefundPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Chính sách hoàn tiền</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <div className="space-y-6">
                        <p>Tại The Tulie Lab, chúng tôi cam kết mang lại giá trị thực tiễn cho học viên. Chính sách hoàn tiền này được thiết kế để đảm bảo quyền lợi của bạn khi tham gia các khóa học và sử dụng sản phẩm của chúng tôi.</p>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">1. Điều kiện hoàn tiền</h2>
                            <p>Chúng tôi hỗ trợ hoàn tiền 100% trong các trường hợp sau:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Lỗi kỹ thuật nghiêm trọng:</strong> Bạn không thể truy cập nội dung khóa học hoặc sử dụng sản phẩm do lỗi từ hệ thống của chúng tôi mà không được khắc phục trong vòng 48 giờ làm việc.</li>
                                <li><strong>Nội dung không đúng mô tả:</strong> Nội dung khóa học thực tế khác xa so với giới thiệu và đề cương đã công bố trên website.</li>
                                <li><strong>Yêu cầu trong thời hạn:</strong> Bạn gửi yêu cầu hoàn tiền trong vòng 03 ngày kể từ thời điểm thanh toán thành công và chưa xem quá 20% tổng dung lượng bài giảng của khóa học.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">2. Các trường hợp không được hoàn tiền</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Yêu cầu gửi sau thời hạn 03 ngày kể từ ngày mua.</li>
                                <li>Bạn đã hoàn thành hoặc đã xem quá 20% nội dung khóa học.</li>
                                <li>Lý do chủ quan từ phía người học như: không còn nhu cầu học, không có thời gian, hoặc đã nắm vững kiến thức.</li>
                                <li>Các sản phẩm là template, mã nguồn hoặc tài liệu số có thể tải về trực tiếp.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">3. Quy trình thực hiện</h2>
                            <p>Để gửi yêu cầu hoàn tiền, vui lòng thực hiện các bước sau:</p>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Gửi email tới địa chỉ <strong>support@tulielab.vn</strong>.</li>
                                <li>Tiêu đề email: [Yêu cầu hoàn tiền] - [Mã đơn hàng] - [Họ tên].</li>
                                <li>Cung cấp lý do chi tiết và hình ảnh minh họa (nếu có lỗi kỹ thuật).</li>
                            </ol>
                            <p className="mt-4">Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 02 ngày làm việc. Nếu được chấp nhận, tiền sẽ được chuyển trả vào tài khoản ngân hàng của bạn trong vòng 05 - 07 ngày làm việc.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
