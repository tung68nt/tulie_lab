'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Plus, Layout, ArrowRight, Trash2, List } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WhiteboardDashboard() {
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
        fetchWhiteboards();
    }, []);

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

    return (
        <div className="container max-w-[1200px] py-8 pt-24 px-4 md:px-0 bg-background min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bảng trắng của tôi</h1>
                    <p className="text-muted-foreground mt-1">Quản lý và cộng tác trên các bảng vẽ của bạn.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center p-1 bg-muted rounded-lg border">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`h-8 px-2 ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-transparent'}`}
                        >
                            <Layout className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`h-8 px-2 ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-transparent'}`}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button onClick={handleCreate} disabled={isCreating} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tạo bảng mới
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
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
                            className="group relative flex flex-col bg-card border rounded-xl overflow-hidden hover:border-zinc-400 transition-all hover:shadow-md"
                        >
                            <div className="h-40 bg-zinc-50 flex items-center justify-center border-b relative">
                                {board.thumbnail ? (
                                    <img src={board.thumbnail} alt={board.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Layout className="w-10 h-10 text-zinc-300 group-hover:text-zinc-400 group-hover:scale-110 transition-all duration-300" />
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-medium text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">{board.title || 'Không tiêu đề'}</h3>
                                <div className="flex items-center justify-between mt-4 border-t pt-3 border-dashed">
                                    <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
                                        {new Date(board.updatedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all opacity-0 group-hover:opacity-100"
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
                <div className="flex flex-col border rounded-xl overflow-hidden bg-card">
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
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-base truncate group-hover:text-primary transition-colors">{board.title || 'Không tiêu đề'}</h3>
                            </div>
                            <div className="text-sm text-muted-foreground w-32 text-right">
                                {new Date(board.updatedAt).toLocaleDateString('vi-VN')}
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
