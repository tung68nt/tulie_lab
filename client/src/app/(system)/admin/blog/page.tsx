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

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail?: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
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
        isPublished: false
    });

    const fetchPosts = async () => {
        try {
            const data: any = await api.admin.blog.list();
            setPosts(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            addToast('Không thể tải danh sách bài viết', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
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

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content,
            thumbnail: post.thumbnail || '',
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
                                <label className="text-sm font-medium">Mô tả ngắn</label>
                                <Input
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Mô tả ngắn về bài viết"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Ảnh bìa (URL)</label>
                                <Input
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Nội dung</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="flex min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
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
                                        <th className="px-4 py-3 font-medium text-center">Trạng thái</th>
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
                                            <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                                                {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/blog/${post.slug}`} target="_blank">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Xem
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(post)}
                                                    >
                                                        Sửa
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(post.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
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
