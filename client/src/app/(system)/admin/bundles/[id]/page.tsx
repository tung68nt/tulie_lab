'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { PriceInput } from '@/components/PriceInput';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Switch } from '@/components/Switch';
import { ChevronUp, ChevronDown, Trash2, BookOpen, Plus } from 'lucide-react';

export default function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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

    const toDateTimeLocal = (isoString?: string | null) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch courses (Admin API to get all courses including unpublished)
                const coursesResponse: any = await api.admin.courses.list();
                const coursesList = coursesResponse?.data || [];
                setCourses(Array.isArray(coursesList) ? coursesList : []);

                // Fetch bundle
                const bundle: any = await api.bundles.get(id);
                if (bundle) {
                    setFormData({
                        name: bundle.name,
                        slug: bundle.slug,
                        description: bundle.description || '',
                        originalPrice: bundle.originalPrice,
                        salePrice: bundle.salePrice,
                        discountPercent: bundle.discountPercent || 0,
                        isActive: bundle.isActive,
                        courseIds: bundle.courses?.map((c: any) => c.courseId) || [],
                        startDate: toDateTimeLocal(bundle.startDate),
                        endDate: toDateTimeLocal(bundle.endDate)
                    });
                }
            } catch (error) {
                console.error(error);
                addToast('Lỗi tải dữ liệu', 'error');
                router.push('/admin/bundles');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, router]);

    // Calculate values when course selection changes
    useEffect(() => {
        const total = selectedCourses.reduce((sum, c) => sum + Number(c?.price || 0), 0);
        setFormData(prev => {
            // Update originalPrice and salePrice but ONLY if the courses list is already loaded
            // To avoid overwriting loaded prices with 0 before courses list arrives
            if (courses.length === 0) return prev;

            const salePrice = Math.round(total * (1 - prev.discountPercent / 100));
            return {
                ...prev,
                originalPrice: total,
                salePrice: salePrice
            };
        });
    }, [formData.courseIds, courses.length]);

    // Handle manual price changes
    const handleOriginalPriceChange = (val: number) => {
        setFormData(prev => {
            const discount = prev.originalPrice > 0
                ? Math.round(((prev.originalPrice - prev.salePrice) / prev.originalPrice) * 100)
                : 0;
            return { ...prev, originalPrice: val, discountPercent: discount };
        });
    };

    const handleSalePriceChange = (val: number) => {
        setFormData(prev => {
            const discount = prev.originalPrice > 0
                ? Math.round(((prev.originalPrice - val) / prev.originalPrice) * 100)
                : 0;
            return { ...prev, salePrice: val, discountPercent: discount };
        });
    };

    const handleDiscountChange = (percent: number) => {
        setFormData(prev => {
            const sale = Math.round(prev.originalPrice * (1 - percent / 100));
            return { ...prev, discountPercent: percent, salePrice: sale };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };
            await api.bundles.update(id, payload);
            addToast('Cập nhật combo thành công', 'success');
        } catch (error) {
            console.error(error);
            addToast('Lỗi khi cập nhật combo', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleCourse = (courseId: string) => {
        setFormData(prev => {
            const exists = prev.courseIds.includes(courseId);
            if (exists) {
                return { ...prev, courseIds: prev.courseIds.filter(id => id !== courseId) };
            } else {
                return { ...prev, courseIds: [...prev.courseIds, courseId] };
            }
        });
    };

    const moveCourse = (index: number, direction: 'up' | 'down') => {
        setFormData(prev => {
            const newIds = [...prev.courseIds];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= newIds.length) return prev;

            const temp = newIds[index];
            newIds[index] = newIds[targetIndex];
            newIds[targetIndex] = temp;

            return { ...prev, courseIds: newIds };
        });
    };

    const selectedCourses = formData.courseIds
        .map(id => courses.find(c => c.id === id))
        .filter(Boolean);

    const availableCourses = courses.filter(c => !formData.courseIds.includes(c.id));

    if (loading) return <div className="p-8">Đang tải...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Chỉnh sửa Combo</h1>
                <Button variant="outline" onClick={() => router.push('/admin/bundles')}>Quay lại</Button>
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
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Slug</label>
                            <Input
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mô tả</label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                            <label className="text-sm font-medium">Giá gốc</label>
                            <PriceInput
                                value={formData.originalPrice}
                                onChange={handleOriginalPriceChange}
                                min={0}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giá bán</label>
                            <PriceInput
                                value={formData.salePrice}
                                onChange={handleSalePriceChange}
                                min={0}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giảm giá (%)</label>
                            <Input
                                type="number"
                                value={formData.discountPercent}
                                onChange={e => handleDiscountChange(Number(e.target.value))}
                                min={0}
                                max={100}
                                placeholder="0"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Cấu trúc lộ trình học (theo thứ tự)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Selected Courses with Ordering */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground tracking-wider">Thứ tự bài học/khóa học</h3>
                            {selectedCourses.length === 0 ? (
                                <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/20">
                                    <p className="text-muted-foreground">Chưa có khóa học nào trong lộ trình. Hãy chọn từ danh sách bên dưới.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedCourses.map((course: any, index: number) => (
                                        <div
                                            key={course.id}
                                            className="flex items-center gap-4 bg-card border rounded-lg p-3 shadow-sm group hover:border-primary/50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate text-foreground">{course.title}</p>
                                                <p className="text-xs text-muted-foreground">{Number(course.price || 0).toLocaleString()}đ</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => moveCourse(index, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    <ChevronUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => moveCourse(index, 'down')}
                                                    disabled={index === selectedCourses.length - 1}
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                    onClick={() => toggleCourse(course.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr className="border-dashed" />

                        {/* Available Courses Pool */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground">Thêm khóa học vào lộ trình</h3>
                            <div className="grid gap-2 max-h-[300px] overflow-y-auto border rounded-xl p-3 bg-muted/10">
                                {availableCourses.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground p-4">Tất cả khóa học đã được chọn.</p>
                                ) : (
                                    availableCourses.map((course: any) => (
                                        <div
                                            key={course.id}
                                            onClick={() => toggleCourse(course.id)}
                                            className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted cursor-pointer transition-colors group"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-foreground mb-0.5">{course.title}</p>
                                                <p className="text-xs text-muted-foreground">{Number(course.price || 0).toLocaleString()}đ</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </Button>
            </form>
        </div>
    );
}
