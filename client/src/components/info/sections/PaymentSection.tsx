'use client';

import { Section } from '@/types/sections';
import { Button } from '@/components/Button';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useState, useEffect } from 'react';
import { CartItem, CheckoutFormState, CheckoutState } from '@/types/checkout';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

// Mock data helpers (replace with real props/backend later)
const parsePrice = (price?: string | number | null) => {
    if (price === null || price === undefined) return 0;
    if (typeof price === 'number') return isNaN(price) ? 0 : price;
    return parseInt(String(price).replace(/\D/g, '')) || 0;
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function PaymentSection({ section, mainCourse, upsellCourse, mainProduct: dynamicMainProduct, upsellProduct, upsellPrice, allSections }: { section: Section; mainCourse?: any; upsellCourse?: any; mainProduct?: any; upsellProduct?: any; upsellPrice?: any; allSections?: Section[] }) {
    const { addToast } = useToast();
    // --- State ---
    const [showPassword, setShowPassword] = useState(false);
    const [state, setState] = useState<CheckoutState>({
        step: 'form',
        cart: [],
        form: {
            name: '',
            email: '',
            phone: '',
            createAccount: true,
            isGift: false,
            agreedToTerms: true,
        },
        payment: { status: 'pending' }
    });

    // Initialize Cart with "Main Product" from section config or defaults
    useEffect(() => {
        let mainProduct: CartItem;

        if (mainCourse) {
            mainProduct = {
                id: mainCourse.id,
                title: mainCourse.title,
                price: Number(mainCourse.salePrice || mainCourse.price),
                image: mainCourse.thumbnail || section.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
                originalPrice: Number(mainCourse.price)
            };
        } else if (dynamicMainProduct) {
            mainProduct = {
                id: dynamicMainProduct.id,
                title: dynamicMainProduct.name,
                price: Number(dynamicMainProduct.price || 0),
                image: dynamicMainProduct.image || section.image,
                originalPrice: Number(dynamicMainProduct.originalPrice || dynamicMainProduct.price || 0)
            };
        } else {
            mainProduct = {
                id: section.id || 'contact-support',
                title: section.title || 'Liên hệ để đăng ký',
                price: 0,
                originalPrice: 0,
                image: section.image
            };
        }

        // Extract Bonus/Gift Items from other sections if available
        const bonusItems: CartItem[] = (allSections || [])
            .filter(s => s.type === 'bonus' && s.isVisible !== false)
            .flatMap(s => s.items || [])
            .map((item, idx) => ({
                id: `gift-${idx}`,
                title: `[Quà tặng] ${item.title}`,
                price: 0,
                originalPrice: Number(item.originalPrice || item.price || 0),
                image: item.image,
                isGift: true
            }));

        const initialCart = [mainProduct, ...bonusItems];
        setState(prev => ({ ...prev, cart: initialCart }));
    }, [section, mainCourse, dynamicMainProduct, allSections]);

    // Derived cart totals
    const totalAmount = state.cart.reduce((sum, item) => sum + item.price, 0);

    // --- Handlers ---
    const toggleUpsell = (item: any) => {
        const inCart = state.cart.find(c => c.id === item.id);
        let newCart;
        if (inCart) {
            newCart = state.cart.filter(c => c.id !== item.id);
        } else {
            newCart = [...state.cart, {
                id: item.id,
                title: item.title,
                price: parsePrice(item.salePrice || item.price),
                originalPrice: parsePrice(item.price), // Assuming 'price' is original in upsell context
                image: item.image,
                isUpsell: true
            }];
        }
        setState(prev => ({ ...prev, cart: newCart }));
    };

    const handleFormChange = (field: keyof CheckoutFormState, value: any) => {
        setState(prev => ({ ...prev, form: { ...prev.form, [field]: value } }));
    };

    // Auto-save lead when phone number is entered
    const handlePhoneBlur = async () => {
        if (state.form.phone && state.form.phone.length >= 10) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: state.form.name || 'Khách hàng tiềm năng',
                        email: state.form.email,
                        phone: state.form.phone,
                        message: `Lead từ Landing Page: ${state.cart.map(i => i.title).join(', ')}`
                    })
                });
                console.log("Lead saved successfully");
            } catch (error) {
                console.error("Failed to save lead", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    form: state.form,
                    isGift: state.form.isGift,
                    cart: state.cart.filter(item => !item.isGift), // Only pay for non-gifts
                    marketing: {
                        source: new URLSearchParams(window.location.search).get('utm_source'),
                        medium: new URLSearchParams(window.location.search).get('utm_medium'),
                        campaign: new URLSearchParams(window.location.search).get('utm_campaign')
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'EMAIL_EXISTS') {
                    addToast('Email này đã từng đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.', 'error');
                    return;
                }
                throw new Error(data.message || 'Lỗi tạo đơn hàng');
            }

            const mockExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

            setState(prev => ({
                ...prev,
                step: 'payment',
                payment: {
                    status: 'pending',
                    orderCode: data.order.code,
                    amount: Number(data.order.amount),
                    expiresAt: mockExpiresAt,
                }
            }));
        } catch (error: any) {
            console.error('Checkout error:', error);
            addToast(error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.', 'error');
        }
    };

    // --- Render Components ---

    const renderForm = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-3 text-zinc-900">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-medium">1</span>
                Thông tin cá nhân
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 mb-1 block">Họ và tên</label>
                    <input
                        required
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-100 transition-all"
                        placeholder="Ví dụ: Nguyễn Văn A"
                        value={state.form.name}
                        onChange={e => handleFormChange('name', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 mb-1 block">Số điện thoại (Zalo hỗ trợ)</label>
                    <input
                        required
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-100 transition-all"
                        placeholder="0912..."
                        value={state.form.phone}
                        onChange={e => handleFormChange('phone', e.target.value)}
                        onBlur={handlePhoneBlur}
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">Email nhận khoá học</label>
                    <input
                        required
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        placeholder="email@example.com"
                        value={state.form.email}
                        onChange={e => handleFormChange('email', e.target.value)}
                    />
                </div>
            </div>

            {/* Account Creation Logic */}
            <div className="bg-zinc-50/50 p-6 rounded-2xl space-y-5 border border-zinc-100">
                <div className="flex items-center space-x-3 pb-2">
                    <button
                        type="button"
                        onClick={() => handleFormChange('isGift', !state.form.isGift)}
                        className={cn(
                            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                            state.form.isGift ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-200 bg-white"
                        )}
                    >
                        {state.form.isGift && <DynamicIcon name="Check" className="w-4 h-4 stroke-[3px]" />}
                    </button>
                    <div className="flex-1 cursor-pointer" onClick={() => handleFormChange('isGift', !state.form.isGift)}>
                        <label className="text-sm font-semibold text-zinc-900 block">
                            Mua làm quà tặng
                        </label>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                            Nhận mã kích hoạt để tặng lại hoặc sử dụng sau.
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => handleFormChange('createAccount', !state.form.createAccount)}
                        className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                            state.form.createAccount ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                        )}
                    >
                        {state.form.createAccount && <DynamicIcon name="Check" className="w-3.5 h-3.5" />}
                    </button>
                    <label className="text-sm font-medium leading-none cursor-pointer" onClick={() => handleFormChange('createAccount', !state.form.createAccount)}>
                        Tạo tài khoản mới (Khuyên dùng)
                    </label>
                </div>

                {state.form.createAccount && (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium">Mật khẩu</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-10"
                                        placeholder="******"
                                        value={state.form.password || ''}
                                        onChange={e => handleFormChange('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <DynamicIcon name={showPassword ? "EyeOff" : "Eye"} className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-10"
                                        placeholder="******"
                                        value={state.form.confirmPassword || ''}
                                        onChange={e => handleFormChange('confirmPassword', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <DynamicIcon name={showPassword ? "EyeOff" : "Eye"} className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => handleFormChange('agreedToTerms', !state.form.agreedToTerms)}
                                className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0",
                                    state.form.agreedToTerms ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                                )}
                            >
                                {state.form.agreedToTerms && <DynamicIcon name="Check" className="w-3.5 h-3.5" />}
                            </button>
                            <label className="text-sm text-muted-foreground cursor-pointer" onClick={() => handleFormChange('agreedToTerms', !state.form.agreedToTerms)}>
                                Tôi đồng ý với <Link href="#" className="underline dark:text-gray-300">Điều khoản sử dụng</Link>
                            </label>
                        </div>
                    </div>
                )}

                {/* VAT Invoice Option */}
                <div className="pt-4 border-t border-border/10">
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => handleFormChange('requireVAT', !state.form.requireVAT)}
                            className={cn(
                                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                state.form.requireVAT ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
                            )}
                        >
                            {state.form.requireVAT && <DynamicIcon name="Check" className="w-3.5 h-3.5" />}
                        </button>
                        <label className="text-sm font-bold leading-none cursor-pointer" onClick={() => handleFormChange('requireVAT', !state.form.requireVAT)}>
                            Xuất hoá đơn VAT (Công ty/Tổ chức)
                        </label>
                    </div>

                    {state.form.requireVAT && (
                        <div className="mt-4 p-4 bg-muted/20 border border-border/50 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Họ tên người mua</label>
                                    <input
                                        required={state.form.requireVAT}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        placeholder="Nguyễn Văn A"
                                        value={state.form.vatBuyerName || ''}
                                        onChange={e => handleFormChange('vatBuyerName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Mã số thuế</label>
                                    <input
                                        required={state.form.requireVAT}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        placeholder="0101234567"
                                        value={state.form.vatTaxId || ''}
                                        onChange={e => handleFormChange('vatTaxId', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-medium">Tên công ty</label>
                                    <input
                                        required={state.form.requireVAT}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        placeholder="Công ty Cổ phần ABC"
                                        value={state.form.vatCompanyName || ''}
                                        onChange={e => handleFormChange('vatCompanyName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-medium">Địa chỉ theo thuế</label>
                                    <input
                                        required={state.form.requireVAT}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        placeholder="Số 123, Đường XYZ, Quận..., TP..."
                                        value={state.form.vatAddress || ''}
                                        onChange={e => handleFormChange('vatAddress', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Email nhận hoá đơn</label>
                                    <input
                                        required={state.form.requireVAT}
                                        type="email"
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        placeholder="accounting@company.com"
                                        value={state.form.vatEmail || ''}
                                        onChange={e => handleFormChange('vatEmail', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">SĐT / Zalo</label>
                                    <input
                                        required={state.form.requireVAT}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                        placeholder="0912345678"
                                        value={state.form.vatPhone || ''}
                                        onChange={e => handleFormChange('vatPhone', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Product Selection */}
            <div className="space-y-4 pt-6 mt-4 border-t border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-widest opacity-40">Sản phẩm đăng ký</h3>
                <div className="p-6 rounded-[1.5rem] border border-zinc-200 bg-white flex items-center gap-5 transition-all hover:border-zinc-400">
                    <div className="w-14 h-14 bg-zinc-100 rounded-xl overflow-hidden shrink-0 border border-zinc-50">
                        {state.cart[0] && state.cart[0].image && <img src={state.cart[0].image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-zinc-900 leading-tight">{state.cart[0]?.title || section.title}</h4>
                        <div className="text-sm flex items-center gap-2 mt-1">
                            <span className="font-semibold text-zinc-900">{formatPrice(state.cart[0]?.price || 0)}</span>
                            {state.cart[0] && state.cart[0].originalPrice && state.cart[0].originalPrice > (state.cart[0].price || 0) && (
                                <span className="text-xs text-zinc-400 line-through">{formatPrice(state.cart[0].originalPrice)}</span>
                            )}
                        </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center">
                        <DynamicIcon name="Check" className="w-3.5 h-3.5 text-white" />
                    </div>
                </div>
            </div>

            {/* Upsells List */}
            {((section.items && section.items.length > 0) || upsellCourse) && (
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                        <h3 className="text-lg font-semibold text-zinc-900">Tổng thanh toán</h3>
                        <span className="text-xl font-semibold text-zinc-900">{formatPrice(totalAmount)}</span>
                    </div>

                    <div className="grid gap-4">
                        {(() => {
                            // If we have dynamic courses (main/upsell), we generally want to ignore static section items
                            // unless specifically intended. For now, if upsellCourse exists, we show ONLY upsell + explicitly added items?
                            // Data mismatch issue: "Still one extra course".
                            // Likely section.items has the "Facebook Ads" course as a static item from the template.
                            // We should clear it or ignore it if we are in "Dynamic Mode".

                            let combinedItems: any[] = [];

                            // If we are using dynamic courses, start fresh. 
                            // Otherwise use section.items (fallback/static mode)
                            // If we use dynamic courses (main or upsell), we MUST start fresh to avoid static template items appearing.
                            if (mainCourse || upsellCourse || dynamicMainProduct || upsellProduct) {
                                combinedItems = [];
                            } else if (section.items) {
                                // Only use static items if NO dynamic courses are present
                                combinedItems = [...section.items];
                            }

                            if (upsellCourse) {
                                // Add dynamic upsell course to the list
                                combinedItems.push({
                                    id: upsellCourse.id,
                                    title: upsellCourse.title,
                                    price: upsellCourse.price, // Original price
                                    salePrice: Number(upsellPrice) > 0 ? Number(upsellPrice) : (upsellCourse.salePrice || upsellCourse.price),
                                    image: upsellCourse.thumbnail,
                                    description: upsellCourse.description || 'Ưu đãi đặc biệt khi mua kèm với giá hấp dẫn.',
                                    ctaText: 'Mua thêm để học hiệu quả hơn',
                                    isUpsell: true
                                });
                            }

                            if (upsellProduct) {
                                // Add dynamic upsell product to the list
                                combinedItems.push({
                                    id: upsellProduct.id,
                                    title: upsellProduct.name,
                                    price: upsellProduct.price,
                                    salePrice: Number(upsellPrice) > 0 ? Number(upsellPrice) : (upsellProduct.salePrice || upsellProduct.price),
                                    image: upsellProduct.image,
                                    description: upsellProduct.description || 'Module bổ trợ đi kèm.',
                                    ctaText: 'Thêm vào lộ trình của tôi',
                                    isUpsell: true
                                });
                            }

                            return combinedItems.map((item: any, idx: number) => {
                                const isAdded = state.cart.some(c => c.id === item.id);
                                const salePrice = parsePrice(item.salePrice || item.price);
                                const original = parsePrice(item.price);
                                const discount = original > 0 ? Math.round(((original - salePrice) / original) * 100) : 0;

                                return (
                                    <div key={idx} className="group border border-border rounded-xl p-4 hover:border-blue-300 transition-colors bg-white">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-lg overflow-hidden shrink-0 relative">
                                                {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                                {discount > 0 && (
                                                    <span className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5">
                                                        -{discount}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-semibold text-sm md:text-base line-clamp-2">{item.title}</h4>
                                                    <div className="text-right shrink-0">
                                                        <div className="font-semibold text-red-600 block">{formatPrice(salePrice)}</div>
                                                        {original > salePrice && (
                                                            <div className="text-xs text-muted-foreground line-through decoration-slate-400 block">{formatPrice(original)}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => toggleUpsell(item)}
                                            className={cn(
                                                "mt-3 flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all select-none",
                                                isAdded
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 bg-white transition-colors",
                                                isAdded ? "border-white" : "border-gray-300"
                                            )}>
                                                {isAdded && <DynamicIcon name="Check" className="w-3.5 h-3.5 text-blue-600 stroke-[3px]" />}
                                            </div>
                                            <span className="text-sm font-semibold flex-1">
                                                {item.ctaText || "Mua thêm để bán khoá học dễ dàng hơn"}
                                            </span>
                                            <DynamicIcon name="Plus" className={cn("w-4 h-4", isAdded ? "opacity-100" : "opacity-50")} />
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            )}
        </div>
    );

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        addToast(`Đã sao chép ${label}`, 'success');
    };

    const renderPayment = () => (
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DynamicIcon name="Check" className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold">Đặt hàng thành công!</h3>
            <p className="text-muted-foreground">Vui lòng thanh toán để kích hoạt khoá học ngay lập tức.</p>

            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-primary/20 inline-block w-full max-w-sm relative overflow-hidden">
                <div className={cn(
                    "transition-all duration-500",
                    (state.payment.expiresAt || 0) < Date.now() && "blur-md pointer-events-none opacity-50"
                )}>
                    <div className="text-sm font-medium text-muted-foreground mb-4">Quét mã QR để tự động điền thông tin</div>
                    <div className="w-56 h-56 bg-gray-50 mx-auto rounded-lg mb-6 flex items-center justify-center overflow-hidden border border-gray-100">
                        <img src={`https://img.vietqr.io/image/Techcombank-19036578988012-compact2.png?amount=${state.payment.amount}&addInfo=${state.payment.orderCode}`} alt="QR Code" className="w-full h-full object-contain" />
                    </div>

                    <div className="space-y-4 text-left border-t border-dashed border-gray-200 pt-6">
                        <div className="flex justify-between items-center group">
                            <div className="text-sm text-muted-foreground">Số tiền:</div>
                            <div className="flex items-center gap-2 text-right">
                                <span className="text-xl font-bold text-foreground">{formatPrice(state.payment.amount || 0)}</span>
                                <button onClick={() => copyToClipboard(String(state.payment.amount), 'số tiền')} className="p-1 hover:bg-gray-100 rounded text-muted-foreground opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                    <DynamicIcon name="Copy" className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center group">
                            <div className="text-sm text-muted-foreground">Chủ tài khoản:</div>
                            <div className="font-bold text-sm uppercase text-right">NGUYEN VAN TUNG</div>
                        </div>

                        <div className="flex justify-between items-center group">
                            <div className="text-sm text-muted-foreground">Ngân hàng:</div>
                            <div className="font-bold text-sm text-right">Techcombank</div>
                        </div>

                        <div className="flex justify-between items-center group">
                            <div className="text-sm text-muted-foreground">Số tài khoản:</div>
                            <div className="flex items-center gap-2 text-right">
                                <span className="font-bold text-sm text-foreground">19036578988012</span>
                                <button onClick={() => copyToClipboard('19036578988012', 'số tài khoản')} className="p-1 hover:bg-gray-100 rounded text-muted-foreground">
                                    <DynamicIcon name="Copy" className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 mt-6 relative overflow-hidden">
                            <div className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wider">Nội dung chuyển khoản:</div>
                            <div className="flex flex-col gap-3">
                                <div className="bg-white px-3 py-2.5 rounded-lg border border-neutral-200 flex items-center justify-between group/content">
                                    <span className="font-bold text-foreground text-lg tracking-wider select-all">{state.payment.orderCode}</span>
                                    <button
                                        onClick={() => copyToClipboard(state.payment.orderCode || '', 'nội dung')}
                                        className="bg-neutral-900 text-white px-2 py-1 rounded-full hover:bg-primary transition-all flex items-center gap-1 shrink-0 ml-2"
                                    >
                                        <DynamicIcon name="Copy" className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase">Sao chép</span>
                                    </button>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-tight">
                                    * Vui lòng nhập <span className="font-bold text-neutral-800">chính xác</span> nội dung trên để hệ thống tự động kích hoạt.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 relative z-10">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-red-100">
                        <DynamicIcon name="Clock" className="w-4 h-4 animate-pulse text-red-500" />
                        {(state.payment.expiresAt || 0) < Date.now() ? <span className="uppercase tracking-wider">Mã đã hết hạn</span> : <>Đơn hàng hết hạn sau: <CountdownTimer targetDate={state.payment.expiresAt || 0} /></>}
                    </div>

                    {(state.payment.expiresAt || 0) < Date.now() && (
                        <Button
                            variant="default"
                            className="w-full font-bold shadow-lg shadow-primary/20 animate-bounce-subtle"
                            onClick={() => setState(prev => ({ ...prev, step: 'form' }))}
                        >
                            <DynamicIcon name="RefreshCw" className="w-4 h-4 mr-2" />
                            Tạo lại mã thanh toán mới
                        </Button>
                    )}
                </div>
            </div>

            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Hệ thống sẽ tự động kích hoạt tài khoản ngay khi nhận được tiền (thường mất 1-30 giây).
            </p>
        </div>
    );

    return (
        <section id="payment-section" className="py-16 md:py-24 bg-secondary/10">
            <div className="container px-4 mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Column: Form or Success Message */}
                    <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                        {state.step === 'form' ? (
                            <form onSubmit={handleSubmit}>
                                {renderForm()}
                                <div className="mt-10 lg:hidden">
                                    <Button type="submit" size="lg" className="w-full py-7 rounded-2xl bg-zinc-950 text-white font-semibold text-lg shadow-xl shadow-zinc-200">
                                        Thanh toán ngay • {formatPrice(totalAmount)}
                                    </Button>
                                    <p className="text-center text-[10px] text-zinc-400 mt-4 uppercase tracking-widest">An toàn & Bảo mật 100%</p>
                                </div>
                            </form>
                        ) : (
                            renderPayment()
                        )}
                    </div>

                    {/* Right Column: Sticky Cart Summary */}
                    <div className="hidden lg:block lg:col-span-5 sticky top-24 space-y-6">
                        <div className="bg-background p-6 rounded-2xl shadow-lg border border-border/60">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <DynamicIcon name="ShoppingBag" className="w-5 h-5" />
                                Thông tin đơn hàng
                            </h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {state.cart.map((item, i) => (
                                    <div key={i} className="flex gap-3 items-start py-3 border-b border-border/40 last:border-0">
                                        <div className="w-16 h-16 bg-muted rounded-md overflow-hidden shrink-0">
                                            {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm line-clamp-2">{item.title}</div>
                                            {item.isUpsell && <div className="text-[10px] uppercase font-bold text-primary mt-1">Ưu đãi thêm</div>}
                                        </div>
                                        <div className="font-semibold text-sm shrink-0 flex flex-col items-end">
                                            {item.isGift ? (
                                                <span className="text-red-500">MIỄN PHÍ</span>
                                            ) : (
                                                formatPrice(item.price)
                                            )}
                                            {(item.originalPrice ?? 0) > item.price && (
                                                <span className="text-[10px] text-muted-foreground line-through decoration-slate-400">
                                                    {formatPrice(item.originalPrice ?? 0)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 mt-2 border-t border-dashed border-border flex justify-between items-end">
                                <span className="text-muted-foreground">Tổng thanh toán</span>
                                <span className="text-2xl font-semibold text-primary">{formatPrice(totalAmount)}</span>
                            </div>

                            {state.step === 'form' && (
                                <div className="pt-6">
                                    <Button
                                        size="lg"
                                        className="w-full font-bold text-lg h-14 shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                                        onClick={(e) => {
                                            // Trigger form submit externally if needed, or just let the form button handle it. 
                                            // For React, easiest is to put this button inside form or link via formId.
                                            // Here we assume the desktop user clicks this, but it needs to submit the form in Left Col.
                                            // We will verify form validity using constraints or just duplicate the button inside form.
                                            // Actually better UX: Make this button distinct or just scroll to form.
                                            // But standard ecommerce pattern: Button in sticky summary submits form.
                                            const form = document.querySelector('form');
                                            if (form) form.requestSubmit();
                                        }}
                                    >
                                        Thanh toán ngay
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                                        <DynamicIcon name="Lock" className="w-3 h-3" />
                                        <span>Bảo mật SSL</span>
                                        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                        <span>Hoàn tiền 7 ngày</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="flex gap-4 justify-center grayscale opacity-60">
                            {/* Add payment icons here later */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Helper Countdown Component
function CountdownTimer({ targetDate }: { targetDate: number }) {
    const [timeLeft, setTimeLeft] = useState<{ m: number, s: number }>({ m: 5, s: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = targetDate - now;
            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ m: 0, s: 0 });
            } else {
                setTimeLeft({
                    m: Math.floor((diff / 1000 / 60) % 60),
                    s: Math.floor((diff / 1000) % 60)
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <span className="font-bold">
            {String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
        </span>
    );
}
