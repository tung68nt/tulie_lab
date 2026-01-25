'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Search, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

function CourseFilterInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState<any[]>([]);

    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const price = searchParams.get('price') || '';
    const search = searchParams.get('search') || '';

    const [searchValue, setSearchValue] = useState(search);

    useEffect(() => {
        api.categories.list()
            .then((res: any) => setCategories(res.data || []))
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

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'ALL') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/courses?${params.toString()}`);
    };

    const levelOptions = [
        { value: '', label: 'Tất cả trình độ' },
        { value: 'BEGINNER', label: 'Cơ bản' },
        { value: 'INTERMEDIATE', label: 'Trung cấp' },
        { value: 'ADVANCED', label: 'Nâng cao' },
    ];

    const priceOptions = [
        { value: '', label: 'Tất cả mức giá' },
        { value: 'free', label: 'Miễn phí' },
        { value: 'paid', label: 'Trả phí' },
    ];

    const FilterItem = ({ isSelected, label, onClick }: { isSelected: boolean; label: string; onClick: () => void }) => (
        <button
            onClick={onClick}
            className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all",
                isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
        >
            <span className="truncate">{label}</span>
            <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                isSelected ? "bg-white/20" : "bg-muted group-hover:bg-muted-foreground/20"
            )}>
                <ChevronRight size={10} />
            </div>
        </button>
    );

    return (
        <aside className="w-full md:w-72 shrink-0 space-y-10 md:sticky md:top-24 md:self-start">
            {/* Search */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Tìm kiếm</h3>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm khóa học..."
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/30 border border-transparent focus:bg-background focus:border-primary/30 focus:ring-8 focus:ring-primary/5 transition-all text-sm outline-none"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Danh mục</h3>
                <nav className="flex flex-col gap-1.5">
                    <FilterItem isSelected={category === ''} label="Tất cả danh mục" onClick={() => updateFilter('category', '')} />
                    {categories.map((cat) => (
                        <FilterItem key={cat.id} isSelected={category === cat.id} label={cat.name} onClick={() => updateFilter('category', cat.id)} />
                    ))}
                </nav>
            </div>

            {/* Level */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Trình độ</h3>
                <nav className="flex flex-col gap-1.5">
                    {levelOptions.map((opt) => (
                        <FilterItem key={opt.value} isSelected={level === opt.value} label={opt.label} onClick={() => updateFilter('level', opt.value)} />
                    ))}
                </nav>
            </div>

            {/* Price */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Mức giá</h3>
                <nav className="flex flex-col gap-1.5">
                    {priceOptions.map((opt) => (
                        <FilterItem key={opt.value} isSelected={price === opt.value} label={opt.label} onClick={() => updateFilter('price', opt.value)} />
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
