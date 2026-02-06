import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Section } from '@/types/sections';

const DEFAULT_SHOP_SECTIONS: Section[] = [
    {
        id: 'shop-heading',
        type: 'heading',
        name: 'Tiêu đề cửa hàng',
        title: 'Cửa hàng Phụ trợ',
        subtitle: 'Sở hữu các template, add-on và giải pháp dựng sẵn để tăng tốc quy trình làm việc của bạn ngay lập tức.',
        tag: 'CỬA HÀNG',
        showDotPattern: true,
        backgroundTheme: 'light',
        glowVariant: 2
    },
    {
        id: 'system-shop-main',
        type: 'system-shop',
        name: 'Cửa hàng sản phẩm',
        showDotPattern: false,
        backgroundTheme: 'light'
    }
];

export const dynamic = 'force-dynamic';

export default function ShopPage() {
    return (
        <LandingPageRenderer
            slug="shop"
            fallbackSections={DEFAULT_SHOP_SECTIONS}
        />
    );
}
