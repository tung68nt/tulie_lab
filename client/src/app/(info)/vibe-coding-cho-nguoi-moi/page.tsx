
import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { DEFAULT_VIBE_CODING_COURSE_SECTIONS } from '@/lib/defaultContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Vibe Coding cho người mới - Tự xây dựng 10 Mini Apps | The Tulie Lab',
    description: 'Khoá học thực chiến giúp bạn làm chủ tư duy Vibe Coding, tự tay xây dựng 10 ứng dụng thực tế giải quyết công việc chỉ trong 30 phút.',
};

export default function VibeCodingCoursePage() {
    return <LandingPageRenderer slug="vibe-coding-cho-nguoi-moi" fallbackSections={DEFAULT_VIBE_CODING_COURSE_SECTIONS} forceFallback={true} />;
}
