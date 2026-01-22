'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext'
import {
    User, Mail, Phone, MapPin, Calendar, Shield, Clock,
    BookOpen, CreditCard, Activity, ArrowLeft, Send, Loader2
} from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

export default function AdminUserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'orders' | 'activity'>('overview');
    const [sendingReminder, setSendingReminder] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
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
            const userData = await api.admin.getUser(id as string);
            setUser(userData);
            setSelectedCourse('');
        } catch (e) {
            addToast('Lỗi kích hoạt', 'error');
        }
    };

    const handleSendReminder = async (orderId: string) => {
        try {
            setSendingReminder(orderId);
            await api.admin.payments.sendReminder(orderId);
            addToast('Đã gửi email nhắc thanh toán', 'success');
        } catch (e: any) {
            addToast(e.message || 'Lỗi gửi email', 'error');
        } finally {
            setSendingReminder(null);
        }
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', {
        style: 'currency', currency: 'VND'
    }).format(amount);

    const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (!user) return <div className="text-center py-20">User not found</div>;

    const tabs = [
        { id: 'overview', label: 'Tổng quan', icon: User },
        { id: 'courses', label: `Khóa học (${user.enrollments?.length || 0})`, icon: BookOpen },
        { id: 'orders', label: `Đơn hàng (${user.orders?.length || 0})`, icon: CreditCard },
        { id: 'activity', label: 'Hoạt động', icon: Activity },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            {/* Header */}
            <AdminPageHeader
                title={user.name || 'Chưa đặt tên'}
                subtitle={user.email}
                backUrl="/admin/users"
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                        if (confirm('Bạn có chắc chắn muốn cấp gói thành viên 1 năm cho người dùng này?')) {
                            api.admin.grantMembership(id as string).then(() => {
                                addToast('Đã cấp gói thành viên thành công', 'success');
                                // Refresh logic could go here
                            }).catch((err) => {
                                addToast(err.message || 'Lỗi cấp thành viên', 'error');
                            });
                        }
                    }}>
                        Cấp Member 1 Năm
                    </Button>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${user.role === 'ADMIN' ? 'bg-black text-white' : 'bg-muted'}`}>
                        {user.role}
                    </span>
                </div>
            </AdminPageHeader>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{user.stats?.totalEnrollments || 0}</div>
                        <p className="text-xs text-muted-foreground">Khóa học đã mua</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{formatCurrency(user.stats?.totalPaid || 0)}</div>
                        <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{user.stats?.completedLessons || 0}</div>
                        <p className="text-xs text-muted-foreground">Bài học đã hoàn thành</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold">{user.pendingOrders?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Đơn chờ thanh toán</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="border-b">
                <nav className="flex gap-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 py-3 px-1 border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-foreground text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Thông tin cá nhân</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-muted-foreground" />
                                <span>{user.phone || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-muted-foreground" />
                                <span>{[user.address, user.city].filter(Boolean).join(', ') || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar size={16} className="text-muted-foreground" />
                                <span>Tham gia: {formatDate(user.createdAt)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Bảo mật & Hoạt động</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Clock size={16} className="text-muted-foreground" />
                                <span>Đăng nhập gần nhất: {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Chưa có thông tin'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield size={16} className="text-muted-foreground" />
                                <span>IP gần nhất: {user.lastLoginIp || 'Chưa có thông tin'}</span>
                            </div>
                            {user.pendingOrders?.length > 0 && (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm font-medium text-yellow-800">
                                        ⚠️ Có {user.pendingOrders.length} đơn chờ thanh toán
                                    </p>
                                    {user.pendingOrders.map((o: any) => (
                                        <p key={o.id} className="text-xs text-yellow-700 mt-1">
                                            {o.code}: chờ {o.pendingDays} ngày
                                        </p>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'courses' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Khóa học đã đăng ký</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                            <select
                                className="flex-1 border rounded px-3 py-2 text-sm"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="">-- Chọn khóa học để gán --</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                            <Button size="sm" onClick={handleEnroll} disabled={!selectedCourse}>Gán khóa học</Button>
                        </div>

                        <div className="space-y-2">
                            {user.enrollments?.map((enroll: any) => (
                                <div key={enroll.id} className="flex justify-between items-center p-3 border rounded-lg">
                                    <span className="font-medium">{enroll.course?.title || 'Unknown'}</span>
                                    <span className="text-xs text-muted-foreground">{formatDate(enroll.createdAt)}</span>
                                </div>
                            ))}
                            {(!user.enrollments || user.enrollments.length === 0) && (
                                <p className="text-center text-muted-foreground py-8">Chưa đăng ký khóa học nào</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'orders' && (
                <Card>
                    <CardHeader><CardTitle className="text-base">Lịch sử đơn hàng</CardTitle></CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left py-2 px-3">Mã đơn</th>
                                        <th className="text-left py-2 px-3">Khóa học</th>
                                        <th className="text-right py-2 px-3">Số tiền</th>
                                        <th className="text-center py-2 px-3">Trạng thái</th>
                                        <th className="text-right py-2 px-3">Ngày tạo</th>
                                        <th className="text-center py-2 px-3">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.orders?.map((order: any) => (
                                        <tr key={order.id} className="border-b">
                                            <td className="py-2 px-3 font-semibold">{order.code}</td>
                                            <td className="py-2 px-3">{order.courses?.map((c: any) => c.title).join(', ') || '-'}</td>
                                            <td className="py-2 px-3 text-right">{formatCurrency(order.amount)}</td>
                                            <td className="py-2 px-3 text-center">
                                                <span className={`px-2 py-1 rounded text-xs ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 text-right text-xs text-muted-foreground">{formatDate(order.createdAt)}</td>
                                            <td className="py-2 px-3 text-center">
                                                {order.status === 'PENDING' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleSendReminder(order.id)}
                                                        disabled={sendingReminder === order.id}
                                                    >
                                                        {sendingReminder === order.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send size={14} />}
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!user.orders || user.orders.length === 0) && (
                                        <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Chưa có đơn hàng</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'activity' && (
                <Card>
                    <CardHeader><CardTitle className="text-base">Lịch sử hoạt động</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {user.activities?.map((act: any) => (
                                <div key={act.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded text-sm">
                                    <Activity size={14} className="text-muted-foreground shrink-0" />
                                    <div className="flex-1">
                                        <span className="font-medium">{act.action}</span>
                                        {act.path && <span className="text-muted-foreground ml-2">{act.path}</span>}
                                    </div>
                                    <div className="text-xs text-muted-foreground shrink-0">
                                        {act.ipAddress && <span className="mr-2">{act.ipAddress}</span>}
                                        {formatDate(act.createdAt)}
                                    </div>
                                </div>
                            ))}
                            {(!user.activities || user.activities.length === 0) && (
                                <p className="text-center text-muted-foreground py-8">Chưa có hoạt động nào được ghi nhận</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
