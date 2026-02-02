'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types/api';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CountdownTimer } from './CountdownTimer';
import { Video, Calendar, Clock, MapPin, ExternalLink, Users } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ClassroomLobbyProps {
    event: Event;
}

export function ClassroomLobby({ event }: ClassroomLobbyProps) {
    const [canJoin, setCanJoin] = useState(false);
    const eventDate = new Date(event.date); // Event date usually includes time if stored as ISO, but let's assume it might not
    // Ideally event.date in schema is DateTime, so it has time.

    // Check if we are within 15 minutes of start time or passed it
    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const timeDiff = eventDate.getTime() - now.getTime();
            // Allow joining 15 minutes before
            if (timeDiff <= 15 * 60 * 1000) {
                setCanJoin(true);
            }
        };

        checkTime();
        const timer = setInterval(checkTime, 10000); // Check every 10s
        return () => clearInterval(timer);
    }, [eventDate]);

    const handleJoin = () => {
        if (event.link) {
            window.open(event.link, '_blank');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left: Info */}
                <div className="space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <Video className="w-4 h-4" />
                            Lớp Học Trực Tuyến
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                            {event.title}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {event.description || 'Hãy chuẩn bị sẵn sàng cho buổi học thú vị này nhé!'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Calendar className="w-5 h-5 text-foreground" />
                            <span className="text-foreground font-medium">Ngày:</span>
                            {format(eventDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Clock className="w-5 h-5 text-foreground" />
                            <span className="text-foreground font-medium">Giờ:</span>
                            {format(eventDate, 'HH:mm')}
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <MapPin className="w-5 h-5 text-foreground" />
                            <span className="text-foreground font-medium">Địa điểm:</span>
                            Online via {event.link && event.link.includes('zoom') ? 'Zoom' : 'Google Meet'}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            size="lg"
                            className="w-full md:w-auto min-w-[200px] text-lg h-12"
                            disabled={!canJoin || !event.link}
                            onClick={handleJoin}
                        >
                            {canJoin ? (
                                <>
                                    Vào Lớp Ngay
                                    <ExternalLink className="w-5 h-5 ml-2" />
                                </>
                            ) : (
                                "Chưa đến giờ"
                            )}
                        </Button>
                        {!canJoin && (
                            <p className="text-xs text-muted-foreground mt-2 text-center md:text-left">
                                * Nút sẽ mở trước giờ học 15 phút
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: Countdown Card */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-25"></div>
                    <Card className="relative p-8 text-center border-2 border-primary/5 bg-card/95 backdrop-blur">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-6">Thời gian còn lại</h3>

                        <CountdownTimer
                            targetDate={event.date}
                            onComplete={() => setCanJoin(true)}
                        />

                        <div className="mt-8 pt-6 border-t">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                Waiting Room
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
