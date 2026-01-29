import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Section } from '@/types/sections';

const DEFAULT_INSTRUCTORS_SECTIONS: Section[] = [
    {
        id: 'instructors-main',
        type: 'system-instructors',
        name: 'Đội ngũ giảng viên',
        title: 'Đội ngũ Giảng viên',
        subtitle: 'Những chuyên gia dày dạn kinh nghiệm thực chiến trong lĩnh vực Automation và Quản trị doanh nghiệp.',
        tag: 'GIẢNG VIÊN',
        showDotPattern: true,
        backgroundTheme: 'light',
        glowVariant: 5
    }
];

export default function InstructorsPage() {
    return (
        <LandingPageRenderer
            slug="instructors"
            fallbackSections={DEFAULT_INSTRUCTORS_SECTIONS}
        />
    );
}
