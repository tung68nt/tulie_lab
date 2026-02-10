'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { exportToBlob } from '@excalidraw/excalidraw';

import ExcalidrawWrapper from './ExcalidrawWrapper';
import { api } from '@/lib/api';
import { SaveStatus } from './SaveStatusIndicator';
import WhiteboardHeader from './WhiteboardHeader';
import WelcomeScreen from './WelcomeScreen';
import { WhiteboardElement, WhiteboardAppState, WhiteboardData } from '@/features/whiteboard/types';

// Excalidraw API type is not easily exported, using any to match ExcalidrawWrapper
type ExcalidrawImperativeAPI = any;

interface WhiteboardEditorProps {
    id: string;
}

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    const router = useRouter();
    const [whiteboard, setWhiteboard] = useState<any>(null); // Keep any for full whiteboard object for now as it comes from API
    const [activeArtboardIndex, setActiveArtboardIndex] = useState(0);
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
    const [excalidrawReady, setExcalidrawReady] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Optimized UI State
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const [showWelcome, setShowWelcome] = useState(false);
    const [isSidebarDocked, setIsSidebarDocked] = useState(false);
    const [gridEnabled, setGridEnabled] = useState(true); // Default true
    const [parsedInitialData, setParsedInitialData] = useState<WhiteboardData | undefined>(undefined);

    // Refs for performance (avoid state updates during drawing)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastEmitTimeRef = useRef<number>(0);
    const lastPointerUpdateRef = useRef<number>(0);
    const lastThumbnailTimeRef = useRef<number>(0); // Throttle thumbnail generation
    const socketRef = useRef<Socket | null>(null);
    const creatingRef = useRef(false);
    const whiteboardRef = useRef<any>(null);
    const currentElementsRef = useRef<readonly WhiteboardElement[]>([]);

    // Keep ref in sync
    useEffect(() => {
        whiteboardRef.current = whiteboard;
    }, [whiteboard]);

    // Initial Load Data
    useEffect(() => {
        console.log('WhiteboardEditor mounted with ID:', id);

        const loadWhiteboard = async () => {
            if (id === 'new') {
                if (creatingRef.current) return;
                creatingRef.current = true;

                console.log('Attempting to create new whiteboard...');
                try {
                    const newWhiteboard = await api.whiteboards.create({ title: 'Untitled Whiteboard' });
                    setWhiteboard(newWhiteboard);
                    router.replace(`/whiteboard/${newWhiteboard.id}`);
                    return;
                } catch (error) {
                    console.error('Failed to create new whiteboard:', error);
                    creatingRef.current = false;
                }
            } else {
                console.log('Loading existing whiteboard:', id);
            }

            try {
                const data = await api.whiteboards.get(id);
                setWhiteboard(data);

                // Parse initial data for Excalidraw from active artboard
                const currentArtboard = data.artboards?.[activeArtboardIndex] || data.artboards?.[0];
                const rawElements = currentArtboard?.elements;

                if (rawElements) {
                    try {
                        // Strict parsing logic - expecting correct structure
                        const parsed = typeof rawElements === 'string'
                            ? JSON.parse(rawElements)
                            : rawElements;

                        let elements: WhiteboardElement[] = [];
                        let appState: Partial<WhiteboardAppState> = {};

                        if (parsed && parsed.elements && Array.isArray(parsed.elements)) {
                            // Standard format
                            elements = parsed.elements;
                            appState = parsed.appState || {};
                        } else if (Array.isArray(parsed)) {
                            // Deprecated: Legacy array support (to be removed in v2)
                            // We keep it strictly as fallback but log warning
                            console.warn('Legacy whiteboard data format detected');
                            elements = parsed;
                        }

                        if (elements.length > 0) {
                            setParsedInitialData({
                                elements,
                                appState: {
                                    ...appState as WhiteboardAppState,
                                    gridModeEnabled: true,
                                    theme: 'light' // Default to light theme for consistency
                                }
                            });
                            currentElementsRef.current = elements;
                            setShowWelcome(false); // Explicitly hide if we have elements
                        } else {
                            setParsedInitialData({
                                elements: [],
                                appState: { gridModeEnabled: true, theme: 'light' } as WhiteboardAppState
                            });
                            setShowWelcome(true); // Explicitly show if empty
                        }
                    } catch (e) {
                        console.error('Failed to parse elements:', e);
                        setShowWelcome(true);
                    }
                } else {
                    setParsedInitialData({
                        elements: [],
                        appState: { gridModeEnabled: true } as WhiteboardAppState
                    });
                    setShowWelcome(true);
                }
            } catch (error) {
                console.error('Failed to load whiteboard:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        if (id) {
            loadWhiteboard();
        }
    }, [id, router]);

    // Socket Connection
    useEffect(() => {
        if (!id || id === 'new') return;

        // Initialize socket
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
            query: { whiteboardId: id },
            transports: ['websocket'],
            reconnection: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('draw_synced', (data: { elements: WhiteboardElement[] }) => {
            if (excalidrawAPI && data.elements) {
                excalidrawAPI.updateScene({
                    elements: data.elements,
                    commitToHistory: false
                });
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [id, excalidrawAPI]);

    // Handle active artboard switching
    useEffect(() => {
        if (!excalidrawAPI || !whiteboard?.artboards?.[activeArtboardIndex]) return;

        const rawElements = whiteboard.artboards[activeArtboardIndex].elements;

        if (!rawElements) {
            // Reset canvas if empty
            excalidrawAPI.updateScene({ elements: [], appState: { gridModeEnabled: true } });
            return;
        }

        try {
            const elementsData = typeof rawElements === 'string'
                ? JSON.parse(rawElements)
                : rawElements;

            let finalElements: WhiteboardElement[] = [];
            let finalAppState: Partial<WhiteboardAppState> = {};

            if (elementsData && elementsData.elements) {
                finalElements = elementsData.elements;
                finalAppState = elementsData.appState || {};
            } else if (Array.isArray(elementsData)) {
                finalElements = elementsData;
            }

            excalidrawAPI.updateScene({
                elements: finalElements,
                appState: {
                    ...finalAppState,
                    gridModeEnabled: finalAppState.gridModeEnabled !== undefined ? finalAppState.gridModeEnabled : true,
                    viewBackgroundColor: finalAppState.viewBackgroundColor || '#f9f9f9'
                }
            });
            currentElementsRef.current = finalElements;

        } catch (e) {
            console.error('Failed to parse whiteboard elements on switch:', e);
        }

    }, [excalidrawAPI, whiteboard, activeArtboardIndex]);

    // Style HintViewer text with kbd tags (Layout fixes only)
    useEffect(() => {
        const styleHintViewer = () => {
            const hintViewer = document.querySelector('.HintViewer span');
            if (!hintViewer || hintViewer.querySelector('kbd')) return;

            const text = hintViewer.textContent || '';
            const keyRegex = /\b(Scroll wheel|Space|Option|Cmd|Ctrl|Alt|Shift|Enter|Delete|Backspace|Esc|Tab|Return|PgUp|PgDn|End|Home|Ins|Del|Arrow [A-Za-z]+|[A-Z0-9])\b/g;

            let styledText = text
                .replace(/mouse wheel/gi, 'Scroll wheel')
                .replace(/spacebar/gi, 'Space');

            styledText = styledText.replace(keyRegex, (match) => `<kbd class="excalidraw-kbd">${match}</kbd>`);

            if (styledText !== text) {
                hintViewer.innerHTML = styledText;
            }

            const hintViewerEl = document.querySelector('.excalidraw .HintViewer');
            if (hintViewerEl) {
                // WhiteboardHeader is at bottom-2 (8px) and has ~50px height = 58px.
                // We place HintViewer at 70px to be safely above it.
                (hintViewerEl as HTMLElement).style.marginBottom = '70px';
            }
        };

        const observer = new MutationObserver(() => {
            styleHintViewer();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        styleHintViewer();

        return () => observer.disconnect();
    }, []);

    // --- OPTIMIZED HANDLERS ---

    const handleStartDrawing = useCallback(() => {
        setShowWelcome(false);
    }, []);

    const onChange = useCallback((elements: readonly any[], appState: any) => {
        // Cast to our Types
        const typedElements = elements as WhiteboardElement[];
        const typedAppState = appState as WhiteboardAppState;

        // Fast path: Update ref immediately
        currentElementsRef.current = typedElements;

        // Sync grid state for UI toggle
        if (typedAppState.gridModeEnabled !== gridEnabled) {
            setGridEnabled(!!typedAppState.gridModeEnabled);
        }

        // Debounce Network Operations (Save & Sync)
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Hide welcome screen if elements exist
        if (typedElements.length > 0) {
            setShowWelcome((prev) => {
                if (prev) return false;
                return prev;
            });
        }

        saveTimeoutRef.current = setTimeout(async () => {
            // THROTTLED SOCKET EMISSION: 500ms
            const now = Date.now();
            if (now - lastEmitTimeRef.current > 500) {
                lastEmitTimeRef.current = now;
                if (socketRef.current?.connected) {
                    socketRef.current.emit('draw_change', {
                        whiteboardId: id,
                        changes: {
                            elements: typedElements,
                            appState: {
                                viewBackgroundColor: typedAppState.viewBackgroundColor
                            }
                        }
                    });
                }
            }


            // Update Sidebar State
            if (typedAppState.isSidebarDocked !== isSidebarDocked) {
                setIsSidebarDocked(!!typedAppState.isSidebarDocked);
            }

            // AUTO-SAVE to API
            const currentWhiteboard = whiteboardRef.current;
            const currentArtboard = currentWhiteboard?.artboards?.[activeArtboardIndex];
            if (currentArtboard?.id) {
                // Guard: Don't save if empty (prevents overwriting with blank state on load)
                if (!typedElements || typedElements.length === 0) {
                    return;
                }

                setSaveStatus('saving');

                const snapshot = {
                    elements: typedElements,
                    appState: {
                        viewBackgroundColor: typedAppState.viewBackgroundColor,
                        gridModeEnabled: typedAppState.gridModeEnabled,
                        currentItemFontFamily: typedAppState.currentItemFontFamily,
                        currentItemFontSize: typedAppState.currentItemFontSize,
                    }
                };

                try {
                    // Generate Thumbnail - THROTTLED to 30 seconds
                    const thumbnailNow = Date.now();
                    if (excalidrawAPI && (thumbnailNow - lastThumbnailTimeRef.current > 30000)) {
                        lastThumbnailTimeRef.current = thumbnailNow;
                        try {
                            const blob = await exportToBlob({
                                elements: typedElements,
                                mimeType: 'image/jpeg',
                                appState: {
                                    ...typedAppState,
                                    viewBackgroundColor: typedAppState.viewBackgroundColor || '#ffffff',
                                },
                                files: excalidrawAPI.getFiles(),
                                quality: 0.5,
                            });

                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = async () => {
                                const base64data = reader.result;
                                await api.whiteboards.update(currentWhiteboard.id, { thumbnail: base64data as string });
                            }
                        } catch (thumbErr) {
                            console.warn('Thumbnail generation failed (non-critical):', thumbErr);
                        }
                    }

                    await api.whiteboards.saveArtboard(currentArtboard.id, snapshot);
                    setSaveStatus('saved');
                } catch (err: any) {
                    console.error('Auto-save failed:', err);
                    // Provide more detailed error logging if available
                    if (err.message) console.error('Error message:', err.message);
                    if (err.response) console.error('API Response:', err.response);

                    setSaveStatus('error');
                }
            }

        }, 500);
    }, [id, excalidrawAPI, activeArtboardIndex, gridEnabled, isSidebarDocked]);

    // Throttle: 200ms
    const onPointerUpdate = useCallback((activeTool: any, pointerData: any) => {
        const now = Date.now();
        if (now - lastPointerUpdateRef.current > 200) {
            lastPointerUpdateRef.current = now;
            if (socketRef.current?.connected) {
                socketRef.current.emit('cursor_move', {
                    whiteboardId: id,
                    point: { x: pointerData.x, y: pointerData.y },
                    userName: 'User'
                });
            }
        }
    }, [id]);

    const handleRename = async (newTitle: string) => {
        if (!whiteboard || !newTitle.trim()) return;

        // Optimistic update
        setWhiteboard((prev: any) => ({ ...prev, title: newTitle }));

        try {
            await api.whiteboards.update(id, { title: newTitle });
        } catch (error) {
            console.error('Failed to rename whiteboard:', error);
        }
    };

    const handleToggleGrid = () => {
        if (!excalidrawAPI) return;
        const current = excalidrawAPI.getAppState().gridModeEnabled;
        excalidrawAPI.updateScene({
            appState: { gridModeEnabled: !current }
        });
        setGridEnabled(!current);
    };

    const handleStatusChange = async (status: string) => {
        if (!whiteboard) return;
        try {
            setSaveStatus('saving');
            await api.whiteboards.update(id, { status });
            setWhiteboard((prev: any) => ({ ...prev, status }));
            setSaveStatus('saved');
        } catch (error) {
            console.error('Failed to update status:', error);
            setSaveStatus('error');
        }
    };

    const handleAddArtboard = async () => {
        if (!whiteboard) return;
        try {
            const newArtboard = await api.whiteboards.addArtboard(whiteboard.id);
            setWhiteboard((prev: any) => ({
                ...prev,
                artboards: [...(prev.artboards || []), newArtboard]
            }));
            // Set index to the new last element (current length is the index of the next item)
            setActiveArtboardIndex((whiteboard.artboards?.length || 0));
        } catch (error) {
            console.error('Failed to add artboard:', error);
        }
    };

    const handleSwitchArtboard = (index: number) => {
        setActiveArtboardIndex(index);
    };

    const handleExcalidrawAPI = useCallback((api: ExcalidrawImperativeAPI) => {
        setExcalidrawAPI(api);
        setExcalidrawReady(true);
    }, []);

    const isLoading = !isLoaded || (id !== 'new' && !excalidrawReady);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <WhiteboardHeader
                    title={whiteboard?.title}
                    status={whiteboard?.status || 'DRAFT'} // Pass status
                    onStatusChange={handleStatusChange}    // Pass handler
                    saveStatus={saveStatus}
                    onBack={() => router.push('/whiteboard')}
                    onRename={handleRename}
                    isSidebarDocked={isSidebarDocked}
                    gridEnabled={gridEnabled}
                    onToggleGrid={() => setGridEnabled(!gridEnabled)}
                    artboards={whiteboard?.artboards || []}
                    activeIndex={activeArtboardIndex}
                    onAddArtboard={handleAddArtboard}
                    onSwitchArtboard={handleSwitchArtboard}
                />
            </div>

            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-950">
                    <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-50" />
                </div>
            )}

            {(isLoaded || id === 'new') && (
                <div className={`w-full h-full transition-opacity duration-500 ${excalidrawReady ? 'opacity-100' : 'opacity-0'}`}>
                    <ExcalidrawWrapper
                        excalidrawAPI={handleExcalidrawAPI}
                        onChange={onChange}
                        onPointerUpdate={onPointerUpdate}
                        onBack={() => router.back()}
                        title={whiteboard?.title}
                        initialData={parsedInitialData}
                    />
                </div>
            )}

            {showWelcome && (
                <WelcomeScreen onStart={handleStartDrawing} />
            )}
        </div>
    );
}
