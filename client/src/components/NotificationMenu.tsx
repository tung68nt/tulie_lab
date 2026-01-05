import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Bell } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    content: string;
    type: string;
    createdAt: string;
    isRead: boolean;
}

export function NotificationMenu() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res: any = await api.notifications.list();
            const list = Array.isArray(res) ? res : [];
            setNotifications(list.slice(0, 5));
            setUnreadCount(list.filter((n: Notification) => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkRead = async (id: string, isRead: boolean) => {
        if (isRead) return;
        try {
            await api.notifications.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    const formatTime = (dateString: string) => {
        const d = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 1) return 'Vừa xong';
        if (mins < 60) return `${mins} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return d.toLocaleDateString('vi-VN');
    };

    return (
        <div className="relative mr-2" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-muted/50 rounded-full transition-colors outline-none"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-foreground"></span>
                )}
            </button>

            {/* Dropdown with animation like avatar menu */}
            <div className={`absolute right-0 top-full mt-2 w-80 rounded-lg border bg-background shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out transform origin-top-right ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                {/* Header */}
                <div className="px-4 py-3 border-b flex justify-between items-center">
                    <span className="font-semibold text-sm">Thông báo</span>
                    {unreadCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {unreadCount} chưa đọc
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground text-sm">
                            Không có thông báo
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${!n.isRead ? 'bg-muted/30' : ''}`}
                                    onClick={() => handleMarkRead(n.id, n.isRead)}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Unread indicator */}
                                        <div className="pt-1.5 w-2 flex-shrink-0">
                                            {!n.isRead && (
                                                <span className="block h-2 w-2 rounded-full bg-foreground"></span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug ${!n.isRead ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {n.content}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                                                {formatTime(n.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="border-t">
                        <Link
                            href="/notifications"
                            className="block py-2.5 text-center text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Xem tất cả thông báo
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
