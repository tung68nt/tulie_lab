'use client';
import { Loader2 } from 'lucide-react';

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import ExcalidrawConfig from '@/components/whiteboard/ExcalidrawConfig';

// Dynamically import the editor with no SSR
const WhiteboardEditor = dynamic(() => import('@/components/whiteboard/WhiteboardEditor'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-screen bg-background pt-16">
            <div className="w-8 h-8 rounded-full border-3 border-border border-t-primary animate-spin" style={{ animationDuration: '0.6s' }} />
        </div>
    ),
});

export default function WhiteboardPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div className="w-full h-screen overflow-hidden">
            <ExcalidrawConfig />
            <WhiteboardEditor id={id} />
        </div>
    );
}
