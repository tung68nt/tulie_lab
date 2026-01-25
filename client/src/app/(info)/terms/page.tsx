export default function TermsPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Điều khoản sử dụng</h1>
                <div className="prose dark:prose-invert max-w-none">
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">1. Chấp thuận các điều khoản</h2>
                            <p>Bằng việc truy cập và sử dụng website The Tulie Lab, bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">2. Quyền sở hữu trí tuệ</h2>
                            <p>Tất cả nội dung được cung cấp trên The Tulie Lab, bao gồm nhưng không giới hạn ở: bài giảng, video, hình ảnh, mã nguồn, tài liệu mẫu và thiết kế giao diện, đều thuộc quyền sở hữu trí tuệ của <strong>CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE</strong>.</p>
                            <p className="mt-2">Bạn được cấp quyền truy cập để phục vụ mục đích học tập cá nhân. Nghiêm cấm mọi hành vi sao chép, phân phối, thương mại hóa hoặc sử dụng lại nội dung mà không có sự đồng ý bằng văn bản từ chúng tôi.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">3. Tài khoản người dùng</h2>
                            <p>Khi đăng ký tài khoản, bạn có trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động xảy ra dưới tài khoản của mình. Bạn đồng ý cung cấp thông tin chính xác và cập nhật để đảm bảo quyền lợi khi sử dụng dịch vụ.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">4. Quy định sử dụng dịch vụ</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Không sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào.</li>
                                <li>Không cố gắng can thiệp vào hoạt động của hệ thống hoặc xâm nhập trái phép dữ liệu.</li>
                                <li>Mỗi tài khoản khóa học chỉ dành cho một người sử dụng duy nhất. Hành vi chia sẻ tài khoản có thể dẫn đến việc đình chỉ tài khoản vĩnh viễn mà không hoàn tiền.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">5. Giới hạn trách nhiệm</h2>
                            <p>Chúng tôi luôn nỗ lực để cung cấp nội dung chất lượng nhất, tuy nhiên The Tulie Lab không đảm bảo rằng dịch vụ sẽ không bao giờ có sai sót hoặc gián đoạn. Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-zinc-900 mb-4">6. Thay đổi điều khoản</h2>
                            <p>Chúng tôi có quyền cập nhật các điều khoản này bất kỳ lúc nào để phù hợp với quy định pháp luật hoặc thay đổi trong hoạt động kinh doanh. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
