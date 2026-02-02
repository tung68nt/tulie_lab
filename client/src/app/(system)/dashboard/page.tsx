'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { SectionBackground } from '@/components/info/SectionBackground';

export default function DashboardPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'courses' | 'profile' | 'orders'>('courses');

    // Profile form
    const [editMode, setEditMode] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '' });
    const [saving, setSaving] = useState(false);

    // Upcoming event
    const [upcomingEvent, setUpcomingEvent] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile: any = await api.users.getProfile().catch(() => null);
                if (!profile) {
                    router.push('/login');
                    return;
                }
                setUser(profile);
                setEnrollments(profile.enrollments || []);
                setProfileForm({ name: profile.name || '' });

                // Fetch other data in parallel
                const [ordersData, eventsData] = await Promise.all([
                    api.users.getMyOrders().catch(() => []),
                    api.events.getUpcoming(1).catch(() => ({ data: [] }))
                ]);

                setOrders(Array.isArray(ordersData) ? ordersData : []);

                // Set upcoming event if exists and is active
                if (eventsData?.data && eventsData.data.length > 0) {
                    setUpcomingEvent(eventsData.data[0]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await api.users.updateProfile(profileForm);
            setUser({ ...user, ...profileForm });
            setEditMode(false);
            addToast('Đã cập nhật thông tin', 'success');
        } catch (e: any) {
            addToast(e.message || 'Cập nhật thất bại', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

    return (

        <div className="relative min-h-screen overflow-hidden">
            <SectionBackground backgroundTheme="light" showDotPattern={true} className="z-0" dotPatternFade={false} />

            <div className="container pt-24 pb-32 relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
                    <p className="text-muted-foreground mt-2">Chúc {user?.name || 'bạn'} có những giờ học tập thật hiệu quả!</p>
                </div>

                {/* Upcoming Class Widget */}
                {upcomingEvent && (
                    <div className="mb-10 relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <div className="w-32 h-32 bg-primary rounded-full blur-3xl"></div>
                        </div>
                        <div className="p-6 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    Sắp diễn ra
                                </div>
                                <h3 className="text-xl font-bold mb-1">{upcomingEvent.title}</h3>
                                <p className="text-muted-foreground mb-4 max-w-xl line-clamp-2">
                                    {upcomingEvent.description || 'Buổi học sẽ sớm bắt đầu. Hãy tham gia đúng giờ nhé!'}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        {new Date(upcomingEvent.date).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        {new Date(upcomingEvent.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                            <Link href={`/dashboard/classroom/${upcomingEvent.id}`}>
                                <Button size="lg" className="whitespace-nowrap shadow-lg shadow-primary/20">
                                    Vào Phòng Chờ
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}



                {enrollments.length === 0 ? (
                    <div className="text-center py-20 border rounded-xl bg-card">
                        <h2 className="text-xl font-semibold">Bạn chưa đăng ký khóa học nào</h2>
                        <p className="text-muted-foreground mt-2 mb-6">Khám phá danh mục khóa học để bắt đầu ngay hôm nay.</p>
                        <Link href="/courses">
                            <Button>Xem danh sách khóa học</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {enrollments.map((enr: any) => {
                            const course = enr.course;
                            // Mock progress if not available
                            const progress = enr.progress || 0;

                            return (
                                <Card key={course?.id || enr.id} className="flex h-full flex-col overflow-hidden group hover:shadow-lg transition-shadow">
                                    <Link href={`/learn/${course?.slug}/${course?.lessons?.[0]?.slug || ''}`} className="cursor-pointer">
                                        <div className="aspect-video w-full bg-muted relative overflow-hidden">
                                            {course?.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="line-clamp-2 text-lg hover:underline">
                                            <Link href={`/learn/${course?.slug}/${course?.lessons?.[0]?.slug || ''}`}>
                                                {course?.title || 'Khóa học'}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 pb-4">
                                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                            <span>Tiến độ</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-secondary">
                                            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Link href={`/learn/${course?.slug}/${course?.lessons?.[0]?.slug || ''}`} className="w-full">
                                            <Button className="w-full" variant="outline">Tiếp tục học</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

}

