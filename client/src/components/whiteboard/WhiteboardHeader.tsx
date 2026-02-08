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
    isSidebarDocked?: boolean;
}

export default function WhiteboardHeader({ title, saveStatus, onBack, onRename, isSidebarDocked }: WhiteboardHeaderProps) {
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
            <>
                {/* Unified Bottom Bar - Optimized for iPad/Mobile to avoid Top Toolbar overlap */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[90vw] sm:max-w-none">
                    <div
                        className="bg-white dark:bg-zinc-800 rounded-xl h-[50px] p-1 pr-3 pl-1 flex items-center gap-2 shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm"
                        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}
                    >
                        {/* Back Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-500"
                            onClick={onBack}
                            title="Back to Dashboard"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>

                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />

                        {/* Logo (Icon Only) */}
                        <div className="flex items-center">
                            <Logo showText={false} height="h-6" />
                        </div>

                        {/* Title Section */}
                        <div className="flex items-center gap-2 ml-4">
                            {isEditing ? (
                                <input
                                    autoFocus
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleBlur}
                                    className="text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none min-w-[100px] max-w-[150px]"
                                    style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}
                                />
                            ) : (
                                <h1
                                    className="text-sm font-medium text-zinc-900 dark:text-zinc-100 max-w-[120px] sm:max-w-[200px] truncate cursor-pointer hover:underline decoration-zinc-400 underline-offset-4 flex items-center gap-2"
                                    style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}
                                    onClick={() => setIsEditing(true)}
                                    title="Click to rename"
                                >
                                    {title || 'Untitled Whiteboard'}
                                    <Pencil className="w-3 h-3 text-zinc-400 opacity-50 hover:opacity-100 transition-opacity" />
                                </h1>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className="hidden sm:flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-700/50 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-700 ml-2">
                            {saveStatus === 'saving' && (
                                <>
                                    <div className="w-2 h-2 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
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
        </>
    );
}
