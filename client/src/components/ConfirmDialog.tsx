'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Button } from './Button';
import { X, TriangleAlert, Info, CircleCheck } from 'lucide-react';

// Types
interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

// Context
const ConfirmContext = createContext<ConfirmContextType | null>(null);

// Hook
export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context.confirm;
};

// Provider Component
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        return new Promise((res) => {
            setOptions(opts);
            setResolve(() => res);
            setIsOpen(true);
        });
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        resolve?.(true);
    };

    const handleCancel = () => {
        setIsOpen(false);
        resolve?.(false);
    };

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleCancel();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const getIcon = () => {
        switch (options?.variant) {
            case 'danger':
                return <TriangleAlert className="h-6 w-6 text-red-500" />;
            case 'warning':
                return <TriangleAlert className="h-6 w-6 text-orange-500" />;
            case 'success':
                return <CircleCheck className="h-6 w-6 text-green-500" />;
            default:
                return <Info className="h-6 w-6 text-blue-500" />;
        }
    };

    const getConfirmButtonClass = () => {
        switch (options?.variant) {
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            case 'warning':
                return 'bg-orange-500 hover:bg-orange-600 text-white';
            default:
                return '';
        }
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Modal Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Dialog Box */}
                    <div className="relative bg-background border rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            onClick={handleCancel}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
                        >
                            <X size={18} className="text-muted-foreground" />
                        </button>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 mt-0.5">
                                    {getIcon()}
                                </div>
                                <div className="flex-1">
                                    {options?.title && (
                                        <h3 className="text-lg font-semibold mb-2">
                                            {options.title}
                                        </h3>
                                    )}
                                    <p className="text-muted-foreground">
                                        {options?.message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 px-6 pb-6">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                            >
                                {options?.cancelText || 'Hủy'}
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                className={getConfirmButtonClass()}
                            >
                                {options?.confirmText || 'Xác nhận'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

// Inline Dialog Component (Optional Helper)
interface ConfirmDialogProps {
    trigger: React.ReactNode;
    onConfirm: () => void | Promise<void>;
    title?: string;
    description?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmDialog({
    trigger,
    onConfirm,
    title = "Xác nhận hành động",
    description = "Bạn có chắc chắn muốn thực hiện hành động này?",
    variant = 'danger',
    confirmText = "Xác nhận",
    cancelText = "Hủy"
}: ConfirmDialogProps) {
    const confirm = useConfirm();

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const isConfirmed = await confirm({
            title,
            message: description,
            variant,
            confirmText,
            cancelText
        });

        if (isConfirmed) {
            await onConfirm();
        }
    };

    return (
        <div onClick={handleClick} className="inline-block">
            {trigger}
        </div>
    );
}
