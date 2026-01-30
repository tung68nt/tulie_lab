'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Instructor, Course } from '@/types/api';
import { InstructorDetailView } from '@/components/InstructorDetailView';
import { LoadingSpinner } from '@/components/LoadingSpinner'; // Assuming this exists or using a fallback

export default function InstructorPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ instructor: Instructor; courses: Course[] } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [instructor, courses] = await Promise.all([
                    api.instructors.get(id as string),
                    api.courses.list({ instructorId: id as string })
                ]);
                setData({ instructor, courses });
            } catch (error) {
                console.error('Failed to fetch instructor data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                Giảng viên không tồn tại hoặc có lỗi xảy ra.
            </div>
        );
    }

    return <InstructorDetailView instructor={data.instructor} courses={data.courses} />;
}
