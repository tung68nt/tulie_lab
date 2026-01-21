export default function PaymentGuidePage() {
    return (
        <div className="container py-12 md:py-20 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Hướng dẫn thanh toán</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p>The Tulie Lab hỗ trợ nhiều phương thức thanh toán để thuận tiện cho bạn.</p>
                <h3>1. Chuyển khoản ngân hàng (QR Code)</h3>
                <p>Sau khi đặt hàng, bạn sẽ nhận được mã QR. Vui lòng quét mã để thanh toán chính xác số tiền và nội dung chuyển khoản.</p>
                <h3>2. Kích hoạt tự động</h3>
                <p>Hệ thống sẽ tự động kích hoạt khóa học/sản phẩm ngay sau khi nhận được thanh toán (thường trong vòng 1-2 phút).</p>
                {/* Add more placeholder content as needed */}
                <p><em>(Nội dung chi tiết đang được cập nhật...)</em></p>
            </div>
        </div>
    );
}
