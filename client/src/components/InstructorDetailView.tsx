import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Instructor, Course } from '@/types/api';
import { getMediaUrl } from '@/lib/api';
import {
    Globe,
    Mail,
    Share2,
    Info,
    Briefcase,
    GraduationCap,
    FolderGit2,
    Languages,
    Building2,
    ChevronRight,
    ArrowRight,
    User,
    Clock,
    Zap
} from 'lucide-react';
import { Button } from '@/components/Button';
import { BottomCTA } from '@/components/BottomCTA';

import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { Section } from '@/types/sections';
import { SectionBackground } from '@/components/info/SectionBackground';

interface InstructorDetailViewProps {
    instructor: Instructor;
    courses: Course[];
}

export function InstructorDetailView({ instructor, courses }: InstructorDetailViewProps) {
    // Parse bio and metadata
    // Parse bio and metadata
    const rawBio = String(instructor.bio || instructor.description || "");
    const [bioText, metadataText] = rawBio.split('--').map(part => part.trim());

    // Helper to extract value from metadata text
    const getMetadataValue = (key: string) => {
        if (!metadataText) return null;
        const match = metadataText.match(new RegExp(`${key}:\\s*(.+)`, 'i'));
        return match ? match[1].trim() : null;
    };

    const experience = getMetadataValue('Kinh nghiệm');
    const students = getMetadataValue('Học viên');
    const projects = getMetadataValue('Dự án');
    const languages = getMetadataValue('Ngôn ngữ');

    // Social links
    const webLink = getMetadataValue('Web');
    const emailLink = getMetadataValue('Email');
    const linkedinLink = getMetadataValue('Linkedin'); // Corrected key to match user input "Linkedin"
    const githubLink = getMetadataValue('Github'); // Added just in case
    const twitterLink = getMetadataValue('Twitter'); // Added just in case
    const facebookLink = getMetadataValue('Facebook'); // Added just in case

    // Mock/Derived data for the "Information" box
    const stats = [
        {
            icon: <Briefcase size={16} />,
            label: "Kinh nghiệm",
            value: experience || "10+ năm"
        },
        {
            icon: <GraduationCap size={16} />,
            label: "Học viên",
            value: students || (instructor.studentCount ? `${instructor.studentCount}+` : "5,000+")
        },
        {
            icon: <FolderGit2 size={16} />,
            label: "Dự án",
            value: projects || (instructor.courseCount ? `${instructor.courseCount}+` : "120+")
        },
        {
            icon: <Languages size={16} />,
            label: "Ngôn ngữ",
            value: languages || "Việt, Anh"
        }
    ];

    const avatarUrl = instructor.avatar || instructor.image;

    // Construct mock section data for StandardSectionHeader
    const sectionData: Partial<Section> = {
        title: "Giảng viên",
        subtitle: "Đội ngũ chuyên gia giàu kinh nghiệm thực chiến trong lĩnh vực AI & Automation.",
        tag: "Instructor",
        backgroundTheme: 'light' // Ensure light theme styles
    };

    return (
        <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
            <SectionBackground showDotPattern={true} backgroundTheme="light" />
            <div className="container relative z-10 mx-auto max-w-7xl pt-12 px-4 pb-24">
                <div className="max-w-3xl mx-auto mb-16 md:mb-24 relative z-10">
                    <StandardSectionHeader
                        section={sectionData}
                        align="center"
                        titleOverride="Giảng viên"
                        subtitleOverride="Đội ngũ chuyên gia giàu kinh nghiệm thực chiến trong lĩnh vực AI & Automation."
                        tagOverride="Instructor"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Sidebar - Sticky */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
                        {/* Profile Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 text-center border border-zinc-100 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
                            <div className="relative w-40 h-40 mx-auto mb-6 rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                {avatarUrl ? (
                                    <Image
                                        src={getMediaUrl(String(avatarUrl))}
                                        alt={String(instructor.title || 'Instructor')}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-zinc-300">
                                        {String(instructor.name || 'I').charAt(0)}
                                    </div>
                                )}
                                {/* Online Status Dot */}
                                <div className="absolute bottom-3 right-3 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm" />
                            </div>

                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                {String(instructor.name || 'Instructor Name')}
                            </h1>
                            <p className="text-primary font-medium mb-6">
                                {String(instructor.title || 'Expert Instructor')}
                            </p>

                            <div className="flex items-center justify-center gap-3">
                                {webLink && (
                                    <Link href={webLink} target="_blank" rel="noopener noreferrer">
                                        <Button size="icon" variant="ghost" className="rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                                            <Globe size={18} />
                                        </Button>
                                    </Link>
                                )}
                                {emailLink && (
                                    <Link href={`mailto:${emailLink}`}>
                                        <Button size="icon" variant="ghost" className="rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                                            <Mail size={18} />
                                        </Button>
                                    </Link>
                                )}
                                {linkedinLink && (
                                    <Link href={linkedinLink} target="_blank" rel="noopener noreferrer">
                                        <Button size="icon" variant="ghost" className="rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                                            <Share2 size={18} />
                                        </Button>
                                    </Link>
                                )}
                                {!webLink && !emailLink && !linkedinLink && (
                                    <div className="h-10"></div> // Placeholder height if no links
                                )}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Info size={20} />
                                </div>
                                <span className="text-xl font-bold text-foreground">Thông tin</span>
                            </div>
                            <div className="space-y-5">
                                {stats.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3 text-zinc-500 font-medium">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                        <span className="font-bold text-foreground">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Bio */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-foreground">Giới thiệu</h3>
                            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                <p>{bioText || "Chưa có thông tin giới thiệu."}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-foreground">Kinh nghiệm làm việc</h3>
                            {(instructor.experiences?.length ?? 0) > 0 ? (
                                <div className="space-y-6">
                                    {instructor.experiences?.map((exp: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 p-6 rounded-3xl hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 transition-all group">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-500 group-hover:text-primary transition-colors">
                                                <Building2 size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-foreground text-lg">{exp.position}</h4>
                                                <div className="text-sm font-medium text-zinc-500">{exp.period || '2020 - Hiện tại'}</div>
                                                <p className="text-muted-foreground leading-relaxed text-sm pt-2">
                                                    {exp.company}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (

                                // Fallback/Mock Data if no experiences
                                <div className="space-y-6">
                                    <div className="flex gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-foreground">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-lg">Senior AI Engineer - TechFlow Global</h4>
                                            <p className="text-xs font-semibold text-zinc-400 mb-2">2020 - Hiện tại</p>
                                            <p className="text-muted-foreground text-sm">
                                                Dẫn dắt đội ngũ phát triển các giải pháp tự động hóa quy trình nghiệp vụ sử dụng LLMs và RAG cho các doanh nghiệp Fortune 500.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-foreground">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-lg">Fullstack Developer - Creative Cloud</h4>
                                            <p className="text-xs font-semibold text-zinc-400 mb-2">2016 - 2020</p>
                                            <p className="text-muted-foreground text-sm">
                                                Xây dựng hệ thống quản lý dữ liệu lớn và các ứng dụng web quy mô lớn sử dụng React và Python.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Related Courses */}
                        {courses.length > 0 && (
                            <div className="space-y-8 pt-8 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-foreground">Khoá học đang giảng dạy</h3>
                                    <Link href="/courses" className="text-sm font-semibold text-zinc-500 hover:text-primary flex items-center gap-1 transition-colors">
                                        Xem tất cả <ChevronRight size={14} />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courses.map((course) => (
                                        <Link href={`/courses/${course.slug}`} key={course.id} className="group">
                                            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 transition-all duration-500">
                                                <div className="aspect-[16/9] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                                    {course.thumbnail ? (
                                                        <Image src={course.thumbnail} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-300">IMG</div>
                                                    )}

                                                    {/* Badge Overlay */}
                                                    <div className="absolute top-4 left-4">
                                                        <span className="bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm">
                                                            Phổ biến
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 md:p-8">
                                                    <h4 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                        {course.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                                                        {course.description || "Làm chủ kỹ nguyên AI bằng cách học cách cộng tác hiệu quả với các công cụ lập trình AI..."}
                                                    </p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
                                                        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500">
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{course.lessonsCount || 12} bài học</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <User className="w-4 h-4" />
                                                                <span>1.2k</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                            Xem thêm <ArrowRight size={12} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <BottomCTA
                title="Học hỏi từ chuyên gia hàng đầu"
                subtitle="Đăng ký ngay để được trực tiếp dẫn dắt bởi những giảng viên giàu kinh nghiệm."
                buttonText="Xem tất cả khóa học"
                buttonHref="/courses"
            />
        </div>
    );
}
