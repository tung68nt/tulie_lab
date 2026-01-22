'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useToast } from '@/contexts/ToastContext';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { addToast } = useToast();
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
        <div className="min-h-screen pt-24 pb-20 bg-background relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[128px] -z-10" />
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[128px] -z-10" />

            <div className="container px-4 mx-auto relative z-10">
                {/* Breadcrumbs */}
                <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group">
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
                                    <Badge className="bg-background/80 backdrop-blur-md border border-white/20 text-foreground py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider">
                                        {product.type}
                                    </Badge>
                                    <Badge className="bg-primary/90 text-white border-0 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md">
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
                                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                                            selectedMediaIndex === index
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
                        {/* Title & Price Section */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-4xl font-semibold leading-normal text-foreground">
                                    {product.title}
                                </h1>
                                <p className="text-base text-muted-foreground leading-normal">
                                    {product.description}
                                </p>
                            </div>

                            {/* Price Display */}
                            <div className="flex items-end gap-4 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                                {isOwned ? (
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-full bg-green-500/10">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Trạng thái</div>
                                            <div className="text-xl font-semibold text-green-600">Đã sở hữu</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-muted-foreground mb-2">Giá bán</div>
                                        <div className="flex items-baseline gap-3">
                                            <div className="text-4xl font-semibold text-primary">
                                                {product.price > 0 ? (
                                                    <>
                                                        {new Intl.NumberFormat('vi-VN').format(product.price)}
                                                        <span className="text-xl ml-1">đ</span>
                                                    </>
                                                ) : (
                                                    <span className="text-green-600">Miễn phí</span>
                                                )}
                                            </div>
                                            {product.compareAtPrice && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-base text-muted-foreground line-through">
                                                        {new Intl.NumberFormat('vi-VN').format(product.compareAtPrice)}đ
                                                    </span>
                                                    <span className="text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                                                        -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Area */}
                        <div className="space-y-6">
                            {(isOwned || isMember) ? (
                                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                                    <h3 className="text-xl font-bold mb-4">Tải xuống tài nguyên</h3>

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
                                    ) : (
                                        // Fallback for Products without versions (Legacy)
                                        product.fileUrl ? (
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
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Link href={`/checkout?productId=${product.id}`}>
                                        <Button as="div" size="lg" className="w-full text-lg h-16 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 font-bold">
                                            Sở hữu ngay
                                        </Button>
                                    </Link>
                                    {product.previewUrl && (
                                        <a href={product.previewUrl} target="_blank" rel="noopener noreferrer">
                                            <Button as="div" variant="outline" size="lg" className="w-full text-lg h-16 rounded-2xl border-2 hover:bg-secondary font-bold">
                                                Xem bản demo
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Subscription Upsell */}
                            {!isMember && !isOwned && (
                                <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="font-semibold text-base">Gói Thành viên Năm</h3>
                                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 font-semibold text-xs px-2 py-0.5 shrink-0">Best Value</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3 leading-normal">
                                        Truy cập và tải không giới hạn toàn bộ kho tài nguyên (Templates, Apps Script) chỉ với <span className="font-semibold text-foreground">1.990.000đ/năm</span>.
                                    </p>
                                    <div className="flex flex-col gap-1.5 mb-3">
                                        <div className="flex items-center gap-2 text-xs">
                                            <svg className="w-3.5 h-3.5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            <span>Tải không giới hạn sản phẩm số</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <svg className="w-3.5 h-3.5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            <span>Tiết kiệm 80% so với mua lẻ</span>
                                        </div>
                                    </div>
                                    <Link href="/pricing" className="block">
                                        <Button as="div" size="sm" className="w-full font-semibold">
                                            Đăng ký Hội viên ngay
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {/* Value Propositions */}
                            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border">
                                {[
                                    { title: "Trọn đời", desc: "Mua một lần dùng mãi mãi", icon: "💎" },
                                    { title: "Cập nhật", desc: "Update miễn phí trọn đời", icon: "✨" },
                                    { title: "Hỗ trợ", desc: "Hỗ trợ cài đặt kỹ thuật", icon: "🛠️" }
                                ].map((item, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors group/item">
                                        <div className="text-2xl mb-1 grayscale group-hover/item:grayscale-0 transition-all">{item.icon}</div>
                                        <div className="font-semibold text-sm mb-0.5">{item.title}</div>
                                        <div className="text-xs text-muted-foreground leading-snug">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Content Section */}
                {product.detailedContent && (
                    <div className="mt-20 max-w-4xl mx-auto">
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
