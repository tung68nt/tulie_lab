import React, { useEffect } from 'react';
import { Pen, Keyboard, MousePointer2, Layout, Command, Share2 } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for '/' key to open menu logic, or just start drawing to dismiss
            if (e.key === '/') {
                // Determine what '/' should do. 
                // If it means "Start Drawing" (dismiss welcome), we call onStart.
                // If the user wants to open a menu, we might need a separate prop or dispatch an event.
                // For now, let's make it dismiss the screen so they can see the menu.
                // Or if the user explicitely said "Press / to open menu", maybe they mean the Help Menu?
                // Excalidraw default help is '?'
                // Let's assume they want to dismiss this screen and focus the app.
                onStart();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onStart]);

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-zinc-900 font-['Virgil']">
            <div className="flex flex-col items-center max-w-2xl px-4 text-center">
                {/* Logo Icon */}
                <div className="w-24 h-24 mb-8 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center shadow-lg border-2 border-zinc-900 dark:border-zinc-700 transform -rotate-3 transition-transform hover:rotate-0">
                    <Pen className="w-12 h-12 text-zinc-900 dark:text-white" strokeWidth={1.5} />
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">
                    Tulie Whiteboard
                </h1>

                <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-lg leading-relaxed font-['Reenie_Beanie']">
                    Virtual whiteboard for sketching hand-drawn like diagrams.
                </p>

                <button
                    onClick={onStart}
                    className="group relative px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex items-center gap-3"
                >
                    Start Drawing
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>

                {/* Features Grid */}
                <div className="mt-16 grid grid-cols-2 gap-x-12 gap-y-8 text-left">
                    <div className="flex items-center gap-3 text-zinc-400 group hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-default">
                        <Layout className="w-5 h-5" />
                        <span className="text-lg">Auto-Save</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400 group hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-default">
                        <Share2 className="w-5 h-5" />
                        <span className="text-lg">Live Collab</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400 group hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-default">
                        <Keyboard className="w-5 h-5" />
                        <span className="text-lg">Shortcuts</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400 group hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-default">
                        <MousePointer2 className="w-5 h-5" />
                        <span className="text-lg">Infinite Canvas</span>
                    </div>
                </div>

                <div className="mt-12 text-zinc-300 dark:text-zinc-600 text-sm flex items-center gap-2">
                    <span>Press</span>
                    <kbd className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 font-sans text-xs font-bold text-zinc-500">
                        /
                    </kbd>
                    <span>to open menu</span>
                </div>
            </div>
        </div>
    );
}
