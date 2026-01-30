import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-950 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-zinc-500 animate-pulse">Đang tải dữ liệu...</p>
        </div>
    );
};
