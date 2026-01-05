'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Switch } from '@/components/Switch';

export default function NewBundlePage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        originalPrice: 0,
        salePrice: 0,
        discountPercent: 0,
        isActive: true,
        courseIds: [] as string[],
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        // Fetch published courses
        api.courses.list({ published: true })
            .then((data: any) => setCourses(Array.isArray(data) ? data : []))
            .catch(() => addToast('Không thể tải danh sách khóa học', 'error'));
    }, []);

    // Calculate discount percent automatically when prices change
    useEffect(() => {
        if (formData.originalPrice > 0 && formData.salePrice > 0) {
            const percent = Math.round(((formData.originalPrice - formData.salePrice) / formData.originalPrice) * 100);
            setFormData(prev => ({ ...prev, discountPercent: percent }));
        }
    }, [formData.originalPrice, formData.salePrice]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };
            await api.bundles.create(payload);
            addToast('Đã tạo combo thành công', 'success');
            router.push('/admin/bundles');
        } catch (error) {
            console.error(error);
            addToast('Lỗi khi tạo combo', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleCourse = (courseId: string) => {
        setFormData(prev => {
            const exists = prev.courseIds.includes(courseId);
            return {
                ...prev,
                courseIds: exists
                    ? prev.courseIds.filter(id => id !== courseId)
                    : [...prev.courseIds, courseId]
            };
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Tạo Combo Mới</h1>
                <Button variant="outline" onClick={() => router.back()}>Hủy</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin cơ bản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tên Combo</label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="vd: Combo Fullstack Developer"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Slug (tùy chọn)</label>
                            <Input
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="combo-fullstack-developer"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mô tả</label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Mô tả về gói combo này..."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-2">
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

                        <div className="flex items-center gap-4 pt-2">
                            <label className="text-sm font-medium">Trạng thái:</label>
                            <div className="flex items-center gap-2">
                                <Switch checked={formData.isActive} onChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                                <span className="text-sm text-muted-foreground">{formData.isActive ? 'Đang hoạt động' : 'Tạm ẩn'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thiết lập giá</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giá gốc (Tổng giá trị)</label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.originalPrice}
                                onChange={e => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giá bán (Combo)</label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.salePrice}
                                onChange={e => setFormData({ ...formData, salePrice: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giảm giá (%)</label>
                            <Input
                                type="number"
                                disabled
                                value={formData.discountPercent}
                                className="bg-muted"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Chọn khóa học trong gói</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <span className="text-sm font-medium">Đã chọn: {formData.courseIds.length} khóa học</span>
                            </div>
                            <div className="grid gap-2 max-h-[400px] overflow-y-auto border rounded-md p-2">
                                {courses.map(course => (
                                    <div
                                        key={course.id}
                                        onClick={() => toggleCourse(course.id)}
                                        className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${formData.courseIds.includes(course.id)
                                            ? 'bg-primary/10 border-primary'
                                            : 'hover:bg-muted'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${formData.courseIds.includes(course.id) ? 'bg-primary border-primary' : 'border-muted-foreground'
                                            }`}>
                                            {formData.courseIds.includes(course.id) && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{course.title}</p>
                                            <p className="text-xs text-muted-foreground">{course.price?.toLocaleString()}đ</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Đang tạo...' : 'Tạo Combo'}
                </Button>
            </form>
        </div>
    );
}
