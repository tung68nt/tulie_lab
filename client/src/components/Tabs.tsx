'use client';

import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextProps {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export function Tabs({
    value,
    onValueChange,
    children,
    className
}: {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("flex border-b border-border mb-4", className)}>
            {children}
        </div>
    );
}

export function TabsTrigger({
    value,
    children,
    className
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.value === value;

    return (
        <button
            type="button"
            onClick={() => context.onValueChange(value)}
            className={cn(
                "px-4 py-2 text-sm font-medium transition-all relative",
                isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                className
            )}
        >
            {children}
        </button>
    );
}

export function TabsContent({
    value,
    children,
    className
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.value !== value) return null;

    return (
        <div className={cn("w-full animate-in fade-in duration-300", className)}>
            {children}
        </div>
    );
}
