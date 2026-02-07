'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ExcalidrawWrapper from './ExcalidrawWrapper';

interface WhiteboardEditorProps {
    id: string;
}

export default function WhiteboardEditor({ id }: WhiteboardEditorProps) {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ExcalidrawWrapper
                excalidrawAPI={() => { }}
                onChange={() => { }}
                onPointerUpdate={() => { }}
                onBack={() => { }}
                title=""
            />
        </div>
    );
}
