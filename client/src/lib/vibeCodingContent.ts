import { Section } from '@/types/sections';
import { COURSE_PRICING } from '@/constants/pricing';

export const VIBE_CODING_SECTIONS: Section[] = [
    {
        id: 'hero',
        type: 'hero',
        title: 'BẠN ĐANG LÀM CHỦ CÔNG NGHỆ HAY ĐANG LÀ "NÔ LỆ" CỦA NHỮNG QUY TRÌNH THỦ CÔNG?',
        subtitle: 'Dừng lãng phí 2 giờ mỗi ngày cho những việc lặp lại vô nghĩa. Học cách để AI tự viết code, tự xây dựng công cụ cho bạn chỉ sau 10 ngày.',
        ctaText: `ĐĂNG KÝ HỌC NGAY - CHỈ ${COURSE_PRICING.VIBE_CODING.priceDisplay}`,
        ctaLink: '/checkout?courseId=vibe-coding-mastery',
        image: '/hero_vibe_coding.png',
        highlight: 'Ưu đãi Early Bird dành riêng cho 50 học viên đăng ký sớm nhất hôm nay',
        items: [
            { icon: 'Check', title: 'Không cần học code phức tạp', description: 'Chỉ cần biết tiếng Việt và tư duy logic. AI làm phần khó nhất.' },
            { icon: 'Code', title: 'Sở hữu vĩnh viễn Source Code', description: 'Của 10 ứng dụng thực chiến giải quyết việc Marketing, Sales, Admin.' },
            { icon: 'TrendingDown', title: 'Tiết kiệm hàng chục triệu', description: 'Tiền thuê Dev và mua phần mềm mỗi năm. Đầu tư 1 lần dùng mãi mãi.' }
        ]
    },
    {
        id: 'agitation',
        type: 'stats',
        title: 'Cái giá của sự chần chừ đắt hơn bạn nghĩ!',
        subtitle: 'BẠN CHẤP NHẬN MẤT GẦN 40 TRIỆU/NĂM HAY ĐẦU TƯ 1.790K MỘT LẦN DUY NHẤT?',
        content: 'Nếu tiếp tục làm việc theo cách cũ, đây là "hoá đơn" lãng phí bạn phải trả mỗi năm:',
        items: [
            { title: 'Thuê Freelancer/Dev', description: '~ 5.000.000đ cho chỉ 2 tool đơn giản nhất.', icon: 'X' },
            { title: 'Mua phần mềm SaaS', description: '~ 3.600.000đ cho các phí thuê bao hàng tháng.', icon: 'X' },
            { title: 'Thời gian lãng phí', description: '~ 30.000.000đ (Dựa trên 1h/ngày x 300 ngày x 100k/h).', icon: 'X' }
        ]
    },
    {
        id: 'pain-points',
        type: 'features',
        title: 'Bạn đang làm chủ công nghệ hay đang là "nô lệ" của quy trình thủ công?',
        subtitle: 'Hãy thành thật, có phải bạn đang hì hục hì hục copy-paste file Excel đến 8h tối trong khi đối thủ đã tan làm từ 5h?',
        items: [
            {
                icon: 'Clock',
                title: 'Nỗi đau 1: Cỗ máy chạy cơm',
                description: 'Ngày nào cũng copy-paste dữ liệu, sửa từng dòng báo cáo. Bạn lãng phí 2 giờ mỗi ngày cho những việc vô nghĩa.'
            },
            {
                icon: 'ZapOff',
                title: 'Nỗi đau 2: Phụ thuộc IT',
                description: 'Mỗi lần cần sửa tính năng nhỏ lại phải "năn nỉ" đội IT hoặc chờ Freelancer cả tuần trời. Bạn mất quyền kiểm soát công việc.'
            },
            {
                icon: 'Bot',
                title: 'Nỗi đau 3: Bị AI đào thải',
                description: 'Biết ChatGPT giỏi nhưng chưa biết biến nó thành "nhân viên lập trình". Người biết dùng AI tạo công cụ sẽ thay thế bạn.'
            }
        ]
    },
    {
        id: 'solution',
        type: 'comparison',
        title: 'Vibe Coding - Lối tắt cho người không chuyên',
        subtitle: 'Không cần học cú pháp khô khan. Năm 2026, lập trình là ra lệnh bằng tiếng Việt và copy-paste.',
        image: '/vibe_coding_solution.png',
        items: [
            {
                title: 'Kiến Trúc Sư - LÀ BẠN',
                description: 'Bạn chỉ cần hiểu vấn đề của mình và đưa ra ý tưởng, luồng đi (Flow).',
                features: ['Chỉ cần biết tiếng Việt', 'Tư duy Product Mindset', 'Không cần máy tính khủng']
            },
            {
                title: 'Thợ Xây AI - LÀ NHÂN VIÊN',
                description: 'AI sẽ viết từng dòng code, sửa lỗi và hoàn thiện sản phẩm theo "Vibe" của bạn.',
                features: ['Viết code chuẩn 100%', 'Tự động triển khai lên Web', 'Sửa lỗi trong 30 giây']
            }
        ]
    },
    {
        id: 'curriculum',
        type: 'curriculum',
        title: 'Lộ Trình Thực Chiến 10 Ngày - "Cầm tay chỉ việc"',
        subtitle: 'Xây dựng 10 ứng dụng giải quyết nỗi đau sát sườn, từ Marketing đến Quản trị.',
        items: [
            {
                title: "MODULE 1: KHỞI ĐỘNG & TƯ DUY",
                description: "Biến bạn từ người dùng công cụ thành Người tạo ra công cụ (Tool Maker).",
                lessons: [
                    "Thiết lập môi trường Vibe Coding miễn phí (Cursor, Bolt, Replit)",
                    "Product Mindset: Cách phân rã vấn đề cho AI hiểu",
                    "Prompt Engineering: Công thức thần chú 3 bước có code ngay"
                ]
            },
            {
                title: "MODULE 2: 10 APPS GIẢI QUYẾT VIỆC THẬT",
                description: "Sở hữu trọn bộ 10 ứng dụng thực chiến (Tiết kiệm >10 triệu thuê dev).",
                lessons: [
                    "Marketing: AI Caption Generator (Viết content tự động) & QR Branding",
                    "Marketing: Image Watermark (Đóng dấu hàng loạt sản phẩm trong 3s)",
                    "Văn phòng: Excel Merger (Gộp 10 file báo cáo thành 1 click) & Invoice Maker",
                    "Quản trị: Salary Calculator (Tính lương, bảo hiểm tự động) & Eisenhower Todo",
                    "Tiện ích: Personality Dashboard & AI Flashcard & Voice to Note (Tiếng Việt cực chuẩn)"
                ]
            },
            {
                title: "MODULE 3: TRIỂN KHAI & MONETIZATION",
                description: "Đưa ứng dụng lên Internet và đóng gói để bán lại hoặc nhận job Freelancer.",
                lessons: [
                    "Deploy: Đưa ứng dụng lên Cloud miễn phí trọn đời",
                    "Business Model: Cách đóng gói, đặt giá và bán app kiếm tiền ngay"
                ]
            }
        ]
    },
    {
        id: 'the-stack',
        type: 'bonus',
        title: '💎 GÓI CHUYỂN GIAO CÔNG NGHỆ TRỊ GIÁ >17.500.000Đ',
        subtitle: 'Đây không chỉ là học phí, đây là khoản đầu tư có "lãi suất" ngay lập tức khi bạn bán được ứng dụng đầu tiên.',
        image: '/bonus_gift_3d.png',
        items: [
            {
                title: 'Khoá học Master Vibe Coding',
                description: 'Quy trình từ ý tưởng đến sản phẩm thật hoàn chỉnh.',
                price: 5000000
            },
            {
                title: 'Full Source Code 10 Mini Apps',
                description: 'Mang về dùng ngay, hoặc bán lại với giá 1-2tr/app dễ dàng.',
                price: 10000000
            },
            {
                title: 'Bộ Prompt "Thần Chú" Triệu Đô',
                description: 'Chỉ cần điền vào chỗ trống, AI tự "nhả" code chuẩn xác.',
                price: 2000000
            },
            {
                title: 'Private Mentoring Group',
                description: 'Cộng đồng hỗ trợ trọn đời, cập nhật công nghệ AI hàng tuần.',
                price: 500000
            }
        ]
    },
    {
        id: 'instructor',
        type: 'instructor-bio',
        title: 'Tôi không phải dân IT chuyên nghiệp. Tôi là Marketer giống bạn.',
        subtitle: 'Giảng viên: Liên - Người đã tự xây dựng hàng chục công cụ bằng Vibe Coding.',
        content: 'Tôi hiểu cảm giác bất lực khi phải phụ thuộc vào IT. Tôi ở đây để chia sẻ con đường ngắn nhất để bạn tự làm chủ công nghệ, giải phóng sức lao động và tối ưu hoá lợi nhuận kinh doanh.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    },
    {
        id: 'faq',
        type: 'faq',
        title: 'NHỮNG NGHI NGẠI PHÚT CHÓT?',
        items: [
            { title: 'Học xong không làm được thì sao?', description: 'CAM KẾT: Nếu sau 3 ngày không tạo được App đầu tiên, HOÀN TIỀN 100%. Không rủi ro.' },
            { title: 'Tôi có thể dùng ChatGPT miễn phí mà?', description: 'ChatGPT chỉ đưa code rời rạc. Khoá này dạy bạn công thức "nấu" chúng thành món ăn thật.' },
            { title: 'Tôi bận quá không có thời gian học?', description: 'Vì bạn bận việc tay chân nên mới cần học. Đầu tư 10h học để tiết kiệm 1000h làm việc.' }
        ]
    },
    {
        id: 'cta-final',
        type: 'cta',
        variant: 'dark',
        title: 'Đừng chịu rủi ro bỏ lỡ kỹ năng của tương lai. Đăng ký ngay!',
        subtitle: `Chỉ còn một ít suất ưu đãi Early Bird trị giá ${COURSE_PRICING.VIBE_CODING.priceDisplay}. Giá sẽ tăng về 3.500.000đ rất sớm.`,
        ctaText: `TÔI MUỐN SỞ HỮU GÓI CHUYỂN GIAO NÀY`,
        ctaLink: '/checkout?courseId=vibe-coding-mastery'
    }
];
