'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Plus, LayoutGrid, Layout, ArrowRight, Trash2, List, ShieldAlert, Archive, Check, ChevronDown, MoreHorizontal, Copy, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

import { useConfirm } from '@/components/ConfirmDialog';

export default function WhiteboardDashboard() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { addToast } = useToast();
    const confirm = useConfirm(); // Initialize hook
    const [whiteboards, setWhiteboards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const fetchWhiteboards = async () => {
        try {
            console.log('[WhiteboardDashboard] fetching whiteboards...');
            // Add timestamp to prevent caching
            const data = await api.whiteboards.list(`?t=${Date.now()}`);
            console.log('[WhiteboardDashboard] fetched count:', data?.length);
            setWhiteboards(data || []);
            // TODO: Remove this debug toast after fixing the issue
            if (data?.length === 0) {
                addToast('Danh sách trống (0 bảng). Hãy thử tạo mới!', 'info');
            }
        } catch (error) {
            console.error('Failed to fetch whiteboards:', error);
            // Don't clear whiteboards on error to show stale data at least? 
            // Or maybe current behavior is fine.
        } finally {
            setIsLoading(false);
        }
    };

    // Force refetch on mount and when auth ready
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }
        if (isAuthenticated) {
            fetchWhiteboards();
        }
    }, [isAuthenticated, authLoading]);

    // Check if we need to Refetch on focus (e.g. coming back from tab or another page)
    useEffect(() => {
        const onFocus = () => {
            if (isAuthenticated) fetchWhiteboards();
        };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [isAuthenticated]);

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

        const isConfirmed = await confirm({
            title: 'Xóa bảng trắng',
            message: 'Bạn có chắc chắn muốn xóa bảng trắng này? Hành động này không thể hoàn tác.',
            confirmText: 'Xóa vĩnh viễn',
            cancelText: 'Hủy bỏ',
            variant: 'danger'
        });

        if (!isConfirmed) return;

        try {
            await api.whiteboards.delete(id);
            setWhiteboards(whiteboards.filter(b => b.id !== id));
            addToast('Đã xóa bảng trắng thành công', 'success');
        } catch (error) {
            console.error('Failed to delete whiteboard:', error);
            addToast('Có lỗi xảy ra khi xóa bảng trắng', 'error');
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
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchWhiteboards}
                        disabled={isLoading}
                        className="h-10 w-10 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                        title="Reload List"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        {/* Using ArrowRight as Refresh icon substitute if RefreshCw not imported, or just import RefreshCw */}
                    </Button>
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
                            <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                                {board.thumbnail ? (
                                    <img src={board.thumbnail} alt={board.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <Layout className="w-12 h-12 text-zinc-300 dark:text-zinc-600 transition-transform duration-300" strokeWidth={1} />
                                )}

                                {/* Status Badge Overlay */}
                                <div className="absolute top-3 left-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-md border shadow-sm ${board.status === 'PUBLISHED'
                                        ? 'bg-emerald-500/90 text-white border-emerald-400/30'
                                        : board.status === 'ARCHIVED'
                                            ? 'bg-zinc-800/90 text-zinc-300 border-zinc-700/50'
                                            : 'bg-white/90 text-zinc-600 border-zinc-200/50 dark:bg-zinc-900/90 dark:text-zinc-300 dark:border-white/10'
                                        }`}>
                                        {board.status === 'PUBLISHED' ? 'Công khai' : board.status === 'ARCHIVED' ? 'Lưu trữ' : 'Bản nháp'}
                                    </span>
                                </div>

                                {/* Floating Actions (Visible on Hover) */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                                    <button
                                        onClick={(e) => handleStatusUpdate(board.id, board.status === 'ARCHIVED' ? 'DRAFT' : 'ARCHIVED', e)}
                                        className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                                        title={board.status === 'ARCHIVED' ? 'Khôi phục' : 'Lưu trữ'}
                                    >
                                        <Archive className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(board.id, e)}
                                        className="p-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 text-rose-500 hover:text-rose-600 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 bg-white dark:bg-zinc-900 flex flex-col gap-1">
                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base truncate pr-2">
                                    {board.title || 'Untitled Whiteboard'}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                    <span>ID: {board.id.split('-')[0]}</span>
                                    <span>•</span>
                                    <span suppressHydrationWarning>{new Date(board.updatedAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {whiteboards.map((board) => (
                        <div
                            key={board.id}
                            className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md"
                        >
                            <Link href={`/whiteboard/${board.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-16 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shrink-0 overflow-hidden">
                                    {board.thumbnail ? (
                                        <img src={board.thumbnail} alt={board.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                    ) : (
                                        <Layout className="w-6 h-6 text-zinc-300" strokeWidth={1} />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base truncate">
                                        {board.title || 'Không tiêu đề'}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500 font-medium">
                                        <span className="font-mono text-[10px] tracking-tight text-zinc-400">#{board.id.split('-')[0]}</span>
                                        <span>•</span>
                                        <span suppressHydrationWarning>Cập nhật: {new Date(board.updatedAt).toLocaleDateString('vi-VN')}</span>
                                        {board.status !== 'DRAFT' && (
                                            <>
                                                <span>•</span>
                                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${board.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-zinc-100 text-zinc-500'
                                                    }`}>
                                                    {board.status === 'PUBLISHED' ? 'Công khai' : 'Lưu trữ'}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Link>

                            <div className="flex items-center gap-2 ml-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                                    onClick={(e) => copyLink(e, board.id)}
                                    title="Copy Link"
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors"
                                    onClick={(e) => handleDelete(board.id, e)}
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Link href={`/whiteboard/${board.id}`} className="h-9 w-9 flex items-center justify-center text-zinc-300 hover:text-zinc-900 transition-colors">
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
