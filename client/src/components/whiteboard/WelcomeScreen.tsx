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
                <div className="absolute top-24 left-16 text-zinc-400 dark:text-zinc-500 font-['Virgil'] text-xl -rotate-2">
                    <span className="block absolute w-60 left-12 top-16 text-left leading-tight">
                        Main menu
                    </span>
                    <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-60 absolute -top-16 -left-8">
                        {/* Curve pointing to the hamburger menu at top-left */}
                        <path d="M70,80 Q40,60 10,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M10,25 L10,10 L25,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* 2. Tools Arrow (Top Center) - Points to Toolbar */}
                <div className="absolute top-28 left-1/2 -translate-x-1/2 text-zinc-400 dark:text-zinc-500 font-['Virgil'] text-xl">
                    <span className="block absolute w-60 -left-[16rem] top-4 text-right leading-tight italic">
                        Select a tool to start...
                    </span>
                    <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-60 absolute left-4 -top-12 rotate-[120deg]">
                        {/* Curved arrow pointing up to center toolbar */}
                        <path d="M10,50 Q20,20 50,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M35,10 L50,10 L50,25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* 3. Tulie Controls Arrow (Bottom Center) - Points to Bottom Header */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-zinc-400 dark:text-zinc-500 font-['Virgil'] text-xl">
                    <span className="block absolute w-80 left-[8rem] -top-4 text-left leading-tight">
                        Grid, Status & Artboards
                    </span>
                    <svg width="120" height="80" viewBox="0 0 120 80" className="opacity-60 absolute -left-16 top-4 scale-y-[-1]">
                        {/* Curve down-right to the bottom header bar */}
                        <path d="M10,20 Q40,30 110,60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M95,60 L110,60 L110,45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
