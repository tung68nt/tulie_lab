'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import {
    Plus,
    Search,
    Link as LinkIcon,
    Copy,
    ExternalLink,
    Trash2,
    BarChart3,
    Calendar,
    Check,
    Library,
    X
} from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ShortLink } from '@/types/api';
import { Portal } from '@/components/Portal';

export default function AdminShortLinksPage() {
    const [links, setLinks] = useState<ShortLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // New Link Form
    const [newLink, setNewLink] = useState({
        originalUrl: '',
        code: '',
        title: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        setIsLoading(true);
        try {
            const data = await api.shortLinks.list();
            setLinks(data);
        } catch (error) {
            console.error('Failed to fetch links:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.shortLinks.create(newLink);
            setIsCreateModalOpen(false);
            setNewLink({ originalUrl: '', code: '', title: '' });
            fetchLinks();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to create link';
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa liên kết này?')) return;
        try {
            await api.shortLinks.delete(id);
            fetchLinks();
        } catch {
            alert('Xóa thất bại');
        }
    };

    const copyToClipboard = (code: string, id: string) => {
        const domain = typeof window !== 'undefined' ? window.location.origin : '';
        const fullUrl = `${domain}/s/${code}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredLinks = links.filter(link =>
        link.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        totalLinks: links.length,
        totalClicks: links.reduce((acc, curr) => acc + (curr.clicks || 0), 0),
        mostActive: [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
    };

    return (
        <div className="space-y-8 pb-12">
            <AdminPageHeader
                title="Rút gọn Link"
                subtitle="Quản lý và theo dõi hiệu quả các đường dẫn rút gọn."
                icon={<LinkIcon className="w-8 h-8" />}
            >
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-zinc-950 text-white rounded-full px-6 h-12 font-semibold shadow-lg shadow-zinc-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tạo Link mới
                </Button>
            </AdminPageHeader>

            {/* Quick Stats Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Tổng số Link', value: stats.totalLinks, icon: LinkIcon },
                    { label: 'Tổng lượt Click', value: stats.totalClicks, icon: BarChart3 },
                    { label: 'Top Link', value: stats.mostActive?.code || 'N/A', icon: BarChart3 }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-zinc-400">{stat.label}</p>
                                <p className="text-2xl font-semibold text-zinc-900">{stat.value}</p>
                            </div>
                            <div className="p-3 bg-zinc-50 rounded-xl">
                                <stat.icon className="w-5 h-5 text-zinc-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tiêu đề, mã hoặc URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all focus:border-transparent focus:ring-offset-0"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-400 mr-2">Sắp xếp:</span>
                        <select className="bg-transparent border-none text-xs font-semibold text-zinc-900 outline-none cursor-pointer">
                            <option>Mới nhất</option>
                            <option>Nhiều click nhất</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/30">
                                <th className="px-6 py-4 text-xs font-medium text-zinc-500">Tiêu đề & Mã</th>
                                <th className="px-6 py-4 text-xs font-medium text-zinc-500">URL Gốc</th>
                                <th className="px-6 py-4 text-xs font-medium text-zinc-500 text-center">Lượt click</th>
                                <th className="px-6 py-4 text-xs font-medium text-zinc-500">Thời gian</th>
                                <th className="px-6 py-4 text-xs font-medium text-zinc-500 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-16 bg-zinc-50/20" />
                                    </tr>
                                ))
                            ) : filteredLinks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 text-sm">
                                        Không tìm thấy liên kết nào.
                                    </td>
                                </tr>
                            ) : filteredLinks.map((link) => (
                                <tr key={link.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-zinc-900 text-sm mb-1">{link.title || 'Không có tiêu đề'}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-zinc-900 text-white text-[10px] font-bold rounded-md">
                                                    /s/{link.code}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(link.code, link.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-200 rounded-md"
                                                >
                                                    {copiedId === link.id ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 max-w-[300px]">
                                            <span className="text-zinc-500 text-xs truncate font-medium">{link.originalUrl}</span>
                                            <a
                                                href={link.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-zinc-300 hover:text-zinc-600 transition-colors"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="text-sm font-semibold text-zinc-900">{link.clicks || 0}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-[10px] text-zinc-400 font-semibold gap-1 mb-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>Ngày tạo</span>
                                            </div>
                                            <span className="text-xs text-zinc-600 font-medium">
                                                {format(new Date(link.createdAt), 'dd/MM/yyyy', { locale: vi })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDelete(link.id)}
                                                className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <Portal>
                    <div className="fixed top-0 left-0 right-0 bottom-0 z-[100000] flex items-center justify-center bg-zinc-950/40 backdrop-blur-xl p-4">
                        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center p-6 border-b shrink-0">
                                <div className="space-y-0.5">
                                    <h2 className="text-lg font-bold text-zinc-950">Tạo Link mới</h2>
                                    <p className="text-zinc-500 text-xs">Nhập thông tin bên dưới để tạo liên kết rút gọn.</p>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-700 ml-1">Tiêu đề (Ghi chú)</label>
                                    <input
                                        type="text"
                                        placeholder="VD: Link đăng ký học React..."
                                        required
                                        value={newLink.title}
                                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all placeholder:text-zinc-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-700 ml-1">URL Gốc (Destination)</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        required
                                        value={newLink.originalUrl}
                                        onChange={(e) => setNewLink({ ...newLink, originalUrl: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all placeholder:text-zinc-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-700 ml-1">Mã thu gọn (Tùy chọn)</label>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-2.5 bg-zinc-100 text-zinc-500 rounded-lg text-sm font-medium border border-zinc-200">/</div>
                                        <input
                                            type="text"
                                            placeholder="Để trống để tạo ngẫu nhiên"
                                            value={newLink.code}
                                            onChange={(e) => setNewLink({ ...newLink, code: e.target.value })}
                                            className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-950 outline-none transition-all placeholder:text-zinc-400"
                                        />
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-medium ml-1">Để trống hệ thống sẽ tự sinh 1 mã ngẫu nhiên 7 ký tự.</p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 rounded-lg py-5 border-zinc-200 text-zinc-600 font-semibold"
                                        onClick={() => setIsCreateModalOpen(false)}
                                    >
                                        Hủy bỏ
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] bg-zinc-950 text-white rounded-lg py-5 font-semibold shadow hover:scale-[1.01] active:scale-95 transition-all"
                                    >
                                        {isSubmitting ? 'Đang tạo...' : 'Tạo liên kết'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
}
