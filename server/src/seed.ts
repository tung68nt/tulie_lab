import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
    console.log('🌱 Starting comprehensive seed with sample content...\n');

    // ===== 1. ADMIN USER =====
    console.log('\n👤 Creating/Updating Admin User...');
    const adminEmail = 'admin@tulie.vn';
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true
        },
        create: {
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            isActive: true,
            profile: {
                create: {
                    name: 'Admin Tulie'
                }
            }
        }
    });

    console.log('✅ Admin user ready: admin@tulie.vn / admin123\n');

    // ===== 2. INSTRUCTOR: Nguyễn Thanh Tùng =====
    console.log('👨‍🏫 Creating Instructor...');


    let instructor = await prisma.instructor.findFirst({
        where: { name: 'Nguyễn Thanh Tùng' }
    });

    if (!instructor) {
        instructor = await prisma.instructor.create({
            data: {
                name: 'Nguyễn Thanh Tùng',
                title: 'Founder & CEO at The Tulie Lab',
                bio: `🎯 Founder & CEO của The Tulie Lab - Nền tảng giáo dục công nghệ AI hàng đầu Việt Nam.

Với hơn 12 năm kinh nghiệm trong ngành công nghệ và giáo dục, tôi đã có cơ hội làm việc tại các tập đoàn công nghệ hàng đầu và tham gia đào tạo hàng nghìn học viên từ cơ bản đến nâng cao.

📚 CHUYÊN MÔN:
• AI & Machine Learning Applications
• Full-stack Development (React, Node.js, Next.js, Python)
• Cloud Architecture (AWS, GCP, Azure)
• Product Management & Startup Mentoring
• EdTech & Learning Experience Design

🏆 THÀNH TỰU NỔI BẬT:
• Đào tạo hơn 15,000+ học viên trên toàn quốc
• 80+ dự án thực tế được triển khai thành công
• Speaker tại các tech conferences: Google I/O Extended, AWS Summit Vietnam
• Mentor cho 20+ startup công nghệ, 3 startup đạt Series A
• Tác giả 2 cuốn sách về lập trình và AI

💡 TRIẾT LÝ GIẢNG DẠY:
"Học để làm được, không chỉ để biết. Mỗi dòng code phải mang lại giá trị thực."

Tôi tin rằng công nghệ AI sẽ thay đổi hoàn toàn cách chúng ta làm việc và học tập. Sứ mệnh của tôi là giúp mọi người Việt Nam có thể tiếp cận và làm chủ công nghệ AI một cách dễ dàng nhất.`,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                studentCount: 15000,
                courseCount: 6,
            }
        });
        console.log(`✅ Created instructor: ${instructor.name}\n`);
    } else {
        console.log(`ℹ️ Instructor already exists: ${instructor.name}\n`);
    }

    // ===== 3. COURSES =====
    console.log('📚 Creating/Updating Courses...');


    const coursesData = [
        // ===== PAID COURSES =====
        {
            title: 'AI Ứng Dụng Cho Developer',
            slug: 'ai-ung-dung-cho-developer',
            description: `Khóa học toàn diện về cách tích hợp AI vào ứng dụng thực tế. Học cách sử dụng ChatGPT API, Langchain, và xây dựng các ứng dụng AI-powered.

🎯 BẠN SẼ HỌC ĐƯỢC:
• Tích hợp OpenAI API, Claude API vào ứng dụng
• Xây dựng Chatbot thông minh với memory
• RAG (Retrieval Augmented Generation) cho dữ liệu riêng
• Vector Database & Embeddings với Pinecone, Chroma
• Deploy AI Applications lên production

⏱️ THỜI LƯỢNG: 25+ giờ video HD
📝 BÀI TẬP: 15+ mini projects
🎓 CHỨNG CHỈ: Có chứng chỉ hoàn thành
💬 HỖ TRỢ: Group Discord + Q&A trực tiếp`,
            price: 1500000,
            thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
            introVideoUrl: 'https://www.youtube.com/watch?v=JMUxmLyrhSk',
            isPublished: true,
            lessons: [
                { title: 'Giới thiệu khóa học & Tổng quan về AI', slug: 'gioi-thieu-ai', position: 1, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=JMUxmLyrhSk' },
                { title: 'Setup môi trường phát triển', slug: 'setup-moi-truong', position: 2, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=VznoKyh6AXs' },
                { title: 'Làm việc với OpenAI API', slug: 'openai-api', position: 3, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=uRQH2CFvedY' },
                { title: 'Xây dựng Chatbot với Langchain', slug: 'langchain-chatbot', position: 4, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=_v_fgW2SkkQ' },
                { title: 'Vector Database & Embeddings', slug: 'vector-database', position: 5, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=klTvEwg3oJ4' },
                { title: 'RAG: Retrieval Augmented Generation', slug: 'rag-tutorial', position: 6, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=T-D1OfcDW1M' },
                { title: 'Deploy AI App lên Production', slug: 'deploy-ai-app', position: 7, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=Zq5fmkH0T78' },
            ],
            attachments: [
                { title: 'Slide bài giảng - Module 1-3', url: 'https://drive.google.com/file/d/example1/view', type: 'file' },
                { title: 'Source code demo', url: 'https://github.com/tulie-lab/ai-course-demo', type: 'link' },
                { title: 'Tài liệu OpenAI API', url: 'https://platform.openai.com/docs', type: 'link' },
            ]
        },
        {
            title: 'Vibe Coding - Xây Dựng App Bằng AI',
            slug: 'vibe-coding-ai-app',
            description: `Phương pháp lập trình mới với sự hỗ trợ của AI. Học cách sử dụng Cursor, GitHub Copilot, và các công cụ AI để tăng tốc phát triển 10x.

🚀 HIGHLIGHTS:
• Vibe Coding Methodology - Phương pháp code cùng AI
• Cursor AI Editor Deep Dive
• GitHub Copilot Mastery
• AI-Assisted Debugging & Refactoring
• Building MVP trong 24h với AI

💡 PHƯƠNG PHÁP: Hands-on 100%, không lý thuyết suông
🛠️ TOOLS: Cursor, Copilot, Claude, ChatGPT, v0.dev`,
            price: 1200000,
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
            introVideoUrl: 'https://www.youtube.com/watch?v=yoQyPLZmyes',
            isPublished: true,
            lessons: [
                { title: 'Vibe Coding là gì? Tại sao nó thay đổi cách bạn code?', slug: 'vibe-coding-intro', position: 1, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=yoQyPLZmyes' },
                { title: 'Setup Cursor AI Editor', slug: 'cursor-setup', position: 2, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=gDJzr9DBKTI' },
                { title: 'Prompt Engineering cho Developers', slug: 'prompt-engineering', position: 3, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=_ZvnD96BsEc' },
                { title: 'GitHub Copilot Deep Dive', slug: 'github-copilot', position: 4, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=Fi3AJZZregI' },
                { title: 'Xây dựng Full-stack App với AI trong 3 giờ', slug: 'fullstack-ai', position: 5, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=pONg_0r7zNk' },
                { title: 'Debug & Refactor với AI', slug: 'ai-debug', position: 6, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=jvqJL5VT8X0' },
            ],
            attachments: [
                { title: 'Cursor Cheat Sheet (PDF)', url: 'https://drive.google.com/file/d/cursor-cheatsheet/view', type: 'file' },
                { title: 'Prompt Templates Collection', url: 'https://drive.google.com/file/d/prompts/view', type: 'file' },
            ]
        },
        {
            title: 'Next.js 14 - Từ Zero đến Production',
            slug: 'nextjs-14-zero-to-hero',
            description: `Khóa học toàn diện về Next.js 14 với App Router, Server Components, và các tính năng mới nhất. Xây dựng ứng dụng production-ready.

📚 NỘI DUNG CHI TIẾT:
• App Router & File-based Routing
• Server Components vs Client Components
• Data Fetching Strategies (SSR, SSG, ISR)
• Authentication & Authorization với NextAuth
• Database với Prisma ORM
• Deploy lên Vercel với CI/CD

🏆 DỰ ÁN CUỐI KHÓA: LMS Platform giống thực tế`,
            price: 990000,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
            introVideoUrl: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA',
            isPublished: true,
            lessons: [
                { title: 'Tại sao chọn Next.js 14?', slug: 'why-nextjs', position: 1, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA' },
                { title: 'Khởi tạo dự án Next.js 14 với TypeScript', slug: 'create-nextjs', position: 2, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=vwSlYG7hFk0' },
                { title: 'App Router Deep Dive', slug: 'app-router', position: 3, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=gSSsZReIFRk' },
                { title: 'Server vs Client Components', slug: 'server-client', position: 4, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=VBlSe8tvg4U' },
                { title: 'Data Fetching Patterns', slug: 'data-fetching', position: 5, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=RBM03RihZVs' },
                { title: 'Authentication với NextAuth v5', slug: 'nextauth', position: 6, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=md65iBX5Gxg' },
                { title: 'Prisma ORM & PostgreSQL', slug: 'prisma-orm', position: 7, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=QXxy8Uv1LnQ' },
                { title: 'Deploy Production lên Vercel', slug: 'deploy-vercel', position: 8, isFree: false, videoUrl: 'https://www.youtube.com/watch?v=2HBIzEx6IZA' },
            ],
            attachments: [
                { title: 'Next.js 14 Documentation', url: 'https://nextjs.org/docs', type: 'link' },
                { title: 'Prisma Cheat Sheet', url: 'https://www.prisma.io/docs', type: 'link' },
            ]
        },

        // ===== FREE COURSES =====
        {
            title: 'TypeScript Mastery - Hoàn Toàn Miễn Phí',
            slug: 'typescript-mastery-free',
            description: `Làm chủ TypeScript từ cơ bản đến nâng cao. Khóa học MIỄN PHÍ dành cho developers muốn nâng cao kỹ năng type-safety.

🎯 NỘI DUNG:
• Type System Fundamentals
• Generics & Utility Types
• Advanced Type Patterns
• TypeScript với React/Next.js
• Best Practices & Anti-patterns

💯 MIỄN PHÍ 100% - Không cần thanh toán!`,
            price: 0,
            thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop',
            introVideoUrl: 'https://www.youtube.com/watch?v=BCg4U1FzODs',
            isPublished: true,
            lessons: [
                { title: 'Tại sao cần TypeScript?', slug: 'why-typescript', position: 1, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=BCg4U1FzODs' },
                { title: 'Basic Types & Interfaces', slug: 'basic-types', position: 2, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=d56mG7DezGs' },
                { title: 'Functions & Classes với TypeScript', slug: 'functions-classes', position: 3, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=fsVL_xrYO0w' },
                { title: 'Generics Deep Dive', slug: 'generics', position: 4, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=nViEqpgwxHE' },
                { title: 'Utility Types: Partial, Pick, Omit...', slug: 'utility-types', position: 5, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=lATafp15HWA' },
            ],
            attachments: [
                { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/', type: 'link' },
            ]
        },
        {
            title: 'React Cơ Bản Cho Người Mới - Miễn Phí',
            slug: 'react-basics-free',
            description: `Học React từ con số 0. Khóa học MIỄN PHÍ dành cho người mới bắt đầu với lập trình frontend.

🎓 BẠN SẼ HỌC:
• JSX & Components
• Props & State
• Hooks: useState, useEffect
• Event Handling
• Conditional Rendering
• Lists & Keys

⏱️ THỜI LƯỢNG: 8 giờ
💯 MIỄN PHÍ HOÀN TOÀN`,
            price: 0,
            thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=450&fit=crop',
            introVideoUrl: 'https://www.youtube.com/watch?v=Rh3tobg7hEo',
            isPublished: true,
            lessons: [
                { title: 'React là gì? Tại sao nên học React?', slug: 'what-is-react', position: 1, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=Rh3tobg7hEo' },
                { title: 'JSX & Components đầu tiên', slug: 'jsx-components', position: 2, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
                { title: 'Props - Truyền dữ liệu giữa Components', slug: 'props-basics', position: 3, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=PHaECbrKgs0' },
                { title: 'State & useState Hook', slug: 'state-usestate', position: 4, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0' },
                { title: 'useEffect & Side Effects', slug: 'useeffect', position: 5, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U' },
            ],
            attachments: [
                { title: 'React Documentation', url: 'https://react.dev', type: 'link' },
                { title: 'React Cheat Sheet (PDF)', url: 'https://drive.google.com/file/d/react-cheatsheet/view', type: 'file' },
            ]
        },
        {
            title: 'Git & GitHub Cho Người Mới Bắt Đầu',
            slug: 'git-github-basics-free',
            description: `Học Git và GitHub từ số 0. Kỹ năng BẮT BUỘC cho mọi developer.

📖 NỘI DUNG:
• Git là gì? Version Control cơ bản
• Các lệnh Git cơ bản: add, commit, push, pull
• Branching & Merging
• Pull Requests & Code Review
• GitHub Actions cơ bản

🆓 MIỄN PHÍ - Dành cho tất cả mọi người!`,
            price: 0,
            thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=450&fit=crop',
            introVideoUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
            isPublished: true,
            lessons: [
                { title: 'Git là gì? Tại sao cần Version Control?', slug: 'what-is-git', position: 1, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
                { title: 'Cài đặt Git & Cấu hình ban đầu', slug: 'git-install', position: 2, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=USjZcfj8yxE' },
                { title: 'Các lệnh Git cơ bản', slug: 'git-basics', position: 3, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=8JJ101D3knE' },
                { title: 'Branching & Merging', slug: 'git-branching', position: 4, isFree: true, videoUrl: 'https://www.youtube.com/watch?v=Q1kHG842HoI' },
            ],
            attachments: [
                { title: 'Git Cheat Sheet (PDF)', url: 'https://education.github.com/git-cheat-sheet-education.pdf', type: 'file' },
                { title: 'GitHub Docs', url: 'https://docs.github.com', type: 'link' },
            ]
        },
    ];

    for (const courseData of coursesData) {
        const course = await prisma.course.upsert({
            where: { slug: courseData.slug },
            update: {
                title: courseData.title,
                description: courseData.description,
                price: new Decimal(courseData.price),
                thumbnail: courseData.thumbnail,
                isPublished: courseData.isPublished,
                instructorId: instructor.id,
                deploymentStatus: 'RELEASED',
            },
            create: {
                title: courseData.title,
                slug: courseData.slug,
                description: courseData.description,
                price: new Decimal(courseData.price),
                thumbnail: courseData.thumbnail,
                isPublished: courseData.isPublished,
                instructorId: instructor.id,
                deploymentStatus: 'RELEASED',
                lessons: {
                    create: courseData.lessons.map(l => ({
                        title: l.title,
                        slug: l.slug,
                        position: l.position,
                        isFree: l.isFree,
                        videoUrl: l.videoUrl,
                    }))
                }
            },
            include: { lessons: true }
        });

        // Add attachments to first lesson of each course only if they don't exist
        // @ts-ignore
        if (courseData.attachments && course.lessons && course.lessons.length > 0 && course.lessons[0]) {
            for (const att of courseData.attachments) {
                const existingAtt = await prisma.attachment.findFirst({
                    where: {
                        name: att.title,
                        lessonId: course.lessons[0].id
                    }
                });

                if (!existingAtt) {
                    await prisma.attachment.create({
                        data: {
                            name: att.title,
                            url: att.url,
                            type: att.type,
                            // @ts-ignore
                            lessonId: course.lessons[0].id
                        }
                    });
                }
            }
        }
        const priceLabel = courseData.price === 0 ? 'MIỄN PHÍ' : `${courseData.price.toLocaleString('vi-VN')}đ`;
        console.log(`✅ ${course.title} (${priceLabel}) - ${course.lessons.length} lessons`);
    }

    // ===== 4. CATEGORIES =====
    console.log('\n📁 Creating Categories...');
    const categories = [
        { name: 'Kế toán (Accounting)', slug: 'accounting' },
        { name: 'Nhân sự (HR)', slug: 'hr' },
        { name: 'Marketing', slug: 'marketing' },
        { name: 'Kinh doanh (Business)', slug: 'business' },
        { name: 'Sáng tạo (Creative)', slug: 'creative' },
        { name: 'Khác (Other)', slug: 'other' },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: { name: cat.name, slug: cat.slug }
        });
    }
    console.log('✅ Categories ready\n');

    // ===== 5. SUBSCRIPTION PRODUCTS =====
    console.log('💎 Creating/Updating Subscription Products...');
    const subscriptionProducts = [
        {
            title: 'Pro Membership',
            slug: 'pro-membership',
            description: 'Gói thành viên Pro - Truy cập nâng cao',
            price: 499000,
            type: 'SUBSCRIPTION',
            thumbnail: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800&fit=crop',
            isPublished: true,
        },
        {
            title: 'Premium Membership',
            slug: 'premium-membership',
            description: 'Gói thành viên Premium - Truy cập toàn bộ',
            price: 999000,
            type: 'SUBSCRIPTION',
            thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop',
            isPublished: true,
        }
    ];

    for (const sub of subscriptionProducts) {
        await prisma.product.upsert({
            where: { slug: sub.slug },
            update: {
                title: sub.title,
                description: sub.description,
                price: new Decimal(sub.price),
                // @ts-ignore
                type: sub.type,
                thumbnail: sub.thumbnail,
                isPublished: sub.isPublished,
            },
            create: {
                title: sub.title,
                slug: sub.slug,
                description: sub.description,
                price: new Decimal(sub.price),
                // @ts-ignore
                type: sub.type,
                thumbnail: sub.thumbnail,
                isPublished: sub.isPublished,
            }
        });
        console.log(`✅ ${sub.title} created`);
    }

    // ===== 6. DIGITAL PRODUCTS =====
    console.log('\n📦 Creating Digital Products...');
    const digitalProducts = [
        {
            title: 'Bộ Template React Admin Dashboard',
            slug: 'react-admin-dashboard-template',
            description: 'Giao diện quản trị hiện đại, đầy đủ tính năng, dark mode, responsive.',
            price: 499000,
            compareAtPrice: 299000,
            thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=450&fit=crop',
            type: 'TEMPLATE',
            versions: [
                { version: '1.0.0', changelog: 'Initial release', fileUrl: 'https://example.com/files/admin-v1.zip' },
            ]
        },
        {
            title: 'Ebook: Làm chủ Next.js 14',
            slug: 'mastering-nextjs-14',
            description: 'Học Next.js 14 Server Actions, App Router, và tối ưu hiệu suất.',
            price: 199000,
            compareAtPrice: 99000,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
            type: 'TEMPLATE',
            versions: [
                { version: '1.0', changelog: 'First edition', fileUrl: 'https://example.com/files/ebook-v1.pdf' }
            ]
        },
        {
            title: 'Icon Set Premium 3D',
            slug: 'premium-3d-icons',
            description: 'Bộ 100+ icon 3D chất lượng cao. Định dạng PNG, BLEND. Phù hợp cho thiết kế UI/UX hiện đại.',
            price: 350000,
            compareAtPrice: null,
            thumbnail: 'https://images.unsplash.com/photo-1614850523296-e811cfbaf163?w=800&h=450&fit=crop',
            type: 'TEMPLATE',
            versions: [
                { version: '1.0', changelog: 'Release 100 icons', fileUrl: 'https://example.com/files/icons-v1.zip' }
            ]
        }
    ];

    for (const p of digitalProducts) {
        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: {
                title: p.title,
                description: p.description,
                price: new Decimal(p.price),
                compareAtPrice: p.compareAtPrice ? new Decimal(p.compareAtPrice) : null,
                thumbnail: p.thumbnail,
                // @ts-ignore
                type: p.type,
                isPublished: true,
            },
            create: {
                title: p.title,
                slug: p.slug,
                description: p.description,
                price: new Decimal(p.price),
                compareAtPrice: p.compareAtPrice ? new Decimal(p.compareAtPrice) : null,
                thumbnail: p.thumbnail,
                // @ts-ignore
                type: p.type,
                isPublished: true,
            }
        });

        // Add versions
        for (const v of p.versions) {
            const existingVersion = await prisma.productVersion.findFirst({
                where: { productId: product.id, version: v.version }
            });
            if (!existingVersion) {
                await prisma.productVersion.create({
                    data: {
                        productId: product.id,
                        version: v.version,
                        changelog: v.changelog,
                        fileUrl: v.fileUrl
                    }
                });
            }
        }
        console.log(`✅ Product ready: ${p.title}`);
    }

    // ===== 7. PRODUCT CLASSIFICATIONS =====
    console.log('\n🏷️ Seeding Product Classifications...');

    // 7.1 Product Types
    const productTypes = [
        { name: 'Template', type: 'PRODUCT_TYPE' },
        { name: 'App / Software', type: 'PRODUCT_TYPE' },
        { name: 'License Key', type: 'PRODUCT_TYPE' },
        { name: 'Subscription', type: 'PRODUCT_TYPE' },
    ];

    for (const t of productTypes) {
        await prisma.productClassification.upsert({
            where: {
                name_type: {
                    name: t.name,
                    // @ts-ignore
                    type: t.type
                }
            },
            update: { isActive: true },
            create: {
                name: t.name,
                // @ts-ignore
                type: t.type,
                isActive: true
            }
        });
    }

    // 7.2 Product Fields
    const productFields = [
        { name: 'Kế toán (Accounting)', type: 'PRODUCT_FIELD' },
        { name: 'Nhân sự (HR)', type: 'PRODUCT_FIELD' },
        { name: 'Marketing', type: 'PRODUCT_FIELD' },
        { name: 'Kinh doanh (Business)', type: 'PRODUCT_FIELD' },
        { name: 'Sáng tạo (Creative)', type: 'PRODUCT_FIELD' },
        { name: 'Khác (Other)', type: 'PRODUCT_FIELD' },
    ];

    for (const f of productFields) {
        await prisma.productClassification.upsert({
            where: {
                name_type: {
                    name: f.name,
                    // @ts-ignore
                    type: f.type
                }
            },
            update: { isActive: true },
            create: {
                name: f.name,
                // @ts-ignore
                type: f.type,
                isActive: true
            }
        });
    }
    console.log('✅ Product Classifications ready\n');

    // ===== 8. SYSTEM SETTINGS =====
    console.log('\n⚙️ Seeding System Settings...');
    const settings = [
        { key: 'site_name', value: 'The Tulie Lab', type: 'text' },
        { key: 'site_logo', value: 'https://thelab.tulie.vn/logo.png', type: 'text' },
        { key: 'show_site_name', value: 'true', type: 'text' },
        {
            key: 'footer_settings',
            value: JSON.stringify({
                companyName: 'CÔNG TY TNHH DỊCH VỤ VÀ GIẢI PHÁP CÔNG NGHỆ TULIE',
                tagline: 'Giải pháp đào tạo và phát triển năng lực với AI',
                address: 'Tầng 2 Tòa A Chelsea Residences, 48 Trần Kim Xuyến, Cầu Giấy, Hà Nội',
                phone: '0978.863.775',
                email: 'support@tulielab.vn',
                taxId: '0110163102',
                logoUrl: 'https://thelab.tulie.vn/logo.png',
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
                copyrightText: 'The Tulie Lab. All Rights Reserved.',
            }),
            type: 'text'
        }
    ];

    for (const setting of settings) {
        await prisma.systemSetting.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: { key: setting.key, value: setting.value, type: setting.type }
        });
    }
    console.log('✅ System settings ready\n');

    // ===== SUMMARY =====
    console.log('\n🎉 Seed completed successfully!');
    console.log('━'.repeat(50));
    console.log('📊 SUMMARY:');
    console.log('   👨‍🏫 1 Instructor: Nguyễn Thanh Tùng (with 5 experiences)');
    console.log('   📚 6 Courses:');
    console.log('      • 3 Paid courses (990k - 1.5M VND)');
    console.log('      • 3 Free courses');
    console.log('   🎬 35+ Lessons with real YouTube links');
    console.log('   📎 10+ Attachments (PDFs & Links)');
    console.log('   👤 1 Admin user');
    console.log('━'.repeat(50));
};

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
