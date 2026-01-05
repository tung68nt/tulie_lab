'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { InstructorDetailView } from '@/components/InstructorDetailView';

export default function InstructorPage() {
    const params = useParams();
    const instructorId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [instructor, setInstructor] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [instructorData, allCourses]: any = await Promise.all([
                    api.instructors.get(instructorId),
                    api.courses.list()
                ]);

                setInstructor(instructorData);
                const courseList = Array.isArray(allCourses) ? allCourses : (allCourses as any).courses || [];
                setCourses(courseList.filter((c: any) => c.instructorId === instructorId && c.isPublished));
            } catch (e) {
                console.error('Error loading instructor:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [instructorId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!instructor) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy giảng viên</h1>
                <Link href="/instructors">
                    <Button>Quay lại danh sách giảng viên</Button>
                </Link>
            </div>
        );
    }

    return <InstructorDetailView instructor={instructor} courses={courses} />;
}
