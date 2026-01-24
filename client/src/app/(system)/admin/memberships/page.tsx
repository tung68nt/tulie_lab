'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, Plus, Trash2, LayoutGrid } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useSettings } from '@/contexts/SettingsContext';

interface MembershipState {
    basic: {
        sale: string;
        original: string;
        description: string;
        features: string[];
    };
    premium: {
        sale: string;
        original: string;
        description: string;
        features: string[];
    };
}

export default function AdminMembershipsPage() {
    const { addToast } = useToast();
    const { updateSettings: globalUpdateSettings } = useSettings();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [state, setState] = useState<MembershipState>({
        basic: { sale: '', original: '', description: '', features: [] },
        premium: { sale: '', original: '', description: '', features: [] }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res: any = await api.admin.settings.get();
            const newState: MembershipState = {
                basic: {
                    sale: res.pricing_membership_basic_sale || '1.990k',
                    original: res.pricing_membership_basic_original || '3.500k',
                    description: res.pricing_membership_basic_description || 'Tải không giới hạn tất cả các templates',
                    features: safeParse(res.pricing_membership_basic_features, ['Tải không giới hạn', 'Tiết kiệm 80%', 'Update hàng tuần'])
                },
                premium: {
                    sale: res.pricing_membership_premium_sale || '4.990k',
                    original: res.pricing_membership_premium_original || '15.000k',
                    description: res.pricing_membership_premium_description || 'All-in-one + Tư vấn 1-1 trực tiếp',
                    features: safeParse(res.pricing_membership_premium_features, ['Tư vấn 1-1 trực tiếp', 'Source code các dự án', 'Hỗ trợ ưu tiên 24/7'])
                }
            };
            setState(newState);
        } catch (error) {
            addToast("Không thể tải cấu hình gói cước.", 'error');
        } finally {
            setFetching(false);
        }
    };

    const safeParse = (val: string, fallback: string[]) => {
        if (!val) return fallback;
        try {
            return JSON.parse(val);
        } catch (e) {
            return val.split(',').map(s => s.trim());
        }
    };

    const handleUpdateField = (pkg: 'basic' | 'premium', field: string, value: string) => {
        setState(prev => ({
            ...prev,
            [pkg]: { ...prev[pkg], [field]: value }
        }));
    };

    const handleFeatureAction = (pkg: 'basic' | 'premium', action: 'add' | 'remove', index?: number, value?: string) => {
        setState(prev => {
            const features = [...prev[pkg].features];
            if (action === 'add' && value) {
                features.push(value);
            } else if (action === 'remove' && index !== undefined) {
                features.splice(index, 1);
            }
            return {
                ...prev,
                [pkg]: { ...prev[pkg], features }
            };
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                pricing_membership_basic_sale: state.basic.sale,
                pricing_membership_basic_original: state.basic.original,
                pricing_membership_basic_description: state.basic.description,
                pricing_membership_basic_features: JSON.stringify(state.basic.features),
                pricing_membership_premium_sale: state.premium.sale,
                pricing_membership_premium_original: state.premium.original,
                pricing_membership_premium_description: state.premium.description,
                pricing_membership_premium_features: JSON.stringify(state.premium.features),
            };

            await api.admin.settings.update(payload);
            await globalUpdateSettings();
            addToast("Cập nhật gói cước thành công.", 'success');
        } catch (error: any) {
            addToast(error.message || "Lỗi lưu dữ liệu.", 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-muted-foreground animate-pulse">Đang tải dữ liệu...</div>;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý Gói cước Membership"
                subtitle="Cấu hình giá bán, mô tả và quyền lợi cho các gói thành viên."
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Basic Package */}
                <Card>
                    <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50">
                        <CardTitle>Gói Cơ Bản (Basic)</CardTitle>
                        <CardDescription>Cấu hình cho gói thành viên tiêu chuẩn.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giá bán (k)</label>
                                <Input
                                    value={state.basic.sale}
                                    onChange={e => handleUpdateField('basic', 'sale', e.target.value)}
                                    placeholder="1.990k"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giá gốc (k)</label>
                                <Input
                                    value={state.basic.original}
                                    onChange={e => handleUpdateField('basic', 'original', e.target.value)}
                                    placeholder="3.500k"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mô tả ngắn</label>
                            <Input
                                value={state.basic.description}
                                onChange={e => handleUpdateField('basic', 'description', e.target.value)}
                                placeholder="Tải không giới hạn..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium flex items-center justify-between">
                                Danh sách Quyền lợi (Features)
                                <Button size="sm" variant="outline" onClick={() => {
                                    const val = window.prompt('Nhập quyền lợi mới:');
                                    if (val) handleFeatureAction('basic', 'add', 0, val);
                                }}>
                                    <Plus className="w-3 h-3 mr-1" /> Thêm
                                </Button>
                            </label>
                            <div className="space-y-2">
                                {state.basic.features.map((f, i) => (
                                    <div key={i} className="flex gap-2 items-center group">
                                        <Input
                                            value={f}
                                            onChange={e => {
                                                const newFeatures = [...state.basic.features];
                                                newFeatures[i] = e.target.value;
                                                setState(prev => ({ ...prev, basic: { ...prev.basic, features: newFeatures } }));
                                            }}
                                            className="flex-1 text-sm font-medium bg-zinc-50/50"
                                        />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
                                            onClick={() => handleFeatureAction('basic', 'remove', i)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Premium Package */}
                <Card className="border-zinc-900 dark:border-zinc-100 shadow-xl overflow-hidden">
                    <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black py-2 px-6 text-[10px] font-bold uppercase tracking-widest text-center">
                        Best Value / VIP
                    </div>
                    <CardHeader>
                        <CardTitle>Gói Premium (VIP)</CardTitle>
                        <CardDescription>Cấu hình cho gói thành viên cao cấp nhất.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giá bán (k)</label>
                                <Input
                                    value={state.premium.sale}
                                    onChange={e => handleUpdateField('premium', 'sale', e.target.value)}
                                    placeholder="4.990k"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giá gốc (k)</label>
                                <Input
                                    value={state.premium.original}
                                    onChange={e => handleUpdateField('premium', 'original', e.target.value)}
                                    placeholder="15.000k"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mô tả ngắn</label>
                            <Input
                                value={state.premium.description}
                                onChange={e => handleUpdateField('premium', 'description', e.target.value)}
                                placeholder="All-in-one + Tư vấn..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium flex items-center justify-between">
                                Danh sách Quyền lợi (Features)
                                <Button size="sm" variant="outline" onClick={() => {
                                    const val = window.prompt('Nhập quyền lợi mới:');
                                    if (val) handleFeatureAction('premium', 'add', 0, val);
                                }}>
                                    <Plus className="w-3 h-3 mr-1" /> Thêm
                                </Button>
                            </label>
                            <div className="space-y-2">
                                {state.premium.features.map((f, i) => (
                                    <div key={i} className="flex gap-2 items-center group">
                                        <Input
                                            value={f}
                                            onChange={e => {
                                                const newFeatures = [...state.premium.features];
                                                newFeatures[i] = e.target.value;
                                                setState(prev => ({ ...prev, premium: { ...prev.premium, features: newFeatures } }));
                                            }}
                                            className="flex-1 text-sm font-medium bg-zinc-50/50 border-zinc-300"
                                        />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
                                            onClick={() => handleFeatureAction('premium', 'remove', i)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={loadData}>Hủy thay đổi</Button>
                <Button onClick={handleSave} className="px-8 shadow-lg shadow-primary/20" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Cập nhật toàn bộ gói cước
                </Button>
            </div>
        </div>
    );
}
