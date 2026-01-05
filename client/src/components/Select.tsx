'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    value?: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function Select({ value, onChange, options, placeholder = 'Select...', className = '', disabled = false }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = options.find(o => o.value === value);
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-2.5 bg-background border rounded-md text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-foreground/50'
                    }`}
            >
                <span className={`block truncate ${!selectedOption ? 'text-muted-foreground' : ''}`}>
                    {displayLabel}
                </span>
                <svg
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg p-1 max-h-60 overflow-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`
                                relative flex items-center px-2 py-1.5 text-sm cursor-pointer select-none transition-colors rounded-sm
                                ${option.value === value
                                    ? 'font-medium bg-accent text-accent-foreground'
                                    : 'hover:bg-accent hover:text-accent-foreground'
                                }
                            `}
                        >
                            <span className="flex-1 truncate">{option.label}</span>
                            {option.value === value && (
                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
