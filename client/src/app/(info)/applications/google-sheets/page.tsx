

import { HeroSection } from '@/components/info/sections/HeroSection';
import { Section } from '@/types/sections';
import { CTASection } from '@/components/info/sections/CTASection';
import { BenefitsSection } from '@/components/info/sections/BenefitsSection';
import { ContentSection } from '@/components/info/sections/ContentSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Google Sheets & Apps Script Automation | The Tulie Lab',
    description: 'Xây dựng hệ thống quản trị dữ liệu, CRM, ERP tinh gọn và tự động hóa quy trình với Google Sheets và Apps Script.',
    keywords: ['Google Sheets', 'Apps Script', 'Tự động hóa doanh nghiệp', 'CRM Google Sheets'],
};

// Hardcoded content for Google Sheets
const SHEETS_SECTIONS: Section[] = [
    {
        id: 'sheets-hero',
        type: 'hero',
        title: 'Google Sheets & Apps Script',
        subtitle: 'Tự động hóa & Quản trị dữ liệu',
        content: 'Biến bảng tính đơn giản thành hệ thống quản trị mạnh mẽ. Học cách viết script, tạo báo cáo tự động và kết nối dữ liệu chuyên nghiệp.',
        image: '/images/heroes/google-sheets.png',
        buttons: [
            { label: 'Khám phá Template', href: '/shop', variant: 'primary' },
            { label: 'Học Apps Script', href: '/courses', variant: 'outline' }
        ],
        isVisible: true,
        order: 1
    },
    {
        id: 'sheets-intro',
        type: 'content',
        title: 'Sức mạnh của Google Apps Script',
        subtitle: 'Mở rộng khả năng của Google Workspace',
        content: `Apps Script cho phép bạn viết mã để tự động hóa các tác vụ trên Google Sheets, Docs, Forms và hơn thế nữa.
        
Tạo các hàm tùy chỉnh, menu, và web app ngay trên nền tảng Google mà không cần setup server phức tạp.`,
        image: '/images/sheets-intro.jpg',
        imagePosition: 'right',
        isVisible: true,
        order: 2
    },
    {
        id: 'sheets-usecases',
        type: 'content-block',
        title: 'Ứng dụng Thực tế',
        subtitle: 'Tự động hóa Doanh nghiệp',
        isVisible: true,
        order: 3,
        items: [
            {
                title: 'Hệ thống CRM Tùy biến',
                subtitle: 'Quản lý khách hàng',
                description: 'Xây dựng CRM ngay trên Sheets. Quản lý thông tin, lịch sử mua hàng mà không cần tốn chi phí phần mềm đắt đỏ.',
                image: '/images/sheets-crm.jpg',
                features: [
                    'Quản lý Data khách hàng',
                    'Tự động gửi Email Marketing',
                    'Nhắc hẹn & Follow-up tự động'
                ]
            },
            {
                title: 'Báo cáo Tự động (Dashboard)',
                subtitle: 'Realtime Data',
                description: 'Biến những con số khô khan thành biểu đồ trực quan. Theo dõi KPI và tiến độ dự án mọi lúc mọi nơi.',
                image: '/images/sheets-dashboard.jpg',
                features: [
                    'Cập nhật dữ liệu từ nhiều nguồn',
                    'Báo cáo doanh thu qua Telegram/Slack',
                    'Trực quan hóa dữ liệu Realtime'
                ]
            }
        ]
    },
    {
        id: 'sheets-benefits',
        type: 'benefits',
        title: 'Tại sao chọn Google Sheets?',
        subtitle: 'Công cụ linh hoạt nhất thế giới',
        items: [
            { title: 'Miễn phí & Đám mây', description: 'Truy cập mọi lúc mọi nơi, không cần cài đặt.', icon: 'Cloud' },
            { title: 'Tùy biến cao', description: 'Xây dựng CRM, ERP mini theo đúng nhu cầu của bạn.', icon: 'Settings' },
            { title: 'Cộng đồng lớn', description: 'Hàng ngàn template và script có sẵn để sử dụng.', icon: 'Users' }
        ],
        isVisible: true,
        order: 3
    },
    {
        id: 'sheets-cta',
        type: 'cta',
        title: 'Tối ưu hóa doanh nghiệp của bạn',
        subtitle: 'Sỡ hữu bộ công cụ quản trị tinh gọn ngay hôm nay',
        buttons: [
            { label: 'Ghé thăm cửa hàng', href: '/shop', variant: 'primary' }
        ],
        isVisible: true,
        order: 4
    }
];

import { ContentBlockSection } from '@/components/info/sections/ContentBlockSection';

export default function GoogleSheetsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {SHEETS_SECTIONS.map((section) => {
                    if (section.type === 'hero') return <HeroSection key={section.id} section={section} />;
                    if (section.type === 'content') return <ContentSection key={section.id} section={section} />;
                    if (section.type === 'content-block') return <ContentBlockSection key={section.id} section={section} />;
                    if (section.type === 'benefits') return <BenefitsSection key={section.id} section={section} />;
                    if (section.type === 'cta') return <CTASection key={section.id} section={section} />;
                    return null;
                })}
            </main>
        </div>
    );
}
