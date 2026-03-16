'use client';
import { Loader2 } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { InstructorDetailView } from '@/components/InstructorDetailView';

export default function InstructorPage() {
    const params = useParams();
    const instructorSlug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [instructor, setInstructor] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try fetching by slug first, fallback to ID if it's a UUID
                let instructorData;
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(instructorSlug);

                if (isUuid) {
                    instructorData = await api.instructors.get(instructorSlug);
                } else {
                    instructorData = await api.instructors.getBySlug(instructorSlug);
                }

                const [allCourses]: any = await Promise.all([
                    api.courses.list()
                ]);

                setInstructor(instructorData);
                const courseList = Array.isArray(allCourses) ? allCourses : (allCourses as any).courses || [];
                setCourses(courseList.filter((c: any) => c.instructorId === instructorData?.id && c.isPublished));
            } catch (e) {
                console.error('Error loading instructor:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [instructorSlug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-8 h-8 rounded-full border-3 border-border border-t-primary animate-spin" style={{ animationDuration: '0.6s' }} />
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
