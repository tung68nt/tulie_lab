'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { ArrowLeft, Save, AlertTriangle, ArrowUp, ArrowDown, X, Edit, Eye, EyeOff, PlusCircle, Trash2, Zap } from 'lucide-react';
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
    const [mode, setMode] = useState<'builder' | 'html'>('builder'); // 'builder' or 'html'

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
        // Main product selection
        mainType: 'course' as 'course' | 'product',
        courseId: null as string | null,
        productId: null as string | null,
        // Upsell selection
        upsellType: 'course' as 'course' | 'product',
        upsellCourseId: null as string | null,
        upsellProductId: null as string | null,
        upsellPrice: '' as string | number,
        type: 'LANDING',
    });

    useEffect(() => {
        if (isNew && typeParam) {
            setFormData(prev => ({ ...prev, type: typeParam }));
        }

        // Fetch courses and products for selection
        api.admin.courses.list()
            .then(res => setCourses(res as any[]))
            .catch(err => console.error('Failed to load courses', err));

        api.products.list()
            .then(res => setProducts((res as any).data || []))
            .catch(err => console.error('Failed to load products', err));
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
                // Main product - determine type based on which ID exists
                mainType: page.productId ? 'product' : 'course',
                courseId: page.courseId || null,
                productId: page.productId || null,
                // Upsell - determine type based on which ID exists
                upsellType: page.upsellProductId ? 'product' : 'course',
                upsellCourseId: page.upsellCourseId || null,
                upsellProductId: page.upsellProductId || null,
                upsellPrice: page.upsellPrice || '',
                type: page.type || 'LANDING'
            });
        } catch (error) {
            console.error('Failed to load page:', error);
            addToast('Không thể tải thông tin trang', 'error');
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
                sections: mode === 'builder' ? JSON.parse(formData.sectionsJSON) : [],
                htmlContent: mode === 'html' ? formData.htmlContent : null,
                // Main product - only send the selected type's ID
                courseId: formData.mainType === 'course' ? formData.courseId : null,
                productId: formData.mainType === 'product' ? formData.productId : null,
                // Upsell - only send the selected type's ID
                upsellCourseId: formData.upsellType === 'course' ? formData.upsellCourseId : null,
                upsellProductId: formData.upsellType === 'product' ? formData.upsellProductId : null,
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
            addToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
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
                title={isNew ? 'Tạo trang mới' : 'Chỉnh sửa trang'}
                backUrl="/admin/landing-pages"
            >
                {!isNew && formData.slug && (
                    <Link href={`/p/${formData.slug}`} target="_blank">
                        <Button variant="outline" className="gap-2">
                            <Eye size={16} /> Xem trang thực tế
                        </Button>
                    </Link>
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
                                <label className="text-sm font-medium">Slug (URL)</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                    placeholder="vi-du-trang-khuyen-mai"
                                />
                                <p className="text-xs text-muted-foreground">URL: /p/{formData.slug}</p>
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

                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                            {/* Main Product Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Sản phẩm chính (Được đăng ký khi thanh toán)</label>

                                {/* Type Toggle */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mainType: 'course', productId: null })}
                                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${formData.mainType === 'course' ? 'bg-foreground text-background border-foreground' : 'bg-background border-input hover:bg-muted'}`}
                                    >
                                        📚 Khóa học
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mainType: 'product', courseId: null })}
                                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${formData.mainType === 'product' ? 'bg-foreground text-background border-foreground' : 'bg-background border-input hover:bg-muted'}`}
                                    >
                                        📦 Template/Sản phẩm
                                    </button>
                                </div>

                                {/* Conditional Dropdown */}
                                {formData.mainType === 'course' ? (
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
                                ) : (
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
                                )}
                            </div>

                            {/* Upsell Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Up-sell Add-on (Tùy chọn)</label>

                                {/* Type Toggle */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, upsellType: 'course', upsellProductId: null })}
                                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${formData.upsellType === 'course' ? 'bg-foreground text-background border-foreground' : 'bg-background border-input hover:bg-muted'}`}
                                    >
                                        📚 Khóa học
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, upsellType: 'product', upsellCourseId: null })}
                                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${formData.upsellType === 'product' ? 'bg-foreground text-background border-foreground' : 'bg-background border-input hover:bg-muted'}`}
                                    >
                                        📦 Template/Sản phẩm
                                    </button>
                                </div>

                                {/* Conditional Dropdown */}
                                {formData.upsellType === 'course' ? (
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.upsellCourseId || ''}
                                        onChange={e => setFormData({ ...formData, upsellCourseId: e.target.value || null })}
                                    >
                                        <option value="">-- Không có upsell --</option>
                                        {courses.map((course: any) => (
                                            <option key={course.id} value={course.id}>
                                                {course.title} {course.price ? `(${Number(course.price).toLocaleString()}đ)` : '(Miễn phí)'}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.upsellProductId || ''}
                                        onChange={e => setFormData({ ...formData, upsellProductId: e.target.value || null })}
                                    >
                                        <option value="">-- Không có upsell --</option>
                                        {products.map((product: any) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} {product.price ? `(${Number(product.price).toLocaleString()}đ)` : ''}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {/* Upsell Price Override */}
                                {(formData.upsellCourseId || formData.upsellProductId) && (
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
                                            placeholder="VD: 199.000"
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
                    <CardContent className="p-6 pt-6 space-y-4">
                        <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg mb-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMode('builder')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'builder' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    Page Builder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('html')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'html' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                                >
                                    Custom HTML
                                </button>
                            </div>
                            {mode === 'builder' && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsLibraryOpen(true)}
                                        className="flex items-center gap-2 bg-white text-black hover:bg-neutral-100 border-neutral-200"
                                    >
                                        <PlusCircle size={16} />
                                        Thêm Section
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
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
                                        className="flex items-center gap-2 bg-white text-black hover:bg-neutral-100 border-neutral-200"
                                        title="Xóa tất cả sections"
                                    >
                                        <Trash2 size={16} />
                                        <span className="text-xs font-bold">Clear All</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={async () => {
                                            if (await confirm({
                                                title: 'Thêm Section Mẫu',
                                                message: 'Thêm tất cả section mẫu để test? Hành động này sẽ thêm nhiều section vào trang.',
                                                confirmText: 'Thêm Ngay',
                                                cancelText: 'Hủy',
                                                variant: 'info'
                                            })) {
                                                const testSections = SECTION_TEMPLATES
                                                    .filter((t: any) => t.id !== 'custom-html')
                                                    .map((template: any, index: number) => ({
                                                        ...template.data,
                                                        id: `${template.data.type}-${Date.now()}-${index}`,
                                                        isVisible: true
                                                    }));

                                                const currentSections = getSections();
                                                updateSections([...currentSections, ...testSections]);
                                                addToast(`Đã thêm ${testSections.length} section mẫu`, 'success');
                                            }
                                        }}
                                        className="flex items-center gap-2 bg-white text-black hover:bg-neutral-100 border-neutral-200"
                                        title="Thêm tất cả các loại section để test"
                                    >
                                        <Zap size={16} />
                                        <span className="text-xs font-bold">Test Full</span>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {mode === 'builder' ? (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Danh sách Sections</h3>

                                <div className="space-y-2">
                                    {sections.map((section, index) => (
                                        <div
                                            key={`${section.id}-${index}`}
                                            className={`flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm transition-all ${section.isVisible === false ? 'opacity-50 grayscale' : ''}`}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-mono text-xs">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate capitalize">
                                                        {(() => {
                                                            const template = SECTION_TEMPLATES.find((t: any) => t.data.type === section.type);
                                                            return template ? template.name : `${section.type.replace('-', ' ')} Section`;
                                                        })()}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[300px]">{section.title || section.id}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg border-neutral-200 dark:border-neutral-800" onClick={() => setEditingSectionIndex(index)} title="Chỉnh sửa">
                                                    <Edit size={14} />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" onClick={() => handleToggleVisibility(index)} title={section.isVisible === false ? 'Hiện' : 'Ẩn'}>
                                                    {section.isVisible === false ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </Button>
                                                <div className="flex items-center">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" disabled={index === 0} onClick={() => handleMoveSection(index, 'up')} title="Lên">
                                                        <ArrowUp size={14} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" disabled={index === sections.length - 1} onClick={() => handleMoveSection(index, 'down')} title="Xuống">
                                                        <ArrowDown size={14} />
                                                    </Button>
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-secondary" onClick={() => handleRemoveSection(index)} title="Xóa">
                                                    <Trash2 size={14} />
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

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/admin/landing-pages">
                        <Button type="button" variant="ghost">Hủy bỏ</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="flex items-center gap-2">
                        <Save size={16} />
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
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
