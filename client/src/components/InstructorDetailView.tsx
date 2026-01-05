import Link from 'next/link';
import { Card, CardContent } from '@/components/Card';
import { BottomCTA } from '@/components/BottomCTA';

interface InstructorDetailViewProps {
    instructor: any;
    courses: any[];
}

export function InstructorDetailView({ instructor, courses }: InstructorDetailViewProps) {
    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Hero Banner - Black */}
                <div className="relative bg-foreground text-background">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.1)_35%,rgba(255,255,255,0.1)_65%,transparent_65%)] bg-[length:20px_20px]"></div>
                    </div>
                    <div className="container relative py-8 md:py-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                                    {instructor.avatar ? (
                                        <img
                                            src={instructor.avatar}
                                            alt={instructor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-6xl font-bold">
                                            {instructor.name?.charAt(0) || 'G'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">{instructor.name}</h1>
                                {instructor.title && (
                                    <p className="text-xl md:text-2xl text-background/70 mb-4">{instructor.title}</p>
                                )}
                                <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm">
                                    <div>
                                        <span className="font-bold text-2xl">{instructor.courseCount}</span>
                                        <span className="ml-2 text-background/70">khóa học</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-2xl">
                                            {instructor.studentCount > 0 ? `${instructor.studentCount}+` : 0}
                                        </span>
                                        <span className="ml-2 text-background/70">học viên</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container py-6 md:py-8" style={{ paddingBottom: '120px' }}>
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="space-y-12">
                            {/* Bio */}
                            {instructor.bio && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-6">Giới thiệu</h2>
                                    <div className="bg-muted/50 rounded-xl p-6 border">
                                        <p className="text-muted-foreground leading-loose whitespace-pre-wrap">
                                            {instructor.bio}
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* Achievements / Partnerships */}
                            {instructor.experiences && instructor.experiences.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-6">Các vị trí khác nổi bật đã trải qua:</h2>
                                    <div className="grid gap-6 md:grid-cols-3">
                                        {instructor.experiences.map((exp: any) => (
                                            <Card key={exp.id} className="text-center p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-colors h-full">
                                                <div className="mb-4 text-primary">
                                                    {(!exp.icon || exp.icon === 'building') && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                                            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                                            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                                            <path d="M10 6h4" />
                                                            <path d="M10 10h4" />
                                                            <path d="M10 14h4" />
                                                            <path d="M10 18h4" />
                                                        </svg>
                                                    )}
                                                    {exp.icon === 'school' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                                        </svg>
                                                    )}
                                                    {exp.icon === 'users' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                            <circle cx="9" cy="7" r="4" />
                                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <h3 className="font-bold mb-2">{exp.company}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {exp.position}
                                                </p>
                                                {exp.period && (
                                                    <p className="text-xs text-muted-foreground mt-1 opacity-70">
                                                        {exp.period}
                                                    </p>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Courses */}
                            <section>
                                <h2 className="text-2xl font-bold mb-6">Khóa học</h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {courses.map((course) => (
                                        <Link key={course.id} href={`/courses/${course.slug}`}>
                                            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                                                {course.thumbnail && (
                                                    <div className="aspect-video bg-muted overflow-hidden">
                                                        <img
                                                            src={course.thumbnail}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                )}
                                                <CardContent className="p-6 pt-5">
                                                    <h3 className="font-bold text-lg mb-2 line-clamp-2 mt-1">{course.title}</h3>
                                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                        {course.description}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            {course.lessons?.length || 0} bài học
                                                        </span>
                                                        <span className="font-bold text-primary">
                                                            {course.price === 0
                                                                ? 'Miễn phí'
                                                                : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)
                                                            }
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <BottomCTA
                title="Học hỏi từ chuyên gia hàng đầu"
                subtitle="Đăng ký ngay để được trực tiếp dẫn dắt bởi những giảng viên giàu kinh nghiệm."
                buttonText="Xem tất cả khóa học"
                buttonHref="/courses"
            />
        </>
    );
}
