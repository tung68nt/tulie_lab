'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { cn } from '@/lib/utils';
import { Search, Filter, X, ChevronRight } from 'lucide-react';
import { SectionTag } from '@/components/SectionTag';

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
                    <SectionTag>
                        Tulie Academy Store
                    </SectionTag>
                    <h1 className="text-5xl font-bold sm:text-6xl md:text-7xl tracking-tight mb-4">
                        Cửa hàng Trực tuyến
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
                        Khám phá bộ sưu tập website templates, app scripts và tài nguyên được thiết kế chuyên sâu.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filter - Desktop & Tablet */}
                    <aside className={`w-full lg:w-72 shrink-0 space-y-10 lg:sticky lg:top-24 lg:self-start ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
                        {/* Search Bar */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Tìm kiếm</h3>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Tìm sản phẩm..."
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted/30 border border-transparent focus:bg-background focus:border-primary/30 focus:ring-8 focus:ring-primary/5 transition-all text-sm outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Lĩnh vực</h3>
                            <nav className="flex flex-col gap-1.5">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={cn(
                                            "group flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all",
                                            selectedCategory === cat.id
                                                ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <span className="truncate">{cat.label}</span>
                                        <div className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                            selectedCategory === cat.id ? "bg-white/20" : "bg-muted group-hover:bg-muted-foreground/20"
                                        )}>
                                            <ChevronRight size={10} />
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Product Types */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Loại hình</h3>
                            <nav className="flex flex-col gap-1.5">
                                {PRODUCT_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={cn(
                                            "group flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all",
                                            selectedType === type.id
                                                ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <span className="truncate">{type.label}</span>
                                        <div className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                                            selectedType === type.id ? "bg-white/20" : "bg-muted group-hover:bg-muted-foreground/20"
                                        )}>
                                            <ChevronRight size={10} />
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Clear Filter Button */}
                        {(selectedCategory !== 'all' || selectedType !== 'all' || searchQuery !== '') && (
                            <div className="pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedCategory('all'); setSelectedType('all'); setSearchQuery(''); }}
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
                            <span className="font-bold uppercase tracking-widest text-xs">
                                {showMobileFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc & Tìm kiếm'}
                            </span>
                            <Filter size={16} className={cn("transition-transform", showMobileFilter && "rotate-180")} />
                        </Button>
                    </div>

                    {/* Main Content - Products Grid */}
                    <main className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-32 rounded-[3rem] border-2 border-dashed border-border/50 bg-muted/10">
                                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
                                <p className="text-xl font-bold text-muted-foreground mb-4">Không tìm thấy sản phẩm nào.</p>
                                <Button
                                    onClick={() => { setSelectedCategory('all'); setSelectedType('all'); setSearchQuery(''); }}
                                    className="rounded-full px-8 py-6 font-bold"
                                >
                                    Xóa tất cả bộ lọc
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
                    </main>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mt-32 mb-16">
                <div className="relative rounded-3xl bg-[#141414] p-12 md:p-16 overflow-hidden text-center md:text-left border border-white/5 shadow-2xl">
                    {/* Faded Dot Grid Pattern */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-dot-grid text-white/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]"></div>
                    </div>

                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-primary/10 blur-3xl opacity-20" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-primary/5 blur-2xl opacity-20" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl text-left">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-[1.6] tracking-tight">
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
