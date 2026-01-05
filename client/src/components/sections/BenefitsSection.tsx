'use client';

export function BenefitsSection() {
    const columns = [
        {
            title: 'Nền tảng Học Online',
            items: [
                'Không giới hạn tính năng',
                'Thanh toán trực tuyến tự động',
                'Mở rộng tính năng theo yêu cầu',
                'Tối ưu SEO, quảng cáo trực tuyến',
                'Trả phí một lần duy nhất',
                'Bảo trì & nâng cấp trọn đời',
                'Làm chủ dữ liệu học viên',
            ],
            cta: { text: 'Tìm hiểu thêm', href: '/courses' }
        },
        {
            title: 'Marketing Đào tạo',
            items: [
                'Định vị thương hiệu trung tâm',
                'Chiến lược marketing tổng thể',
                'Phân tích dữ liệu tuyển sinh',
                'Marketing Automation & CRM',
                'Tối ưu chỉ số CLV, CAC, CPL',
                'Tuyển sinh đa kênh SEO, PPC,...',
                'Báo cáo minh bạch KPI rõ ràng',
            ],
            cta: { text: 'Liên hệ tư vấn', href: '/contact' }
        },
        {
            title: 'CRM Phát triển Học viên',
            items: [
                'Báo cáo quản trị đa góc nhìn',
                'Theo dõi phân nhóm học viên',
                'Đồng bộ Leads các nguồn',
                'Tự động hóa email chăm sóc',
                'Lưu trữ thông tin học viên',
                'Quản trị dự án, công việc',
                'Đề xuất hành động cải tiến',
            ],
            cta: { text: 'Xem demo', href: '/contact' }
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Đồng Hành & Cùng Phát Triển
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Từ nền tảng công nghệ học trực tuyến đến đối tác chiến lược marketing tăng trưởng kinh doanh
                    </p>
                </div>

                {/* 3 Column Benefits */}
                <div className="grid md:grid-cols-3 gap-6">
                    {columns.map((column, idx) => (
                        <div
                            key={idx}
                            className="bg-card border rounded-lg overflow-hidden"
                        >
                            {/* Column Header */}
                            <div className="bg-foreground text-background py-4 px-6 text-center">
                                <h3 className="font-semibold text-lg">{column.title}</h3>
                            </div>

                            {/* Items List */}
                            <div className="p-6 space-y-4">
                                {column.items.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 text-foreground mt-0.5 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="px-6 pb-6">
                                <a
                                    href={column.cta.href}
                                    className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                                >
                                    {column.cta.text}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
