'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Tldraw, Editor, TLEventMapHandler, createShapeId } from 'tldraw';
import 'tldraw/tldraw.css';
import { api } from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/Button';
import { Camera, Download, Layers, Share2, Copy, X } from 'lucide-react';

interface WhiteboardEditorProps {
    id: string;
}

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    const [whiteboard, setWhiteboard] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [remoteCursors, setRemoteCursors] = useState<Record<string, any>>({});
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const editorRef = useRef<Editor | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        const socketUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001';
        const socket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to whiteboard sync server');
            socket.emit('join_whiteboard', id);
        });

        socket.on('draw_synced', (patch: any) => {
            if (editorRef.current) {
                // Apply remote changes without triggering local 'user' events
                editorRef.current.store.mergeRemoteChanges(() => {
                    editorRef.current!.store.applyDiff(patch);
                });
            }
        });

        socket.on('cursor_moved', (data: any) => {
            setRemoteCursors(prev => ({
                ...prev,
                [data.socketId]: { point: data.point, userName: data.userName }
            }));
        });

        socket.on('participant_left', (data: any) => {
            setRemoteCursors(prev => {
                const newCursors = { ...prev };
                delete newCursors[data.socketId];
                return newCursors;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    const handleSave = useCallback(async () => {
        if (!editorRef.current || !whiteboard?.artboards?.[0]?.id) return;

        try {
            const snapshot = editorRef.current.getSnapshot();
            await api.whiteboards.saveArtboard(whiteboard.artboards[0].id, snapshot);
            console.log('Whiteboard auto-saved');
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }, [whiteboard]);

    const handleSnapshot = useCallback(async () => {
        if (!editorRef.current || !whiteboard?.artboards?.[0]?.id) return;

        try {
            const snapshot = editorRef.current.getSnapshot();
            await api.whiteboards.saveSnapshot(id, whiteboard.artboards[0].id, snapshot);
            alert('Đã lưu bản sao (snapshot)!');
        } catch (error) {
            console.error('Snapshot failed:', error);
        }
    }, [id, whiteboard]);

    const handleAssetUpload = useCallback(async (editor: Editor, file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Using existing upload API
            const response = await api.uploads.single(file);
            const assetId = createShapeId();

            const asset: any = {
                id: assetId as any,
                type: 'image',
                typeName: 'asset',
                props: {
                    name: file.name,
                    src: response.url,
                    w: 400,
                    h: 300,
                    mimeType: file.type,
                    isAnimated: false,
                },
                meta: {},
            };

            editor.createAssets([asset]);
            return asset;
        } catch (error) {
            console.error('Asset upload failed:', error);
            return null;
        }
    }, []);

    const handleExport = useCallback(async () => {
        if (!editorRef.current) return;

        try {
            const svg = await editorRef.current.getSvgString(Array.from(editorRef.current.getCurrentPageShapeIds()));
            if (!svg) return;

            const blob = new Blob([svg.svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `whiteboard-${id}.svg`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
        }
    }, [id]);

    const handleMount = useCallback((editor: Editor) => {
        editorRef.current = editor;

        // Load initial state if available
        if (whiteboard?.artboards?.[0]?.elements) {
            try {
                const elements = typeof whiteboard.artboards[0].elements === 'string'
                    ? JSON.parse(whiteboard.artboards[0].elements)
                    : whiteboard.artboards[0].elements;
                editor.loadSnapshot(elements);
            } catch (e) {
                console.error('Failed to load snapshot:', e);
            }
        }

        editor.on('change', (event) => {
            if (event.source === 'user') {
                // Throttle saves to every 3 seconds of activity
                if (!saveTimeoutRef.current) {
                    saveTimeoutRef.current = setTimeout(() => {
                        handleSave();
                        saveTimeoutRef.current = null;
                    }, 3000);
                }

                // Immediate broadcast for collaboration
                socketRef.current?.emit('draw_change', {
                    whiteboardId: id,
                    changes: event.changes
                });
            }
        });

        const handlePointerMove = (event: any) => {
            if (event.name === 'pointer_move') {
                socketRef.current?.emit('cursor_move', {
                    whiteboardId: id,
                    point: { x: event.point.x, y: event.point.y },
                    userName: 'Bạn'
                });
            }
        };

        (editor as any).on('event', handlePointerMove);

        // Register asset handler for tldraw v4.3.1
        editor.registerExternalAssetHandler('file', async ({ file }) => {
            return await handleAssetUpload(editor, file);
        });

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            (editor as any).off('event', handlePointerMove);
        };
    }, [whiteboard, handleSave, id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-background pt-16">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 pt-20 bg-background overflow-hidden whiteboard-container">
            <style jsx global>{`
                .whiteboard-container .tl-canvas {
                    background-color: #ffffff !important;
                    background-image: radial-gradient(#e0e0e0 0.5px, transparent 0.5px) !important;
                    background-size: 20px 20px !important;
                    background-position: center !important;
                }
                /* Hide default tldraw background if any */
                .tl-background {
                    display: none !important;
                }
            `}</style>
            <Tldraw
                autoFocus
                onMount={handleMount}
                inferDarkMode={false}
                persistenceKey={`whiteboard-${id}`}
            />

            {/* Header Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-[102]">
                <div className="flex items-center gap-2 pointer-events-auto">
                    <Button
                        variant="light"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="rounded-full px-4"
                    >
                        Quay lại
                    </Button>
                    <div className="h-6 w-[1px] bg-zinc-200 mx-2" />
                    <h1 className="text-sm font-semibold text-zinc-900 border-l border-zinc-200 pl-4">
                        {whiteboard?.title || 'Đang tải...'}
                    </h1>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                    <Button
                        variant="light"
                        size="sm"
                        onClick={handleSnapshot}
                        className="rounded-full shadow-sm"
                    >
                        <Camera className="w-4 h-4 mr-2" />
                        Lưu bản sao
                    </Button>
                    <Button
                        variant="light"
                        size="sm"
                        onClick={handleExport}
                        className="rounded-full shadow-sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Xuất file
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="rounded-full shadow-md bg-zinc-900"
                        onClick={() => setIsShareModalOpen(true)}
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Chia sẻ
                    </Button>
                </div>
            </div>

            {/* Share Modal */}
            {isShareModalOpen && (
                <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto">
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

            {/* Participants List Overlay */}
            <div className="absolute top-20 right-4 flex items-center gap-1 z-[101]">
                {Object.values(remoteCursors).slice(0, 3).map((cursor, idx) => (
                    <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600 shadow-sm first:ml-0 -ml-2"
                        title={cursor.userName}
                    >
                        {cursor.userName?.[0] || 'U'}
                    </div>
                ))}
                {Object.keys(remoteCursors).length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600 shadow-sm -ml-2">
                        +{Object.keys(remoteCursors).length - 3}
                    </div>
                )}
                <div className="ml-2 px-3 py-1 bg-background/80 backdrop-blur-md border rounded-full text-[10px] font-medium shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {Object.keys(remoteCursors).length + 1} đang kết nối
                </div>
            </div>
        </div>
    );
}
