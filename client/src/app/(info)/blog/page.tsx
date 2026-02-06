import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Section } from '@/types/sections';

const DEFAULT_BLOG_SECTIONS: Section[] = [
    {
        id: 'blog-heading',
        type: 'heading',
        name: 'Tiêu đề Blog',
        title: 'Góc chia sẻ',
        subtitle: 'Cập nhật kiến thức mới nhất về công nghệ, quản trị và các mẹo tối ưu quy trình làm việc hiệu quả.',
        tag: 'BLOG',
        showDotPattern: true,
        backgroundTheme: 'light',
        glowVariant: 4
    },
    {
        id: 'system-blog-main',
        type: 'system-blog',
        name: 'Danh sách bài viết',
        showDotPattern: false,
        backgroundTheme: 'light'
    }
];

export const dynamic = 'force-dynamic';

export default function BlogPage() {
    return <LandingPageRenderer slug="blog" />;
}
