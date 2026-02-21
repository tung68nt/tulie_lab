import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { DEFAULT_INSTRUCTORS_PAGE_SECTIONS } from '@/lib/defaultContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Giảng viên - Nguyễn Thanh Tùng | The Tulie Lab',
    description: 'Gặp gỡ Nguyễn Thanh Tùng - Founder The Tulie Lab, 10+ năm kinh nghiệm, tiên phong Vibe Coding tại Việt Nam. Cam kết hỗ trợ 1:1 cho mỗi học viên.',
};

export const dynamic = 'force-dynamic';

export default function InstructorsPage() {
    return (
        <LandingPageRenderer
            slug="instructors"
            fallbackSections={DEFAULT_INSTRUCTORS_PAGE_SECTIONS}
        />
    );
}
