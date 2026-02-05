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

    if (isLoading) return <div className="flex items-center justify-center min-h-[400px] bg-white"><LoadingSpinner /></div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between border-b border-zinc-900/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-zinc-950">HE THONG WHITEBOARD</h1>
                    <p className="text-zinc-500 font-medium text-sm mt-1 uppercase tracking-widest">Analytics & System Management</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchStats} className="gap-2 rounded-full border-zinc-200 hover:bg-zinc-50 font-bold text-[11px] uppercase tracking-widest px-6 h-10 transition-all active:scale-95 shadow-sm">
                    <RefreshCcw className="w-3 h-3" /> Làm mới dữ liệu
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-8 border-zinc-200 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-900/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-xl shadow-zinc-950/20">
                            <Palette className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Boards</p>
                            <h3 className="text-4xl font-black text-zinc-950 tabular-nums leading-none">{stats?.totalBoards}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 border-zinc-200 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-900/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-950">
                            <Layout className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Artboards</p>
                            <h3 className="text-4xl font-black text-zinc-950 tabular-nums leading-none">{stats?.totalArtboards}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 border-zinc-200 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-900/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-950">
                            <Users className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Active Users</p>
                            <h3 className="text-4xl font-black text-zinc-950 tabular-nums leading-none">{stats?.totalUsers}</h3>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 border-zinc-200 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10_20px_-2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-900/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-950">
                            <HardDrive className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Storage</p>
                            <h3 className="text-3xl font-black text-zinc-950 tabular-nums leading-none">{formatSize(stats?.totalStorageBytes || 0)}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-900/5 ring-1 ring-zinc-200/50">
                    <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-6 bg-zinc-950 rounded-full" />
                            <h3 className="font-black text-xl text-zinc-950 tracking-tight">THANH VIEN TICH CUC</h3>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-zinc-300 text-zinc-500 py-1 px-3 rounded-full bg-white">TOP CONTRIBUTERS</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-50/50 border-b border-zinc-100">
                                <tr>
                                    <th className="px-8 py-5 text-left font-black text-zinc-400 uppercase tracking-[0.2em] text-[10px]">Thành viên</th>
                                    <th className="px-8 py-5 text-left font-black text-zinc-400 uppercase tracking-[0.2em] text-[10px]">Tài khoản</th>
                                    <th className="px-8 py-5 text-right font-black text-zinc-400 uppercase tracking-[0.2em] text-[10px]">Sản lượng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {stats?.topUsers.map((user: any, idx: number) => (
                                    <tr key={user.id} className="hover:bg-zinc-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <span className="text-zinc-300 font-black text-lg tabular-nums">{(idx + 1).toString().padStart(2, '0')}</span>
                                                <span className="font-black text-zinc-900 group-hover:text-black transition-colors text-base">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-zinc-400 font-medium">{user.email}</td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-black bg-zinc-900 text-white shadow-lg shadow-zinc-900/10">
                                                {user.boardCount} PHÒNG
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stats?.topUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">
                                            Chưa có dữ liệu hệ thống
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="space-y-8">
                    <Card className="p-8 border-zinc-900 bg-zinc-950 text-white shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <div className="relative">
                            <h3 className="font-black text-2xl tracking-tighter flex items-center gap-3">
                                <Monitor className="w-6 h-6" /> SYSTEM OPS
                            </h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Optimization & Controls</p>
                        </div>

                        <div className="space-y-5 relative">
                            <div className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-default backdrop-blur-md">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-black text-sm text-white tracking-tight uppercase">Auto-Cleanup</h4>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                </div>
                                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Xóa bản nháp không hoạt động sau 30 ngày.</p>
                            </div>

                            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] opacity-40">
                                <h4 className="font-black text-sm text-white tracking-tight uppercase mb-1">JSON Compression</h4>
                                <p className="text-[11px] text-zinc-600 leading-relaxed font-medium italic">Tối ưu lưu trữ mã nguồn vẽ (Beta).</p>
                            </div>

                            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
                                <h4 className="font-black text-sm text-white tracking-tight uppercase mb-1">Rate Limiting</h4>
                                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">Tối đa 10 bảng / 1 user.</p>
                            </div>
                        </div>

                        <Button className="w-full bg-white hover:bg-zinc-100 text-zinc-950 rounded-2xl py-8 font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)]" variant="default">
                            GLOBAL SETTINGS
                        </Button>
                    </Card>

                    <Card className="p-6 border-zinc-200 bg-white shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-200">
                        <div className="flex items-center justify-between text-zinc-400 group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-950 group-hover:rotate-180 transition-transform duration-500">
                                    <RefreshCcw className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Last Sync</span>
                                    <span className="text-xs font-bold text-zinc-900 uppercase">10 MINUTES AGO</span>
                                </div>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
