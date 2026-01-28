'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { ArrowLeft, Save, AlertTriangle, ArrowUp, ArrowDown, X, Edit, Eye, EyeOff, PlusCircle, Trash2, Zap, BookOpen, Package } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/Switch';

import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';

import { DEFAULT_LANDING_PAGE_SECTIONS } from '@/lib/defaultContent';
import { SectionLibraryModal } from '@/components/system/admin/SectionLibraryModal';
import { SectionEditorModal } from '@/components/system/admin/SectionEditorModal';
import { SectionTemplate, SECTION_TEMPLATES } from '@/lib/section-templates';
import { Section } from '@/types/sections';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

export default function EditLandingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');
    const { addToast } = useToast();
    const confirm = useConfirm();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isNew);
    const [mode, setMode] = useState<'builder' | 'html' | 'json'>('builder'); // 'builder', 'html', or 'json'

    // UI States
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

    const [courses, setCourses] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        isActive: true,
        sectionsJSON: JSON.stringify(DEFAULT_LANDING_PAGE_SECTIONS, null, 2),
        htmlContent: '', // For HTML mode
        // Main product flags
        useMainCourse: true,
        useMainProduct: false,
        courseId: null as string | null,
        productId: null as string | null,

        // Upsell flags
        useUpsellCourse: true,
        useUpsellProduct: false,
        upsellCourseId: null as string | null,
        upsellProductId: null as string | null,
        upsellPrice: '' as string | number,
        type: 'LANDING',
        isHomepage: false,
    });

    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    // Helper: Slugify function
    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD') // Split accents
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/\s+/g, '-') // Spaces to hyphens
            .replace(/[^\w\-]+/g, '') // Remove non-word chars
            .replace(/\-\-+/g, '-') // Collapse hyphens
            .replace(/^-+/, '') // Trim start
            .replace(/-+$/, ''); // Trim end
    };

    // Auto-generate slug when title changes (if not manually edited)
    useEffect(() => {
        if (isNew && !isSlugManuallyEdited && formData.title) {
            setFormData(prev => ({ ...prev, slug: slugify(formData.title) }));
        }
    }, [formData.title, isNew, isSlugManuallyEdited]);

    useEffect(() => {
        if (isNew && typeParam) {
            setFormData(prev => ({ ...prev, type: typeParam }));
        }

        // Fetch courses and products for selection
        api.admin.courses.list()
            .then((res: any) => setCourses((res as any).data || []))
            .catch((err: any) => console.error('Failed to load courses', err));

        api.products.list()
            .then((res: any) => setProducts((res as any).data || []))
            .catch((err: any) => console.error('Failed to load products', err));
    }, []);

    useEffect(() => {
        if (!isNew) {
            loadPage();
        }
    }, [isNew]);

    const loadPage = async () => {
        try {
            setFetching(true);
            const res = await api.landingPages.get(id);
            const page = res as any; // Cast to any to avoid unknown type errors

            // Check if it has HTML content or JSON sections
            const isHtmlMode = page.htmlContent && page.htmlContent.length > 0;
            setMode(isHtmlMode ? 'html' : 'builder');

            // If sections are empty (e.g. fresh from seed without json content), load default sections
            // This ensures the editor matches the default 'hardcoded' landing page until saved.
            const hasSections = page.sections && Array.isArray(page.sections) && page.sections.length > 0;
            const initialSections = hasSections ? page.sections : DEFAULT_LANDING_PAGE_SECTIONS;

            setFormData({
                title: page.title,
                slug: page.slug,
                description: page.description || '',
                isActive: page.isActive,
                sectionsJSON: JSON.stringify(initialSections, null, 2),
                htmlContent: page.htmlContent || '',

                // Main product flags
                useMainCourse: !!page.courseId || (!page.courseId && !page.productId), // Default to course if nothing
                useMainProduct: !!page.productId,
                courseId: page.courseId || null,
                productId: page.productId || null,

                // Upsell flags
                useUpsellCourse: !!page.upsellCourseId,
                useUpsellProduct: !!page.upsellProductId,
                upsellCourseId: page.upsellCourseId || null,
                upsellProductId: page.upsellProductId || null,

                upsellPrice: page.upsellPrice || '',
                type: page.type || 'LANDING',
                isHomepage: page.isHomepage || false
            });
        } catch (error: any) {
            console.error('Failed to load page:', error);
            const message = error.message || 'Không thể tải thông tin trang';
            addToast(message, 'error');
            router.push('/admin/landing-pages');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                isActive: formData.isActive,
                type: formData.type,
                sections: mode !== 'html' ? JSON.parse(formData.sectionsJSON || '[]') : [],
                htmlContent: mode === 'html' ? formData.htmlContent : null,

                // Send IDs only if their respective flags are enabled
                courseId: formData.useMainCourse ? formData.courseId : null,
                productId: formData.useMainProduct ? formData.productId : null,

                upsellCourseId: formData.useUpsellCourse ? formData.upsellCourseId : null,
                upsellProductId: formData.useUpsellProduct ? formData.upsellProductId : null,
                upsellPrice: formData.upsellPrice ? Number(formData.upsellPrice) : null
            };

            console.log('Submitting payload:', payload);

            if (isNew) {
                await api.landingPages.create(payload);
                addToast('Tạo trang thành công', 'success');
                if (payload.type === 'SYSTEM') {
                    router.push('/admin/system-pages');
                } else {
                    router.push('/admin/landing-pages');
                }
            } else {
                await api.landingPages.update(id, payload);
                addToast('Cập nhật trang thành công', 'success');
                // No redirect for updates to allow continuous editing
            }
        } catch (error: any) {
            console.error('Submit error:', error);
            // Fix: Check for error.response.data.error as well
            const message = error.response?.data?.error || error.response?.data?.message || 'Có lỗi xảy ra';
            addToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Helper to get sections array safely
    const getSections = (): Section[] => {
        try {
            const sections = JSON.parse(formData.sectionsJSON);
            return Array.isArray(sections) ? sections : [];
        } catch {
            return [];
        }
    };

    // Helper to update sections
    const updateSections = (newSections: Section[]) => {
        setFormData({ ...formData, sectionsJSON: JSON.stringify(newSections, null, 2) });
    };

    const handleSelectTemplate = (template: SectionTemplate) => {
        const currentSections = getSections();
        // Generate a unique ID for the new section
        const uniqueId = `${template.data.type}-${Date.now()}`;
        const newSection = {
            ...template.data,
            id: uniqueId
        };
        const newSections = [...currentSections, newSection];
        updateSections(newSections);
        addToast(`Đã thêm section "${template.name}"`, 'success');
        setIsLibraryOpen(false);
    };

    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        const sections = getSections();
        const newSections = [...sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        updateSections(newSections);
    };

    const handleRemoveSection = async (index: number) => {
        if (await confirm({
            title: 'Xóa Section',
            message: 'Bạn có chắc chắn muốn xóa section này? Hành động này không thể hoàn tác.',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        })) {
            const sections = getSections();
            const newSections = sections.filter((_, i) => i !== index);
            updateSections(newSections);
            addToast('Đã xóa section', 'success');
        }
    };

    const handleToggleVisibility = (index: number) => {
        const sections = getSections();
        const newSections = [...sections];
        newSections[index].isVisible = newSections[index].isVisible === undefined ? false : !newSections[index].isVisible;
        updateSections(newSections);
    };

    if (fetching) return <div>Loading...</div>;

    const sections = getSections();

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <AdminPageHeader
                title={isNew ? (formData.type === 'SYSTEM' ? 'Tạo trang mới' : 'Tạo Landing Page') : (formData.type === 'SYSTEM' ? 'Chỉnh sửa trang thông tin' : 'Chỉnh sửa Landing Page')}
                backUrl={formData.type === 'SYSTEM' ? '/admin/system-pages' : '/admin/landing-pages'}
            >
                {!isNew && (
                    <div className="flex items-center gap-2">
                        {(formData.slug || formData.isHomepage) && (
                            <Link href={formData.isHomepage ? '/' : (formData.type === 'SYSTEM' ? `/${formData.slug}` : `/p/${formData.slug}`)} target="_blank">
                                <Button variant="outline" className="gap-2">
                                    <Eye size={16} /> Xem trang thực tế
                                </Button>
                            </Link>
                        )}
                        <Button
                            type="button"
                            variant={formData.isHomepage ? "default" : "outline"}
                            onClick={async () => {
                                if (formData.isHomepage) return;
                                if (await confirm({
                                    title: 'Đặt làm Trang chủ',
                                    message: 'Bạn có chắc chắn muốn đặt trang này làm Trang chủ? Trang chủ cũ (nếu có) sẽ bị thay thế.',
                                    confirmText: 'Đồng ý',
                                    cancelText: 'Hủy'
                                })) {
                                    try {
                                        await api.landingPages.setHomepage(id);
                                        setFormData(prev => ({ ...prev, isHomepage: true }));
                                        addToast('Đã đặt làm trang chủ thành công', 'success');
                                    } catch (error) {
                                        addToast('Có lỗi xảy ra', 'error');
                                    }
                                }
                            }}
                            disabled={formData.isHomepage}
                        >
                            {formData.isHomepage ? 'Đang là Trang chủ' : 'Đặt làm Trang chủ'}
                        </Button>
                    </div>
                )}
            </AdminPageHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardContent className="p-6 pt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tiêu đề trang</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug (Đường dẫn)</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.slug}
                                    onChange={e => {
                                        setFormData({ ...formData, slug: e.target.value });
                                        setIsSlugManuallyEdited(true);
                                    }}
                                    placeholder="vi-du-trang-khuyen-mai"
                                />
                                <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                                    <span>URL: {formData.type === 'SYSTEM' ? '/' : '/p/'}{formData.slug}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mô tả (SEO)</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-border">
                            {/* Main Product Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Sản phẩm chính (Được đăng ký khi thanh toán)</label>

                                {/* Type Toggles */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, useMainCourse: !formData.useMainCourse })}
                                        className={`flex items-center justify-center gap-2 flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${formData.useMainCourse ? 'bg-foreground text-background border-foreground' : 'bg-background border-input hover:bg-muted'}`}
                                    >
                                        <BookOpen size={16} /> Khóa học
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, useMainProduct: !formData.useMainProduct })}
                                        className={`flex items-center justify-center gap-2 flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${formData.useMainProduct ? 'bg-foreground text-background border-foreground' : 'bg-background border-input hover:bg-muted'}`}
                                    >
                                        <Package size={16} /> Template
                                    </button>
                                </div>

                                {/* Conditional Dropdowns - Show both if enabled */}
                                <div className="space-y-3">
                                    {formData.useMainCourse && (
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground w-full block">Chọn khóa học</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.courseId || ''}
                                                onChange={e => setFormData({ ...formData, courseId: e.target.value || null })}
                                            >
                                                <option value="">-- Chọn khóa học --</option>
                                                {courses.map((course: any) => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.title} {course.price ? `(${Number(course.price).toLocaleString()}đ)` : '(Miễn phí)'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {formData.useMainProduct && (
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground w-full block">Chọn Template</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.productId || ''}
                                                onChange={e => setFormData({ ...formData, productId: e.target.value || null })}
                                            >
                                                <option value="">-- Chọn sản phẩm --</option>
                                                {products.map((product: any) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} {product.price ? `(${Number(product.price).toLocaleString()}đ)` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Upsell Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Up-sell Add-on (Tùy chọn)</label>

                                {/* Type Toggles */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, useUpsellCourse: !formData.useUpsellCourse })}
                                        className={`flex items-center justify-center gap-2 flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${formData.useUpsellCourse ? 'bg-foreground text-background border-foreground' : 'bg-background border-input hover:bg-muted'}`}
                                    >
                                        <BookOpen size={16} /> Khóa học
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, useUpsellProduct: !formData.useUpsellProduct })}
                                        className={`flex items-center justify-center gap-2 flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${formData.useUpsellProduct ? 'bg-foreground text-background border-foreground' : 'bg-background border-input hover:bg-muted'}`}
                                    >
                                        <Package size={16} /> Template
                                    </button>
                                </div>

                                {/* Conditional Dropdowns */}
                                <div className="space-y-3">
                                    {formData.useUpsellCourse && (
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground w-full block">Upsell Khóa học</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.upsellCourseId || ''}
                                                onChange={e => setFormData({ ...formData, upsellCourseId: e.target.value || null })}
                                            >
                                                <option value="">-- Chọn khóa học upsell --</option>
                                                {courses.map((course: any) => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.title} {course.price ? `(${Number(course.price).toLocaleString()}đ)` : '(Miễn phí)'}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {formData.useUpsellProduct && (
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground w-full block">Upsell Template</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.upsellProductId || ''}
                                                onChange={e => setFormData({ ...formData, upsellProductId: e.target.value || null })}
                                            >
                                                <option value="">-- Chọn sản phẩm upsell --</option>
                                                {products.map((product: any) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} {product.price ? `(${Number(product.price).toLocaleString()}đ)` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Upsell Price Override */}
                                {(formData.useUpsellCourse || formData.useUpsellProduct) && (
                                    <div className="pl-3 border-l-2 border-muted">
                                        <label className="text-xs font-medium mb-1 block">Giá Upsell (để trống = giá gốc)</label>
                                        <input
                                            type="text"
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                            value={formData.upsellPrice ? Number(formData.upsellPrice).toLocaleString('vi-VN') : ''}
                                            onChange={e => {
                                                const rawValue = e.target.value.replace(/\./g, '');
                                                if (/^\d*$/.test(rawValue)) {
                                                    setFormData({ ...formData, upsellPrice: rawValue });
                                                }
                                            }}
                                            placeholder="VD: 199.000 (Áp dụng cho cả 2 nếu chọn)"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onChange={checked => setFormData({ ...formData, isActive: checked })}
                            />
                            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}>
                                Kích hoạt (Hiển thị công khai)
                            </label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 md:p-6 pt-6 space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-muted/30 p-3 rounded-lg mb-4 gap-4">
                            <div className="flex items-center gap-1 md:gap-2 w-full md:w-auto overflow-x-auto p-1">
                                <button
                                    type="button"
                                    onClick={() => setMode('builder')}
                                    className={`h-9 px-3 text-sm font-medium rounded-md transition-all whitespace-nowrap ${mode === 'builder' ? 'bg-white shadow text-black' : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    Page Builder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('json')}
                                    className={`h-9 px-3 text-sm font-medium rounded-md transition-all whitespace-nowrap ${mode === 'json' ? 'bg-white shadow text-black' : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    JSON
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('html')}
                                    className={`h-9 px-3 text-sm font-medium rounded-md transition-all whitespace-nowrap ${mode === 'html' ? 'bg-white shadow text-black' : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    HTML
                                </button>
                            </div>
                            {mode === 'builder' && (
                                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="default"
                                        onClick={() => setIsLibraryOpen(true)}
                                        className="h-9 px-3 text-sm font-medium rounded-md transition-all whitespace-nowrap bg-white shadow text-black hover:bg-neutral-100 border border-neutral-200"
                                    >
                                        <PlusCircle size={16} />
                                        <span>Thêm Section</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="default"
                                        onClick={async () => {
                                            if (await confirm({
                                                title: 'Xóa tất cả Sections',
                                                message: 'Bạn có chắc chắn muốn xóa tất cả sections không? Hành động này không thể hoàn tác.',
                                                confirmText: 'Xóa Tất Cả',
                                                cancelText: 'Hủy',
                                                variant: 'danger'
                                            })) {
                                                updateSections([]);
                                                addToast('Đã xóa tất cả sections', 'success');
                                            }
                                        }}
                                        className="h-9 px-3 text-sm font-medium rounded-md transition-all whitespace-nowrap bg-white shadow text-black hover:bg-neutral-100 border border-neutral-200"
                                        title="Xóa tất cả sections"
                                    >
                                        <Trash2 size={16} />
                                        <span className="hidden sm:inline">Clear All</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="default"
                                        onClick={async () => {
                                            if (await confirm({
                                                title: 'Thêm Section Mẫu (Style Cũ)',
                                                message: 'Thêm tất cả section mẫu với giao diện tiêu chuẩn?',
                                                confirmText: 'Thêm Ngay',
                                                cancelText: 'Hủy',
                                                variant: 'info'
                                            })) {
                                                const testSections = SECTION_TEMPLATES
                                                    .filter((t: any) => t.id !== 'custom-html')
                                                    .map((template: any, index: number) => ({
                                                        ...template.data,
                                                        id: `${template.data.type}-${Date.now()}-${index}`,
                                                        isVisible: true,
                                                        appearance: 'standard',
                                                        animation: 'none'
                                                    }));

                                                const currentSections = getSections();
                                                updateSections([...currentSections, ...testSections]);
                                                addToast(`Đã nạp ${testSections.length} section style tiêu chuẩn`, 'success');
                                            }
                                        }}
                                        className="h-9 px-3 text-sm font-medium rounded-md transition-all whitespace-nowrap bg-white shadow text-black hover:bg-neutral-100 border border-neutral-200"
                                        title="Nạp Demo với style tiêu chuẩn"
                                    >
                                        <Zap size={16} />
                                        <span className="hidden sm:inline">Nạp Demo</span>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {mode === 'builder' ? (
                            <div className="space-y-3">
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4 px-1">Danh sách Sections</h3>

                                <div className="space-y-2">
                                    {sections.map((section, index) => (
                                        <div
                                            key={`${section.id}-${index}`}
                                            className={`flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-card-foreground shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700 ${section.isVisible === false ? 'opacity-50 grayscale' : ''}`}
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-xs shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-zinc-900 dark:text-zinc-50 truncate capitalize">
                                                        {(() => {
                                                            const template = SECTION_TEMPLATES.find((t: any) => t.data.type === section.type);
                                                            return template ? template.name : `${section.type.replace('-', ' ')} Section`;
                                                        })()}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate max-w-[300px]">{section.title || section.id}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" onClick={() => setEditingSectionIndex(index)} title="Chỉnh sửa">
                                                    <Edit size={14} className="text-zinc-600 dark:text-zinc-400" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" onClick={() => handleToggleVisibility(index)} title={section.isVisible === false ? 'Hiện' : 'Ẩn'}>
                                                    {section.isVisible === false ? <EyeOff size={14} className="text-zinc-600 dark:text-zinc-400" /> : <Eye size={14} className="text-zinc-600 dark:text-zinc-400" />}
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" disabled={index === 0} onClick={() => handleMoveSection(index, 'up')} title="Lên">
                                                    <ArrowUp size={14} className="text-zinc-600 dark:text-zinc-400" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" disabled={index === sections.length - 1} onClick={() => handleMoveSection(index, 'down')} title="Xuống">
                                                    <ArrowDown size={14} className="text-zinc-600 dark:text-zinc-400" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" onClick={() => handleRemoveSection(index)} title="Xóa">
                                                    <Trash2 size={14} className="text-zinc-600 dark:text-zinc-400" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {sections.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                                            <p>Chưa có section nào. Nhấn "Thêm Section" để bắt đầu.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : mode === 'json' ? (
                            <div className="relative space-y-2">
                                <textarea
                                    className="flex min-h-[500px] w-full rounded-md border border-input bg-zinc-950 text-zinc-100 font-mono px-4 py-4 text-sm leading-relaxed"
                                    value={formData.sectionsJSON}
                                    onChange={e => setFormData({ ...formData, sectionsJSON: e.target.value })}
                                    spellCheck={false}
                                    placeholder='[{"id": "hero", "type": "hero", ...}]'
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <p>
                                        Chỉnh sửa trực tiếp cấu hình JSON. Cẩn thận với cú pháp!
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            try {
                                                const formatted = JSON.stringify(JSON.parse(formData.sectionsJSON), null, 2);
                                                setFormData({ ...formData, sectionsJSON: formatted });
                                                addToast('Đã định dạng JSON', 'success');
                                            } catch (e) {
                                                addToast('JSON không hợp lệ, không thể định dạng', 'error');
                                            }
                                        }}
                                        className="text-primary hover:underline"
                                    >
                                        Format JSON
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative space-y-2">
                                <textarea
                                    className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-4 py-4 text-sm leading-relaxed"
                                    value={formData.htmlContent}
                                    onChange={e => setFormData({ ...formData, htmlContent: e.target.value })}
                                    spellCheck={false}
                                    placeholder="<div class='my-custom-section'>...</div>"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Nhập mã HTML/CSS. Nội dung sẽ được render trực tiếp thông qua dangerouslySetInnerHTML.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-between items-center pt-4">
                    <Link href={formData.type === 'SYSTEM' ? '/admin/system-pages' : '/admin/landing-pages'}>
                        <Button type="button" variant="ghost">Hủy bỏ</Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        {!isNew && (formData.slug || formData.isHomepage) && (
                            <Link href={formData.isHomepage ? '/' : (formData.type === 'SYSTEM' ? `/${formData.slug}` : `/p/${formData.slug}`)} target="_blank">
                                <Button type="button" variant="outline" className="gap-2">
                                    <Eye size={16} /> Xem trang
                                </Button>
                            </Link>
                        )}
                        <Button type="submit" disabled={loading} className="flex items-center gap-2">
                            <Save size={16} />
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </div>
                </div>
            </form>

            <SectionLibraryModal
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelect={handleSelectTemplate}
            />

            {
                editingSectionIndex !== null && (
                    <SectionEditorModal
                        isOpen={editingSectionIndex !== null}
                        section={sections[editingSectionIndex]}
                        onClose={() => setEditingSectionIndex(null)}
                        onSave={(updatedSection: Section) => {
                            const newSections = [...sections];
                            newSections[editingSectionIndex] = updatedSection;
                            updateSections(newSections);
                            setEditingSectionIndex(null);
                            addToast('Đã cập nhật section', 'success');
                        }}
                    />
                )
            }
        </div >
    );
}
