'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Plus, Layout, ArrowRight, Trash2, List } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useConfirm } from '@/components/ConfirmDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function WhiteboardDashboard() {
    const { isAuthenticated } = useAuth();
    const [whiteboards, setWhiteboards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();
    const confirm = useConfirm();
    const { addToast } = useToast();

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
        fetchWhiteboards();
    }, []);

    const handleCreate = async () => {
        if (!isAuthenticated) {
            addToast('Vui lòng đăng nhập để tạo bảng trắng mới', 'info');
            const returnUrl = encodeURIComponent('/whiteboard');
            router.push(`/login?returnUrl=${returnUrl}`);
            return;
        }

        setIsCreating(true);
        try {
            const newBoard = await api.whiteboards.create({
                title: `Bảng trắng mới ${whiteboards.length + 1}`,
            });
            router.push(`/whiteboard/${newBoard.id}`);
        } catch (error) {
            console.error('Failed to create whiteboard:', error);
            setIsCreating(false);
            addToast('Không thể tạo bảng trắng mới', 'error');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const confirmed = await confirm({
            title: 'Xóa bảng trắng',
            message: 'Bạn có chắc chắn muốn xóa bảng trắng này? Hành động này không thể hoàn tác.',
            variant: 'danger',
            confirmText: 'Xóa ngay',
            cancelText: 'Hủy'
        });

        if (!confirmed) return;

        try {
            await api.whiteboards.delete(id);
            setWhiteboards(whiteboards.filter(b => b.id !== id));
            addToast('Đã xóa bảng trắng thành công', 'success');
        } catch (error) {
            console.error('Failed to delete whiteboard:', error);
            addToast('Xóa bảng trắng thất bại', 'error');
        }
    };

    return (
        <div className="container max-w-[1200px] py-8 pt-24 px-4 md:px-0 bg-background min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bảng trắng của tôi</h1>
                    <p className="text-muted-foreground mt-1">Quản lý và cộng tác trên các bảng vẽ của bạn.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center h-11 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`h-full w-14 px-0 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:bg-transparent hover:text-zinc-400'}`}
                        >
                            <Layout className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`h-full w-14 px-0 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:bg-transparent hover:text-zinc-400'}`}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button onClick={handleCreate} disabled={isCreating} className="gap-2 rounded-2xl h-11">
                        <Plus className="w-4 h-4" />
                        Tạo bảng mới
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : whiteboards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl bg-muted/30">
                    <Layout className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                    <h2 className="text-xl font-semibold mb-2">Chưa có bảng trắng nào</h2>
                    <p className="text-muted-foreground mb-6">Hãy bắt đầu tạo bảng trắng đầu tiên của bạn để cộng tác.</p>
                    <Button variant="outline" onClick={handleCreate} disabled={isCreating}>
                        Bắt đầu vẽ ngay
                    </Button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {whiteboards.map((board) => (
                        <Link
                            key={board.id}
                            href={`/whiteboard/${board.id}`}
                            className="group relative flex flex-col bg-card border rounded-2xl overflow-hidden hover:border-zinc-400 transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="h-44 bg-zinc-50 flex items-center justify-center border-b border-zinc-100 relative overflow-hidden">
                                {board.thumbnail ? (
                                    <img src={board.thumbnail} alt={board.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <Layout className="w-12 h-12 text-zinc-200 group-hover:text-zinc-300 group-hover:rotate-6 transition-all duration-300" strokeWidth={1.5} />
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                        {board.title || 'Không tiêu đề'}
                                    </h3>
                                    <span className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border transition-colors ${board.status === 'PUBLIC'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                        : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                        }`}>
                                        {board.status === 'PUBLIC' ? 'Public' : 'Private'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-4 border-t pt-3 border-dashed">
                                    <span className="text-xs font-medium text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100" suppressHydrationWarning>
                                        Cập nhật: {new Date(board.updatedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                                            onClick={(e) => handleDelete(board.id, e)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col border rounded-2xl overflow-hidden bg-card shadow-sm">
                    {whiteboards.map((board, i) => (
                        <Link
                            key={board.id}
                            href={`/whiteboard/${board.id}`}
                            className={`group flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${i !== whiteboards.length - 1 ? 'border-b' : ''}`}
                        >
                            <div className="w-16 h-10 bg-zinc-100 rounded-md flex items-center justify-center border shrink-0 overflow-hidden">
                                {board.thumbnail ? (
                                    <img src={board.thumbnail} alt={board.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Layout className="w-5 h-5 text-zinc-300" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 flex items-center gap-3">
                                <h3 className="font-medium text-base truncate group-hover:text-primary transition-colors">{board.title || 'Không tiêu đề'}</h3>
                                <span className={`text-[11px] px-2 py-0.5 rounded-lg font-medium border ${board.status === 'PUBLIC'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                    : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                    }`}>
                                    {board.status === 'PUBLIC' ? 'Public' : 'Private'}
                                </span>
                            </div>
                            <div className="text-xs text-muted-foreground w-40 text-right opacity-60 group-hover:opacity-100 transition-opacity" suppressHydrationWarning>
                                Cập nhật: {new Date(board.updatedAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={(e) => handleDelete(board.id, e)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
