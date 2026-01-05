import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
    console.log('🌱 Starting comprehensive seed with sample content...\n');

    // ===== 1. INSTRUCTOR: Nguyễn Thanh Tùng =====
    console.log('👨‍🏫 Creating Instructor...');

    // Delete existing instructor to ensure fresh data
    // await prisma.instructorExperience.deleteMany({});
    await prisma.instructor.deleteMany({});

    const instructor = await prisma.instructor.create({
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
            // studentCount: 15000, 
            // introVideoUrl: courseData.introVideoUrl,
            // courseCount: 6,
            /*
            experiences: {
                create: [
                    {
                        company: 'The Tulie Lab',
                        position: 'Founder & CEO',
                        period: '2021 - Hiện tại',
                        icon: 'building'
                    },
                    {
                        company: 'VNG Corporation',
                        position: 'Senior Software Architect',
                        period: '2018 - 2021',
                        icon: 'building'
                    },
                    {
                        company: 'FPT Software',
                        position: 'Technical Lead',
                        period: '2015 - 2018',
                        icon: 'building'
                    },
                    {
                        company: 'Đại học Bách khoa TP.HCM',
                        position: 'Giảng viên thỉnh giảng - Khoa CNTT',
                        period: '2019 - Hiện tại',
                        icon: 'school'
                    },
                    {
                        company: 'Google Developer Expert',
                        position: 'GDE for Web Technologies',
                        period: '2020 - Hiện tại',
                        icon: 'award'
                    }
                ]
            }
            */
        }
    });
    console.log(`✅ Created instructor: ${instructor.name}\n`);

    // ===== 2. COURSES =====
    console.log('📚 Creating Courses...');

    // Delete existing courses
    await prisma.attachment.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.course.deleteMany({});

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
        const course = await prisma.course.create({
            data: {
                title: courseData.title,
                slug: courseData.slug,
                description: courseData.description,
                price: courseData.price,
                thumbnail: courseData.thumbnail,
                // introVideoUrl: courseData.introVideoUrl,
                isPublished: courseData.isPublished,
                instructorId: instructor.id,
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

        // Add attachments to first lesson of each course
        // @ts-ignore
        if (courseData.attachments && course.lessons && course.lessons.length > 0 && course.lessons[0]) {
            for (const att of courseData.attachments) {
                await prisma.attachment.create({
                    data: {
                        name: att.title, // Schema uses 'name'
                        url: att.url,
                        type: att.type,
                        // @ts-ignore
                        lessonId: course.lessons[0].id
                    }
                });
            }
        }

        const priceLabel = courseData.price === 0 ? 'MIỄN PHÍ' : `${courseData.price.toLocaleString('vi-VN')}đ`;
        console.log(`✅ ${course.title} (${priceLabel}) - ${course.lessons.length} lessons`);
    }

    // ===== 3. ADMIN USER =====
    console.log('\n👤 Creating Admin User...');
    const adminEmail = 'admin@tulie.vn';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Admin Tulie',
                role: 'ADMIN',
            }
        });
        console.log('✅ Created admin: admin@tulie.vn / admin123');
    } else {
        console.log('⏩ Admin already exists');
    }

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
