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
        </div>
    );
}
