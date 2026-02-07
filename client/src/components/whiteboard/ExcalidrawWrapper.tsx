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
            langCode="vi-VN"
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
                        <div className="flex flex-col items-center gap-6 mb-10">
                            <Logo showText={false} className="w-32 h-32" />
                            <div className="flex flex-col items-center select-none">
                                <span className="text-sm font-bold text-zinc-400 leading-none mb-3">Premium</span>
                                <span className="text-5xl font-bold text-zinc-900 tracking-tighter leading-none">Tulie Lab</span>
                                <span className="text-lg font-bold text-zinc-500 mt-4 tracking-wide">Bảng trắng sáng tạo</span>
                            </div>
                        </div>
                    </WelcomeScreen.Center.Logo>
                    <WelcomeScreen.Center.Menu>
                        <WelcomeScreen.Center.MenuItemLoadScene />
                        <WelcomeScreen.Center.MenuItemHelp />
                    </WelcomeScreen.Center.Menu>
                </WelcomeScreen.Center>
                <WelcomeScreen.Hints.MenuHint>
                    Xuất file, cài đặt, ngôn ngữ, ...
                </WelcomeScreen.Hints.MenuHint>
                <WelcomeScreen.Hints.ToolbarHint>
                    Chọn một công cụ và bắt đầu vẽ!
                </WelcomeScreen.Hints.ToolbarHint>
                <WelcomeScreen.Hints.HelpHint>
                    Phím tắt & trợ giúp
                </WelcomeScreen.Hints.HelpHint>
            </WelcomeScreen>
        </Excalidraw >
    );
}
