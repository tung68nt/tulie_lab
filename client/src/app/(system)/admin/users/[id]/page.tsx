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
    ChevronRight, ExternalLink, Eye, MessageSquare, FileText, Plus, Save
} from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useConfirm } from '@/components/ConfirmDialog';

type UserTab = 'overview' | 'courses' | 'products' | 'membership' | 'orders' | 'logs' | 'notes' | 'invoices';

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
    const [notes, setNotes] = useState<any[]>([]);
    const [invoiceProfiles, setInvoiceProfiles] = useState<any[]>([]);
    const [newNote, setNewNote] = useState('');
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({ companyName: '', taxCode: '', address: '', email: '', isDefault: false });

    useEffect(() => {
        if (user) {
            const activeSub = user.subscriptions?.find((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date());
            const isMemberActive = !!activeSub;

            let currentTier = 'FREE';
            if (activeSub) {
                const title = (activeSub.product?.title || '').toLowerCase();
                const slug = (activeSub.product?.slug || '').toLowerCase();
                if (title.includes('pro') || slug.includes('pro')) currentTier = 'PRO';
                else currentTier = 'PREMIUM'; // Default to Premium if active and not pro
            }

            setMembershipForm({
                tier: currentTier,
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
        if (id) {
            api.admin.notes.list(id as string).then(setNotes).catch(console.error);
            api.admin.invoices.listProfiles(id as string).then(setInvoiceProfiles).catch(console.error);
        }
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

    if (loading) return <div className="flex items-center justify-center py-40"><div className="w-10 h-10 rounded-full border-3 border-border border-t-muted-foreground animate-spin" style={{ animationDuration: '0.6s' }} /></div>;
    if (!user) return <div className="text-center py-20">Không tìm thấy thành viên</div>;

    const tabs: { id: UserTab, label: string, icon: any }[] = [
        { id: 'overview', label: 'Info', icon: User },
        { id: 'notes', label: 'Chăm sóc', icon: MessageSquare },
        { id: 'courses', label: 'Khóa học', icon: BookOpen },
        { id: 'products', label: 'Sản phẩm', icon: Package },
        { id: 'membership', label: 'Hội viên', icon: Shield },
        { id: 'invoices', label: 'Hóa đơn', icon: FileText },
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
                            className="bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                <Card className="overflow-hidden border shadow-none bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-xs font-medium text-zinc-400 mb-2">Gói thành viên</div>
                        <div className="text-xl font-bold text-foreground max-w-full px-2">
                            {isMemberActive ? (activeSub.product?.title?.replace('Hội viên ', '') || 'Premium') : 'Free'}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1.5 font-medium min-h-[32px] flex items-end">
                            {isMemberActive ? `Hết hạn: ${new Date(activeSub.endDate).toLocaleDateString('vi-VN')}` : ' '}
                        </div>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden border shadow-none bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-xs font-medium text-zinc-400 mb-2">Chi tiêu (Paid)</div>
                        <div className="text-xl font-bold text-foreground">{formatCurrency(user.stats?.totalPaid || 0)}</div>
                        <div className="text-xs text-zinc-400 mt-1.5 leading-tight font-medium min-h-[32px] flex items-end">
                            Tổng cộng đơn hàng đã thanh toán
                        </div>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden border shadow-none bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-xs font-medium text-zinc-400 mb-2">Tỷ lệ hoàn thành học</div>
                        <div className="text-xl font-bold text-foreground flex items-center gap-2">
                            {user.stats?.totalLessons > 0
                                ? Math.round((user.stats?.completedLessons / user.stats?.totalLessons) * 100)
                                : 0}%
                        </div>
                        <div className="text-xs text-zinc-400 mt-1.5 leading-tight font-medium min-h-[32px] flex items-end">
                            Đã hoàn thành {user.stats?.completedLessons || 0}/{user.stats?.totalLessons || 0} bài học
                        </div>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden border shadow-none bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-xs font-medium text-zinc-400 mb-2">Đăng nhập cuối</div>
                        <div className="text-xl font-bold text-foreground flex items-center gap-2 px-2">
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('vi-VN') : 'Unknown'}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1.5 leading-tight font-medium min-h-[32px] flex items-end">
                            Lần truy cập hệ thống gần nhất
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-auto space-y-1 shrink-0">
                    <div className="sticky top-24 space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 text-xs transition-all rounded-xl w-full text-left ${activeTab === tab.id
                                    ? 'bg-zinc-900 text-zinc-100 font-bold shadow-sm'
                                    : 'text-muted-foreground hover:bg-zinc-100/80 hover:text-zinc-900 font-medium'
                                    }`}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-zinc-100' : 'text-zinc-500'} />
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="animate-in fade-in duration-300">
                        {activeTab === 'overview' && (
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="md:col-span-2 space-y-6">
                                    <Card className="overflow-hidden border shadow-none bg-card border-zinc-200 dark:border-zinc-800">
                                        <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <User size={18} /> Thông tin hồ sơ
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-zinc-400 font-medium">Họ và tên</span>
                                                    <span className="text-sm font-medium text-foreground">{user.profile?.name || 'Chưa cập nhật'}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-zinc-400 font-medium">Email</span>
                                                    <span className="text-sm font-medium text-foreground flex items-center gap-2 truncate">
                                                        {user.email} <Mail size={12} className="text-zinc-300" />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-zinc-400 font-medium">Số điện thoại</span>
                                                    <span className="text-sm font-medium text-foreground">{user.profile?.phone || 'Chưa cập nhật'}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-zinc-400 font-medium">Ngày sinh</span>
                                                    <span className="text-sm font-medium text-foreground">{user.profile?.birthDate ? new Date(user.profile.birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-zinc-400 font-medium">Nghề nghiệp</span>
                                                    <span className="text-sm font-medium text-zinc-900 flex items-center gap-2 truncate">
                                                        <Briefcase size={14} className="text-zinc-300" /> {user.profile?.occupation || 'Chưa cập nhật'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-zinc-400 font-medium">Công ty</span>
                                                    <span className="text-sm font-medium text-foreground flex items-center gap-2 truncate">
                                                        <Building size={14} className="text-zinc-300" /> {user.profile?.company || 'Chưa cập nhật'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-zinc-400 font-medium">Địa chỉ</span>
                                                    <span className="text-sm font-medium text-foreground flex items-center gap-2 truncate">
                                                        <MapPin size={14} className="text-zinc-300" />
                                                        {[user.profile?.address, user.profile?.city].filter(Boolean).join(', ') || 'Chưa cập nhật'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-zinc-400 font-medium">Ngày tham gia</span>
                                                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                                        <Calendar size={14} className="text-zinc-300" /> {formatDate(user.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="overflow-hidden border shadow-none bg-card border-zinc-200 dark:border-zinc-800">
                                        <CardHeader>
                                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                                <Shield size={18} className="text-zinc-400" /> Phân quyền & Bảo mật
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm">Loại tài khoản</span>
                                                <span className="px-2.5 py-0.5 bg-muted rounded text-xs font-medium">{user.role}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm font-medium">Trạng thái hội viên</span>
                                                {(() => {
                                                    const activeSub = user.subscriptions?.find((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date());
                                                    if (!activeSub) return <span className="bg-muted text-muted-foreground text-xs px-2.5 py-0.5 rounded-full font-medium">Free</span>;
                                                    const title = (activeSub.product?.title || '').toUpperCase();
                                                    if (title.includes('PRO')) {
                                                        return <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-xs px-2.5 py-0.5 rounded-full font-medium">Pro</span>;
                                                    }
                                                    return <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-2.5 py-0.5 rounded-full font-medium">Premium</span>;
                                                })()}
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-sm">Email Marketing</span>
                                                <span className="text-xs font-medium">{user.profile?.allowEmailMarketing ? 'Đăng ký' : 'Hủy'}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card className="overflow-hidden border shadow-none bg-card border-zinc-200 dark:border-zinc-800">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                                                <div className="w-1 h-3 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                                                Tóm tắt hoạt động
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex gap-4 items-center">
                                                <div className="h-10 w-10 shrink-0 bg-background rounded-xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                                    <BookOpen size={18} className="text-zinc-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground leading-none">{user.stats?.totalEnrollments || 0}</p>
                                                    <p className="text-xs text-zinc-400 mt-1.5 font-medium">Khóa học đăng ký</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <div className="h-10 w-10 shrink-0 bg-background rounded-xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                                    <Package size={18} className="text-zinc-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground leading-none">{user.purchasedProducts?.length || 0}</p>
                                                    <p className="text-xs text-zinc-400 mt-1.5 font-medium">Sản phẩm sở hữu</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <div className="h-10 w-10 shrink-0 bg-background rounded-xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                                    <CreditCard size={18} className="text-zinc-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground leading-none">{user.orders?.length || 0}</p>
                                                    <p className="text-xs text-zinc-400 mt-1.5 font-medium">Tổng đơn hàng</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="overflow-hidden border shadow-none bg-card border-zinc-200 dark:border-zinc-800">
                                        <CardHeader>
                                            <CardTitle className="text-sm font-bold">Thiết bị gần nhất</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {user.activities?.[0] ? (
                                                <div className="flex gap-3 overflow-hidden">
                                                    <Monitor size={18} className="text-muted-foreground mt-0.5 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-normal text-zinc-600 break-words line-clamp-3">{user.activities[0].device || 'Hệ điều hành / Trình duyệt'}</p>
                                                        <p className="text-xs text-zinc-400 mt-1">{user.activities[0].ipAddress}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-muted-foreground">Chưa có thông tin</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )
                        }

                        {
                            activeTab === 'courses' && (
                                <Card className="overflow-hidden border shadow-none bg-card border-zinc-200 dark:border-zinc-800">
                                    <div className="border-b p-6 space-y-4">
                                        <div className="w-full text-left space-y-1">
                                            <CardTitle className="text-base">Khóa học đã đăng ký</CardTitle>
                                            <CardDescription>Danh sách tất cả các khóa học người dùng đã truy cập.</CardDescription>
                                        </div>
                                        <div className="flex gap-2 w-full">
                                            <select
                                                className="flex-1 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 h-10 bg-background dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
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
                                                className="bg-zinc-900 dark:bg-zinc-100 h-10 text-white dark:text-zinc-900 shadow-none hover:bg-zinc-800 dark:hover:bg-zinc-200"
                                                disabled={!selectedCourse}
                                                onClick={() => handleAction(() => api.admin.enrollUser(id as string, selectedCourse), 'Đã kích hoạt khóa học thành công')}
                                            >
                                                Kích hoạt thủ công
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-4 w-full">
                                            {user.enrollments?.map((enroll: any) => (
                                                <div key={enroll.id} className="flex gap-4 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors w-full group items-start bg-card">
                                                    <div className="h-20 w-32 shrink-0 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                                                        {enroll.course?.thumbnail && <img src={enroll.course.thumbnail} className="h-full w-full object-cover" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                                                        <div>
                                                            <h4 className="font-bold text-sm text-zinc-900 truncate">{enroll.course?.title}</h4>
                                                            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                                                                <Clock size={10} /> Đã kích hoạt: {formatDate(enroll.createdAt)}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-3 items-center mt-auto">
                                                            <Link href={`/admin/courses/${enroll.courseId}`} className="text-xs font-bold text-zinc-900 hover:underline">Quản lý nội dung</Link>
                                                            <div className="w-px h-3 bg-zinc-200" />
                                                            <button
                                                                className="text-xs font-bold text-zinc-500 hover:underline hover:text-zinc-900"
                                                                onClick={() => handleAction(() => api.admin.unenrollUser(id as string, enroll.courseId), 'Đã gỡ quyền truy cập khóa học', 'Gỡ quyền truy cập khóa học này?')}
                                                            >
                                                                Gỡ quyền
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!user.enrollments || user.enrollments.length === 0) && (
                                                <div className="text-center py-20 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
                                                    <BookOpen className="h-8 w-8 mx-auto text-zinc-300 mb-2" />
                                                    <p className="text-sm text-zinc-500 font-medium">Chưa đăng ký khóa học nào</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        }

                        {
                            activeTab === 'products' && (
                                <Card className="overflow-hidden border shadow-none bg-white border-zinc-200">
                                    <CardHeader>
                                        <CardTitle className="text-base">Sản phẩm & Tải xuống</CardTitle>
                                        <CardDescription>Các Templates, Apps hoặc License mà người dùng đã mua.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b bg-muted/30">
                                                        <th className="text-left py-3 px-4 font-bold text-xs">Tên sản phẩm</th>
                                                        <th className="text-left py-3 px-4 font-bold text-xs">Phiên bản ghi nhận</th>
                                                        <th className="text-left py-3 px-4 font-bold text-xs">Ngày mua</th>
                                                        <th className="text-center py-3 px-4 font-bold text-xs">Tính năng</th>
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
                                                                    <span className="font-bold text-foreground">{p.title}</span>
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
                            )
                        }

                        {
                            activeTab === 'membership' && (
                                <div className="space-y-6">
                                    <Card className="overflow-hidden border shadow-none bg-white border-zinc-200">
                                        <CardHeader>
                                            <CardTitle className="text-base">Quản lý Gói Hội Viên</CardTitle>
                                            <CardDescription>Cấp quyền hội viên Premium để truy cập tất cả nội dung.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex items-center justify-between p-4 border dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isMemberActive ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border' : 'bg-muted text-muted-foreground'}`}>
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
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isMemberActive ? 'bg-zinc-900 text-zinc-100' : 'bg-muted text-zinc-500'}`}>
                                                    {isMemberActive ? 'Active' : 'None'}
                                                </span>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end p-4 border dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-medium text-zinc-400">Gói hội viên</label>
                                                    <select
                                                        className="w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 h-10 bg-background dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer text-foreground"
                                                        value={membershipForm.tier}
                                                        onChange={(e) => setMembershipForm({ ...membershipForm, tier: e.target.value })}
                                                    >
                                                        <option value="FREE">Free</option>
                                                        <option value="PRO">Pro</option>
                                                        <option value="PREMIUM">Premium</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-medium text-zinc-400">Ngày hết hạn</label>
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
                                                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-full rounded-lg"
                                                        onClick={handleSaveMembership}
                                                        disabled={!!processingAction}
                                                    >
                                                        {processingAction === 'loading' ? <Loader2 size={16} className="animate-spin mr-2" /> : <div className="flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Lưu thay đổi</div>}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-4 border-t border-zinc-100">
                                                <h4 className="text-xs font-medium text-zinc-400">Lịch sử Membership</h4>
                                                <div className="space-y-2 border rounded-xl overflow-hidden">
                                                    {user.subscriptions?.map((s: any) => (
                                                        <div key={s.id} className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-muted/20">
                                                            <div className="flex items-center gap-3 text-sm">
                                                                <History size={14} className="text-muted-foreground" />
                                                                <span className="font-medium">{s.product?.title || 'System Plan'}</span>
                                                            </div>
                                                            <div className="flex gap-4 items-center">
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(s.startDate).toLocaleDateString('vi-VN')} - {new Date(s.endDate).toLocaleDateString('vi-VN')}
                                                                </span>
                                                                <span className={`text-xs font-medium ${s.status === 'ACTIVE' ? 'text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full bg-background' : 'text-zinc-400'}`}>
                                                                    {s.status === 'ACTIVE' ? 'Active' : 'Expired'}
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
                                <Card className="overflow-hidden border shadow-none bg-white border-zinc-200">
                                    <CardHeader>
                                        <CardTitle className="text-base">Lịch sử đơn hàng</CardTitle>
                                        <CardDescription>Tất cả các giao dịch thanh toán và đơn hàng chờ xử lý.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b bg-zinc-50/50">
                                                        <th className="text-left py-3 px-4 font-medium text-zinc-400 text-xs">Mã đơn</th>
                                                        <th className="text-left py-3 px-4 font-medium text-zinc-400 text-xs">Nội dung</th>
                                                        <th className="text-right py-3 px-4 font-medium text-zinc-400 text-xs">Số tiền</th>
                                                        <th className="text-center py-3 px-4 font-medium text-zinc-400 text-xs">Trạng thái</th>
                                                        <th className="text-right py-3 px-4 font-medium text-zinc-400 text-xs">Ngày tạo</th>
                                                        <th className="text-center py-3 px-4 font-medium text-zinc-400 text-xs">Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y text-xs">
                                                    {user.orders?.map((order: any) => (
                                                        <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                                                            <td className="py-3 px-4 font-medium font-mono text-zinc-900">
                                                                {order.code}
                                                            </td>
                                                            <td className="py-3 px-4 max-w-[250px] truncate font-medium">
                                                                {order.items?.map((item: any) => item.course?.title || item.product?.title).join(', ') || 'N/A'}
                                                            </td>
                                                            <td className="py-3 px-4 text-right font-medium text-sm text-zinc-900">
                                                                {formatCurrency(order.amount)}
                                                            </td>
                                                            <td className="py-3 px-4 text-center">
                                                                <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${order.status === 'PAID' ? 'bg-zinc-900 text-zinc-100' :
                                                                    order.status === 'PENDING' ? 'bg-zinc-100 text-zinc-900 border border-zinc-200' :
                                                                        'bg-muted text-zinc-400'
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
                            activeTab === 'notes' && (
                                <div className="space-y-6">
                                    <Card className="overflow-hidden border shadow-none bg-white border-zinc-200">
                                        <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <MessageSquare size={18} /> Ghi chú & Chăm sóc khách hàng
                                            </CardTitle>
                                            <CardDescription>Lưu lại các thông tin tư vấn, phàn hồi hoặc ghi chú đặc biệt về khách hàng.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex gap-4">
                                                <textarea
                                                    className="flex-1 min-h-[100px] p-3 text-sm border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none bg-background dark:bg-zinc-900 text-foreground"
                                                    placeholder="Nhập ghi chú mới tại đây..."
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                />
                                                <Button
                                                    className="self-end h-10 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                                                    disabled={!newNote || processingAction === 'note'}
                                                    onClick={() => handleAction(async () => {
                                                        const note = await api.admin.notes.add(id as string, newNote);
                                                        setNotes([note, ...notes]);
                                                        setNewNote('');
                                                    }, 'Đã lưu ghi chú', '')}
                                                >
                                                    {processingAction === 'note' ? <Loader2 size={16} className="animate-spin" /> : 'Lưu ghi chú'}
                                                </Button>
                                            </div>

                                            <div className="space-y-4 pt-6 border-t border-zinc-100">
                                                <h4 className="text-xs font-medium text-zinc-400">Lịch sử ghi chú</h4>
                                                <div className="space-y-3">
                                                    {notes.map((note: any) => (
                                                        <div key={note.id} className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-2">
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                                                                    <Clock size={10} /> {formatDate(note.createdAt)}
                                                                </span>
                                                                <span className="text-xs bg-white border border-zinc-200 px-2 py-0.5 rounded-full text-zinc-600 font-medium">
                                                                    {note.adminName || 'Admin'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                                        </div>
                                                    ))}
                                                    {notes.length === 0 && (
                                                        <div className="text-center py-20 text-zinc-400 text-sm">Chưa có ghi chú nào.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        }

                        {
                            activeTab === 'invoices' && (
                                <div className="space-y-6">
                                    <Card className="overflow-hidden border shadow-none bg-white border-zinc-200">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        <FileText size={18} /> Hồ sơ xuất hóa đơn
                                                    </CardTitle>
                                                    <CardDescription>Danh sách các pháp nhân khách hàng dùng để xuất hóa đơn VAT.</CardDescription>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-zinc-200"
                                                    onClick={() => setShowInvoiceForm(!showInvoiceForm)}
                                                >
                                                    <Plus size={16} className="mr-1" /> Thêm hồ sơ mới
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {showInvoiceForm && (
                                                <div className="p-5 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-zinc-400">Tên công ty</label>
                                                        <input
                                                            className="w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 h-10 bg-background dark:bg-zinc-900 text-foreground"
                                                            value={invoiceForm.companyName}
                                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, companyName: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-zinc-400">Mã số thuế</label>
                                                        <input
                                                            className="w-full text-sm border border-zinc-200 rounded-lg px-3 h-10 bg-white"
                                                            value={invoiceForm.taxCode}
                                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, taxCode: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-xs font-medium text-zinc-400">Địa chỉ công ty</label>
                                                        <input
                                                            className="w-full text-sm border border-zinc-200 rounded-lg px-3 h-10 bg-white"
                                                            value={invoiceForm.address}
                                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, address: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-zinc-400">Email nhận hóa đơn</label>
                                                        <input
                                                            className="w-full text-sm border border-zinc-200 rounded-lg px-3 h-10 bg-white"
                                                            value={invoiceForm.email}
                                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, email: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 self-end h-10">
                                                        <input
                                                            type="checkbox"
                                                            id="isDefault"
                                                            className="rounded border-zinc-300"
                                                            checked={invoiceForm.isDefault}
                                                            onChange={(e) => setInvoiceForm({ ...invoiceForm, isDefault: e.target.checked })}
                                                        />
                                                        <label htmlFor="isDefault" className="text-xs text-zinc-600 cursor-pointer">Đặt làm mặc định</label>
                                                    </div>
                                                    <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                                                        <Button variant="ghost" size="sm" onClick={() => setShowInvoiceForm(false)}>Hủy</Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-zinc-900"
                                                            onClick={() => handleAction(async () => {
                                                                const profile = await api.admin.invoices.createProfile(id as string, invoiceForm);
                                                                setInvoiceProfiles([profile, ...invoiceProfiles]);
                                                                setShowInvoiceForm(false);
                                                                setInvoiceForm({ companyName: '', taxCode: '', address: '', email: '', isDefault: false });
                                                            }, 'Đã thêm hồ sơ hóa đơn', '')}
                                                        >
                                                            <Save size={14} className="mr-1" /> Lưu hồ sơ
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid gap-4 md:grid-cols-2">
                                                {invoiceProfiles.map((profile: any) => (
                                                    <div key={profile.id} className={`p-5 border rounded-2xl space-y-3 transition-all ${profile.isDefault ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300'}`}>
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="text-sm font-bold text-zinc-900">{profile.companyName}</h4>
                                                            {profile.isDefault && <span className="bg-zinc-900 text-white text-xs px-2 py-0.5 rounded-full">Mặc định</span>}
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <div className="text-xs flex items-center justify-between">
                                                                <span className="text-zinc-400">MST:</span>
                                                                <span className="font-medium text-zinc-900">{profile.taxCode}</span>
                                                            </div>
                                                            <div className="text-xs flex flex-col gap-0.5">
                                                                <span className="text-zinc-400">Địa chỉ:</span>
                                                                <span className="font-medium text-zinc-900 line-clamp-2 leading-relaxed">{profile.address}</span>
                                                            </div>
                                                            {profile.email && (
                                                                <div className="text-xs flex items-center justify-between">
                                                                    <span className="text-zinc-400">Email:</span>
                                                                    <span className="font-medium text-zinc-900">{profile.email}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {invoiceProfiles.length === 0 && !showInvoiceForm && (
                                                    <div className="col-span-2 text-center py-20 bg-zinc-50 border border-dashed rounded-2xl text-zinc-400 text-sm">
                                                        Chưa có hồ sơ hóa đơn nào được lưu.
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        }

                        {
                            activeTab === 'logs' && (
                                <div className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <Card className="overflow-hidden border shadow-none bg-white border-zinc-200">
                                            <CardHeader>
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <ShieldAlert size={18} className="text-zinc-900" /> Cảnh báo bảo mật
                                                </CardTitle>
                                                <CardDescription>Các hành vi bất thường hoặc vi phạm chính sách.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {user.securityLogs?.filter((l: any) => ['FAILED_LOGIN', 'ACCESS_DENIED'].includes(l.action)).map((log: any) => (
                                                        <div key={log.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex gap-3">
                                                            <Ban size={16} className="text-zinc-500 shrink-0 mt-0.5" />
                                                            <div className="flex-1">
                                                                <p className="text-xs font-medium text-zinc-900">{log.action}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">{log.details || 'Hành vi cố gắng truy cập trái phép'}</p>
                                                                <p className="text-xs text-muted-foreground/50 mt-1">{formatDate(log.createdAt)} • IP: {log.ipAddress}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(!user.securityLogs || user.securityLogs.length === 0) && (
                                                        <div className="py-10 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                                                            <CheckCircle2 size={24} className="text-zinc-300 opacity-30" />
                                                            Tài khoản sạch, không có cảnh báo bảo mật nào.
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="overflow-hidden border shadow-none bg-white border-zinc-200">
                                            <CardHeader>
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Laptop size={18} className="text-zinc-900" /> Lịch sử đăng nhập & IP
                                                </CardTitle>
                                                <CardDescription>Theo dõi danh sách các địa chỉ IP và trình duyệt gần đây.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {user.activities?.filter((l: any) => l.action === 'login').slice(0, 10).map((act: any) => (
                                                        <div key={act.id} className="flex justify-between items-center p-2 rounded hover:bg-muted/30 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <Globe size={14} className="text-zinc-400" />
                                                                <code className="text-xs font-mono font-medium bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">{act.ipAddress}</code>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{formatDate(act.createdAt)}</span>
                                                        </div>
                                                    ))}
                                                    {(!user.activities || user.activities.filter((l: any) => l.action === 'login').length === 0) && (
                                                        <p className="text-center py-10 text-xs text-muted-foreground">Chưa có lịch sử đăng nhập.</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card className="overflow-hidden border shadow-none bg-white border-zinc-200">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <History size={18} className="text-muted-foreground" /> Nhật ký hành vi chi tiết
                                                </CardTitle>
                                                <CardDescription>Toàn bộ hành động của người dùng trên hệ thống.</CardDescription>
                                            </div>
                                            <span className="text-xs font-medium text-zinc-400 border border-zinc-100 px-2 py-1 rounded-lg">Latest 100 Logs</span>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 no-scrollbar border rounded-xl overflow-hidden divide-y">
                                                {user.activities?.map((act: any) => (
                                                    <div key={act.id} className="p-3 hover:bg-muted/30 transition-colors flex items-center gap-4 group">
                                                        <div className="shrink-0">
                                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-zinc-50 text-zinc-500 border border-zinc-100`}>
                                                                <Activity size={14} />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold capitalize">{act.action.replace(/_/g, ' ')}</span>
                                                                {act.path && <span className="text-xs bg-muted px-1.5 py-0.2 rounded text-muted-foreground truncate max-w-[200px]">{act.path}</span>}
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-0.5">
                                                                <span className="text-xs text-muted-foreground font-medium">{formatDate(act.createdAt)}</span>
                                                                <span className="text-xs text-muted-foreground">• IP: {act.ipAddress}</span>
                                                                {act.metadata && <span className="text-xs text-muted-foreground hidden group-hover:inline">• Meta: {act.metadata.length > 50 ? act.metadata.substring(0, 50) + '...' : act.metadata}</span>}
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} className="text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                                {(!user.activities || user.activities.length === 0) && (
                                                    <p className="text-center py-20 text-sm text-muted-foreground">Không có nhật ký hành vi được ghi nhận.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
