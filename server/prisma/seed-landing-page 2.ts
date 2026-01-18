
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FULL_LANDING_PAGE = {
    title: "Mẫu Landing Page Đầy Đủ (Review)",
    slug: "mau-day-du-tinh-nang",
    description: "Trang mẫu demo tất cả các component sections có thể sử dụng trong hệ thống.",
    isActive: true,
    sections: [
        {
            "id": "hero-1",
            "type": "hero",
            "title": "Kinh doanh khóa học thành công",
            "subtitle": "x100 học viên chỉ trong 30 ngày với chiến lược thực chiến từ chuyên gia. \nChúng tôi cung cấp giải pháp toàn diện từ xây dựng nội dung, marketing đến vận hành hệ thống tự động.",
            "ctaText": "Đăng ký tư vấn ngay",
            "ctaLink": "#pricing",
            "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop"
        },
        // ... (Stats and Benefits skipped for brevity as they weren't requested to change deeply)
        {
            "id": "stats-1",
            "type": "stats",
            "items": [
                { "title": "Học viên", "description": "10,000+", "icon": "GraduationCap" },
                { "title": "Khóa học", "description": "500+", "icon": "MonitorPlay" },
                { "title": "Tỷ lệ hoàn thành", "description": "94%", "icon": "Trophy" },
                { "title": "Đối tác", "description": "200+", "icon": "Briefcase" }
            ]
        },
        {
            "id": "benefits-1",
            "type": "benefits",
            "title": "Bạn sẽ nhận được gì?",
            "subtitle": "Giải pháp toàn diện cho người kinh doanh tri thức",
            "items": [
                { "title": "Hệ thống tự động", "description": "Quy trình bán hàng và chăm sóc học viên tự động 100%.", "icon": "Settings" },
                { "title": "Chiến lược content", "description": "Công thức viết bài quảng cáo 'thôi miên' khách hàng.", "icon": "PenTool" },
                { "title": "Xây dựng thương hiệu", "description": "Định vị chuyên gia trong ngách của bạn.", "icon": "Award" },
                { "title": "Cộng đồng hỗ trợ", "description": "Tham gia network 10.000+ giảng viên thành công.", "icon": "Users" }
            ]
        },
        {
            "id": "instructor-grid-1",
            "type": "instructor-grid",
            "title": "Gặp gỡ chuyên gia",
            "subtitle": "Đội ngũ mentor giàu kinh nghiệm thực chiến",
            "items": [
                { "name": "Tony Hoàng", "role": "Founder Tulie Academy", "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop", "bio": "10 năm kinh nghiệm Digital Marketing, từng triển khai hệ thống cho các tập đoàn lớn.", "subtitle": "CEO TechGroup" },
                { "name": "Helen Phạm", "role": "Content Strategy Director", "image": "https://images.unsplash.com/photo-1573496359-7013ac2bebb5?w=400&h=400&fit=crop", "bio": "Tác giả 3 cuốn sách Best-seller về Content Marketing.", "subtitle": "Author & Speaker" }
            ]
        },
        {
            "id": "instructor-bio-1",
            "type": "instructor-bio",
            "title": "Và mình sẽ là người hướng dẫn bạn trực tiếp",
            "subtitle": "Chuyên gia thực chiến hướng dẫn bạn từng bước làm chi tiết",
            "items": [
                {
                    "title": "Tung Nguyen",
                    "subtitle": "Founder Tulie Academy",
                    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
                    "description": "Founder Tulie Academy. Với 10+ năm kinh nghiệm trong lĩnh vực lập trình và xây dựng sản phẩm số. Tôi đã giúp hàng ngàn học viên từ con số 0 trở thành lập trình viên chuyên nghiệp và tự xây dựng business riêng.",
                    "features": [
                        "Hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và đào tạo.",
                        "Từng làm việc tại các tập đoàn công nghệ lớn.",
                        "Kinh nghiệm xây dựng và vận hành hệ thống Automation Marketing."
                    ]
                }
            ]
        },
        {
            "id": "training-history-1",
            "type": "content-block",
            "title": "Lịch sử đào tạo & sự kiện",
            "subtitle": "Hành trình lan tỏa giá trị đến cộng đồng",
            "items": [
                {
                    "title": "Workshop Hà Nội 2024",
                    "subtitle": "Hơn 500 học viên tham dự",
                    "description": "Sự kiện chia sẻ về xu hướng KDOL 2025 với sự góp mặt của nhiều chuyên gia đầu ngành.",
                    "image": "https://images.unsplash.com/photo-1544531696-934845326197?q=80&w=1000&auto=format&fit=crop"
                },
                {
                    "title": "Bootcamp Hồ Chí Minh",
                    "subtitle": "3 ngày đào tạo thực chiến",
                    "description": "Chương trình huấn luyện chuyên sâu giúp học viên ra đơn ngay tại lớp.",
                    "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop"
                }
            ]
        },
        {
            "id": "student-showcase-1",
            "type": "student-showcase",
            "title": "Câu chuyện thành công từ học viên",
            "subtitle": "Kết quả thực tế từ những học viên đã áp dụng kiến thức vào công việc kinh doanh và sự nghiệp.",
            "items": [
                {
                    "title": "Helen Hải",
                    "subtitle": "Khoá học: Ma trận dịch vụ spa",
                    "image": "https://plus.unsplash.com/premium_photo-1661772661721-b16346fe5b0f?q=80&w=2940&auto=format&fit=crop",
                    "avatar": "https://randomuser.me/api/portraits/women/44.jpg",
                    "before": [
                        "Tốn nhiều thời gian để dạy trực tiếp.",
                        "Dạy đi dạy lại một mảng kiến thức sinh ra nhàm chán.",
                        "Không ứng dụng marketing online nên số lượng học viên không đều."
                    ],
                    "after": [
                        "Đạt doanh số trăm triệu ngay sau 1 tháng.",
                        "Xây dựng được cộng đồng và bán được gói tư vấn giá cao.",
                        "Giảm thời gian đào tạo và có thêm thời gian mở rộng kinh doanh."
                    ],
                    "quote": "Chương trình đã thay đổi hoàn toàn tư duy kinh doanh của tôi."
                },
                {
                    "title": "Hoàng Lê Na",
                    "subtitle": "Khoá học: Vận hành F&B",
                    "image": "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80",
                    "avatar": "https://randomuser.me/api/portraits/women/68.jpg",
                    "before": [
                        "Chưa có kinh nghiệm làm đào tạo.",
                        "Không có thương hiệu cá nhân.",
                        "Không quá giỏi về công nghệ, chỉ có kinh nghiệm chuyên môn F&B."
                    ],
                    "after": [
                        "Tạo ra khoá học sau 1 tuần.",
                        "Đạt ~50 học viên mới trong vòng 15 ngày.",
                        "Xây dựng được Thương hiệu cá nhân qua khoá Elearning.",
                        "Gia tăng thêm nguồn thu ngoài việc kinh doanh chính."
                    ]
                },
                {
                    "title": "Tuấn Anh",
                    "subtitle": "Khoá học: Đầu tư chứng khoán",
                    "image": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
                    "avatar": "https://randomuser.me/api/portraits/men/32.jpg",
                    "before": [
                        "Chỉ tư vấn 1-1 tốn nhiều thời gian.",
                        "Không scale được số lượng khách hàng.",
                        "Thu nhập bị giới hạn bởi thời gian."
                    ],
                    "after": [
                        "Đóng gói khóa học Basic bán tự động.",
                        "Tập trung tư vấn gói Premium giá cao.",
                        "Xây dựng kênh Youtube 100k sub."
                    ]
                }
            ]
        },
        {
            "id": "bonus-gifts",
            "type": "bonus",
            "title": "Bộ quà tặng trị giá: 2.997.000đ",
            "subtitle": "Dành riêng cho bạn khi đăng ký lộ trình này ngay hôm nay. Tổng giá trị quà tặng sẽ được trừ trực tiếp.",
            "items": [
                {
                    "title": "Khóa học quảng cáo Facebook từ Zero tới Hero",
                    "price": "999.000 vnđ",
                    "image": "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&q=80&w=1000",
                    "features": [
                        "Công thức phát triển Fanpage từ 0 - 50.000 follower thật (không mua like)",
                        "Chạy quảng cáo nhắn tin bán hàng",
                        "Chạy quảng cáo website bán hàng",
                        "Cấu trúc quảng cáo 1-1-N, 1-N-2 để tự động tìm nội dung quảng cáo tốt nhất và khách hàng chuẩn",
                        "Công thức làm quảng cáo tiết kiệm chi phí",
                        "Bí mật giúp mình bán hơn 30.000 đơn hàng trên Facebook"
                    ]
                },
                {
                    "title": "24 file công việc/ kế hoạch Marketing",
                    "price": "999.000 vnđ",
                    "image": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
                    "description": "Cung cấp cho học viên 24 bộ tài liệu Marketing và kinh doanh. Đã được thiết lập sẵn, ứng dụng cho mọi kế hoạch Marketing, mọi ngành nghề. Chỉ cần chỉnh sửa thay đổi theo dự án của bạn là ứng dụng được luôn",
                    "features": []
                },
                {
                    "title": "1 tháng sử dụng phần mềm để xây dựng nền tảng E-learning",
                    "price": "999.000 vnđ",
                    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
                    "description": "Tự tay xây ra 1 trang website hay nền tảng E-learning của riêng mình để có thể đưa khóa học của bạn tới toàn bộ ngóc ngách trên Internet",
                    "features": []
                }
            ]
        },
        {
            "id": "process-1",
            "type": "process",
            "title": "Lộ trình triển khai",
            "subtitle": "Kế hoạch chi tiết từng bước cho người mới bắt đầu",
            "items": [
                { "title": "Tuần 1: Định vị & Tư duy", "description": "Xác định rõ điểm mạnh, điểm yếu và thị trường ngách tiềm năng. Tư duy đúng về sản phẩm số." },
                { "title": "Tuần 2: Nghiên cứu thị trường", "description": "Phân tích đối thủ, thấu hiểu khách hàng mục tiêu (Avatar khách hàng). Tìm ra USP." },
                { "title": "Tuần 3: Đóng gói sản phẩm", "description": "Cấu trúc chương trình học. Soạn thảo giáo trình, tài liệu bổ trợ (Worksheet, slide)." },
                { "title": "Tuần 4: Sản xuất nội dung", "description": "Quay dựng video bài giảng chất lượng cao. Thiết kế học liệu chuyên nghiệp." },
                { "title": "Tuần 5: Xây dựng hệ thống", "description": "Thiết lập Landing Page, Email Marketing, Chatbot. Tích hợp cổng thanh toán." },
                { "title": "Tuần 6: Chiến lược Traffic", "description": "Kế hoạch Content Marketing đa kênh. Chạy quảng cáo thử nghiệm (Test A/B)." },
                { "title": "Tuần 7: Ra mắt & Bán hàng", "description": "Tổ chức Webinar/Workshop bán hàng. Chăm sóc khách hàng tiềm năng." },
                { "title": "Tuần 8: Tối ưu & Mở rộng", "description": "Đo lường chỉ số, tối ưu tỷ lệ chuyển đổi. Tuyển dụng đội ngũ, tự động hóa." }
            ]
        },
        {
            "id": "sales-countdown-1",
            "type": "sales-countdown",
            "title": "Ưu Đãi Đặc Biệt Tháng Này",
            "highlight": "2025-12-31T23:59:59",
            "ctaText": "Đăng ký nhận ưu đãi 50%",
            "ctaLink": "#payment"
        },
        {
            "id": "curriculum-1",
            "type": "curriculum",
            "title": "Nội Dung Chi Tiết Khóa Học",
            "subtitle": "Hệ thống bài giảng được thiết kế khoa học, đi từ tư duy đến thực chiến, kèm theo bộ tài liệu và công cụ hỗ trợ.",
            "items": [
                {
                    "title": "Phần 1: Tư Duy & Nền Tảng F&B",
                    "description": "Hiểu đúng về kinh doanh F&B, định vị thương hiệu và lựa chọn mô hình phù hợp.",
                    "image": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
                    "lessons": [
                        "Bài 1: Tổng quan thị trường F&B & Cơ hội 2024",
                        "Bài 2: Tư duy đúng về sản phẩm & Dịch vụ",
                        "Bài 3: Lựa chọn mô hình kinh doanh chiến thắng",
                        "Tài liệu: File kế hoạch kinh doanh mẫu"
                    ]
                },
                {
                    "title": "Phần 2: Xây Dựng Menu & Giá Bán",
                    "description": "Kỹ thuật thiết kế menu tối ưu lợi nhuận (Menu Engineering) và chiến lược định giá.",
                    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
                    "lessons": [
                        "Bài 4: Nguyên lý thiết kế Menu & Tối ưu COGS",
                        "Bài 5: Chiến lược định giá & Phễu sản phẩm",
                        "Bài 6: Quy trình R&D món mới hiệu quả",
                        "Tài liệu: Template tính Cost món ăn tự động"
                    ]
                },
                {
                    "title": "Phần 3: Marketing & Vận Hành",
                    "description": "Quy trình vận hành chuẩn và các kênh marketing thu hút khách hàng hiệu quả.",
                    "image": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
                    "lessons": [
                        "Bài 7: Xây dựng quy trình vận hành (SOP)",
                        "Bài 8: Marketing 0 đồng & Xây kênh Social",
                        "Bài 9: Quản trị nhân sự & Đào tạo đội ngũ",
                        "Tài liệu: Bộ quy trình SOP mẫu cho quán Cafe/Nhà hàng"
                    ]
                },
                {
                    "title": "Phần 4: Tối Ưu & Mở Rộng Chuỗi",
                    "description": "Quản trị tài chính, tối ưu dòng tiền và đóng gói mô hình để nhân bản.",
                    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
                    "lessons": [
                        "Bài 10: Quản trị tài chính & Dòng tiền",
                        "Bài 11: Pháp lý & Gọi vốn kinh doanh",
                        "Bài 12: Lộ trình đóng gói & Nhượng quyền",
                        "Tài liệu: Biểu mẫu báo cáo tài chính quản trị"
                    ]
                }
            ]
        },
        {
            "id": "payment-1",
            "type": "payment",
            "title": "Chuyển khoản giữ chỗ",
            "content": "Nội dung: SDT + HOTEN + KHOAHOC",
            "highlight": "Hoàn tiền 100% trong 7 ngày nếu không hài lòng",
            "items": [
                {
                    "title": "Bộ Hướng Dẫn Chạy Quảng Cáo Facebook từ A-Z để x100 học viên trong 30 ngày",
                    "description": "Không cần đoán mò hay thử nghiệm quảng cáo vô ích - bộ video hướng dẫn lên quảng cáo trên nền tảng Facebook đã giúp mình tạo ra hơn 9000+ học viên/năm. Anh/chị chỉ cần làm theo.",
                    "price": "999.000",
                    "salePrice": "199.000",
                    "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&q=80",
                    "ctaText": "Mua thêm để bán khoá học dễ dàng hơn"
                }
            ]
        }
    ]
};

async function main() {
    console.log('Start seeding landing page...');

    const existing = await prisma.landingPage.findUnique({
        where: { slug: FULL_LANDING_PAGE.slug }
    });

    if (existing) {
        console.log(`Update existing page: ${FULL_LANDING_PAGE.slug}`);
        await prisma.landingPage.update({
            where: { slug: FULL_LANDING_PAGE.slug },
            data: {
                title: FULL_LANDING_PAGE.title,
                description: FULL_LANDING_PAGE.description,
                sections: FULL_LANDING_PAGE.sections,
                isActive: FULL_LANDING_PAGE.isActive
            }
        });
    } else {
        console.log(`Create new page: ${FULL_LANDING_PAGE.slug}`);
        await prisma.landingPage.create({
            data: FULL_LANDING_PAGE
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
