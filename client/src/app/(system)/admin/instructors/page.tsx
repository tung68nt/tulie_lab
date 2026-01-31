'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';

// Define Instructor interface for type safety
interface InstructorExperience {
    id?: string;
    company: string;
    position: string;
    period: string;
    icon: string;
    description?: string;
}

interface Instructor {
    id: string;
    name: string;
    slug?: string;
    title: string;
    bio: string;
    avatar: string;
    studentCount: number;
    courseCount: number;
    experiences: InstructorExperience[];
}

const emptyInstructor: Instructor = {
    id: '',
    name: '',
    slug: '',
    title: '',
    bio: '',
    avatar: '',
    studentCount: 0,
    courseCount: 0,
    experiences: []
};

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Normalize special characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start
        .replace(/-+$/, ''); // Trim - from end
}

export default function AdminInstructorsPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Instructor>(emptyInstructor);

    const loadInstructors = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = await api.admin.instructors.list();
            setInstructors(res.data || []);
        } catch (e: any) {
            console.error('Failed to load instructors:', e);
            addToast(`Không thể tải danh sách giảng viên: ${e?.message || 'Lỗi không xác định'}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        loadInstructors();
    }, [loadInstructors]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Auto-generate slug if empty
            const submitData = { ...formData };
            if (!submitData.slug && submitData.name) {
                submitData.slug = slugify(submitData.name);
            }

            if (isEditing) {
                await api.admin.instructors.update(formData.id, submitData);
                addToast('Cập nhật giảng viên thành công', 'success');
            } else {
                await api.admin.instructors.create(submitData);
                addToast('Thêm giảng viên thành công', 'success');
            }
            setIsEditing(false);
            setFormData(emptyInstructor);
            loadInstructors();
        } catch (e: any) {
            addToast(`Lưu thất bại: ${e?.message || 'Lỗi không xác định'}`, 'error');
        }
    };

    const handleEdit = (inst: Instructor) => {
        setFormData({
            ...inst,
            slug: inst.slug || '',
            studentCount: inst.studentCount || 0,
            courseCount: inst.courseCount || 0,
            experiences: inst.experiences || []
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Xóa giảng viên?',
            message: 'Bạn có chắc chắn muốn xóa giảng viên này không?',
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });
        if (!confirmed) return;

        try {
            await api.admin.instructors.delete(id);
            addToast('Đã xóa giảng viên thành công', 'success');
            loadInstructors();
        } catch (e: any) {
            console.error('Failed to delete instructor:', e);
            addToast(`Xóa thất bại: ${e?.message || 'Lỗi không xác định'}`, 'error');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(emptyInstructor);
    };

    // Experience helpers
    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experiences: [
                ...prev.experiences,
                { company: '', position: '', period: '', icon: 'building' }
            ]
        }));
    };

    const updateExperience = (index: number, field: keyof InstructorExperience, value: string) => {
        const newExps = [...formData.experiences];
        newExps[index] = { ...newExps[index], [field]: value };
        setFormData(prev => ({ ...prev, experiences: newExps }));
    };

    const removeExperience = (index: number) => {
        const newExps = formData.experiences.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, experiences: newExps }));
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => {
            // Only auto-update slug if we are creating a NEW instructor and slug hasn't been manually edited
            // Or simpler: just auto-update if strictly creating new. 
            // Better UX: Update slug if it matches the slug version of the old name (meaning it was auto-generated)
            // For now, let's keep it simple: Auto-generate if slug is empty or we are in "create" mode and it was auto-generated.

            // Simplest: only auto-update if creating
            let newSlug = prev.slug;
            if (!isEditing && (!prev.slug || prev.slug === slugify(prev.name))) {
                newSlug = slugify(name);
            }
            return { ...prev, name, slug: newSlug };
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <AdminPageHeader
                    title="Quản lý Consultant"
                    subtitle="Quản lý danh sách giảng viên và chuyên gia tư vấn."
                />
                <Button variant="outline" onClick={() => window.open('/instructors', '_blank')}>
                    Xem trang public
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Cập nhật' : 'Thêm mới'} Consultant</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="instructor-name" className="text-sm font-medium">
                                        Tên giảng viên <span className="text-foreground">*</span>
                                    </label>
                                    <Input
                                        id="instructor-name"
                                        placeholder="Nhập tên giảng viên"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="instructor-slug" className="text-sm font-medium">
                                        Slug (URL)
                                    </label>
                                    <Input
                                        id="instructor-slug"
                                        placeholder="ten-giang-vien"
                                        value={formData.slug || ''}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="instructor-title" className="text-sm font-medium">
                                    Chức danh
                                </label>
                                <Input
                                    id="instructor-title"
                                    placeholder="VD: Senior Engineer, Tech Lead..."
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="instructor-bio" className="text-sm font-medium">
                                Bio / Giới thiệu
                            </label>
                            <textarea
                                id="instructor-bio"
                                placeholder="Mô tả chi tiết về giảng viên (hỗ trợ nhiều đoạn văn)"
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.bio || ''}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                rows={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="instructor-avatar" className="text-sm font-medium">
                                URL Avatar
                            </label>
                            <Input
                                id="instructor-avatar"
                                placeholder="https://example.com/avatar.jpg"
                                value={formData.avatar || ''}
                                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Số học viên</label>
                                <Input
                                    type="number"
                                    value={formData.studentCount}
                                    onChange={e => setFormData({ ...formData, studentCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Số khóa học</label>
                                <Input
                                    type="number"
                                    value={formData.courseCount}
                                    onChange={e => setFormData({ ...formData, courseCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        {/* Experience Section */}
                        <div className="space-y-2 border-t pt-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Kinh nghiệm / Vị trí đã qua</label>
                                <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                                    + Thêm vị trí
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {formData.experiences.map((exp, idx) => (
                                    <div key={idx} className="flex flex-col gap-3 border p-4 rounded bg-muted/20 relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeExperience(idx)}
                                        >
                                            <span className="sr-only">Delete</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        </Button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                                            <Input
                                                placeholder="Tổ chức / Công ty"
                                                value={exp.company}
                                                onChange={e => updateExperience(idx, 'company', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Vị trí / Chức vụ"
                                                value={exp.position}
                                                onChange={e => updateExperience(idx, 'position', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <Input
                                                placeholder="Giai đoạn (VD: 2020-2023)"
                                                value={exp.period || ''}
                                                onChange={e => updateExperience(idx, 'period', e.target.value)}
                                            />
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={exp.icon || 'building'}
                                                onChange={e => updateExperience(idx, 'icon', e.target.value)}
                                            >
                                                <option value="building">Building (Doanh nghiệp)</option>
                                                <option value="school">School (Giáo dục/Viện)</option>
                                                <option value="users">Users (Cộng đồng/CLB)</option>
                                            </select>
                                        </div>
                                        <textarea
                                            placeholder="Mô tả công việc (tùy chọn)..."
                                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={exp.description || ''}
                                            onChange={e => updateExperience(idx, 'description', e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                ))}
                                {formData.experiences.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-2">Chưa có thông tin kinh nghiệm</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="submit">{isEditing ? 'Cập nhật' : 'Thêm mới'}</Button>
                            {isEditing && (
                                <Button variant="outline" type="button" onClick={handleCancel}>
                                    Hủy
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : instructors.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Chưa có giảng viên nào</p>
                    ) : (
                        <div className="space-y-4">
                            {instructors.map(inst => (
                                <div key={inst.id} className="flex items-center justify-between border p-4 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        {inst.avatar && (
                                            <img
                                                src={inst.avatar}
                                                alt={inst.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{inst.name}</p>
                                            <p className="text-sm text-muted-foreground">{inst.title}</p>
                                            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                                <span>{inst.courseCount} khóa học</span>
                                                <span>{inst.studentCount} học viên</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <TableActions
                                            viewUrl={inst.slug ? `/instructors/${inst.slug}` : `/instructors/${inst.id}`}
                                            onEdit={() => handleEdit(inst)}
                                            onDelete={() => handleDelete(inst.id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
