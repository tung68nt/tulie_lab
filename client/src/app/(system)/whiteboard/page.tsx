'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Plus, LayoutGrid, Layout, ArrowRight, Trash2, List, ShieldAlert, Archive, Check, ChevronDown, MoreHorizontal, Copy } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

export default function WhiteboardDashboard() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { addToast } = useToast();
    const [whiteboards, setWhiteboards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const fetchWhiteboards = async () => {
        try {
            const data = await api.whiteboards.list();
            setWhiteboards(data);
        } catch (error) {
            console.error('Failed to fetch whiteboards:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }
        if (isAuthenticated) {
            fetchWhiteboards();
        }
    }, [isAuthenticated, authLoading]);

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            const newBoard = await api.whiteboards.create({
                title: `Bảng trắng mới ${whiteboards.length + 1}`,
            });
            router.push(`/whiteboard/${newBoard.id}`);
        } catch (error) {
            console.error('Failed to create whiteboard:', error);
            setIsCreating(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.whiteboards.update(id, { status: newStatus });
            setWhiteboards(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
            addToast(`Đã chuyển trạng thái sang ${newStatus.charAt(0) + newStatus.slice(1).toLowerCase()}`, 'success');
        } catch (error) {
            console.error('Failed to update status:', error);
            addToast('Không thể cập nhật trạng thái', 'error');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm('Bạn có chắc chắn muốn xóa bảng trắng này?')) return;
        try {
            await api.whiteboards.delete(id);
            setWhiteboards(whiteboards.filter(b => b.id !== id));
        } catch (error) {
            console.error('Failed to delete whiteboard:', error);
        }
    };

    const copyLink = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/whiteboard/${id}`;
        navigator.clipboard.writeText(url);
        addToast("Đã sao chép liên kết bảng trắng", "success");
    };

    return (
        <div className="container max-w-[1200px] py-8 pt-24 px-4 md:px-0 bg-background min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Bảng trắng của tôi</h1>
                    <p className="text-muted-foreground mt-1 text-zinc-500">Quản lý và cộng tác trên các bảng vẽ của bạn.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-xl transition-all duration-200 ${viewMode === 'grid'
                                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-xl transition-all duration-200 ${viewMode === 'list'
                                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <Button onClick={handleCreate} disabled={isCreating} className="gap-2 shadow-lg shadow-zinc-200/50 dark:shadow-none bg-zinc-900 hover:bg-zinc-800 text-white border-none rounded-xl">
                        <Plus className="w-4 h-4" />
                        Tạo bảng mới
                    </Button>
                </div>
            </div>

            {authLoading || isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                    ))}
                </div>
            ) : !isAuthenticated ? (
                <div className="flex flex-col items-center justify-center py-24 border border-dashed border-red-200 dark:border-red-900/30 rounded-3xl bg-red-50/30 dark:bg-red-900/10">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">Yêu cầu đăng nhập</h2>
                    <p className="text-zinc-500 mb-8 max-w-sm text-center">Bạn cần đăng nhập để truy cập vào bảng trắng cá nhân.</p>
                    <Link href="/login">
                        <Button className="gap-2">Đăng nhập ngay</Button>
                    </Link>
                </div>
            ) : whiteboards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                        <Layout className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">Chưa có bảng trắng nào</h2>
                    <p className="text-zinc-500 mb-8 max-w-sm text-center">Hãy bắt đầu tạo bảng trắng đầu tiên của bạn để phác thảo ý tưởng và cộng tác.</p>
                    <Button variant="outline" onClick={handleCreate} disabled={isCreating} className="border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        Bắt đầu vẽ ngay
                    </Button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {whiteboards.map((board) => (
                        <Link
                            key={board.id}
                            href={`/whiteboard/${board.id}`}
                            className="group relative flex flex-col bg-card border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/20"
                        >
                            <div className="aspect-video bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                                {board.thumbnail ? (
                                    <img src={board.thumbnail} alt={board.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <Layout className="w-10 h-10 text-zinc-300 dark:text-zinc-600 transition-transform duration-300" />
                                )}

                                {/* Status Badge Overlay */}
                                <div className="absolute top-3 left-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md border ${board.status === 'PUBLISHED'
                                        ? 'bg-emerald-500/80 text-white border-emerald-400/30'
                                        : board.status === 'ARCHIVED'
                                            ? 'bg-zinc-800/80 text-zinc-300 border-zinc-700/50'
                                            : 'bg-zinc-900/60 text-zinc-300 border-white/10'
                                        }`}>
                                        <span className={`w-1 h-1 rounded-full mr-1.5 ${board.status === 'PUBLISHED' ? 'bg-white' : 'bg-zinc-400'}`} />
                                        {board.status === 'PUBLISHED' ? 'Published' : board.status === 'ARCHIVED' ? 'Archived' : 'Draft'}
                                    </span>
                                </div>

                                {/* Status Toggle Overlay (Quick Change) */}
                                <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleStatusUpdate(board.id, 'PUBLISHED', e)}
                                        className={`p-1.5 rounded-lg backdrop-blur-md shadow-sm transition-all ${board.status === 'PUBLISHED'
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white/80 text-zinc-500 hover:bg-white hover:text-emerald-600'}`}
                                        title="Mark as Published"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => handleStatusUpdate(board.id, 'ARCHIVED', e)}
                                        className={`p-1.5 rounded-lg backdrop-blur-md shadow-sm transition-all ${board.status === 'ARCHIVED'
                                            ? 'bg-zinc-800 text-white'
                                            : 'bg-white/80 text-zinc-500 hover:bg-white hover:text-zinc-800'}`}
                                        title="Move to Archive"
                                    >
                                        <Archive className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Hover Actions Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-start justify-end p-3 opacity-0 group-hover:opacity-100">
                                    <Button
                                        as="div"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white text-zinc-500 hover:text-red-600 transition-all rounded-full"
                                        onClick={(e) => handleDelete(board.id, e)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900">
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base line-clamp-1">{board.title || 'Không tiêu đề'}</h3>
                                <p className="text-[10px] text-zinc-400 mt-0.5">ID: {board.id.split('-')[0]}</p>
                                <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        <span suppressHydrationWarning>{new Date(board.updatedAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-card shadow-sm">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        <div className="col-span-6 md:col-span-5">Tên bảng</div>
                        <div className="hidden md:block col-span-2">Trạng thái</div>
                        <div className="hidden md:block col-span-2">Ngày tạo</div>
                        <div className="hidden md:block col-span-2">Cập nhật</div>
                        <div className="col-span-6 md:col-span-1 text-right">Thao tác</div>
                    </div>

                    {whiteboards.map((board, i) => (
                        <div
                            key={board.id}
                            className={`group grid grid-cols-12 gap-4 p-4 items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${i !== whiteboards.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                        >
                            {/* Title & Thumbnail */}
                            <div className="col-span-6 md:col-span-5 flex items-center gap-4 min-w-0">
                                <Link
                                    href={`/whiteboard/${board.id}`}
                                    className="w-12 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shrink-0 overflow-hidden group-hover:border-zinc-400 transition-colors"
                                >
                                    {board.thumbnail ? (
                                        <img src={board.thumbnail} alt={board.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    ) : (
                                        <Layout className="w-4 h-4 text-zinc-300" />
                                    )}
                                </Link>
                                <div className="min-w-0">
                                    <Link href={`/whiteboard/${board.id}`} className="block font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate hover:text-zinc-600 transition-colors">
                                        {board.title || 'Không tiêu đề'}
                                    </Link>
                                    <div className="text-[10px] text-zinc-400 mt-0.5 leading-none font-mono tracking-tight">
                                        #{board.id.split('-')[0]}
                                    </div>
                                    <div className="md:hidden text-[11px] text-zinc-400 mt-1 font-medium">
                                        <span suppressHydrationWarning>{new Date(board.updatedAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status (Desktop) */}
                            <div className="hidden md:block col-span-2">
                                <div className="relative group/status inline-block">
                                    <button className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${board.status === 'PUBLISHED'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : board.status === 'ARCHIVED'
                                            ? 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                            : 'bg-zinc-50 text-zinc-400 border-zinc-100'
                                        }`}>
                                        <span className={`w-1 h-1 rounded-full ${board.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                                        {board.status === 'PUBLISHED' ? 'Công khai' : board.status === 'ARCHIVED' ? 'Lưu trữ' : 'Nháp'}
                                        <ChevronDown className="w-3 h-3 opacity-50 group-hover/status:opacity-100 transition-opacity" />
                                    </button>

                                    {/* Action Dropdown on Hover */}
                                    <div className="absolute left-0 top-full pt-1 opacity-0 group-hover/status:opacity-100 pointer-events-none group-hover/status:pointer-events-auto transition-all z-20">
                                        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl p-1 min-w-[120px]">
                                            {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={(e) => handleStatusUpdate(board.id, s, e)}
                                                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${board.status === s
                                                        ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                                                        : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 hover:text-zinc-600'}`}
                                                >
                                                    {s === 'PUBLISHED' ? 'Công khai' : s === 'ARCHIVED' ? 'Lưu trữ' : 'Nháp'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Created Date (Desktop) */}
                            <div className="hidden md:block col-span-2 text-xs text-zinc-400" suppressHydrationWarning>
                                {new Date(board.createdAt).toLocaleDateString('vi-VN')}
                            </div>

                            {/* Updated Date (Desktop) */}
                            <div className="hidden md:block col-span-2 text-xs text-zinc-500 font-medium">
                                <div className="text-zinc-900 dark:text-zinc-200" suppressHydrationWarning>
                                    {new Date(board.updatedAt).toLocaleDateString('vi-VN')}
                                </div>
                                <div className="text-[10px] text-zinc-400 font-normal" suppressHydrationWarning>
                                    {new Date(board.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-6 md:col-span-1 flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
                                    onClick={(e) => copyLink(e, board.id)}
                                    title="Copy Link"
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-zinc-400 hover:text-destructive hover:bg-destructive/10"
                                    onClick={(e) => handleDelete(board.id, e)}
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
