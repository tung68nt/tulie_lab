import { Button } from '@/components/Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({ currentPage, totalPages, totalItems, onPageChange, className = '' }: PaginationProps) {
    if (totalPages <= 1 && !totalItems) return null;

    return (
        <div className={`flex items-center justify-between gap-4 w-full py-2 ${className}`}>
            <div className="text-sm font-medium text-zinc-500">
                Trang {currentPage} / {totalPages} {totalItems !== undefined && `(${totalItems} bản ghi)`}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-12 w-12 p-0 rounded-xl border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"
                    title="Trang trước"
                >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-12 w-12 p-0 rounded-xl border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"
                    title="Trang sau"
                >
                    <ChevronRight size={24} strokeWidth={2.5} />
                </Button>
            </div>
        </div>
    );
}
