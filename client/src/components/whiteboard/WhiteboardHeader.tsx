import React from 'react';
import { Button } from '@/components/Button';
import { ChevronLeft, Cloud, Check, Home } from 'lucide-react'; // Added Home icon just in case, but using Logo
import Link from 'next/link';
import { SaveStatus } from './SaveStatusIndicator';
import { Logo } from '@/components/Logo';

interface WhiteboardHeaderProps {
    title?: string;
    saveStatus: SaveStatus;
    onBack: () => void;
}

export default function WhiteboardHeader({ title, saveStatus, onBack }: WhiteboardHeaderProps) {
    return (
        <div className="absolute top-4 left-[60px] z-20 flex items-center gap-3">
            {/* Logo Home Button */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-1 flex items-center justify-center w-10 h-10 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                <Logo showText={false} height="h-6" />
            </div>

            {/* Back Button */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md text-zinc-500"
                    onClick={onBack}
                    title="Back to Dashboard"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
            </div>

            {/* Title & Status Panel */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 h-10 px-4 flex items-center gap-4">
                <h1 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 max-w-[200px] truncate" style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}>
                    {title || 'Untitled Whiteboard'}
                </h1>

                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />

                {/* Compact Status */}
                <div className="flex items-center gap-2">
                    {saveStatus === 'saving' && (
                        <>
                            <div className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-zinc-500 font-medium">Saving...</span>
                        </>
                    )}
                    {saveStatus === 'saved' && (
                        <>
                            <Cloud className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-xs text-zinc-400 font-medium">Saved</span>
                        </>
                    )}
                    {saveStatus === 'error' && (
                        <>
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-xs text-red-500 font-medium">Error</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
