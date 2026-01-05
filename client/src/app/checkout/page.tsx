'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [promoCode, setPromoCode] = useState('');
    const [validatingPromo, setValidatingPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

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

                // Get course
                if (!courseId) {
                    addToast('Không tìm thấy khóa học', 'error');
                    router.push('/courses');
                    return;
                }

                const allCourses: any = await api.courses.list();
                const foundCourse = allCourses.find((c: any) => c.id === courseId);

                if (!foundCourse) {
                    addToast('Không tìm thấy khóa học', 'error');
                    router.push('/courses');
                    return;
                }

                setCourse(foundCourse);
            } catch (e) {
                console.error(e);
                addToast('Lỗi tải dữ liệu', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, router]);

    const handleValidatePromo = async () => {
        if (!promoCode.trim()) {
            addToast('Vui lòng nhập mã khuyến mại', 'warning');
            return;
        }

        setValidatingPromo(true);
        try {
            // Use real coupon API
            const result: any = await api.coupons.validate(promoCode, course.price);

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
        if (!appliedPromo || !course) return 0;
        // appliedPromo.discount is already the calculated amount in VND from logic above
        return appliedPromo.discount;
    };

    const handleCheckout = async () => {
        if (!course || !user) return;

        setProcessing(true);
        try {
            const orderData: any = {
                courseId: course.id,
                promoCodeId: appliedPromo?.id
            };

            const order: any = await api.payments.checkout(orderData);

            // Redirect to order page
            router.push(`/order/${order.code}`);
        } catch (e: any) {
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

    if (!course) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h1>
                <Link href="/courses">
                    <Button>Quay lại danh sách khóa học</Button>
                </Link>
            </div>
        );
    }

    const discount = calculateDiscount();
    const finalAmount = course.price - discount;

    return (
        <div className="container pt-6 md:pt-10" style={{ paddingBottom: '120px' }}>
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin khóa học</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    {course.thumbnail && (
                                        <div className="w-32 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium">{course.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {course.lessons?.length || 0} bài học
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Promo Code */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Mã khuyến mại</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Nhập mã khuyến mại"
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

                    {/* Payment Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Tóm tắt đơn hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Giá gốc</span>
                                        <span className="font-medium">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                                        </span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Giảm giá</span>
                                            <span className="font-medium text-green-600">
                                                -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="border-t pt-2 flex justify-between">
                                        <span className="font-bold">Tổng cộng</span>
                                        <span className="text-xl font-bold text-primary">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalAmount)}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={processing}
                                >
                                    {processing ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
                                </Button>

                                <p className="text-xs text-center text-muted-foreground">
                                    Bằng việc thanh toán, bạn đồng ý với{' '}
                                    <Link href="/terms" className="underline">
                                        Điều khoản dịch vụ
                                    </Link>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
