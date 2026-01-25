import { CourseCard } from '@/components/CourseCard';
import { BottomCTA } from '@/components/BottomCTA';
import { api } from '@/lib/api';
import { CourseFilter } from '@/components/CourseFilter';
import { SectionTag } from '@/components/SectionTag';

async function getCourses(params?: any) {
    try {
        const res: any = await api.courses.list(params);
        return res.data || [];
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
            <div className="container pt-12 md:pt-16 pb-20 md:pb-32">
                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <SectionTag>
                        Bắt đầu học ngay
                    </SectionTag>
                    <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl mb-4">
                        Tất cả khóa học
                    </h1>
                    <p className="max-w-[700px] text-xl text-muted-foreground leading-relaxed">
                        Khám phá các khóa học chất lượng cao của chúng tôi và bắt đầu hành trình của bạn.
                    </p>
                </div>

                {/* Main content with sidebar */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filter */}
                    <CourseFilter />

                    {/* Course Grid */}
                    <main className="flex-1">
                        {courses.length > 0 ? (
                            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                                {courses.map((course: any) => (
                                    <CourseCard key={course.id} {...course} />
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
            </div>
            <BottomCTA />
        </>
    );
}
