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
                    className="h-8 rounded-full shadow-lg bg-indigo-600/90 hover:bg-indigo-700 text-white text-xs px-3 border border-white/20 backdrop-blur-sm"
                    title="Chỉnh sửa phần này"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Pencil className="h-3 w-3 mr-1" /> Sửa
                </Button>
            </Link>
        </div>
    );
}
