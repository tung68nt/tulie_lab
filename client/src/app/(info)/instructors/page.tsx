import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { DEFAULT_INSTRUCTORS_PAGE_SECTIONS } from '@/lib/defaultContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Giảng viên - Nguyễn Thanh Tùng | Tulie TSS',
    description: 'Gặp gỡ Nguyễn Thanh Tùng - Founder Tulie TSS, 10+ năm kinh nghiệm, tiên phong Vibe Coding tại Việt Nam. Cam kết hỗ trợ 1:1 cho mỗi học viên.',
};

export default function InstructorsPage() {
    return (
        <LandingPageRenderer
            slug="instructors"
            fallbackSections={DEFAULT_INSTRUCTORS_PAGE_SECTIONS}
        />
    );
}
