import { CourseCard } from '@/components/CourseCard';
import { BottomCTA } from '@/components/BottomCTA';
import { api } from '@/lib/api';
import { CourseFilter } from '@/components/CourseFilter';

async function getCourses(params?: any) {
    try {
        const courses = await api.courses.list(params) as any[];
        return courses;
    } catch (e) {
        console.error("Failed to fetch courses", e);
        return [];
    }
}

export default async function CoursesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const courses = await getCourses(params);

    return (
        <>
            <div className="container py-8 md:py-16 pb-20 md:pb-32">
                {/* Header */}
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Bắt đầu học ngay
                    </div>
                    <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                        Tất cả khóa học
                    </h1>
                    <p className="max-w-[700px] text-xl text-muted-foreground leading-relaxed">
                        Khám phá các khóa học chất lượng cao của chúng tôi và bắt đầu hành trình của bạn.
                    </p>
                </div>

                {/* Main content with sidebar */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filter */}
                    <CourseFilter />

                    {/* Course Grid */}
                    <div className="flex-1">
                        {courses.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                                {courses.map((course: any) => (
                                    <CourseCard key={course.id} {...course} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                Không tìm thấy khóa học nào phù hợp với bộ lọc.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <BottomCTA />
        </>
    );
}
