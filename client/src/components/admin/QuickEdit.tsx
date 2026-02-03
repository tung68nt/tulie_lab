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
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Link href={editUrl}>
                <Button
                    size="lg"
                    className="h-12 w-12 rounded-full shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white p-0 flex items-center justify-center border-2 border-white/20"
                    title="Chỉnh sửa trang này"
                >
                    <Pencil className="h-5 w-5" />
                </Button>
            </Link>
        </div>
    );
}
