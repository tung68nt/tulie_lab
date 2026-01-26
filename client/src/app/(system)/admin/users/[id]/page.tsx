'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';
import {
    User, Mail, Phone, MapPin, Calendar, Shield, Clock,
    BookOpen, CreditCard, Activity, ArrowLeft, Send, Loader2,
    Briefcase, Building, Monitor, ShieldAlert, Ban, Trash2,
    CheckCircle2, Download, Package, History, Laptop, Globe,
    ChevronRight, ExternalLink, Eye
} from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useConfirm } from '@/components/ConfirmDialog';

type UserTab = 'overview' | 'courses' | 'products' | 'membership' | 'orders' | 'logs';

export default function AdminUserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const confirmDialog = useConfirm();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [activeTab, setActiveTab] = useState<UserTab>('overview');
    const [processingAction, setProcessingAction] = useState<string | null>(null);
    const [membershipForm, setMembershipForm] = useState<{ tier: string, expiryDate: string }>({ tier: 'FREE', expiryDate: '' });

    useEffect(() => {
        if (user) {
            const isMemberActive = user.subscriptions?.some((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date());
            const activeSub = user.subscriptions?.find((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date());

            setMembershipForm({
                tier: isMemberActive ? 'PREMIUM' : 'FREE',
                expiryDate: activeSub ? new Date(activeSub.endDate).toISOString().split('T')[0] : ''
            });
        }
    }, [user]);

    const fetchData = async () => {
        if (!id) return;
        try {
            const [userData, coursesRes] = await Promise.all([
                api.admin.getUser(id as string),
                api.admin.courses.list()
            ]);
            setUser(userData);
            setAllCourses((coursesRes as any).data || []);
        } catch (e) {
            console.error(e);
            addToast('Lỗi tải dữ liệu người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleAction = async (action: () => Promise<any>, successMsg: string, confirmMsg?: string) => {
        if (confirmMsg) {
            const confirmed = await confirmDialog({
                title: 'Xác nhận',
                message: confirmMsg,
                variant: 'warning'
            });
            if (!confirmed) return;
        }

        setProcessingAction('loading');
        try {
            await action();
            addToast(successMsg, 'success');
            fetchData();
        } catch (e: any) {
            addToast(e.message || 'Hành động thất bại', 'error');
        } finally {
            setProcessingAction(null);
        }
    };

    const formatDate = (date?: string | Date) => {
        if (!date) return 'Chưa có thông tin';
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
    };

    const handleSaveMembership = async () => {
        if (membershipForm.tier === 'FREE') {
            await handleAction(() => api.admin.grantMembership(id as string, -1), 'Đã hủy gói thành viên');
        } else {
            if (!membershipForm.expiryDate) {
                addToast('Vui lòng chọn ngày hết hạn', 'error');
                return;
            }
            const days = Math.ceil((new Date(membershipForm.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            await handleAction(() => api.admin.grantMembership(id as string, days, membershipForm.tier), 'Đã cập nhật gói thành viên');
        }
    };

    if (loading) return <div className="flex items-center justify-center py-40"><Loader2 className="h-10 w-10 animate-spin text-muted-foreground" /></div>;
    if (!user) return <div className="text-center py-20">Không tìm thấy thành viên</div>;

    const tabs: { id: UserTab, label: string, icon: any }[] = [
        { id: 'overview', label: 'Info', icon: User },
        { id: 'courses', label: 'Khóa học', icon: BookOpen },
        { id: 'products', label: 'Sản phẩm', icon: Package },
        { id: 'membership', label: 'Hội viên', icon: Shield },
        { id: 'orders', label: 'Đơn hàng', icon: CreditCard },
        { id: 'logs', label: 'Logs', icon: ShieldAlert },
    ];

    const isMemberActive = user.subscriptions?.some((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date());
    const activeSub = user.subscriptions?.find((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date());

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title={user.profile?.name || user.fullName || 'Chưa đặt tên'}
                subtitle={user.email}
                backUrl="/admin/users"
            >
                <div className="flex gap-2">
                    {!user.isActive ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-zinc-50 hover:bg-zinc-100"
                            onClick={() => handleAction(() => api.admin.unblockUser(id as string), 'Đã kích hoạt lại tài khoản')}
                        >
                            Kích hoạt lại
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-zinc-100"
                            onClick={() => handleAction(() => api.admin.blockUser(id as string), 'Đã chặn người dùng này', 'Chặn người dùng này? Họ sẽ không thể đăng nhập.')}
                        >
                            <Ban size={14} className="mr-1" /> Chặn
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-zinc-100"
                        onClick={() => handleAction(async () => {
                            await api.admin.deleteUser(id as string);
                            router.push('/admin/users');
                        }, 'Đã xóa tài khoản', 'Xóa vĩnh viễn tài khoản này? Hành động không thể hoàn tác.')}
                    >
                        <Trash2 size={14} className="mr-1" /> Xóa
                    </Button>
                </div>
            </AdminPageHeader>

            {/* Quick Stats Banner */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border shadow-none bg-white border-zinc-200">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-xs font-bold text-muted-foreground mb-2">Gói thành viên</div>
                        <div className="text-xl font-bold max-w-full px-2">
                            {isMemberActive ? 'Premium' : 'Free'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1.5 font-medium min-h-[32px] flex items-end">
                            {isMemberActive ? `Hết hạn: ${new Date(activeSub.endDate).toLocaleDateString('vi-VN')}` : ' '}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-none bg-white border-zinc-200">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-xs font-bold text-muted-foreground mb-2">Chi tiêu (Paid)</div>
                        <div className="text-xl font-bold">{formatCurrency(user.stats?.totalPaid || 0)}</div>
                        <div className="text-xs text-muted-foreground mt-1.5 leading-tight font-medium min-h-[32px] flex items-end">
                            Tổng cộng đơn hàng đã thanh toán
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-none bg-white border-zinc-200">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-xs font-bold text-muted-foreground mb-2">Tỷ lệ hoàn thành học</div>
                        <div className="text-xl font-bold flex items-center gap-2">
                            {user.stats?.totalLessons > 0
                                ? Math.round((user.stats?.completedLessons / user.stats?.totalLessons) * 100)
                                : 0}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-1.5 leading-tight font-medium min-h-[32px] flex items-end">
                            Đã hoàn thành {user.stats?.completedLessons || 0}/{user.stats?.totalLessons || 0} bài học
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-none bg-white border-zinc-200">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-xs font-bold text-muted-foreground mb-2">Đăng nhập cuối</div>
                        <div className="text-xl font-bold flex items-center gap-2 px-2">
                            {/* <Clock size={16} className="text-zinc-400" /> */}
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('vi-VN') : 'Unknown'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1.5 leading-tight font-medium min-h-[32px] flex items-end">
                            Lần truy cập hệ thống gần nhất
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs Navigation */}
            {/* Tabs Navigation */}
            <div className="flex flex-wrap items-center gap-1 border-b pb-px overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm transition-all rounded-t-lg ${activeTab === tab.id
                            ? 'bg-zinc-100 text-zinc-900 border-b-2 border-zinc-900 font-bold'
                            : 'text-muted-foreground hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'overview' && (
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <User size={18} /> Thông tin hồ sơ
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground font-bold tracking-tight">Họ và tên</span>
                                            <span className="text-sm font-medium">{user.profile?.name || 'Chưa cập nhật'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground font-bold tracking-tight">Email</span>
                                            <span className="text-sm font-medium flex items-center gap-2 truncate">
                                                {user.email} <Mail size={12} className="text-muted-foreground" />
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground font-bold tracking-tight">Số điện thoại</span>
                                            <span className="text-sm font-medium">{user.profile?.phone || 'Chưa cập nhật'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground font-bold tracking-tight">Ngày sinh</span>
                                            <span className="text-sm font-medium">{user.profile?.birthDate ? new Date(user.profile.birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground font-bold tracking-tight">Nghề nghiệp</span>
                                            <span className="text-sm font-medium flex items-center gap-2 truncate">
                                                <Briefcase size={14} className="text-muted-foreground" /> {user.profile?.occupation || 'Chưa cập nhật'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground font-bold tracking-tight">Công ty</span>
                                            <span className="text-sm font-medium flex items-center gap-2 truncate">
                                                <Building size={14} className="text-muted-foreground" /> {user.profile?.company || 'Chưa cập nhật'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground font-bold tracking-tight">Địa chỉ</span>
                                            <span className="text-sm font-medium flex items-center gap-2 truncate">
                                                <MapPin size={14} className="text-muted-foreground" />
                                                {[user.profile?.address, user.profile?.city].filter(Boolean).join(', ') || 'Chưa cập nhật'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground font-bold tracking-tight">Ngày tham gia</span>
                                            <span className="text-sm font-medium flex items-center gap-2">
                                                <Calendar size={14} className="text-muted-foreground" /> {formatDate(user.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Shield size={18} /> Phân quyền & Bảo mật
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-sm">Loại tài khoản</span>
                                        <span className="px-2 py-0.5 bg-muted rounded text-xs font-bold">{user.role}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-sm">Trạng thái hoạt động</span>
                                        <span className={`flex items-center gap-1.5 text-xs font-bold ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                            <span className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {user.isActive ? 'Active' : 'Blocked'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm">Email Marketing</span>
                                        <span className="text-xs font-medium">{user.profile?.allowEmailMarketing ? 'Đã đăng ký' : 'Đã hủy'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-muted/30">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold tracking-wider text-muted-foreground">Tóm tắt hoạt động</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 bg-background rounded-full flex items-center justify-center border">
                                            <BookOpen size={20} className="text-zinc-900" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{user.stats?.totalEnrollments || 0}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold">Khóa học đăng ký</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 bg-background rounded-full flex items-center justify-center border">
                                            <Package size={20} className="text-zinc-900" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{user.purchasedProducts?.length || 0}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold">Sản phẩm sở hữu</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 bg-background rounded-full flex items-center justify-center border">
                                            <CreditCard size={20} className="text-zinc-900" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{user.orders?.length || 0}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold">Tổng đơn hàng</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold">Thiết bị gần nhất</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {user.activities?.[0] ? (
                                        <div className="flex gap-3 overflow-hidden">
                                            <Monitor size={18} className="text-muted-foreground mt-0.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium break-words line-clamp-3">{user.activities[0].device || 'Hệ điều hành / Trình duyệt'}</p>
                                                <p className="text-[10px] text-muted-foreground">{user.activities[0].ipAddress}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">Chưa có thông tin</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Khóa học đã đăng ký</CardTitle>
                                <CardDescription>Danh sách tất cả các khóa học người dùng đã truy cập.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="text-sm border rounded-md px-3 h-9 bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    <option value="">Chọn khóa học...</option>
                                    {allCourses.filter(c => !user.enrollments?.some((e: any) => e.courseId === c.id)).map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                                <Button
                                    size="sm"
                                    disabled={!selectedCourse}
                                    onClick={() => handleAction(() => api.admin.enrollUser(id as string, selectedCourse), 'Đã kích hoạt khóa học thành công')}
                                >
                                    Kích hoạt thủ công
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {user.enrollments?.map((enroll: any) => (
                                    <div key={enroll.id} className="flex gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-colors group">
                                        <div className="h-20 w-32 shrink-0 bg-muted rounded-lg overflow-hidden border">
                                            {enroll.course?.thumbnail && <img src={enroll.course.thumbnail} className="h-full w-full object-cover" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm truncate">{enroll.course?.title}</h4>
                                            <p className="text-[10px] text-muted-foreground mb-3 flex items-center gap-1">
                                                <Clock size={10} /> Đã kích hoạt: {formatDate(enroll.createdAt)}
                                            </p>
                                            <div className="flex gap-2">
                                                <Link href={`/admin/courses/${enroll.courseId}`} className="text-[10px] font-bold text-zinc-900 hover:underline">Quản lý nội dung</Link>
                                                <button
                                                    className="text-[10px] font-bold text-zinc-500 hover:underline hover:text-zinc-900"
                                                    onClick={() => handleAction(() => api.admin.unenrollUser(id as string, enroll.courseId), 'Đã gỡ quyền truy cập khóa học', 'Gỡ quyền truy cập khóa học này?')}
                                                >
                                                    Gỡ quyền
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!user.enrollments || user.enrollments.length === 0) && (
                                    <div className="col-span-2 text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                                        <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-50" />
                                        <p className="text-sm text-muted-foreground font-medium">Chưa đăng ký khóa học nào</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'products' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Sản phẩm & Tải xuống</CardTitle>
                            <CardDescription>Các Templates, Apps hoặc License mà người dùng đã mua.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/30">
                                            <th className="text-left py-3 px-4 font-bold text-[10px]">Tên sản phẩm</th>
                                            <th className="text-left py-3 px-4 font-bold text-[10px]">Phiên bản ghi nhận</th>
                                            <th className="text-left py-3 px-4 font-bold text-[10px]">Ngày mua</th>
                                            <th className="text-center py-3 px-4 font-bold text-[10px]">Tính năng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {user.purchasedProducts?.map((p: any) => (
                                            <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded border bg-muted shrink-0 overflow-hidden">
                                                            {p.thumbnail && <img src={p.thumbnail} className="h-full w-full object-cover" />}
                                                        </div>
                                                        <span className="font-bold">{p.title}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 font-mono text-xs text-zinc-900">v{p.currentVersion || '1.0.0'}</td>
                                                <td className="py-4 px-4 text-muted-foreground">{formatDate(p.purchasedAt)}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <Button variant="outline" size="sm" onClick={() => window.open(`/admin/products/${p.id}`, '_blank')}>
                                                        <ExternalLink size={12} className="mr-1" /> View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!user.purchasedProducts || user.purchasedProducts.length === 0) && (
                                            <tr>
                                                <td colSpan={4} className="text-center py-20 text-muted-foreground">Chưa có sản phẩm nào được mua.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'membership' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Quản lý Gói Hội Viên</CardTitle>
                                <CardDescription>Cấp quyền hội viên Premium để truy cập tất cả nội dung.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 border rounded-xl bg-zinc-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isMemberActive ? 'bg-zinc-100 text-zinc-900 border' : 'bg-muted text-muted-foreground'}`}>
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{isMemberActive ? (activeSub?.product?.title || 'Premium Member') : 'Gói miễn phí'}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                {isMemberActive
                                                    ? `Gói đang kích hoạt, hết hạn vào ${new Date(activeSub.endDate).toLocaleDateString('vi-VN')}`
                                                    : 'Người dùng hiện chỉ có quyền truy cập nội dung miễn phí.'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${isMemberActive ? 'bg-zinc-900 text-zinc-100' : 'bg-muted text-muted-foreground'}`}>
                                        {isMemberActive ? 'ACTIVE' : 'NONE'}
                                    </span>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end p-4 border rounded-xl bg-zinc-50/50">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-muted-foreground">Membership</label>
                                        <select
                                            className="w-full text-sm border rounded-md px-3 h-10 bg-background focus:outline-none focus:ring-1 focus:ring-foreground cursor-pointer"
                                            value={membershipForm.tier}
                                            onChange={(e) => setMembershipForm({ ...membershipForm, tier: e.target.value })}
                                        >
                                            <option value="FREE">Free</option>
                                            <option value="BASIC">Basic</option>
                                            <option value="PREMIUM">Premium</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-muted-foreground">Ngày hết hạn</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="w-full text-sm border rounded-md px-3 h-10 bg-background focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50 cursor-pointer"
                                                value={membershipForm.expiryDate}
                                                onChange={(e) => setMembershipForm({ ...membershipForm, expiryDate: e.target.value })}
                                                disabled={membershipForm.tier === 'FREE'}
                                            />
                                        </div>
                                    </div>
                                    <div className="h-10">
                                        <Button
                                            size="sm"
                                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-full"
                                            onClick={handleSaveMembership}
                                            disabled={!!processingAction}
                                        >
                                            {processingAction === 'loading' ? <Loader2 size={16} className="animate-spin mr-2" /> : <div className="flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Lưu thay đổi</div>}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="text-xs font-bold tracking-tight text-muted-foreground">Lịch sử Membership</h4>
                                    <div className="space-y-2 border rounded-xl overflow-hidden">
                                        {user.subscriptions?.map((s: any) => (
                                            <div key={s.id} className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-muted/20">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <History size={14} className="text-muted-foreground" />
                                                    <span className="font-medium">{s.product?.title || 'System Plan'}</span>
                                                </div>
                                                <div className="flex gap-4 items-center">
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(s.startDate).toLocaleDateString('vi-VN')} - {new Date(s.endDate).toLocaleDateString('vi-VN')}
                                                    </span>
                                                    <span className={`text-[10px] font-bold ${s.status === 'ACTIVE' ? 'text-zinc-900 border px-1.5 py-0.5 rounded-full' : 'text-muted-foreground'}`}>
                                                        {s.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!user.subscriptions || user.subscriptions.length === 0) && (
                                            <p className="text-center py-10 text-xs text-muted-foreground">Chưa có lịch sử đăng ký.</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card >
                    </div >
                )
                }


                {
                    activeTab === 'orders' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Lịch sử đơn hàng</CardTitle>
                                <CardDescription>Tất cả các giao dịch thanh toán và đơn hàng chờ xử lý.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/30">
                                                <th className="text-left py-3 px-4 font-bold text-[10px]">Mã đơn</th>
                                                <th className="text-left py-3 px-4 font-bold text-[10px]">Nội dung</th>
                                                <th className="text-right py-3 px-4 font-bold text-[10px]">Số tiền</th>
                                                <th className="text-center py-3 px-4 font-bold text-[10px]">Trạng thái</th>
                                                <th className="text-right py-3 px-4 font-bold text-[10px]">Ngày tạo</th>
                                                <th className="text-center py-3 px-4 font-bold text-[10px]">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-xs">
                                            {user.orders?.map((order: any) => (
                                                <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                                                    <td className="py-3 px-4 font-bold font-mono tracking-tighter">
                                                        {order.code}
                                                    </td>
                                                    <td className="py-3 px-4 max-w-[250px] truncate font-medium">
                                                        {order.items?.map((item: any) => item.course?.title || item.product?.title).join(', ') || 'N/A'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-sm">
                                                        {formatCurrency(order.amount)}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${order.status === 'PAID' ? 'bg-zinc-900 text-zinc-100' :
                                                            order.status === 'PENDING' ? 'bg-zinc-100 text-zinc-900' :
                                                                'bg-muted text-muted-foreground'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right text-muted-foreground font-medium">
                                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <button
                                                            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors mx-auto text-zinc-400 hover:text-zinc-900"
                                                            onClick={() => router.push(`/admin/orders?search=${order.code}`)}
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!user.orders || user.orders.length === 0) && (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-20 text-muted-foreground">Không có dữ liệu đơn hàng.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )
                }

                {
                    activeTab === 'logs' && (
                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <ShieldAlert size={18} className="text-red-500" /> Cảnh báo bảo mật
                                        </CardTitle>
                                        <CardDescription>Các hành vi bất thường hoặc vi phạm chính sách.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {user.securityLogs?.filter((l: any) => ['FAILED_LOGIN', 'ACCESS_DENIED'].includes(l.action)).map((log: any) => (
                                                <div key={log.id} className="p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3">
                                                    <Ban size={16} className="text-red-500 shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-red-900">{log.action}</p>
                                                        <p className="text-[10px] text-red-700 mt-1">{log.details || 'Hành vi cố gắng truy cập trái phép'}</p>
                                                        <p className="text-[9px] text-red-600/50 mt-1">{formatDate(log.createdAt)} • IP: {log.ipAddress}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!user.securityLogs || user.securityLogs.length === 0) && (
                                                <div className="py-10 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                                                    <CheckCircle2 size={24} className="text-green-500 opacity-30" />
                                                    Tài khoản sạch, không có cảnh báo bảo mật nào.
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Laptop size={18} className="text-blue-500" /> Lịch sử đăng nhập & IP
                                        </CardTitle>
                                        <CardDescription>Theo dõi danh sách các địa chỉ IP và trình duyệt gần đây.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {user.activities?.filter((l: any) => l.action === 'login').slice(0, 10).map((act: any) => (
                                                <div key={act.id} className="flex justify-between items-center p-2 rounded hover:bg-muted/30 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <Globe size={14} className="text-muted-foreground" />
                                                        <code className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded">{act.ipAddress}</code>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground">{formatDate(act.createdAt)}</span>
                                                </div>
                                            ))}
                                            {(!user.activities || user.activities.filter((l: any) => l.action === 'login').length === 0) && (
                                                <p className="text-center py-10 text-xs text-muted-foreground">Chưa có lịch sử đăng nhập.</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <History size={18} className="text-muted-foreground" /> Nhật ký hành vi chi tiết
                                        </CardTitle>
                                        <CardDescription>Toàn bộ hành động của người dùng trên hệ thống.</CardDescription>
                                    </div>
                                    <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded">Latest 100 Logs</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 no-scrollbar border rounded-xl overflow-hidden divide-y">
                                        {user.activities?.map((act: any) => (
                                            <div key={act.id} className="p-3 hover:bg-muted/30 transition-colors flex items-center gap-4 group">
                                                <div className="shrink-0">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${act.action.includes('buy') || act.action.includes('order') ? 'bg-emerald-100 text-emerald-600' :
                                                        act.action.includes('error') || act.action.includes('failed') ? 'bg-red-100 text-red-600' :
                                                            'bg-blue-50 text-blue-500'
                                                        }`}>
                                                        <Activity size={14} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold capitalize">{act.action.replace(/_/g, ' ')}</span>
                                                        {act.path && <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded text-muted-foreground truncate max-w-[200px]">{act.path}</span>}
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-0.5">
                                                        <span className="text-[9px] text-muted-foreground font-medium">{formatDate(act.createdAt)}</span>
                                                        <span className="text-[9px] text-muted-foreground">• IP: {act.ipAddress}</span>
                                                        {act.metadata && <span className="text-[9px] text-muted-foreground hidden group-hover:inline">• Meta: {act.metadata.length > 50 ? act.metadata.substring(0, 50) + '...' : act.metadata}</span>}
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} className="text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                        {(!user.activities || user.activities.length === 0) && (
                                            <p className="text-center py-20 text-sm text-muted-foreground italic">Không có nhật ký hành vi được ghi nhận.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )
                }
            </div >
        </div >
    );
}
