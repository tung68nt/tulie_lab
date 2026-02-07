'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import vanilla Excalidraw with no SSR
const VanillaExcalidraw = dynamic(
    () => import('@/components/whiteboard/VanillaExcalidraw'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center w-full h-screen bg-white">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-zinc-600">Loading Vanilla Excalidraw...</p>
                </div>
            </div>
        )
    }
);

/**
 * Test page for vanilla Excalidraw - no custom UI to diagnose lag
 * Access at: /whiteboard/test
 */
export default function WhiteboardTestPage() {
    return <VanillaExcalidraw />;
}
