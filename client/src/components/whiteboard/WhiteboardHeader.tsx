import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ChevronLeft, Cloud, Check, Home, Pencil } from 'lucide-react';
import Link from 'next/link';
import { SaveStatus } from './SaveStatusIndicator';
import { Logo } from '@/components/Logo';

interface WhiteboardHeaderProps {
    title?: string;
    saveStatus: SaveStatus;
    onBack: () => void;
    onRename?: (newTitle: string) => void;
}

export default function WhiteboardHeader({ title, saveStatus, onBack, onRename }: WhiteboardHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(title || 'Untitled Whiteboard');

    useEffect(() => {
        setTempTitle(title || 'Untitled Whiteboard');
    }, [title]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            if (onRename && tempTitle.trim() !== title) {
                onRename(tempTitle);
            }
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (onRename && tempTitle.trim() !== title) {
            onRename(tempTitle);
        }
    };

    return (
        <div className="absolute top-4 left-[60px] z-20 flex items-center gap-3">
            {/* Back Button - Separated */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md text-zinc-500"
                    onClick={onBack}
                    title="Back to Dashboard"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
            </div>

            {/* Main Bar: Logo + Title + Status */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 h-11 px-2 flex items-center gap-4 pr-4">
                {/* Logo Section */}
                <div className="flex items-center pl-2">
                    {/* Increased height and enabled text */}
                    <Logo showText={true} height="h-7" />
                    {/* Optional: Add "Whiteboard" badge if not in logo */}
                    <span className="ml-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:block">
                        Whiteboard
                    </span>
                </div>

                <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

                {/* Title & Status Panel */}
                <div className="flex items-center gap-4">
                    {isEditing ? (
                        <input
                            autoFocus
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none min-w-[150px]"
                            style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}
                        />
                    ) : (
                        <h1
                            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 max-w-[300px] truncate cursor-pointer hover:underline decoration-zinc-400 underline-offset-4 flex items-center gap-2"
                            style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}
                            onClick={() => setIsEditing(true)}
                            title="Click to rename"
                        >
                            {title || 'Untitled Whiteboard'}
                            <Pencil className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h1>
                    )}

                    {/* Compact Status */}
                    <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-700/50 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-700">
                        {saveStatus === 'saving' && (
                            <>
                                <div className="w-2.5 h-2.5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Saving</span>
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <>
                                <Cloud className="w-3 h-3 text-zinc-400" />
                                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wide">Saved</span>
                            </>
                        )}
                        {saveStatus === 'error' && (
                            <>
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="text-[10px] text-red-500 font-medium uppercase tracking-wide">Error</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
