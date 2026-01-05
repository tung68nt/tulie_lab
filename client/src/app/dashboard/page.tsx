'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

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

                // Fetch orders if API available
                try {
                    const ordersData: any = await (api.users as any).getOrders?.() || [];
                    setOrders(Array.isArray(ordersData) ? ordersData : []);
                } catch {
                    // Orders API might not exist
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
        <div className="container pt-10" style={{ paddingBottom: '120px' }}>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
                <p className="text-muted-foreground mt-2">Tiếp tục hành trình học tập của bạn, {user?.name}!</p>
            </div>

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
    );
}

