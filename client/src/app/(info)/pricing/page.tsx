
import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bảng giá & Gói thành viên | The Tulie Lab',
    description: 'Chọn gói thành viên phù hợp để tiếp cận kho tài nguyên và kiến thức chất lượng cao từ Tulie Academy.',
};

import { DEFAULT_PRICING_SECTIONS } from '@/lib/defaultContent';

export const dynamic = 'force-dynamic';

export default function PricingPage() {
    return <LandingPageRenderer slug="pricing" />;
}
