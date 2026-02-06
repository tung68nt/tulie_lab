'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Tldraw, Editor, createShapeId, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { api } from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/Button';
import { Camera, Download, Share2, Copy, X, ChevronLeft, MousePointer2, Hand, Pencil, Type, StickyNote, Square, Circle, Image, Eraser, Minus } from 'lucide-react';
import { Logo } from '@/components/Logo';

// Helper component to capture the editor instance via hook
function EditorCapture({ onMount }: { onMount: (editor: Editor) => void }) {
    const editor = useEditor();
    useEffect(() => {
        if (editor) {
            console.log('CAPTURED EDITOR VIA HOOK', editor);
            onMount(editor);
        }
    }, [editor, onMount]);
    return null;
}

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
    const editorRef = useRef<Editor | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initialLoadRef = useRef(false);
    const [selectedTool, setSelectedTool] = useState('select');

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
        // Use the API URL directly for the socket to avoid Next.js rewrite limitations with WebSockets
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const socketUrl = apiBaseUrl.replace(/\/api$/, '') || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001');

        const socket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to whiteboard sync server');
            socket.emit('join_whiteboard', id);
        });

        socket.on('draw_synced', (patch: unknown) => {
            if (editorRef.current) {
                // Apply remote changes without triggering local 'user' events
                editorRef.current.store.mergeRemoteChanges(() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    editorRef.current!.store.applyDiff(patch as any);
                });
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

            const asset = {
                id: assetId,
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
            } as const;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor.createAssets([asset as any]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return asset as any;
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
        console.log('TLDRAW MOUNTED', editor);
        editorRef.current = editor;
        if (typeof window !== 'undefined') (window as any).editor = editor;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handlePointerMove = (event: any) => {
            if (event.name === 'pointer_move') {
                socketRef.current?.emit('cursor_move', {
                    whiteboardId: id,
                    point: { x: event.point.x, y: event.point.y },
                    userName: 'Bạn'
                });
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editor.on('event', handlePointerMove as any);

        // Sync selected tool state
        const handleToolChange = () => {
            setSelectedTool(editor.getCurrentToolId());
        };
        editor.on('change', handleToolChange);

        // Register asset handler for tldraw v4.3.1
        editor.registerExternalAssetHandler('file', async ({ file }) => {
            return await handleAssetUpload(editor, file);
        });

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor.off('event', handlePointerMove as any);
            editor.off('change', handleToolChange);
        };
    }, [id, handleAssetUpload]);

    // Stable Load initial state - only once per session/id
    useEffect(() => {
        if (!editorRef.current || !whiteboard?.artboards?.[0]?.elements || initialLoadRef.current) return;

        try {
            initialLoadRef.current = true;
            const elements = typeof whiteboard.artboards[0].elements === 'string'
                ? JSON.parse(whiteboard.artboards[0].elements)
                : whiteboard.artboards[0].elements;
            editorRef.current.loadSnapshot(elements);
        } catch (e) {
            console.error('Failed to load snapshot:', e);
        }
    }, [whiteboard, id]);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const handleChange = (event: any) => {
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
        };

        editor.on('change', handleChange);

        return () => {
            editor.off('change', handleChange);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
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
        <div className="fixed inset-0 w-full h-full pt-0 bg-background overflow-hidden whiteboard-container">
            <style jsx global>{`
                .whiteboard-container .tl-canvas {
                    background-color: #ffffff !important;
                    background-image: 
                        radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px) !important;
                    background-size: 25px 25px !important;
                    background-position: center !important;
                    image-rendering: crisp-edges;
                }
                
                /* Monochrome Theme for tldraw components */
                :root, .tldraw-view-port, .tl-ui-layout {
                    --color-primary: #000000 !important;
                    --color-selected: #f4f4f5 !important; /* zinc-100 */
                    --color-selection-stroke: #000000 !important;
                    --color-selection-fill: #f4f4f5 !important;
                    --color-text: #18181b !important;
                    --color-text-1: #18181b !important;
                    --color-text-2: #52525b !important;
                    --color-muted-1: #e4e4e7 !important;
                    --tl-primary: #000000 !important;
                    --tl-select-fill: rgba(0, 0, 0, 0.05) !important;
                    --tl-accent: #000000 !important;
                }

                .whiteboard-container .tl-ui-button {
                    border-radius: 8px !important;
                }

                /* Force toolbar icons to be black/gray */
                .tl-ui-icon {
                    color: #52525b !important;
                }
                
                /* Aggressively override selected state blue background */
                .tl-ui-button[data-state="selected"],
                .tl-ui-button[aria-checked="true"],
                button[data-state="selected"],
                button[aria-checked="true"] {
                    background-color: #f4f4f5 !important;
                    color: #000000 !important;
                }
                
                /* Target the specific tool button wrapper often used in Tldraw */
                .tl-toolbar__tools .tl-ui-button[data-state="selected"] {
                    background-color: #f4f4f5 !important;
                }

                /* Force icon color in selected state */
                .tl-ui-button[data-state="selected"] .tl-ui-icon,
                .tl-ui-button[aria-checked="true"] .tl-ui-icon,
                button[data-state="selected"] .tl-ui-icon,
                button[aria-checked="true"] .tl-ui-icon {
                    color: #000000 !important;
                }

                /* Remove any blue text */
                .tl-ui-button {
                    color: #52525b !important;
                }

                /* Hide the default tldraw UI completely */
                .tlui-layout, .tlui-layout__top, .tlui-layout__bottom, .tlui-page-menu, .tlui-main-menu {
                    display: none !important;
                }

                /* Target light theme specifically for accents */
                .tl-theme__light, :root {
                    --tl-accent: #18181b !important;
                    --tl-primary: #18181b !important;
                    --tl-select-fill: rgba(0, 0, 0, 0.05) !important;
                    --tl-select-stroke: #18181b !important;
                }
            `}</style>
            <div className="relative w-full h-full">
                <Tldraw
                    autoFocus
                    onMount={handleMount}
                    inferDarkMode={false}
                    hideUi={true}
                    {...({ licenseKey: 'trial' } as any)}
                >
                    <EditorCapture onMount={handleMount} />
                </Tldraw>
            </div>
            {/* Header Controls - Redesigned for Monochrome Premium Look */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-[200]">
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

                {/* Right Group: Actions - Positioned to avoid Tldraw native panels if they appear */}
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
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleExport}
                        className="rounded-lg hover:bg-zinc-100 text-zinc-600 h-8 px-2"
                        title="Xuất file"
                    >
                        <Download className="w-4 h-4" />
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
            {
                isShareModalOpen && (
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
                )
            }

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

            {/* Participants List Overlay - Moved to bottom-left to avoid overlap */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1 z-[101]">
                <div className="flex -space-x-2 mr-1">
                    {Object.values(remoteCursors).slice(0, 3).map((cursor, idx) => (
                        <div
                            key={idx}
                            className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600 shadow-sm transition-transform hover:scale-110"
                            title={cursor.userName}
                        >
                            {cursor.userName?.[0] || 'U'}
                        </div>
                    ))}
                    {Object.keys(remoteCursors).length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-600 shadow-sm">
                            +{Object.keys(remoteCursors).length - 3}
                        </div>
                    )}
                </div>
                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md border border-zinc-200 rounded-full text-[11px] font-semibold text-zinc-900 shadow-md flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {Object.keys(remoteCursors).length + 1} đang kết nối
                </div>
            </div>
            {/* Custom Bottom Toolbar - monochrome premium style */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-1 bg-white/90 backdrop-blur-md border border-zinc-200 p-1.5 rounded-2xl shadow-xl">
                <ToolButton
                    active={selectedTool === 'select'}
                    onClick={() => editorRef.current?.setCurrentTool('select')}
                    icon={<MousePointer2 className="w-4 h-4" />}
                    title="Chọn (V)"
                />
                <ToolButton
                    active={selectedTool === 'hand'}
                    onClick={() => editorRef.current?.setCurrentTool('hand')}
                    icon={<Hand className="w-4 h-4" />}
                    title="Di chuyển (H)"
                />
                <div className="w-[1px] h-6 bg-zinc-200 mx-1" />
                <ToolButton
                    active={selectedTool === 'draw'}
                    onClick={() => editorRef.current?.setCurrentTool('draw')}
                    icon={<Pencil className="w-4 h-4" />}
                    title="Vẽ (D/P)"
                />
                <ToolButton
                    active={selectedTool === 'eraser'}
                    onClick={() => editorRef.current?.setCurrentTool('eraser')}
                    icon={<Eraser className="w-4 h-4" />}
                    title="Tẩy (E)"
                />
                <div className="w-[1px] h-6 bg-zinc-200 mx-1" />
                <ToolButton
                    active={selectedTool === 'text'}
                    onClick={() => editorRef.current?.setCurrentTool('text')}
                    icon={<Type className="w-4 h-4" />}
                    title="Văn bản (T)"
                />
                <ToolButton
                    active={selectedTool === 'note'}
                    onClick={() => editorRef.current?.setCurrentTool('note')}
                    icon={<StickyNote className="w-4 h-4" />}
                    title="Ghi chú (N)"
                />
                <div className="w-[1px] h-6 bg-zinc-200 mx-1" />
                <ToolButton
                    active={selectedTool === 'geo' && (editorRef.current?.getInstanceState().stylesForNextShape as any)?.geo === 'rectangle'}
                    onClick={() => {
                        editorRef.current?.setCurrentTool('geo');
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        editorRef.current?.updateInstanceState({ stylesForNextShape: { ...editorRef.current?.getInstanceState().stylesForNextShape, geo: 'rectangle' as any } });
                    }}
                    icon={<Square className="w-4 h-4" />}
                    title="Hình vuông (R)"
                />
                <ToolButton
                    active={selectedTool === 'geo' && (editorRef.current?.getInstanceState().stylesForNextShape as any)?.geo === 'ellipse'}
                    onClick={() => {
                        editorRef.current?.setCurrentTool('geo');
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        editorRef.current?.updateInstanceState({ stylesForNextShape: { ...editorRef.current?.getInstanceState().stylesForNextShape, geo: 'ellipse' as any } });
                    }}
                    icon={<Circle className="w-4 h-4" />}
                    title="Hình tròn (O)"
                />
                <ToolButton
                    active={selectedTool === 'arrow'}
                    onClick={() => editorRef.current?.setCurrentTool('arrow')}
                    icon={<Minus className="w-4 h-4" />}
                    title="Mũi tên (A)"
                />
                <div className="w-[1px] h-6 bg-zinc-200 mx-1" />
                <ToolButton
                    active={false}
                    onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file && editorRef.current) {
                                handleAssetUpload(editorRef.current, file);
                            }
                        };
                        input.click();
                    }}
                    icon={<Image className="w-4 h-4" />}
                    title="Tải ảnh"
                />
            </div>
        </div >
    );
}

function ToolButton({ active, onClick, icon, title }: { active: boolean, onClick: () => void, icon: React.ReactNode, title: string }) {
    return (
        <button
            onClick={onClick}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${active
                ? 'bg-zinc-900 text-white shadow-inner scale-95'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 active:scale-90'
                }`}
            title={title}
        >
            {icon}
        </button>
    );
}
