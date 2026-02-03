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
    icon?: React.ReactNode;
}

export function AdminPageHeader({ title, subtitle, backUrl, children, className, icon }: AdminPageHeaderProps) {
    return (
        <div className={cn("mb-8 pt-2", className)}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    {backUrl && (
                        <Link href={backUrl}>
                            <Button as="div" variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                    )}

                    <div className="flex items-start gap-4">
                        {icon && <div className="shrink-0 mt-1">{icon}</div>}
                        <div className="flex flex-col gap-1">
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-muted-foreground text-base">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {children && (
                    <div className="flex items-center gap-3 shrink-0 md:mt-1">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
