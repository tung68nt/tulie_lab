import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { DEFAULT_VIBE_CODING_SECTIONS } from '@/lib/defaultContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Vibe Coding - Giải pháp lập trình bằng ngôn ngữ tự nhiên | The Tulie Lab',
    description: 'Tìm hiểu về phương pháp Vibe Coding tại The Tulie Lab - giúp bạn tự tay xây dựng ứng dụng phần mềm mà không cần biết code chuyên sâu.',
};

export default function VibeCodingPage() {
    return <LandingPageRenderer slug="vibe-coding" fallbackSections={DEFAULT_VIBE_CODING_SECTIONS} />;
}
