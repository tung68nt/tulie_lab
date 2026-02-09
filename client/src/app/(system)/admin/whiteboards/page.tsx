'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { Palette, Monitor, Users, HardDrive, Layout, RefreshCcw, Presentation } from 'lucide-react';
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

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px] bg-white"><LoadingSpinner /></div>;

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Hệ thống Whiteboard"
                subtitle="Quản lý & Thống kê hệ thống"
                icon={<Presentation className="w-8 h-8" />}
            >
                <Button variant="outline" onClick={fetchStats} className="gap-2">
                    <RefreshCcw className="w-4 h-4" /> Làm mới dữ liệu
                </Button>
            </AdminPageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                            <Palette className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Tổng số bảng</p>
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{stats?.totalBoards}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                            <Layout className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Artboards</p>
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{stats?.totalArtboards}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Người dùng tích cực</p>
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{stats?.totalUsers}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                            <HardDrive className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Dung lượng lưu trữ</p>
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{formatSize(stats?.totalStorageBytes || 0)}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 overflow-hidden border-zinc-200 dark:border-zinc-800">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Thành viên tích cực</h3>
                        <Badge variant="secondary" className="font-medium text-xs">Top Contributors</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4 text-left font-medium text-zinc-500 dark:text-zinc-400 text-xs">Thành viên</th>
                                    <th className="px-6 py-4 text-left font-medium text-zinc-500 dark:text-zinc-400 text-xs">Tài khoản</th>
                                    <th className="px-6 py-4 text-right font-medium text-zinc-500 dark:text-zinc-400 text-xs">Số lượng bảng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {stats?.topUsers.map((user: any, idx: number) => (
                                    <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-zinc-400 dark:text-zinc-600 font-medium tabular-nums w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{user.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                                                {user.boardCount} bảng
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stats?.topUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                                            Chưa có dữ liệu hệ thống
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="space-y-8">
                    <div className="space-y-6">
                        <Card className="p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
                            <div className="mb-6">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Monitor className="w-5 h-5" /> Quản lý hệ thống
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Optimization & Controls</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-sm">Tự động dọn dẹp</h4>
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Xóa bản nháp không hoạt động sau 30 ngày.</p>
                                </div>

                                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 opacity-60">
                                    <h4 className="font-semibold text-sm mb-1">Nén dữ liệu JSON</h4>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic">Tối ưu lưu trữ mã nguồn vẽ (Beta).</p>
                                </div>

                                <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <h4 className="font-semibold text-sm mb-1">Giới hạn truy cập</h4>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Tối đa 10 bảng / 1 user.</p>
                                </div>
                            </div>

                            <Button className="w-full mt-6" variant="default">
                                Cài đặt chung
                            </Button>
                        </Card>

                        <Card className="p-6 border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                                        <RefreshCcw className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Đồng bộ lần cuối</span>
                                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">10 phút trước</span>
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
