'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
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

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        isPublished: false
    });

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/blog/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
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
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

        try {
            const url = editingPost
                ? `${apiUrl}/blog/admin/${editingPost.id}`
                : `${apiUrl}/blog/admin`;

            const res = await fetch(url, {
                method: editingPost ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                addToast(editingPost ? 'Đã cập nhật bài viết' : 'Đã tạo bài viết mới', 'success');
                resetForm();
                fetchPosts();
            } else {
                addToast('Có lỗi xảy ra', 'error');
            }
        } catch (error) {
            addToast('Có lỗi xảy ra', 'error');
        }
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content,
            coverImage: post.coverImage || '',
            isPublished: post.isPublished
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/blog/admin/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                addToast('Đã xóa bài viết', 'success');
                fetchPosts();
            }
        } catch (error) {
            addToast('Có lỗi xảy ra', 'error');
        }
    };

    const togglePublish = async (post: BlogPost) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/blog/admin/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ...post, isPublished: !post.isPublished })
            });

            if (res.ok) {
                addToast(post.isPublished ? 'Đã ẩn bài viết' : 'Đã xuất bản bài viết', 'success');
                fetchPosts();
            }
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
            coverImage: '',
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
                    <p className="text-muted-foreground">Tạo và quản lý các bài viết tin tức</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Hủy' : 'Thêm bài viết'}
                </Button>
            </div>

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
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
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

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                    className="rounded"
                                />
                                <label htmlFor="isPublished" className="text-sm">Xuất bản ngay</label>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">
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
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
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
