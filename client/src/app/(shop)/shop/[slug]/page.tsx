'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/contexts/ToastContext';
import { useSettings } from '@/contexts/SettingsContext';
import { MEMBERSHIP_PRICING } from '@/constants/pricing';
import { Sparkles, Wallet, ShieldCheck, Check, MoveRight, Star, Clock, Zap, Info, Copy } from 'lucide-react';

const safeParse = (val: any, fallback: string[]) => {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    try {
        return JSON.parse(val);
    } catch (e) {
        return typeof val === 'string' ? val.split(',').map((s: string) => s.trim()) : fallback;
    }
};

export default function ProductDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const { settings } = useSettings();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);
    const [isOwned, setIsOwned] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState<any>(null);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            try {
                const data: any = await api.products.get(slug as string);
                setProduct(data);
                if (data.versions && data.versions.length > 0) {
                    setSelectedVersion(data.versions[0]);
                }

                // Check user status
                try {
                    const profile = await api.users.getProfile() as any;
                    if (profile) {
                        setIsMember(!!profile.subscriptions?.some((s: any) => s.status === 'ACTIVE'));
                        const orders = await api.users.getMyOrders() as any[];
                        const owned = orders.some((o: any) => o.status === 'PAID' && o.items.some((i: any) => i.productId === data.id));
                        setIsOwned(owned);
                    }
                } catch (e) {
                    console.log('Not logged in');
                }
            } catch (error) {
                console.error(error);
                addToast('Không tìm thấy sản phẩm', 'error');
                router.push('/shop');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug, router, addToast]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 bg-background flex flex-col items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-muted-foreground animate-pulse">Đang tải thông tin sản phẩm...</p>
            </div>
        );
    }

    if (!product) return null;

    // Build media gallery from product data
    // Expecting product.gallery: Array<{type: 'image'|'video', url: string, thumbnail?: string}>
    const mediaGallery = product.gallery || [];
    // Fallback: if no gallery, use thumbnail as first image
    if (mediaGallery.length === 0 && product.thumbnail) {
        mediaGallery.push({ type: 'image', url: product.thumbnail });
    }

    const currentMedia = mediaGallery[selectedMediaIndex] || { type: 'image', url: product.thumbnail };

    return (
        <div className="min-h-screen pt-12 pb-20 bg-background relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[128px] -z-10" />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[128px] -z-10" />

            <div className="container relative z-10">
                {/* Breadcrumbs */}
                <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group">
                    <span className="p-2 rounded-full border border-border group-hover:border-primary/50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </span>
                    <span className="font-medium text-sm">Quay lại cửa hàng</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column - Media Gallery */}
                    <div className="relative space-y-4">
                        {/* Main Media Display */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
                            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden bg-card border border-border shadow-2xl">
                                {currentMedia.type === 'video' ? (
                                    <video
                                        src={currentMedia.url}
                                        controls
                                        className="h-full w-full object-cover"
                                        poster={currentMedia.thumbnail}
                                    />
                                ) : (
                                    <img
                                        src={currentMedia.url || '/placeholder-image.jpg'}
                                        alt={product.title}
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                )}

                                {/* Type overlay */}
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <Badge className="bg-background/80 backdrop-blur-md border border-white/20 text-foreground py-2 px-4 rounded-xl text-xs font-bold">
                                        {product.type}
                                    </Badge>
                                    <Badge className="bg-primary/90 text-white border-0 py-2 px-4 rounded-xl text-xs font-bold backdrop-blur-md">
                                        Premium Asset
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {mediaGallery.length > 1 && (
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                                {mediaGallery.map((media: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedMediaIndex(index)}
                                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedMediaIndex === index
                                            ? 'border-primary ring-2 ring-primary/50 scale-105'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        {media.type === 'video' ? (
                                            <div className="h-full w-full bg-black/80 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                                {media.thumbnail && (
                                                    <img src={media.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                                )}
                                            </div>
                                        ) : (
                                            <img
                                                src={media.url}
                                                alt={`Gallery ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="flex flex-col space-y-8">
                        {/* Title & Description */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                </svg>
                                <span className="text-sm font-semibold text-primary tracking-wide">
                                    {product.field || 'Template'}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">
                                {product.title}
                            </h1>

                            <p className="text-base text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Pricing Section */}
                        <div className="space-y-6">
                            {/* Download Section - Only show if user owns or is member */}
                            {(isOwned || isMember) && (
                                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                                    <h3 className="text-xl font-bold mb-4 text-white">Tải xuống tài nguyên</h3>

                                    {product.versions && product.versions.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex gap-2 p-1 bg-black/20 rounded-lg w-fit flex-wrap">
                                                {product.versions.map((ver: any) => (
                                                    <button
                                                        key={ver.id}
                                                        onClick={() => setSelectedVersion(ver)}
                                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedVersion?.id === ver.id
                                                            ? 'bg-white text-black shadow-lg'
                                                            : 'text-zinc-400 hover:text-white'
                                                            }`}
                                                    >
                                                        v{ver.version}
                                                    </button>
                                                ))}
                                            </div>

                                            {selectedVersion && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="p-4 rounded-lg bg-black/20 text-sm text-zinc-300 border border-white/5">
                                                        <div className="font-bold text-white mb-2 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            Thông tin bản cập nhật
                                                        </div>
                                                        <p className="whitespace-pre-line">{selectedVersion.changelog || 'Không có mô tả chi tiết cho phiên bản này.'}</p>
                                                    </div>

                                                    <a href={selectedVersion.fileUrl} target="_blank" rel="noopener noreferrer">
                                                        <Button as="div" size="lg" className="w-full text-lg h-14 rounded-xl font-bold gap-2">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                            Tải xuống v{selectedVersion.version}
                                                        </Button>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ) : product.fileUrl ? (
                                        <a href={product.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Button as="div" size="lg" className="w-full text-lg h-14 rounded-xl font-bold gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Tải xuống
                                            </Button>
                                        </a>
                                    ) : (
                                        <div className="text-amber-500 p-4 border border-amber-500/20 rounded-lg bg-amber-500/5">
                                            Sản phẩm chưa có file tải lên. Vui lòng liên hệ Admin.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Pricing Options - Only show if user doesn't own and isn't member */}
                            {!isOwned && !isMember && (
                                <div className="space-y-6">
                                    {/* Single Purchase - Retail Block */}
                                    <div className="group relative p-6 rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 flex flex-col md:flex-row items-center gap-6">
                                        <div className="flex-1">
                                            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-bold border border-border whitespace-nowrap shadow-sm">
                                                Mua lẻ (Single)
                                            </div>
                                            <div className="mt-4 flex items-baseline gap-2 mb-2">
                                                <span className="text-3xl font-bold">
                                                    {product.price === 0 || product.price === '0'
                                                        ? 'Miễn phí'
                                                        : `${new Intl.NumberFormat('vi-VN').format(product.price)}đ`}
                                                </span>
                                                {product.compareAtPrice && product.compareAtPrice > product.price && product.price > 0 && (
                                                    <span className="text-sm text-muted-foreground line-through font-medium">
                                                        {new Intl.NumberFormat('vi-VN').format(product.compareAtPrice)}đ
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {settings.pricing_single_description || 'Sở hữu vĩnh viễn template này. Nhận cập nhật trọn đời.'}
                                            </p>
                                        </div>

                                        <div className="w-full md:w-auto min-w-[200px]">
                                            <Link href={`/checkout?productId=${product.id}`}>
                                                <Button as="div" variant="default" className="w-full text-sm font-bold h-12 rounded-xl active:scale-[0.98] transition-all gap-2 shadow-lg shadow-primary/20">
                                                    <Wallet className="w-4 h-4" />
                                                    Sở hữu ngay
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Membership Options - 2 Columns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Membership - Gói Cơ Bản */}
                                        <div className="group relative p-6 rounded-3xl border border-border bg-card flex flex-col h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold border border-border whitespace-nowrap shadow-sm">
                                                Phổ biến
                                            </div>
                                            <div className="mb-6 mt-4">
                                                <h3 className="text-xl font-bold mb-2">{MEMBERSHIP_PRICING.BASIC.title}</h3>
                                                <div className="flex items-baseline gap-1 mb-2">
                                                    <span className="text-3xl font-bold">{settings.pricing_membership_basic_sale || MEMBERSHIP_PRICING.BASIC.priceDisplay}</span>
                                                    <span className="text-sm text-muted-foreground font-medium">{MEMBERSHIP_PRICING.BASIC.period}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{settings.pricing_membership_basic_description || 'Tải không giới hạn tất cả các templates'}</p>
                                            </div>

                                            <Link href="/pricing" className="mt-auto">
                                                <Button as="div" variant="outline" className="w-full text-sm font-bold h-12 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                    Đăng ký gói này
                                                </Button>
                                            </Link>
                                            <div className="mt-6 space-y-2.5 text-[12px]">
                                                {safeParse(settings.pricing_membership_basic_features, ['Tải không giới hạn', 'Tiết kiệm 80%', 'Update hàng tuần']).map((f: string, i: number) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                                        <span className="font-medium">{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Membership - Gói Premium */}
                                        <div className="group relative p-6 rounded-3xl border border-border bg-card flex flex-col h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg whitespace-nowrap">
                                                Best Value
                                            </div>
                                            <div className="mb-6 mt-4">
                                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                                    {MEMBERSHIP_PRICING.PREMIUM.title}
                                                    <span className="text-xl">👑</span>
                                                </h3>
                                                <div className="flex items-baseline gap-1 mb-2">
                                                    <span className="text-3xl font-bold">{settings.pricing_membership_premium_sale || MEMBERSHIP_PRICING.PREMIUM.priceDisplay}</span>
                                                    <span className="text-sm text-muted-foreground font-medium">{MEMBERSHIP_PRICING.PREMIUM.period}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{settings.pricing_membership_premium_description || 'All-in-one + Tư vấn 1-1 trực tiếp'}</p>
                                            </div>

                                            <Link href="/pricing" className="mt-auto">
                                                <Button as="div" variant="outline" className="w-full text-sm font-bold h-12 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                    Nâng cấp Premium
                                                </Button>
                                            </Link>
                                            <div className="mt-6 space-y-2.5 text-[12px]">
                                                {safeParse(settings.pricing_membership_premium_features, ['Tư vấn 1-1 trực tiếp', 'Source code các dự án', 'Hỗ trợ ưu tiên 24/7']).map((f: string, i: number) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                                        <span className="font-medium">{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preview Demo Button */}
                            {(!isOwned && !isMember && product.previewUrl) && (
                                <div className="mt-6">
                                    <a href={product.previewUrl} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button as="div" variant="outline" className="w-full border-zinc-200 dark:border-zinc-800">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            Xem bản demo
                                        </Button>
                                    </a>
                                </div>
                            )}

                            {/* Value Props - Redesigned with black/white icons */}
                            <div className="space-y-3 pt-4 border-t">
                                {[
                                    {
                                        icon: (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ),
                                        title: 'Sở hữu trọn đời',
                                        description: 'Mua một lần, sử dụng mãi mãi. Không phí ẩn, không phí gia hạn.'
                                    },
                                    {
                                        icon: (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        ),
                                        title: 'Cập nhật miễn phí',
                                        description: 'Nhận tất cả bản cập nhật và tính năng mới hoàn toàn miễn phí.'
                                    },
                                    {
                                        icon: (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        ),
                                        title: 'Hỗ trợ tận tâm',
                                        description: 'Đội ngũ support nhiệt tình, giải đáp mọi thắc mắc của bạn.'
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold mb-1">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Content Section */}
                {product.detailedContent && (
                    <div className="mt-20">
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.detailedContent }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
