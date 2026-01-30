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
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
            {/* Clean Header Area */}
            <div className="h-48 md:h-64 bg-zinc-900 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-dot-white/[0.1] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
            </div>

            {/* Profile Card Container */}
            <div className="container max-w-6xl px-4 relative -mt-24 md:-mt-32 z-10">
                <div className="bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-12">
                    <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center md:items-start text-center md:text-left">
                        {/* Avatar - Large & Modern */}
                        <div className="relative shrink-0">
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] overflow-hidden border-8 border-white dark:border-zinc-900 shadow-2xl">
                                {instructor.avatar ? (
                                    <img
                                        src={instructor.avatar}
                                        alt={instructor?.name || 'Instructor'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-6xl font-bold">
                                        {instructor?.name?.charAt(0) || 'G'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Content */}
                        <div className="flex-1 pt-4">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                                Expert Instructor
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-white">
                                {instructor?.name || 'Đang tải...'}
                            </h1>
                            {instructor.title && (
                                <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium mb-8">
                                    {instructor.title}
                                </p>
                            )}

                            {/* Stats Grid */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-10">
                                <div className="flex flex-col">
                                    <span className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">{instructor.courseCount || 0}</span>
                                    <span className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mt-1">Khóa học</span>
                                </div>
                                <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>
                                <div className="flex flex-col">
                                    <span className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
                                        {instructor.studentCount && instructor.studentCount > 0 ? `${instructor.studentCount.toLocaleString()}+` : 0}
                                    </span>
                                    <span className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mt-1">Học viên</span>
                                </div>
                                <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>
                                <div className="flex flex-col">
                                    <span className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">4.9/5</span>
                                    <span className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mt-1">Đánh giá</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    {instructor.bio && (
                        <div className="mt-16 pt-16 border-t border-zinc-100 dark:border-zinc-800">
                            <h2 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white flex items-center gap-3">
                                <GraduationCap className="w-7 h-7 text-primary" />
                                Về giảng viên
                            </h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                                {instructor.bio}
                            </div>
                        </div>
                    )}
                </div>

                {/* Courses Section */}
                <div className="mt-24">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Khóa học đang giảng dạy</h2>
                        <div className="h-1 flex-1 mx-8 bg-zinc-100 dark:bg-zinc-900 rounded-full hidden md:block"></div>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <Link key={course.id} href={`/courses/${course.slug}`} className="group">
                                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                    {course.thumbnail && (
                                        <div className="aspect-[16/10] overflow-hidden">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    )}
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                {course.lessons?.length || 0} bài học
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-xl mb-4 text-zinc-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 mb-8 leading-relaxed">
                                            {course.description}
                                        </p>
                                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                            <span className="text-sm font-bold text-green-500">Đang tuyển sinh</span>
                                            <span className="font-bold text-lg text-zinc-900 dark:text-white">
                                                {course.price === 0
                                                    ? 'Miễn phí'
                                                    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(course.price || 0)
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
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
