'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { Search, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

interface Category {
    id: string;
    name: string;
}

function CourseFilterInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState<Category[]>([]);

    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const price = searchParams.get('price') || '';
    const search = searchParams.get('search') || '';

    const [searchValue, setSearchValue] = useState(search);

    useEffect(() => {
        api.categories.list()
            .then((res: unknown) => {
                const data = res as ApiResponse<Category[]>;
                setCategories(data.data || []);
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== search) {
                updateFilter('search', searchValue);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchValue]);

    const updateFilter = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentValues = params.get(key)?.split(',').filter(Boolean) || [];

        if (value === '' || value === 'ALL') {
            params.delete(key);
        } else {
            if (currentValues.includes(value)) {
                const newValues = currentValues.filter(v => v !== value);
                if (newValues.length > 0) {
                    params.set(key, newValues.join(','));
                } else {
                    params.delete(key);
                }
            } else {
                params.set(key, [...currentValues, value].join(','));
            }
        }
        router.push(`/courses?${params.toString()}`);
    }, [router, searchParams]);

    const isSelected = (key: string, value: string) => {
        const currentValues = searchParams.get(key)?.split(',').filter(Boolean) || [];
        if (value === '') return currentValues.length === 0;
        return currentValues.includes(value);
    };

    const levelOptions = [
        { value: 'BEGINNER', label: 'Cơ bản' },
        { value: 'INTERMEDIATE', label: 'Trung cấp' },
        { value: 'ADVANCED', label: 'Nâng cao' },
    ];

    const priceOptions = [
        { value: 'free', label: 'Miễn phí' },
        { value: 'paid', label: 'Trả phí' },
    ];

    const FilterItem = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
        <button
            onClick={onClick}
            className={cn(
                "group flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm transition-all",
                active
                    ? "bg-muted/50 text-foreground font-bold"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
            )}
        >
            <div className={cn(
                "w-7 h-7 rounded-lg border flex items-center justify-center transition-all",
                active ? "bg-black border-black" : "border-muted-foreground/30"
            )}>
                {active && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className="truncate">{label}</span>
        </button>
    );

    return (
        <aside className="w-full md:w-72 shrink-0 space-y-5 md:sticky md:top-32 md:self-start">
            {/* Search */}
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-muted-foreground/80 px-2">Tìm kiếm</h3>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-3.5 h-3.5 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm khóa học..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-transparent focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm outline-none"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-muted-foreground/80 px-2">Danh mục</h3>
                <nav className="flex flex-col gap-0.5">
                    <FilterItem active={isSelected('category', '')} label="Tất cả danh mục" onClick={() => updateFilter('category', '')} />
                    {categories.map((cat) => (
                        <FilterItem key={cat.id} active={isSelected('category', cat.id)} label={cat.name} onClick={() => updateFilter('category', cat.id)} />
                    ))}
                </nav>
            </div>

            {/* Level */}
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-muted-foreground/80 px-2">Trình độ</h3>
                <nav className="flex flex-col gap-0.5">
                    <FilterItem active={isSelected('level', '')} label="Tất cả trình độ" onClick={() => updateFilter('level', '')} />
                    {levelOptions.map((opt) => (
                        <FilterItem key={opt.value} active={isSelected('level', opt.value)} label={opt.label} onClick={() => updateFilter('level', opt.value)} />
                    ))}
                </nav>
            </div>

            {/* Price */}
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-muted-foreground/80 px-2">Mức giá</h3>
                <nav className="flex flex-col gap-0.5">
                    <FilterItem active={isSelected('price', '')} label="Tất cả mức giá" onClick={() => updateFilter('price', '')} />
                    {priceOptions.map((opt) => (
                        <FilterItem key={opt.value} active={isSelected('price', opt.value)} label={opt.label} onClick={() => updateFilter('price', opt.value)} />
                    ))}
                </nav>
            </div>

            {/* Clear all filters */}
            {(category || level || price || search) && (
                <div className="pt-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/courses')}
                        className="w-full rounded-2xl py-6 text-sm font-bold shadow-sm"
                    >
                        <X size={16} className="mr-2" />
                        Xóa tất cả bộ lọc
                    </Button>
                </div>
            )}
        </aside>
    );
}

export function CourseFilter() {
    return (
        <Suspense fallback={<div className="w-full md:w-64 shrink-0 space-y-6 animate-pulse"><div className="h-10 bg-muted rounded-lg" /></div>}>
            <CourseFilterInner />
        </Suspense>
    );
}
