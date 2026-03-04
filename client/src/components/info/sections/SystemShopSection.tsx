'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { Search, Filter, X, Calculator, Users, TrendingUp, Briefcase, Palette, Folder, Layout, Code, Key, Zap, Package, Layers, FileText, Image, Video, Music, Globe, Smartphone, Database, Settings, Star, Heart, ShoppingCart, Tag, Bookmark, Award, Gift, Target, Lightbulb, Rocket } from 'lucide-react';
import { Section } from '@/types/sections';
import { SectionTag } from '@/components/SectionTag';
import { SectionBackground } from '../SectionBackground';
import { Product, Order, User, ApiResponse } from '@/types/api';

// Icon mapping from icon name to component
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Calculator, Users, TrendingUp, Briefcase, Palette, Folder, Layout, Code, Key, Zap, Package, Layers,
    FileText, Image, Video, Music, Globe, Smartphone, Database, Settings, Star, Heart, ShoppingCart,
    Tag, Bookmark, Award, Gift, Target, Lightbulb, Rocket
};

interface Classification {
    id: string;
    name: string;
    type: 'PRODUCT_TYPE' | 'PRODUCT_FIELD';
    icon?: string;
    isActive: boolean;
}

export const SystemShopSection = ({ section }: { section: Section }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [ownedProductIds, setOwnedProductIds] = useState<Set<string>>(new Set());

    // Dynamic classifications from database
    const [productTypes, setProductTypes] = useState<Classification[]>([]);
    const [productFields, setProductFields] = useState<Classification[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products and classifications in parallel
                const [productsRes, classificationsRes]: any = await Promise.all([
                    api.products.list({ isPublished: true }),
                    api.products.listClassifications()
                ]);

                setProducts(productsRes?.data || []);

                // Separate classifications by type
                const classifications = classificationsRes || [];
                setProductTypes(classifications.filter((c: Classification) => c.type === 'PRODUCT_TYPE' && c.isActive));
                setProductFields(classifications.filter((c: Classification) => c.type === 'PRODUCT_FIELD' && c.isActive));

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

        fetchData();
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

    // Get icon component from icon name
    const getIconComponent = (iconName: string | undefined | null) => {
        const IconComp = iconName && ICON_MAP[iconName] ? ICON_MAP[iconName] : Folder;
        return <IconComp className="w-4 h-4" />;
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
        <section className="py-10 md:py-16 bg-background relative">
            <div className="absolute inset-0 overflow-hidden">
                <SectionBackground
                    backgroundImage={section.backgroundImage}
                    backgroundTheme={section.backgroundTheme || 'light'}
                    overlayOpacity={section.overlayOpacity}
                showDotPattern={section.showDotPattern}
                backgroundPattern={section.backgroundPattern}
                />
            </div>
            <div className="container relative z-10 px-6 max-w-[1200px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Sidebar Filter - Desktop & Tablet */}
                    <aside className={`w-full lg:w-72 shrink-0 space-y-8 lg:sticky lg:top-32 lg:self-start ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
                        {/* Search Bar */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground/80 px-2">Tìm kiếm</h3>
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

                        {/* Categories List - Dynamic from DB */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground/80 px-2">Lĩnh vực</h3>
                            <nav className="flex flex-col gap-0.5">
                                {/* All option */}
                                <button
                                    onClick={() => setSelectedCategories([])}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm transition-all",
                                        selectedCategories.length === 0
                                            ? "bg-zinc-200/80 dark:bg-zinc-800 text-foreground font-semibold shadow-sm"
                                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "w-7 h-7 rounded-lg border flex items-center justify-center transition-all shrink-0",
                                        selectedCategories.length === 0 ? "bg-black border-black text-white" : "border-muted-foreground/30 text-muted-foreground/60 group-hover:text-foreground"
                                    )}>
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <span className="truncate">Tất cả lĩnh vực</span>
                                </button>

                                {productFields.map((field) => {
                                    const isActive = selectedCategories.includes(field.name);
                                    return (
                                        <button
                                            key={field.id}
                                            onClick={() => {
                                                setSelectedCategories(prev =>
                                                    prev.includes(field.name)
                                                        ? prev.filter(id => id !== field.name)
                                                        : [...prev, field.name]
                                                );
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
                                                {getIconComponent(field.icon)}
                                            </div>
                                            <span className="truncate">{field.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Product Types - Dynamic from DB */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground/80 px-2">Loại hình</h3>
                            <nav className="flex flex-col gap-0.5">
                                {/* All option */}
                                <button
                                    onClick={() => setSelectedTypes([])}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm transition-all",
                                        selectedTypes.length === 0
                                            ? "bg-zinc-200/80 dark:bg-zinc-800 text-foreground font-semibold shadow-sm"
                                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "w-7 h-7 rounded-lg border flex items-center justify-center transition-all shrink-0",
                                        selectedTypes.length === 0 ? "bg-black border-black text-white" : "border-muted-foreground/30 text-muted-foreground/60 group-hover:text-foreground"
                                    )}>
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <span className="truncate">Tất cả loại hình</span>
                                </button>

                                {productTypes.map((type) => {
                                    const isActive = selectedTypes.includes(type.name);
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                setSelectedTypes(prev =>
                                                    prev.includes(type.name)
                                                        ? prev.filter(id => id !== type.name)
                                                        : [...prev, type.name]
                                                );
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
                                                {getIconComponent(type.icon)}
                                            </div>
                                            <span className="truncate">{type.name}</span>
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
                                    // Find matching type/field from classifications
                                    const productType = productTypes.find(t => t.name === product.type);
                                    const productField = productFields.find(f => f.name === product.field);

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
                                                        <SectionTag
                                                            variant="default"
                                                            showDot={false}
                                                            size="sm"
                                                            animate={false}
                                                            className={cn(
                                                                "border flex items-center gap-1.5 transition-all shadow-sm pointer-events-none",
                                                                section.backgroundTheme === 'dark'
                                                                    ? "bg-black border-white/20 text-white"
                                                                    : "bg-white border-black/10 text-black"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-1.5">
                                                                {getIconComponent(productType?.icon)}
                                                                <span className="capitalize">{product.type?.toLowerCase() || 'unknown'}</span>
                                                            </div>
                                                        </SectionTag>
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
                                                                {getIconComponent(productField?.icon)}
                                                                <span className="capitalize">{product.field?.toLowerCase() || 'other'}</span>
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
                                                                    <span className="text-xl font-semibold text-zinc-950 dark:text-white leading-none flex items-baseline gap-0.5">
                                                                        {Number(product.price) === 0
                                                                            ? 'Miễn phí'
                                                                            : <>{new Intl.NumberFormat('vi-VN').format(Number(product.price))}<sup className="text-[10px] ml-0.5">đ</sup></>}
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
                                                    {Boolean(!isOwned && Number(product.compareAtPrice) > Number(product.price) && Number(product.compareAtPrice) > 0) && (
                                                        <div className="text-xs text-muted-foreground line-through -mt-1 flex items-baseline gap-0.5">
                                                            {new Intl.NumberFormat('vi-VN').format(Number(product.compareAtPrice))}<sup className="text-[8px]">đ</sup>
                                                        </div>
                                                    )}
                                                    <Link href={`/shop/${product.slug}`} className="w-full block">
                                                        <Button size="sm" variant={isOwned ? "outline" : "default"} className="w-full rounded-xl h-11 font-bold shadow-sm hover:shadow transition-all pointer-events-none">
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
