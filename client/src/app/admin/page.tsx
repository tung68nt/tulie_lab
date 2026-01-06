'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { CheckCircle2, Clock, Users, BookOpen, DollarSign, ShoppingCart, TrendingUp, Download, RefreshCcw, UserX, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
    totalRevenue: number;
    monthlyRevenue: number;
    totalOrders: number;
    paidOrders: number;
    pendingOrders: number;
    totalUsers: number;
    activeUsers: number;
    totalCourses: number;
    monthlyData: { month: string; revenue: number; orders: number; users: number }[];
    recentOrders: { id: string; code: string; amount: number; status: string; createdAt: string; userName: string }[];
}

// Simple Bar Chart - Black/White only, always visible bars
function BarChart({ data, label }: { data: { month: string; value: number; date?: Date }[]; label: string }) {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const isDense = data.length > 15; // Trigger for > 15 items (e.g. 30 days)

    // Grid ticks calculation (5 lines: 100%, 75%, 50%, 25%, 0%)
    const ticks = [1, 0.75, 0.5, 0.25, 0].map(r => Math.round(maxValue * r));

    // Helper to check if date is weekend (Saturday=6, Sunday=0)
    const isWeekend = (dateStr: string) => {
        // Parse date from dd/mm or dd/mm/yyyy format
        const parts = dateStr.split('/');
        if (parts.length >= 2) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const year = parts.length === 3 ? parseInt(parts[2]) : new Date().getFullYear();
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            return dayOfWeek === 0 || dayOfWeek === 6;
        }
        return false;
    };

    return (
        <div className="w-full pt-6">
            <div className="flex gap-2">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between h-[140px] text-[10px] text-muted-foreground w-auto text-right min-w-[30px] select-none py-0">
                    {ticks.map((tick, i) => (
                        <div key={i} className={`leading-none ${i === 0 ? '-mt-1' : i === 4 ? '-mb-1' : ''}`}>
                            {tick.toLocaleString('vi-VN', { notation: 'compact', maximumFractionDigits: 1 })}
                        </div>
                    ))}
                </div>

                {/* Chart Area - Full Fit Container */}
                <div className="flex-1 min-w-0 w-full">
                    <div className="relative h-[140px] w-full">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between w-full h-full pointer-events-none">
                            {ticks.map((_, i) => (
                                <div key={i} className={`w-full border-t ${i === 4 ? 'border-foreground/20' : 'border-dashed border-gray-200 dark:border-gray-800'}`} style={{ height: 0 }} />
                            ))}
                        </div>


                        {/* Bars Container */}
                        <div className="absolute inset-0 flex items-end justify-between gap-[1px] w-full h-full z-10">
                            {data.map((item, index) => {
                                const weekend = isWeekend(item.month);
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center min-w-0 group h-full justify-end">
                                        <div className="relative w-full flex justify-center" style={{ height: `${Math.max((item.value / maxValue) * 100, 1)}%` }}>
                                            {/* Value label */}
                                            <div className={`text-[10px] sm:text-xs mb-1 text-center 
                                                ${weekend ? 'text-foreground font-semibold' : 'text-muted-foreground'}
                                                ${isDense
                                                    ? 'opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded shadow-md z-20 border text-xs whitespace-nowrap pointer-events-none w-auto'
                                                    : 'truncate absolute bottom-full left-0 right-0 w-full'}`}
                                            >
                                                {item.value.toLocaleString('vi-VN')}
                                            </div>
                                            {/* Bar */}
                                            <div
                                                className={`transition-all hover:opacity-80 ${weekend ? 'bg-zinc-300' : 'bg-foreground'} w-[90%] max-w-[20px] h-full`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* X-axis Labels */}
                    <div className={`flex justify-between gap-[1px] mt-4 text-xs text-muted-foreground items-start w-full ${isDense ? 'h-28' : 'h-16'}`}>
                        {data.map((d, i) => {
                            const weekend = isWeekend(d.month);
                            return (
                                <div
                                    key={i}
                                    className="flex-1 relative min-w-0"
                                >
                                    <span className={`absolute left-1/2 whitespace-nowrap text-[8px] ${weekend ? 'text-foreground font-bold' : ''} 
                                    transform origin-top-right -rotate-45 -translate-x-full`}>
                                        {d.month}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className={`text-center text-xs text-muted-foreground font-medium ${isDense ? '-mt-4' : 'mt-4'}`}>{label}</div>
        </div >
    );
}

export default function AdminDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'period' | 'month'>('period');
    const [timePeriod, setTimePeriod] = useState('thisMonth');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [exporting, setExporting] = useState(false);
    const [inactiveUsers, setInactiveUsers] = useState<any[]>([]);
    const [loadingInactive, setLoadingInactive] = useState(false);

    useEffect(() => {
        loadData();
        loadInactiveUsers();
    }, [filterType, timePeriod, selectedMonth, selectedYear]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [coursesRes, usersRes, ordersRes]: any = await Promise.all([
                api.admin.courses.list().catch(() => []),
                api.admin.users.list().catch(() => []),
                api.admin.orders.list().catch(() => [])
            ]);

            const courses = Array.isArray(coursesRes) ? coursesRes : [];
            const users = Array.isArray(usersRes) ? usersRes : [];
            const orders = Array.isArray(ordersRes) ? ordersRes : [];

            const paidOrders = orders.filter((o: any) => o.status === 'PAID' || o.status === 'COMPLETED');
            const pendingOrders = orders.filter((o: any) => o.status === 'PENDING');
            const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0);


            // Generate chart data based on selected time period using REAL ORDER DATA
            const generateChartData = () => {
                const today = new Date();
                const paidOrderList = orders.filter((o: any) => o.status === 'PAID' || o.status === 'COMPLETED');
                const userList = users;

                // Helper to aggregate orders by date
                const aggregateByDate = (startDate: Date, endDate: Date, groupBy: 'day' | 'week' | 'month') => {
                    const result: { month: string; revenue: number; orders: number; users: number }[] = [];

                    if (groupBy === 'day') {
                        const current = new Date(startDate);
                        while (current <= endDate) {
                            const dateStr = `${String(current.getDate()).padStart(2, '0')}/${String(current.getMonth() + 1).padStart(2, '0')}/${current.getFullYear()}`;
                            const dayStart = new Date(current);
                            dayStart.setHours(0, 0, 0, 0);
                            const dayEnd = new Date(current);
                            dayEnd.setHours(23, 59, 59, 999);

                            const dayOrders = paidOrderList.filter((o: any) => {
                                const orderDate = new Date(o.createdAt);
                                return orderDate >= dayStart && orderDate <= dayEnd;
                            });

                            const dayUsers = userList.filter((u: any) => {
                                const userDate = new Date(u.createdAt);
                                return userDate >= dayStart && userDate <= dayEnd;
                            });

                            result.push({
                                month: dateStr,
                                revenue: dayOrders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0),
                                orders: dayOrders.length,
                                users: dayUsers.length
                            });

                            current.setDate(current.getDate() + 1);
                        }
                    } else if (groupBy === 'week') {
                        const current = new Date(startDate);
                        let weekNum = 1;
                        while (current <= endDate) {
                            const weekStart = new Date(current);
                            const weekEnd = new Date(current);
                            weekEnd.setDate(weekEnd.getDate() + 6);

                            const label = `W${weekNum} - ${String(weekStart.getMonth() + 1).padStart(2, '0')}/${weekStart.getFullYear()}`;

                            const weekOrders = paidOrderList.filter((o: any) => {
                                const orderDate = new Date(o.createdAt);
                                return orderDate >= weekStart && orderDate <= weekEnd;
                            });

                            const weekUsers = userList.filter((u: any) => {
                                const userDate = new Date(u.createdAt);
                                return userDate >= weekStart && userDate <= weekEnd;
                            });

                            result.push({
                                month: label,
                                revenue: weekOrders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0),
                                orders: weekOrders.length,
                                users: weekUsers.length
                            });

                            current.setDate(current.getDate() + 7);
                            weekNum++;
                        }
                    } else if (groupBy === 'month') {
                        const current = new Date(startDate);
                        while (current <= endDate) {
                            const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
                            const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59, 999);

                            const label = `${String(current.getMonth() + 1).padStart(2, '0')}/${current.getFullYear()}`;

                            const monthOrders = paidOrderList.filter((o: any) => {
                                const orderDate = new Date(o.createdAt);
                                return orderDate >= monthStart && orderDate <= monthEnd;
                            });

                            const monthUsers = userList.filter((u: any) => {
                                const userDate = new Date(u.createdAt);
                                return userDate >= monthStart && userDate <= monthEnd;
                            });

                            result.push({
                                month: label,
                                revenue: monthOrders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0),
                                orders: monthOrders.length,
                                users: monthUsers.length
                            });

                            current.setMonth(current.getMonth() + 1);
                        }
                    }

                    return result;
                };

                if (timePeriod === 'thisMonth') {
                    const year = today.getFullYear();
                    const month = today.getMonth();
                    const startDate = new Date(year, month, 1);
                    const endDate = new Date(year, month + 1, 0);
                    return aggregateByDate(startDate, endDate, 'day');
                } else if (timePeriod === '7d') {
                    const startDate = new Date(today);
                    startDate.setDate(startDate.getDate() - 6);
                    return aggregateByDate(startDate, today, 'day');
                } else if (timePeriod === '30d') {
                    const startDate = new Date(today);
                    startDate.setDate(startDate.getDate() - 29);
                    return aggregateByDate(startDate, today, 'day');
                } else if (timePeriod === 'quarter') {
                    const currentMonth = today.getMonth();
                    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
                    const startDate = new Date(today.getFullYear(), quarterStartMonth, 1);
                    return aggregateByDate(startDate, today, 'week');
                } else if (timePeriod === 'year') {
                    const startDate = new Date(today.getFullYear(), 0, 1);
                    return aggregateByDate(startDate, today, 'month');
                } else if (timePeriod === '90d') {
                    const startDate = new Date(today);
                    startDate.setDate(startDate.getDate() - 84); // 12 weeks
                    return aggregateByDate(startDate, today, 'week');
                } else {
                    const startDate = new Date(today.getFullYear(), 0, 1);
                    return aggregateByDate(startDate, today, 'month');
                }
            };

            const monthlyData = generateChartData();

            setData({
                totalRevenue: totalRevenue,
                monthlyRevenue: paidOrders
                    .filter((o: any) => {
                        const orderDate = new Date(o.createdAt);
                        const now = new Date();
                        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
                    })
                    .reduce((sum: number, o: any) => sum + (o.amount || 0), 0),
                totalOrders: orders.length,
                paidOrders: paidOrders.length,
                pendingOrders: pendingOrders.length,
                totalUsers: users.length,
                activeUsers: users.filter((u: any) => u.enrolledCourses?.length > 0).length,
                totalCourses: courses.length,
                monthlyData,
                recentOrders: orders.slice(0, 5).map((o: any) => ({
                    id: o.id,
                    code: o.orderCode || `ORD-${o.id?.slice(-6)}`,
                    amount: o.amount || 0,
                    status: o.status,
                    createdAt: new Date(o.createdAt).toLocaleDateString('vi-VN'),
                    userName: o.user?.fullName || o.user?.email || 'N/A'
                }))
            });
        } catch (e) {
            console.error('Dashboard load error:', e);
            // On error, show zeros instead of fake data
            setData({
                totalRevenue: 0,
                monthlyRevenue: 0,
                totalOrders: 0,
                paidOrders: 0,
                pendingOrders: 0,
                totalUsers: 0,
                activeUsers: 0,
                totalCourses: 0,
                monthlyData: [],
                recentOrders: []
            });
        }
        setLoading(false);
    };

    const exportToCSV = () => {
        if (!data) return;
        setExporting(true);

        const headers = ['Tháng', 'Doanh thu', 'Số đơn', 'Member mới'];
        const rows = data.monthlyData.map(m => [
            m.month, m.revenue.toString(), m.orders.toString(), m.users.toString()
        ]);

        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        setExporting(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const loadInactiveUsers = async () => {
        setLoadingInactive(true);
        try {
            const users = await api.admin.getInactiveUsers(7);
            setInactiveUsers(Array.isArray(users) ? users.slice(0, 5) : []);
        } catch (e) {
            console.error('Error loading inactive users:', e);
        } finally {
            setLoadingInactive(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-5">
                                <div className="h-3 w-20 bg-muted rounded mb-3" />
                                <div className="h-7 w-28 bg-muted rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6" style={{ paddingBottom: '120px' }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Tổng quan</h1>
                    <p className="text-sm text-muted-foreground">Theo dõi hiệu suất kinh doanh</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {/* Time Period Filter */}
                    <select
                        className="h-9 px-3 text-sm border rounded-lg bg-background"
                        value={filterType === 'period' ? timePeriod : 'month'}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'month') {
                                setFilterType('month');
                            } else {
                                setFilterType('period');
                                setTimePeriod(val);
                            }
                        }}
                    >
                        <option value="thisMonth">Tháng này</option>
                        <option value="7d">7 ngày</option>
                        <option value="30d">30 ngày</option>
                        <option value="quarter">Quý này</option>
                        <option value="year">Năm nay</option>
                        <option value="month">Chọn tháng</option>
                    </select>

                    {/* Month/Year selectors - only show when filterType is 'month' */}
                    {filterType === 'month' && (
                        <>
                            <select
                                className="h-9 px-3 text-sm border rounded-lg bg-background"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                    <option key={m} value={m}>Tháng {m}</option>
                                ))}
                            </select>
                            <select
                                className="h-9 px-3 text-sm border rounded-lg bg-background"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {[2024, 2025, 2026].map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportToCSV}
                        disabled={exporting}
                        className="h-9 whitespace-nowrap"
                    >
                        Xuất CSV
                    </Button>
                </div>
            </div>


            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-sm text-muted-foreground">Tổng doanh thu</div>
                        <div className="text-2xl font-bold my-1">{formatCurrency(data.totalRevenue)}</div>
                        <div className="text-xs text-muted-foreground">
                            {data.totalRevenue > 0
                                ? `Tháng này: ${formatCurrency(data.monthlyRevenue)}`
                                : 'Chưa có doanh thu'}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-sm text-muted-foreground">Tổng đơn hàng</div>
                        <div className="text-2xl font-bold my-1">{data.totalOrders}</div>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-foreground" /> {data.paidOrders} paid</span>
                            <span className="flex items-center gap-1"><Clock size={12} className="text-muted-foreground" /> {data.pendingOrders} pending</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-sm text-muted-foreground">Tổng Member</div>
                        <div className="text-2xl font-bold my-1">{data.totalUsers}</div>
                        <div className="text-xs text-muted-foreground">{data.activeUsers} đang hoạt động</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="!p-6 flex flex-col items-center justify-center h-[120px] text-center">
                        <div className="text-sm text-muted-foreground">Tổng Workshop</div>
                        <div className="text-2xl font-bold my-1">{data.totalCourses}</div>
                        <div className="text-xs text-muted-foreground">Đang hoạt động</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts - Full width, one per row for better visibility */}
            <div className="grid gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Doanh thu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={data.monthlyData.map(m => ({ month: m.month, value: m.revenue / 1000000 }))}
                            label="Triệu VND"
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Đơn hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={data.monthlyData.map(m => ({ month: m.month, value: m.orders }))}
                            label="Số đơn"
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Member mới</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={data.monthlyData.map(m => ({ month: m.month, value: m.users }))}
                            label="Người"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders Table */}
            {data.recentOrders.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Đơn hàng gần đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-3 font-medium">Mã đơn</th>
                                        <th className="text-left py-2 px-3 font-medium">Member</th>
                                        <th className="text-right py-2 px-3 font-medium">Số tiền</th>
                                        <th className="text-center py-2 px-3 font-medium">Trạng thái</th>
                                        <th className="text-right py-2 px-3 font-medium">Ngày</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentOrders.map(order => (
                                        <tr key={order.id} className="border-b hover:bg-muted/50">
                                            <td className="py-2 px-3 text-xs">{order.code}</td>
                                            <td className="py-2 px-3">{order.userName}</td>
                                            <td className="py-2 px-3 text-right font-medium">{formatCurrency(order.amount)}</td>
                                            <td className="py-2 px-3 text-center">
                                                <span className={`px-2 py-0.5 rounded text-xs ${order.status === 'PAID' || order.status === 'COMPLETED'
                                                    ? 'bg-muted text-foreground'
                                                    : 'bg-muted/50 text-muted-foreground'
                                                    }`}>
                                                    {order.status === 'PAID' || order.status === 'COMPLETED' ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 text-right text-muted-foreground">{order.createdAt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Inactive Users Widget */}
            <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <UserX size={18} />
                        Member chưa hoạt động (7 ngày+)
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={loadInactiveUsers} disabled={loadingInactive}>
                        {loadingInactive ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw size={14} />}
                    </Button>
                </CardHeader>
                <CardContent>
                    {loadingInactive ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : inactiveUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            🎉 Tất cả member đều đang hoạt động!
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {inactiveUsers.map((user: any) => (
                                <Link key={user.id} href={`/admin/users/${user.id}`} className="block">
                                    <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg border transition-colors">
                                        <div>
                                            <p className="font-medium">{user.name || user.email}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.courses?.slice(0, 2).join(', ')}{user.courses?.length > 2 && '...'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-orange-600">
                                                {user.daysSinceActivity} ngày
                                            </p>
                                            <p className="text-xs text-muted-foreground">không hoạt động</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {inactiveUsers.length > 0 && (
                                <Link href="/admin/users" className="block text-center py-2 text-sm text-muted-foreground hover:text-foreground">
                                    Xem tất cả →
                                </Link>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
