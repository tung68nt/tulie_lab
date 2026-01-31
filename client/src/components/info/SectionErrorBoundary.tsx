'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    sectionName?: string;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class SectionErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[SectionErrorBoundary] Error in section ${this.props.sectionName || 'unknown'}:`, error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (process.env.NODE_ENV === 'development') {
                return (
                    <div className="py-8 px-4 text-center border-2 border-dashed border-red-500/50 rounded-xl bg-red-500/5 my-4">
                        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <h3 className="font-bold text-red-600 mb-1">Section Error: {this.props.sectionName}</h3>
                        <p className="text-sm text-red-500/80">{this.state.error?.message}</p>
                    </div>
                );
            }
            return null; // Production: Hide broken section gracefully
        }

        return this.props.children;
    }
}
