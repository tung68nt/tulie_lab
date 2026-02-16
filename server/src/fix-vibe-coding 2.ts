
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VIBE_CODING_PAGE = {
    title: "Vibe Coding Cho Người Mới Bắt Đầu - Khóa Học Lập Trình Cùng AI",
    slug: "vibe-coding-nguoi-moi",
    description: "Học cách để AI tự viết code, tự xây dựng công cụ làm việc cho bạn chỉ sau 10 ngày. Không cần kinh nghiệm lập trình.",
    isActive: true,
    sections: [
        {
            id: "vibe-hero",
            type: "hero",
            title: "BIẾN Ý TƯỞNG THÀNH ỨNG DỤNG THỰC TẾ TRONG 30 PHÚT",
            subtitle: "Làm chủ tư duy \"Vibe Coding\": Tự tay xây dựng 10 Mini Apps giải quyết công việc Marketing, Sales, Admin và Đời sống ngay lập tức.",
            content: "✅ Không cần học code phức tạp – Chỉ cần biết tiếng Việt và tư duy logic.\n✅ Sở hữu vĩnh viễn Source Code của 10 ứng dụng thực chiến.\n✅ Tiết kiệm hàng chục triệu đồng tiền thuê Dev và mua phần mềm mỗi năm.",
            image: "/images/heroes/vibe-coding.png",
            ctaText: "ĐĂNG KÝ HỌC NGAY - 1.790.000Đ",
            ctaLink: "#payment"
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
                    image: "/images/pain-manual.jpg"
                },
                {
                    title: "Bế tắc ý tưởng công nghệ",
                    description: "Bạn nảy ra ý tưởng app hữu ích nhưng nghĩ đến việc thuê IT tốn vài chục triệu lại thôi.",
                    image: "/images/pain-idea.jpg"
                },
                {
                    title: "Dùng AI chưa tới",
                    description: "Chỉ dừng lại ở việc chat hỏi đáp, chưa biết biến AI thành \"nhân viên lập trình\" tạo ra công cụ riêng.",
                    image: "/images/pain-ai.jpg"
                }
            ]
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
            ]
        },
        {
            id: "vibe-solution",
            type: "content",
            title: "Kỷ nguyên mới: Lập trình bằng Ngôn ngữ tự nhiên",
            subtitle: "Vibe Coding - Lối tắt cho người không chuyên",
            content: "**Vibe Coding** không bắt bạn học thuộc lòng cú pháp khô khan.\n\n* **Bạn là Kiến Trúc Sư:** Đưa ra ý tưởng, luồng đi (Flow), và yêu cầu.\n* **AI là Thợ Xây:** AI (Cursor, Claude, Replit) sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm cho bạn.\n\nTôi dạy bạn tư duy dùng AI để tạo ra công cụ phục vụ chính công việc của bạn.",
            image: "/images/vibe-solution.jpg",
            imagePosition: "right"
        },
        {
            id: "vibe-curriculum",
            type: "curriculum",
            title: "Lộ Trình Thực Chiến 10 Ngày",
            subtitle: "Cầm tay chỉ việc - Từ con số 0 đến 10 Apps",
            items: [
                {
                    title: "Module 1: Khởi động & Tư duy",
                    description: "Thiết lập móng nhà vững chắc.",
                    lessons: [
                        "Bài 1: Thiết lập môi trường Vibe Coding (Cursor, Bolt.new, Replit)",
                        "Bài 2: Product Mindset - Phân rã vấn đề cho AI hiểu",
                        "Bài 3: Prompt Engineering - Công thức \"thần chú\" 3 bước"
                    ]
                },
                {
                    title: "Module 2: Xây dựng 10 Super Apps (Thực hành 100%)",
                    description: "Code từng dòng cho 10 ứng dụng thực tế.",
                    lessons: [
                        "Mkt: Caption Generator, QR Branding, Image Watermark",
                        "Văn phòng: Excel Merger, PDF Invoice, Salary Calculator",
                        "Cá nhân: Eisenhower ToDo, AI Flashcard, Voice to Note",
                        "Tổng hợp: Personal Dashboard"
                    ]
                },
                {
                    title: "Module 3: Triển khai & Kiếm tiền",
                    description: "Đưa ứng dụng lên Internet và kinh doanh.",
                    lessons: [
                        "Bài 11: Deploy - Đưa ứng dụng lên Internet (Free server)",
                        "Bài 12: Business Model - Cách đóng gói bán lại hoặc Freelance"
                    ]
                }
            ]
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
