'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Video, Calendar, Clock, Check, X, AlertCircle } from 'lucide-react';
import { format, isPast, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/Button';

interface MentoringSession {
    id: string;
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    meetingLink?: string;
    addOn: {
        name: string;
        sessionDuration: number;
    };
    curriculum?: string; // Implicitly from AddOn or specific session note?
}

export function MentoringSidebar({ userId }: { userId?: string }) {
    const [sessions, setSessions] = useState<MentoringSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            if (!userId) return;
            try {
                const data: any = await api.request('/mentoring/my-sessions');
                setSessions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, [userId]);

    if (loading) return <div className="p-4 text-center text-sm text-muted-foreground">Đang tải lịch...</div>;

    if (sessions.length === 0) {
        return (
            <div className="p-6 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">Chưa có lịch hẹn</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Bạn chưa có buổi mentoring nào được lên lịch. Vui lòng liên hệ Admin để đăng ký.
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-border">
            {sessions.map((session) => {
                const start = new Date(session.startTime);
                const isUpcoming = !isPast(start) || isSameDay(start, new Date());
                const statusColor = {
                    PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-100',
                    CONFIRMED: 'text-green-600 bg-green-50 border-green-100',
                    COMPLETED: 'text-neutral-500 bg-neutral-100 border-neutral-200',
                    CANCELLED: 'text-red-500 bg-red-50 border-red-100'
                }[session.status];

                const statusText = {
                    PENDING: 'Chờ xác nhận',
                    CONFIRMED: 'Sắp diễn ra',
                    COMPLETED: 'Đã xong',
                    CANCELLED: 'Đã hủy'
                }[session.status];

                return (
                    <div key={session.id} className="p-4 hover:bg-muted/10 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusColor}`}>
                                {statusText}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {session.addOn.sessionDuration}p
                            </span>
                        </div>

                        <h4 className="font-semibold text-sm text-foreground mb-1">
                            {format(start, 'dd/MM/yyyy', { locale: vi })}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {format(start, 'HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}
                        </p>

                        <div className="text-xs text-foreground/80 mb-3 bg-muted/30 p-2 rounded">
                            {session.addOn.name}
                        </div>

                        {session.status === 'CONFIRMED' && isUpcoming && session.meetingLink && (
                            <Button
                                size="sm"
                                className="w-full gap-2 h-8 text-xs"
                                onClick={() => window.open(session.meetingLink, '_blank')}
                            >
                                <Video className="w-3 h-3" /> Vào phòng học
                            </Button>
                        )}

                        {session.status === 'PENDING' && (
                            <div className="text-[10px] text-yellow-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Đang chờ Admin xếp lịch
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
