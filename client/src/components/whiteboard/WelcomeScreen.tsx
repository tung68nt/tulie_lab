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
                {/* 1. Menu Arrow (Top Left) */}
                <div className="absolute top-20 left-24 text-zinc-400 dark:text-zinc-500 font-['Virgil'] text-xl -rotate-6">
                    <span className="block absolute w-60 -left-4 top-20 text-center leading-tight">
                        Export, preferences, languages, ...
                    </span>
                    <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-70 -ml-10">
                        {/* Curved line pointing up-left */}
                        <path d="M50,80 Q10,50 10,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        {/* Arrowhead */}
                        <path d="M5,20 L10,10 L20,13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* 2. Tools Arrow (Top Center) */}
                <div className="absolute top-24 left-[60%] -translate-x-1/2 text-zinc-400 dark:text-zinc-500 font-['Virgil'] text-xl rotate-6">
                    <span className="block absolute w-48 -left-20 top-20 text-center leading-tight">
                        Pick a tool & Start drawing!
                    </span>
                    <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-70 ml-10">
                        {/* Curved line pointing up */}
                        <path d="M20,80 Q50,40 80,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        {/* Arrowhead */}
                        <path d="M68,15 L80,10 L82,22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* 3. Help Arrow (Bottom Right) */}
                <div className="absolute bottom-24 right-32 text-zinc-400 dark:text-zinc-500 font-['Virgil'] text-xl">
                    <span className="block absolute w-40 -left-32 top-0 text-right leading-tight">
                        Shortcuts & help
                    </span>
                    <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-70 rotate-12">
                        {/* Curved line pointing down-right */}
                        <path d="M10,10 Q50,20 80,80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        {/* Arrowhead */}
                        <path d="M70,70 L80,80 L85,65" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
