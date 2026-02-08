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
    initialData?: {
        elements?: readonly any[];
        appState?: any;
    };
}

const ExcalidrawWrapper = React.memo(({
    excalidrawAPI,
    onChange,
    onPointerUpdate,
    initialData
}: ExcalidrawWrapperProps) => {
    console.log('=== ExcalidrawWrapper render ===');
    console.log('initialData:', initialData?.elements?.length, 'elements');

    return (
        <Excalidraw
            excalidrawAPI={excalidrawAPI}
            onChange={onChange}
            onPointerUpdate={onPointerUpdate as any}
            initialData={initialData}
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
    // IMPORTANT: Must compare initialData to reload when data changes
    const prevElementsLength = prev.initialData?.elements?.length ?? 0;
    const nextElementsLength = next.initialData?.elements?.length ?? 0;

    // Re-render if initialData changes from empty to non-empty
    if (prevElementsLength === 0 && nextElementsLength > 0) {
        console.log('ExcalidrawWrapper: Triggering re-render for initialData change');
        return false;
    }

    return prev.excalidrawAPI === next.excalidrawAPI &&
        prev.onChange === next.onChange &&
        prev.onPointerUpdate === next.onPointerUpdate;
});

ExcalidrawWrapper.displayName = 'ExcalidrawWrapper';

export default ExcalidrawWrapper;

