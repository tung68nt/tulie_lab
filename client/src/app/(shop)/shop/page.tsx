'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { cn } from '@/lib/utils';
import { Search, Filter, X } from 'lucide-react';

// Categories mapping based on schema ProductField
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
    { id: 'all', label: 'Tất cả loại hình' },
    { id: 'TEMPLATE', label: 'Template' },
    { id: 'APP', label: 'Apps Script' },
    { id: 'LICENSE', label: 'License Key' },
];

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [ownedProductIds, setOwnedProductIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res: any = await api.products.list({ isPublished: true });
                setProducts(res.data || []);

                // Check ownership logic (similar to product detail page)
                try {
                    const profile = await api.users.getProfile() as any;
                    if (profile) {
                        const orders = await api.users.getMyOrders() as any[];
                        const ownedIds = new Set<string>();

                        // Check orders for owned products
                        orders.forEach((o: any) => {
                            if (o.status === 'PAID' || o.status === 'COMPLETED') {
                                if (o.items) {
                                    o.items.forEach((i: any) => {
                                        if (i.productId) ownedIds.add(i.productId);
                                    });
                                }
                                // Also check flattened products if available
                                if (o.products) {
                                    o.products.forEach((p: any) => ownedIds.add(p.id));
                                }
                            }
                        });
                        setOwnedProductIds(ownedIds);
                    }
                } catch (e) {
                    // Not logged in or error fetching profile
                    console.log('User not logged in or error checking ownership');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchCategory = selectedCategory === 'all' || product.field === selectedCategory;
            const matchType = selectedType === 'all' || product.type === selectedType;
            const matchSearch = searchQuery === '' ||
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCategory && matchType && matchSearch;
        });
    }, [products, selectedCategory, selectedType, searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen pt-12 bg-background">
                <div className="container flex flex-col items-center justify-center py-20">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                    <p className="text-muted-foreground animate-pulse">Đang tải cửa hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 md:pt-16 pb-20 bg-background relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:32px_32px] opacity-20 -z-10" />

            <div className="container relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-800 dark:bg-zinc-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-800 dark:bg-white"></span>
                        </span>
                        Tulie Academy Store
                    </div>
                    <h1 className="text-5xl font-bold sm:text-6xl md:text-7xl tracking-tight mb-4">
                        Cửa hàng Trực tuyến
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
                        Khám phá bộ sưu tập website templates, app scripts và tài nguyên được thiết kế chuyên sâu.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Desktop */}
                    <div className="hidden lg:block lg:col-span-1 space-y-8 sticky top-24 h-fit">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full bg-background/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Categories Filter */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg">Danh mục</h3>
                            <div className="flex flex-col gap-1">
                                {CATEGORIES.map(cat => {
                                    const isSelected = selectedCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={cn(
                                                "text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3",
                                                isSelected
                                                    ? "text-foreground font-medium"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <span className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                                                isSelected
                                                    ? "bg-foreground border-foreground"
                                                    : "border-muted-foreground/50"
                                            )}>
                                                {isSelected && <svg className="w-3 h-3 text-background" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                                            </span>
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Types Filter */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg">Loại sản phẩm</h3>
                            <div className="flex flex-col gap-1">
                                {PRODUCT_TYPES.map(type => {
                                    const isSelected = selectedType === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id)}
                                            className={cn(
                                                "text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3",
                                                isSelected
                                                    ? "text-foreground font-medium"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <span className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                                                isSelected
                                                    ? "bg-foreground border-foreground"
                                                    : "border-muted-foreground/50"
                                            )}>
                                                {isSelected && <svg className="w-3 h-3 text-background" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                                            </span>
                                            {type.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filter Button */}
                    <div className="lg:hidden col-span-1">
                        <Button
                            variant="outline"
                            onClick={() => setShowMobileFilter(!showMobileFilter)}
                            className="w-full justify-between"
                        >
                            <span>Bộ lọc & Tìm kiếm</span>
                            <Filter className="w-4 h-4" />
                        </Button>

                        {showMobileFilter && (
                            <div className="mt-4 p-4 border border-border rounded-xl bg-card space-y-6">
                                <div className="space-y-3">
                                    <h3 className="font-bold">Tìm kiếm</h3>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold">Danh mục</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={cn(
                                                    "text-sm px-2 py-1.5 rounded-md border",
                                                    selectedCategory === cat.id ? "border-primary bg-primary/5 text-primary" : "border-border"
                                                )}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold">Loại</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PRODUCT_TYPES.map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => setSelectedType(type.id)}
                                                className={cn(
                                                    "text-sm px-2 py-1.5 rounded-md border",
                                                    selectedType === type.id ? "border-primary bg-primary/5 text-primary" : "border-border"
                                                )}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content - Products Grid */}
                    <div className="lg:col-span-3">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-32 rounded-3xl border border-dashed border-border bg-card/30 backdrop-blur-md">
                                <p className="text-xl text-muted-foreground">Không tìm thấy sản phẩm nào.</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSelectedCategory('all'); setSelectedType('all'); setSearchQuery(''); }}
                                    className="mt-2 text-primary"
                                >
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                                                        <Badge className="bg-background/80 backdrop-blur-md border border-white/20 text-foreground py-1 px-2.5 text-xs">
                                                            {product.type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/30 shadow-sm">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                            </svg>
                                                            {product.field}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-normal">
                                                        {product.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-normal">
                                                        {product.description}
                                                    </p>
                                                </div>

                                                <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-border/50">
                                                    {/* Price Section */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-end gap-2">
                                                            {!isOwned ? (
                                                                <>
                                                                    <span className="text-xl font-semibold text-foreground leading-none">
                                                                        {product.price === 0 || product.price === '0'
                                                                            ? 'Miễn phí'
                                                                            : `${new Intl.NumberFormat('vi-VN').format(product.price)} ₫`}
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
                                                            {new Intl.NumberFormat('vi-VN').format(product.compareAtPrice)} ₫
                                                        </div>
                                                    )}
                                                    <Link href={`/shop/${product.slug}`} className="w-full">
                                                        <Button as="div" size="sm" variant={isOwned ? "outline" : "default"} className="w-full rounded-lg font-medium shadow-sm hover:shadow transition-all">
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
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mt-32 mb-16">
                <div className="relative rounded-3xl bg-[#141414] p-12 md:p-16 overflow-hidden text-center md:text-left border border-white/5 shadow-2xl">
                    {/* Faded Dot Grid Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-dot-white [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]"></div>
                    </div>

                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-primary/10 blur-3xl opacity-20" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-primary/5 blur-2xl opacity-20" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl text-left">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-[1.4] tracking-tight">
                                Bạn cần giải pháp <br /> <span className="text-white/40">thiết kế riêng biệt?</span>
                            </h2>
                            <p className="text-lg text-white/60 md:text-xl leading-relaxed mb-0">
                                Đội ngũ chuyên gia tại Tulie Academy sẵn sàng tư vấn và xây dựng giải pháp tối ưu nhất.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                            <Link href="/contact">
                                <Button as="div" size="lg" className="rounded-2xl h-14 px-10 text-base font-bold bg-white !text-black hover:bg-zinc-200 border-none transition-all shadow-xl">
                                    Liên hệ tư vấn
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
