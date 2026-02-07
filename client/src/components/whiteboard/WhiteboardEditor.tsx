'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastEmitTimeRef = useRef<number>(0);
    const lastPointerUpdateRef = useRef<number>(0);

    // Placeholder for socket ref (not connected yet)
    const socketRef = useRef<any>(null);

    // Initial Load
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

    // Handle initial data for Excalidraw
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

            // Only update if changed to avoid unnecessary re-renders
            if (newTool !== activeTool) setActiveTool(newTool);
            if (newLocked !== isLocked) setIsLocked(newLocked);
            if (newZoom !== zoom) setZoom(newZoom);
            if (isLibOpen !== isLibraryOpen) setIsLibraryOpen(isLibOpen);

            // Auto-save Mock
            // console.log("Auto-save trigger (mock)");
        }, 300);
    }, [activeTool, isLocked, zoom, isLibraryOpen]);

    const onPointerUpdate = useCallback((activeTool: any, pointerData: any) => {
        // Throttle
        const now = Date.now();
        if (now - lastPointerUpdateRef.current > 100) {
            lastPointerUpdateRef.current = now;
            // Socket emit would go here
        }
    }, []);

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
