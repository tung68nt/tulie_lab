'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';

export default function AdminUserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // We don't have a direct get-user-by-id endpoint for ADMIN yet in routes? 
                // Wait, users.routes.ts has `listUsers` and `profile`.
                // I need to add `getUserById` for admin in backend `users.routes.ts` or reuse `listUsers` and filter (bad).
                // Let's add GET /api/users/:id to backend first.
                // For now, I will optimistically check if it exists or implement it.
                // Actually, I should IMPLEMENT it in backend first.

                // Oops, I'm in writing client file step.
                // I will add the backend support in the NEXT step.
                // I'll assume `api.admin.getUser(id)` will be available.

                const userData = await api.admin.getUser(id as string);
                const coursesData = await api.courses.list();
                setUser(userData);
                setCourses(coursesData as any[]);
            } catch (e) {
                console.error(e);
                addToast('Không tìm thấy user hoặc lỗi kết nối', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleEnroll = async () => {
        if (!selectedCourse) return;
        try {
            await api.admin.enrollUser(id as string, selectedCourse);
            addToast('Đã kích hoạt khóa học', 'success');
            // Refresh user data to show new enrollment
            const userData = await api.admin.getUser(id as string);
            setUser(userData);
        } catch (e) {
            addToast('Lỗi kích hoạt', 'error');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Chi tiết người dùng</h1>
                <Button variant="outline" onClick={() => router.back()}>Quay lại</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cá nhân</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Họ tên</label>
                            <p className="text-lg font-semibold">{user.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="text-lg">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Vai trò</label>
                            <p className="text-lg badge">{user.role}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Ngày tham gia</label>
                            <p>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Khóa học đã đăng ký ({user.enrollments?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Manual Enroll Form inside Detail Page */}
                            <div className="flex gap-2 p-4 bg-muted/50 rounded-lg">
                                <select
                                    className="flex-1 border rounded px-3 py-2"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    <option value="">-- Chọn khóa học để gán --</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                                <Button onClick={handleEnroll} disabled={!selectedCourse}>Gán khóa học</Button>
                            </div>

                            <ul className="space-y-2">
                                {user.enrollments?.map((enroll: any) => (
                                    <li key={enroll.courseId} className="flex justify-between items-center p-3 border rounded-lg bg-card hover:bg-muted/20">
                                        <span className="font-medium">{enroll.course?.title || 'Unknown Course'}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(enroll.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </li>
                                ))}
                                {(!user.enrollments || user.enrollments.length === 0) && (
                                    <p className="text-muted-foreground text-center py-4">Chưa đăng ký khóa học nào</p>
                                )}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lịch sử đơn hàng ({user.orders?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="h-12 px-4 font-medium">Mã đơn</th>
                                    <th className="h-12 px-4 font-medium">Số tiền</th>
                                    <th className="h-12 px-4 font-medium">Trạng thái</th>
                                    <th className="h-12 px-4 font-medium">Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.orders?.map((order: any) => (
                                    <tr key={order.id} className="border-b">
                                        <td className="p-4">{order.code}</td>
                                        <td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'PAID' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                ))}
                                {(!user.orders || user.orders.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-muted-foreground">Chưa có đơn hàng nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
