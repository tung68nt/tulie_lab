'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import ExcalidrawWrapper from './ExcalidrawWrapper';
import { api } from '@/lib/api';

interface WhiteboardEditorProps {
    id: string;
}

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    const [whiteboard, setWhiteboard] = useState<any>(null);
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

    // State for UI sync
    const [activeTool, setActiveTool] = useState<string>('selection');
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [zoom, setZoom] = useState<number>(1);
    const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

    // Refs
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastEmitTimeRef = useRef<number>(0);
    const lastPointerUpdateRef = useRef<number>(0);
    const socketRef = useRef<any>(null);

    // Initial Load Data
    useEffect(() => {
        const loadWhiteboard = async () => {
            try {
                const data = await api.whiteboards.get(id);
                setWhiteboard(data);
            } catch (error) {
                console.error('Failed to load whiteboard:', error);
            }
        };

        if (id) {
            loadWhiteboard();
        }
    }, [id]);

    // Socket Connection
    useEffect(() => {
        if (!id) return;

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
                excalidrawAPI.updateScene({
                    elements: data.elements,
                    commitToHistory: false
                });
            }
        });

        socket.on('cursor_moved', (data: any) => {
            // Handle remote cursors (future impl)
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [id]);

    // Handle initial data for Excalidraw (Once API is ready)
    useEffect(() => {
        if (!excalidrawAPI || !whiteboard?.artboards?.[0]?.elements) return;

        console.log('Loading data into Excalidraw', whiteboard.title);

        try {
            const elements = typeof whiteboard.artboards[0].elements === 'string'
                ? JSON.parse(whiteboard.artboards[0].elements)
                : whiteboard.artboards[0].elements;

            if (elements && elements.elements) {
                excalidrawAPI.updateScene({
                    elements: elements.elements,
                    appState: elements.appState
                });
            }
        } catch (e) {
            console.error(e);
        }

    }, [excalidrawAPI, whiteboard]);

    const onChange = useCallback((elements: readonly any[], appState: any) => {
        // Debounce State Updates
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            const newTool = appState.activeTool?.type;
            const newLocked = appState.activeTool?.locked;
            const newZoom = appState.zoom?.value;
            const isLibOpen = !!(appState.openSidebar?.name === "library");

            if (newTool !== activeTool) setActiveTool(newTool);
            if (newLocked !== isLocked) setIsLocked(newLocked);
            if (newZoom !== zoom) setZoom(newZoom);
            if (isLibOpen !== isLibraryOpen) setIsLibraryOpen(isLibOpen);

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
        }, 300);
    }, [activeTool, isLocked, zoom, isLibraryOpen, id]);

    const onPointerUpdate = useCallback((activeTool: any, pointerData: any) => {
        // Throttle
        const now = Date.now();
        if (now - lastPointerUpdateRef.current > 100) {
            lastPointerUpdateRef.current = now;
            if (socketRef.current) {
                socketRef.current.emit('cursor_move', {
                    whiteboardId: id,
                    point: { x: pointerData.x, y: pointerData.y },
                    userName: 'Bạn' // Should be real user name if available
                });
            }
        }
    }, [id]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ExcalidrawWrapper
                excalidrawAPI={setExcalidrawAPI}
                onChange={onChange}
                onPointerUpdate={onPointerUpdate}
                onBack={() => { window.location.href = '/whiteboard'; }}
                title={whiteboard?.title}
            />
        </div>
    );
}
