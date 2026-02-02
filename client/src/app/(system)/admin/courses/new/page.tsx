'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { Switch } from '@/components/Switch';
import { Select } from '@/components/Select';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { PriceInput } from '@/components/PriceInput';
import { MultiSelect } from '@/components/MultiSelect';
export default function CreateCoursePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const [instructors, setInstructors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [allAddOns, setAllAddOns] = useState<any[]>([]);
    const [slugError, setSlugError] = useState<string | null>(null);
    const [checkingSlug, setCheckingSlug] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        price: 0,
        isPublished: false,
        instructorId: '',
        thumbnail: '',
        introVideoUrl: '',
        learningOutcomes: '',
        deploymentStatus: 'RELEASED',
        tag: 'NONE',
        categoryId: '',
        level: 'ALL',
        addOnIds: [] as string[]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [instructorsList, categoriesList, addOnsList] = await Promise.all([
                    api.instructors.list().catch(() => []),
                    api.categories.list().catch(() => []),
                    api.pricingAddOns.list().catch(() => [])
                ]);
                setInstructors(Array.isArray(instructorsList) ? instructorsList : []);
                setCategories(Array.isArray(categoriesList) ? categoriesList : []);
                setAllAddOns(Array.isArray(addOnsList) ? addOnsList : []);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    // Auto-generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/đ/g, 'd')
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
            .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
            .replace(/[ìíịỉĩ]/g, 'i')
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
            .replace(/[ùúụủũưừứựửữ]/g, 'u')
            .replace(/[ỳýỵỷỹ]/g, 'y')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            title: value,
            slug: generateSlug(value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await api.admin.courses.create(formData) as any;
            addToast('Tạo khóa học thành công!', 'success');
            // Redirect to edit page to add lessons
            router.push(`/admin/courses/${result.id}`);
        } catch (error) {
            console.error(error);
            addToast('Tạo khóa học thất bại', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Tạo khóa học mới" backUrl="/admin/courses" />

            <div className="grid gap-8">
                {/* Course Details Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin khóa học</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tiêu đề</label>
                                <Input
                                    placeholder="Tên khóa học"
                                    value={formData.title}
                                    onChange={e => handleTitleChange(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Đường dẫn (Slug)</label>
                                <Input
                                    placeholder="ten-khoa-hoc"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL: /courses/{formData.slug || 'ten-khoa-hoc'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mô tả</label>
                                <textarea
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả chi tiết về khóa học, nội dung, đối tượng học viên..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bạn sẽ học được gì (Mỗi ý 1 dòng)</label>
                                <textarea
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                                    value={formData.learningOutcomes}
                                    onChange={e => setFormData({ ...formData, learningOutcomes: e.target.value })}
                                    placeholder="- Hiểu rõ về...\n- Thực hành..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">URL Thumbnail (Ảnh bìa)</label>
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.thumbnail}
                                    onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                                />
                                {formData.thumbnail && (
                                    <div className="mt-2 rounded-lg overflow-hidden border aspect-video bg-muted">
                                        <img
                                            src={formData.thumbnail}
                                            alt="Thumbnail preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">URL Video giới thiệu</label>
                                <Input
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={formData.introVideoUrl}
                                    onChange={e => setFormData({ ...formData, introVideoUrl: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <PriceInput
                                    label="Học phí (VNĐ)"
                                    value={formData.price}
                                    onChange={val => setFormData({ ...formData, price: val })}
                                    placeholder="0"
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Trạng thái</label>
                                    <div className="flex items-center h-10">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <Switch
                                                checked={formData.isPublished}
                                                onChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                                            />
                                            <span className={formData.isPublished ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                                                {formData.isPublished ? 'Đã xuất bản' : 'Nháp'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tình trạng ra mắt</label>
                                    <div className="relative">
                                        <Select
                                            value={formData.deploymentStatus}
                                            onChange={(val) => setFormData({ ...formData, deploymentStatus: val })}
                                            options={[
                                                { value: 'RELEASED', label: 'Đã ra mắt' },
                                                { value: 'COMING_SOON', label: 'Sắp ra mắt (Coming Soon)' },
                                                { value: 'UPDATING', label: 'Đang cập nhật (Updating)' }
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nhãn nổi bật (Tag)</label>
                                    <div className="relative">
                                        <Select
                                            value={formData.tag}
                                            onChange={(val) => setFormData({ ...formData, tag: val })}
                                            options={[
                                                { value: 'NONE', label: '-- Không --' },
                                                { value: 'BEST_SELLER', label: 'Best Seller' },
                                                { value: 'HOT', label: 'Hot' },
                                                { value: 'NEW', label: 'Mới (New)' },
                                                { value: 'DISCOUNT', label: 'Giảm giá (Discount)' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category and Level */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Danh mục</label>
                                    <Select
                                        value={formData.categoryId}
                                        onChange={(val) => setFormData({ ...formData, categoryId: val })}
                                        options={[
                                            { value: '', label: '-- Chưa phân loại --' },
                                            ...categories.map((c: any) => ({ value: c.id, label: c.name }))
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Trình độ</label>
                                    <Select
                                        value={formData.level}
                                        onChange={(val) => setFormData({ ...formData, level: val })}
                                        options={[
                                            { value: 'ALL', label: 'Tất cả trình độ' },
                                            { value: 'BEGINNER', label: 'Cơ bản (Beginner)' },
                                            { value: 'INTERMEDIATE', label: 'Trung cấp (Intermediate)' },
                                            { value: 'ADVANCED', label: 'Nâng cao (Advanced)' }
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Instructor Selection */}
                            <div className="space-y-2">
                                <label htmlFor="instructorId" className="text-sm font-medium">Giảng viên</label>
                                <Select
                                    value={formData.instructorId}
                                    onChange={(val) => setFormData({ ...formData, instructorId: val })}
                                    options={[
                                        { value: '', label: '-- Chọn giảng viên --' },
                                        ...instructors.map((i: any) => ({ value: i.id, label: i.name }))
                                    ]}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Gói Add-on bổ sung (Upsell)</label>
                                <MultiSelect
                                    options={allAddOns.map(a => ({ value: a.id, label: `${a.name} (${Number(a.priceAddon).toLocaleString('vi-VN')}đ)` }))}
                                    selected={formData.addOnIds}
                                    onChange={(vals) => setFormData({ ...formData, addOnIds: vals })}
                                    placeholder="Chọn các gói add-on..."
                                />
                                <p className="text-xs text-muted-foreground">Các gói này sẽ hiển thị như tùy chọn mua thêm khi thanh toán khóa học này.</p>
                            </div>

                            <div className="pt-4 flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.push('/admin/courses')}>
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Đang tạo...' : 'Tạo khóa học'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Preview & Tips */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Xem trước</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border overflow-hidden">
                                {/* Thumbnail Preview */}
                                <div className="aspect-video bg-muted flex items-center justify-center">
                                    {formData.thumbnail ? (
                                        <img
                                            src={formData.thumbnail}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm">Chưa có ảnh bìa</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg line-clamp-2">
                                        {formData.title || 'Tên khóa học'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {formData.description || 'Mô tả khóa học...'}
                                    </p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="font-bold">
                                            {formData.price === 0 ? 'Miễn phí' : `${formData.price.toLocaleString('vi-VN')}đ`}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded font-medium ${formData.isPublished ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                                            {formData.isPublished ? 'Xuất bản' : 'Nháp'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>💡 Gợi ý</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>• Tiêu đề ngắn gọn, rõ ràng (50-80 ký tự)</p>
                            <p>• Mô tả chi tiết nội dung, lợi ích của khóa học</p>
                            <p>• Sử dụng ảnh bìa chất lượng cao (16:9)</p>
                            <p>• Sau khi tạo, bạn có thể thêm bài học và tài liệu</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
