'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import Link from 'next/link';

export default function MyLearningPage() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const profile: any = await api.users.getProfile();
                if (profile && profile.enrollments) {
                    setEnrollments(profile.enrollments);
                }
                if (profile) {
                    setUser(profile);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-2">Khóa học của tôi</h1>
            <p className="text-muted-foreground mb-8">Chào mừng trở lại, {user?.name || 'bạn'}!</p>
            {enrollments.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-xl">
                    <p className="text-muted-foreground mb-4">Bạn chưa đăng ký khóa học nào.</p>
                    <Link href="/courses">
                        <Button>Khám phá khóa học</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {enrollments.map((item: any) => (
                        <Card key={item.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{item.course.title}</CardTitle>
                                <CardDescription>Đã tham gia</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="aspect-video w-full bg-muted rounded-md mb-2 overflow-hidden">
                                    {item.course.thumbnail && <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover" />}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/courses/${item.course.slug}`} className="w-full">
                                    <Button className="w-full">Tiếp tục học</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
