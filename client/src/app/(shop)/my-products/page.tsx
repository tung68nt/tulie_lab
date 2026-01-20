
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import Link from 'next/link';

export default function MyProductsPage() {
    const [user, setUser] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const profile: any = await api.users.getProfile();
                // Filter orders to find purchased products
                const purchasedProducts: any[] = [];
                if (profile) {
                    setUser(profile);
                }
                if (profile && profile.orders) {
                    profile.orders.forEach((order: any) => {
                        if (order.status === 'PAID' || order.status === 'COMPLETED') {
                            if (order.products) {
                                order.products.forEach((p: any) => {
                                    // Check uniqueness if needed, or just push
                                    if (!purchasedProducts.find(existing => existing.id === p.id)) {
                                        purchasedProducts.push(p);
                                    }
                                });
                            }
                        }
                    });
                }
                setProducts(purchasedProducts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 container">
                <div className="space-y-4">
                    <div className="h-8 w-1/3 bg-muted animate-pulse rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container px-4 mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Sản phẩm số của tôi</h1>
                    <p className="text-muted-foreground mt-2">Quản lý và tải xuống các tài nguyên bạn đã sở hữu</p>
                </div>

                {/* Subscription Status */}
                <div className="mb-10 p-6 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-full ${user?.subscriptions?.some((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date()) ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/20' : 'bg-muted'}`}>
                            {user?.subscriptions?.some((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date()) ? (
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : (
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">
                                {user?.subscriptions?.some((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date()) ? 'Thành viên Premium' : 'Tài khoản thường'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {user?.subscriptions?.find((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date())
                                    ? `Hạn sử dụng: ${new Date(user.subscriptions.find((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date()).endDate).toLocaleDateString('vi-VN')}`
                                    : 'Nâng cấp để tải không giới hạn tài nguyên.'}
                            </p>
                        </div>
                    </div>
                    {(!user?.subscriptions?.some((s: any) => s.status === 'ACTIVE' && new Date(s.endDate) > new Date())) && (
                        <Link href="/pricing">
                            <Button as="div" variant="default" className="shadow-lg shadow-primary/25">Nâng cấp ngay</Button>
                        </Link>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-card/50">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                            <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Chưa có sản phẩm nào</h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Bạn chưa mua sản phẩm số nào. Hãy khám phá kho tài nguyên chất lượng cao của chúng tôi.</p>
                        <Link href="/shop">
                            <Button as="div" size="lg" className="rounded-xl font-bold shadow-lg shadow-primary/25">Khám phá Cửa hàng</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({ product }: { product: any }) {
    const hasVersions = product.versions && product.versions.length > 0;
    const [selectedVersionId, setSelectedVersionId] = useState<string>(
        hasVersions ? product.versions[0].id : ''
    );

    const selectedVersion = hasVersions
        ? product.versions.find((v: any) => v.id === selectedVersionId)
        : null;

    const downloadUrl = selectedVersion ? selectedVersion.fileUrl : product.fileUrl;
    const versionLabel = selectedVersion ? `v${selectedVersion.version}` : '';

    return (
        <div className="group rounded-3xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col">
            <div className="aspect-video bg-muted relative overflow-hidden">
                {product.thumbnail ? (
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
                        <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="bg-background/90 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-lg shadow-sm border border-border/50">
                        {product.type || 'DIGITAL PRODUCT'}
                    </span>
                </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]">{product.title}</h3>
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>Đã sở hữu trọn đời</span>
                </div>

                <div className="mt-auto space-y-3">
                    {hasVersions && (
                        <div>
                            <select
                                className="w-full p-2 rounded-xl border bg-background text-sm"
                                value={selectedVersionId}
                                onChange={(e) => setSelectedVersionId(e.target.value)}
                            >
                                {product.versions.map((v: any) => (
                                    <option key={v.id} value={v.id}>
                                        Phiên bản {v.version} ({new Date(v.createdAt).toLocaleDateString('vi-VN')})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <a href={downloadUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button as="div" className="w-full font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Tải {versionLabel}
                            </Button>
                        </a>
                        <Link href={`/shop/${product.slug}`}>
                            <Button as="div" variant="outline" className="px-3 rounded-xl border-2 hover:bg-secondary">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
