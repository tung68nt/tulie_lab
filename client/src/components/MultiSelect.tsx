'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Chọn...",
    className
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    const removeOption = (e: React.MouseEvent, value: string) => {
        e.stopPropagation();
        onChange(selected.filter(v => v !== value));
    };

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div
                className={cn(
                    "flex flex-wrap gap-1.5 p-2 min-h-10 w-full rounded-md border border-input bg-background text-sm cursor-pointer transition-all",
                    isOpen && "ring-2 ring-ring ring-offset-2 border-transparent"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected.length === 0 ? (
                    <span className="text-muted-foreground py-0.5">{placeholder}</span>
                ) : (
                    selected.map(val => {
                        const option = options.find(o => o.value === val);
                        return (
                            <div
                                key={val}
                                className="flex items-center gap-1 bg-neutral-900 text-white px-2 py-0.5 rounded text-xs font-medium"
                            >
                                {option?.label || val}
                                <X
                                    size={12}
                                    className="cursor-pointer hover:text-red-400"
                                    onClick={(e) => removeOption(e, val)}
                                />
                            </div>
                        );
                    })
                )}
                <div className="ml-auto pl-2 flex items-center">
                    <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-1">
                        {options.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground text-center">Không có lựa chọn</div>
                        ) : (
                            options.map(option => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer transition-colors",
                                        selected.includes(option.value)
                                            ? "bg-neutral-100 font-semibold"
                                            : "hover:bg-muted"
                                    )}
                                    onClick={() => toggleOption(option.value)}
                                >
                                    <div className={cn(
                                        "w-3.5 h-3.5 border rounded flex items-center justify-center transition-colors",
                                        selected.includes(option.value)
                                            ? "bg-neutral-900 border-neutral-900"
                                            : "border-input"
                                    )}>
                                        {selected.includes(option.value) && (
                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                        )}
                                    </div>
                                    {option.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
