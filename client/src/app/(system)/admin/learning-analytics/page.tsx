'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useToast } from '@/contexts/ToastContext';
import { BarChart3, Users, BookOpen, TrendingUp, AlertCircle, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LearningAnalyticsPage() {
    const { addToast } = useToast();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.admin.lms.getAnalytics();
                setStats(res);
            } catch (error: any) {
                console.error('Failed to fetch analytics:', error);
                addToast('Không thể tải dữ liệu phân tích: ' + (error.message || 'Lỗi mạng'), 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 rounded-full border-3 border-border border-t-primary animate-spin" style={{ animationDuration: '0.6s' }} />
            </div>
        );
    }

    if (!stats) return null;

    const { overallStats, courseStats } = stats;

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Phân tích học tập"
                subtitle="Theo dõi tiến độ, mức độ hứng thú và hiệu quả đào tạo"
                icon={<BarChart3 className="w-8 h-8" />}
            />

            {/* Overall Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Tổng số lượt đăng ký"
                    value={overallStats.totalEnrollments}
                    icon={<Users className="w-5 h-5 text-blue-500" />}
                    description="Tổng số học viên trong các khóa"
                />
                <StatCard
                    title="Tiến độ trung bình"
                    value={`${overallStats.avgOverallProgress}%`}
                    icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                    description="Tiến độ hoàn thành bài học trung bình"
                />
                <StatCard
                    title="Số lượng học viên"
                    value={overallStats.totalStudents}
                    icon={<BookOpen className="w-5 h-5 text-purple-500" />}
                    description="Tài khoản học viên trên hệ thống"
                />
                <StatCard
                    title="Doanh thu (Ước tính)"
                    value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overallStats.totalRevenue)}
                    icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
                    description="Dựa trên đơn hàng đã thanh toán"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hiệu quả từng khóa học</CardTitle>
                    <CardDescription>Chi tiết số lượng, tiến độ và mức độ hoàn thành</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[300px]">Khóa học</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Đăng ký</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Đã mua</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tiến độ trung bình</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right w-[150px]">Trạng thái R&D</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {courseStats.map((course: any) => (
                                    <tr key={course.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">{course.title}</span>
                                                <span className="text-xs text-muted-foreground">{course.totalLessons} bài học</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-center font-medium">
                                            {course.enrollments}
                                        </td>
                                        <td className="p-4 align-middle text-center font-medium">
                                            {course.paidOrders}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="space-y-2 max-w-[200px]">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span>{course.avgProgress}%</span>
                                                </div>
                                                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-500 rounded-full ${course.avgProgress > 70 ? 'bg-green-500' :
                                                            course.avgProgress > 30 ? 'bg-blue-500' :
                                                                'bg-orange-500'
                                                            }`}
                                                        style={{ width: `${course.avgProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <RDIndicator progress={course.avgProgress} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InsightsCard
                    title="Gợi ý Update nội dung"
                    icon={<PlayCircle className="w-5 h-5 text-primary" />}
                    items={courseStats.filter((c: any) => c.avgProgress < 20).map((c: any) => ({
                        label: c.title,
                        value: 'Tiến độ rất thấp (<20%) - Cần kiểm tra nội dung có quá khó hoặc nhàm chán không.'
                    }))}
                />
                <InsightsCard
                    title="Khóa học Trending"
                    icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                    items={courseStats.filter((c: any) => c.avgProgress > 50).map((c: any) => ({
                        label: c.title,
                        value: `Học viên hứng thú cao (${c.avgProgress}% hoàn thành). Hãy phát triển thêm phần nâng cao.`
                    }))}
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, description }: any) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}

function RDIndicator({ progress }: { progress: number }) {
    if (progress === 0) return <span className="text-xs bg-muted px-2 py-1 rounded">Chưa có dữ liệu</span>;
    if (progress < 15) return (
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full border border-red-100">
            <AlertCircle className="w-3.5 h-3.5" />
            Cần Update
        </div>
    );
    if (progress < 40) return (
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
            <PlayCircle className="w-3.5 h-3.5" />
            Cần Cải thiện
        </div>
    );
    return (
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hiệu quả tốt
        </div>
    );
}

function InsightsCard({ title, icon, items }: any) {
    return (
        <Card>
            <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="mt-1">
                        {icon}
                    </div>
                    <CardTitle className="text-base font-bold">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {items.length > 0 ? (
                    <div className="space-y-4">
                        {items.map((item: any, i: number) => (
                            <div key={i} className="space-y-1 border-l-2 border-primary/20 pl-3">
                                <div className="text-sm font-bold">{item.label}</div>
                                <div className="text-xs text-muted-foreground leading-relaxed">{item.value}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground py-8 text-center italic">Không có dữ liệu đề xuất</div>
                )}
            </CardContent>
        </Card>
    );
}
