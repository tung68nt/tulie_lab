'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Search, Check } from 'lucide-react';

export function CourseFilter() {
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
            .then((res: any) => setCategories(Array.isArray(res) ? res : []))
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
        { value: '', label: 'Tất cả' },
        { value: 'BEGINNER', label: 'Cơ bản' },
        { value: 'INTERMEDIATE', label: 'Trung cấp' },
        { value: 'ADVANCED', label: 'Nâng cao' },
    ];

    const priceOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'free', label: 'Miễn phí' },
        { value: 'paid', label: 'Trả phí' },
    ];

    const FilterItem = ({ isSelected, label, onClick }: { isSelected: boolean; label: string; onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
        >
            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-foreground border-foreground' : 'border-muted-foreground/50'
                }`}>
                {isSelected && <Check className="w-3 h-3 text-background" />}
            </span>
            {label}
        </button>
    );

    return (
        <div className="w-full md:w-64 shrink-0 space-y-6">
            {/* Search */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Tìm kiếm</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm khóa học..."
                        className="w-full h-10 pl-10 pr-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Danh mục</label>
                <div className="space-y-1">
                    <FilterItem isSelected={category === ''} label="Tất cả danh mục" onClick={() => updateFilter('category', '')} />
                    {categories.map((cat) => (
                        <FilterItem key={cat.id} isSelected={category === cat.id} label={cat.name} onClick={() => updateFilter('category', cat.id)} />
                    ))}
                </div>
            </div>

            {/* Level */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Trình độ</label>
                <div className="space-y-1">
                    {levelOptions.map((opt) => (
                        <FilterItem key={opt.value} isSelected={level === opt.value} label={opt.label} onClick={() => updateFilter('level', opt.value)} />
                    ))}
                </div>
            </div>

            {/* Price */}
            <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Mức giá</label>
                <div className="space-y-1">
                    {priceOptions.map((opt) => (
                        <FilterItem key={opt.value} isSelected={price === opt.value} label={opt.label} onClick={() => updateFilter('price', opt.value)} />
                    ))}
                </div>
            </div>

            {/* Clear all filters */}
            {(category || level || price || search) && (
                <button
                    onClick={() => router.push('/courses')}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                >
                    Xóa tất cả bộ lọc
                </button>
            )}
        </div>
    );
}
