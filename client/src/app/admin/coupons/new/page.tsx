'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Switch } from '@/components/Switch';

export default function NewCouponPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENT', // PERCENT, FIXED
        discountValue: 0,
        minPurchase: 0,
        maxDiscount: 0,
        usageLimit: 0, // 0 = unlimited
        perUserLimit: 1,
        startDate: '',
        endDate: '',
        isActive: true,
        forBirthday: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Transform data for API
            const payload = {
                ...formData,
                usageLimit: formData.usageLimit > 0 ? formData.usageLimit : null,
                maxDiscount: formData.maxDiscount > 0 ? formData.maxDiscount : null,
                minPurchase: formData.minPurchase > 0 ? formData.minPurchase : null,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };

            await api.coupons.create(payload);
            addToast('Đã tạo mã giảm giá thành công', 'success');
            router.push('/admin/coupons');
        } catch (error: any) {
            console.error(error);
            addToast(error.message || 'Lỗi khi tạo mã', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Tạo Mã Giảm Giá Mới</h1>
                <Button variant="outline" onClick={() => router.back()}>Hủy</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mã Code (Tự động in hoa)</label>
                            <Input
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                required
                                placeholder="vd: SALE2024"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="discountType" className="text-sm font-medium">Loại giảm giá</label>
                                <select
                                    id="discountType"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.discountType}
                                    onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                >
                                    <option value="PERCENT">Phần trăm (%)</option>
                                    <option value="FIXED">Số tiền cố định (VNĐ)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giá trị giảm {formData.discountType === 'PERCENT' ? '(%)' : '(VNĐ)'}</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.discountValue}
                                    onChange={e => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </div>
                        </div>

                        {formData.discountType === 'PERCENT' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giảm tối đa (VNĐ) - Để 0 nếu không giới hạn</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.maxDiscount}
                                    onChange={e => setFormData({ ...formData, maxDiscount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Đơn hàng tối thiểu (VNĐ) - Để 0 nếu không yêu cầu</label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.minPurchase}
                                onChange={e => setFormData({ ...formData, minPurchase: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thời gian & Giới hạn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ngày bắt đầu (Tùy chọn)</label>
                                <Input
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ngày kết thúc (Tùy chọn)</label>
                                <Input
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giới hạn số lần dùng chung (0 = Vô hạn)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.usageLimit}
                                    onChange={e => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giới hạn mỗi người dùng (lần)</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.perUserLimit}
                                    onChange={e => setFormData({ ...formData, perUserLimit: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cấu hình khác</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium block">Kích hoạt mã</label>
                                <span className="text-sm text-muted-foreground">Mã có thể sử dụng ngay sau khi tạo</span>
                            </div>
                            <Switch checked={formData.isActive} onChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium block">Mã Sinh nhật</label>
                                <span className="text-sm text-muted-foreground">Chỉ áp dụng cho user có sinh nhật trong tháng</span>
                            </div>
                            <Switch checked={formData.forBirthday} onChange={(checked) => setFormData({ ...formData, forBirthday: checked })} />
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Tạo Mã Giảm Giá'}
                </Button>
            </form>
        </div>
    );
}
