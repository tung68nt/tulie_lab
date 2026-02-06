
import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ứng dụng AI Thực Chiến - Tự động hóa & Sáng tạo | The Tulie Lab',
    description: 'Làm chủ các công cụ AI hàng đầu như ChatGPT, Midjourney, Claude để tăng tốc hiệu suất công việc và khai phá tiềm năng sáng tạo.',
    keywords: ['Khoá học AI', 'Ứng dụng AI', 'ChatGPT', 'Midjourney', 'Tự động hóa'],
};

export const dynamic = 'force-dynamic';

export default function AIAppsPage() {
    return <LandingPageRenderer slug="ai" />;
}
