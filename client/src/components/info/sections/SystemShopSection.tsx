'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { cn } from '@/lib/utils';
import { Search, Filter, X, Calculator, Users, TrendingUp, Briefcase, Palette, Folder, Layout, Code, Key, Zap, Package, Layers } from 'lucide-react';
import { Section } from '@/types/sections';
import { SectionTag } from '@/components/SectionTag';
import { SectionBackground } from '../SectionBackground';
import { Product, Order, User, ApiResponse } from '@/types/api';

const CATEGORIES = [
    { id: 'all', label: 'Tất cả lĩnh vực' },
    { id: 'ACCOUNTING', label: 'Kế toán (Accounting)' },
    { id: 'HR', label: 'Nhân sự (HR)' },
    { id: 'MARKETING', label: 'Marketing' },
    { id: 'BUSINESS', label: 'Kinh doanh (Business)' },
    { id: 'CREATIVE', label: 'Sáng tạo (Creative)' },
    { id: 'OTHER', label: 'Khác' },
];

const PRODUCT_TYPES = [
    { id: 'all', label: 'Tất cả loại hình', icon: <Layers className="w-4 h-4" /> },
    { id: 'TEMPLATE', label: 'Template', icon: <Layout className="w-4 h-4" /> },
    { id: 'APP', label: 'Apps Script', icon: <Code className="w-4 h-4" /> },
    { id: 'LICENSE', label: 'License Key', icon: <Key className="w-4 h-4" /> },
    { id: 'SUBSCRIPTION', label: 'Subscription', icon: <Zap className="w-4 h-4" /> },
];

export const SystemShopSection = ({ section }: { section: Section }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [ownedProductIds, setOwnedProductIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.products.list({ isPublished: true }) as ApiResponse<Product[]>;
                setProducts(res.data || []);

                try {
                    const profile = await api.users.getProfile() as User;
                    if (profile) {
                        const orders = await api.users.getMyOrders() as Order[];
                        const ownedIds = new Set<string>();
                        orders.forEach((o: Order) => {
                            if (o.status === 'PAID' || o.status === 'COMPLETED') {
                                if (o.items) {
                                    (o.items as Array<{ productId: string }>).forEach(i => {
                                        if (i.productId) ownedIds.add(String(i.productId));
                                    });
                                }
                                if (o.products) {
                                    (o.products as Array<{ id: string }>).forEach(p => ownedIds.add(String(p.id)));
                                }
                            }
                        });
                        setOwnedProductIds(ownedIds);
                    }
                } catch (e) {
                    // Not logged in or error
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(String(product.field || ''));
            const matchType = selectedTypes.length === 0 || selectedTypes.includes(String(product.type || ''));
            const matchSearch = searchQuery === '' ||
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description as string || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchCategory && matchType && matchSearch;
        });
    }, [products, selectedCategories, selectedTypes, searchQuery]);

    const getFieldIcon = (id: string | null) => {
        switch (id) {
            case 'ACCOUNTING': return <Calculator className="w-4 h-4" />;
            case 'HR': return <Users className="w-4 h-4" />;
            case 'MARKETING': return <TrendingUp className="w-4 h-4" />;
            case 'BUSINESS': return <Briefcase className="w-4 h-4" />;
            case 'CREATIVE': return <Palette className="w-4 h-4" />;
            default: return <Folder className="w-4 h-4" />;
        }
    };

    const getTypeIcon = (type: string | null) => {
        switch (type) {
            case 'TEMPLATE': return <Layout className="w-4 h-4" />;
            case 'APP': return <Code className="w-4 h-4" />;
            case 'LICENSE': return <Key className="w-4 h-4" />;
            case 'SUBSCRIPTION': return <Zap className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-muted-foreground animate-pulse">Đang tải cửa hàng...</p>
            </div>
        );
    }

    return (
        <section className="py-10 md:py-16 bg-background relative overflow-hidden">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme || 'light'}
                overlayOpacity={section.overlayOpacity}
                showDotPattern={true}
            />
            <div className="container relative z-10 px-6 max-w-[1200px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Sidebar Filter - Desktop & Tablet */}
                    <aside className={`w-full lg:w-72 shrink-0 space-y-8 lg:sticky lg:top-32 lg:self-start ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
                        {/* Search Bar */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground/80 px-2 tracking-tight">Tìm kiếm</h3>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-3.5 h-3.5 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Tìm sản phẩm..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-transparent focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground/80 px-2 tracking-tight">Lĩnh vực</h3>
                            <nav className="flex flex-col gap-0.5">
                                {CATEGORIES.map((cat) => {
                                    const isAll = cat.id === 'all';
                                    const isActive = isAll ? selectedCategories.length === 0 : selectedCategories.includes(cat.id);

                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                if (isAll) {
                                                    setSelectedCategories([]);
                                                } else {
                                                    setSelectedCategories(prev =>
                                                        prev.includes(cat.id)
                                                            ? prev.filter(id => id !== cat.id)
                                                            : [...prev, cat.id]
                                                    );
                                                }
                                            }}
                                            className={cn(
                                                "group flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm transition-all",
                                                isActive
                                                    ? "bg-zinc-200/80 dark:bg-zinc-800 text-foreground font-semibold shadow-sm"
                                                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-7 h-7 rounded-lg border flex items-center justify-center transition-all shrink-0",
                                                isActive ? "bg-black border-black text-white" : "border-muted-foreground/30 text-muted-foreground/60 group-hover:text-foreground"
                                            )}>
                                                {getFieldIcon(cat.id)}
                                            </div>
                                            <span className="truncate">{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Product Types */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground/80 px-2 tracking-tight">Loại hình</h3>
                            <nav className="flex flex-col gap-0.5">
                                {PRODUCT_TYPES.map((type) => {
                                    const isAll = type.id === 'all';
                                    const isActive = isAll ? selectedTypes.length === 0 : selectedTypes.includes(type.id);
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                if (isAll) {
                                                    setSelectedTypes([]);
                                                } else {
                                                    setSelectedTypes(prev =>
                                                        prev.includes(type.id)
                                                            ? prev.filter(id => id !== type.id)
                                                            : [...prev, type.id]
                                                    );
                                                }
                                            }}
                                            className={cn(
                                                "group flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm transition-all",
                                                isActive
                                                    ? "bg-zinc-200/80 dark:bg-zinc-800 text-foreground font-semibold shadow-sm"
                                                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-7 h-7 rounded-lg border flex items-center justify-center transition-all shrink-0",
                                                isActive ? "bg-black border-black text-white" : "border-muted-foreground/30 text-muted-foreground/60 group-hover:text-foreground"
                                            )}>
                                                {type.icon}
                                            </div>
                                            <span className="truncate">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Clear Filter Button */}
                        {(selectedCategories.length > 0 || selectedTypes.length > 0 || searchQuery !== '') && (
                            <div className="pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedCategories([]); setSelectedTypes([]); setSearchQuery(''); }}
                                    className="w-full rounded-2xl py-6 text-sm font-bold shadow-sm"
                                >
                                    <X size={16} className="mr-2" />
                                    Xóa tất cả bộ lọc
                                </Button>
                            </div>
                        )}
                    </aside>

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden w-full mb-6">
                        <Button
                            variant="outline"
                            onClick={() => setShowMobileFilter(!showMobileFilter)}
                            className="w-full rounded-2xl py-6 justify-between px-6"
                        >
                            <span className="font-bold text-sm tracking-normal">
                                {showMobileFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc & Tìm kiếm'}
                            </span>
                            <Filter size={16} className={cn("transition-transform", showMobileFilter && "rotate-180")} />
                        </Button>
                    </div>

                    {/* Main Content - Products Grid */}
                    <main className="flex-1 w-full">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-border/50 bg-muted/10">
                                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
                                <p className="text-xl font-bold text-muted-foreground mb-4">Không tìm thấy sản phẩm nào.</p>
                                <Button
                                    onClick={() => { setSelectedCategories([]); setSelectedTypes([]); setSearchQuery(''); }}
                                    className="rounded-full px-8 py-6 font-bold"
                                >
                                    Xóa tất cả bộ lọc
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredProducts.map((product) => {
                                    const isOwned = ownedProductIds.has(product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className="group relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
                                        >
                                            {product.thumbnail && (
                                                <div className="aspect-[16/10] w-full overflow-hidden relative">
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.title}
                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute top-4 right-4 flex gap-2">
                                                        <Badge
                                                            variant="default"
                                                            showDot={false}
                                                            className={cn(
                                                                "border text-xs flex items-center gap-1.5 transition-all shadow-sm",
                                                                section.backgroundTheme === 'dark'
                                                                    ? "bg-black border-white/20 text-white"
                                                                    : "bg-white border-black/10 text-black"
                                                            )}
                                                        >
                                                            {getTypeIcon(product.type)}
                                                            <span className="capitalize">{product.type.toLowerCase()}</span>
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <SectionTag
                                                            variant="primary"
                                                            size="sm"
                                                            showDot={false}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {getFieldIcon(product.field)}
                                                                <span className="capitalize">{product.field.toLowerCase()}</span>
                                                            </div>
                                                        </SectionTag>
                                                    </div>
                                                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-normal text-zinc-900 dark:text-zinc-50">
                                                        {product.title}
                                                    </h3>
                                                    <p className="text-sm line-clamp-2 leading-normal text-zinc-600 dark:text-zinc-400">
                                                        {product.description}
                                                    </p>
                                                </div>

                                                <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-border/50">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-end gap-2">
                                                            {!isOwned ? (
                                                                <>
                                                                    <span className="text-xl font-semibold text-foreground leading-none">
                                                                        {Number(product.price) === 0
                                                                            ? 'Miễn phí'
                                                                            : `${new Intl.NumberFormat('vi-VN').format(Number(product.price))} ₫`}
                                                                    </span>
                                                                    {(Number(product.compareAtPrice) > Number(product.price) && Number(product.compareAtPrice) > 0) && (
                                                                        <span className="text-[11px] font-medium text-red-600 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded leading-none mb-0.5">
                                                                            -{Math.round((1 - Number(product.price) / Number(product.compareAtPrice)) * 100)}%
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                                                                    Đã sở hữu
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {(!isOwned && Number(product.compareAtPrice) > Number(product.price) && Number(product.compareAtPrice) > 0) && (
                                                        <div className="text-xs text-muted-foreground line-through -mt-1">
                                                            {new Intl.NumberFormat('vi-VN').format(Number(product.compareAtPrice))} ₫
                                                        </div>
                                                    )}
                                                    <Link href={`/shop/${product.slug}`} className="w-full">
                                                        <Button as="div" size="sm" variant={isOwned ? "outline" : "default"} className="w-full rounded-xl h-11 font-bold shadow-sm hover:shadow transition-all">
                                                            {isOwned ? 'Xem sản phẩm' : 'Xem chi tiết'}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </section>
    );
};
