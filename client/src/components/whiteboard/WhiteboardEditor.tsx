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
import WelcomeScreen from './WelcomeScreen';

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

                // Show welcome screen if empty
                if (!data.artboards?.[0]?.elements ||
                    (Array.isArray(JSON.parse(data.artboards[0].elements || '[]').elements) &&
                        JSON.parse(data.artboards[0].elements).elements.length === 0)) {
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
        if (!excalidrawAPI || !whiteboard?.artboards?.[0]?.elements) return;

        console.log('Loading data into Excalidraw', whiteboard.title);

        try {
            const elementsData = typeof whiteboard.artboards[0].elements === 'string'
                ? JSON.parse(whiteboard.artboards[0].elements)
                : whiteboard.artboards[0].elements;

            if (elementsData && elementsData.elements) {
                excalidrawAPI.updateScene({
                    elements: elementsData.elements,
                    appState: elementsData.appState
                });
                currentElementsRef.current = elementsData.elements;
            }
        } catch (e) {
            console.error(e);
        }

    }, [excalidrawAPI, whiteboard]);

    // --- OPTIMIZED HANDLERS ---

    const handleStartDrawing = useCallback(() => {
        setShowWelcome(false);
    }, []);

    const onChange = useCallback((elements: readonly any[], appState: any) => {
        // Fast path: Update ref immediately
        currentElementsRef.current = elements;

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

            // AUTO-SAVE to API
            const currentWhiteboard = whiteboardRef.current;
            if (currentWhiteboard?.artboards?.[0]?.id) {
                setSaveStatus('saving');

                const snapshot = {
                    elements: elements,
                    appState: {
                        viewBackgroundColor: appState.viewBackgroundColor
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
    }, [id, excalidrawAPI]); // REMOVED whiteboard, showWelcome dependence

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

    if (!isLoaded && id !== 'new') {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <WhiteboardHeader
                title={whiteboard?.title}
                saveStatus={saveStatus}
                onBack={() => router.push('/whiteboard')}
            />

            <ExcalidrawWrapper
                excalidrawAPI={setExcalidrawAPI}
                onChange={onChange}
                onPointerUpdate={onPointerUpdate}
                onBack={() => router.back()} // Kept for internal logic if needed, but header handles main back
                title={whiteboard?.title}
            />

            {/* SaveStatusIndicator removed in favor of Header */}

            {showWelcome && (
                <WelcomeScreen onStart={handleStartDrawing} />
            )}
        </div>
    );
}
