'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    const productId = searchParams.get('productId');
    const activationType = searchParams.get('activationType');
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState<any>(null); // Course or Product
    const [itemType, setItemType] = useState<'COURSE' | 'PRODUCT'>('COURSE');
    const [user, setUser] = useState<any>(null);
    const [promoCode, setPromoCode] = useState('');
    const [validatingPromo, setValidatingPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [processing, setProcessing] = useState(false);
    const [upsellProducts, setUpsellProducts] = useState<any[]>([]);
    const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user
                const profile: any = await api.users.getProfile();
                if (!profile) {
                    router.push('/login?redirect=/checkout');
                    return;
                }
                setUser(profile);

                // Get item (Course or Product)
                if (productId) {
                    try {
                        const product: any = await api.products.get(productId);
                        if (!product) throw new Error('Product not found');
                        setItem(product);
                        setItemType('PRODUCT');
                    } catch (err) {
                        addToast('Không tìm thấy sản phẩm', 'error');
                        router.push('/shop');
                        return;
                    }
                } else if (courseId) {
                    try {
                        const foundCourse: any = await api.courses.getById(courseId);
                        if (!foundCourse) throw new Error('Course not found');
                        setItem(foundCourse);
                        setItemType('COURSE');
                    } catch (err) {
                        addToast('Không tìm thấy khóa học', 'error');
                        router.push('/courses');
                        return;
                    }
                } else {
                    addToast('Không tìm thấy thông tin thanh toán', 'error');
                    router.push('/');
                    return;
                }

                // Fetch related products for upsell (only for products, limit 3)
                if (productId) {
                    try {
                        const res: any = await api.products.list({ isPublished: true });
                        const allProducts = res.data || [];
                        // Filter out current product and get up to 3 related products
                        const related = allProducts
                            .filter((p: any) => p.id !== productId)
                            .slice(0, 3);
                        setUpsellProducts(related);
                    } catch (err) {
                        console.error('Failed to fetch upsell products', err);
                    }
                }
            } catch (e) {
                console.error(e);
                addToast('Lỗi tải dữ liệu', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, productId, router]);

    const handleValidatePromo = async () => {
        if (!promoCode.trim()) {
            addToast('Vui lòng nhập mã khuyến mại', 'warning');
            return;
        }

        setValidatingPromo(true);
        try {
            // Use real coupon API
            const result: any = await api.coupons.validate(promoCode, item.price);

            setAppliedPromo({
                id: result.id,
                code: result.code,
                discount: result.discountAmount, // API returns calculated amount
                type: 'FIXED' // UI treats it as fixed deduction from now on
            });
            addToast(`Áp dụng mã ${result.code} thành công!`, 'success');
        } catch (e: any) {
            console.error(e);
            addToast(e.response?.data?.message || e.message || 'Mã khuyến mại không hợp lệ', 'error');
            setAppliedPromo(null);
        } finally {
            setValidatingPromo(false);
        }
    };

    const calculateDiscount = () => {
        if (!appliedPromo || !item) return 0;
        // appliedPromo.discount is already the calculated amount in VND from logic above
        return appliedPromo.discount;
    };

    const toggleUpsell = (productId: string) => {
        setSelectedUpsells(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const calculateUpsellTotal = () => {
        return upsellProducts
            .filter(p => selectedUpsells.includes(p.id))
            .reduce((sum, p) => sum + Number(p.price), 0);
    };

    const handleCheckout = async () => {
        if (!item || !user) return;

        setProcessing(true);
        try {
            // Build cart with main item + selected upsells
            const cart: any[] = [{
                id: item.id,
                type: itemType,
                options: activationType ? { activationType } : undefined
            }];

            // Add selected upsell products
            selectedUpsells.forEach(upsellId => {
                cart.push({
                    id: upsellId,
                    type: 'PRODUCT'
                });
            });

            const orderData: any = {
                cart,
                promoCodeId: appliedPromo?.id
            };

            const response: any = await api.payments.checkout(orderData);
            console.log('Checkout response:', response);

            // Handle response structure variations
            const order = response.order || response;

            if (!order || (!order.code && !order.id)) {
                throw new Error('Không nhận được thông tin đơn hàng');
            }

            // If free course (amount 0), redirect to dashboard immediately
            if (Number(order.amount) === 0) {
                addToast('Đăng ký thành công!', 'success');
                router.push('/my-learning');
                return;
            }

            // Redirect to order page for payment
            if (order.code) {
                router.push(`/order/${order.code}`);
            } else {
                throw new Error('Mã đơn hàng không tồn tại');
            }

        } catch (e: any) {
            console.error('Checkout error:', e);
            addToast(e.message || 'Tạo đơn hàng thất bại', 'error');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
                <Link href="/shop">
                    <Button as="div">Quay lại cửa hàng</Button>
                </Link>
            </div>
        );
    }

    const discount = calculateDiscount();
    const upsellTotal = calculateUpsellTotal();
    const subtotal = item.price + upsellTotal;
    const finalAmount = subtotal - discount;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container pt-8 pb-20 px-4">
                {/* Max Width Container */}
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-3">
                            <ShieldCheck className="w-4 h-4" />
                            Thanh toán bảo mật
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">Hoàn tất đơn hàng</h1>
                        <p className="text-muted-foreground mt-2">Chỉ còn một bước nữa để sở hữu sản phẩm</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Main Item */}
                            <Card className="border-2">
                                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                                    <CardTitle className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        {itemType === 'COURSE' ? 'Khóa học' : 'Sản phẩm'} của bạn
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {item.thumbnail && (
                                            <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0 border-2 border-border">
                                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-primary">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                </span>
                                                {item.compareAtPrice > item.price && (
                                                    <>
                                                        <span className="text-sm text-muted-foreground line-through">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.compareAtPrice)}
                                                        </span>
                                                        <span className="text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 px-2 py-1 rounded-md">
                                                            -{Math.round((1 - item.price / item.compareAtPrice) * 100)}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upsell Products */}
                            {upsellProducts.length > 0 && (
                                <Card className="border-2 border-dashed border-primary/30">
                                    <CardHeader className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10">
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-amber-600" />
                                            Mua thêm & Tiết kiệm
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground font-normal">
                                            Thêm các sản phẩm liên quan vào đơn hàng để tối ưu chi phí
                                        </p>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-3">
                                        {upsellProducts.map((product) => {
                                            const isSelected = selectedUpsells.includes(product.id);
                                            return (
                                                <div
                                                    key={product.id}
                                                    onClick={() => toggleUpsell(product.id)}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/5 shadow-md'
                                                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                                    }`}
                                                >
                                                    {/* Checkbox */}
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                        isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/50'
                                                    }`}>
                                                        {isSelected && (
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                <path d="M20 6L9 17l-5-5" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    {/* Thumbnail */}
                                                    {product.thumbnail && (
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
                                                            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm line-clamp-1">{product.title}</h4>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right flex-shrink-0">
                                                        <div className="font-bold text-base text-primary">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                        </div>
                                                        {product.compareAtPrice > product.price && (
                                                            <div className="text-xs text-muted-foreground line-through">
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.compareAtPrice)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Promo Code */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mã khuyến mại</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Nhập mã giảm giá"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            disabled={!!appliedPromo}
                                            className="flex-1"
                                        />
                                        {appliedPromo ? (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setAppliedPromo(null);
                                                    setPromoCode('');
                                                }}
                                            >
                                                Hủy
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleValidatePromo}
                                                disabled={validatingPromo}
                                            >
                                                {validatingPromo ? 'Đang kiểm tra...' : 'Áp dụng'}
                                            </Button>
                                        )}
                                    </div>
                                    {appliedPromo && (
                                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                ✓ Mã <span className="font-bold">{appliedPromo.code}</span> đã được áp dụng
                                                {appliedPromo.type === 'PERCENTAGE'
                                                    ? ` (Giảm ${appliedPromo.discount}%)`
                                                    : ` (Giảm ${new Intl.NumberFormat('vi-VN').format(appliedPromo.discount)}₫)`
                                                }
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4 border-2 shadow-xl">
                                <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5">
                                    <CardTitle>Tóm tắt đơn hàng</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    {/* Price Breakdown */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Sản phẩm chính</span>
                                            <span className="font-medium">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                            </span>
                                        </div>

                                        {selectedUpsells.length > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Sản phẩm thêm ({selectedUpsells.length})
                                                </span>
                                                <span className="font-medium">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(upsellTotal)}
                                                </span>
                                            </div>
                                        )}

                                        {discount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Giảm giá</span>
                                                <span className="font-medium text-green-600">
                                                    -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}
                                                </span>
                                            </div>
                                        )}

                                        <div className="border-t pt-3 flex justify-between items-baseline">
                                            <span className="font-bold text-base">Tổng thanh toán</span>
                                            <span className="text-2xl font-bold text-primary">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalAmount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        className="w-full h-12 text-base font-bold shadow-lg"
                                        size="lg"
                                        onClick={handleCheckout}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Đang xử lý...
                                            </span>
                                        ) : (
                                            finalAmount === 0 ? 'Đăng ký ngay' : 'Thanh toán ngay'
                                        )}
                                    </Button>

                                    {/* Trust Badges */}
                                    <div className="pt-3 space-y-2 border-t">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <ShieldCheck className="w-4 h-4 text-green-600" />
                                            <span>Thanh toán bảo mật 100%</span>
                                        </div>
                                        <p className="text-xs text-center text-muted-foreground">
                                            Bằng việc thanh toán, bạn đồng ý với{' '}
                                            <Link href="/terms" className="underline hover:text-primary">
                                                Điều khoản dịch vụ
                                            </Link>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
