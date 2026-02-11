import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ChevronLeft, Cloud, Pencil, LayoutGrid, Globe, Lock, Link as LinkIcon, Check } from 'lucide-react';
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
    status?: 'PUBLIC' | 'PRIVATE';
    onStatusChange?: (newStatus: 'PUBLIC' | 'PRIVATE') => void;
}

export default function WhiteboardHeader({
    title, saveStatus, onBack, onRename, isSidebarDocked,
    gridEnabled = true, onToggleGrid, onSave,
    status = 'PRIVATE', onStatusChange
}: WhiteboardHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(title || 'Untitled Whiteboard');
    const [justCopied, setJustCopied] = useState(false);

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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-[95vw] sm:max-w-none">
            <div
                className="bg-white/95 dark:bg-zinc-900/95 rounded-2xl h-[52px] p-1 pr-3 flex items-center gap-1.5 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md"
                style={{ boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)' }}
            >
                {/* Navigation Group: Back */}
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-all active:scale-95"
                        onClick={onBack}
                        title="Back to Dashboard"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </div>

                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

                {/* Logo & Title */}
                <div className="flex items-center gap-3 pl-1">
                    <Logo showText={false} height="h-6" />

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input
                                autoFocus
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={handleBlur}
                                className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none min-w-[100px] max-w-[150px]"
                                style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}
                            />
                        ) : (
                            <h1
                                className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 max-w-[100px] sm:max-w-[180px] truncate cursor-pointer hover:text-primary transition-colors flex items-center gap-1.5"
                                style={{ fontFamily: '"Virgil", "Excalifont", sans-serif' }}
                                onClick={() => setIsEditing(true)}
                                title="Click to rename"
                            >
                                {title || 'Untitled Whiteboard'}
                                <Pencil className="w-3 h-3 text-zinc-400 opacity-50" />
                            </h1>
                        )}
                    </div>
                </div>

                {/* Right Group: Grid & Status */}
                <div className="flex items-center gap-2 ml-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-9 w-9 rounded-xl transition-all ${gridEnabled
                            ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                            }`}
                        onClick={onToggleGrid}
                        title={gridEnabled ? "Hide Grid" : "Show Grid"}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </Button>

                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

                    {/* Visibility Switch */}
                    <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50">
                        <div
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-all duration-300 cursor-pointer ${status === 'PRIVATE' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
                            onClick={() => onStatusChange?.('PRIVATE')}
                        >
                            <Lock className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium hidden sm:inline">Private</span>
                        </div>
                        <div
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl transition-all duration-300 cursor-pointer ${status === 'PUBLIC' ? 'bg-emerald-500 shadow-sm text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
                            onClick={() => onStatusChange?.('PUBLIC')}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium hidden sm:inline">Public</span>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

                    {/* Copy Link Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setJustCopied(true);
                            setTimeout(() => setJustCopied(false), 2000);
                        }}
                        title="Copy Share Link"
                    >
                        {justCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
                    </Button>

                    <div className="hidden sm:flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-100 dark:border-zinc-800">
                        {saveStatus === 'saving' && (
                            <>
                                <div className="w-2 h-2 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[11px] text-zinc-500 font-medium">Saving</span>
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <button
                                onClick={onSave}
                                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                                title="Click to force save"
                            >
                                <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[11px] text-zinc-500 font-medium">Saved</span>
                            </button>
                        )}
                        {saveStatus === 'error' && (
                            <button
                                onClick={onSave}
                                className="flex items-center gap-1.5"
                                title="Retry save"
                            >
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-[11px] text-red-500 font-medium">Retry</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
