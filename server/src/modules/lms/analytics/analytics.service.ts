import prisma from '../../../config/prisma';

export class AnalyticsService {
    async getLearningAnalytics() {
        const [totalEnrollments, totalCompletedLessons, totalLessons, courses] = await Promise.all([
            prisma.enrollment.count(),
            prisma.lessonProgress.count({ where: { isCompleted: true } }),
            prisma.lesson.count(),
            prisma.course.findMany({
                where: { isHidden: false },
                include: {
                    _count: {
                        select: {
                            enrollments: true,
                            lessons: true,
                            orderItems: {
                                where: {
                                    order: { status: 'PAID' }
                                }
                            }
                        }
                    },
                    lessons: {
                        select: {
                            id: true,
                            _count: {
                                select: {
                                    progress: {
                                        where: { isCompleted: true }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        ]);

        const courseStats = courses.map(course => {
            const enrollments = course._count.enrollments;
            const paidOrders = course._count.orderItems;
            const totalLessonsInCourse = course._count.lessons;

            // Calculate total completions for this course across all students
            const totalCompletions = course.lessons.reduce((acc, lesson) => acc + lesson._count.progress, 0);

            // Average progress per student (as a percentage)
            const avgProgress = enrollments > 0 && totalLessonsInCourse > 0
                ? (totalCompletions / (enrollments * totalLessonsInCourse)) * 100
                : 0;

            // Student engagement: Active if they have at least one completion
            // This is a bit complex with current query, let's estimate
            // In a real app, we might need a more specific query for active students

            return {
                id: course.id,
                title: course.title,
                slug: course.slug,
                enrollments,
                paidOrders,
                totalLessons: totalLessonsInCourse,
                avgProgress: Math.round(avgProgress * 10) / 10,
                completionRate: enrollments > 0 ? Math.round((totalCompletions / (enrollments * totalLessonsInCourse)) * 100) : 0,
            };
        });

        const overallStats = {
            totalEnrollments,
            totalStudents: await prisma.user.count({ where: { role: 'USER' } }),
            avgOverallProgress: totalEnrollments > 0 && totalLessons > 0
                ? Math.round((totalCompletedLessons / (totalEnrollments * totalLessons)) * 100)
                : 0,
            totalRevenue: (await prisma.order.aggregate({
                where: { status: 'PAID' },
                _sum: { amount: true }
            }))._sum.amount || 0
        };

        return {
            overallStats,
            courseStats,
            updatedAt: new Date().toISOString()
        };
    }
}
