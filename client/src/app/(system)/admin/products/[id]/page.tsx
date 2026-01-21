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

export default function ProductEditorPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToast } = useToast();
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

    // Version State
    const [versions, setVersions] = useState<any[]>([]);
    const [newVersion, setNewVersion] = useState({ version: '', changelog: '', fileUrl: '' });
    const [addingVersion, setAddingVersion] = useState(false);

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
        if (!confirm('Bạn có chắc chắn muốn xóa phiên bản này?')) return;

        try {
            await api.products.deleteVersion(versionId);
            setVersions(versions.filter(v => v.id !== versionId));
            addToast('Xóa phiên bản thành công', 'success');
        } catch (error: any) {
            addToast(error.message || 'Lỗi xóa phiên bản', 'error');
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
            const res = await api.uploads.single(file);
            setFormData(prev => ({ ...prev, thumbnail: res.file.url }));
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

                        {!isNew && (
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
