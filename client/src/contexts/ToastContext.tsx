'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        console.log('🔔 Toast added:', message, type); // Debug log
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Toast Container - renders using portal to ensure it's always on top
const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) => {
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Create a dedicated container for toasts
        let container = document.getElementById('toast-portal-root');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-portal-root';
            container.style.position = 'fixed';
            container.style.top = '80px';
            container.style.right = '20px';
            container.style.zIndex = '999999';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '8px';
            container.style.maxWidth = '360px';
            container.style.width = '100%';
            container.style.pointerEvents = 'none';
            document.body.appendChild(container);
        }
        setPortalContainer(container);

        return () => {
            // Cleanup on unmount
            if (container && container.parentNode && container.childNodes.length === 0) {
                container.parentNode.removeChild(container);
            }
        };
    }, []);

    if (!portalContainer || toasts.length === 0) return null;

    return createPortal(
        <>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto rounded-lg px-4 py-3 shadow-xl cursor-pointer border flex items-center gap-3
                    ${toast.type === 'success' ? 'bg-zinc-900 text-white border-zinc-800' : ''}
                    ${toast.type === 'error' ? 'bg-red-600 text-white border-red-700' : ''}
                    ${toast.type === 'info' ? 'bg-blue-600 text-white border-blue-700' : ''}
                    ${toast.type === 'warning' ? 'bg-yellow-500 text-black border-yellow-600' : ''}
                    ${!['success', 'error', 'info', 'warning'].includes(toast.type) ? 'bg-zinc-900 text-white' : ''}
                    `}
                    onClick={() => removeToast(toast.id)}
                    style={{
                        pointerEvents: 'auto',
                        animation: 'toastFadeIn 0.2s ease-out forwards'
                    }}
                >
                    <div className="flex-shrink-0">
                        {toast.type === 'success' && <CircleCheck className="h-5 w-5 text-green-400" />}
                        {toast.type === 'error' && <CircleX className="h-5 w-5 text-white" />}
                        {toast.type === 'info' && <Info className="h-5 w-5 text-blue-200" />}
                        {toast.type === 'warning' && <TriangleAlert className="h-5 w-5 text-yellow-800" />}
                    </div>
                    <span className="font-medium text-sm flex-1">{toast.message}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
                        className="opacity-70 hover:opacity-100 ml-2"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </>,
        portalContainer
    );
};

