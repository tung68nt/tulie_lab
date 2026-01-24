
import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Google Sheets & Apps Script Automation | The Tulie Lab',
    description: 'Xây dựng hệ thống quản trị dữ liệu, CRM, ERP tinh gọn và tự động hóa quy trình với Google Sheets và Apps Script.',
    keywords: ['Google Sheets', 'Apps Script', 'Tự động hóa doanh nghiệp', 'CRM Google Sheets'],
};

export default function GoogleSheetsPage() {
    return <LandingPageRenderer slug="google-sheets" />;
}
