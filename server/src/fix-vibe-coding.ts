
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VIBE_CODING_PAGE = {
    title: "Vibe Coding Cho Người Mới Bắt Đầu",
    slug: "vibe-coding-cho-nguoi-moi",
    description: "Học cách để AI tự viết code, tự xây dựng công cụ làm việc cho bạn chỉ sau 10 ngày. Không cần kinh nghiệm lập trình.",
    isActive: true,
    sections: [
        {
            id: "vibe-hero",
            type: "hero",
            title: "BIẾN Ý TƯỞNG THÀNH ỨNG DỤNG THỰC TẾ TRONG 30 PHÚT",
            subtitle: "Làm chủ tư duy \"Vibe Coding\": Tự tay xây dựng 10 Mini Apps giải quyết công việc Marketing, Sales, Admin và Đời sống ngay lập tức.",
            content: "✅ Không cần học code phức tạp – Chỉ cần biết tiếng Việt và tư duy logic. \n ✅ Sở hữu vĩnh viễn Source Code của 10 ứng dụng thực chiến. \n ✅ Tiết kiệm hàng chục triệu đồng tiền thuê Dev và mua phần mềm mỗi năm.",
            image: "/images/heroes/vibe-coding.png",
            ctaText: "ĐĂNG KÝ HỌC NGAY - 1.790.000Đ",
            ctaLink: "/courses/vibe-coding-nguoi-moi",
            isVisible: true,
            order: 1
        },
        {
            id: "vibe-pain",
            type: "content-block",
            title: "Bạn có đang lãng phí thời gian và tiền bạc mỗi ngày?",
            subtitle: "Những rào cản khiến bạn dậm chân tại chỗ",
            items: [
                {
                    title: "Thao tác thủ công lặp lại",
                    description: "Ngày nào cũng phải copy-paste dữ liệu giữa 10 file Excel, sửa từng dòng báo cáo... Cảm giác như một \"cỗ máy chạy cơm\".",
                    image: "https://images.unsplash.com/photo-1454165833772-d996d49510d1?q=80&w=2070&auto=format&fit=crop"
                },
                {
                    title: "Bế tắc ý tưởng công nghệ",
                    description: "Bạn nảy ra ý tưởng app hữu ích nhưng nghĩ đến việc thuê IT tốn vài chục triệu lại thôi.",
                    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                },
                {
                    title: "Dùng AI chưa tới",
                    description: "Chỉ dừng lại ở việc chat hỏi đáp, chưa biết biến AI thành \"nhân viên lập trình\" tạo ra công cụ riêng.",
                    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop"
                }
            ],
            isVisible: true,
            order: 2
        },
        {
            id: "vibe-agitation",
            type: "benefits",
            title: "Bài toán kinh tế: Không học thì mất gì?",
            subtitle: "Cái giá của sự chần chừ đắt hơn bạn nghĩ",
            items: [
                { title: "Thuê Freelancer/Dev", description: "~5.000.000đ/năm (cho 2 app đơn giản)", icon: "DollarSign" },
                { title: "Mua phần mềm SaaS", description: "~3.600.000đ/năm (300k/tháng)", icon: "CreditCard" },
                { title: "Thời gian lãng phí", description: "~30.000.000đ/năm (1h/ngày)", icon: "Clock" }
            ],
            isVisible: true,
            order: 3
        },
        {
            id: "vibe-solution",
            type: "content",
            title: "Kỷ nguyên mới: Lập trình bằng Ngôn ngữ tự nhiên",
            subtitle: "Vibe Coding - Lối tắt cho người không chuyên",
            content: "**Vibe Coding** không bắt bạn học thuộc lòng cú pháp khô khan.\n\n* **Bạn là Kiến Trúc Sư:** Đưa ra ý tưởng, luồng đi (Flow), và yêu cầu.\n* **AI là Thợ Xây:** AI (Cursor, Claude, Replit) sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm cho bạn.\n\nTôi dạy bạn tư duy dùng AI để tạo ra công cụ phục vụ chính công việc của bạn.",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
            imagePosition: "right",
            isVisible: true,
            order: 4
        },
        {
            id: "vibe-value",
            type: "benefits",
            title: "Giá trị vượt trội bạn nhận được",
            subtitle: "Khoản đầu tư có lãi suất ngay lập tức",
            items: [
                { title: "Kỹ năng vô giá", description: "Xây dựng BẤT KỲ ứng dụng nào bạn muốn trong tương lai.", icon: "Zap" },
                { title: "Sở hữu 10 Apps", description: "Trọn bộ Source Code trị giá > 10.000.000đ.", icon: "Code" },
                { title: "Tiết kiệm thời gian", description: "Giải phóng hàng trăm giờ làm việc thủ công mỗi năm.", icon: "Timer" }
            ],
            isVisible: true,
            order: 6
        },
        {
            id: "vibe-bonuses",
            type: "bonus",
            title: "Quà tặng độc quyền (Trị giá 5.000.000đ)",
            subtitle: "Dành cho học viên đăng ký hôm nay",
            items: [
                { title: "Ebook 'Vibe Coding Playbook'", description: "Cẩm nang tra cứu nhanh thuật ngữ & UI mẫu.", value: "Trị giá 500k" },
                { title: "Thư viện 'Thần Chú' Prompt", description: "Copy & Paste để code chạy ngay, ít lỗi.", value: "Trị giá 2M" },
                { title: "Full Source Code 10 Mini Apps", description: "Toàn quyền chỉnh sửa, đổi tên và kinh doanh.", value: "Trị giá 10M" },
                { title: "Private Group Support", description: "Hỗ trợ trọn đời, cập nhật công nghệ mới.", value: "Vô giá" }
            ],
            isVisible: true,
            order: 7
        },
        {
            id: "vibe-faq",
            type: "faq",
            title: "Câu hỏi thường gặp",
            subtitle: "Giải đáp thắc mắc của bạn",
            items: [
                { question: "Tôi mù công nghệ có học được không?", answer: "Được. Các công cụ đều hiểu tiếng Việt, chỉ cần bạn có tư duy logic." },
                { question: "Máy tính cấu hình yếu học được không?", answer: "Được. Chúng ta sử dụng nền tảng Cloud (Web), máy văn phòng chạy tốt." },
                { question: "Hình thức học như thế nào?", answer: "Video quay sẵn 4K, xem lại trọn đời bất cứ lúc nào." },
                { question: "Nếu gặp lỗi thì sao?", answer: "Bạn có cộng đồng và đội ngũ hỗ trợ trong nhóm kín." }
            ],
            isVisible: true,
            order: 9
        },
        {
            id: "vibe-cta-sales",
            type: "cta",
            title: "Bắt đầu hành trình Vibe Coding của bạn ngay hôm nay",
            subtitle: "Làm chủ AI, giải phóng sức lao động và tự tay xây dựng những ứng dụng tuyệt vời.",
            ctaText: "Khám phá Khoá học",
            ctaLink: "/courses/vibe-coding-nguoi-moi"
        }
    ]
};

async function main() {
    console.log('Force updating Vibe Coding page...');
    await prisma.landingPage.deleteMany({ where: { slug: VIBE_CODING_PAGE.slug } });
    await prisma.landingPage.create({
        data: {
            title: VIBE_CODING_PAGE.title,
            slug: VIBE_CODING_PAGE.slug,
            description: VIBE_CODING_PAGE.description,
            sections: JSON.stringify(VIBE_CODING_PAGE.sections),
            isActive: true,
            type: 'LANDING'
        }
    });
    console.log('Created new Vibe Coding page successfully.');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
