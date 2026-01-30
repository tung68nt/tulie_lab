import { Section } from '@/types/sections';
import Image from 'next/image';
import { DynamicIcon } from '@/components/DynamicIcon';
import { SectionBackground } from '../SectionBackground';
import { cn } from '@/lib/utils';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Course } from '@/types/api';
import { Card } from '@/components/Card';
import Link from 'next/link';

export function InstructorBioSection({ section }: { section: Section }) {
    // Expecting items[0] to be the main instructor data
    const instructor = section.items?.[0];
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

    return (
        <section className="py-20 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <SectionBackground
                    backgroundImage={section.backgroundImage}
                    backgroundTheme={section.backgroundTheme}
                    overlayOpacity={section.overlayOpacity}
                    showDotPattern={true}
                />
            </div>

            <div className="container relative z-10 px-6 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    {/* Visual - Vertical Portrait (2x3 aspect ratio) */}
                    <div className="lg:col-span-4 w-full md:w-2/3 lg:w-full mx-auto">
                        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
                            <Image
                                src={instructor.image || '/placeholder-avatar.jpg'}
                                alt={instructor.title || 'Instructor'}
                                fill
                                className="object-cover"
                            />
                            {/* Name Badge */}
                            <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-md px-5 py-4 rounded-2xl border shadow-sm">
                                <h3 className="text-lg font-semibold text-foreground">{instructor.title}</h3>
                                {instructor.subtitle && <p className="text-sm text-muted-foreground">{instructor.subtitle}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-8 flex flex-col justify-center space-y-10">
                        {/* Header Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                                    Giới thiệu giảng viên
                                </span>
                                <h2 className="text-3xl md:text-4xl font-normal text-foreground tracking-tight">
                                    {instructor.title}
                                </h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground font-light leading-relaxed">
                                <p>{String(instructor.description || '')}</p>
                            </div>
                        </div>

                        {/* Experience / Features */}
                        {instructor.features && Array.isArray(instructor.features) && instructor.features.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-normal text-foreground border-b pb-2 inline-block">Kinh nghiệm & Chức vụ</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {instructor.features.map((exp: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                            <span className="text-base text-muted-foreground">{exp}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Teaching Courses */}
                        {courses.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-normal text-foreground border-b pb-2 inline-block">Các khóa học đang giảng dạy</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {courses.map((course) => (
                                        <Link href={`/courses/${course.slug}`} key={course.id} className="group block">
                                            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                                                    {course.thumbnail ? (
                                                        <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-xs">IMG</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">{course.title}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1">{course.level || 'All Levels'}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {courses.length === 0 && !instructor.features && (
                            <div className="p-6 rounded-2xl bg-muted/30 border border-dashed text-center text-muted-foreground">
                                <p>Thông tin chi tiết về khóa học đang được cập nhật.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
