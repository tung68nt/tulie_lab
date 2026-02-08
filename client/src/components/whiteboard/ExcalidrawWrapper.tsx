'use client';

import React from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

interface ExcalidrawWrapperProps {
    excalidrawAPI: (api: any) => void;
    onChange: (elements: readonly any[], appState: any) => void;
    onPointerUpdate: (activeTool: any, pointerData: any) => void;
    onBack: () => void;
    title?: string;
}

const ExcalidrawWrapper = React.memo(({
    excalidrawAPI,
    onChange,
    onPointerUpdate,
    onBack,
    title
}: ExcalidrawWrapperProps) => {
    return (
        <Excalidraw
            excalidrawAPI={excalidrawAPI}
            onChange={onChange}
            onPointerUpdate={onPointerUpdate as any}
            langCode="vi-VN"
            theme="light"
            UIOptions={{
                canvasActions: {
                    changeViewBackgroundColor: true,
                    clearCanvas: true,
                    loadScene: false,
                    saveToActiveFile: false,
                    toggleTheme: false,
                    saveAsImage: true,
                },
            }}
        />
    );
}, (prev, next) => {
    // Custom comparison to ensure we don't re-render unless function references change
    // title change shouldn't trigger full reload of canvas ideally, but might correspond to document switch
    return prev.excalidrawAPI === next.excalidrawAPI &&
        prev.onChange === next.onChange &&
        prev.onPointerUpdate === next.onPointerUpdate &&
        prev.title === next.title;
});

ExcalidrawWrapper.displayName = 'ExcalidrawWrapper';

export default ExcalidrawWrapper;
