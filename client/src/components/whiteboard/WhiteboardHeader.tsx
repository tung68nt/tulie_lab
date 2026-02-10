import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ChevronLeft, Cloud, Check, Home, Pencil, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { SaveStatus } from './SaveStatusIndicator';
import { Logo } from '@/components/Logo';

interface WhiteboardHeaderProps {
    title?: string;
    saveStatus: SaveStatus;
    onBack: () => void;
    onRename?: (newTitle: string) => void;
    isSidebarDocked?: boolean;
    gridEnabled?: boolean;
    onToggleGrid?: () => void;
    onSave?: () => Promise<void>;
}

export default function WhiteboardHeader({
    title, saveStatus, onBack, onRename, isSidebarDocked,
    gridEnabled = true, onToggleGrid, onSave
}: WhiteboardHeaderProps) {
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

                        {/* Grid Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 ml-2 rounded-lg transition-colors ${gridEnabled
                                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100'
                                : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                                }`}
                            onClick={onToggleGrid}
                            title={gridEnabled ? "Hide Grid" : "Show Grid"}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>

                        {/* Status Badge & Manual Save */}
                        <div className="hidden sm:flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-700/50 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-700 ml-1">
                            {saveStatus === 'saving' && (
                                <>
                                    <div className="w-2 h-2 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-[10px] text-zinc-500 font-medium">Saving</span>
                                </>
                            )}
                            {saveStatus === 'saved' && (
                                <button
                                    onClick={onSave}
                                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                                    title="Click to force save"
                                >
                                    <Cloud className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[10px] text-zinc-400 font-medium">Saved</span>
                                </button>
                            )}
                            {saveStatus === 'error' && (
                                <button
                                    onClick={onSave}
                                    className="flex items-center gap-1.5"
                                    title="Retry save"
                                >
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                    <span className="text-[10px] text-red-500 font-medium">Retry</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}
