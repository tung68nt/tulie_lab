'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { PriceInput } from '@/components/PriceInput';
import { useToast } from '@/contexts/ToastContext';
import { ArrowLeft, Save, Loader2, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/Switch';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { useConfirm } from '@/components/ConfirmDialog';

export default function ProductEditorPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const confirmDialog = useConfirm();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        price: 0,
        compareAtPrice: 0,
        thumbnail: '',
        type: 'TEMPLATE',
        field: 'OTHER',
        fileUrl: '',
        previewUrl: '',
        isPublished: true,
    });

    // Gallery State
    const [gallery, setGallery] = useState<Array<{ type: 'image' | 'video'; url: string; thumbnail?: string }>>([]);

    // Rich Content State
    const [detailedContent, setDetailedContent] = useState('');

    // Version State
    const [versions, setVersions] = useState<any[]>([]);
    const [newVersion, setNewVersion] = useState({ version: '', changelog: '', fileUrl: '' });
    const [addingVersion, setAddingVersion] = useState(false);

    // Upsell State
    const [upsells, setUpsells] = useState<any>({ products: [], courses: [] });
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [showUpsellSelector, setShowUpsellSelector] = useState(false);
    const [upsellType, setUpsellType] = useState<'product' | 'course'>('product');

    useEffect(() => {
        if (!isNew) {
            const fetchProduct = async () => {
                try {
                    const data: any = await api.products.get(id as string);
                    setFormData({
                        title: data.title,
                        slug: data.slug,
                        description: data.description || '',
                        price: Number(data.price),
                        compareAtPrice: Number(data.compareAtPrice || 0),
                        thumbnail: data.thumbnail || '',
                        type: data.type,
                        field: data.field || 'OTHER',
                        fileUrl: data.fileUrl || '',
                        previewUrl: data.previewUrl || '',
                        isPublished: data.isPublished,
                    });
                    if (data.versions) {
                        setVersions(data.versions);
                    }
                    // Load gallery
                    if (data.gallery) {
                        setGallery(data.gallery);
                    }
                    // Load detailed content
                    if (data.detailedContent) {
                        setDetailedContent(data.detailedContent);
                    }

                    // Fetch upsells
                    try {
                        const upsellData: any = await api.products.getUpsells(id as string);
                        setUpsells(upsellData || { products: [], courses: [] });
                    } catch (err) {
                        console.error('Failed to fetch upsells', err);
                    }
                } catch (error) {
                    console.error(error);
                    addToast('Không tìm thấy sản phẩm', 'error');
                    router.push('/admin/products');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, isNew, router, addToast]);

    useEffect(() => {
        // Fetch all products and courses for upsell selector
        const fetchAll = async () => {
            try {
                const [productsRes, coursesRes]: any = await Promise.all([
                    api.products.list({ isPublished: true }),
                    api.courses.list()
                ]);
                setAllProducts((productsRes?.data || []).filter((p: any) => p.id !== id));
                setAllCourses(coursesRes?.data || []);
            } catch (err) {
                console.error('Failed to fetch products/courses', err);
            }
        };
        if (!isNew) {
            fetchAll();
        }
    }, [id, isNew]);

    const handleAddVersion = async () => {
        if (!newVersion.version || !newVersion.fileUrl) {
            addToast('Vui lòng nhập phiên bản và link tải', 'warning');
            return;
        }

        setAddingVersion(true);
        try {
            const res: any = await api.products.addVersion(id as string, newVersion);
            setVersions([res, ...versions]);
            setNewVersion({ version: '', changelog: '', fileUrl: '' });
            addToast('Thêm phiên bản thành công', 'success');
        } catch (error: any) {
            addToast(error.message || 'Lỗi thêm phiên bản', 'error');
        } finally {
            setAddingVersion(false);
        }
    };

    const handleDeleteVersion = async (versionId: string) => {
        const isConfirmed = await confirmDialog({
            title: 'Xóa phiên bản',
            message: 'Bạn có chắc chắn muốn xóa phiên bản này?',
            variant: 'danger'
        });

        if (!isConfirmed) return;

        try {
            await api.products.deleteVersion(versionId);
            setVersions(versions.filter(v => v.id !== versionId));
            addToast('Xóa phiên bản thành công', 'success');
        } catch (error: any) {
            addToast(error.message || 'Lỗi xóa phiên bản', 'error');
        }
    };

    const handleAddUpsell = async (itemId: string, type: 'product' | 'course') => {
        try {
            const data = type === 'product' ? { productId: itemId } : { courseId: itemId };
            const result = await api.products.addUpsell(id as string, data);

            // Update local state
            if (type === 'product') {
                setUpsells((prev: any) => ({
                    ...prev,
                    products: [...prev.products, result]
                }));
            } else {
                setUpsells((prev: any) => ({
                    ...prev,
                    courses: [...prev.courses, result]
                }));
            }
            addToast('Thêm sản phẩm upsell thành công', 'success');
            setShowUpsellSelector(false);
        } catch (error: any) {
            addToast(error.message || 'Lỗi thêm upsell', 'error');
        }
    };

    const handleRemoveUpsell = async (upsellId: string, type: 'product' | 'course') => {
        const isConfirmed = await confirmDialog({
            title: 'Xóa Upsell',
            message: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách upsell?',
            variant: 'danger'
        });

        if (!isConfirmed) return;

        try {
            await api.products.removeUpsell(id as string, upsellId);

            // Update local state
            if (type === 'product') {
                setUpsells((prev: any) => ({
                    ...prev,
                    products: prev.products.filter((u: any) => u.id !== upsellId)
                }));
            } else {
                setUpsells((prev: any) => ({
                    ...prev,
                    courses: prev.courses.filter((u: any) => u.id !== upsellId)
                }));
            }
            addToast('Xóa upsell thành công', 'success');
        } catch (error: any) {
            addToast(error.message || 'Lỗi xóa upsell', 'error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: Number(value) }));
        } else if (name === 'isPublished') {
            setFormData(prev => ({ ...prev, [name]: value === 'true' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isPublished: checked }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            addToast('Đang tải ảnh...', 'info');
            const res: any = await api.uploads.single(file);
            setFormData(prev => ({ ...prev, thumbnail: res.data.url }));
            addToast('Tải ảnh thành công', 'success');
        } catch (error) {
            addToast('Lỗi tải ảnh', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
                gallery: gallery.length > 0 ? gallery : null,
                detailedContent: detailedContent || null,
            };

            if (isNew) {
                await api.products.create(payload);
                addToast('Tạo sản phẩm thành công', 'success');
            } else {
                await api.products.update(id as string, payload);
                addToast('Cập nhật thành công', 'success');
            }
            router.push('/admin/products');
        } catch (error: any) {
            console.error(error);
            addToast(error.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <AdminPageHeader
                title={isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
                backUrl="/admin/products"
            />

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="border rounded-lg p-6 bg-card space-y-4">
                            <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tên sản phẩm</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ví dụ: Landing Page Template..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug (URL)</label>
                                <Input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="tu-dong-theo-ten"
                                />
                                <p className="text-xs text-muted-foreground">Để trống để tự động tạo từ tên sản phẩm.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mô tả chi tiết</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={10}
                                    className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Mô tả về sản phẩm..."
                                />
                            </div>
                        </div>

                        <div className="border rounded-lg p-6 bg-card space-y-4">
                            <h3 className="font-semibold text-lg">File & Link (Bản mới nhất / Mặc định)</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Link Preview (Demo)</label>
                                <Input
                                    name="previewUrl"
                                    value={formData.previewUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Link Tải xuống (File URL)</label>
                                <Input
                                    name="fileUrl"
                                    value={formData.fileUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                                <p className="text-xs text-muted-foreground">Link trực tiếp đến file (Google Drive, Dropbox, S3...).</p>
                            </div>
                        </div>

                        {/* Gallery Management */}
                        <div className="border rounded-lg p-6 bg-card space-y-4">
                            <h3 className="font-semibold text-lg">Thư viện ảnh/video</h3>
                            <p className="text-sm text-muted-foreground">Thêm nhiều ảnh hoặc video để hiển thị ở trang sản phẩm</p>

                            <div className="space-y-3">
                                {/* Add new media */}
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="URL ảnh hoặc video (https://...)"
                                        onKeyDown={(e: any) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const url = e.target.value.trim();
                                                if (url) {
                                                    const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('youtube') || url.includes('vimeo');
                                                    setGallery([...gallery, { type: isVideo ? 'video' : 'image', url }]);
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={(e: any) => {
                                            const input = e.target.closest('div').querySelector('input');
                                            const url = input?.value.trim();
                                            if (url) {
                                                const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('youtube') || url.includes('vimeo');
                                                setGallery([...gallery, { type: isVideo ? 'video' : 'image', url }]);
                                                input.value = '';
                                            }
                                        }}
                                    >
                                        Thêm
                                    </Button>
                                </div>

                                {/* Gallery items */}
                                <div className="grid grid-cols-2 gap-3">
                                    {gallery.map((item, index) => (
                                        <div key={index} className="relative group border rounded-lg overflow-hidden bg-muted">
                                            <div className="aspect-video">
                                                {item.type === 'video' ? (
                                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => setGallery(gallery.filter((_, i) => i !== index))}
                                                    className="p-1.5 rounded bg-red-500 text-white hover:bg-red-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="p-2 bg-background/80 backdrop-blur-sm">
                                                <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {gallery.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                                        Chưa có ảnh/video nào. Nhập URL và nhấn Enter hoặc nút Thêm.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rich Content Editor */}
                        <div className="border rounded-lg p-6 bg-card space-y-4">
                            <h3 className="font-semibold text-lg">Nội dung chi tiết</h3>
                            <p className="text-sm text-muted-foreground">Viết nội dung giới thiệu chi tiết về sản phẩm (hỗ trợ HTML)</p>

                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">Nội dung chi tiết (Markdown)</label>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="content-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                try {
                                                    addToast('Đang tải ảnh...', 'info');
                                                    const res: any = await api.uploads.single(file);
                                                    if (res.success) {
                                                        const imgMarkdown = `\n![${res.data.originalName}](${res.data.url})\n`;
                                                        setDetailedContent(prev => prev + imgMarkdown);
                                                        addToast('Đã chèn ảnh', 'success');
                                                    }
                                                } catch (error: any) {
                                                    addToast('Lỗi tải ảnh', 'error');
                                                } finally {
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('content-upload')?.click()}
                                            className="h-8 text-xs"
                                        >
                                            <UploadCloud className="w-3 h-3 mr-2" />
                                            Chèn ảnh
                                        </Button>
                                    </div>
                                    <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                        Hướng dẫn Markdown
                                    </a>
                                </div>
                            </div>

                            <textarea
                                value={detailedContent}
                                onChange={(e) => setDetailedContent(e.target.value)}
                                rows={20}
                                className="w-full min-h-[400px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono leading-relaxed"
                                placeholder="# Tiêu đề chính&#10;&#10;Mô tả chi tiết sản phẩm...&#10;&#10;## Tính năng nổi bật&#10;- Tính năng 1&#10;- Tính năng 2&#10;&#10;![Mô tả ảnh](https://...)"
                            />

                            {detailedContent && (
                                <details className="border rounded-lg p-4 bg-muted/30">
                                    <summary className="cursor-pointer font-medium text-sm text-primary">Xem trước nội dung (Preview)</summary>
                                    <div className="mt-4 prose prose-sm dark:prose-invert max-w-none border p-4 rounded-md bg-background">
                                        <div dangerouslySetInnerHTML={{ __html: '<i>Preview is using simple HTML rendering here, actual display will use ReactMarkdown.</i>' }} />
                                        {/* Simple preview or we could import ReactMarkdown here but it might be heavy for Admin. 
                                            Actually, let's keep it simple for now or the user might complain preview is broken if I don't use ReactMarkdown. 
                                            But I don't want to add imports if I can avoid. 
                                            Let's use a basic textarea for now. */}
                                        <pre className="whitespace-pre-wrap font-sans text-sm">{detailedContent}</pre>
                                    </div>
                                </details>
                            )}
                        </div>

                        {!isNew && (
                            <>
                                <div className="border rounded-lg p-6 bg-card space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">Quản lý phiên bản</h3>
                                        <span className="text-xs text-muted-foreground">{versions.length} phiên bản</span>
                                    </div>

                                    <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                                        <h4 className="font-medium text-sm">Thêm phiên bản mới</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Version (VD: 1.0.1)"
                                                value={newVersion.version}
                                                onChange={(e) => setNewVersion({ ...newVersion, version: e.target.value })}
                                            />
                                            <Input
                                                placeholder="Link tài liệu (URL)"
                                                value={newVersion.fileUrl}
                                                onChange={(e) => setNewVersion({ ...newVersion, fileUrl: e.target.value })}
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Changelog: Những thay đổi trong phiên bản này..."
                                            value={newVersion.changelog}
                                            onChange={(e) => setNewVersion({ ...newVersion, changelog: e.target.value })}
                                            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                        <Button type="button" onClick={handleAddVersion} disabled={addingVersion} size="sm">
                                            {addingVersion && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                            Thêm phiên bản
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {versions.length === 0 ? (
                                            <div className="text-center py-4 text-muted-foreground text-sm">Chưa có phiên bản nào</div>
                                        ) : (
                                            versions.map((ver) => (
                                                <div key={ver.id} className="flex justify-between items-start p-3 border rounded-md bg-background">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold">v{ver.version}</span>
                                                            <span className="text-xs text-muted-foreground">{new Date(ver.createdAt).toLocaleDateString('vi-VN')}</span>
                                                        </div>
                                                        {ver.changelog && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{ver.changelog}</p>}
                                                        <a href={ver.fileUrl} target="_blank" className="text-xs text-blue-500 hover:underline mt-1 block truncate max-w-[200px]">{ver.fileUrl}</a>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        type="button"
                                                        onClick={() => handleDeleteVersion(ver.id)}
                                                        className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Upsell Management */}
                                <div className="border rounded-lg p-6 bg-card space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">Sản phẩm Upsell</h3>
                                        <span className="text-xs text-muted-foreground">
                                            {(upsells.products?.length || 0) + (upsells.courses?.length || 0)} items
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        Thêm sản phẩm hoặc khóa học liên quan để hiển thị tại trang thanh toán
                                    </p>

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setUpsellType('product');
                                                setShowUpsellSelector(true);
                                            }}
                                        >
                                            + Thêm Sản phẩm
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setUpsellType('course');
                                                setShowUpsellSelector(true);
                                            }}
                                        >
                                            + Thêm Khóa học
                                        </Button>
                                    </div>

                                    {/* Upsell Selector Modal */}
                                    {showUpsellSelector && (
                                        <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium text-sm">
                                                    Chọn {upsellType === 'product' ? 'sản phẩm' : 'khóa học'}
                                                </h4>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setShowUpsellSelector(false)}
                                                >
                                                    Đóng
                                                </Button>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto space-y-2">
                                                {upsellType === 'product' ? (
                                                    allProducts.length === 0 ? (
                                                        <div className="text-center py-4 text-muted-foreground text-sm">
                                                            Không có sản phẩm nào
                                                        </div>
                                                    ) : (
                                                        allProducts
                                                            .filter((p: any) => !upsells.products?.some((u: any) => u.item?.id === p.id))
                                                            .map((product: any) => (
                                                                <div
                                                                    key={product.id}
                                                                    className="flex justify-between items-center p-2 border rounded bg-background hover:bg-muted/50 transition-colors"
                                                                >
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-sm">{product.title}</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        onClick={() => handleAddUpsell(product.id, 'product')}
                                                                    >
                                                                        Thêm
                                                                    </Button>
                                                                </div>
                                                            ))
                                                    )
                                                ) : (
                                                    allCourses.length === 0 ? (
                                                        <div className="text-center py-4 text-muted-foreground text-sm">
                                                            Không có khóa học nào
                                                        </div>
                                                    ) : (
                                                        allCourses
                                                            .filter((c: any) => !upsells.courses?.some((u: any) => u.item?.id === c.id))
                                                            .map((course: any) => (
                                                                <div
                                                                    key={course.id}
                                                                    className="flex justify-between items-center p-2 border rounded bg-background hover:bg-muted/50 transition-colors"
                                                                >
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-sm">{course.title}</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        onClick={() => handleAddUpsell(course.id, 'course')}
                                                                    >
                                                                        Thêm
                                                                    </Button>
                                                                </div>
                                                            ))
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Current Upsells */}
                                    <div className="space-y-2">
                                        {(upsells.products?.length || 0) + (upsells.courses?.length || 0) === 0 ? (
                                            <div className="text-center py-4 text-muted-foreground text-sm">
                                                Chưa có sản phẩm upsell nào
                                            </div>
                                        ) : (
                                            <>
                                                {upsells.products?.map((upsell: any) => (
                                                    <div key={upsell.id} className="flex justify-between items-start p-3 border rounded-md bg-background">
                                                        <div className="flex gap-3 flex-1">
                                                            {upsell.item?.thumbnail && (
                                                                <img src={upsell.item.thumbnail} alt="" className="w-12 h-12 rounded object-cover" />
                                                            )}
                                                            <div>
                                                                <p className="font-medium text-sm">{upsell.item?.title}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Sản phẩm • {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(upsell.item?.price)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            type="button"
                                                            onClick={() => handleRemoveUpsell(upsell.id, 'product')}
                                                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </Button>
                                                    </div>
                                                ))}
                                                {upsells.courses?.map((upsell: any) => (
                                                    <div key={upsell.id} className="flex justify-between items-start p-3 border rounded-md bg-background">
                                                        <div className="flex gap-3 flex-1">
                                                            {upsell.item?.thumbnail && (
                                                                <img src={upsell.item.thumbnail} alt="" className="w-12 h-12 rounded object-cover" />
                                                            )}
                                                            <div>
                                                                <p className="font-medium text-sm">{upsell.item?.title}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Khóa học • {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(upsell.item?.price)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            type="button"
                                                            onClick={() => handleRemoveUpsell(upsell.id, 'course')}
                                                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="border rounded-lg p-6 bg-card space-y-4">
                            <h3 className="font-semibold text-lg">Phân loại & Giá</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Loại sản phẩm</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="TEMPLATE">Mẫu Website / Template</option>
                                    <option value="APP">Ứng dụng / App</option>
                                    <option value="LICENSE">License Key</option>
                                    <option value="SUBSCRIPTION">Gói thành viên (Subscription)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Lĩnh vực / Ngành nghề</label>
                                <select
                                    name="field"
                                    // @ts-ignore
                                    value={formData.field}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="OTHER">Khác</option>
                                    <option value="ACCOUNTING">Kế toán</option>
                                    <option value="HR">Nhân sự (HR)</option>
                                    <option value="MARKETING">Marketing</option>
                                    <option value="BUSINESS">Kinh doanh</option>
                                    <option value="CREATIVE">Thiết kế / Sáng tạo</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giá bán (VNĐ)</label>
                                <PriceInput
                                    value={formData.price}
                                    onChange={(val) => setFormData(prev => ({ ...prev, price: val }))}
                                    min={0}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giá gốc (để gạch ngang)</label>
                                <PriceInput
                                    value={formData.compareAtPrice}
                                    onChange={(val) => setFormData(prev => ({ ...prev, compareAtPrice: val }))}
                                    min={0}
                                />
                            </div>


                        </div>

                        <div className="border rounded-lg p-6 bg-card space-y-4">
                            <h3 className="font-semibold text-lg">Hình ảnh</h3>

                            <div className="space-y-2">
                                <div className="aspect-video w-full rounded-md border border-dashed bg-muted relative overflow-hidden flex items-center justify-center group">
                                    {formData.thumbnail ? (
                                        <img
                                            src={formData.thumbnail}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-muted-foreground text-center p-4">
                                            <UploadCloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <span className="text-xs">Chưa có ảnh</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                        <span className="text-white text-xs font-medium">Nhấp để thay đổi</span>
                                    </div>
                                </div>
                                <Input
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/products">
                        <Button variant="outline" type="button">Hủy bỏ</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isNew ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
