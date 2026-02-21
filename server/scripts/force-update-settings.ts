import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultFooterData = {
    companyName: 'CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE',
    tagline: 'Giải pháp đào tạo và phát triển năng lực với AI',
    address: 'Tầng 4, Tòa nhà SHG, Số 8 Quang Trung, Phường Hà Đông, TP Hà Nội, Việt Nam',
    phone: '098.898.4554',
    email: 'info@tulie.vn',
    taxId: '0110163102',
    logoUrl: 'https://pub-84306d90a5714d098ed77c04f4c85df2.r2.dev/uploads/1767674831160-510937521.png',
    quickLinks: [
        { label: 'Các khóa học', href: '/courses' },
        { label: 'Giảng viên', href: '/instructors' },
        { label: 'Blog & Bài viết', href: '/blog' },
        { label: 'Liên hệ', href: '/contact' },
    ],
    policyLinks: [
        { label: 'Điều khoản sử dụng', href: '/terms' },
        { label: 'Chính sách bảo mật', href: '/privacy' },
        { label: 'Chính sách hoàn tiền', href: '/refund' },
        { label: 'Hướng dẫn thanh toán', href: '/payment-guide' },
    ],
    socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com/tulielab', icon: 'facebook' },
        { platform: 'YouTube', url: 'https://youtube.com/@tulielab', icon: 'youtube' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/tulielab', icon: 'linkedin' },
    ],
    certificationImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Bo_Cong_Thuong_Vietnam.svg/200px-Bo_Cong_Thuong_Vietnam.svg.png',
    certificationLink: 'http://online.gov.vn/',
    copyrightText: 'TULIE TSS. All Rights Reserved.',
};

async function main() {
    console.log('Force updating settings...');
    await prisma.systemSetting.upsert({
        where: { key: 'footer_settings' },
        update: { value: JSON.stringify(defaultFooterData) },
        create: { key: 'footer_settings', value: JSON.stringify(defaultFooterData), type: 'json' },
    });

    await prisma.systemSetting.upsert({
        where: { key: 'site_name' },
        update: { value: 'The Tulie Lab' },
        create: { key: 'site_name', value: 'The Tulie Lab', type: 'text' },
    });

    await prisma.systemSetting.upsert({
        where: { key: 'site_title' },
        update: { value: 'The Tulie Lab - Giải pháp Đào tạo & Công nghệ' },
        create: { key: 'site_title', value: 'The Tulie Lab - Giải pháp Đào tạo & Công nghệ', type: 'text' },
    });

    await prisma.systemSetting.upsert({
        where: { key: 'company_name' },
        update: { value: 'CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE' },
        create: { key: 'company_name', value: 'CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE', type: 'text' },
    });
    console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
