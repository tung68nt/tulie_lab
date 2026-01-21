'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { ChevronDown, ChevronUp, Paperclip, Eye } from 'lucide-react';
import { Switch } from '@/components/Switch';
import { Select } from '@/components/Select';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Form states
    const [courseForm, setCourseForm] = useState({
        title: '',
        slug: '',
        description: '',
        price: 0,
        isPublished: false,
        instructorId: '',
        categoryId: '',
        level: 'ALL',
        thumbnail: '',
        introVideoUrl: '',
        learningOutcomes: '',
        deploymentStatus: 'RELEASED',
        tag: 'NONE',
        structure: [] as { title: string, sections: string[] }[]
    });

    const [newLesson, setNewLesson] = useState({
        title: '',
        slug: '',
        videoUrl: '',
        duration: '',
        chapter: '',
        section: '',
        position: 0,
        isFree: false
    });
    const [pendingAttachments, setPendingAttachments] = useState<{ name: string, url: string }[]>([]);
    const [newAttachment, setNewAttachment] = useState({ name: '', url: '' });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Execute requests in parallel to reduce load time
                const [instructorsList, categoriesList, fullDetails]: [any, any, any] = await Promise.all([
                    api.instructors.list().catch(() => []),
                    api.categories.list().catch(() => []),
                    api.admin.courses.get(id).catch(e => {
                        console.error('Fetch course error for ID:', id, e);
                        // Log specifically if it's a 404 or 500
                        if (e instanceof Error && (e as any).status) {
                            console.error('Status:', (e as any).status);
                        }
                        return null;
                    })
                ]);

                setInstructors(Array.isArray(instructorsList) ? instructorsList : []);
                setCategories(Array.isArray(categoriesList) ? categoriesList : []);

                if (fullDetails) {
                    setCourse(fullDetails);
                    setLessons(fullDetails.lessons || []);
                    setCourseForm({
                        title: fullDetails.title,
                        slug: fullDetails.slug,
                        description: fullDetails.description || '',
                        price: fullDetails.price,
                        isPublished: fullDetails.isPublished,
                        instructorId: fullDetails.instructorId || '',
                        categoryId: fullDetails.categoryId || '',
                        level: fullDetails.level || 'ALL',
                        thumbnail: fullDetails.thumbnail || '',
                        introVideoUrl: fullDetails.introVideoUrl || '',
                        learningOutcomes: typeof fullDetails.learningOutcomes === 'object'
                            ? JSON.stringify(fullDetails.learningOutcomes, null, 2)
                            : fullDetails.learningOutcomes || '',
                        deploymentStatus: fullDetails.deploymentStatus || 'RELEASED',
                        tag: fullDetails.tag || 'NONE',
                        structure: fullDetails.structure || []
                    });
                    // Set next position
                    setNewLesson(prev => ({ ...prev, position: (fullDetails.lessons?.length || 0) + 1 }));
                } else {
                    addToast('Không tìm thấy khóa học', 'error');
                    router.push('/admin/courses');
                }
            } catch (e) {
                console.error(e);
                addToast('Không thể tải thông tin khóa học', 'error');
                router.push('/admin/courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, router, addToast]);

    const handleUpdateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.admin.courses.update(id, courseForm);
            addToast('Đã cập nhật khóa học', 'success');
        } catch (e) {
            console.error(e);
            addToast('Cập nhật khóa học thất bại', 'error');
        }
    };

    const handleAddLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const added = await api.admin.courses.addLesson(id, newLesson) as any;
            // Add attachments if any
            for (const attach of pendingAttachments) {
                try {
                    const attachResult = await api.admin.courses.addAttachment(added.id, {
                        title: attach.name,
                        url: attach.url,
                        type: 'FILE'
                    });
                    added.attachments = [...(added.attachments || []), attachResult];
                } catch (err) {
                    console.error('Failed to add attachment:', err);
                }
            }
            setLessons([...lessons, added]);
            setNewLesson({ title: '', slug: '', videoUrl: '', duration: '', chapter: '', section: '', position: lessons.length + 2, isFree: false });
            setPendingAttachments([]);
            setNewAttachment({ name: '', url: '' });
            addToast('Đã thêm bài học', 'success');
        } catch (e) {
            console.error(e);
            addToast('Thêm bài học thất bại', 'error');
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        const confirmed = await confirm({
            title: 'Delete Lesson?',
            message: 'Are you sure you want to delete this lesson?',
            variant: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });
        if (!confirmed) return;
        try {
            await api.admin.courses.deleteLesson(lessonId);
            setLessons(lessons.filter(l => l.id !== lessonId));
            addToast('Đã xóa bài học', 'success');
        } catch (e) {
            console.error(e);
            addToast('Xóa bài học thất bại', 'error');
        }
    };

    const handleUpdateLesson = async (lessonId: string, data: any) => {
        try {
            await api.admin.courses.updateLesson(lessonId, data);
            setLessons(lessons.map(l => l.id === lessonId ? { ...l, ...data } : l));
            addToast('Đã cập nhật bài học', 'success');
        } catch (e) {
            console.error(e);
            addToast('Cập nhật bài học thất bại', 'error');
        }
    };

    const handleMoveLesson = async (index: number, direction: 'up' | 'down') => {
        const sortedLessons = [...lessons].sort((a, b) => a.position - b.position);
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sortedLessons.length - 1) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const currentLesson = sortedLessons[index];
        const targetLesson = sortedLessons[targetIndex];

        // Swap positions
        const tempPos = currentLesson.position;
        currentLesson.position = targetLesson.position;
        targetLesson.position = tempPos;

        // Optimistic update
        setLessons([...sortedLessons]);

        try {
            await Promise.all([
                api.admin.courses.updateLesson(currentLesson.id, { position: currentLesson.position }),
                api.admin.courses.updateLesson(targetLesson.id, { position: targetLesson.position })
            ]);
            addToast('Đã cập nhật thứ tự', 'success');
        } catch (error) {
            console.error('Failed to move lesson', error);
            addToast('Lỗi cập nhật thứ tự', 'error');
        }
    };

    if (loading) return <div className="p-8">Đang tải...</div>;
    if (!course) return <div className="p-8">Không tìm thấy khóa học</div>;

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title={`Chỉnh sửa: ${course.title}`}
                backUrl="/admin/courses"
            >
                <Button variant="outline" onClick={() => window.open(`/courses/${courseForm.slug}`, '_blank')} className="gap-2">
                    <Eye className="h-4 w-4" /> Xem khóa học
                </Button>
            </AdminPageHeader>

            <div className="grid gap-8">
                {/* Edit Course Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin khóa học</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateCourse} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tiêu đề</label>
                                <Input value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Đường dẫn (Slug)</label>
                                <Input value={courseForm.slug} onChange={e => setCourseForm({ ...courseForm, slug: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mô tả</label>
                                <textarea
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                                    value={courseForm.description}
                                    onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                                    placeholder="Mô tả chi tiết về khóa học..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bạn sẽ học được gì (Mỗi ý 1 dòng)</label>
                                <textarea
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                                    value={courseForm.learningOutcomes || ''}
                                    onChange={e => setCourseForm({ ...courseForm, learningOutcomes: e.target.value })}
                                    placeholder="- Hiểu rõ về...\n- Thực hành..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">URL Thumbnail (Ảnh bìa)</label>
                                    <Input
                                        value={courseForm.thumbnail || ''}
                                        onChange={e => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">URL Video giới thiệu</label>
                                    <Input
                                        value={courseForm.introVideoUrl || ''}
                                        onChange={e => setCourseForm({ ...courseForm, introVideoUrl: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                            </div>



                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Học phí (VNĐ)</label>
                                    <Input
                                        type="number"
                                        value={courseForm.price}
                                        onChange={e => {
                                            const val = parseFloat(e.target.value);
                                            setCourseForm({ ...courseForm, price: isNaN(val) ? 0 : val });
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Trạng thái</label>
                                    <div className="flex items-center h-10">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <Switch
                                                checked={courseForm.isPublished}
                                                onChange={(checked) => setCourseForm({ ...courseForm, isPublished: checked })}
                                            />
                                            <span className={courseForm.isPublished ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                                                {courseForm.isPublished ? 'Đã xuất bản' : 'Chưa xuất bản'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tình trạng ra mắt</label>
                                    <div className="relative">
                                        <Select
                                            value={courseForm.deploymentStatus}
                                            onChange={(val) => setCourseForm({ ...courseForm, deploymentStatus: val })}
                                            options={[
                                                { value: 'RELEASED', label: 'Đã ra mắt' },
                                                { value: 'COMING_SOON', label: 'Sắp ra mắt (Coming Soon)' },
                                                { value: 'UPDATING', label: 'Đang cập nhật (Updating)' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="categoryId" className="text-sm font-medium">Danh mục</label>
                                    <div className="relative">
                                        <Select
                                            value={courseForm.categoryId}
                                            onChange={(val) => setCourseForm({ ...courseForm, categoryId: val })}
                                            options={[
                                                { value: '', label: '-- Chưa phân loại --' },
                                                ...categories.map(c => ({ value: c.id, label: c.name }))
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nhãn nổi bật (Tag)</label>
                                    <div className="relative">
                                        <Select
                                            value={courseForm.tag}
                                            onChange={(val) => setCourseForm({ ...courseForm, tag: val })}
                                            options={[
                                                { value: 'NONE', label: '-- Không --' },
                                                { value: 'BEST_SELLER', label: 'Best Seller' },
                                                { value: 'HOT', label: 'Hot' },
                                                { value: 'NEW', label: 'Mới (New)' },
                                                { value: 'DISCOUNT', label: 'Giảm giá (Discount)' }
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="level" className="text-sm font-medium">Trình độ</label>
                                    <div className="relative">
                                        <Select
                                            value={courseForm.level}
                                            onChange={(val) => setCourseForm({ ...courseForm, level: val })}
                                            options={[
                                                { value: 'ALL', label: 'Tất cả trình độ' },
                                                { value: 'BEGINNER', label: 'Cơ bản (Beginner)' },
                                                { value: 'INTERMEDIATE', label: 'Trung cấp (Intermediate)' },
                                                { value: 'ADVANCED', label: 'Nâng cao (Advanced)' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="instructorId" className="text-sm font-medium">Giảng viên</label>
                                <div className="relative">
                                    <Select
                                        value={courseForm.instructorId}
                                        onChange={(val) => setCourseForm({ ...courseForm, instructorId: val })}
                                        options={[
                                            { value: '', label: '-- Chọn giảng viên --' },
                                            ...instructors.map(i => ({ value: i.id, label: i.name }))
                                        ]}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full">Lưu thay đổi</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Lessons Management */}
                <div className="space-y-6">
                    {/* Structure Editor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cấu trúc chương trình (Curriculum)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {courseForm.structure.map((chapter, cIndex) => (
                                    <div key={cIndex} className="border p-4 rounded-lg bg-zinc-50/50">
                                        <div className="flex gap-2 items-center mb-3">
                                            <div className="font-semibold text-sm w-20">Chương {cIndex + 1}:</div>
                                            <Input
                                                value={chapter.title}
                                                onChange={(e) => {
                                                    const newStructure = [...courseForm.structure];
                                                    newStructure[cIndex].title = e.target.value;
                                                    setCourseForm({ ...courseForm, structure: newStructure });
                                                }}
                                                placeholder="Tên chương (VD: Giới thiệu)"
                                                className="flex-1"
                                            />
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                const newStructure = [...courseForm.structure];
                                                newStructure.splice(cIndex, 1);
                                                setCourseForm({ ...courseForm, structure: newStructure });
                                            }} className="text-red-500 hover:text-red-700">Xóa</Button>
                                        </div>
                                        <div className="pl-24 space-y-2">
                                            {chapter.sections.map((section, sIndex) => (
                                                <div key={sIndex} className="flex gap-2 items-center">
                                                    <div className="text-xs text-muted-foreground w-16">Phần {cIndex + 1}.{sIndex + 1}:</div>
                                                    <Input
                                                        value={section}
                                                        className="h-8 text-sm flex-1"
                                                        onChange={(e) => {
                                                            const newStructure = [...courseForm.structure];
                                                            newStructure[cIndex].sections[sIndex] = e.target.value;
                                                            setCourseForm({ ...courseForm, structure: newStructure });
                                                        }}
                                                        placeholder="Tên phần"
                                                    />
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                                                        const newStructure = [...courseForm.structure];
                                                        newStructure[cIndex].sections.splice(sIndex, 1);
                                                        setCourseForm({ ...courseForm, structure: newStructure });
                                                    }}>×</Button>
                                                </div>
                                            ))}
                                            <Button size="sm" variant="outline" type="button" className="h-7 text-xs mt-2" onClick={() => {
                                                const newStructure = [...courseForm.structure];
                                                newStructure[cIndex].sections.push(`Bài ...`);
                                                setCourseForm({ ...courseForm, structure: newStructure });
                                            }}>+ Thêm phần</Button>
                                        </div>
                                    </div>
                                ))}
                                <Button className="w-full" type="button" variant="outline" onClick={() => setCourseForm({
                                    ...courseForm,
                                    structure: [...courseForm.structure, { title: `Chương ${courseForm.structure.length + 1}`, sections: [] }]
                                })}>
                                    + Thêm chương mới
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Thêm bài học mới</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddLesson} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tiêu đề bài học</label>
                                    <Input
                                        placeholder="vd: Giới thiệu về AI"
                                        value={newLesson.title}
                                        onChange={e => {
                                            const title = e.target.value;
                                            const slug = title
                                                .toLowerCase()
                                                .replace(/đ/g, 'd')
                                                .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
                                                .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
                                                .replace(/[ìíịỉĩ]/g, 'i')
                                                .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
                                                .replace(/[ùúụủũưừứựửữ]/g, 'u')
                                                .replace(/[ỳýỵỷỹ]/g, 'y')
                                                .replace(/[^a-z0-9 ]/g, '')
                                                .trim()
                                                .replace(/\s+/g, '-');
                                            setNewLesson({ ...newLesson, title, slug });
                                        }}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Đường dẫn (Slug)</label>
                                    <Input placeholder="gioi-thieu-ai" value={newLesson.slug} onChange={e => setNewLesson({ ...newLesson, slug: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Link Video</label>
                                    <Input placeholder="https://..." value={newLesson.videoUrl} onChange={e => setNewLesson({ ...newLesson, videoUrl: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Chương (Module)</label>
                                        <Select
                                            options={[
                                                { value: '', label: 'Chọn chương' },
                                                ...courseForm.structure.map(s => ({ value: s.title, label: s.title }))
                                            ]}
                                            value={newLesson.chapter}
                                            onChange={(val) => setNewLesson({ ...newLesson, chapter: val })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phần (Section)</label>
                                        <Select
                                            options={[
                                                { value: '', label: 'Chọn phần' },
                                                ...(courseForm.structure.find(s => s.title === newLesson.chapter)?.sections.map(sec => ({ value: sec, label: sec })) || [])
                                            ]}
                                            value={newLesson.section}
                                            onChange={(val) => setNewLesson({ ...newLesson, section: val })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Thời lượng</label>
                                        <Input
                                            placeholder="VD: 10:25 hoặc 1:30:00"
                                            value={newLesson.duration}
                                            onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Thứ tự bài học</label>
                                        <Input
                                            type="number"
                                            value={newLesson.position}
                                            onChange={e => {
                                                const val = parseInt(e.target.value);
                                                setNewLesson({ ...newLesson, position: isNaN(val) ? 0 : val });
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium">Xem miễn phí</span>
                                            <Switch
                                                checked={newLesson.isFree}
                                                onChange={checked => setNewLesson({ ...newLesson, isFree: checked })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Thumbnail (Ảnh bìa bài học)</label>
                                    <Input
                                        placeholder="https://..."
                                        value={(newLesson as any).thumbnail || ''}
                                        onChange={e => setNewLesson({ ...newLesson, thumbnail: e.target.value } as any)}
                                    />
                                    <p className="text-xs text-muted-foreground">URL ảnh thumbnail cho bài học (Tùy chọn)</p>
                                </div>

                                {/* Attachments Section */}
                                <div className="space-y-3 border-t pt-4">
                                    <label className="text-sm font-medium">Tài liệu đính kèm</label>

                                    {/* List of pending attachments */}
                                    {pendingAttachments.length > 0 && (
                                        <div className="space-y-2">
                                            {pendingAttachments.map((att, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                                                    <span className="flex-1 truncate">{att.name}</span>
                                                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[200px]">
                                                        {att.url}
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingAttachments(prev => prev.filter((_, i) => i !== idx))}
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload File Option */}
                                    <div className="border border-dashed border-muted-foreground/30 rounded-lg p-3 text-center hover:border-foreground/50 transition-colors mb-3">
                                        <input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            id="new-lesson-file"
                                            onChange={async (e) => {
                                                const files = e.target.files;
                                                if (files && files.length > 0) {
                                                    for (const file of Array.from(files)) {
                                                        try {
                                                            const result = await api.uploads.single(file);
                                                            if (result.success) {
                                                                setPendingAttachments(prev => [...prev, {
                                                                    name: result.file.originalName,
                                                                    url: result.file.url
                                                                }]);
                                                            } else {
                                                                addToast(`Upload thất bại: ${file.name}`, 'error');
                                                            }
                                                        } catch (err) {
                                                            console.error('Upload failed:', err);
                                                            addToast(`Lỗi upload: ${file.name}`, 'error');
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                        <label htmlFor="new-lesson-file" className="cursor-pointer flex flex-col items-center gap-1">
                                            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-xs text-muted-foreground">Tải file lên server</span>
                                        </label>
                                    </div>

                                    <div className="text-center text-xs text-muted-foreground mb-2">hoặc thêm bằng URL</div>

                                    {/* Add new attachment manually */}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Tên (vd: Slide bài giảng)"
                                            value={newAttachment.name}
                                            onChange={e => setNewAttachment(prev => ({ ...prev, name: e.target.value }))}
                                            className="flex-1"
                                        />
                                        <Input
                                            placeholder="URL (vd: Link Google Drive)"
                                            value={newAttachment.url}
                                            onChange={e => setNewAttachment(prev => ({ ...prev, url: e.target.value }))}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                if (newAttachment.name && newAttachment.url) {
                                                    setPendingAttachments(prev => [...prev, newAttachment]);
                                                    setNewAttachment({ name: '', url: '' });
                                                }
                                            }}
                                        >
                                            Thêm
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Thêm nhiều file đính kèm hoặc link tài nguyên</p>
                                </div>

                                <Button type="submit" variant="secondary" className="w-full">+ Thêm bài học</Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Lesson List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách bài học</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lessons.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Chưa có bài học nào.</p>
                            ) : (
                                <div className="space-y-2">
                                    {lessons.sort((a, b) => a.position - b.position).map((lesson, index) => (
                                        <LessonItem
                                            key={lesson.id}
                                            lesson={lesson}
                                            index={index}
                                            totalLessons={lessons.length}
                                            structure={courseForm.structure}
                                            onDelete={handleDeleteLesson}
                                            onUpdateLesson={handleUpdateLesson}
                                            onMoveLesson={handleMoveLesson}
                                            onAddAttachment={async (lessonId, data) => {
                                                try {
                                                    const attach = await api.admin.courses.addAttachment(lessonId, data);
                                                    setLessons(prev => prev.map(l => l.id === lessonId ? {
                                                        ...l,
                                                        attachments: [...(l.attachments || []), attach]
                                                    } : l));
                                                    addToast('Đã thêm tài liệu đính kèm', 'success');
                                                } catch (e) {
                                                    addToast('Thêm tài liệu đính kèm thất bại', 'error');
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function LessonItem({
    lesson,
    onDelete,
    onAddAttachment,
    onUpdateLesson,
    structure,
    onMoveLesson,
    index,
    totalLessons
}: {
    lesson: any,
    onDelete: (id: string) => void,
    onAddAttachment: (id: string, data: any) => void,
    onUpdateLesson?: (id: string, data: any) => void,
    structure: { title: string, sections: string[] }[],
    onMoveLesson: (index: number, direction: 'up' | 'down') => void,
    index: number,
    totalLessons: number
}) {
    const [expanded, setExpanded] = useState(false);
    const [attachForm, setAttachForm] = useState({ title: '', url: '' });
    const [title, setTitle] = useState(lesson.title || '');
    const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || '');
    const [duration, setDuration] = useState(lesson.duration || '');
    const [slug, setSlug] = useState(lesson.slug || '');
    const [chapter, setChapter] = useState(lesson.chapter || '');
    const [section, setSection] = useState(lesson.section || '');
    const [thumbnail, setThumbnail] = useState(lesson.thumbnail || '');
    const [content, setContent] = useState(lesson.content || '');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingVideo, setIsEditingVideo] = useState(false);
    const [isEditingDuration, setIsEditingDuration] = useState(false);
    const [isEditingSlug, setIsEditingSlug] = useState(false);
    const [isEditingChapter, setIsEditingChapter] = useState(false);
    const [isEditingSection, setIsEditingSection] = useState(false);
    const [isEditingThumbnail, setIsEditingThumbnail] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);

    // ... (keep handleSave functions)
    const handleSaveTitle = () => { if (onUpdateLesson) { onUpdateLesson(lesson.id, { title }); } setIsEditingTitle(false); };
    const handleSaveSlug = () => { if (onUpdateLesson) { onUpdateLesson(lesson.id, { slug }); } setIsEditingSlug(false); };
    const handleSaveVideoUrl = () => { if (onUpdateLesson) { onUpdateLesson(lesson.id, { videoUrl }); } setIsEditingVideo(false); };
    const handleSaveDuration = () => { if (onUpdateLesson) { onUpdateLesson(lesson.id, { duration }); } setIsEditingDuration(false); };

    // Helper to get sections for current chapter
    const currentChapterSections = structure.find(s => s.title === chapter)?.sections || [];

    const handleSaveChapter = () => {
        if (onUpdateLesson) {
            onUpdateLesson(lesson.id, { chapter });
        }
        setIsEditingChapter(false);
    };

    const handleSaveSection = () => {
        if (onUpdateLesson) {
            onUpdateLesson(lesson.id, { section });
        }
        setIsEditingSection(false);
    };

    const handleSaveContent = () => {
        if (onUpdateLesson) {
            onUpdateLesson(lesson.id, { content });
        }
        setIsEditingContent(false);
    };

    return (
        <div className="border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Main row - collapsed view */}
            <div className="p-4 flex items-center gap-4">
                {/* Reorder buttons - prominent placement */}
                <div className="flex flex-col gap-0.5">
                    <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMoveLesson(index, 'up')}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-muted hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-muted disabled:cursor-not-allowed transition-colors"
                        title="Di chuyển lên"
                    >
                        <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        disabled={index === totalLessons - 1}
                        onClick={() => onMoveLesson(index, 'down')}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-muted hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-muted disabled:cursor-not-allowed transition-colors"
                        title="Di chuyển xuống"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* Position badge */}
                <div className="w-10 h-10 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {lesson.position}
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0" onClick={() => setExpanded(!expanded)}>
                    <p className="font-semibold text-sm truncate">{lesson.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        {lesson.chapter && <span className="bg-muted px-1.5 py-0.5 rounded font-medium">{lesson.chapter}</span>}
                        {lesson.section && <span className="text-muted-foreground">• {lesson.section}</span>}
                        <span className={`${lesson.isFree ? 'text-green-600' : 'text-orange-500'}`}>
                            {lesson.isFree ? '✓ Miễn phí' : '🔒 Khóa'}
                        </span>
                        {lesson.duration && <span>• {lesson.duration}</span>}
                        {lesson.attachments?.length > 0 && (
                            <span className="flex items-center gap-0.5">
                                <Paperclip className="w-3 h-3" /> {lesson.attachments.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs"
                    >
                        {expanded ? 'Thu gọn' : 'Chi tiết'}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        onClick={() => onDelete(lesson.id)}
                        title="Xóa bài học"
                    >
                        ×
                    </Button>
                </div>
            </div>

            {expanded && (
                <div className="p-3 border-t bg-muted/20 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">Tiêu đề bài học</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Tên bài học"
                                    className="h-8 text-sm flex-1"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    disabled={!isEditingTitle}
                                />
                                {isEditingTitle ? (
                                    <>
                                        <Button size="sm" className="h-8" onClick={handleSaveTitle}>Lưu</Button>
                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => {
                                            setTitle(lesson.title || '');
                                            setIsEditingTitle(false);
                                        }}>Hủy</Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditingTitle(true)}>Sửa</Button>
                                )}
                            </div>
                        </div>

                        {/* Slug Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">Đường dẫn (Slug)</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="gioi-thieu-nextjs"
                                    className="h-8 text-sm flex-1"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    disabled={!isEditingSlug}
                                />
                                {isEditingSlug ? (
                                    <>
                                        <Button size="sm" className="h-8" onClick={handleSaveSlug}>Lưu</Button>
                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => {
                                            setSlug(lesson.slug || '');
                                            setIsEditingSlug(false);
                                        }}>Hủy</Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditingSlug(true)}>Sửa</Button>
                                )}
                            </div>
                        </div>

                        {/* Video URL Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">Video URL</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://..."
                                    className="h-8 text-sm flex-1"
                                    value={videoUrl}
                                    onChange={e => setVideoUrl(e.target.value)}
                                    disabled={!isEditingVideo}
                                />
                                {isEditingVideo ? (
                                    <>
                                        <Button size="sm" className="h-8" onClick={handleSaveVideoUrl}>Lưu</Button>
                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => {
                                            setVideoUrl(lesson.videoUrl || '');
                                            setIsEditingVideo(false);
                                        }}>Hủy</Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditingVideo(true)}>Sửa</Button>
                                )}
                            </div>
                        </div>

                        {/* Duration Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">Thời lượng</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="10:20"
                                    className="h-8 text-sm flex-1"
                                    value={duration}
                                    onChange={e => setDuration(e.target.value)}
                                    disabled={!isEditingDuration}
                                />
                                {isEditingDuration ? (
                                    <>
                                        <Button size="sm" className="h-8" onClick={handleSaveDuration}>Lưu</Button>
                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => {
                                            setDuration(lesson.duration || '');
                                            setIsEditingDuration(false);
                                        }}>Hủy</Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditingDuration(true)}>Sửa</Button>
                                )}
                            </div>
                        </div>

                        {/* Chapter Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">Chương (Module)</label>
                            <div className="flex gap-2">
                                {isEditingChapter ? (
                                    <>
                                        <div className="flex-1">
                                            <Select
                                                value={chapter}
                                                onChange={(val) => setChapter(val)}
                                                options={[
                                                    { value: '', label: 'Chọn chương' },
                                                    ...structure.map(s => ({ value: s.title, label: s.title }))
                                                ]}
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <Button size="sm" className="h-8" onClick={handleSaveChapter}>Lưu</Button>
                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => {
                                            setChapter(lesson.chapter || '');
                                            setIsEditingChapter(false);
                                        }}>Hủy</Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-1 text-sm py-1 px-3 border rounded bg-zinc-50">{chapter || 'Chưa có'}</div>
                                        <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditingChapter(true)}>Sửa</Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Section Part Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">Phần (Section)</label>
                            <div className="flex gap-2">
                                {isEditingSection ? (
                                    <>
                                        <div className="flex-1">
                                            <Select
                                                value={section}
                                                onChange={(val) => setSection(val)}
                                                options={[
                                                    { value: '', label: 'Chọn phần' },
                                                    ...(currentChapterSections.map(s => ({ value: s, label: s })))
                                                ]}
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <Button size="sm" className="h-8" onClick={handleSaveSection}>Lưu</Button>
                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => {
                                            setSection(lesson.section || '');
                                            setIsEditingSection(false);
                                        }}>Hủy</Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-1 text-sm py-1 px-3 border rounded bg-zinc-50">{section || 'Chưa có'}</div>
                                        <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditingSection(true)}>Sửa</Button>
                                    </>
                                )}
                            </div>
                        </div>


                        {/* Thumbnail Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">Thumbnail (Ảnh bìa)</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://..."
                                    className="h-8 text-sm flex-1"
                                    value={thumbnail}
                                    onChange={e => setThumbnail(e.target.value)}
                                    disabled={!isEditingThumbnail}
                                />
                                {isEditingThumbnail ? (
                                    <>
                                        <Button size="sm" className="h-8" onClick={() => {
                                            if (onUpdateLesson) {
                                                onUpdateLesson(lesson.id, { thumbnail });
                                            }
                                            setIsEditingThumbnail(false);
                                        }}>Lưu</Button>
                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => {
                                            setThumbnail(lesson.thumbnail || '');
                                            setIsEditingThumbnail(false);
                                        }}>Hủy</Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditingThumbnail(true)}>Sửa</Button>
                                )}
                            </div>
                            {thumbnail && (
                                <div className="mt-1 w-20 h-12 rounded border bg-zinc-100 overflow-hidden relative">
                                    <img src={thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Free View Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground block">Xem miễn phí</label>
                            <div className="flex items-center h-8">
                                <Switch
                                    checked={lesson.isFree}
                                    onChange={(checked) => {
                                        if (onUpdateLesson) {
                                            onUpdateLesson(lesson.id, { isFree: checked });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Attachments Section */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground">Tài liệu đính kèm</label>
                        {lesson.attachments && lesson.attachments.length > 0 ? (
                            <ul className="space-y-1">
                                {lesson.attachments.map((att: any) => (
                                    <li key={att.id} className="flex items-center justify-between text-sm bg-background p-2 rounded border">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">{att.type}</span>
                                            <a href={att.url} target="_blank" rel="noreferrer" className="hover:underline">{att.name}</a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground">Chưa có tài liệu đính kèm.</p>
                        )}
                    </div>

                    {/* Add Attachment Form */}
                    <div className="space-y-3 pt-2 border-t border-dashed">
                        <label className="text-xs font-medium">Thêm tài liệu mới</label>

                        {/* File Upload Option */}
                        <div className="border border-dashed border-muted-foreground/30 rounded-lg p-3 text-center hover:border-foreground/50 transition-colors">
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                id={`lesson-file-${lesson.id}`}
                                onChange={async (e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        // Upload files to server
                                        for (const file of Array.from(files)) {
                                            try {
                                                const result = await api.uploads.single(file);
                                                if (result.success) {
                                                    onAddAttachment(lesson.id, {
                                                        title: result.file.originalName,
                                                        url: result.file.url,
                                                        type: 'FILE'
                                                    });
                                                }
                                            } catch (err) {
                                                console.error('Upload failed:', err);
                                            }
                                        }
                                    }
                                }}
                            />
                            <label htmlFor={`lesson-file-${lesson.id}`} className="cursor-pointer flex flex-col items-center gap-1">
                                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-xs text-muted-foreground">Tải file lên server</span>
                            </label>
                        </div>

                        {/* Or add via URL */}
                        <div className="text-center text-xs text-muted-foreground">hoặc thêm bằng URL</div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Tên (vd: Slide bài giảng)"
                                className="h-8 text-sm"
                                value={attachForm.title || ''}
                                onChange={e => setAttachForm({ ...attachForm, title: e.target.value })}
                            />
                            <Input
                                placeholder="URL (vd: Link Google Drive)"
                                className="h-8 text-sm"
                                value={attachForm.url || ''}
                                onChange={e => setAttachForm({ ...attachForm, url: e.target.value })}
                            />
                            <Button
                                size="sm"
                                onClick={() => {
                                    if (attachForm.title && attachForm.url) {
                                        onAddAttachment(lesson.id, { ...attachForm, type: 'FILE' });
                                        setAttachForm({ title: '', url: '' });
                                    }
                                }}
                            >
                                Thêm
                            </Button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}

