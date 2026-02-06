import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Section } from '@/types/sections';

export const dynamic = 'force-dynamic';

const DEFAULT_COMBOS_SECTIONS: Section[] = [
    {
        id: 'combos-heading',
        type: 'heading',
        name: 'Tiêu đề Combo',
        title: 'Lộ trình Tiết kiệm',
        subtitle: 'Tiết kiệm lên đến 50% khi đăng ký theo lộ trình học tập trọn gói. Được thiết kế để đưa bạn từ con số 0 đến chuyên gia.',
        tag: 'COMBOS',
        showDotPattern: true,
        backgroundTheme: 'light',
        glowVariant: 1
    },
    {
        id: 'system-combos-main',
        type: 'system-combos',
        name: 'Danh sách Combo',
        showDotPattern: false,
        backgroundTheme: 'light'
    }
];

export default function CombosPage() {
    return (
        <LandingPageRenderer
            slug="combos"
            fallbackSections={DEFAULT_COMBOS_SECTIONS}
        />
    );
}
