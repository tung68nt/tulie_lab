import { Section } from '@/types/sections';
import Image from 'next/image';
import { DynamicIcon } from '@/components/DynamicIcon';
import { SectionBackground } from '../SectionBackground';
import { cn } from '@/lib/utils';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Course } from '@/types/api';

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
        <section className="py-20 bg-zinc-950 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            </div>

            <div className="container relative z-10 px-4 mx-auto max-w-5xl">
                {/* Main Profile Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/20 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-inner">
                                {instructor.image ? (
                                    <Image
                                        src={String(instructor.image)}
                                        alt={String(instructor.title || 'Instructor')}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-zinc-300">
                                        {String(instructor.title || 'I').charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] md:text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                                    {String(instructor.subtitle || 'Expert Instructor')}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
                                    {String(instructor.title || '')}
                                </h1>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-12 pt-2 text-zinc-900 dark:text-zinc-100">
                                <div className="space-y-1">
                                    <p className="text-2xl md:text-3xl font-bold">{courses.length}</p>
                                    <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Khóa học</p>
                                </div>
                                <div className="border-r border-zinc-100 dark:border-zinc-800 h-10 self-center hidden md:block" />
                                <div className="space-y-1">
                                    <p className="text-2xl md:text-3xl font-bold">{String(instructor.studentCount || 0)}</p>
                                    <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Học viên</p>
                                </div>
                                <div className="border-r border-zinc-100 dark:border-zinc-800 h-10 self-center hidden md:block" />
                                <div className="space-y-1">
                                    <p className="text-2xl md:text-3xl font-bold">4.9/5</p>
                                    <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Đánh giá</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description & Courses */}
                <div className="mt-20 space-y-16">
                    {/* Bio */}
                    {instructor.description && (
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="prose prose-lg dark:prose-invert mx-auto text-zinc-400 leading-relaxed font-light">
                                <p>{String(instructor.description)}</p>
                            </div>
                        </div>
                    )}

                    {/* Courses Grid */}
                    {courses.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-bold text-white tracking-tight">Khóa học đang giảng dạy</h3>
                                <div className="h-px flex-1 bg-zinc-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <Link href={`/courses/${course.slug}`} key={course.id} className="group block h-full">
                                        <div className="relative h-full bg-zinc-900 rounded-3xl p-2 border border-zinc-800 hover:border-zinc-700 transition-all hover:translate-y-[-4px]">
                                            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-800">
                                                {course.thumbnail ? (
                                                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold text-xs">IMG</div>
                                                )}
                                            </div>
                                            <div className="p-4 space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                                                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">{String(course.level || 'All Levels')}</span>
                                                    <span>•</span>
                                                    <span>{course.lessonsCount || 0} bài học</span>
                                                </div>
                                                <h4 className="font-bold text-lg text-zinc-100 group-hover:text-white transition-colors line-clamp-2 leading-snug">{course.title}</h4>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
