import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    backUrl?: string;
    children?: React.ReactNode;
    className?: string;
}

export function AdminPageHeader({ title, subtitle, backUrl, children, className }: AdminPageHeaderProps) {
    return (
        <div className={cn("space-y-6 mb-8", className)}>
            {/* Back Button Row */}
            {backUrl && (
                <div>
                    <Link href={backUrl}>
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft size={16} /> Quay lại
                        </Button>
                    </Link>
                </div>
            )}

            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                    {subtitle && (
                        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>

                {children && (
                    <div className="flex items-center gap-3 shrink-0">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
