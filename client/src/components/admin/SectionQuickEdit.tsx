'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SectionQuickEditProps {
    pageId: string;
    sectionId: string;
    className?: string;
}

export function SectionQuickEdit({ pageId, sectionId, className }: SectionQuickEditProps) {
    const { isAdmin, isLoading } = useAuth();
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        if (!isLoading && isAdmin) {
            setShouldShow(true);
        }
    }, [isLoading, isAdmin]);

    if (!shouldShow) return null;

    return (
        <div className={`absolute top-4 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${className || ''}`}>
            <Link href={`/admin/landing-pages/${pageId}?sectionId=${sectionId}`}>
                <Button
                    size="sm"
                    className="h-8 rounded-full shadow-lg bg-indigo-600 dark:bg-white hover:bg-indigo-700 dark:hover:bg-zinc-200 text-white dark:text-black border border-indigo-500/50 dark:border-zinc-300 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-1.5 px-3"
                    title="Chỉnh sửa phần này"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Pencil className="h-3 w-3" />
                    <span className="text-[12px] font-medium tracking-tight">Sửa section</span>
                </Button>
            </Link>
        </div>
    );
}
