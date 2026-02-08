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
        <>
            {/* Box 1: Back + Logo - exact toolbar styling */}
            <div className="absolute top-4 left-52 z-20">
                <div
                    className="bg-white dark:bg-zinc-800 rounded-lg h-[44px] p-1 flex items-center gap-1 pr-3"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.17) 0px 0px 0.931014px 0px, rgba(0, 0, 0, 0.08) 0px 0px 3.12708px 0px, rgba(0, 0, 0, 0.05) 0px 7px 14px 0px' }}
                >
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-500"
                        onClick={onBack}
                        title="Back to Dashboard"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

                    {/* Logo Section */}
                    <div className="flex items-center pl-1">
                        <Logo showText={false} height="h-5" />
                        <span className="ml-1.5 text-[10px] font-medium text-zinc-400 hidden sm:block">
                            Whiteboard
                        </span>
                    </div>
                </div>
            </div>

            {/* Box 2: Title + Status - bottom center, exact toolbar styling */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                <div
                    className="bg-white dark:bg-zinc-800 rounded-lg h-[44px] px-3 flex items-center gap-3"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.17) 0px 0px 0.931014px 0px, rgba(0, 0, 0, 0.08) 0px 0px 3.12708px 0px, rgba(0, 0, 0, 0.05) 0px 7px 14px 0px' }}
                >
                    {isEditing ? (
                        <input
                            autoFocus
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none min-w-[120px]"
                            style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}
                        />
                    ) : (
                        <h1
                            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 max-w-[150px] sm:max-w-[200px] truncate cursor-pointer hover:underline decoration-zinc-400 underline-offset-4 flex items-center gap-2"
                            style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}
                            onClick={() => setIsEditing(true)}
                            title="Click to rename"
                        >
                            {title || 'Untitled Whiteboard'}
                            <Pencil className="w-3 h-3 text-zinc-400 opacity-50 hover:opacity-100 transition-opacity" />
                        </h1>
                    )}

                    {/* Compact Status */}
                    <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-700/50 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-700">
                        {saveStatus === 'saving' && (
                            <>
                                <div className="w-2.5 h-2.5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] text-zinc-500 font-medium">Saving</span>
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <>
                                <Cloud className="w-3 h-3 text-zinc-400" />
                                <span className="text-[10px] text-zinc-400 font-medium">Saved</span>
                            </>
                        )}
                        {saveStatus === 'error' && (
                            <>
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="text-[10px] text-red-500 font-medium">Error</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
