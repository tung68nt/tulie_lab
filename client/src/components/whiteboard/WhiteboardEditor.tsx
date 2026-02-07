'use client';

import React from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

interface WhiteboardEditorProps {
    id: string;
}

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Excalidraw
                langCode="vi-VN"
                theme="light"
            />
        </div>
    );
}
