'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { ChevronLeft, Save, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { useToast } from '@/contexts/ToastContext';

export default function EditLandingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToast } = useToast(); // Use custom toast
    const isNew = id === 'new';

    // Debug log to verify ID
    useEffect(() => {
        console.log('EditLandingPage mounted. ID:', id, 'isNew:', isNew);
    }, [id, isNew]);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!isNew);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        isActive: true,
        sectionsJSON: JSON.stringify([
            {
                "id": "hero",
                "type": "hero",
                "title": "Làm chủ React & Next.js trong 30 ngày cùng The Tulie Lab",
                "subtitle": "Khóa học thực chiến giúp bạn xây dựng ứng dụng web hiện đại, hiệu năng cao và sẵn sàng đi làm ngay lập tức.",
                "ctaText": "Đăng ký ngay ưu đãi -50%",
                "ctaLink": "#pricing",
                "highlight": "Khai giảng: 15/06/2026"
            },
            {
                "id": "stats",
                "type": "stats",
                "items": [
                    { "label": "Học viên hài lòng", "value": "2,500+" },
                    { "label": "Workshop đã tổ chức", "value": "150+" },
                    { "label": "Giờ học thực chiến", "value": "10,000+" },
                    { "label": "Đối tác tuyển dụng", "value": "50+" }
                ]
            },
            {
                "id": "problems",
                "type": "content",
                "title": "Bạn đang gặp phải vấn đề gì?",
                "content": "<ul><li>Học nhiều nơi nhưng vẫn <strong>không tự làm được dự án</strong>?</li><li>Kiến thức rời rạc, không biết cách <strong>tối ưu code</strong>?</li><li>Mất gốc hoặc không có lộ trình <strong>thăng tiến</strong> rõ ràng?</li></ul>",
                "image": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
                "imagePosition": "right"
            },
            {
                "id": "curriculum",
                "type": "curriculum",
                "title": "Lộ trình học tập chi tiết",
                "subtitle": "Đi từ con số 0 đến khi tự tay deploy sản phẩm thực tế.",
                "items": [
                    { "title": "Module 1: React Fundamentals", "description": "Nắm vững Hooks, State, LifeCycle", "lessons": ["JSX & Component", "useState, useEffect", "Custom Hooks"] },
                    { "title": "Module 2: Next.js Ecosystem", "description": "App Router, Server Actions", "lessons": ["Routing", "Data Fetching", "SEO Optimization"] }
                ]
            },
            {
                "id": "benefits",
                "type": "benefits",
                "title": "Tại sao chọn khóa học này?",
                "items": [
                    { "title": "Thực chiến 100%", "description": "Không lý thuyết suông, làm dự án thật." },
                    { "title": "Mentor 1-1", "description": "Support code review và định hướng nghề nghiệp." },
                    { "title": "Cam kết việc làm", "description": "Hoàn tiền nếu không xin được việc." }
                ]
            },
            {
                "id": "projects",
                "type": "studentProjects",
                "title": "Sản phẩm học viên",
                "subtitle": "Người thật việc thật - Kết quả sau 1 tháng"
            },
            {
                "id": "testimonials",
                "type": "testimonials",
                "title": "Đánh giá từ cộng đồng"
            },
            {
                "id": "pricing",
                "type": "cta",
                "title": "Đừng bỏ lỡ ưu đãi giới hạn!",
                "subtitle": "Giảm ngay 2.000.000đ cho 50 bạn đăng ký sớm nhất hôm nay.",
                "ctaText": "Nhận ưu đãi ngay",
                "ctaLink": "/checkout?s=landing"
            }
        ], null, 2)
    });

    useEffect(() => {
        if (!isNew) {
            loadPage();
        }
    }, [isNew]); // Added dependency

    const loadPage = async () => {
        try {
            // Logic manually implementing 'getById' since we only made getBySlug in public API
            // Since we don't have a direct getById API in the list, we iterate or add a specific admin verify.
            // Actually, for Admin, we likely need a specific getById endpoint or reuse list.
            // Let's assume for now we can fetch by slug if we knew it, or we add getById to Admin API.
            // Wait, standard Admin update pattern usually needs ID. 
            // I'll quickly check if I added a getById to the controller.
            // Controller has: updatePage (by ID), deletePage (by ID).
            // But getPage is by slug (Public). listPages is All. 
            // MISSING: Get Page by ID for Admin. 
            // WORKAROUND: For now, I'll fetch ALL and find by ID client side (not efficient but works for MVP).

            const allPages = (await api.landingPages.list()) as any[];
            const page = allPages.find(p => p.id === id);

            if (page) {
                setFormData({
                    title: page.title,
                    slug: page.slug,
                    description: page.description || '',
                    isActive: page.isActive,
                    sectionsJSON: typeof page.sections === 'string'
                        ? page.sections
                        : JSON.stringify(page.sections, null, 2)
                });
            } else {
                addToast('Không tìm thấy trang yêu cầu', 'error');
                router.push('/admin/landing-pages');
            }
        } catch (error) {
            console.error('Failed to load page', error);
            addToast('Lỗi tải dữ liệu trang', 'error');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let sectionsParsed;
            try {
                sectionsParsed = JSON.parse(formData.sectionsJSON);
            } catch (err) {
                addToast('Cấu hình Sections (JSON) không hợp lệ', 'error');
                setLoading(false);
                return;
            }

            const payload = {
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                isActive: formData.isActive,
                sections: sectionsParsed
            };

            if (isNew) {
                await api.landingPages.create(payload);
                addToast('Tạo trang thành công', 'success');
            } else {
                await api.landingPages.update(id, payload);
                addToast('Cập nhật trang thành công', 'success');
            }

            router.push('/admin/landing-pages');
            router.refresh(); // Refresh server components if any
        } catch (error: any) {
            addToast(`Lỗi: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div>Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/landing-pages">
                    <Button variant="ghost" size="sm"><ChevronLeft size={16} /> Quay lại</Button>
                </Link>
                <h1 className="text-2xl font-bold">{isNew ? 'Tạo trang mới' : 'Chỉnh sửa trang'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium">Kích hoạt (Hiển thị công khai)</label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Cấu hình Sections (JSON)</label>
                            <div className="text-xs flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                <AlertTriangle size={12} />
                                Thận trọng khi chỉnh sửa
                            </div>
                        </div>
                        <div className="relative">
                            <textarea
                                className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-4 py-4 text-sm font-mono leading-relaxed"
                                value={formData.sectionsJSON}
                                onChange={e => setFormData({ ...formData, sectionsJSON: e.target.value })}
                                spellCheck={false}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Hỗ trợ các type: 'hero', 'stats', 'benefits', 'testimonials', 'content', 'cta', 'process', 'comparison', 'studentProjects'.
                        </p>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 sticky bottom-6 bg-background/80 backdrop-blur p-4 rounded-lg border shadow-lg z-10">
                    <Link href="/admin/landing-pages">
                        <Button type="button" variant="ghost">Hủy bỏ</Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="flex items-center gap-2">
                        <Save size={16} />
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
