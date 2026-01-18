

import { HeroSection } from '@/components/info/sections/HeroSection';
import { Section } from '@/types/sections';
import { CTASection } from '@/components/info/sections/CTASection';
import { BenefitsSection } from '@/components/info/sections/BenefitsSection';
import { ContentSection } from '@/components/info/sections/ContentSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ứng dụng AI Thực Chiến - Tự động hóa & Sáng tạo | The Tulie Lab',
    description: 'Làm chủ các công cụ AI hàng đầu như ChatGPT, Midjourney, Claude để tăng tốc hiệu suất công việc và khai phá tiềm năng sáng tạo.',
    keywords: ['Khoá học AI', 'Ứng dụng AI', 'ChatGPT', 'Midjourney', 'Tự động hóa'],
};

// Hardcoded content for AI Apps
const AI_APPS_SECTIONS: Section[] = [
    {
        id: 'ai-hero',
        type: 'hero',
        title: 'Ứng dụng AI Thực Chiến',
        subtitle: 'Tăng tốc độ làm việc gấp 10 lần',
        content: 'Tận dụng sức mạnh của trí tuệ nhân tạo để tự động hóa công việc, sáng tạo nội dung và giải quyết vấn đề phức tạp chỉ trong tích tắc.',
        image: '/images/heroes/ai-apps.png',
        buttons: [
            { label: 'Tìm hiểu khóa học', href: '/courses', variant: 'primary' },
            { label: 'Công cụ AI', href: '#tools', variant: 'outline' }
        ],
        isVisible: true,
        order: 1
    },
    {
        id: 'ai-intro',
        type: 'content',
        title: 'AI cho mọi người',
        subtitle: 'Không cần biết lập trình',
        content: `Chúng tôi hướng dẫn bạn cách sử dụng các công cụ AI hàng đầu hiện nay như **ChatGPT**, **Midjourney**, **Claude**, v.v. để ứng dụng vào công việc văn phòng, marketing, thiết kế và đời sống.
        
Bạn sẽ học được cách:
- Viết prompt (câu lệnh) hiệu quả.
- Tối ưu hóa quy trình làm việc hàng ngày.
- Giải quyết các vấn đề phức tạp nhanh chóng.`,
        image: '/images/ai-intro.jpg',
        imagePosition: 'left',
        isVisible: true,
        order: 2
    },
    {
        id: 'ai-showcase',
        type: 'content-block',
        title: 'Sức mạnh của AI',
        subtitle: 'Ứng dụng thực tế vào công việc của bạn',
        isVisible: true,
        order: 3,
        items: [
            {
                title: 'Nghiên cứu & Phân tích',
                subtitle: 'Research sâu',
                description: 'Sử dụng sức mạnh của Perplexity, Consensus và Claude để tổng hợp thông tin từ hàng ngàn nguồn tài liệu trong vài giây. "AI giúp bạn tiết kiệm 90% thời gian nghiên cứu."',
                image: '/images/ai-research.jpg',
                features: [
                    'Tổng hợp thông tin siêu tốc',
                    'Phân tích xu hướng thị trường',
                    'Tự động hóa đọc hiểu báo cáo'
                ]
            },
            {
                title: 'Sáng tạo Hình ảnh',
                subtitle: 'Nghệ thuật số',
                description: 'Làm chủ Midjourney v6 và Stable Diffusion để tạo ra những hình ảnh tuyệt đẹp cho marketing, thiết kế và nội dung số.',
                image: '/images/ai-art.jpg',
                features: [
                    'Thiết kế Logo & Brand Identity',
                    'Tạo Concept Art & Character',
                    'Mở rộng hình ảnh với Firefly'
                ]
            },
            {
                title: 'Sản xuất Video Tự động',
                subtitle: 'Kỷ nguyên Video AI',
                description: 'Biến ý tưởng thành video động với Runway Gen-2, Pika Labs và Sora. Không cần ekip quay phim đắt tiền, chỉ cần trí tưởng tượng.',
                image: '/images/ai-video.jpg',
                features: [
                    'Tạo video quảng cáo từ Text',
                    'Làm phim hoạt hình ngắn',
                    'Lồng tiếng AI đa ngôn ngữ'
                ]
            }
        ]
    },
    {
        id: 'ai-benefits',
        type: 'benefits',
        title: 'Sức mạnh của AI',
        subtitle: 'Giải pháp cho kỷ nguyên số',
        items: [
            { title: 'Tự động hóa', description: 'Giảm thiểu các tác vụ lặp lại nhàm chán.', icon: 'Cpu' },
            { title: 'Sáng tạo nội dung', description: 'Viết bài, tạo ảnh, dựng video nhanh chóng.', icon: 'Image' },
            { title: 'Phân tích dữ liệu', description: 'Xử lý và đưa ra insight từ dữ liệu khổng lồ.', icon: 'BarChart' }
        ],
        isVisible: true,
        order: 3
    },
    {
        id: 'ai-cta',
        type: 'cta',
        title: 'Làm chủ công nghệ AI',
        subtitle: 'Đừng để bị bỏ lại phía sau trong cuộc cách mạng này',
        buttons: [
            { label: 'Xem khoá học AI', href: '/courses', variant: 'primary' }
        ],
        isVisible: true,
        order: 4
    }
];

import { ContentBlockSection } from '@/components/info/sections/ContentBlockSection';

export default function AIAppsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {AI_APPS_SECTIONS.map((section) => {
                    if (section.type === 'hero') return <HeroSection key={section.id} section={section} />;
                    if (section.type === 'content') return <ContentSection key={section.id} section={section} />;
                    if (section.type === 'content-block') return <ContentBlockSection key={section.id} section={section} />;
                    if (section.type === 'benefits') return <BenefitsSection key={section.id} section={section} />;
                    if (section.type === 'cta') return <CTASection key={section.id} section={section} />;
                    return null;
                })}
            </main>
        </div>
    );
}
