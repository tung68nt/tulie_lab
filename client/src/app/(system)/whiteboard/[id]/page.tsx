'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

// Dynamically import the editor with no SSR
const WhiteboardEditor = dynamic(() => import('@/components/whiteboard/WhiteboardEditor'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center w-full h-screen bg-background pt-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    ),
});

export default function WhiteboardPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div className="w-full h-screen overflow-hidden">
            <WhiteboardEditor id={id} />
        </div>
    );
}
