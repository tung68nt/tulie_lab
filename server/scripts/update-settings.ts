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
    console.log('Updating footer settings...');
    await prisma.systemSetting.upsert({
        where: { key: 'footer_settings' },
        update: { value: JSON.stringify(defaultFooterData) },
        create: { key: 'footer_settings', value: JSON.stringify(defaultFooterData), type: 'json' },
    });

    console.log('Updating site details...');
    await prisma.systemSetting.upsert({
        where: { key: 'site_favicon' },
        update: { value: 'https://pub-84306d90a5714d098ed77c04f4c85df2.r2.dev/uploads/1767675004983-722841406.png' },
        create: { key: 'site_favicon', value: 'https://pub-84306d90a5714d098ed77c04f4c85df2.r2.dev/uploads/1767675004983-722841406.png', type: 'image' },
    });

    await prisma.systemSetting.upsert({
        where: { key: 'site_title' },
        update: { value: 'Tulie TSS - Giải pháp Đào tạo & Công nghệ' },
        create: { key: 'site_title', value: 'Tulie TSS - Giải pháp Đào tạo & Công nghệ', type: 'text' },
    });

    await prisma.systemSetting.upsert({
        where: { key: 'site_description' },
        update: { value: 'Khai phá tiềm năng của bạn với các khóa học chuyên sâu về AI, Templates Google Sheets, App Scripts và các Ứng dụng sáng tạo.' },
        create: { key: 'site_description', value: 'Khai phá tiềm năng của bạn với các khóa học chuyên sâu về AI, Templates Google Sheets, App Scripts và các Ứng dụng sáng tạo.', type: 'textarea' },
    });

    console.log('Settings updated successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
