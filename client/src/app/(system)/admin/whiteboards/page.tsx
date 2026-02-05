'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Palette, Monitor, Users, HardDrive, Layout, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/Button';

export default function AdminWhiteboardDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const data = await api.whiteboards.getAdminStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><LoadingSpinner /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Thống kê Whiteboard</h1>
                    <p className="text-muted-foreground mt-1">Theo dõi sử dụng hệ thống và dữ liệu vẽ của thành viên.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchStats} className="gap-2">
                    <RefreshCcw className="w-4 h-4" /> Làm mới
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Palette className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Tổng số bảng</p>
                            <h3 className="text-2xl font-bold">{stats?.totalBoards}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Layout className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Tổng Artboards</p>
                            <h3 className="text-2xl font-bold">{stats?.totalArtboards}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Thành viên sử dụng</p>
                            <h3 className="text-2xl font-bold">{stats?.totalUsers}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <HardDrive className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Dung lượng ước tính</p>
                            <h3 className="text-2xl font-bold">{formatSize(stats?.totalStorageBytes || 0)}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="font-bold">Thành viên tích cực</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Thành viên</th>
                                    <th className="px-6 py-3 text-left font-medium">Email</th>
                                    <th className="px-6 py-3 text-right font-medium">Số lượng bảng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {stats?.topUsers.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium">{user.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Badge variant="secondary">{user.boardCount} bảng</Badge>
                                        </td>
                                    </tr>
                                ))}
                                {stats?.topUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground">
                                            Chưa có dữ liệu thành viên.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="p-6 space-y-6">
                    <h3 className="font-bold flex items-center gap-2">
                        <Monitor className="w-4 h-4" /> Hệ thống & Tối ưu
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl border bg-muted/20">
                            <h4 className="font-medium text-sm mb-1">Tự động dọn dẹp</h4>
                            <p className="text-xs text-muted-foreground mb-3">Tự động xóa các bảng nháp không hoạt động sau 30 ngày.</p>
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Đã kích hoạt</Badge>
                        </div>

                        <div className="p-4 rounded-xl border bg-muted/20">
                            <h4 className="font-medium text-sm mb-1">Nén dữ liệu Element</h4>
                            <p className="text-xs text-muted-foreground mb-3">Giảm dung lượng lưu trữ JSON cho các bảng vẽ phức tạp.</p>
                            <Badge variant="outline" className="opacity-50">Sắp ra mắt</Badge>
                        </div>

                        <div className="p-4 rounded-xl border bg-muted/20">
                            <h4 className="font-medium text-sm mb-1">Giới hạn miễn phí</h4>
                            <p className="text-xs text-muted-foreground mb-3">Tối đa 10 bảng vẽ cho mỗi học viên.</p>
                            <Badge variant="outline" className="text-primary border-primary/20">Đang áp dụng</Badge>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button className="w-full gap-2" variant="outline">
                            Xem tất cả cài đặt
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
