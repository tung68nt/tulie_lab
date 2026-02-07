'use client';

import React from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { Logo } from '@/components/Logo';

interface ExcalidrawWrapperProps {
    excalidrawAPI: (api: any) => void;
    onChange: (elements: readonly any[], appState: any) => void;
    onPointerUpdate: (activeTool: any, pointerData: any) => void;
    onBack: () => void;
    title?: string;
}

export default function ExcalidrawWrapper({
    excalidrawAPI,
    onChange,
    onPointerUpdate,
    onBack,
    title
}: ExcalidrawWrapperProps) {
    const UIOptions = React.useMemo(() => ({
        canvasActions: {
            toggleTheme: true,
            export: {
                saveFileToDisk: true,
            }
        }
    }), []);

    const initialData = React.useMemo(() => ({
        appState: { gridModeEnabled: true }
    }), []);

    return (
        <Excalidraw />
    );
}
