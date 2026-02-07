'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import {
    Share2, Copy, X, Cloud, CloudUpload,
    MousePointer2, Square, Diamond, Circle, ArrowRight, Minus, Pencil, Type, Image as ImageIcon, Eraser,
    Hand, Lock, Undo2, Redo2, Menu, Library as LibraryIcon, Plus, HelpCircle
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Portal } from '@/components/Portal';

// Dynamic import for the wrapper that contains Excalidraw native components
const ExcalidrawWrapper = dynamic(
    () => import('./ExcalidrawWrapper'),
    { ssr: false }
);

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

const TOOLS = [
    { value: 'hand', icon: Hand, label: 'Hand (H)', shortcut: 'H' },
    { value: 'selection', icon: MousePointer2, label: 'Selection (1)', shortcut: '1' },
    { value: 'rectangle', icon: Square, label: 'Rectangle (2)', shortcut: '2' },
    { value: 'diamond', icon: Diamond, label: 'Diamond (3)', shortcut: '3' },
    { value: 'ellipse', icon: Circle, label: 'Ellipse (4)', shortcut: '4' },
    { value: 'arrow', icon: ArrowRight, label: 'Arrow (5)', shortcut: '5' },
    { value: 'line', icon: Minus, label: 'Line (6)', shortcut: '6' },
    { value: 'freedraw', icon: Pencil, label: 'Draw (7)', shortcut: '7' },
    { value: 'text', icon: Type, label: 'Text (8)', shortcut: '8' },
    { value: 'image', icon: ImageIcon, label: 'Image (9)', shortcut: '9' },
    { value: 'eraser', icon: Eraser, label: 'Eraser (0)', shortcut: '0' },
];

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    const [whiteboard, setWhiteboard] = useState<WhiteboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>({});
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [activeTool, setActiveTool] = useState('selection');
    const [isLocked, setIsLocked] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const socketRef = useRef<Socket | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initialLoadRef = useRef(false);
    const lastPointerUpdateRef = useRef(0);
    const lastEmitTimeRef = useRef(0); // For Performance Throttling

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
        const socketUrl = apiBaseUrl.replace(/\/api$/, '') || (typeof window !== 'undefined' ? window.location.origin : '');

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
            const appState = { ...excalidrawAPI.getAppState() };
            delete appState.collaborators;

            const snapshot = { elements, appState };

            setSaveStatus('saving');
            await api.whiteboards.saveArtboard(whiteboard.artboards[0].id, snapshot);
            setSaveStatus('saved');
        } catch (error) {
            console.error('Auto-save failed:', error);
            setSaveStatus('unsaved');
        }
    }, [whiteboard, excalidrawAPI]);

    // Load initial state
    useEffect(() => {
        if (!excalidrawAPI || !whiteboard?.artboards?.[0]?.elements || initialLoadRef.current) return;

        try {
            initialLoadRef.current = true;
            const data = typeof whiteboard.artboards[0].elements === 'string'
                ? JSON.parse(whiteboard.artboards[0].elements)
                : whiteboard.artboards[0].elements;

            if (data.elements) {
                const sanitizedAppState = data.appState || {};
                if (sanitizedAppState.collaborators) {
                    delete sanitizedAppState.collaborators;
                }

                excalidrawAPI.updateScene({
                    elements: data.elements,
                    appState: sanitizedAppState
                });

                if (sanitizedAppState.zoom) {
                    setZoom(sanitizedAppState.zoom.value);
                }
            }
        } catch (e) {
            console.error('Failed to load snapshot:', e);
        }
    }, [whiteboard, excalidrawAPI]);

    const onChange = (elements: readonly any[], appState: any) => {
        if (!initialLoadRef.current) return;

        // Sync active tool state
        if (appState.activeTool) {
            if (appState.activeTool.type !== activeTool) {
                setActiveTool(appState.activeTool.type);
            }
            if (appState.activeTool.locked !== isLocked) {
                setIsLocked(appState.activeTool.locked);
            }
        }

        // Sync zoom state
        if (appState.zoom && appState.zoom.value !== zoom) {
            setZoom(appState.zoom.value);
        }

        // Sync library state
        if (appState.libraryOpen !== isLibraryOpen) {
            setIsLibraryOpen(appState.libraryOpen);
        }

        if (saveStatus === 'saved') setSaveStatus('unsaved');

        // PERFORMANCE OPTIMIZATION: Throttle socket emission
        const now = Date.now();
        if (now - lastEmitTimeRef.current > 50) { // Limit to 20 updates per second
            lastEmitTimeRef.current = now;
            if (socketRef.current) {
                socketRef.current.emit('draw_change', {
                    whiteboardId: id,
                    changes: { elements }
                });
            }
        }

        if (!saveTimeoutRef.current) {
            saveTimeoutRef.current = setTimeout(() => {
                handleSave();
                saveTimeoutRef.current = null;
            }, 3000);
        }
    };

    const setTool = (tool: string) => {
        if (!excalidrawAPI) return;
        setActiveTool(tool);
        excalidrawAPI.setActiveTool({ type: tool });
    };

    const toggleLock = () => {
        if (!excalidrawAPI) return;
        const newLockedState = !isLocked;
        setIsLocked(newLockedState);
        excalidrawAPI.setActiveTool({ locked: newLockedState });
    };

    // Custom UI Handlers
    const handleUndo = () => {
        if (excalidrawAPI) {
            // Triggering native undo via DOM is most reliable
            const undoBtn = document.querySelector('[aria-label="Undo"]') as HTMLButtonElement;
            if (undoBtn) undoBtn.click();
        }
    };

    const handleRedo = () => {
        if (excalidrawAPI) {
            const redoBtn = document.querySelector('[aria-label="Redo"]') as HTMLButtonElement;
            if (redoBtn) redoBtn.click();
        }
    };

    const handleZoomIn = () => {
        if (!excalidrawAPI) return;
        const currentZoom = excalidrawAPI.getAppState().zoom.value;
        excalidrawAPI.updateScene({ appState: { zoom: { value: Math.min(currentZoom + 0.1, 10) } } });
    };

    const handleZoomOut = () => {
        if (!excalidrawAPI) return;
        const currentZoom = excalidrawAPI.getAppState().zoom.value;
        excalidrawAPI.updateScene({ appState: { zoom: { value: Math.max(currentZoom - 0.1, 0.1) } } });
    };

    const handleResetZoom = () => {
        if (!excalidrawAPI) return;
        excalidrawAPI.updateScene({ appState: { zoom: { value: 1 } } });
    };

    const toggleLibrary = () => {
        if (!excalidrawAPI) return;
        excalidrawAPI.updateScene({ appState: { libraryOpen: !isLibraryOpen } });
        setIsLibraryOpen(!isLibraryOpen);
    };

    const openMenu = () => {
        if (!excalidrawAPI) return;
        const menuBtn = document.querySelector('.DropdownMenu-button') as HTMLButtonElement;
        if (menuBtn) menuBtn.click();
    };

    const openHelp = () => {
        if (!excalidrawAPI) return;
        excalidrawAPI.updateScene({ appState: { openDialog: { name: "help" } } });
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
            <div className="fixed top-0 left-0 right-0 bottom-0 z-[200] w-full h-full bg-[#f8f9fa] overflow-hidden whiteboard-container">
                <style>{`
                .whiteboard-container .excalidraw-wrapper {
                    height: 100% !important;
                    width: 100% !important;
                }
                
                /* CRITICAL: Alias 'Virgil' to 'DFVN-Excalifont' for 100% Vietnamese support */
                @font-face {
                    font-family: "Virgil";
                    src: url('/fonts/DFVN-Excalifont.otf') format('opentype');
                    font-weight: 400;
                    font-style: normal;
                    font-display: swap;
                }

                .whiteboard-container .excalidraw {
                    border: none !important;
                    --ui-font: system-ui, "Inter", sans-serif !important;
                    font-family: system-ui, "Inter", sans-serif !important;
                    --color-primary: #18181b !important;
                    --color-primary-dark: #09090b !important;
                    --color-brand: #18181b !important;
                }

                /* HIDE ALL NATIVE UI CLUSTERS */
                .whiteboard-container .excalidraw .layer-ui__wrapper__top-left,
                .whiteboard-container .excalidraw .layer-ui__wrapper__top-right,
                .whiteboard-container .excalidraw .layer-ui__wrapper__footer-left,
                .whiteboard-container .excalidraw .layer-ui__wrapper__footer-right,
                .whiteboard-container .excalidraw .layer-ui__wrapper__footer-center,
                .whiteboard-container .excalidraw .App-toolbar {
                    display: none !important;
                }

                /* ENSURE PROPERTIES PANEL IS FULL COLOR */
                .whiteboard-container .excalidraw .sidebar,
                .whiteboard-container .excalidraw .island,
                .whiteboard-container .excalidraw .users-list-wrapper,
                .whiteboard-container .excalidraw .context-menu {
                    filter: none !important;
                }
                
                .whiteboard-container .excalidraw .Overlay,
                .whiteboard-container .excalidraw .modal {
                    filter: none !important;
                }

                /* Redesign Context Menu */
                .whiteboard-container .excalidraw .context-menu {
                    background-color: #ffffff !important;
                    border: 1px solid #e4e4e7 !important;
                    border-radius: 12px !important;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
                    padding: 4px !important;
                    z-index: 1000 !important;
                }
                
                /* EXCEPTION: Trigger hidden elements for API support */
                .whiteboard-container .excalidraw .DropdownMenu-button,
                .whiteboard-container .excalidraw [aria-label="Undo"],
                .whiteboard-container .excalidraw [aria-label="Redo"] {
                    position: absolute !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    display: block !important;
                }
            `}</style>

                <ExcalidrawWrapper
                    excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                    onChange={onChange}
                    onPointerUpdate={(activeTool: any, pointerData: any) => {
                        const now = Date.now();
                        if (now - lastPointerUpdateRef.current > 50) {
                            lastPointerUpdateRef.current = now;
                            if (socketRef.current) {
                                socketRef.current.emit('cursor_move', {
                                    whiteboardId: id,
                                    point: { x: pointerData.x, y: pointerData.y },
                                    userName: 'Bạn'
                                });
                            }
                        }
                    }}
                    onBack={() => window.location.href = '/whiteboard'}
                    title={whiteboard?.title}
                />

                {/* --- CUSTOM UI --- */}

                {/* 1. TOP LEFT: Branding & Menu */}
                <div className="absolute top-4 left-4 z-[101] pointer-events-auto flex items-center gap-3 bg-white/90 backdrop-blur-md p-1.5 pr-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all h-[64px]">
                    <button
                        onClick={openMenu}
                        className="p-3 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-600"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="w-px h-8 bg-zinc-200 mx-1" />
                    <Logo showText={false} height="h-10" className="flex-shrink-0" />
                    <div className="flex flex-col justify-center select-none ml-1">
                        <span className="text-[11px] uppercase font-bold text-zinc-400 leading-none tracking-[0.2em]">TULIE</span>
                        <span className="text-xl font-black text-zinc-900 leading-none mt-1 whitespace-nowrap">Whiteboard</span>
                    </div>
                </div>

                {/* 2. TOP CENTER: Toolbar + Undo/Redo */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[101] pointer-events-auto">
                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-zinc-200 shadow-xl">

                        <button
                            onClick={toggleLock}
                            className={`p-2.5 rounded-xl transition-all duration-200 ${isLocked ? 'bg-amber-100 text-amber-600' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                            title="Keep tool active"
                        >
                            <Lock className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-zinc-200 mx-1" />

                        <button onClick={handleUndo} className="p-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 transition-all" title="Undo (Ctrl+Z)">
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button onClick={handleRedo} className="p-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 transition-all" title="Redo (Ctrl+Shift+Z)">
                            <Redo2 className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-zinc-200 mx-1" />

                        {TOOLS.map((tool) => (
                            <button
                                key={tool.value}
                                onClick={() => setTool(tool.value)}
                                className={`relative p-2.5 rounded-xl transition-all duration-200 ${activeTool === tool.value ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                                title={tool.label}
                            >
                                <tool.icon className="w-4 h-4" />
                                <span className={`absolute -bottom-1 -right-1 text-[8px] font-bold px-1 rounded-full ${activeTool === tool.value ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-400 opacity-60'}`}>
                                    {tool.shortcut}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. TOP RIGHT: Library & Share */}
                <div className="absolute top-4 right-4 z-[101] pointer-events-auto flex items-center gap-3 h-[44px]">
                    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md pl-5 pr-2 py-2 rounded-full border border-zinc-200 shadow-sm h-full">
                        <span className="text-sm font-bold max-w-[150px] truncate text-zinc-900">{whiteboard?.title || 'Bảng chưa đặt tên'}</span>
                        <Button
                            variant="default" size="sm" className="rounded-full bg-zinc-900 text-white h-8 px-5 text-[10px] font-black tracking-widest"
                            onClick={() => setIsShareModalOpen(true)}
                        >
                            <Share2 className="w-3.5 h-3.5 mr-2" />
                            CHIA SẺ
                        </Button>
                    </div>
                    <button
                        onClick={toggleLibrary}
                        className={`p-2.5 rounded-full border shadow-sm transition-all h-[44px] w-[44px] flex items-center justify-center ${isLibraryOpen ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white/90 backdrop-blur-md text-zinc-600 border-zinc-200'}`}
                        title="Library"
                    >
                        <LibraryIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* 4. BOTTOM LEFT: Zoom Controls */}
                <div className="absolute bottom-6 left-6 z-[101] pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-200 shadow-xl h-[52px]">
                    <button onClick={handleZoomOut} className="p-2.5 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500">
                        <Minus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleResetZoom}
                        className="px-4 py-1.5 hover:bg-zinc-100 rounded-xl text-sm font-black text-zinc-900 min-w-[64px] transition-all bg-zinc-50/50"
                    >
                        {Math.round(zoom * 100)}%
                    </button>
                    <button onClick={handleZoomIn} className="p-2.5 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* 5. BOTTOM RIGHT: Status & Help */}
                <div className="absolute bottom-6 right-6 z-[101] pointer-events-auto flex items-center gap-4 h-[48px]">
                    <div className="px-5 py-2.5 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl text-[11px] font-black text-zinc-900 shadow-xl flex items-center gap-3 h-full">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
                        <span className="tracking-tight">{Object.keys(remoteCursors).length + 1} KẾT NỐI</span>
                    </div>
                    <button
                        onClick={openHelp}
                        className="h-[48px] w-[48px] bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                        title="Help"
                    >
                        <HelpCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* Share Modal */}
                {isShareModalOpen && (
                    <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-[4px] pointer-events-auto p-4">
                        <div className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-md border border-zinc-100 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">Chia sẻ bảng</h2>
                                <button onClick={() => setIsShareModalOpen(false)} className="p-3 hover:bg-zinc-100 rounded-full transition-colors">
                                    <X className="w-7 h-7 text-zinc-300" />
                                </button>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2.5 tracking-[0.2em] pl-1">Liên kết công khai</label>
                                    <div className="flex gap-2">
                                        <input type="text" readOnly value={typeof window !== 'undefined' ? window.location.href : ''} className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm text-zinc-600 outline-none font-bold" />
                                        <Button variant="outline" className="rounded-2xl h-[56px] px-5 border-zinc-200 hover:bg-zinc-50" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Đã sao chép!'); }}>
                                            <Copy className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button className="w-full rounded-[20px] h-[64px] text-lg font-black bg-zinc-900 hover:bg-zinc-800 shadow-2xl transition-all active:scale-[0.98]" onClick={() => setIsShareModalOpen(false)}>HOÀN TẤT</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Remote Cursors Overlay */}
                <div className="pointer-events-none absolute inset-0 z-[100]">
                    {Object.entries(remoteCursors).map(([socketId, cursor]) => (
                        <div
                            key={socketId} className="absolute transition-all duration-75 ease-linear pointer-events-none"
                            style={{ left: cursor.point.x, top: cursor.point.y, transform: 'translate(-2px, -2px)' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.65376 12.3822L15.3326 21.0277C16.6221 22.1792 18.5077 21.2215 18.4528 19.5101L17.9213 2.96914C17.8826 1.76231 16.4815 1.10738 15.564 1.88852L5.4357 10.5126C4.5447 11.2709 4.68192 12.671 5.65376 12.3822Z" fill="#18181b" stroke="white" strokeWidth="2" />
                            </svg>
                            <div className="ml-4 mt-2 px-3 py-1.5 bg-zinc-900 text-white text-[11px] rounded-full whitespace-nowrap font-black shadow-2xl">
                                {cursor.userName || 'Bạn học'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Portal>
    );
}
