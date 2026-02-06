'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/Button';
import { Camera, Download, Share2, Copy, X, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { Logo } from '@/components/Logo';

// Dynamic import for Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
    () => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
    { ssr: false }
);

import { Portal } from '@/components/Portal';

interface WhiteboardEditorProps {
    id: string;
}

interface Artboard {
    id: string;
    name: string;
    order: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    elements?: any;
}

interface WhiteboardData {
    id: string;
    title?: string;
    description?: string;
    artboards: Artboard[];
}

interface RemoteCursor {
    point: { x: number; y: number };
    userName?: string;
}

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    const [whiteboard, setWhiteboard] = useState<WhiteboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>({});
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const socketRef = useRef<Socket | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initialLoadRef = useRef(false);

    // Fetch whiteboard data on mount
    useEffect(() => {
        async function loadWhiteboard() {
            try {
                const data = await api.whiteboards.get(id);
                setWhiteboard(data);
            } catch (error) {
                console.error('Failed to load whiteboard:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadWhiteboard();
    }, [id]);

    // Socket Initialization
    useEffect(() => {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const socketUrl = apiBaseUrl.replace(/\/api$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001');

        const socket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to whiteboard sync server (Excalidraw)');
            socket.emit('join_whiteboard', id);
        });

        socket.on('draw_synced', (data: any) => {
            if (excalidrawAPI && initialLoadRef.current) {
                // For Excalidraw, we typically sync elements and appState
                if (data.elements) {
                    excalidrawAPI.updateScene({
                        elements: data.elements,
                        commitToHistory: false
                    });
                }
            }
        });

        socket.on('cursor_moved', (data: { socketId: string; point: { x: number; y: number }; userName?: string }) => {
            setRemoteCursors(prev => ({
                ...prev,
                [data.socketId]: { point: data.point, userName: data.userName }
            }));
        });

        socket.on('participant_left', (data: { socketId: string }) => {
            setRemoteCursors(prev => {
                const newCursors = { ...prev };
                delete newCursors[data.socketId];
                return newCursors;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [id, excalidrawAPI]);

    const handleSave = useCallback(async () => {
        if (!excalidrawAPI || !whiteboard?.artboards?.[0]?.id) return;

        try {
            const elements = excalidrawAPI.getSceneElements();
            const appState = excalidrawAPI.getAppState();
            const snapshot = { elements, appState };

            await api.whiteboards.saveArtboard(whiteboard.artboards[0].id, snapshot);
            console.log('Whiteboard auto-saved (Excalidraw)');
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }, [whiteboard, excalidrawAPI]);

    const handleSnapshot = useCallback(async () => {
        if (!excalidrawAPI || !whiteboard?.artboards?.[0]?.id) return;

        try {
            const elements = excalidrawAPI.getSceneElements();
            const appState = excalidrawAPI.getAppState();
            const snapshot = { elements, appState };

            await api.whiteboards.saveSnapshot(id, whiteboard.artboards[0].id, snapshot);
            alert('Đã lưu bản sao (snapshot)!');
        } catch (error) {
            console.error('Snapshot failed:', error);
        }
    }, [id, whiteboard, excalidrawAPI]);

    const handleExport = useCallback(async () => {
        if (!excalidrawAPI) return;
        // Excalidraw has its own export logic, but for simplicity we trigger the internal UI or a basic download
        // For now, let's just log and suggest using the built-in Excalidraw export
        alert('Vui lòng sử dụng menu Excalidraw để xuất file!');
    }, [excalidrawAPI]);

    // Load initial state
    useEffect(() => {
        if (!excalidrawAPI || !whiteboard?.artboards?.[0]?.elements || initialLoadRef.current) return;

        try {
            initialLoadRef.current = true;
            const data = typeof whiteboard.artboards[0].elements === 'string'
                ? JSON.parse(whiteboard.artboards[0].elements)
                : whiteboard.artboards[0].elements;

            if (data.elements) {
                excalidrawAPI.updateScene({
                    elements: data.elements,
                    appState: data.appState || {}
                });
            }
        } catch (e) {
            console.error('Failed to load snapshot:', e);
        }
    }, [whiteboard, excalidrawAPI]);

    const onChange = (elements: readonly any[], appState: any) => {
        if (!initialLoadRef.current) return;

        // Broadcast changes (throttled/debounced is better but start simple)
        if (socketRef.current) {
            socketRef.current.emit('draw_change', {
                whiteboardId: id,
                changes: { elements }
            });
        }

        // Throttle saves
        if (!saveTimeoutRef.current) {
            saveTimeoutRef.current = setTimeout(() => {
                handleSave();
                saveTimeoutRef.current = null;
            }, 3000);
        }
    };

    const handlePointerMove = (activeTool: any, pointerData: any) => {
        if (socketRef.current) {
            socketRef.current.emit('cursor_move', {
                whiteboardId: id,
                point: { x: pointerData.x, y: pointerData.y },
                userName: 'Bạn'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-background pt-16">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <Portal>
            <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] w-full h-full bg-[#18181b] overflow-hidden whiteboard-container">
                <style>{`
                .whiteboard-container .excalidraw-wrapper {
                    height: 100% !important;
                    width: 100% !important;
                }
            `}</style>

                <Excalidraw
                    excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                    onChange={onChange}
                    onPointerUpdate={handlePointerMove as any}
                    theme="dark"
                    UIOptions={{
                        canvasActions: {
                            toggleTheme: false,
                            export: {
                                saveFileToDisk: true,
                            }
                        }
                    }}
                />

                {/* Header Controls - Lower z-index to avoid covering Excalidraw UI */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-[1001]">
                    {/* Left Group: Back & Branding */}
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <Link href="/whiteboard">
                            <Button
                                variant="white"
                                size="icon"
                                className="h-10 w-10 round-xl shadow-sm hover:shadow-md transition-all group"
                                title="Quay lại danh sách"
                            >
                                <ChevronLeft className="w-5 h-5 text-zinc-900 group-hover:-translate-x-0.5 transition-transform" />
                            </Button>
                        </Link>

                        <div className="bg-white/90 backdrop-blur-md border border-zinc-200 pl-3 pr-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Logo showText={false} className="scale-90" />
                                <div className="flex flex-col -gap-1">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Tulie</span>
                                    <span className="text-sm font-bold text-zinc-900 whiteboard-branding leading-none">Whiteboard</span>
                                </div>
                            </div>
                            <div className="h-4 w-[1px] bg-zinc-200" />
                            <h1 className="text-sm font-medium text-zinc-600 max-w-[200px] truncate">
                                {isLoading ? 'Đang tải...' : (whiteboard?.title || 'Bảng chưa đặt tên')}
                            </h1>
                        </div>
                    </div>

                    {/* Right Group: Actions */}
                    <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-zinc-200 shadow-sm mr-12">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSnapshot}
                            className="rounded-lg hover:bg-zinc-100 text-zinc-600 h-8 px-2"
                            title="Lưu bản sao"
                        >
                            <Camera className="w-4 h-4" />
                        </Button>
                        <div className="h-4 w-[1px] bg-zinc-200 mx-1" />
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-lg shadow-none bg-zinc-900 text-white hover:bg-zinc-800 h-8 px-3"
                            onClick={() => setIsShareModalOpen(true)}
                        >
                            <Share2 className="w-3.5 h-3.5 mr-1.5" />
                            Chia sẻ
                        </Button>
                    </div>
                </div>

                {/* Share Modal */}
                {isShareModalOpen && (
                    <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-zinc-200">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-zinc-900">Chia sẻ bảng trắng</h2>
                                <button
                                    onClick={() => setIsShareModalOpen(false)}
                                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 mb-1">Liên kết công khai</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={typeof window !== 'undefined' ? window.location.href : ''}
                                            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-600 outline-none"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                alert('Đã sao chép liên kết!');
                                            }}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-zinc-100">
                                    <p className="text-sm text-zinc-500 text-center mb-4">
                                        Bất kỳ ai có liên kết này đều có thể xem và vẽ.
                                    </p>
                                    <Button
                                        className="w-full rounded-xl py-6"
                                        onClick={() => setIsShareModalOpen(false)}
                                    >
                                        Hoàn tất
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Remote Cursors Overlay */}
                <div className="pointer-events-none absolute inset-0 z-[100]">
                    {Object.entries(remoteCursors).map(([socketId, cursor]) => (
                        <div
                            key={socketId}
                            className="absolute transition-all duration-75 ease-linear"
                            style={{
                                left: cursor.point.x,
                                top: cursor.point.y,
                                transform: 'translate(-2px, -2px)'
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.65376 12.3822L15.3326 21.0277C16.6221 22.1792 18.5077 21.2215 18.4528 19.5101L17.9213 2.96914C17.8826 1.76231 16.4815 1.10738 15.564 1.88852L5.4357 10.5126C4.5447 11.2709 4.68192 12.671 5.65376 12.3822Z" fill="#3B82F6" stroke="white" strokeWidth="2" />
                            </svg>
                            <div className="ml-4 mt-2 px-2 py-1 bg-blue-500 text-white text-[10px] rounded-full whitespace-nowrap font-medium shadow-sm">
                                {cursor.userName || 'Người dùng'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Participants Status */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 z-[101]">
                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md border border-zinc-200 rounded-full text-[11px] font-semibold text-zinc-900 shadow-md flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {Object.keys(remoteCursors).length + 1} đang kết nối
                    </div>
                </div>
            </div>
        </Portal>
    );
}
