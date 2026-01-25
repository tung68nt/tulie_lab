'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Switch } from '@/components/Switch';
import { api } from '@/lib/api';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail?: string;
    categoryId?: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}
interface Category {
    id: string;
    name: string;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const { addToast } = useToast();
    const confirm = useConfirm();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        thumbnail: '',
        categoryId: '',
        isPublished: false
    });
    const [uploading, setUploading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res: any = await api.admin.blog.list();
            setPosts(res.data || []);
            setTotal(res.meta?.total || 0);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            addToast('Không thể tải danh sách bài viết', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res: any = await api.categories.list();
            setCategories(res.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: editingPost ? formData.slug : generateSlug(title)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPost) {
                await api.admin.blog.update(editingPost.id, formData);
                addToast('Đã cập nhật bài viết', 'success');
            } else {
                await api.admin.blog.create(formData);
                addToast('Đã tạo bài viết mới', 'success');
            }
            resetForm();
            fetchPosts();
        } catch (error) {
            addToast('Có lỗi xảy ra khi lưu bài viết', 'error');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.value ? null : e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const res: any = await api.uploads.single(file);
            if (res.success) {
                setFormData({ ...formData, thumbnail: res.data.url });
                addToast('Đã tải ảnh lên thành công', 'success');
            }
        } catch (error: any) {
            addToast(error.message || 'Lỗi khi tải ảnh lên', 'error');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleContentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.value ? null : e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const res: any = await api.uploads.single(file);
            if (res.success) {
                // Determine caption (default to filename or user prompt if we could)
                // Since this is standard async, we'll just use a placeholder
                const caption = `*Hình: ${res.data.originalName}*`;

                // Markdown structure: ![Alt](Url) \n *Caption*
                const imgMarkdown = `\n![${res.data.originalName}](${res.data.url})\n<center>${caption}</center>\n`;

                setFormData({ ...formData, content: formData.content + imgMarkdown });
                addToast('Đã tải ảnh lên và chèn vào nội dung', 'success');
            }
        } catch (error: any) {
            addToast(error.message || 'Lỗi khi tải ảnh lên', 'error');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content,
            thumbnail: post.thumbnail || '',
            categoryId: post.categoryId || '',
            isPublished: post.isPublished
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Xóa bài viết?',
            message: 'Bạn có chắc muốn xóa bài viết này?',
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });
        if (!confirmed) return;

        try {
            await api.admin.blog.delete(id);
            addToast('Đã xóa bài viết', 'success');
            fetchPosts();
        } catch (error) {
            addToast('Có lỗi xảy ra khi xóa', 'error');
        }
    };

    const togglePublish = async (post: BlogPost) => {
        try {
            await api.admin.blog.update(post.id, { ...post, isPublished: !post.isPublished });
            addToast(post.isPublished ? 'Đã ẩn bài viết' : 'Đã xuất bản bài viết', 'success');
            fetchPosts();
        } catch (error) {
            addToast('Có lỗi xảy ra', 'error');
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingPost(null);
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            thumbnail: '',
            categoryId: '',
            isPublished: false
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý bài viết"
                subtitle="Tạo và quản lý các bài viết tin tức."
            >
                <Button variant="inverted" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Hủy' : 'Thêm bài viết'}
                </Button>
            </AdminPageHeader>

            {/* Form */}
            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Tiêu đề</label>
                                    <Input
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        placeholder="Nhập tiêu đề bài viết"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Slug</label>
                                    <Input
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="url-bai-viet"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Chuyên mục</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">-- Chọn chuyên mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Mô tả ngắn</label>
                                <Input
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Mô tả ngắn về bài viết"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Ảnh bìa</label>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input
                                                value={formData.thumbnail}
                                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="thumbnail-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('thumbnail-upload')?.click()}
                                                disabled={uploading}
                                                className="h-9"
                                            >
                                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                                Tải lên
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Link
                                            href="/admin/media"
                                            target="_blank"
                                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                                        >
                                            <ImageIcon className="w-3.5 h-3.5" />
                                            Mở kho media để lấy link
                                        </Link>
                                    </div>

                                    {/* Thumbnail Preview */}
                                    {formData.thumbnail && (
                                        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border bg-muted group">
                                            <img
                                                src={formData.thumbnail}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, thumbnail: '' })}
                                                className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-full border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-sm font-medium">Nội dung</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="content-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleContentFileUpload}
                                                disabled={uploading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('content-upload')?.click()}
                                                disabled={uploading}
                                                className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                            >
                                                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                                                Chèn ảnh
                                            </button>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            Format: ![Alt text](URL)
                                        </span>
                                    </div>
                                </div>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="flex min-h-[400px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="Nội dung bài viết (hỗ trợ Markdown)"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <Switch
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                                />
                                <label htmlFor="isPublished" className="text-sm cursor-pointer select-none">
                                    Xuất bản ngay
                                </label>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" variant="inverted">
                                    {editingPost ? 'Cập nhật' : 'Tạo bài viết'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Posts List */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách bài viết ({posts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {posts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Chưa có bài viết nào
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr className="text-left text-sm">
                                        <th className="px-4 py-3 font-medium">Tiêu đề</th>
                                        <th className="px-4 py-3 font-medium">Slug</th>
                                        <th className="px-4 py-3 font-medium text-center">Status</th>
                                        <th className="px-4 py-3 font-medium">Ngày tạo</th>
                                        <th className="px-4 py-3 font-medium text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <span className="font-medium">{post.title}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {post.slug}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => togglePublish(post)}
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer
                                                        ${post.isPublished ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}
                                                    `}
                                                >
                                                    {post.isPublished ? 'Live' : 'Draft'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                <div className="font-medium text-foreground">
                                                    {new Date(post.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div>
                                                    {new Date(post.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <TableActions
                                                    viewUrl={`/blog/${post.slug}`}
                                                    onEdit={() => handleEdit(post)}
                                                    onDelete={() => handleDelete(post.id)}
                                                    className="justify-end"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
