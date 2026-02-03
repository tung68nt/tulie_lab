'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface QuickEditProps {
    editUrl: string;
}

export function QuickEdit({ editUrl }: QuickEditProps) {
    const { isAdmin, isLoading } = useAuth();
    // Use local state to avoid hydration mismatch if auth state varies initially
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        if (!isLoading && isAdmin) {
            setShouldShow(true);
        }
    }, [isLoading, isAdmin]);

    if (!shouldShow) return null;

    return (
        <div className="fixed top-24 right-40 z-50 animate-in fade-in slide-in-from-right-4 duration-500 group">
            <Link href={editUrl}>
                <Button
                    size="sm"
                    className="h-8 px-3 rounded-full shadow-xl bg-indigo-600 dark:bg-white hover:bg-indigo-700 dark:hover:bg-zinc-200 text-white dark:text-black border border-indigo-500/50 dark:border-zinc-300 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-1.5"
                    title="Chỉnh sửa toàn bộ trang này"
                >
                    <Pencil className="h-3 w-3" />
                    <span className="text-[10px] font-bold tracking-tight">Sửa Trang</span>
                </Button>
            </Link>
        </div>
    );
}
