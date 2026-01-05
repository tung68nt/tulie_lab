import { Section } from '@/types/sections';

const studentProjects = [
    {
        title: "TaskFlow - Quản lý công việc",
        student: "Nguyễn Minh Tuấn",
        description: "Ứng dụng quản lý task với drag-drop, real-time sync giữa các thành viên team.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
        tech: ["React", "Node.js", "Socket.io"]
    },
    {
        title: "FoodieApp - Đặt đồ ăn",
        student: "Trần Hoàng Anh",
        description: "Ứng dụng đặt đồ ăn với tích hợp thanh toán và theo dõi đơn hàng real-time.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
        tech: ["React Native", "Firebase", "Stripe"]
    },
    {
        title: "LearnHub - LMS Platform",
        student: "Phạm Thị Lan",
        description: "Nền tảng học trực tuyến với video streaming, quiz và chứng chỉ tự động.",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
        tech: ["Next.js", "PostgreSQL", "AWS"]
    },
    {
        title: "HealthTrack - Theo dõi sức khỏe",
        student: "Lê Văn Đức",
        description: "App theo dõi sức khỏe tích hợp AI để phân tích và đưa ra lời khuyên.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
        tech: ["Flutter", "Python", "TensorFlow"]
    }
];

export const StudentProjectsSection = ({ section }: { section: Section }) => {
    return (
        <section className="py-12 md:py-16 bg-background">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        Showcase thành viên
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {section.title || "Sản phẩm thành viên đã làm được"}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {section.subtitle || "Xem những ứng dụng thực tế mà thành viên đã xây dựng sau workshop"}
                    </p>
                </div>

                {/* Projects grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {studentProjects.map((project, index) => (
                        <div
                            key={index}
                            className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            {/* Project image */}
                            <div className="aspect-video overflow-hidden bg-muted">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Bởi <span className="font-medium text-foreground">{project.student}</span>
                                </p>
                                <p className="text-muted-foreground mb-4">
                                    {project.description}
                                </p>

                                {/* Tech tags */}
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-muted rounded-full text-xs font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Screen share / Demo call section */}
                <div className="mt-16 bg-foreground text-background rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.1)_35%,rgba(255,255,255,0.1)_65%,transparent_65%)] bg-[length:20px_20px]"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background/10 mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-3">
                                Demo & Chia sẻ màn hình
                            </h3>
                            <p className="text-background/70 max-w-xl mx-auto">
                                Tham gia các buổi demo hàng tuần để xem học viên trình bày dự án,
                                nhận feedback từ mentor và kết nối với cộng đồng thành viên.
                            </p>
                        </div>

                        {/* Features grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-background/10 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold mb-2">Thứ 7</div>
                                <div className="text-sm text-background/70">Mỗi tuần vào thứ 7</div>
                                <div className="text-xs text-background/50 mt-1">20:00 - 22:00</div>
                            </div>
                            <div className="bg-background/10 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold mb-2">100%</div>
                                <div className="text-sm text-background/70">Miễn phí cho thành viên</div>
                                <div className="text-xs text-background/50 mt-1">Không giới hạn số lần tham gia</div>
                            </div>
                            <div className="bg-background/10 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold mb-2">Live</div>
                                <div className="text-sm text-background/70">Qua Zoom/Google Meet</div>
                                <div className="text-xs text-background/50 mt-1">Recording có sẵn sau buổi học</div>
                            </div>
                        </div>

                        {/* What you get */}
                        <div className="bg-background/5 rounded-xl p-6 md:p-8">
                            <h4 className="font-semibold mb-4 text-center">Bạn sẽ nhận được:</h4>
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Demo dự án thực tế từ học viên</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Feedback trực tiếp từ mentor</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Hỏi đáp Q&A trực tiếp</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Networking với cộng đồng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
