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
    return (
        <Excalidraw
            excalidrawAPI={excalidrawAPI}
            onChange={onChange}
            onPointerUpdate={onPointerUpdate as any}
            theme="light"
            UIOptions={{
                canvasActions: {
                    toggleTheme: true,
                    export: {
                        saveFileToDisk: true,
                    }
                }
            }}
            initialData={{
                appState: { gridModeEnabled: true }
            }}
        >
            <MainMenu>
                <MainMenu.DefaultItems.SaveAsImage />
                <MainMenu.DefaultItems.Export />
                <MainMenu.DefaultItems.ClearCanvas />
                <MainMenu.Separator />
                <MainMenu.DefaultItems.ToggleTheme />
                <MainMenu.Separator />
                <MainMenu.Item onSelect={onBack}>
                    Quay lại danh sách
                </MainMenu.Item>
            </MainMenu>
            <WelcomeScreen>
                <WelcomeScreen.Center>
                    <WelcomeScreen.Center.Logo>
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <Logo showText={false} className="w-24 h-24" />
                            <div className="flex flex-col items-center select-none">
                                <span className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em] leading-none mb-1">Tulie</span>
                                <span className="text-4xl font-black text-zinc-900 leading-none">Whiteboard</span>
                            </div>
                        </div>
                    </WelcomeScreen.Center.Logo>
                    <WelcomeScreen.Center.Menu>
                        <WelcomeScreen.Center.MenuItemLoadScene />
                        <WelcomeScreen.Center.MenuItemHelp />
                    </WelcomeScreen.Center.Menu>
                </WelcomeScreen.Center>
                <WelcomeScreen.Hints.MenuHint>
                    Export, preferences, languages, ...
                </WelcomeScreen.Hints.MenuHint>
                <WelcomeScreen.Hints.ToolbarHint>
                    Pick a tool & start drawing!
                </WelcomeScreen.Hints.ToolbarHint>
                <WelcomeScreen.Hints.HelpHint>
                    Shortcuts & help
                </WelcomeScreen.Hints.HelpHint>
            </WelcomeScreen>
        </Excalidraw >
    );
}
