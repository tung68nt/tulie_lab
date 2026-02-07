import React from 'react';
import { Button } from '@/components/Button';
import { PenTool, Image as ImageIcon, Type, MousePointer2 } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10 pointer-events-none">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-8 rounded-xl border border-border shadow-xl text-center max-w-md pointer-events-auto">
                <div className="mb-6 flex justify-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <PenTool className="h-8 w-8 text-primary" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2">Welcome to Tulie Whiteboard</h1>
                <p className="text-muted-foreground mb-8">
                    Collaborate, sketch, and brainstorm ideas in real-time.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-left">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <MousePointer2 className="h-4 w-4 text-primary" />
                        <span>Real-time Sync</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Infinite Canvas</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <Type className="h-4 w-4 text-muted-foreground" />
                        <span>Text & Shapes</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <PenTool className="h-4 w-4 text-muted-foreground" />
                        <span>Smart Drawing</span>
                    </div>
                </div>

                <Button onClick={onStart} size="lg" className="w-full">
                    Start Drawing
                </Button>
            </div>
        </div>
    );
}
