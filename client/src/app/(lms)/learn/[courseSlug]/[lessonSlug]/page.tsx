import { serverApi } from '@/lib/server-api';
import { LearnClient } from './LearnClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';

interface LearnPageProps {
    params: Promise<{
        courseSlug: string;
        lessonSlug: string;
    }>;
}

export default async function LearnPage({ params }: LearnPageProps) {
    // Await params (Next.js 15 async params)
    const { courseSlug, lessonSlug } = await params;

    // Fetch course data on server (SSR - fast, no auth needed for metadata)
    const course = await serverApi.courses.get(courseSlug);

    if (!course) {
        return (
            <div className="min-h-screen bg-muted/20 overflow-visible pt-14">
                <div className="mx-auto max-w-[1200px] min-h-screen bg-background border-l border-r border-border relative overflow-visible shadow-sm flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold">Không tìm thấy khóa học</h1>
                    <Link href="/courses"><Button as="div">Xem tất cả khóa học</Button></Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 overflow-visible pt-14">
            {/* Boxed Container - matches navbar container width (1200px) */}
            <div className="mx-auto max-w-[1200px] min-h-screen bg-background border-l border-r border-border relative overflow-visible shadow-sm">
                {/* Extend borders up to navbar */}
                <div className="absolute -top-16 left-[-1px] w-px h-16 bg-border hidden md:block"></div>
                <div className="absolute -top-16 right-[-1px] w-px h-16 bg-border hidden md:block"></div>

                {/* Client Component handles auth, secure content, and interactivity */}
                <LearnClient
                    course={course}
                    lessonSlug={lessonSlug}
                    courseSlug={courseSlug}
                />
            </div>
        </div>
    );
}
