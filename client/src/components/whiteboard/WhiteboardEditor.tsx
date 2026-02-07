'use client';

import React, { useState, useEffect, useRef } from 'react';
import ExcalidrawWrapper from './ExcalidrawWrapper';
import { api } from '@/lib/api';

interface WhiteboardEditorProps {
    id: string;
}

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    const [whiteboard, setWhiteboard] = useState<any>(null);
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

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

        // Prevent double loading if already loaded (basic check)
        // For now, just log
        console.log('Loading data into Excalidraw', whiteboard.title);

        try {
            // Parse elements if string
            const elements = typeof whiteboard.artboards[0].elements === 'string'
                ? JSON.parse(whiteboard.artboards[0].elements)
                : whiteboard.artboards[0].elements;

            // We can use updateScene to load data
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

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ExcalidrawWrapper
                excalidrawAPI={setExcalidrawAPI}
                onChange={() => { }}
                onPointerUpdate={() => { }}
                onBack={() => { window.location.href = '/whiteboard'; }}
                title={whiteboard?.title}
            />
        </div>
    );
}
