'use client';

import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { DollarSign } from 'lucide-react';

export default function RevenuePage() {
    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Doanh thu"
                subtitle="Báo cáo doanh thu và thống kê tài chính"
                icon={<DollarSign className="w-8 h-8" />}
            />
            <div className="p-12 text-center text-muted-foreground border rounded-lg bg-muted/10">
                Tính năng đang được phát triển.
            </div>
        </div>
    );
}
