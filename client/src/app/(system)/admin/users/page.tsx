'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pagination } from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
import { ChevronRight, User, Shield, Clock, Crown, Calendar } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    // Pagination & Stats
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ total: 0, admins: 0, users: 0 });
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersResult: any = await api.admin.listUsers({ page, limit: ITEMS_PER_PAGE });

                if (usersResult && usersResult.data) {
                    setUsers(usersResult.data);

                    if (usersResult.stats) {
                        setStats({
                            total: usersResult.stats.total || 0,
                            admins: usersResult.stats.admins || 0,
                            users: usersResult.stats.users || 0
                        });
                        setTotalPages(Math.ceil((usersResult.stats.total || 0) / ITEMS_PER_PAGE));
                    } else if (usersResult.pagination) {
                        setStats(prev => ({ ...prev, total: usersResult.pagination.total }));
                        setTotalPages(usersResult.pagination.totalPages);
                    }
                }
            } catch (e) {
                console.error('Failed to fetch data', e);
                addToast('Lỗi tải dữ liệu', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page]);

    if (loading) return (
        <div className="flex items-center justify-center py-40">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 dark:border-zinc-100 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý thành viên"
                subtitle="Danh sách tất cả người dùng và quản trị viên"
            />

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border shadow-none bg-white border-zinc-200">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Tổng người dùng</div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-sm text-muted-foreground mt-1">Toàn bộ tài khoản hệ thống</p>
                    </CardContent>
                </Card>
                <Card className="border shadow-none bg-white border-zinc-200">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Thành viên</div>
                        <div className="text-2xl font-bold">{stats.users}</div>
                        <p className="text-sm text-muted-foreground mt-1">Tài khoản học viên (USER)</p>
                    </CardContent>
                </Card>
                <Card className="border shadow-none bg-white border-zinc-200">
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Quản trị viên</div>
                        <div className="text-2xl font-bold">{stats.admins}</div>
                        <p className="text-sm text-muted-foreground mt-1">Tài khoản quản lý (ADMIN)</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách thành viên ({stats.total})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="group flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-all cursor-pointer"
                                onClick={() => router.push(`/admin/users/${user.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg text-muted-foreground border shrink-0">
                                        {user.profile?.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm truncate text-zinc-900 dark:text-zinc-100">{user.profile?.name || 'Chưa đặt tên'}</p>
                                        <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden md:flex flex-col items-end gap-1">
                                        {user.role === 'ADMIN' ? (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 border border-zinc-200 px-2.5 py-0.5 rounded bg-zinc-50">
                                                <Shield size={12} />
                                                ADMIN
                                            </div>
                                        ) : user.subscriptions && user.subscriptions[0] ? (
                                            <div className="flex flex-col items-end gap-0.5">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900">
                                                    <Crown size={12} />
                                                    {user.subscriptions[0].product?.title || 'Premium Member'}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                                    <Calendar size={10} />
                                                    Hết hạn: {new Date(user.subscriptions[0].endDate).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-transparent px-2.5 py-0.5">
                                                <User size={12} />
                                                Thành viên
                                            </div>
                                        )}

                                        <span className="text-xs text-muted-foreground/50 flex items-center gap-1 pl-1">
                                            Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground group-hover:translate-x-1 duration-200">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={stats.total}
                        onPageChange={setPage}
                        className="mt-8"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
