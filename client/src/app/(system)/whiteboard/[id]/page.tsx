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
            <Loader2 className="animate-spin w-8 h-8 text-primary " />
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
