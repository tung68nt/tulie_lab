'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ... (existing imports)

// ... inside component ...


import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { ShieldCheck, Sparkles, TrendingUp, MoveRight, Lock, CheckCircle2, ShoppingBag, Ticket, Receipt } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Switch } from '@/components/Switch';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId') || searchParams.get('courseid');
    const productId = searchParams.get('productId') || searchParams.get('productid');
    const bundleId = searchParams.get('bundleId') || searchParams.get('bundleid');
    const activationType = searchParams.get('activationType') || searchParams.get('activationtype');
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState<any>(null); // Course or Product
    const [itemType, setItemType] = useState<'COURSE' | 'PRODUCT' | 'BUNDLE'>('COURSE');
    const [user, setUser] = useState<any>(null);
    const [promoCode, setPromoCode] = useState('');
    const [validatingPromo, setValidatingPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [processing, setProcessing] = useState(false);
    const [upsellProducts, setUpsellProducts] = useState<any[]>([]);
    const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
    const [selectedActivationType, setSelectedActivationType] = useState<'EMAIL' | 'CODE'>('EMAIL');
    const [requestInvoice, setRequestInvoice] = useState(false);
    const [selectedInvoiceProfile, setSelectedInvoiceProfile] = useState<string>('');
    const [invoiceProfiles, setInvoiceProfiles] = useState<any[]>([]);
    const [newInvoiceInfo, setNewInvoiceInfo] = useState({ companyName: '', taxCode: '', address: '', email: '' });

    useEffect(() => {
        if (activationType === 'CODE') setSelectedActivationType('CODE');
    }, [activationType]);

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
                } else if (bundleId) {
                    try {
                        const bundle: any = await api.bundles.get(bundleId);
                        if (!bundle) throw new Error('Bundle not found');
                        // Map bundle fields to common item fields for UI
                        setItem({
                            ...bundle,
                            price: bundle.salePrice,
                            compareAtPrice: bundle.originalPrice,
                            title: bundle.name,
                            thumbnail: bundle.thumbnail || (bundle.courses?.length > 0 ? bundle.courses[0].course?.thumbnail : null)
                        });
                        setItemType('BUNDLE' as any);
                    } catch (err) {
                        addToast('Không tìm thấy combo', 'error');
                        router.push('/shop');
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
                // Fetch invoice profiles
                try {
                    const profiles: any = await api.admin.invoices.listProfiles(profile.id);
                    setInvoiceProfiles(profiles || []);
                    const defaultProfile = profiles?.find((p: any) => p.isDefault);
                    if (defaultProfile) setSelectedInvoiceProfile(defaultProfile.id);
                } catch (err) {
                    console.error('Failed to fetch invoice profiles', err);
                }
            } catch (e) {
                console.error(e);
                addToast('Lỗi tải dữ liệu', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, productId, bundleId, router]);

    const handleValidatePromo = async () => {
        if (!promoCode.trim()) {
            addToast('Vui lòng nhập mã khuyến mại', 'warning');
            return;
        }

        setValidatingPromo(true);
        try {
            if (!item) {
                addToast('Không thể xác thực mã giảm giá lúc này', 'error');
                setValidatingPromo(false);
                return;
            }
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
        console.log('handleCheckout started');
        if (!item || !user) {
            console.error('Missing item or user', { item, user });
            return;
        }

        setProcessing(true);
        try {
            console.log('Building cart...');
            // Build cart with main item + selected upsells
            const cart: any[] = [{
                id: item.id,
                type: itemType,
                options: { activationType: selectedActivationType }
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
                promoCodeId: appliedPromo?.id,
                metadata: {
                    requestInvoice,
                    invoiceInfo: requestInvoice ? (
                        selectedInvoiceProfile === 'new'
                            ? newInvoiceInfo
                            : (invoiceProfiles.find(p => p.id === selectedInvoiceProfile) || newInvoiceInfo)
                    ) : null
                }
            };
            console.log('Order Data prepared:', JSON.stringify(orderData, null, 2));

            console.log('Calling api.payments.checkout...');
            const response: any = await api.payments.checkout(orderData);
            console.log('Checkout response received:', JSON.stringify(response, null, 2));

            // Handle response structure variations
            const order = response?.order || response?.data?.order || response?.data || response;
            console.log('Parsed Order:', JSON.stringify(order, null, 2));

            if (!order || (!order.code && !order.id)) {
                console.error('Invalid order object received:', order);
                throw new Error('Không nhận được thông tin đơn hàng hợp lệ từ máy chủ');
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
    // Fix: Force upsellTotal to 0 if no items selected to prevent phantom calculation issues
    const upsellTotal = selectedUpsells.length > 0 ? calculateUpsellTotal() : 0;

    // Fix: Safely parse item price (handle strings or numbers)
    const itemPrice = Number(item.price);

    const subtotal = itemPrice + Number(upsellTotal);
    const finalAmount = Math.max(0, subtotal - Number(discount));

    console.log('DEBUG CHECKOUT:', {
        itemName: item.title,
        itemPrice: item.price,
        itemPriceType: typeof item.price,
        upsellTotal,
        selectedUpsells,
        subtotal,
        discount,
        finalAmount
    });

    return (
        <div className="min-h-screen bg-background pt-12 pb-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <DotPatternBackground className="text-zinc-900/5 dark:text-white/5" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

                {/* Corner Glows */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-normal" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-normal" />
            </div>

            <div className="container px-4 relative z-10">
                {/* Max Width Container */}
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100/50 dark:bg-zinc-800/50 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4 shadow-sm">
                            <ShieldCheck className="w-4 h-4" />
                            Thanh toán bảo mật
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Hoàn tất đơn hàng</h1>
                        <p className="text-muted-foreground text-lg">Chỉ còn một bước nữa để sở hữu sản phẩm</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Item */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-foreground" />
                                    {itemType === 'COURSE' ? 'Khóa học' : 'Sản phẩm'} của bạn
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    {item.thumbnail && (
                                        <div className="w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-muted flex-shrink-0 border shadow-sm">
                                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{item?.title || 'Đang tải...'}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center gap-3 pt-2">
                                            <span className="text-2xl font-extrabold text-foreground">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price || 0)}
                                            </span>
                                            {Number(item.compareAtPrice) > Number(item.price) && (
                                                <>
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.compareAtPrice)}
                                                    </span>
                                                    <span className="text-sm font-extrabold text-background bg-foreground px-2.5 py-1 rounded-md">
                                                        -{Math.round((1 - Number(item.price) / Number(item.compareAtPrice)) * 100)}%
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
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Mua thêm & Tiết kiệm
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground font-normal">
                                        Thêm các sản phẩm liên quan vào đơn hàng để tối ưu chi phí
                                    </p>
                                </CardHeader>
                                <CardContent className="p-6 pt-0 space-y-3">
                                    {upsellProducts.map((product) => {
                                        const isSelected = selectedUpsells.includes(product.id);
                                        return (
                                            <div
                                                key={product.id}
                                                onClick={() => toggleUpsell(product.id)}
                                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isSelected
                                                    ? 'border-primary bg-card shadow-sm'
                                                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                                                    }`}
                                            >
                                                {/* Checkbox */}
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-foreground border-foreground' : 'border-muted-foreground/50'
                                                    }`}>
                                                    {isSelected && (
                                                        <svg className="w-3 h-3 text-background" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                            <path d="M20 6L9 17l-5-5" />
                                                        </svg>
                                                    )}
                                                </div>

                                                {/* Thumbnail */}
                                                {product.thumbnail && (
                                                    <div className="w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
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
                                                    <div className="font-bold text-sm">
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

                        {/* Invoice & Activation */}
                        <div className="grid gap-6 md:grid-cols-1">
                            {/* Invoice Request */}
                            <Card className={requestInvoice ? 'border-zinc-900 bg-zinc-50 dark:bg-zinc-900/40' : ''}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-foreground">
                                                <Receipt className="w-4 h-4" />
                                            </div>
                                            <CardTitle className="text-lg">Nhập thông tin xuất hoá đơn VAT</CardTitle>
                                        </div>
                                        <Switch
                                            checked={requestInvoice}
                                            onChange={setRequestInvoice}
                                            className={requestInvoice ? "" : "!bg-zinc-200 dark:!bg-zinc-700"}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Yêu cầu cung cấp hóa đơn giá trị gia tăng (8-10%)</p>
                                </CardHeader>
                                {requestInvoice && (
                                    <CardContent className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {invoiceProfiles.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-400 tracking-wider">Chọn hồ sơ đã lưu</label>
                                                <select
                                                    className="w-full text-sm border rounded-lg px-3 h-10 bg-white dark:bg-zinc-900"
                                                    value={selectedInvoiceProfile}
                                                    onChange={(e) => setSelectedInvoiceProfile(e.target.value)}
                                                >
                                                    <option value="">-- Chọn hồ sơ --</option>
                                                    {invoiceProfiles.map(p => (
                                                        <option key={p.id} value={p.id}>{p.companyName} ({p.taxCode})</option>
                                                    ))}
                                                    <option value="new">+ Nhập thông tin mới</option>
                                                </select>
                                            </div>
                                        )}

                                        {(invoiceProfiles.length === 0 || selectedInvoiceProfile === 'new') && (
                                            <div className="grid gap-4 md:grid-cols-2 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-[10px] font-bold text-zinc-400">Tên công ty / Đơn vị</label>
                                                    <Input
                                                        placeholder="Công ty TNHH Giải pháp..."
                                                        value={newInvoiceInfo.companyName}
                                                        onChange={(e) => setNewInvoiceInfo({ ...newInvoiceInfo, companyName: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-400">Mã số thuế</label>
                                                    <Input
                                                        placeholder="0101234567"
                                                        value={newInvoiceInfo.taxCode}
                                                        onChange={(e) => setNewInvoiceInfo({ ...newInvoiceInfo, taxCode: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-400">Email nhận HĐ</label>
                                                    <Input
                                                        placeholder="finance@company.com"
                                                        value={newInvoiceInfo.email}
                                                        onChange={(e) => setNewInvoiceInfo({ ...newInvoiceInfo, email: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-[10px] font-bold text-zinc-400">Địa chỉ trụ sở</label>
                                                    <Input
                                                        placeholder="Số 123, Đường ABC, Quận XYZ..."
                                                        value={newInvoiceInfo.address}
                                                        onChange={(e) => setNewInvoiceInfo({ ...newInvoiceInfo, address: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                )}
                            </Card>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Promo Code */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-foreground">
                                                <Ticket className="w-4 h-4" />
                                            </div>
                                            <CardTitle className="text-lg">Mã giảm giá</CardTitle>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Giảm trực tiếp vào giá thanh toán</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="GAVE20, NEWYEAR..."
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
                                                    {validatingPromo ? '...' : 'Áp dụng'}
                                                </Button>
                                            )}
                                        </div>
                                        {appliedPromo && (
                                            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                                <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                                                    ✓ Đã áp dụng: -{new Intl.NumberFormat('vi-VN').format(appliedPromo.discount)}₫
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Activation Options */}
                                <Card className="border-primary/20 bg-primary/[0.02]">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-foreground/10 text-foreground">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <CardTitle className="text-lg">Cấu hình kích hoạt</CardTitle>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Chọn cách bạn muốn nhận sản phẩm</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-3">
                                            <button
                                                onClick={() => setSelectedActivationType('EMAIL')}
                                                className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left ${selectedActivationType === 'EMAIL'
                                                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg translate-y-[-1px]'
                                                    : 'bg-background text-foreground border-zinc-200 hover:border-zinc-300'
                                                    }`}
                                            >
                                                <span className="text-[15px] font-semibold mb-1">Kích hoạt ngay</span>
                                                <span className="text-xs opacity-70">Gán trực tiếp vào tài khoản {user?.email}</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedActivationType('CODE')}
                                                className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left ${selectedActivationType === 'CODE'
                                                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg translate-y-[-1px]'
                                                    : 'bg-background text-foreground border-zinc-200 hover:border-zinc-300'
                                                    }`}
                                            >
                                                <span className="text-[15px] font-semibold mb-1">Mua mã quà tặng</span>
                                                <span className="text-xs opacity-70">Nhận mã qua email để tặng hoặc kích hoạt sau</span>
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        {/* Order Summary Summary - LIGHTWEIGHT */}
                        <Card className="sticky top-4 shadow-xl border-zinc-200 dark:border-zinc-800 border overflow-hidden group rounded-2xl">
                            <div className="bg-zinc-900 text-white p-6 relative overflow-hidden">
                                <CardTitle className="relative z-10 flex items-center gap-2 text-white">
                                    <ShieldCheck className="w-5 h-5 text-green-400" />
                                    Tóm tắt đơn hàng
                                </CardTitle>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <Receipt className="w-20 h-20" />
                                </div>
                            </div>
                            <CardContent className="space-y-6 pt-8 p-6 bg-white dark:bg-zinc-950">
                                {/* Price Breakdown */}
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Sản phẩm chính</span>
                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                        </span>
                                    </div>

                                    {selectedUpsells.length > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Sản phẩm thêm ({selectedUpsells.length})
                                            </span>
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(upsellTotal)}
                                            </span>
                                        </div>
                                    )}

                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Giảm giá</span>
                                            <span className="font-semibold text-green-600">
                                                -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="h-px bg-zinc-100/50 dark:bg-zinc-800/50 my-2" />

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-semibold text-base text-zinc-600">Tổng thanh toán</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-zinc-900 dark:text-white block tracking-tight">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalAmount)}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground mt-1 block opacity-70">
                                                Bao gồm phí kích hoạt tự động
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <Button
                                        onClick={handleCheckout}
                                        disabled={processing}
                                        variant="white"
                                        className="w-full text-lg font-bold h-14 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                Đang xử lý...
                                            </span>
                                        ) : (
                                            <>
                                                <span className="relative z-10 tracking-wide font-bold">
                                                    {finalAmount === 0 ? 'Đăng ký ngay' : 'Thanh toán ngay'}
                                                </span>
                                                <MoveRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                                            </>
                                        )}
                                        <div className="absolute inset-0 bg-zinc-100/50 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
                                    </Button>

                                    <div className="pt-4 space-y-2 border-t">
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                            <Lock className="w-4 h-4 text-green-600" />
                                            <span>Thanh toán bảo mật SSL</span>
                                        </div>
                                        <p className="text-xs text-center text-muted-foreground">
                                            Bằng việc thanh toán, bạn đồng ý với{' '}
                                            <Link href="/terms" className="underline hover:text-primary transition-colors">
                                                Điều khoản dịch vụ
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
