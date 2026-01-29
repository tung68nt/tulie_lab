import Link from 'next/link';
import { Card, CardContent } from '@/components/Card';
import { BottomCTA } from '@/components/BottomCTA';
import { Users, BookOpen, Briefcase, Building2, GraduationCap, Award } from 'lucide-react';
import { Instructor, Course } from '@/types/api';

interface InstructorDetailViewProps {
    instructor: Instructor;
    courses: Course[];
}

export function InstructorDetailView({ instructor, courses }: InstructorDetailViewProps) {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Modern Monochrome Banner */}
            <div className="relative h-[280px] md:h-[320px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-zinc-950">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-dot-white [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
                </div>
                {/* Decorative Elements - Subtle Monochrome Glows */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-zinc-800/50 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-zinc-800/50 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Profile Info Container */}
            <div className="container px-4 relative -mt-32 md:-mt-40 z-10">
                <div className="bg-card shadow-2xl rounded-2xl p-6 md:p-10 overflow-hidden relative group">

                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left">
                        {/* Avatar */}
                        <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] p-1.5 bg-gradient-to-br from-zinc-200 to-zinc-400 dark:from-zinc-800 dark:to-zinc-600 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-300">
                                <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-background border-4 border-background relative">
                                    {instructor.avatar ? (
                                        <img
                                            src={instructor.avatar}
                                            alt={instructor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-5xl font-bold">
                                            {instructor.name?.charAt(0) || 'G'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap border border-background">
                                Expert Instructor
                            </div>
                        </div>

                        {/* Info Content */}
                        <div className="flex-1 pt-4">
                            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight text-foreground">
                                {instructor.name}
                            </h1>
                            {instructor.title && (
                                <p className="text-lg md:text-xl text-muted-foreground font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
                                    <Award className="w-5 h-5" />
                                    {instructor.title}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-8">
                                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-secondary/50 border border-border/50">
                                    <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-xl leading-none">{instructor.courseCount}</div>
                                        <div className="text-xs text-muted-foreground font-bold tracking-wider mt-1">Khóa học</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-secondary/50 border border-border/50">
                                    <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-xl leading-none">
                                            {(instructor.studentCount || 0) > 0 ? `${instructor.studentCount}+` : 0}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-bold tracking-wider mt-1">Học viên</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout: Bio First -> Then Courses */}
                <div className="mt-16 container px-0 space-y-16">

                    {/* 1. Introduction & Bio Section */}
                    {instructor.bio && (
                        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex items-center gap-4 mb-8 border-b pb-4">
                                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">Về giảng viên</h2>
                            </div>

                            <div className="flex flex-col gap-8">
                                <div className="w-full bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
                                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap font-light">
                                        {instructor.bio}
                                    </div>
                                </div>

                                {/* Experience Column/Box */}
                                {instructor.experiences && instructor.experiences.length > 0 && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold tracking-wider text-muted-foreground ml-1">Kinh nghiệm</h3>
                                        <div className="space-y-4">
                                            {instructor.experiences.map((exp: any) => (
                                                <div key={exp.id} className="bg-muted/30 border border-border/50 rounded-2xl p-5 hover:bg-card hover:shadow-md transition-all duration-300 group">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-foreground transition-colors">
                                                            {(!exp.icon || exp.icon === 'building') && <Building2 className="w-5 h-5" />}
                                                            {exp.icon === 'school' && <GraduationCap className="w-5 h-5" />}
                                                            {exp.icon === 'users' && <Users className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-base group-hover:underline decoration-1 underline-offset-4">{exp.company}</h3>
                                                            <p className="text-sm text-muted-foreground font-medium mb-1">{exp.position}</p>
                                                            {exp.period && (
                                                                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-foreground text-background inline-block mt-1">
                                                                    {exp.period}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* 2. Courses Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                        <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">Khóa học đang giảng dạy</h2>
                            </div>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course) => (
                                <Link key={course.id} href={`/courses/${course.slug}`} className="group h-full">
                                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full border-border/50 group-hover:border-foreground/20 bg-card rounded-[2rem] flex flex-col">
                                        {course.thumbnail && (
                                            <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 text-black text-xs font-bold backdrop-blur-sm">
                                                        {course.lessons?.length || 0} bài học
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <CardContent className="p-6 flex flex-col flex-1">
                                            <h3 className="font-bold text-xl mb-3 line-clamp-2 mt-1 group-hover:underline decoration-2 underline-offset-4">{course.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed flex-1">
                                                {course.description}
                                            </p>
                                            <div className="pt-4 mt-auto border-t border-border/50 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-xs font-bold text-muted-foreground tracking-wider">Đang tuyển sinh</span>
                                                </div>
                                                <span className="font-black text-lg">
                                                    {course.price === 0
                                                        ? 'Miễn phí'
                                                        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 0)
                                                    }
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>

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
