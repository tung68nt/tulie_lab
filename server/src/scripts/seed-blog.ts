import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleBlogPosts = [
    {
        title: 'AI trong Giáo dục: Xu hướng 2026 và Tương lai',
        slug: 'ai-trong-giao-duc-xu-huong-2026',
        excerpt: 'Khám phá cách AI đang thay đổi ngành giáo dục, từ học tập cá nhân hóa đến đánh giá tự động.',
        content: `<h2>AI đang cách mạng hóa giáo dục</h2>
<p>Trí tuệ nhân tạo không còn là khái niệm xa vời mà đã trở thành một phần không thể thiếu trong lĩnh vực giáo dục. Từ việc cá nhân hóa lộ trình học tập đến hỗ trợ giáo viên trong công tác đánh giá, AI đang mang lại những thay đổi tích cực.</p>

<h3>1. Học tập cá nhân hóa</h3>
<p>AI có thể phân tích tiến độ và phong cách học tập của từng học viên, từ đó đề xuất nội dung phù hợp nhất.</p>

<h3>2. Đánh giá tự động</h3>
<p>Các hệ thống AI hiện đại có thể chấm bài, phát hiện đạo văn và cung cấp phản hồi chi tiết trong thời gian thực.</p>

<h3>3. Trợ lý ảo 24/7</h3>
<p>Chatbot AI có thể hỗ trợ học viên giải đáp thắc mắc bất cứ lúc nào, giảm tải cho giáo viên.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800',
        isPublished: true,
        metaTitle: 'AI trong Giáo dục 2026 - Xu hướng và Tương lai | The Tulie Lab',
        metaDescription: 'Khám phá cách AI đang thay đổi ngành giáo dục với học tập cá nhân hóa, đánh giá tự động và trợ lý ảo.',
        metaKeywords: 'AI giáo dục, trí tuệ nhân tạo, học tập cá nhân hóa, edtech'
    },
    {
        title: 'Vibe Coding là gì? Hướng dẫn từ A-Z cho người mới bắt đầu',
        slug: 'vibe-coding-la-gi-huong-dan-a-z',
        excerpt: 'Tìm hiểu về Vibe Coding - phương pháp lập trình mới với sự hỗ trợ của AI, giúp bạn xây dựng app nhanh chóng.',
        content: `<h2>Vibe Coding - Lập trình thời AI</h2>
<p>Vibe Coding là khái niệm mới mô tả cách tiếp cận lập trình với sự hỗ trợ mạnh mẽ từ AI. Thay vì viết từng dòng code, bạn sẽ "vibe" với AI để tạo ra sản phẩm.</p>

<h3>Lợi ích của Vibe Coding</h3>
<ul>
<li>Tốc độ phát triển nhanh gấp 5-10 lần</li>
<li>Không cần kiến thức lập trình chuyên sâu</li>
<li>Focus vào logic và sản phẩm, không phải syntax</li>
</ul>

<h3>Công cụ phổ biến</h3>
<p>Cursor, GitHub Copilot, Claude Code, và nhiều công cụ khác đang hỗ trợ phương pháp này.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
        isPublished: true,
        metaTitle: 'Vibe Coding là gì? Hướng dẫn chi tiết | The Tulie Lab',
        metaDescription: 'Vibe Coding là phương pháp lập trình mới với AI. Hướng dẫn chi tiết cho người mới bắt đầu.',
        metaKeywords: 'vibe coding, AI coding, lập trình AI, cursor, copilot'
    },
    {
        title: 'Xây dựng MVP trong 2 tuần: Case Study thực tế',
        slug: 'xay-dung-mvp-trong-2-tuan-case-study',
        excerpt: 'Câu chuyện thực tế về việc xây dựng một sản phẩm MVP hoàn chỉnh trong 2 tuần với phương pháp Vibe Coding.',
        content: `<h2>Từ ý tưởng đến sản phẩm trong 14 ngày</h2>
<p>Đây là câu chuyện về cách chúng tôi đã xây dựng một ứng dụng quản lý dự án MVP từ con số 0.</p>

<h3>Tuần 1: Research và Setup</h3>
<p>Phân tích yêu cầu, thiết kế database, setup project với Next.js và Prisma.</p>

<h3>Tuần 2: Build và Launch</h3>
<p>Phát triển features chính, testing, và deploy lên production.</p>

<h3>Kết quả</h3>
<p>Sản phẩm hoàn chỉnh với authentication, CRUD operations, và dashboard analytics.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
        isPublished: true,
        metaTitle: 'Xây dựng MVP trong 2 tuần - Case Study | The Tulie Lab',
        metaDescription: 'Case study thực tế về xây dựng MVP trong 2 tuần với Vibe Coding.',
        metaKeywords: 'MVP, startup, vibe coding, case study'
    },
    {
        title: 'Top 10 công cụ No-Code/Low-Code 2026',
        slug: 'top-10-cong-cu-no-code-low-code-2026',
        excerpt: 'Danh sách các công cụ No-Code và Low-Code tốt nhất năm 2026 để xây dựng ứng dụng không cần code.',
        content: `<h2>Công cụ No-Code/Low-Code hàng đầu</h2>
<p>Năm 2026 chứng kiến sự bùng nổ của các công cụ giúp bạn xây dựng ứng dụng mà không cần viết code.</p>

<h3>1. Bubble</h3>
<p>Nền tảng mạnh mẽ cho web apps phức tạp.</p>

<h3>2. Webflow</h3>
<p>Lý tưởng cho marketing sites và landing pages.</p>

<h3>3. Retool</h3>
<p>Xây dựng internal tools nhanh chóng.</p>

<h3>4-10...</h3>
<p>Xem chi tiết trong bài viết đầy đủ.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
        isPublished: true,
        metaTitle: 'Top 10 công cụ No-Code Low-Code 2026 | The Tulie Lab',
        metaDescription: 'Danh sách 10 công cụ No-Code và Low-Code tốt nhất 2026.',
        metaKeywords: 'no-code, low-code, bubble, webflow, retool'
    },
    {
        title: 'Tại sao Typescript là lựa chọn số 1 cho dự án mới?',
        slug: 'tai-sao-typescript-lua-chon-so-1',
        excerpt: 'Phân tích lý do TypeScript đang thống trị thế giới JavaScript và tại sao bạn nên sử dụng nó.',
        content: `<h2>TypeScript: JavaScript với superpowers</h2>
<p>TypeScript không chỉ là JavaScript có kiểu dữ liệu. Nó là một công cụ giúp bạn viết code tốt hơn.</p>

<h3>Lợi ích chính</h3>
<ul>
<li>Phát hiện lỗi sớm trong quá trình phát triển</li>
<li>IntelliSense và autocomplete mạnh mẽ</li>
<li>Refactoring an toàn hơn</li>
<li>Documentation tự động từ types</li>
</ul>`,
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800',
        isPublished: true,
        metaTitle: 'Tại sao TypeScript là số 1? | The Tulie Lab',
        metaDescription: 'Phân tích lý do TypeScript đang thống trị và tại sao bạn nên sử dụng.',
        metaKeywords: 'typescript, javascript, lập trình web'
    },
    {
        title: 'Hướng dẫn Deploy Next.js lên Vercel từ A-Z',
        slug: 'huong-dan-deploy-nextjs-vercel',
        excerpt: 'Hướng dẫn chi tiết cách deploy ứng dụng Next.js lên Vercel miễn phí với custom domain.',
        content: `<h2>Deploy Next.js lên Vercel</h2>
<p>Vercel là nền tảng tốt nhất để deploy Next.js vì nó được tạo ra bởi cùng team.</p>

<h3>Bước 1: Chuẩn bị repository</h3>
<p>Push code lên GitHub/GitLab/Bitbucket.</p>

<h3>Bước 2: Kết nối Vercel</h3>
<p>Đăng ký Vercel và import repo.</p>

<h3>Bước 3: Cấu hình</h3>
<p>Set environment variables và build settings.</p>

<h3>Bước 4: Deploy</h3>
<p>Click Deploy và đợi vài phút!</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800',
        isPublished: true,
        metaTitle: 'Deploy Next.js lên Vercel - Hướng dẫn A-Z | The Tulie Lab',
        metaDescription: 'Hướng dẫn chi tiết deploy Next.js app lên Vercel miễn phí.',
        metaKeywords: 'nextjs, vercel, deploy, hosting'
    },
    {
        title: 'Prisma vs TypeORM: So sánh chi tiết 2026',
        slug: 'prisma-vs-typeorm-so-sanh-2026',
        excerpt: 'So sánh hai ORM phổ biến nhất cho Node.js: Prisma và TypeORM.',
        content: `<h2>Prisma vs TypeORM</h2>
<p>Cả hai đều là những ORM tuyệt vời, nhưng có những khác biệt quan trọng.</p>

<h3>Prisma</h3>
<ul>
<li>Schema-first approach</li>
<li>Type-safe queries</li>
<li>Prisma Studio GUI</li>
</ul>

<h3>TypeORM</h3>
<ul>
<li>Code-first với decorators</li>
<li>Active record và Data mapper patterns</li>
<li>Migrations mạnh mẽ</li>
</ul>

<h3>Kết luận</h3>
<p>Chọn Prisma cho dự án mới, TypeORM nếu cần flexibility cao.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800',
        isPublished: true,
        metaTitle: 'Prisma vs TypeORM 2026 - So sánh chi tiết | The Tulie Lab',
        metaDescription: 'So sánh Prisma và TypeORM cho Node.js projects.',
        metaKeywords: 'prisma, typeorm, orm, nodejs, database'
    },
    {
        title: '5 Sai lầm phổ biến khi học lập trình và cách tránh',
        slug: '5-sai-lam-pho-bien-khi-hoc-lap-trinh',
        excerpt: 'Những sai lầm thường gặp khi bắt đầu học code và cách để vượt qua chúng.',
        content: `<h2>Sai lầm khi học lập trình</h2>

<h3>1. Học quá nhiều ngôn ngữ cùng lúc</h3>
<p>Focus vào một ngôn ngữ đến khi thành thạo.</p>

<h3>2. Không thực hành đủ</h3>
<p>Xem tutorial không bằng tự làm project.</p>

<h3>3. Copy paste code không hiểu</h3>
<p>Dành thời gian hiểu từng dòng code.</p>

<h3>4. Bỏ cuộc quá sớm</h3>
<p>Frustration là normal, keep going!</p>

<h3>5. Không tham gia cộng đồng</h3>
<p>Join Discord, forum để học hỏi và networking.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800',
        isPublished: true,
        metaTitle: '5 Sai lầm khi học lập trình | The Tulie Lab',
        metaDescription: 'Những sai lầm phổ biến của người mới học code và cách tránh.',
        metaKeywords: 'học lập trình, coding mistakes, tips lập trình'
    },
    {
        title: 'Thiết kế Database Schema: Best Practices 2026',
        slug: 'thiet-ke-database-schema-best-practices',
        excerpt: 'Hướng dẫn thiết kế database schema hiệu quả, tối ưu performance và maintainability.',
        content: `<h2>Database Schema Design</h2>

<h3>1. Normalization</h3>
<p>Chuẩn hóa dữ liệu để tránh redundancy.</p>

<h3>2. Naming Conventions</h3>
<p>Sử dụng snake_case hoặc camelCase nhất quán.</p>

<h3>3. Indexes</h3>
<p>Index các columns thường xuyên query.</p>

<h3>4. Foreign Keys</h3>
<p>Đảm bảo referential integrity.</p>

<h3>5. Soft Delete</h3>
<p>Sử dụng deletedAt thay vì xóa cứng.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
        isPublished: true,
        metaTitle: 'Database Schema Best Practices 2026 | The Tulie Lab',
        metaDescription: 'Hướng dẫn thiết kế database schema hiệu quả và tối ưu.',
        metaKeywords: 'database, schema design, sql, best practices'
    },
    {
        title: 'Authentication với JWT: Hướng dẫn bảo mật',
        slug: 'authentication-jwt-huong-dan-bao-mat',
        excerpt: 'Hướng dẫn implement JWT authentication an toàn cho ứng dụng web.',
        content: `<h2>JWT Authentication</h2>
<p>JSON Web Tokens là standard phổ biến cho authentication.</p>

<h3>Cấu trúc JWT</h3>
<p>Header.Payload.Signature</p>

<h3>Best Practices</h3>
<ul>
<li>Sử dụng HTTPS</li>
<li>Set expiration time ngắn</li>
<li>Implement refresh tokens</li>
<li>Lưu token an toàn (httpOnly cookies)</li>
<li>Validate token server-side</li>
</ul>

<h3>Lưu ý bảo mật</h3>
<p>Không lưu sensitive data trong payload vì nó có thể decode được.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800',
        isPublished: true,
        metaTitle: 'JWT Authentication - Hướng dẫn bảo mật | The Tulie Lab',
        metaDescription: 'Implement JWT authentication an toàn cho web apps.',
        metaKeywords: 'jwt, authentication, bảo mật, security'
    }
];

async function seedBlogPosts() {
    console.log('🌱 Seeding blog posts...');

    for (const post of sampleBlogPosts) {
        try {
            const existing = await prisma.blogPost.findUnique({
                where: { slug: post.slug }
            });

            if (!existing) {
                await prisma.blogPost.create({
                    data: {
                        ...post,
                        publishedAt: post.isPublished ? new Date() : null
                    }
                });
                console.log(`✅ Created: ${post.title}`);
            } else {
                console.log(`⏭️ Exists: ${post.title}`);
            }
        } catch (error) {
            console.error(`❌ Error creating ${post.title}:`, error);
        }
    }

    console.log('✨ Blog seeding completed!');
}

seedBlogPosts()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
