
import { HeroSection } from '@/components/info/sections/HeroSection';
import { Section } from '@/types/sections';
import { CTASection } from '@/components/info/sections/CTASection';
import { BenefitsSection } from '@/components/info/sections/BenefitsSection';
import { ContentSection } from '@/components/info/sections/ContentSection';
import { ContentBlockSection } from '@/components/info/sections/ContentBlockSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Vibe Coding - Lập trình sáng tạo cùng AI | The Tulie Lab',
    description: 'Khám phá phong cách lập trình Vibe Coding - kết hợp trạng thái dòng chảy và trí tuệ nhân tạo để kiến tạo sản phẩm công nghệ đầy cảm hứng.',
    keywords: ['Vibe Coding', 'AI Coding', 'Lập trình sáng tạo', 'Học lập trình AI'],
};

// Hardcoded content for Vibe Coding
const VIBE_CODING_SECTIONS: Section[] = [
    {
        id: 'vibe-hero',
        type: 'hero',
        title: 'Vibe Coding',
        subtitle: 'Khơi nguồn cảm hứng - Sáng tạo không giới hạn',
        content: 'Trải nghiệm phong cách lập trình mới mẻ, nơi code không chỉ là những dòng lệnh khô khan mà là một tác phẩm nghệ thuật đầy cảm hứng.',
        image: '/images/heroes/vibe-coding.png',
        buttons: [
            { label: 'Khám phá ngay', href: '/courses', variant: 'primary' },
            { label: 'Xem demo', href: '#demo', variant: 'outline' }
        ],
        isVisible: true,
        order: 1
    },
    {
        id: 'vibe-intro',
        type: 'content',
        title: 'Vibe Coding là gì?',
        subtitle: 'Hơn cả việc viết mã',
        content: `Vibe Coding là phương pháp tiếp cận lập trình tập trung vào trạng thái dòng chảy (flow state) và trải nghiệm thẩm mỹ.
        
Chúng tôi tin rằng **môi trường làm việc đẹp**, **công cụ tối ưu** và **tư duy nghệ thuật** sẽ giúp lập trình viên không chỉ làm việc hiệu quả hơn mà còn tìm thấy niềm vui trong từng dòng code.`,
        image: '/images/vibe-coding-intro.jpg',
        imagePosition: 'right',
        isVisible: true,
        order: 2
    },
    {
        id: 'vibe-core',
        type: 'content-block',
        title: 'Triết lý Vibe Coding',
        subtitle: 'Nghệ thuật & Hiệu suất',
        isVisible: true,
        order: 3,
        items: [
            {
                title: 'Không gian (The Setup)',
                subtitle: 'Nơi cảm hứng bắt đầu',
                description: '"Không gian định hình tư duy. Setup đẹp, Code sạch." Một setup chuẩn Vibe Coding không chỉ đẹp mà còn tối ưu cho sức khỏe.',
                image: '/images/vibe-setup.jpg',
                features: [
                    'Ánh sáng Ambient bảo vệ mắt',
                    'Âm thanh Lo-fi/Synthwave tập trung',
                    'Gear công thái học cao cấp'
                ]
            },
            {
                title: 'Trạng thái Dòng chảy (Flow)',
                subtitle: 'Đỉnh cao tập trung',
                description: 'Khi bạn ở trong "The Zone", code tuôn trào như một bản nhạc. Học cách loại bỏ xao nhãng và tối đa hóa năng suất.',
                image: '/images/vibe-flow.jpg',
                features: [
                    'Loại bỏ xao nhãng Digital',
                    'Kỹ thuật Deep Work & Pomodoro',
                    'Mindfulness cho Developer'
                ]
            }
        ]
    },
    {
        id: 'vibe-benefits',
        type: 'benefits',
        title: 'Lợi ích của Vibe Coding',
        subtitle: 'Tại sao bạn nên theo đuổi?',
        items: [
            { title: 'Tăng sự tập trung', description: 'Đạt trạng thái Flow nhanh chóng nhờ môi trường và tư duy tối ưu.', icon: 'Zap' },
            { title: 'Cảm hứng sáng tạo', description: 'Biến việc code thành quá trình sáng tạo nghệ thuật.', icon: 'Palette' },
            { title: 'Hiệu suất cao', description: 'Tối ưu hóa quy trình làm việc với các công cụ và setup chuẩn.', icon: 'TrendingUp' }
        ],
        isVisible: true,
        order: 3
    },
    {
        id: 'vibe-cta',
        type: 'cta',
        title: 'Bắt đầu hành trình Vibe Coding',
        subtitle: 'Tham gia cộng đồng những lập trình viên nghệ sĩ ngay hôm nay',
        buttons: [
            { label: 'Đăng ký khoá học', href: '/courses', variant: 'primary' }
        ],
        isVisible: true,
        order: 4
    }
];

export default function VibeCodingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {VIBE_CODING_SECTIONS.map((section) => {
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
