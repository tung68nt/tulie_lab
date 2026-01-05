'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pagination } from '@/components/Pagination';
import { useToast } from '@/contexts/ToastContext';
import { CheckCircle2, Clock, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const [selectedCourse, setSelectedCourse] = useState<{ [key: string]: string }>({});
    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, coursesData] = await Promise.all([
                    api.admin.listUsers(),
                    api.courses.list()
                ]);
                setUsers(usersData as any[]);
                setCourses(coursesData as any[]);
            } catch (e) {
                console.error('Failed to fetch data', e);
                addToast('Lỗi tải dữ liệu', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEnroll = async (userId: string) => {
        const courseId = selectedCourse[userId];
        if (!courseId) {
            addToast('Vui lòng chọn khóa học', 'warning');
            return;
        }
        try {
            await api.admin.enrollUser(userId, courseId);
            addToast('Đã kích hoạt khóa học thành công', 'success');
            // Refresh details for this user
            fetchUserDetails(userId);
        } catch (e) {
            console.error(e);
            addToast('Lỗi kích hoạt khóa học', 'error');
        }
    };

    const handleUnenroll = async (userId: string, courseId: string) => {
        if (!confirm('Bạn có chắc muốn gỡ khóa học này khỏi học viên?')) return;
        try {
            await api.admin.unenrollUser(userId, courseId);
            addToast('Đã gỡ khóa học thành công', 'success');
            // Refresh details for this user
            fetchUserDetails(userId);
        } catch (e) {
            console.error(e);
            addToast('Lỗi khi gỡ khóa học', 'error');
        }
    };

    const fetchUserDetails = async (userId: string) => {
        try {
            const userDetails = await api.admin.getUser(userId) as any;
            // Update user in the list with details
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...userDetails } : u));
        } catch (e) {
            console.error('Failed to fetch user details', e);
        }
    };

    const toggleExpand = (userId: string) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
        } else {
            setExpandedUser(userId);
            fetchUserDetails(userId);
        }
    };

    // Calculate stats
    const totalStudents = users.filter(u => u.role !== 'ADMIN').length;
    const totalAdmins = users.filter(u => u.role === 'ADMIN').length;

    // Pagination Logic
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    if (loading) return <div className="p-10 text-center">Đang tải...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Quản lý học viên</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-sm text-muted-foreground">Tổng người dùng</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-sm text-muted-foreground">Thành viên</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{totalAdmins}</div>
                        <p className="text-sm text-muted-foreground">Quản trị viên</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách thành viên ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {paginatedUsers.map((user) => (
                            <div key={user.id} className="border rounded-lg overflow-hidden">
                                {/* User Row */}
                                <div
                                    className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                                    onClick={() => toggleExpand(user.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name || 'Chưa đặt tên'}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs px-2 py-1 rounded font-medium ${user.role === 'ADMIN' ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}>
                                            {user.role === 'ADMIN' ? 'Admin' : 'Thành viên'}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {expandedUser === user.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedUser === user.id && (
                                    <div className="p-4 bg-muted/20 border-t space-y-4">
                                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                            {/* Enrolled Courses */}
                                            <div>
                                                <h4 className="font-semibold text-sm mb-3">Workshop đã đăng ký</h4>
                                                {user.enrollments && user.enrollments.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {user.enrollments.map((enr: any) => (
                                                            <li key={enr.id} className="text-sm flex items-center justify-between bg-background p-2 rounded-md border">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle2 size={16} className="text-foreground" />
                                                                    <span className="font-medium">{enr.course?.title || 'Khóa học'}</span>
                                                                    <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                                                                        {new Date(enr.enrolledAt).toLocaleDateString('vi-VN')}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUnenroll(user.id, enr.courseId);
                                                                    }}
                                                                    className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                                                                    title="Gỡ khóa học"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">Chưa đăng ký khóa học nào</p>
                                                )}
                                            </div>

                                            {/* Orders / Payments */}
                                            <div>
                                                <h4 className="font-semibold text-sm mb-3">Lịch sử thanh toán</h4>
                                                {user.orders && user.orders.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {user.orders.map((order: any) => {
                                                            const isPaid = order.status === 'PAID' || order.status === 'COMPLETED';
                                                            return (
                                                                <li key={order.id} className="text-sm flex items-center justify-between bg-background p-2 rounded-md border">
                                                                    <div className="flex items-center gap-2">
                                                                        {isPaid ? (
                                                                            <CheckCircle2 size={16} className="text-foreground" />
                                                                        ) : (
                                                                            <Clock size={16} className="text-muted-foreground" />
                                                                        )}
                                                                        <span className="font-mono text-xs">{order.code}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isPaid ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                                                                            {isPaid ? 'Paid' : 'Pending'}
                                                                        </span>
                                                                        <span className="font-bold">
                                                                            {order.amount === 0 ? 'Free' : new Intl.NumberFormat('vi-VN').format(order.amount) + '₫'}
                                                                        </span>
                                                                    </div>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">Chưa có giao dịch</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Enroll Action */}
                                        <div className="pt-4 border-t">
                                            <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Kích hoạt workshop thủ công</h4>
                                            <div className="flex gap-2 items-center">
                                                <select
                                                    className="border rounded-md px-3 py-2 text-sm flex-1 max-w-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                                                    value={selectedCourse[user.id] || ''}
                                                    onChange={(e) => setSelectedCourse({ ...selectedCourse, [user.id]: e.target.value })}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="">Chọn workshop kích hoạt...</option>
                                                    {courses.map(c => (
                                                        <option key={c.id} value={c.id}>{c.title}</option>
                                                    ))}
                                                </select>
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEnroll(user.id);
                                                    }}
                                                >
                                                    Kích hoạt ngay
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-4">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
