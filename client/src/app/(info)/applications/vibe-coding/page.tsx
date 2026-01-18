
import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Vibe Coding - Lập trình sáng tạo cùng AI | The Tulie Lab',
    description: 'Khám phá phong cách lập trình Vibe Coding - kết hợp trạng thái dòng chảy và trí tuệ nhân tạo để kiến tạo sản phẩm công nghệ đầy cảm hứng.',
    keywords: ['Vibe Coding', 'AI Coding', 'Lập trình sáng tạo', 'Học lập trình AI'],
};

export default function VibeCodingPage() {
    return <LandingPageRenderer slug="vibe-coding" />;
}
