/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { exportToBlob } from '@excalidraw/excalidraw';

import ExcalidrawWrapper from './ExcalidrawWrapper';
import { api } from '@/lib/api';
// import SaveStatusIndicator, { SaveStatus } from './SaveStatusIndicator'; // Kept for type import if needed
import { SaveStatus } from './SaveStatusIndicator';
import WhiteboardHeader from './WhiteboardHeader';

interface WhiteboardEditorProps {
    id: string;
}

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    const router = useRouter();
    const [whiteboard, setWhiteboard] = useState<any>(null);
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Optimized UI State
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const [showWelcome, setShowWelcome] = useState(false);
    const [isSidebarDocked, setIsSidebarDocked] = useState(false);
    const [gridEnabled, setGridEnabled] = useState(true); // Default true
    const [parsedInitialData, setParsedInitialData] = useState<{ elements?: any[]; appState?: any } | undefined>(undefined);

    // Refs for performance (avoid state updates during drawing)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastEmitTimeRef = useRef<number>(0);
    const lastPointerUpdateRef = useRef<number>(0);
    const socketRef = useRef<any>(null);
    const creatingRef = useRef(false);
    const whiteboardRef = useRef<any>(null);
    const currentElementsRef = useRef<readonly any[]>([]);

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

                // Parse initial data for Excalidraw
                const rawElements = data.artboards?.[0]?.elements;
                console.log('=== PARSING INITIAL DATA ===');
                console.log('Raw elements:', rawElements);

                if (rawElements) {
                    try {
                        const parsed = typeof rawElements === 'string'
                            ? JSON.parse(rawElements)
                            : rawElements;

                        console.log('Parsed data:', parsed);

                        let elements: any[] = [];
                        let appState = {};

                        if (Array.isArray(parsed)) {
                            // Legacy format: just array of elements
                            elements = parsed;
                        } else if (parsed && parsed.elements) {
                            // Correct format: { elements, appState }
                            elements = parsed.elements;
                            appState = parsed.appState || {};
                        }

                        console.log('Final elements count:', elements.length);

                        if (elements.length > 0) {
                            setParsedInitialData({ elements, appState: { ...appState, gridModeEnabled: true } });
                            currentElementsRef.current = elements;
                        } else {
                            setParsedInitialData({ elements: [], appState: { gridModeEnabled: true } });
                            setShowWelcome(true);
                        }
                    } catch (e) {
                        console.error('Failed to parse elements:', e);
                        setShowWelcome(true);
                    }
                } else {
                    setParsedInitialData({ elements: [], appState: { gridModeEnabled: true } });
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

        socket.on('draw_synced', (data: any) => {
            if (excalidrawAPI && data.elements) {
                // Update scene from remote
                // Check if we have active changes to avoid conflict? Use versioning ideally.
                // For now, straightforward update
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

    // Handle initial data for Excalidraw
    useEffect(() => {
        if (!excalidrawAPI || !whiteboard?.artboards?.[0]) return;

        const rawElements = whiteboard.artboards[0].elements;
        console.log('=== DEBUG: Data Loading ===');
        console.log('1. Raw elements from API:', rawElements);
        console.log('2. Type of rawElements:', typeof rawElements);

        if (!rawElements) {
            console.log('3. No elements found, skipping load');
            return;
        }

        console.log('Loading data into Excalidraw', whiteboard.title);

        try {
            const elementsData = typeof rawElements === 'string'
                ? JSON.parse(rawElements)
                : rawElements;

            console.log('4. Parsed elementsData:', elementsData);
            console.log('5. elementsData type:', typeof elementsData);
            console.log('6. Is array?:', Array.isArray(elementsData));

            let finalElements: any[] = [];
            let finalAppState: any = {};

            if (Array.isArray(elementsData)) {
                // Recovery: Handle data saved during bug period (just array of elements)
                console.warn('7. Recovering legacy array data format');
                finalElements = elementsData;
            } else if (elementsData && elementsData.elements) {
                // Correct format: { elements: [...], appState: {...} }
                console.log('7. Using correct format with elements key');
                finalElements = elementsData.elements;
                finalAppState = elementsData.appState || {};
            } else if (elementsData && typeof elementsData === 'object') {
                // Maybe double-stringified?
                console.warn('7. Unknown format, trying to extract elements:', Object.keys(elementsData));
            }

            console.log('8. Final elements count:', finalElements?.length);
            console.log('9. Sample element:', finalElements?.[0]);

            if (finalElements && finalElements.length > 0) {
                console.log('10. Calling updateScene with', finalElements.length, 'elements');
                excalidrawAPI.updateScene({
                    elements: finalElements,
                    appState: {
                        ...finalAppState,
                        gridModeEnabled: finalAppState.gridModeEnabled !== undefined ? finalAppState.gridModeEnabled : true,
                        viewBackgroundColor: finalAppState.viewBackgroundColor || '#f9f9f9'
                    }
                });
                currentElementsRef.current = finalElements;
                console.log('11. updateScene called successfully');
            } else {
                console.warn('10. No elements to load');
                // Ensure grid and background are set even if no elements
                excalidrawAPI.updateScene({
                    appState: { ...finalAppState, gridModeEnabled: true, viewBackgroundColor: '#f9f9f9' }
                });
            }
        } catch (e) {
            console.error('Failed to parse whiteboard elements:', e);
            console.error('Raw data was:', rawElements);
        }

    }, [excalidrawAPI, whiteboard]);

    // Style HintViewer text with kbd tags (Layout fixes only)
    useEffect(() => {
        const styleHintViewer = () => {
            const hintViewer = document.querySelector('.HintViewer span');
            if (!hintViewer || hintViewer.querySelector('kbd')) return;

            const text = hintViewer.textContent || '';
            // Regex to match keys: Modifiers, named keys, or single uppercase letters (A-Z) and numbers (0-9)
            // Avoid matching common words unless they are specifically capitalised key names like 'Space'
            const keyRegex = /\b(Scroll wheel|Space|Option|Cmd|Ctrl|Alt|Shift|Enter|Delete|Backspace|Esc|Tab|Return|PgUp|PgDn|End|Home|Ins|Del|Arrow [A-Za-z]+|[A-Z0-9])\b/g;

            let styledText = text
                .replace(/mouse wheel/gi, 'Scroll wheel')
                .replace(/spacebar/gi, 'Space');

            styledText = styledText.replace(keyRegex, (match) => `<kbd class="excalidraw-kbd">${match}</kbd>`);

            if (styledText !== text) {
                hintViewer.innerHTML = styledText;
            }

            // Layout fix: Ensure margin bottom for hint viewer (Reduced from 40px as requested)
            const hintViewerEl = document.querySelector('.excalidraw .HintViewer');
            if (hintViewerEl) {
                (hintViewerEl as HTMLElement).style.marginBottom = '24px';
            }
        };

        // Observer to watch for HintViewer changes
        const observer = new MutationObserver(() => {
            styleHintViewer();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Initial run
        styleHintViewer();

        return () => observer.disconnect();
    }, []);

    // --- OPTIMIZED HANDLERS ---

    const handleStartDrawing = useCallback(() => {
        setShowWelcome(false);
    }, []);

    const onChange = useCallback((elements: readonly any[], appState: any) => {
        // Fast path: Update ref immediately
        currentElementsRef.current = elements;

        // Sync grid state for UI toggle
        if (appState.gridModeEnabled !== gridEnabled) {
            setGridEnabled(appState.gridModeEnabled);
        }

        // Debounce Network Operations (Save & Sync)
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Hide welcome screen if elements exist
        // check ref to avoid dependency
        if (elements.length > 0) {
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
                            elements: elements,
                            appState: {
                                viewBackgroundColor: appState.viewBackgroundColor
                            }
                        }
                    });
                }
            }


            // Update Sidebar State
            if (appState.isSidebarDocked !== isSidebarDocked) {
                setIsSidebarDocked(!!appState.isSidebarDocked);
            }

            // AUTO-SAVE to API
            const currentWhiteboard = whiteboardRef.current;
            if (currentWhiteboard?.artboards?.[0]?.id) {
                // Guard: Don't save if empty (prevents overwriting with blank state on load)
                if (!elements || elements.length === 0) {
                    console.log('Skipping auto-save: No elements to save');
                    return;
                }

                // Check if we have only deleted elements (optional, depends on behavior)
                const hasNonDeleted = elements.some((el: any) => !el.isDeleted);
                if (!hasNonDeleted && elements.length > 0) {
                    // We allow saving "all deleted" if the user actually deleted everything.
                    // But strictly speaking, on initial load, it might be empty.
                }

                setSaveStatus('saving');

                const snapshot = {
                    elements: elements,
                    appState: {
                        viewBackgroundColor: appState.viewBackgroundColor,
                        gridModeEnabled: appState.gridModeEnabled, // Persist grid state
                        currentItemFontFamily: appState.currentItemFontFamily,
                        currentItemFontSize: appState.currentItemFontSize,
                        // Add other necessary appState props
                    }
                };

                try {
                    // Generate Thumbnail
                    const blob = await exportToBlob({
                        elements,
                        mimeType: 'image/jpeg',
                        appState: {
                            ...appState,
                            viewBackgroundColor: appState.viewBackgroundColor || '#ffffff',
                        },
                        files: excalidrawAPI.getFiles(),
                        quality: 0.5, // Low quality for thumbnail
                    });

                    // Convert blob to base64
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = async () => {
                        const base64data = reader.result;
                        await api.whiteboards.update(currentWhiteboard.id, { thumbnail: base64data as string });
                    }

                    await api.whiteboards.saveArtboard(currentWhiteboard.artboards[0].id, snapshot);
                    setSaveStatus('saved');
                } catch (err: any) {
                    console.error('Auto-save failed:', err);
                    setSaveStatus('error');
                }
            }

        }, 500); // Increased debounce to 500ms for better perf
    }, [id, excalidrawAPI, whiteboard]); // Added whiteboard back to fix stale closure bug

    // Throttle: 200ms (Reduced frequency)
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
            // Revert on error (optional, or just show toast)
        }
    };

    const handleStatusChange = async (newStatus: 'PUBLIC' | 'PRIVATE') => {
        if (!whiteboard) return;

        // Optimistic update
        setWhiteboard((prev: any) => ({ ...prev, status: newStatus }));

        try {
            await api.whiteboards.update(id, { status: newStatus });
        } catch (error) {
            console.error('Failed to update whiteboard status:', error);
            // Revert on error
            setWhiteboard((prev: any) => ({ ...prev, status: whiteboard.status }));
        }
    };

    const handleManualSave = async () => {
        const currentArtboard = whiteboard?.artboards?.[0]; // Current implementation only supports 1 artboard in stable version
        const elements = currentElementsRef.current;

        if (!currentArtboard?.id || !elements) return;

        setSaveStatus('saving');
        try {
            const snapshot = {
                elements,
                appState: excalidrawAPI?.getAppState() || {}
            };
            await api.whiteboards.saveArtboard(currentArtboard.id, snapshot);
            setSaveStatus('saved');
        } catch (err) {
            console.error('Manual save failed:', err);
            setSaveStatus('error');
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

    if (!isLoaded && id !== 'new') {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-background">
                {/* Tulie-style Loader: Simple Arc Spinner */}
                <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-50" />
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <WhiteboardHeader
                title={whiteboard?.title}
                saveStatus={saveStatus}
                onBack={() => router.push('/whiteboard')}
                onRename={handleRename}
                onSave={handleManualSave}
                isSidebarDocked={isSidebarDocked}
                gridEnabled={gridEnabled}
                onToggleGrid={handleToggleGrid}
                onUndo={() => excalidrawAPI?.history.undo()}
                onRedo={() => excalidrawAPI?.history.redo()}
                status={whiteboard?.status}
                onStatusChange={handleStatusChange}
            />

            <ExcalidrawWrapper
                excalidrawAPI={setExcalidrawAPI}
                onChange={onChange}
                onPointerUpdate={onPointerUpdate}
                onBack={() => router.back()}
                title={whiteboard?.title}
                initialData={parsedInitialData}
            />

            {/* SaveStatusIndicator removed in favor of Header */}
        </div>
    );
}
