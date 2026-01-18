'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { addToast } = useToast();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res: any = await api.notifications.list();
            setNotifications(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentNotifications = notifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleMarkRead = async (id: string) => {
        try {
            await api.notifications.markRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
            window.dispatchEvent(new Event('notifications-update'));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllRead = async () => {
        const unread = notifications.filter(n => !n.isRead);
        if (unread.length === 0) return;

        try {
            await Promise.all(unread.map(n => api.notifications.markRead(n.id)));
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            window.dispatchEvent(new Event('notifications-update'));
            addToast('Đã đánh dấu tất cả là đã đọc', 'success');
        } catch (e) {
            addToast('Lỗi thao tác', 'error');
        }
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const date = d.toLocaleDateString('en-GB');
        return `${time} - ${date}`;
    };

    // Convert URLs in text to clickable links
    const formatContent = (text: string) => {
        if (!text) return text;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    if (loading) {
        return (
            <div className="container py-10 min-h-screen flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="container py-10 min-h-screen max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Thông báo</h1>
                    <p className="text-muted-foreground mt-1">Cập nhật tin tức và hoạt động mới nhất</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                        Đánh dấu tất cả đã đọc
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg text-muted-foreground">
                    <p className="text-lg font-medium">Không có thông báo nào</p>
                    <p className="text-sm mt-1">Bạn sẽ nhận được thông báo khi có cập nhật mới từ hệ thống.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b text-left">
                                    <th className="py-3 px-4 font-semibold w-8"></th>
                                    <th className="py-3 px-4 font-semibold w-1/4">Tiêu đề</th>
                                    <th className="py-3 px-4 font-semibold">Nội dung</th>
                                    <th className="py-3 px-4 font-semibold text-right">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentNotifications.map((n) => (
                                    <tr
                                        key={n.id}
                                        className={`border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${!n.isRead ? 'bg-primary/5' : ''}`}
                                        onClick={() => !n.isRead && handleMarkRead(n.id)}
                                    >
                                        <td className="py-4 px-4">
                                            {!n.isRead && (
                                                <span className="h-2 w-2 rounded-full bg-foreground block"></span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`${!n.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                                                {n.title}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 max-w-md">
                                            <div className="line-clamp-2 text-muted-foreground" title={n.content}>
                                                {formatContent(n.content)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDate(n.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Hiển thị {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, notifications.length)} trong số {notifications.length} thông báo
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Trước
                                </Button>
                                <div className="text-sm font-medium">
                                    Trang {currentPage} / {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
