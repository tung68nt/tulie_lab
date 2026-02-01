
import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { DEFAULT_VIBE_CODING_BEGINNER_COURSE } from '@/lib/defaultContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lập trình bằng AI - Khoá Vibe Coding cho người mới | 2.790.000đ | Tulie TSS',
    description: 'Khoá học Vibe Coding toàn diện dành cho người mới. Từ 0 đến tự xây dựng ứng dụng kiếm tiền trong 8 tuần. Cam kết hỗ trợ 1:1 với giảng viên. Xu hướng bắt buộc năm 2026.',
};

export default function VibeCodingCoursePage() {
    return <LandingPageRenderer slug="vibe-coding-cho-nguoi-moi" fallbackSections={DEFAULT_VIBE_CODING_BEGINNER_COURSE} forceFallback={true} />;
}
