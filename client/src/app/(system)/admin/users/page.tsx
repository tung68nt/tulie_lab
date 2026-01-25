'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pagination } from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
import { ChevronRight, User, Shield, Clock } from 'lucide-react';
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
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
                                        <p className="font-bold text-sm truncate">{user.profile?.name || 'Chưa đặt tên'}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider ${user.role === 'ADMIN' ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-100 text-zinc-900'
                                            }`}>
                                            {user.role}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                            <Clock size={10} /> {new Date(user.createdAt).toLocaleDateString('vi-VN')}
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
