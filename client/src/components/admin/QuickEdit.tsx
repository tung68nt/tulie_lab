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
        <div className="fixed top-24 right-6 z-50 animate-in fade-in slide-in-from-right-4 duration-500 group">
            <Link href={editUrl}>
                <Button
                    size="lg"
                    className="h-10 px-4 rounded-full shadow-2xl bg-black/80 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
                    title="Chỉnh sửa toàn bộ trang này"
                >
                    <Pencil className="h-4 w-4" />
                    <span className="text-xs font-semibold">Sửa Trang</span>
                </Button>
            </Link>
        </div>
    );
}
