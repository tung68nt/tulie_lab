'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';


export default function LearnCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseSlug = params.courseSlug as string;

    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const [course, setCourse] = useState<any>(null);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseData: any = await api.courses.get(courseSlug);
                setCourse(courseData);

                api.courses.getProgress(courseData.id)
                    .then((res: any) => {
                        if (res.completedLessonIds) {
                            setCompletedLessons(res.completedLessonIds);
                        }
                    })
                    .catch(() => { });

                if (!courseData || !courseData.lessons || courseData.lessons.length === 0) {
                    setLoading(false);
                    return;
                }

                // Always take the first lesson to redirect to slug-based URL
                const sortedLessons = [...courseData.lessons].sort((a, b) => a.position - b.position);
                const targetLesson = sortedLessons[0];

                if (targetLesson && targetLesson.slug) {
                    router.replace(`/learn/${courseSlug}/${targetLesson.slug}`);
                    return;
                }

                // Fallback (should ideally not be reached if slugs are mandated)
                setHasAccess(false);
                setCurrentLesson(targetLesson);
            } catch (e) {
                console.error('Error loading lesson:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseSlug, router]);

    const navigateToLesson = (lesson: any) => {
        router.push(`/learn/${courseSlug}/${lesson.slug}`);
    };

    const handleToggleComplete = async (lId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        const isCompleted = completedLessons.includes(lId);
        const previousState = [...completedLessons];

        try {
            if (isCompleted) {
                setCompletedLessons(completedLessons.filter(id => id !== lId));
                await api.courses.markUncomplete(lId);
            } else {
                setCompletedLessons([...completedLessons, lId]);
                await api.courses.markComplete(lId);
            }
        } catch (error) {
            console.error('Error toggling lesson complete:', error);
            setCompletedLessons(previousState);
        }
    };

    const getNextLesson = () => {
        if (!course || !currentLesson) return null;
        const sorted = [...course.lessons].sort((a, b) => a.position - b.position);
        const currentIndex = sorted.findIndex((l: any) => l.id === currentLesson.id);
        return sorted[currentIndex + 1] || null;
    };

    const getPrevLesson = () => {
        if (!course || !currentLesson) return null;
        const sorted = [...course.lessons].sort((a, b) => a.position - b.position);
        const currentIndex = sorted.findIndex((l: any) => l.id === currentLesson.id);
        return sorted[currentIndex - 1] || null;
    };

    // Loading State
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent"></div>
        </div>
    );
}
