'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Event } from '@/types/api';
import { ClassroomLobby } from '@/components/classroom/ClassroomLobby';
import { Button } from '@/components/Button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ClassroomPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Assuming api.events.get returns the event object directly or inside data
                // checking api.ts: get: (id: string) => request<unknown>(`/events/${id}`),
                // it returns unknown, we cast it. 
                // Wait, need to check if response is { data: Event } or just Event.
                // Usually list returns { data: [] }, get returns object.
                // Course controller returns res.json(course).
                // Likely events controller returns res.json(event).
                const data: any = await api.events.get(params.id as string);
                setEvent(data.data || data); // Handle both potential formats just in case
            } catch (err) {
                console.error('Failed to load event:', err);
                setError('Không tìm thấy lớp học hoặc lớp học đã bị xóa.');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchEvent();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-3 border-border border-t-primary animate-spin" style={{ animationDuration: '0.6s' }} />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Đã xảy ra lỗi</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Link href="/dashboard">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Simple Header */}
            <header className="border-b h-16 flex items-center px-4 md:px-6 fixed top-0 w-full bg-background/80 backdrop-blur z-50">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                </Link>
            </header>

            <main className="pt-16 container mx-auto">
                <ClassroomLobby event={event} />
            </main>
        </div>
    );
}
