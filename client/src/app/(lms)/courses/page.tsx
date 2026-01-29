import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Section } from '@/types/sections';

const DEFAULT_COURSES_SECTIONS: Section[] = [
    {
        id: 'courses-heading',
        type: 'heading',
        name: 'Tiêu đề trang khóa học',
        title: 'Thư viện Khóa học',
        subtitle: 'Khám phá các khóa học chuyên sâu từ cơ bản đến nâng cao về Automation, Google Apps Script và tối ưu hóa quy trình doanh nghiệp.',
        tag: 'HỌC TẬP',
        showDotPattern: true,
        backgroundTheme: 'light',
        glowVariant: 0
    },
    {
        id: 'system-courses-main',
        type: 'system-courses',
        name: 'Danh sách khóa học',
        showDotPattern: false,
        backgroundTheme: 'light'
    }
];

export default function CoursesPage() {
    return (
        <LandingPageRenderer
            slug="courses"
            fallbackSections={DEFAULT_COURSES_SECTIONS}
        />
    );
}
