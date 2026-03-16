'use client';

import React from 'react';
import { Button } from '@/components/Button';
import {  Eye, Save, X , Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminStickyFooterProps {
    onSave: () => void;
    onCancel: () => void;
    onViewLive?: () => void;
    isDirty?: boolean;
    isSaving?: boolean;
    className?: string;
}

export function AdminStickyFooter({
    onSave,
    onCancel,
    onViewLive,
    isDirty = true,
    isSaving = false,
    className
}: AdminStickyFooterProps) {
    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300",
            className
        )}>
            <div className="bg-card/80 backdrop-blur-xl border border-border rounded-full shadow-2xl px-2 py-2 flex items-center gap-2 max-w-fit mx-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="rounded-full text-muted-foreground hover:text-foreground px-4"
                >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                </Button>

                {onViewLive && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onViewLive}
                        className="rounded-full border-border px-4"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem thực tế
                    </Button>
                )}

                <Button
                    variant="default"
                    size="sm"
                    onClick={onSave}
                    disabled={isSaving || !isDirty}
                    className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    {isSaving ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin w-4 h-4 text-white " />
                            Đang lưu...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Lưu thay đổi
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}
