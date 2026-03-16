import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin w-12 h-12 text-primary " />
            <p className="text-sm font-medium text-zinc-500 animate-pulse">Đang tải dữ liệu...</p>
        </div>
    );
};
