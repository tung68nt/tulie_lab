import React, { useEffect } from 'react';
import { Pen } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    // Dismiss on key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Dismiss on common interaction keys
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                onStart();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onStart]);

    return (
        // Transparent background allows seeing the grid. Clicking anywhere captures specific intent or dismisses.
        <div
            className="absolute inset-0 z-10 flex items-center justify-center font-['Virgil'] bg-white/0"
            onClick={onStart} // Clicking background dismisses
        >
            <div
                className="flex flex-col items-center text-center p-8 cursor-default"
                onClick={(e) => e.stopPropagation()} // Prevent accidental dismiss when clicking content? Actually starting is fine.
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-6 mb-10">
                    <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm">
                        <Pen className="w-10 h-10" strokeWidth={1.5} />
                    </div>

                    <h1 className="text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        Tulie Whiteboard
                    </h1>

                    <p className="text-2xl text-zinc-500 dark:text-zinc-400 font-['Virgil'] opacity-80 max-w-lg leading-relaxed">
                        Virtual whiteboard for sketching hand-drawn like diagrams.
                    </p>
                </div>

                {/* Primary Action */}
                <button
                    onClick={onStart}
                    className="group px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    Start Drawing
                </button>
            </div>

            {/* Instructional Arrows (Hidden on mobile) */}
            <div className="absolute inset-0 pointer-events-none z-20 hidden lg:block overflow-hidden">
                {/* 1. Menu Arrow (Top Left) - Points to Menu Button */}
                <div className="absolute top-16 left-20 text-zinc-400 dark:text-zinc-500 font-['Virgil'] text-xl -rotate-6">
                    <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-70">
                        {/* Tail at (60, 90), Head at (10, 10) */}
                        <path d="M60,90 Q20,60 10,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M5,20 L10,10 L20,13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="block absolute w-60 left-10 top-20 text-center leading-tight">
                        Export, preferences, languages, ...
                    </span>
                </div>

                {/* 2. Tools Arrow (Top Center) - Points to Toolbar */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 ml-20 text-zinc-400 dark:text-zinc-500 font-['Virgil'] text-xl">
                    <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-70">
                        {/* Tail at (10, 80), Head at (50, 10) - Vertical curve */}
                        <path d="M10,80 Q20,30 50,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M40,15 L50,10 L58,18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="block absolute w-48 -left-24 top-16 text-right leading-tight -rotate-6">
                        Pick a tool &<br />Start drawing!
                    </span>
                </div>

                {/* 3. Help Arrow (Bottom Right) - Points to Help/Shortcuts */}
                <div className="absolute bottom-20 right-20 text-zinc-400 dark:text-zinc-500 font-['Virgil'] text-xl">
                    <span className="block absolute w-40 -left-40 -top-4 text-right leading-tight rotate-3">
                        Shortcuts & help
                    </span>
                    <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-70">
                        {/* Tail at (10, 10), Head at (80, 80) */}
                        <path d="M10,20 Q50,20 80,80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M70,75 L80,80 L85,65" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
