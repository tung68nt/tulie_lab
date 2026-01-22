import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleBlogPosts = [
    {
        title: 'The Tulie Lab - Đối tác tin cậy cho chuyển đổi số doanh nghiệp',
        slug: 'the-tulie-lab-doi-tac-chuyen-doi-so',
        excerpt: 'Khám phá các dịch vụ chuyển đổi số toàn diện của The Tulie Lab: từ tư vấn, đào tạo đến triển khai giải pháp công nghệ.',
        content: `<h2>The Tulie Lab - Đồng hành cùng doanh nghiệp trong kỷ nguyên số</h2>
<p>The Tulie Lab là đơn vị tiên phong trong lĩnh vực chuyển đổi số và ứng dụng công nghệ AI vào doanh nghiệp. Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến những giải pháp công nghệ tối ưu nhất cho mọi quy mô doanh nghiệp.</p>

<h3>Dịch vụ đào tạo công nghệ chuyên sâu</h3>
<p>Chúng tôi cung cấp các khóa học chất lượng cao về AI, Fullstack Development và Vibe Coding - phương pháp lập trình hiện đại với sự hỗ trợ của trí tuệ nhân tạo. Học viên sẽ được học từ những chuyên gia hàng đầu với kinh nghiệm thực chiến tại các tập đoàn công nghệ lớn.</p>

<h3>Thư viện Template Google Sheets & Apps Script</h3>
<p>Tiết kiệm hàng trăm giờ làm việc với bộ sưu tập 100+ template chuyên nghiệp cho quản lý doanh nghiệp. Từ CRM, quản lý tồn kho, nhân sự đến kế toán - tất cả đều được tối ưu hóa và tự động hóa tối đa với Apps Script.</p>

<h3>Dịch vụ tư vấn và triển khai</h3>
<p>Đội ngũ chuyên gia của The Tulie Lab sẵn sàng tư vấn và triển khai các giải pháp công nghệ phù hợp với nhu cầu cụ thể của doanh nghiệp bạn. Chúng tôi không chỉ cung cấp công cụ mà còn đồng hành trong suốt quá trình chuyển đổi số.</p>

<h3>Cam kết của The Tulie Lab</h3>
<p>Chúng tôi cam kết mang đến giá trị thực tiễn thông qua đào tạo chất lượng, sản phẩm chuyên nghiệp và hỗ trợ tận tâm. Mỗi khóa học, mỗi template đều được thiết kế dựa trên kinh nghiệm thực tế và nhu cầu thực sự của thị trường Việt Nam.</p>

<h3>Liên hệ với chúng tôi</h3>
<p>Hãy để The Tulie Lab đồng hành cùng bạn trên con đường chuyển đổi số. Liên hệ ngay hôm nay để được tư vấn miễn phí và nhận ưu đãi đặc biệt dành cho doanh nghiệp.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800',
        isPublished: true,
        metaTitle: 'The Tulie Lab - Đào tạo & Chuyển đổi số | Khóa học AI, Templates',
        metaDescription: 'The Tulie Lab cung cấp khóa học AI, Fullstack Development, 100+ Template Google Sheets và dịch vụ tư vấn chuyển đổi số cho doanh nghiệp.',
        metaKeywords: 'The Tulie Lab, đào tạo công nghệ, chuyển đổi số, template google sheets, khóa học AI'
    },
    {
        title: 'Khóa học AI & Fullstack Development tại The Tulie Lab',
        slug: 'khoa-hoc-ai-fullstack-the-tulie-lab',
        excerpt: 'Chương trình đào tạo AI và Fullstack Development toàn diện, từ cơ bản đến nâng cao, phù hợp cho mọi trình độ.',
        content: `<h2>Khóa học công nghệ chất lượng cao tại The Tulie Lab</h2>
<p>The Tulie Lab tự hào là đơn vị đào tạo hàng đầu về công nghệ AI và phát triển phần mềm toàn diện. Với phương pháp giảng dạy hiện đại kết hợp lý thuyết và thực hành, chúng tôi cam kết giúp học viên thành thạo công nghệ một cách nhanh chóng và hiệu quả.</p>

<h3>Khóa học AI - Ứng dụng trí tuệ nhân tạo</h3>
<p>Học cách ứng dụng AI vào công việc thực tế: từ xử lý dữ liệu, xây dựng chatbot, đến tự động hóa quy trình làm việc. Khóa học phù hợp cho cả người mới bắt đầu và những ai muốn nâng cao kỹ năng AI.</p>

<h3>Fullstack Development - Trở thành lập trình viên toàn diện</h3>
<p>Nắm vững cả Frontend và Backend development với các công nghệ hot nhất: React, Next.js, Node.js, TypeScript, Prisma. Học viên sẽ xây dựng được ứng dụng web hoàn chỉnh ngay trong khóa học.</p>

<h3>Vibe Coding - Lập trình thời AI</h3>
<p>Học phương pháp lập trình mới nhất với sự hỗ trợ của AI tools như Cursor, GitHub Copilot. Phát triển ứng dụng nhanh gấp 5-10 lần so với phương pháp truyền thống mà vẫn đảm bảo chất lượng code.</p>

<h3>Lộ trình học tập cá nhân hóa</h3>
<p>Mỗi học viên được thiết kế lộ trình riêng dựa trên nền tảng kiến thức hiện tại và mục tiêu nghề nghiệp. Mentor 1-1 hỗ trợ trong suốt quá trình học và thực hành dự án thực tế.</p>

<h3>Chứng chỉ và cơ hội việc làm</h3>
<p>Hoàn thành khóa học, học viên nhận chứng chỉ chuyên nghiệp từ The Tulie Lab và được giới thiệu việc làm tại các công ty công nghệ hàng đầu. Tỷ lệ học viên có việc làm sau khóa học lên đến 95%.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800',
        isPublished: true,
        metaTitle: 'Khóa học AI, Fullstack Development | The Tulie Lab',
        metaDescription: 'Khóa học AI, Fullstack Development và Vibe Coding chất lượng cao. Học thực chiến, mentor 1-1, cam kết đầu ra.',
        metaKeywords: 'khóa học AI, fullstack development, vibe coding, học lập trình, đào tạo công nghệ'
    },
    {
        title: '100+ Template Google Sheets chuyên nghiệp cho doanh nghiệp',
        slug: 'template-google-sheets-chuyen-nghiep',
        excerpt: 'Bộ sưu tập template Google Sheets tự động hóa toàn diện: CRM, quản lý kho, nhân sự, kế toán và nhiều hơn nữa.',
        content: `<h2>Thư viện Template Google Sheets lớn nhất Việt Nam</h2>
<p>The Tulie Lab cung cấp bộ sưu tập hơn 100 template Google Sheets được thiết kế chuyên nghiệp, tích hợp Apps Script để tự động hóa tối đa quy trình làm việc. Tất cả đều sẵn sàng sử dụng ngay, tiết kiệm hàng trăm giờ phát triển.</p>

<h3>Template CRM - Quản lý khách hàng hiệu quả</h3>
<p>Hệ thống CRM đầy đủ tính năng: quản lý leads, tracking tương tác, pipeline bán hàng, báo cáo tự động. Tích hợp email notification và dashboard trực quan giúp team sales làm việc hiệu quả hơn 300%.</p>

<h3>Template quản lý kho - Inventory Management</h3>
<p>Giải pháp quản lý tồn kho thông minh với tính năng: nhập xuất kho tự động, cảnh báo hết hàng, báo cáo doanh thu theo sản phẩm. Phù hợp cho mọi quy mô từ shop nhỏ đến chuỗi bán lẻ.</p>

<h3>Template quản lý nhân sự - HR Management</h3>
<p>Quản lý toàn diện thông tin nhân viên, chấm công, tính lương, theo dõi phép và đánh giá KPI. Tự động gửi email thông báo và tổng hợp báo cáo hàng tháng.</p>

<h3>Template kế toán và tài chính</h3>
<p>Hệ thống kế toán hoàn chỉnh: sổ quỹ, công nợ, báo cáo tài chính, lập hóa đơn tự động. Tuân thủ chuẩn kế toán Việt Nam và dễ dàng kết nối với phần mềm kế toán khác.</p>

<h3>Template quản lý dự án - Project Management</h3>
<p>Công cụ quản lý dự án Agile/Scrum: task board, gantt chart, time tracking, resource planning. Dashboard real-time giúp quản lý nắm bắt tiến độ dự án mọi lúc mọi nơi.</p>

<h3>Gói thành viên Template Premium</h3>
<p>Chỉ với 1.990.000đ/năm, truy cập unlimited toàn bộ 100+ template, nhận update mới hàng tuần và hỗ trợ kỹ thuật ưu tiên. Tiết kiệm hơn 90% so với mua lẻ từng template.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800',
        isPublished: true,
        metaTitle: '100+ Template Google Sheets Pro | CRM, Kho, Nhân sự, Kế toán',
        metaDescription: 'Template Google Sheets chuyên nghiệp cho doanh nghiệp: CRM, quản lý kho, nhân sự, kế toán. Tự động hóa với Apps Script.',
        metaKeywords: 'template google sheets, CRM, quản lý kho, quản lý nhân sự, kế toán, apps script'
    },
    {
        title: 'Dịch vụ tư vấn chuyển đổi số và phát triển phần mềm',
        slug: 'dich-vu-tu-van-chuyen-doi-so',
        excerpt: 'The Tulie Lab cung cấp dịch vụ tư vấn chuyển đổi số toàn diện, phát triển phần mềm custom và tự động hóa quy trình.',
        content: `<h2>Giải pháp chuyển đổi số toàn diện cho doanh nghiệp</h2>
<p>Đội ngũ chuyên gia của The Tulie Lab với hơn 10 năm kinh nghiệm triển khai các dự án chuyển đổi số cho doanh nghiệp vừa và nhỏ. Chúng tôi hiểu rõ thách thức và cung cấp giải pháp phù hợp với từng ngành nghề.</p>

<h3>Tư vấn chiến lược chuyển đổi số</h3>
<p>Phân tích hiện trạng, xác định mục tiêu và lập roadmap chuyển đổi số chi tiết. Tư vấn lựa chọn công nghệ phù hợp, tối ưu ngân sách đầu tư và đo lường hiệu quả ROI.</p>

<h3>Phát triển phần mềm theo yêu cầu</h3>
<p>Xây dựng ứng dụng web/mobile custom 100% theo nhu cầu doanh nghiệp. Sử dụng công nghệ hiện đại: React, Next.js, Node.js, React Native. Cam kết tiến độ, chất lượng và bảo hành lâu dài.</p>

<h3>Tự động hóa quy trình làm việc</h3>
<p>Phân tích và tự động hóa các quy trình thủ công tốn thời gian: xử lý đơn hàng, gửi email, tổng hợp báo cáo. Tích hợp với các hệ thống hiện có như ERP, CRM, kế toán.</p>

<h3>Đào tạo và chuyển giao công nghệ</h3>
<p>Không chỉ triển khai mà còn đào tạo đội ngũ nội bộ sử dụng và maintain hệ thống. Documentation chi tiết và support 24/7 trong giai đoạn đầu vận hành.</p>

<h3>Gói dịch vụ VIP Support</h3>
<p>Dành cho doanh nghiệp cần hỗ trợ chuyên sâu: thiết kế custom template, setup automation riêng, tư vấn 1:1 qua Zoom. Ưu tiên hỗ trợ 24/7 và miễn phí training cho team.</p>

<h3>Case study thành công</h3>
<p>Đã triển khai thành công cho 200+ doanh nghiệp từ startup đến SME. Giúp tiết kiệm 40-60% chi phí vận hành và tăng 200% hiệu suất làm việc.</p>`,
        thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800',
        isPublished: true,
        metaTitle: 'Dịch vụ tư vấn chuyển đổi số | Phát triển phần mềm custom',
        metaDescription: 'Tư vấn chuyển đổi số, phát triển phần mềm custom, tự động hóa quy trình. Cam kết tiến độ, chất lượng.',
        metaKeywords: 'tư vấn chuyển đổi số, phát triển phần mềm, tự động hóa, digital transformation'
    },
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
