import React from 'react';
import { Button } from '@/components/Button';
import { PenTool, Laptop, Share2, Keyboard } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10 pointer-events-none">
            <div className="flex flex-col items-center justify-center pointer-events-auto p-10 animate-fade-in text-center">
                {/* Logo Area */}
                <div className="mb-8 relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative transform hover:scale-105 transition-transform duration-300">
                        <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-3xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex items-center justify-center rotate-3">
                            <PenTool className="w-12 h-12 text-violet-600 dark:text-violet-400" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Hand-drawn Title */}
                <h1 className="text-5xl mb-3 text-zinc-900 dark:text-zinc-50" style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}>
                    Tulie Whiteboard
                </h1>
                <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-md" style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}>
                    Virtual whiteboard for sketching hand-drawn like diagrams.
                </p>

                {/* Main Action */}
                <Button
                    onClick={onStart}
                    size="lg"
                    className="h-14 px-10 text-xl bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all border-2 border-transparent"
                    style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}
                >
                    Start Drawing
                </Button>

                {/* Features Grid - Hand-drawn style */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 mt-16 opacity-60">
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                        <Laptop className="w-5 h-5" />
                        <span style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}>Auto-Save</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                        <Share2 className="w-5 h-5" />
                        <span style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}>Live Collab</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                        <Keyboard className="w-5 h-5" />
                        <span style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}>Shortcuts</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                        <PenTool className="w-5 h-5" />
                        <span style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}>Infinite Canvas</span>
                    </div>
                </div>

                <div className="mt-12 text-sm text-zinc-400" style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}>
                    Press <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-700 font-mono text-xs">/</span> to open menu
                </div>
            </div>
        </div>
    );
}
