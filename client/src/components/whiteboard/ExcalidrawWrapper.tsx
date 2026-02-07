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
        <Excalidraw
            excalidrawAPI={excalidrawAPI}
            onChange={onChange}
            onPointerUpdate={onPointerUpdate as any}
            langCode="vi-VN"
            theme="light"
            viewModeEnabled={false}
            zenModeEnabled={false}
            gridModeEnabled={true}
            UIOptions={UIOptions}
        >
            <MainMenu>
                <MainMenu.DefaultItems.LoadScene />
                <MainMenu.DefaultItems.SaveAsImage />
                <MainMenu.DefaultItems.Export />
                <MainMenu.Separator />
                <MainMenu.DefaultItems.CommandPalette />
                <MainMenu.DefaultItems.SearchMenu />
                <MainMenu.DefaultItems.Help />
                <MainMenu.DefaultItems.ClearCanvas />
                <MainMenu.Separator />
                <MainMenu.DefaultItems.ToggleTheme />
                <MainMenu.DefaultItems.ChangeCanvasBackground />
                <MainMenu.Separator />
                <MainMenu.Item onSelect={onBack}>
                    Quay lại danh sách
                </MainMenu.Item>
            </MainMenu>
        </Excalidraw>
    );
}
