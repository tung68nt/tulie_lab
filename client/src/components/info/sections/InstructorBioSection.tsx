'use client';
import { Section } from '@/types/sections';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { api, getMediaUrl } from '@/lib/api';
import { Course, Instructor } from '@/types/api';
import Link from 'next/link';
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
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/Button';

export function InstructorBioSection({ section }: { section: Section }) {
    // Expecting items[0] to be the main instructor data
    // Cast to unknown first then Instructor to avoid intersection issues if types don't overlap perfectly
    const instructor = section.items?.[0] as unknown as Instructor;
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (instructor?.id) {
                try {
                    const res: any = await api.courses.list();
                    const allCourses = Array.isArray(res) ? res : res.data || [];
                    const instructorCourses = allCourses.filter((c: any) =>
                        c.instructorId === instructor.id && c.isPublished
                    );
                    setCourses(instructorCourses);
                } catch (error) {
                    console.error('Failed to fetch instructor courses', error);
                }
            }
        };
        fetchCourses();
    }, [instructor?.id]);

    if (!instructor) return null;

    // Mock/Derived data for the "Information" box
    const stats = [
        {
            icon: <Briefcase size={16} />,
            label: "Kinh nghiệm",
            value: "10+ năm"
        },
        {
            icon: <GraduationCap size={16} />,
            label: "Học viên",
            value: instructor.studentCount ? `${instructor.studentCount}+` : "5,000+"
        },
        {
            icon: <FolderGit2 size={16} />,
            label: "Dự án",
            value: "120+"
        },
        {
            icon: <Languages size={16} />,
            label: "Ngôn ngữ",
            value: "Việt, Anh"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Background Pattern - Subtle */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
            </div>

            <div className="container relative z-10 mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] uppercase font-bold tracking-widest">
                        Instructor
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                        Giảng viên
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Đội ngũ chuyên gia giàu kinh nghiệm thực chiến trong lĩnh vực AI & Automation.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Sidebar - Sticky */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
                        {/* Profile Card - Magazine Style */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 md:p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                            {/* Large Circular Avatar */}
                            <div className="relative w-48 h-48 mx-auto mb-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-zinc-100 dark:ring-zinc-800 shadow-2xl">
                                    {instructor.image ? (
                                        <Image
                                            src={getMediaUrl(String(instructor.image))}
                                            alt={String(instructor.title || 'Instructor')}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 text-5xl font-bold text-zinc-400">
                                            {String(instructor.name || 'I').charAt(0)}
                                        </div>
                                    )}
                                </div>
                                {/* Online Status Dot */}
                                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-zinc-900 shadow-md" />
                            </div>

                            {/* Name & Title */}
                            <div className="text-center mb-8">
                                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
                                    {String(instructor.name || 'Instructor Name')}
                                </h3>
                                <p className="text-primary font-semibold text-sm uppercase tracking-widest">
                                    {String(instructor.title || 'Expert Instructor')}
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center justify-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                <Button size="icon" variant="ghost" className="rounded-full w-11 h-11 bg-zinc-50 dark:bg-zinc-800 hover:bg-primary hover:text-white transition-all">
                                    <Globe size={18} />
                                </Button>
                                <Button size="icon" variant="ghost" className="rounded-full w-11 h-11 bg-zinc-50 dark:bg-zinc-800 hover:bg-primary hover:text-white transition-all">
                                    <Mail size={18} />
                                </Button>
                                <Button size="icon" variant="ghost" className="rounded-full w-11 h-11 bg-zinc-50 dark:bg-zinc-800 hover:bg-primary hover:text-white transition-all">
                                    <Share2 size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
                                <Info size={14} />
                                <span>Thông tin</span>
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
                            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                <p>{String(instructor.description || instructor.bio || "Chưa có thông tin giới thiệu.")}</p>
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-foreground">Kinh nghiệm làm việc</h3>
                            {instructor.experiences && instructor.experiences.length > 0 ? (
                                <div className="space-y-6">
                                    {instructor.experiences.map((exp: any, idx: number) => (
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
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                            <i className="text-xl">🏢</i>
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
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                            <i className="text-xl">⚡</i>
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
                                    <h3 className="text-2xl font-bold text-foreground">Khoá học liên quan</h3>
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
                                                        <span className="bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
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
                                                                <span>12h 45m</span>
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
        </section>
    );
}

// Icon helper components to fix missing imports in the code block above
function Clock({ className }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>; }
function User({ className }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>; }
