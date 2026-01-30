'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/types/sections';
import { api } from '@/lib/api';
import { Course, ApiResponse } from '@/types/api';
import { CourseCard } from '@/components/CourseCard';
import { CourseFilter } from '@/components/CourseFilter';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { SectionBackground } from '../SectionBackground';
import { DynamicIcon } from '@/components/DynamicIcon';


interface SystemCoursesSectionProps {
    section: Section;
}

function SystemCoursesContent() {
    const searchParams = useSearchParams();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                // Convert searchParams to an object
                const params: Record<string, string> = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });

                const res = await api.courses.list(params) as ApiResponse<Course[]>;
                setCourses(res.data || []);
            } catch (e) {
                console.error("Failed to fetch courses", e);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [searchParams]);

    return (
        <FadeIn direction="up" delay={0.4} duration={0.6}>
            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Sidebar Filter */}
                <CourseFilter />

                {/* Course Grid */}
                <main className="flex-1">
                    {loading ? (
                        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse space-y-4">
                                    <div className="aspect-video bg-muted rounded-3xl" />
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                            {courses.map((course: Course) => (
                                <CourseCard key={course.id} {...course} description={course.description || ''} price={Number(course.price || 0)} originalPrice={course.compareAtPrice ? Number(course.compareAtPrice) : 0} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-muted/10">
                            <h3 className="text-2xl font-bold mb-3 text-muted-foreground">Trống trải quá...</h3>
                            <p className="text-muted-foreground mb-8">Chúng tôi chưa tìm thấy khóa học nào phù hợp với bộ lọc này.</p>
                        </div>
                    )}
                </main>
            </div>
        </FadeIn>
    );
}

export const SystemCoursesSection: React.FC<SystemCoursesSectionProps> = ({ section }) => {
    return (
        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <Suspense fallback={<div>Loading courses...</div>}>
                    <SystemCoursesContent />
                </Suspense>
            </div>
        </section>
    );
};
