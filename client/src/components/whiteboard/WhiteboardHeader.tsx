import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ChevronLeft, Cloud, Check, Home, Pencil, Grid3X3, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import { SaveStatus } from './SaveStatusIndicator';
import { Logo } from '@/components/Logo';

interface WhiteboardHeaderProps {
    title?: string;
    saveStatus: SaveStatus;
    status?: string;
    onStatusChange?: (status: string) => void;
    onBack: () => void;
    onRename?: (newTitle: string) => void;
    isSidebarDocked?: boolean;
    gridEnabled?: boolean;
    onToggleGrid?: () => void;
    artboards: any[];
    activeIndex: number;
    onAddArtboard?: () => void;
    onSwitchArtboard?: (index: number) => void;
}

export default function WhiteboardHeader({
    title, saveStatus, status = 'DRAFT', onStatusChange, onBack, onRename, isSidebarDocked,
    gridEnabled = true, onToggleGrid,
    artboards = [], activeIndex = 0, onAddArtboard, onSwitchArtboard
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
            {/* Unified Top Header Bar - Moved to top to avoid overlap with Excalidraw footer */}
            <div className="absolute top-4 left-4 z-50 sm:left-1/2 sm:-translate-x-1/2">
                <div
                    className="bg-white/95 dark:bg-zinc-800/95 rounded-2xl h-[54px] p-1.5 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-md"
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

                    {/* Logo (Icon Only) */}
                    <div className="flex items-center">
                        <Logo showText={false} height="h-6" />
                    </div>

                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />

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
                        <Grid3X3 className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1.5" />

                    {/* Status Type Selector - Updated to be a dropdown action box */}
                    <div className="relative group/status">
                        <button className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border shadow-sm ${status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : status === 'ARCHIVED'
                                ? 'bg-zinc-100 text-zinc-600 border-zinc-200'
                                : 'bg-zinc-50 text-zinc-500 border-zinc-100'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                            {status === 'PUBLISHED' ? 'Công khai' : status === 'ARCHIVED' ? 'Lưu trữ' : 'Bản nháp'}
                            <ChevronDown className="w-3.5 h-3.5 opacity-40 group-hover/status:opacity-100 transition-opacity" />
                        </button>

                        {/* Dropdown Box with Backdrop shadow */}
                        <div className="absolute top-full left-0 mt-2 opacity-0 group-hover/status:opacity-100 pointer-events-none group-hover/status:pointer-events-auto transition-all z-30 -translate-y-2 group-hover/status:translate-y-0">
                            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl p-1.5 min-w-[140px]">
                                {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => onStatusChange?.(s)}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${status === s
                                            ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                                            : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 hover:text-zinc-900'}`}
                                    >
                                        {s === 'PUBLISHED' ? 'Công khai' : s === 'ARCHIVED' ? 'Lưu trữ' : 'Bản nháp'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="hidden sm:flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-700/50 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-700 ml-1">
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

            <Script id="excalidraw-assets-path" strategy="beforeInteractive">
                {`
                window.EXCALIDRAW_ASSET_PATH = "/excalidraw-assets/";
            `}
            </Script>
            <style id="excalidraw-overrides">
                {`
                .excalidraw {
                    --color-primary: #18181b !important;
                    --color-primary-hover: #27272a !important;
                    --color-primary-light: #f4f4f5 !important;
                    --color-selection-border: #a1a1aa !important;
                    --color-selection: rgba(24, 24, 27, 0.05) !important;
                    --button-hover-bg: #f4f4f5 !important;
                }
                .excalidraw .Island, .excalidraw .App-menu__panel, .excalidraw .sidebar {
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02) !important;
                    border-radius: 12px !important;
                    background-color: #ffffff !important;
                }
                .excalidraw .dropdown-menu, .excalidraw .context-menu {
                    background-color: #ffffff !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.12) !important;
                    border-radius: 12px !important;
                    border: 1px solid rgba(0,0,0,0.05) !important;
                }
                .excalidraw .layer-ui__wrapper .Island, .excalidraw .layer-ui__wrapper .App-menu__panel {
                    background-color: #ffffff !important;
                }
                .excalidraw .ToolIcon__icon svg, .excalidraw .App-menu__button svg {
                    color: #27272a !important;
                }
                .excalidraw .ToolIcon_type_button:hover, .excalidraw .ToolIcon_type_radio:hover {
                    background-color: #f4f4f5 !important;
                }
                .excalidraw .ToolIcon_type_button:active, .excalidraw .ToolIcon_type_radio:active {
                    background-color: #e4e4e7 !important;
                }
                .excalidraw-kbd {
                    background: #f4f4f5 !important;
                    border-color: #e4e4e7 !important;
                    color: #71717a !important;
                }
            `}
            </style>
        </>
    );
}
