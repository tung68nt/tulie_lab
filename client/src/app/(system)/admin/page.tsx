'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { CheckCircle2, Clock, Users, BookOpen, DollarSign, ShoppingCart, TrendingUp, Download, RefreshCcw, RefreshCw, UserX, Loader2, CircleDollarSign, ShoppingBag, Hourglass, UsersRound, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { RealtimeHealthChart } from '@/components/system/analytics/RealtimeHealthChart';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useToast } from '@/contexts/ToastContext';

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

const formatCompactNumber = (value: number) => {
    return value.toLocaleString('vi-VN', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).replace('tr', 'triệu').replace('t', 'tỷ');
};

// Simple Bar Chart - Black/White only, always visible bars
function BarChart({ data }: { data: { month: string; value: number; date?: Date }[] }) {
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
                <div className="flex flex-col justify-between h-[140px] text-xs text-muted-foreground w-auto text-right min-w-[30px] select-none py-0">
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
                                            <div className={`text-xs sm:text-xs mb-1 text-center 
                                                ${!weekend ? 'text-foreground font-semibold' : 'text-muted-foreground'}
                                                ${isDense
                                                    ? 'opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded shadow-md z-20 border text-xs whitespace-nowrap pointer-events-none w-auto'
                                                    : 'truncate absolute bottom-full left-0 right-0 w-full'}`}
                                            >
                                                {item.value.toLocaleString('vi-VN')}
                                            </div>
                                            {/* Bar */}
                                            <div
                                                className={`transition-all hover:opacity-80 ${weekend ? 'bg-muted' : 'bg-foreground'} w-[90%] max-w-[20px] h-full`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* X-axis Labels */}
                    <div className={`flex justify-between gap-[1px] mt-1 text-xs text-muted-foreground items-start w-full ${isDense ? 'h-14' : 'h-8'}`}>
                        {data.map((d, i) => {
                            const weekend = isWeekend(d.month);
                            return (
                                <div
                                    key={i}
                                    className="flex-1 relative min-w-0"
                                >
                                    <span className={`absolute left-1/2 whitespace-nowrap text-[10px] ${!weekend ? 'text-foreground font-bold' : ''} 
                                    transform origin-top-right -rotate-45 -translate-x-full`}>
                                        {d.month}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
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
    const [systemStats, setSystemStats] = useState<any>(null);
    const [syncing, setSyncing] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        loadData();
        loadInactiveUsers();
        loadSystemStats();
    }, [filterType, timePeriod, selectedMonth, selectedYear]);

    const loadSystemStats = async () => {
        try {
            const stats = await api.system.getStats();
            setSystemStats(stats);
        } catch (e) {
            console.error('Failed to load system stats', e);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [coursesRes, usersRes, ordersRes]: any = await Promise.all([
                api.admin.courses.list().catch(() => []),
                api.admin.users.list().catch(() => []),
                api.admin.orders.list({ limit: 1000 }).catch(() => ({ data: [], meta: { stats: {} } })) // Fetch more for charts
            ]);

            const courses = coursesRes?.data || [];
            const users = usersRes?.data || [];
            const orders = ordersRes?.data || [];
            const orderStats = ordersRes?.meta?.stats || {};

            const paidOrders = orders.filter((o: any) => o.status === 'PAID' || o.status === 'COMPLETED');
            const pendingOrders = orders.filter((o: any) => o.status === 'PENDING');

            // Use backend stats if available, otherwise fallback
            const totalRevenue = Number(orderStats.totalRevenue || paidOrders.reduce((sum: number, o: any) => sum + Number(o.amount || 0), 0));

            // Generate chart data... (logic remains, utilizing the 1000 orders fetched)
            // ...

            const generateChartData = () => {
                // ... existing logic ...
                // Note: we're using 'orders' which is now up to 1000 items. 
                // If total orders > 1000, charts will be truncated. 
                // Ideally we should have a separate stats endpoint for charts.
                const today = new Date();
                const paidOrderList = orders.filter((o: any) => o.status === 'PAID' || o.status === 'COMPLETED');
                const userList = users;

                // ...

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
                                revenue: dayOrders.reduce((sum: number, o: any) => sum + Number(o.amount || 0), 0),
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

                // ...

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
                    .reduce((sum: number, o: any) => sum + Number(o.amount || 0), 0),
                totalOrders: orderStats.total || orders.length,
                paidOrders: orderStats.paid || paidOrders.length,
                pendingOrders: orderStats.pending || pendingOrders.length,
                totalUsers: users.length,
                activeUsers: users.filter((u: any) => u.enrolledCourses?.length > 0).length,
                totalCourses: courses.length,
                monthlyData,
                recentOrders: orders.slice(0, 5).map((o: any) => ({
                    id: o.id,
                    code: o.code || o.orderCode || `ORD-${o.id?.slice(-6)}`,
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

        // Load recent transactions as well
        fetchTransactions();

        setLoading(false);
    };

    const fetchTransactions = async () => {
        try {
            const res = await api.admin.payments.getTransactions({ limit: 10 });
            setTransactions(res.data || []);
        } catch (e) {
            console.error('Error fetching transactions:', e);
        }
    };

    const renderTransactionDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return (
            <div className="flex flex-col text-[10px] leading-tight text-muted-foreground">
                <span className="font-bold text-foreground text-xs">
                    {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>
                    {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
            </div>
        );
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await api.admin.payments.syncTransactions();
            addToast(`Đã đồng bộ thành công ${res.result?.processed || 0} giao dịch`, 'success');
            loadData(); // Reload everything
        } catch (error: any) {
            addToast(error.response?.data?.message || 'Lỗi đồng bộ giao dịch', 'error');
        } finally {
            setSyncing(false);
        }
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
            <AdminPageHeader
                title="Tổng quan"
                subtitle="Theo dõi hiệu suất kinh doanh"
                icon={<LayoutDashboard className="w-8 h-8" />}
            >
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
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleSync}
                        disabled={syncing}
                        className="h-9 whitespace-nowrap gap-2"
                    >
                        <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                        {syncing ? 'Đang đồng bộ...' : 'Đồng bộ giao dịch'}
                    </Button>
                </div>
            </AdminPageHeader>


            {/* Stats Cards - Redesigned (Monochrome) */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border shadow-sm">
                    <CardContent className="pt-7 pb-6 px-4 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <CircleDollarSign className="w-5 h-5 text-zinc-900 dark:text-zinc-100" strokeWidth={2} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold tracking-tight text-foreground leading-none">
                                {formatCompactNumber(data.totalRevenue)}
                            </div>
                            <div className="text-sm font-semibold text-muted-foreground">Doanh thu</div>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium pt-1">
                            {data.totalRevenue > 0
                                ? `+${formatCompactNumber(data.monthlyRevenue)} tháng này`
                                : 'Chưa có doanh thu'}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm">
                    <CardContent className="pt-7 pb-6 px-4 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <ShoppingBag className="w-5 h-5 text-zinc-900 dark:text-zinc-100" strokeWidth={2} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold tracking-tight text-foreground leading-none">
                                {data.paidOrders}
                            </div>
                            <div className="text-sm font-semibold text-muted-foreground">Đơn thành công</div>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium pt-1">
                            Tỷ lệ: {data.totalOrders > 0 ? ((data.paidOrders / data.totalOrders) * 100).toFixed(1) : 0}%
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm">
                    <CardContent className="pt-7 pb-6 px-4 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <Hourglass className="w-5 h-5 text-zinc-900 dark:text-zinc-100" strokeWidth={2} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold tracking-tight text-foreground leading-none">
                                {data.pendingOrders}
                            </div>
                            <div className="text-sm font-semibold text-muted-foreground">Đợi xử lý</div>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium pt-1">
                            Cần duyệt: {data.pendingOrders} đơn
                        </div>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm">
                    <CardContent className="pt-7 pb-6 px-4 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <UsersRound className="w-5 h-5 text-zinc-900 dark:text-zinc-100" strokeWidth={2} />
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold tracking-tight text-foreground leading-none">
                                {data.totalUsers}
                            </div>
                            <div className="text-sm font-semibold text-muted-foreground">Học viên</div>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-medium pt-1">
                            {data.activeUsers} đang hoạt động
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts - Single Column Layout */}
            <div className="grid gap-6 grid-cols-1">
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base">Doanh thu</CardTitle>
                        <span className="text-xs text-muted-foreground font-normal">ĐVT: Triệu VND</span>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={data.monthlyData.map(m => ({ month: m.month, value: m.revenue / 1000000 }))}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base">Đơn hàng mới</CardTitle>
                        <span className="text-xs text-muted-foreground font-normal">ĐVT: Đơn</span>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={data.monthlyData.map(m => ({ month: m.month, value: m.orders }))}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base">Học viên mới</CardTitle>
                        <span className="text-xs text-muted-foreground font-normal">ĐVT: Học viên</span>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={data.monthlyData.map(m => ({ month: m.month, value: m.users }))}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Recent Tables Section - Single Column */}
            <div className="space-y-6">
                {/* Recent Orders Table */}
                {data.recentOrders.length > 0 && (
                    <Card className="overflow-hidden border shadow-none border-border">
                        <CardHeader className="py-8 flex flex-col items-center justify-center bg-card border-b space-y-4">
                            <div className="text-center">
                                <CardTitle className="text-base font-bold">Đơn hàng mới nhất</CardTitle>
                                <p className="text-sm text-muted-foreground">5 đơn hàng vừa phát sinh trên hệ thống</p>
                            </div>
                            <Link href="/admin/orders">
                                <Button variant="outline" size="sm" className="h-9 text-xs px-6 font-medium bg-card hover:bg-accent border-border">Chi tiết -{'>'}</Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-bold text-xs text-muted-foreground/70">Mã đơn</th>
                                            <th className="text-left py-3 px-4 font-bold text-xs text-muted-foreground/70">Member</th>
                                            <th className="text-right py-3 px-4 font-bold text-xs text-muted-foreground/70">Số tiền</th>
                                            <th className="text-center py-3 px-4 font-bold text-xs text-muted-foreground/70">Trạng thái</th>
                                            <th className="text-right py-3 px-4 font-bold text-xs text-muted-foreground/70">Thời gian</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {data.recentOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    <span className="text-xs bg-muted px-2 py-1 rounded font-mono font-bold">
                                                        {order.code}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-xs font-medium">{order.userName}</td>
                                                <td className="py-3 px-4 text-right font-medium text-foreground">{formatCurrency(order.amount)}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' || order.status === 'COMPLETED'
                                                        ? 'bg-foreground text-background'
                                                        : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {order.status === 'PAID' || order.status === 'COMPLETED' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                                        {order.status === 'PAID' || order.status === 'COMPLETED' ? 'Paid' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right text-xs text-muted-foreground font-medium">{order.createdAt}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Transactions Table */}
                <Card className="overflow-hidden border shadow-none border-border">
                    <CardHeader className="py-8 flex flex-col items-center justify-center bg-card border-b space-y-4">
                        <div className="text-center">
                            <CardTitle className="text-base font-bold">Lịch sử Giao dịch</CardTitle>
                            <p className="text-sm text-muted-foreground">Các giao dịch tài chính vừa được đồng bộ</p>
                        </div>
                        <Link href="/admin/payments">
                            <Button variant="outline" size="sm" className="h-9 text-xs px-6 font-medium bg-card hover:bg-accent border-border">Chi tiết -{'>'}</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-bold text-xs text-muted-foreground/70">Thời gian</th>
                                        <th className="text-left py-3 px-4 font-bold text-xs text-muted-foreground/70">Ngân hàng</th>
                                        <th className="text-left py-3 px-4 font-bold text-xs text-muted-foreground/70">Nội dung</th>
                                        <th className="text-right py-3 px-4 font-bold text-xs text-muted-foreground/70">Số tiền</th>
                                        <th className="text-center py-3 px-4 font-bold text-xs text-muted-foreground/70 text-nowrap">Mã đơn</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {transactions.length > 0 ? (
                                        transactions.map((tx: any) => (
                                            <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    {renderTransactionDate(tx.transactionDate || tx.createdAt)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-foreground text-xs">{tx.gateway}</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono">{tx.accountNumber}</div>
                                                </td>
                                                <td className="py-3 px-4 min-w-[200px] max-w-[350px]">
                                                    <div className="text-[11px] leading-relaxed break-words text-muted-foreground" title={tx.content || tx.description}>
                                                        {tx.content || tx.description || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-right font-bold text-foreground text-sm">
                                                    {formatCurrency(Number(tx.amountIn))}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {tx.code ? (
                                                        <Link href={tx.orderId ? `/admin/orders/${tx.orderId}` : `/admin/orders?search=${tx.code}`}>
                                                            <div className="group flex items-center justify-center gap-1.5 cursor-pointer">
                                                                <span className="text-[10px] bg-foreground text-background px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap group-hover:bg-primary/80 transition-colors shadow-sm">
                                                                    {tx.code}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground">N/A</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-muted-foreground text-xs">Chưa có giao dịch nào được đồng bộ</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* System Stats Widget - Realtime Chart */}
                <div className="h-auto">
                    <RealtimeHealthChart />
                </div>

                {/* Inactive Users Widget */}
                <Card className="overflow-hidden border shadow-none border-border">
                    <CardHeader className="py-8 flex flex-col items-center justify-center bg-card border-b space-y-4 relative">
                        <div className="absolute top-4 right-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={loadInactiveUsers} disabled={loadingInactive}>
                                {loadingInactive ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw size={14} />}
                            </Button>
                        </div>
                        <div className="text-center">
                            <CardTitle className="text-base font-bold">Học viên nghỉ học ({'>'}14 ngày)</CardTitle>
                            <p className="text-sm text-muted-foreground">Danh sách học viên không đăng nhập hệ thống trong 14 ngày qua</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loadingInactive ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                            </div>
                        ) : inactiveUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mx-auto w-12 h-12 bg-muted flex items-center justify-center rounded-full mb-3">
                                    <CheckCircle2 size={24} className="text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">Tất cả học viên đều đang hoạt động tích cực!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-bold text-xs text-muted-foreground/70">Học viên</th>
                                            <th className="text-left py-3 px-4 font-bold text-xs text-muted-foreground/70">Khoá học</th>
                                            <th className="text-right py-3 px-4 font-bold text-xs text-muted-foreground/70">Vắng mặt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {inactiveUsers.map((user: any) => (
                                            <tr key={user.id} className="group hover:bg-muted/30 transition-colors">
                                                <td className="py-3 px-4">
                                                    <Link href={`/admin/users/${user.id}`} className="block">
                                                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{user.name || 'Chưa đặt tên'}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </Link>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded inline-block max-w-[200px] truncate">
                                                        {user.courses?.length > 0 ? user.courses[0] : 'Chưa đăng ký'}
                                                        {user.courses?.length > 1 && ` +${user.courses.length - 1}`}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className="font-bold text-foreground">{user.daysSinceActivity} ngày</span>
                                                        <span className="text-[10px] text-muted-foreground">Không hoạt động</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {inactiveUsers.length > 0 && (
                                    <div className="p-4 border-t border-border">
                                        <Link href="/admin/users" className="block w-full">
                                            <Button variant="outline" size="sm" className="w-full text-xs h-9 font-medium bg-card hover:bg-accent border-dashed border-border">
                                                Xem tất cả thành viên
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
