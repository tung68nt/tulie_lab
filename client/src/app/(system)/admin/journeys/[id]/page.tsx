'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Checkbox } from '@/components/Checkbox';
import {  Plus, Trash2, GripVertical, Save, ArrowLeft, Route , Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { PriceInput } from '@/components/PriceInput';

interface JourneyStep {
    id?: string;
    title: string;
    description?: string;
    position: number;
    submissionType: 'TEXT' | 'FILE' | 'URL' | 'ANY';
    isRequired: boolean;
    deadlineDays?: number;
}

interface JourneyForm {
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    courseId: string;
    isPublished: boolean;
    isAddOn: boolean;
    price: number;
}

export default function JourneyEditorPage() {
    const router = useRouter();
    const params = useParams();
    const journeyId = params?.id as string;
    const isNew = journeyId === 'new';

    const [form, setForm] = useState<JourneyForm>({
        title: '',
        slug: '',
        description: '',
        thumbnail: '',
        courseId: '',
        isPublished: false,
        isAddOn: false,
        price: 0,
    });
    const [steps, setSteps] = useState<JourneyStep[]>([]);
    const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();
    const confirm = useConfirm();

    useEffect(() => {
        loadCourses();
        if (!isNew) {
            loadJourney();
        }
    }, [isNew, journeyId]);

    const loadCourses = async () => {
        try {
            const response = await api.admin.courses.list();
            setCourses(response.data.map((c: any) => ({ id: c.id, title: c.title })));
        } catch (error) {
            console.error('Failed to load courses:', error);
        }
    };

    const loadJourney = async () => {
        try {
            setLoading(true);
            const data = await api.journeys.admin.get(journeyId);
            setForm({
                title: data.title,
                slug: data.slug,
                description: data.description || '',
                thumbnail: data.thumbnail || '',
                courseId: data.courseId || '',
                isPublished: data.isPublished,
                isAddOn: data.isAddOn,
                price: data.price,
            });
            setSteps(data.steps.map((s: any) => ({
                id: s.id,
                title: s.title,
                description: s.description || '',
                position: s.position,
                submissionType: s.submissionType,
                isRequired: s.isRequired,
                deadlineDays: s.deadlineDays,
            })));
        } catch (error) {
            console.error('Failed to load journey:', error);
            addToast('Không thể tải lộ trình', 'error');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleTitleChange = (title: string) => {
        setForm(prev => ({
            ...prev,
            title,
            slug: isNew ? generateSlug(title) : prev.slug,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.slug) {
            addToast('Vui lòng điền tiêu đề và slug', 'warning');
            return;
        }

        try {
            setSaving(true);
            let savedJourneyId = journeyId;

            if (isNew) {
                const result = await api.journeys.admin.create(form);
                savedJourneyId = result.id;
                addToast('Đã tạo lộ trình', 'success');
            } else {
                await api.journeys.admin.update(journeyId, form);
                addToast('Đã cập nhật lộ trình', 'success');
            }

            // Save steps
            for (const step of steps) {
                if (step.id) {
                    await api.journeys.admin.updateStep(savedJourneyId, step.id, {
                        title: step.title,
                        description: step.description,
                        submissionType: step.submissionType,
                        isRequired: step.isRequired,
                        deadlineDays: step.deadlineDays,
                    });
                } else {
                    await api.journeys.admin.createStep(savedJourneyId, {
                        title: step.title,
                        description: step.description,
                        position: step.position,
                        submissionType: step.submissionType,
                        isRequired: step.isRequired,
                        deadlineDays: step.deadlineDays,
                    });
                }
            }

            if (isNew) {
                router.push(`/admin/journeys/${savedJourneyId}`);
            } else {
                loadJourney();
            }
        } catch (error: any) {
            console.error('Failed to save journey:', error);
            addToast(error.message || 'Không thể lưu lộ trình', 'error');
        } finally {
            setSaving(false);
        }
    };

    const addStep = () => {
        setSteps(prev => [...prev, {
            title: `Bước ${prev.length + 1}`,
            description: '',
            position: prev.length,
            submissionType: 'ANY',
            isRequired: true,
            deadlineDays: undefined,
        }]);
    };

    const updateStep = (index: number, updates: Partial<JourneyStep>) => {
        setSteps(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
    };

    const removeStep = async (index: number) => {
        const step = steps[index];
        if (step.id) {
            const confirmed = await confirm({
                title: 'Xóa bước này?',
                message: 'Bạn có chắc muốn xóa bước này? Dữ liệu đã lưu sẽ bị mất.',
                variant: 'danger',
                confirmText: 'Xóa',
                cancelText: 'Hủy'
            });
            if (!confirmed) return;
        }

        if (step.id) {
            try {
                await api.journeys.admin.deleteStep(journeyId, step.id);
                addToast('Đã xóa bước', 'success');
            } catch (error) {
                console.error('Failed to delete step:', error);
                addToast('Không thể xóa bước', 'error');
                return;
            }
        }

        setSteps(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin w-8 h-8 text-primary " />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <AdminPageHeader
                title={isNew ? 'Tạo Lộ Trình Mới' : 'Chỉnh Sửa Lộ Trình'}
                subtitle={isNew ? 'Thiết lập lộ trình học mới' : form.title}
                backUrl="/admin/journeys"
                icon={<Route className="w-8 h-8" />}
            />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Thông Tin Cơ Bản</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                                    <Input
                                        value={form.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="Ví dụ: Lộ trình học Blender cơ bản"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                                    <Input
                                        value={form.slug}
                                        onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                                        placeholder="lo-trinh-blender-co-ban"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mô tả</label>
                                    <Textarea
                                        value={form.description}
                                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Mô tả chi tiết về lộ trình..."
                                        rows={4}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Hình ảnh (URL)</label>
                                    <Input
                                        value={form.thumbnail}
                                        onChange={(e) => setForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Steps */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Các Bước Học</h2>
                                <Button type="button" variant="outline" size="sm" onClick={addStep}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm bước
                                </Button>
                            </div>

                            {steps.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>Chưa có bước nào. Nhấn "Thêm bước" để bắt đầu.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {steps.map((step, index) => (
                                        <div key={index} className="border rounded-lg p-4 bg-muted/50">
                                            <div className="flex items-start gap-3">
                                                <div className="flex items-center gap-2 mt-2">
                                                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                                                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <Input
                                                        value={step.title}
                                                        onChange={(e) => updateStep(index, { title: e.target.value })}
                                                        placeholder="Tiêu đề bước học"
                                                    />
                                                    <Textarea
                                                        value={step.description || ''}
                                                        onChange={(e) => updateStep(index, { description: e.target.value })}
                                                        placeholder="Mô tả / hướng dẫn chi tiết..."
                                                        rows={2}
                                                    />
                                                    <div className="flex gap-4">
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-medium mb-1">Loại nộp bài</label>
                                                            <select
                                                                value={step.submissionType}
                                                                onChange={(e) => updateStep(index, { submissionType: e.target.value as any })}
                                                                className="w-full px-3 py-1.5 rounded border bg-background text-sm"
                                                            >
                                                                <option value="ANY">Bất kỳ</option>
                                                                <option value="TEXT">Văn bản</option>
                                                                <option value="FILE">File</option>
                                                                <option value="URL">URL link</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-medium mb-1">Deadline (ngày)</label>
                                                            <Input
                                                                type="number"
                                                                value={step.deadlineDays || ''}
                                                                onChange={(e) => updateStep(index, { deadlineDays: parseInt(e.target.value) || undefined })}
                                                                placeholder="Không giới hạn"
                                                            />
                                                            <p className="text-[10px] text-zinc-500 mt-1">Để trống nếu không có hạn</p>
                                                        </div>
                                                        <div className="flex items-end pb-2">
                                                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                                                <Checkbox
                                                                    checked={step.isRequired}
                                                                    onCheckedChange={(checked) => updateStep(index, { isRequired: !!checked })}
                                                                />
                                                                <span>Bắt buộc</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeStep(index)}
                                                    className="text-destructive hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Cấu Hình</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Liên kết khóa học</label>
                                    <select
                                        value={form.courseId}
                                        onChange={(e) => setForm(prev => ({ ...prev, courseId: e.target.value }))}
                                        className="w-full px-3 py-2 rounded border bg-background"
                                    >
                                        <option value="">Không liên kết</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <PriceInput
                                        label="Giá (VNĐ)"
                                        value={form.price}
                                        onChange={val => setForm({ ...form, price: val })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-2 border-t mt-2">
                                    <label className="text-sm font-medium cursor-pointer" onClick={() => setForm(prev => ({ ...prev, isAddOn: !prev.isAddOn }))}>
                                        Là Add-on
                                    </label>
                                    <Checkbox
                                        checked={form.isAddOn}
                                        onCheckedChange={(checked) => setForm(prev => ({ ...prev, isAddOn: !!checked }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-2 border-t">
                                    <label className="text-sm font-medium cursor-pointer" onClick={() => setForm(prev => ({ ...prev, isPublished: !prev.isPublished }))}>
                                        Xuất bản
                                    </label>
                                    <Checkbox
                                        checked={form.isPublished}
                                        onCheckedChange={(checked) => setForm(prev => ({ ...prev, isPublished: !!checked }))}
                                    />
                                </div>
                            </div>
                        </Card>

                        <div className="sticky top-6 space-y-4">
                            <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800" disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Đang lưu...' : 'Lưu Lộ Trình'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
