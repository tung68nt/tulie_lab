'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { InstructorDetailView } from '@/components/InstructorDetailView';

export default function InstructorsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ instructor: any, courses: any[] } | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch all instructors
                const list: any = await api.instructors.list();
                const instructors = Array.isArray(list) ? list : (list as any).instructors || [];

                if (instructors.length > 0) {
                    // Start: Requirement "Only Nguyen Thanh Tung page"
                    // Try to find by name "Tùng" or "Founder", fallback to first one.
                    const founder = instructors.find((i: any) =>
                        (i.name && i.name.toLowerCase().includes('tùng')) ||
                        (i.title && i.title.toLowerCase().includes('founder'))
                    ) || instructors[0];

                    // Fetch detail for this instructor
                    const [detail, allCourses]: any = await Promise.all([
                        api.instructors.get(founder.id),
                        api.courses.list()
                    ]);

                    // Filter courses
                    const courseList = Array.isArray(allCourses) ? allCourses : (allCourses as any).courses || [];
                    const filteredCourses = courseList.filter((c: any) => c.instructorId === founder.id && c.isPublished);

                    setData({
                        instructor: detail,
                        courses: filteredCourses
                    });
                }
            } catch (e) {
                console.error("Failed to load instructor", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Đội ngũ giảng viên đang được cập nhật</h1>
                <p className="text-muted-foreground">Vui lòng quay lại sau.</p>
            </div>
        );
    }

    return <InstructorDetailView instructor={data.instructor} courses={data.courses} />;
}
