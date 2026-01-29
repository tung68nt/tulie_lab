'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pagination } from '@/components/Pagination';
import { Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import {
    ChevronRight, User, Shield, Clock, Crown, Calendar,
    Search, RotateCcw, Loader2, Mail, Eye, LogIn,
    Users, CreditCard, Library, ShieldCheck, AlertCircle, UserX
} from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

export default function AdminUsersPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filter, setFilter] = useState<string>('');
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        totalCourses: 0,
        totalTemplates: 0,
        totalBoth: 0,
        totalExpiring: 0,
        totalInactive: 0
    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset page when search or filter changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filter]);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const result: any = await api.admin.listUsers({
                page,
                limit: 20,
                search: debouncedSearch,
                filter: filter || undefined
            });

            if (result && result.data) {
                setUsers(result.data);
                if (result.stats) {
                    setStats(result.stats);
                }
                if (result.pagination) {
                    setPage(result.pagination.page);
                    setTotalPages(result.pagination.totalPages);
                    setTotal(result.pagination.total);
                }
            }
        } catch (e) {
            console.error('Failed to fetch data', e);
            addToast('Lỗi tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, filter, addToast]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const getRemainingDays = (endDate: string) => {
        if (!endDate) return null;
        const diff = new Date(endDate).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    const formatDate = (date: string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const handleReset = () => {
        setSearch('');
        setFilter('');
        setPage(1);
    };

    const getStatusLabels = (user: any) => {
        if (user.role === 'ADMIN') return <span className="px-2 py-0.5 rounded bg-zinc-950 text-white text-[10px] font-bold">ADMIN</span>;

        const sub = user.subscriptions?.[0];
        if (sub) {
            const days = getRemainingDays(sub.endDate);
            return (
                <div className="flex flex-col gap-1 items-start">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 text-[10px] font-bold border border-zinc-200">
                        {sub.product?.title?.replace(' Membership', '') || 'PREMIUM'}
                    </span>
                    {days !== null && days > 0 && (
                        <span className={`text-[10px] font-medium ${days <= 14 ? 'text-red-600' : 'text-zinc-500'}`}>
                            Còn {days} ngày
                        </span>
                    )}
                    {days !== null && days <= 0 && (
                        <span className="text-[10px] font-medium text-red-600">Hết hạn</span>
                    )}
                </div>
            );
        }

        return <span className="px-2 py-0.5 rounded bg-zinc-50 text-muted-foreground text-[10px] font-bold border border-zinc-100">FREE</span>;
    };

    return (
        <div className="admin-container space-y-6">
            <AdminPageHeader
                title="Quản lý thành viên"
                subtitle="Danh sách và phân loại người dùng hệ thống"
            />

            {/* Stats Grid */}
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {[
                    { label: 'Total', icon: Users, value: stats.total, id: '' },
                    { label: 'Courses', icon: Library, value: stats.totalCourses, id: 'course' },
                    { label: 'Templates', icon: CreditCard, value: stats.totalTemplates, id: 'template' },
                    { label: 'Both', icon: ShieldCheck, value: stats.totalBoth, id: 'both' },
                    { label: 'Expiring', icon: AlertCircle, value: stats.totalExpiring, id: 'expiring_soon' },
                    { label: 'Inactive', icon: UserX, value: stats.totalInactive, id: 'inactive' },
                ].map((item, idx) => (
                    <Card
                        key={idx}
                        className={`cursor-pointer hover:border-zinc-900 transition-all border shadow-none bg-white ${filter === item.id ? 'border-zinc-950 ring-1 ring-zinc-950' : 'border-zinc-200'}`}
                        onClick={() => setFilter(item.id)}
                    >
                        <CardContent className="!p-4 flex flex-col items-center justify-center text-center space-y-2 h-[110px]">
                            <item.icon size={18} className={filter === item.id ? 'text-zinc-950' : 'text-muted-foreground'} />
                            <div className="text-2xl font-bold text-zinc-950 tabular-nums">{item.value.toLocaleString('vi-VN')}</div>
                            <div className="text-[10px] font-bold text-muted-foreground tracking-wider">{item.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                        placeholder="Tìm kiếm theo tên, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    className="px-4 py-2 border rounded-lg bg-background text-sm font-medium border-zinc-200"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="">Tất cả phân loại</option>
                    <option value="course">Đã mua khóa học</option>
                    <option value="template">Đã mua template</option>
                    <option value="both">Đã mua cả hai</option>
                    <option value="expiring_soon">Sắp hết hạn gói</option>
                    <option value="inactive">Không hoạt động (14 ngày)</option>
                    <option value="admin">Quản trị viên</option>
                </select>
                <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 shrink-0 border-zinc-200">
                    <RotateCcw size={14} />
                    Reset
                </Button>
            </div>

            {/* Members Table */}
            <Card className="border shadow-none bg-white border-zinc-200">
                <CardHeader className="border-b bg-zinc-50/50 py-4 px-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-bold text-zinc-900">
                        Danh sách kết quả ({loading ? '...' : total})
                    </CardTitle>
                </CardHeader>
                <CardContent className="!p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            Không tìm thấy thành viên nào
                        </div>
                    ) : (
                        <div className="overflow-x-auto overflow-y-hidden">
                            <table className="w-full text-[13px] border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-100">
                                        <th className="text-left font-bold text-zinc-500 py-3 px-6 w-[250px]">Thành viên</th>
                                        <th className="text-center font-bold text-zinc-500 py-3 px-4">Quyền hạn / Gói cước</th>
                                        <th className="text-right font-bold text-zinc-500 py-3 px-4">Ngày gia nhập</th>
                                        <th className="text-right font-bold text-zinc-500 py-3 px-4">Hoạt động cuối</th>
                                        <th className="text-center py-3 px-6"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="group border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/admin/users/${user.id}`)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 border border-zinc-200 shrink-0">
                                                        {user.profile?.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-zinc-900 truncate">{user.profile?.name || 'Chưa đặt tên'}</div>
                                                        <div className="text-[11px] text-zinc-500 truncate">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 align-top text-center">
                                                <div className="inline-flex justify-center">
                                                    {getStatusLabels(user)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right text-zinc-500 align-top">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-medium text-zinc-900">{formatDate(user.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right align-top">
                                                <div className="flex flex-col items-end">
                                                    {user.lastLoginAt ? (
                                                        <>
                                                            <span className="font-medium text-zinc-900">{formatDate(user.lastLoginAt)}</span>
                                                            <span className="text-[10px] text-zinc-500">Đã đăng nhập</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-zinc-400">Chưa hoạt động</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-zinc-100 transition-all text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 duration-200">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={stats.total}
                onPageChange={setPage}
                className="mt-6"
            />
        </div>
    );
}
