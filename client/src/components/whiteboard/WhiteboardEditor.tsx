'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import {
    Share2, Copy, X, Cloud, CloudUpload,
    MousePointer2, Square, Diamond, Circle, ArrowRight, Minus, Pencil, Type, Image as ImageIcon, Eraser,
    Grab, Lock, Undo2, Redo2, Menu, Library as LibraryIcon, Plus, HelpCircle,
    Layout, Zap, Globe, Sparkles, ChevronDown, MousePointer
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
    { value: 'hand', icon: Grab, label: 'Hand (H)', shortcut: 'H' },
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

const EXTRA_TOOLS = [
    { value: 'frame', icon: Layout, label: 'Frame (F)', shortcut: 'F' },
    { value: 'laser', icon: Zap, label: 'Laser (K)', shortcut: 'K' },
    { value: 'lasso', icon: MousePointer, label: 'Lasso (L)', shortcut: 'L' },
    { value: 'embeddable', icon: Globe, label: 'Web Embed', shortcut: '' },
    { value: 'magicframe', icon: Sparkles, label: 'AI Generate', shortcut: '' },
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
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState('');

    const socketRef = useRef<Socket | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initialLoadRef = useRef(false);
    const lastPointerUpdateRef = useRef(0);
    const lastEmitTimeRef = useRef(0); // For Performance Throttling
    const saveStatusRef = useRef(saveStatus);
    const excalidrawRef = useRef<any>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

    // Sync ref with state for use in callbacks
    useEffect(() => {
        excalidrawRef.current = excalidrawAPI;
    }, [excalidrawAPI]);

    useEffect(() => {
        saveStatusRef.current = saveStatus;
    }, [saveStatus]);

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

    const onChange = useCallback((elements: readonly any[], appState: any) => {
        if (!initialLoadRef.current) return;

        // Sync active tool state
        if (appState.activeTool) {
            setActiveTool(prev => {
                if (appState.activeTool.type !== prev) return appState.activeTool.type;
                return prev;
            });
            setIsLocked(prev => {
                if (appState.activeTool.locked !== prev) return appState.activeTool.locked;
                return prev;
            });
        }

        // Sync zoom state
        if (appState.zoom) {
            setZoom(prev => {
                if (appState.zoom.value !== prev) return appState.zoom.value;
                return prev;
            });
        }

        // Sync library state
        const isLibOpen = !!(appState.libraryOpen || appState.openSidebar?.name === "library" || appState.openSidebar === "library");
        setIsLibraryOpen(prev => {
            if (isLibOpen !== prev) return isLibOpen;
            return prev;
        });

        if (saveStatusRef.current !== 'unsaved') {
            setSaveStatus('unsaved');
        }

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
    }, [id, handleSave]);
    // Removed isLibraryOpen and saveStatus from deps to maximize canvas stability.
    // handleSave is stable due to its own useCallback.

    const setTool = (tool: string) => {
        if (!excalidrawAPI) return;
        setActiveTool(tool);
        excalidrawAPI.setActiveTool({ type: tool });
        setIsMoreMenuOpen(false);
    };

    const toggleLock = () => {
        if (!excalidrawAPI) return;
        const newLockedState = !isLocked;
        setIsLocked(newLockedState);
        excalidrawAPI.setActiveTool({ locked: newLockedState });
    };

    // Custom UI Handlers
    const handleUndo = useCallback(() => {
        if (excalidrawAPI) {
            // Triggering native undo via DOM is most reliable
            const undoBtn = document.querySelector('[aria-label="Undo"]') as HTMLButtonElement;
            if (undoBtn) undoBtn.click();
        }
    }, [excalidrawAPI]);

    const handleRedo = useCallback(() => {
        if (excalidrawAPI) {
            const redoBtn = document.querySelector('[aria-label="Redo"]') as HTMLButtonElement;
            if (redoBtn) redoBtn.click();
        }
    }, [excalidrawAPI]);

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

    // Close "More" menu when clicking outside
    useEffect(() => {
        if (!isMoreMenuOpen) return;
        const handleClick = () => setIsMoreMenuOpen(false);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [isMoreMenuOpen]);

    const toggleLibrary = useCallback(() => {
        const api = excalidrawRef.current;
        if (!api) return;

        const appState = api.getAppState();
        const isCurrentlyOpen = !!(
            appState.openSidebar?.name === "library" ||
            appState.openSidebar === "library" ||
            appState.libraryOpen
        );

        const newState = !isCurrentlyOpen;

        if (typeof api.toggleSidebar === 'function') {
            api.toggleSidebar({ name: "library", force: newState });
        } else {
            api.updateScene({
                appState: {
                    openSidebar: newState ? { name: "library" } : null,
                    libraryOpen: newState
                }
            });
        }
        setIsLibraryOpen(newState);
    }, []);

    const openMenu = useCallback(() => {
        const api = excalidrawRef.current;
        if (!api) return;

        // Use standard Excalidraw way to open menu if possible, 
        // otherwise fallback to clicking the hidden button
        const menuBtn = document.querySelector('.DropdownMenu-button') as HTMLButtonElement;
        if (menuBtn) {
            menuBtn.click();
        } else {
            // Fallback for newer versions or different internal structures
            api.updateScene({ appState: { openMenu: 'canvas' } });
        }
    }, []);

    const openHelp = () => {
        setIsHelpOpen(true);
    };

    const onPointerUpdate = useCallback((activeTool: any, pointerData: any) => {
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
    }, [id]);

    const onBack = useCallback(() => {
        window.location.href = '/whiteboard';
    }, []);

    const handleStartEditing = () => {
        setTempTitle(whiteboard?.title || '');
        setIsEditingTitle(true);
    };

    const handleSaveTitle = async () => {
        if (!tempTitle.trim() || tempTitle === whiteboard?.title) {
            setIsEditingTitle(false);
            return;
        }

        try {
            await api.whiteboards.update(id, { title: tempTitle });
            setWhiteboard(prev => prev ? { ...prev, title: tempTitle } : null);
            setIsEditingTitle(false);
        } catch (error) {
            console.error('Failed to update title:', error);
            alert('Không thể đổi tên bảng. Vui lòng thử lại.');
        }
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSaveTitle();
        if (e.key === 'Escape') setIsEditingTitle(false);
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
                
                /* CRITICAL: Alias both 'Virgil' and 'Excalifont' for 100% Vietnamese support */
                @font-face {
                    font-family: "Virgil";
                    src: url('/fonts/DFVN-Excalifont.otf') format('opentype');
                    font-weight: 400;
                    font-style: normal;
                    font-display: swap;
                }
                @font-face {
                    font-family: "Excalifont";
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
                    --index-overlay: 2000 !important;
                }

                /* HIDE ALL NATIVE UI CLUSTERS */
                .whiteboard-container .excalidraw .layer-ui__wrapper__top-left,
                .whiteboard-container .excalidraw .layer-ui__wrapper__top-right,
                .whiteboard-container .excalidraw .layer-ui__wrapper__footer-left,
                .whiteboard-container .excalidraw .layer-ui__wrapper__footer-right,
                .whiteboard-container .excalidraw .layer-ui__wrapper__footer-center,
                .whiteboard-container .excalidraw .App-toolbar,
                .whiteboard-container .excalidraw .DropdownMenu-button {
                    display: none !important;
                }

                /* ENSURE PROPERTIES PANEL IS FULL COLOR */
                .whiteboard-container .excalidraw .sidebar,
                .whiteboard-container .excalidraw .island,
                .whiteboard-container .excalidraw .users-list-wrapper,
                .whiteboard-container .excalidraw .context-menu {
                    filter: none !important;
                    box-shadow: none !important;
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
                    padding: 4px !important;
                    z-index: 3000 !important;
                }
                
                /* EXCEPTION: Trigger hidden elements for API support */
                .whiteboard-container .excalidraw [aria-label="Undo"],
                .whiteboard-container .excalidraw [aria-label="Redo"] {
                    position: fixed !important;
                    top: -100px !important;
                    left: -100px !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    display: block !important;
                    z-index: -1 !important;
                }

                /* WELCOME SCREEN HINT REPOSITION */
                .whiteboard-container .excalidraw .welcome-screen-center {
                    transform: translateY(-20px) !important;
                }
                
                .whiteboard-container .excalidraw .welcome-screen-hints {
                    bottom: 100px !important;
                    display: flex !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    z-index: 50 !important;
                    pointer-events: none !important;
                }

                .whiteboard-container .excalidraw .welcome-screen-hints--menu-hint,
                .whiteboard-container .excalidraw .welcome-screen-hints--help-hint,
                .whiteboard-container .excalidraw .welcome-screen-hints--toolbar-hint {
                    display: flex !important;
                }

                /* HIDE NATIVE MENU ELEMENTS AGGRESSIVELY */
                .whiteboard-container .excalidraw .main-menu-trigger,
                .whiteboard-container .excalidraw .App-menu,
                .whiteboard-container .excalidraw button[aria-label="Main menu"],
                .whiteboard-container .excalidraw .layer-ui__wrapper .main-menu-trigger {
                    display: none !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    visibility: hidden !important;
                }

                /* Help Dialog & Modals Theme Override */
                .whiteboard-container .excalidraw .HelpDialog,
                .whiteboard-container .excalidraw .Dialog,
                .whiteboard-container .excalidraw .Modal,
                .whiteboard-container .excalidraw .Island,
                .whiteboard-container .excalidraw .ToolIcon {
                    --color-primary: #18181b !important;
                    --color-primary-dark: #000000 !important;
                    --color-brand: #18181b !important;
                    box-shadow: none !important;
                }

                /* Deep override for purple elements in HelpDialog */
                .whiteboard-container .excalidraw .HelpDialog__header,
                .whiteboard-container .excalidraw .Dialog__header {
                    background: #f4f4f5 !important;
                    border-bottom: 1px solid #e4e4e7 !important;
                    color: #18181b !important;
                }

                .whiteboard-container .excalidraw .HelpDialog__key,
                .whiteboard-container .excalidraw .Dialog__key,
                .whiteboard-container .excalidraw .kbd,
                .whiteboard-container .excalidraw kbd,
                .whiteboard-container .excalidraw .Shortcut__key {
                    background: #18181b !important;
                    color: white !important;
                    border: none !important;
                    box-shadow: none !important;
                    font-weight: 700 !important;
                }

                .whiteboard-container .excalidraw .Dialog__content,
                .whiteboard-container .excalidraw .Modal__content {
                    background: white !important;
                }

                /* Remove all shadows from all islands and modals */
                .whiteboard-container .excalidraw .island,
                .whiteboard-container .excalidraw .sidebar,
                .whiteboard-container .excalidraw .context-menu,
                .whiteboard-container .excalidraw .Dialog__window,
                .whiteboard-container .excalidraw .Modal__window {
                    box-shadow: none !important;
                    border: 1px solid #e4e4e7 !important;
                }

                /* Ensure text tool click works */
                .whiteboard-container .excalidraw .excalidraw-text-input {
                    z-index: 4000 !important;
                }

                /* Shortcut styling for custom help modal */
                .shortcut-key {
                    background: #18181b;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 700;
                    min-width: 24px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>

                <ExcalidrawWrapper
                    excalidrawAPI={setExcalidrawAPI}
                    onChange={onChange}
                    onPointerUpdate={onPointerUpdate}
                    onBack={onBack}
                    title={whiteboard?.title}
                />

                {/* --- CUSTOM UI --- */}

                {/* 1. TOP LEFT: Branding & Menu */}
                <div className="absolute top-4 left-4 z-[1000] pointer-events-auto flex items-center gap-3 bg-white/95 backdrop-blur-md p-1.5 pr-6 rounded-2xl border border-zinc-200 transition-all h-[52px] shadow-sm hover:shadow-md">
                    <button
                        onClick={openMenu}
                        className="p-2.5 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-700 active:scale-95"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-zinc-200" />
                    <Logo showText={false} height="h-8" className="flex-shrink-0 ml-1" />
                    <div className="flex flex-col justify-center select-none ml-2">
                        <span className="text-[10px] font-bold text-zinc-400 leading-none mb-0.5 tracking-tight">Tulie</span>
                        <span className="text-sm font-bold text-zinc-900 leading-none whitespace-nowrap">Whiteboard</span>
                    </div>
                </div>

                {/* 2. TOP CENTER: Toolbar + Undo/Redo */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto">
                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-200 h-[48px]">

                        <button
                            onClick={toggleLock}
                            className={`p-2 rounded-xl transition-all duration-200 ${isLocked ? 'bg-amber-100 text-amber-600' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                            title="Keep tool active"
                        >
                            <Lock className="w-3.5 h-3.5" />
                        </button>

                        <div className="w-px h-5 bg-zinc-200 mx-0.5" />

                        <button onClick={handleUndo} className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 transition-all" title="Undo (Ctrl+Z)">
                            <Undo2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={handleRedo} className="p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 transition-all" title="Redo (Ctrl+Shift+Z)">
                            <Redo2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="w-px h-5 bg-zinc-200 mx-0.5" />

                        {TOOLS.map((tool) => (
                            <button
                                key={tool.value}
                                onClick={() => setTool(tool.value)}
                                className={`relative p-2 rounded-xl transition-all duration-200 ${activeTool === tool.value ? 'bg-zinc-900 text-white shadow-none' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                                title={tool.label}
                            >
                                <tool.icon className="w-3.5 h-3.5" />
                                <span className={`absolute -bottom-1 -right-1 text-[7px] font-bold px-1 rounded-full ${activeTool === tool.value ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-400 opacity-60'}`}>
                                    {tool.shortcut}
                                </span>
                            </button>
                        ))}

                        <div className="w-px h-5 bg-zinc-200 mx-0.5" />

                        <div className="relative pointer-events-auto">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsMoreMenuOpen(!isMoreMenuOpen); }}
                                className={`p-2 rounded-xl transition-all duration-200 ${isMoreMenuOpen ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`}
                                title="Mở rộng công cụ"
                            >
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isMoreMenuOpen && (
                                <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl border border-zinc-200 shadow-none p-2 min-w-[200px] animate-in fade-in zoom-in duration-200 flex flex-col gap-1">
                                    {EXTRA_TOOLS.map((tool) => (
                                        <button
                                            key={tool.value}
                                            onClick={() => setTool(tool.value)}
                                            className={`flex items-center gap-3 w-full p-2 rounded-xl transition-colors ${activeTool === tool.value ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
                                        >
                                            <tool.icon className="w-3.5 h-3.5" />
                                            <span className="text-[13px] font-bold flex-1 text-left">{tool.label}</span>
                                            {tool.shortcut && <span className="text-[10px] opacity-40">{tool.shortcut}</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. TOP RIGHT: Library & Share */}
                <div className="absolute top-4 right-4 z-[1000] pointer-events-auto flex items-center gap-2 h-[48px]">
                    <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md pl-5 pr-1.5 py-1 rounded-xl border border-zinc-200 h-full group">
                        {isEditingTitle ? (
                            <input
                                autoFocus
                                type="text"
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                onBlur={handleSaveTitle}
                                onKeyDown={handleTitleKeyDown}
                                className="text-sm font-bold bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 outline-none w-[150px] text-zinc-900"
                            />
                        ) : (
                            <div className="flex items-center gap-2 cursor-pointer" onClick={handleStartEditing}>
                                <span className="text-sm font-bold max-w-[150px] truncate text-zinc-900" title="Nhấn để đổi tên">
                                    {whiteboard?.title || 'Bảng chưa đặt tên'}
                                </span>
                                <Pencil className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                        <Button
                            variant="default" size="sm" className="rounded-lg bg-zinc-900 text-white h-[36px] px-4 text-[11px] font-bold shadow-none"
                            onClick={() => setIsShareModalOpen(true)}
                        >
                            <Share2 className="w-3.5 h-3.5 mr-2" />
                            Chia sẻ
                        </Button>
                    </div>
                    <button
                        onClick={toggleLibrary}
                        className={`p-2.5 rounded-xl border transition-all h-[48px] w-[48px] flex items-center justify-center ${isLibraryOpen ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white/90 backdrop-blur-md text-zinc-600 border-zinc-200 shadow-none hover:bg-zinc-50'}`}
                        title="Thư viện"
                    >
                        <LibraryIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* 4. BOTTOM LEFT: Zoom Controls */}
                <div className="absolute bottom-6 left-6 z-[1000] pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-zinc-200 h-[48px]">
                    <button onClick={handleZoomOut} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500">
                        <Minus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleResetZoom}
                        className="px-4 py-1.5 hover:bg-zinc-100 rounded-xl text-sm font-medium text-zinc-900 min-w-[64px] transition-all bg-zinc-50/50"
                    >
                        {Math.round(zoom * 100)}%
                    </button>
                    <button onClick={handleZoomIn} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* 5. BOTTOM RIGHT: Status & Help */}
                <div className="absolute bottom-6 right-6 z-[1000] pointer-events-auto flex items-center gap-3 h-[48px]">
                    <div className="px-4 py-2 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-xl text-[12px] font-bold text-zinc-900 flex items-center gap-2.5 h-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="tracking-tight">{Object.keys(remoteCursors).length + 1} kết nối</span>
                    </div>
                    <button
                        onClick={openHelp}
                        className="h-[48px] w-[48px] bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl flex items-center justify-center transition-all active:scale-95"
                        title="Trợ giúp"
                    >
                        <HelpCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* Share Modal */}
                {isShareModalOpen && (
                    <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-[4px] pointer-events-auto p-4">
                        <div className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-md border border-zinc-100 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-medium text-zinc-900 tracking-tight">Chia sẻ bảng</h2>
                                <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-zinc-300" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-medium text-zinc-500 mb-2 tracking-wider pl-1">Liên kết công khai</label>
                                    <div className="flex gap-2">
                                        <input type="text" readOnly value={typeof window !== 'undefined' ? window.location.href : ''} className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-sm text-zinc-600 outline-none font-medium" />
                                        <Button variant="outline" className="rounded-xl h-[48px] px-4 border-zinc-200 hover:bg-zinc-50" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Đã sao chép!'); }}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button className="w-full rounded-xl h-[56px] text-base font-medium bg-zinc-900 hover:bg-zinc-800 shadow-xl transition-all active:scale-[0.98]" onClick={() => setIsShareModalOpen(false)}>Hoàn tất</Button>
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
                            <div className="ml-4 mt-2 px-3 py-1.5 bg-zinc-900 text-white text-[11px] rounded-full whitespace-nowrap font-bold shadow-2xl">
                                {cursor.userName || 'Bạn học'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- CUSTOM HELP MODAL --- */}
                {isHelpOpen && (
                    <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-[4px] pointer-events-auto p-4">
                        <div className="bg-white rounded-[32px] shadow-2xl p-8 w-full max-w-2xl border border-zinc-100 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Trợ giúp</h2>
                                <button onClick={() => setIsHelpOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-zinc-300" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-12">
                                {/* Tools Section */}
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-400 mb-6 tracking-wider">Công cụ</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Bàn tay (kéo trang)</span>
                                            <span className="shortcut-key">H</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Chọn đối tượng</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">V</span>
                                                <span className="text-zinc-300">hoặc</span>
                                                <span className="shortcut-key">1</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Hình chữ nhật</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">R</span>
                                                <span className="text-zinc-300">hoặc</span>
                                                <span className="shortcut-key">2</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Hình thoi</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">D</span>
                                                <span className="text-zinc-300">hoặc</span>
                                                <span className="shortcut-key">3</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Hình ellipse</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">O</span>
                                                <span className="text-zinc-300">hoặc</span>
                                                <span className="shortcut-key">4</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Mũi tên</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">A</span>
                                                <span className="text-zinc-300">hoặc</span>
                                                <span className="shortcut-key">5</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Đường thẳng</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">L</span>
                                                <span className="text-zinc-300">hoặc</span>
                                                <span className="shortcut-key">6</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Vẽ tự do</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">P</span>
                                                <span className="text-zinc-300">hoặc</span>
                                                <span className="shortcut-key">7</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Văn bản</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">T</span>
                                                <span className="text-zinc-300">hoặc</span>
                                                <span className="shortcut-key">8</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Tẩy</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">E</span>
                                                <span className="text-zinc-300">hoặc</span>
                                                <span className="shortcut-key">0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Editor Section */}
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-400 mb-6 tracking-wider">Trình chỉnh sửa</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Xoá đối tượng</span>
                                            <span className="shortcut-key">Delete</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Chọn tất cả</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">Cmd</span>
                                                <span className="shortcut-key">A</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Hoàn tác (Undo)</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">Cmd</span>
                                                <span className="shortcut-key">Z</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Làm lại (Redo)</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">Cmd</span>
                                                <span className="shortcut-key">Shift</span>
                                                <span className="shortcut-key">Z</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Sao chép</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">Cmd</span>
                                                <span className="shortcut-key">C</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Dán</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">Cmd</span>
                                                <span className="shortcut-key">V</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Góc nhìn mặc định</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key">Shift</span>
                                                <span className="shortcut-key">1</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[13px] font-bold text-zinc-700">
                                            <span>Thu nhỏ / Phóng to</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="shortcut-key font-black">-</span>
                                                <span className="text-zinc-300">/</span>
                                                <span className="shortcut-key font-black">+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-center">
                                <Button
                                    className="rounded-2xl h-[56px] px-10 text-base font-bold bg-zinc-900 hover:bg-zinc-800 shadow-xl transition-all active:scale-[0.98]"
                                    onClick={() => setIsHelpOpen(false)}
                                >
                                    Đã hiểu
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Portal>
    );
}
