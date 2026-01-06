'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { ChevronDown, ChevronUp, Paperclip, Eye } from 'lucide-react';
import { Switch } from '@/components/Switch';

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
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
        level: 'ALL'
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
                // Fetch instructors list
                const instructorsList: any = await api.instructors.list().catch(() => []);
                setInstructors(Array.isArray(instructorsList) ? instructorsList : []);

                // Fetch categories list
                const categoriesList: any = await api.categories.list().catch(() => []);
                setCategories(Array.isArray(categoriesList) ? categoriesList : []);

                // Fetch full course details directly by ID
                const fullDetails: any = await api.admin.courses.get(id);

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
                        level: fullDetails.level || 'ALL'
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
    }, [id, router]);

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
        if (!confirm('Xóa bài học này?')) return;
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

    if (loading) return <div className="p-8">Đang tải...</div>;
    if (!course) return <div className="p-8">Không tìm thấy khóa học</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Chỉnh sửa: {course.title}</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.push('/admin/courses')}>← Quay lại</Button>
                    <Button variant="outline" onClick={() => window.open(`/courses/${courseForm.slug}`, '_blank')} className="gap-2">
                        <Eye className="h-4 w-4" /> Xem khóa học
                    </Button>
                </div>
            </div>

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
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                                    value={courseForm.description}
                                    onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                                    placeholder="Mô tả chi tiết về khóa học..."
                                />
                            </div>



                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Học phí (VNĐ)</label>
                                    <Input type="number" value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) })} />
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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Danh mục</label>
                                    <div className="relative">
                                        <select
                                            value={courseForm.categoryId}
                                            onChange={e => setCourseForm({ ...courseForm, categoryId: e.target.value })}
                                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-8"
                                        >
                                            <option value="">-- Chưa phân loại --</option>
                                            {categories.map((cat: any) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Trình độ</label>
                                    <div className="relative">
                                        <select
                                            value={courseForm.level}
                                            onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}
                                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-8"
                                        >
                                            <option value="ALL">Tất cả trình độ</option>
                                            <option value="BEGINNER">Cơ bản (Beginner)</option>
                                            <option value="INTERMEDIATE">Trung cấp (Intermediate)</option>
                                            <option value="ADVANCED">Nâng cao (Advanced)</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Giảng viên</label>
                                <div className="relative">
                                    <select
                                        value={courseForm.instructorId}
                                        onChange={e => setCourseForm({ ...courseForm, instructorId: e.target.value })}
                                        className="flex h-10 w-full appearance-none rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-8"
                                    >
                                        <option value="">-- Chọn giảng viên --</option>
                                        {instructors.map((instructor: any) => (
                                            <option key={instructor.id} value={instructor.id}>
                                                {instructor.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full">Lưu thay đổi</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Lessons Management */}
                <div className="space-y-6">
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
                                        <Input
                                            placeholder="vd: Chương 1: Cơ bản"
                                            value={newLesson.chapter}
                                            onChange={e => setNewLesson({ ...newLesson, chapter: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phần (Section)</label>
                                        <Input
                                            placeholder="vd: Phần 1.1: Cài đặt"
                                            value={newLesson.section}
                                            onChange={e => setNewLesson({ ...newLesson, section: e.target.value })}
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
                                        <Input type="number" value={newLesson.position} onChange={e => setNewLesson({ ...newLesson, position: parseInt(e.target.value) })} />
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
                                                            }
                                                        } catch (err) {
                                                            console.error('Upload failed:', err);
                                                            addToast('Upload thất bại', 'error');
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách bài học</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lessons.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Chưa có bài học nào.</p>
                            ) : (
                                <div className="space-y-2">
                                    {lessons.sort((a, b) => a.position - b.position).map((lesson) => (
                                        <LessonItem
                                            key={lesson.id}
                                            lesson={lesson}
                                            onDelete={handleDeleteLesson}
                                            onUpdateLesson={handleUpdateLesson}
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

function LessonItem({ lesson, onDelete, onAddAttachment, onUpdateLesson }: {
    lesson: any,
    onDelete: (id: string) => void,
    onAddAttachment: (id: string, data: any) => void,
    onUpdateLesson?: (id: string, data: any) => void
}) {
    const [expanded, setExpanded] = useState(false);
    const [attachForm, setAttachForm] = useState({ title: '', url: '' });
    const [title, setTitle] = useState(lesson.title || '');
    const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || '');
    const [duration, setDuration] = useState(lesson.duration || '');
    const [slug, setSlug] = useState(lesson.slug || '');
    const [chapter, setChapter] = useState(lesson.chapter || '');
    const [section, setSection] = useState(lesson.section || '');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingVideo, setIsEditingVideo] = useState(false);
    const [isEditingDuration, setIsEditingDuration] = useState(false);
    const [isEditingSlug, setIsEditingSlug] = useState(false);
    const [isEditingChapter, setIsEditingChapter] = useState(false);
    const [isEditingSection, setIsEditingSection] = useState(false);

    const handleSaveTitle = () => {
        if (onUpdateLesson) {
            onUpdateLesson(lesson.id, { title });
        }
        setIsEditingTitle(false);
    };

    const handleSaveSlug = () => {
        if (onUpdateLesson) {
            onUpdateLesson(lesson.id, { slug });
        }
        setIsEditingSlug(false);
    };

    const handleSaveVideoUrl = () => {
        if (onUpdateLesson) {
            onUpdateLesson(lesson.id, { videoUrl });
        }
        setIsEditingVideo(false);
    };

    const handleSaveDuration = () => {
        if (onUpdateLesson) {
            onUpdateLesson(lesson.id, { duration });
        }
        setIsEditingDuration(false);
    };

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

    return (
        <div className="border rounded-md bg-card">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {lesson.position}
                    </span>
                    <div>
                        <p className="text-sm font-medium">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            {lesson.chapter && <span className="text-primary font-medium">{lesson.chapter}</span>}
                            {lesson.section && <span className="text-muted-foreground">• {lesson.section}</span>}
                            • {lesson.isFree ? 'Xem miễn phí' : 'Khóa'} • {lesson.attachments?.length || 0} đính kèm
                            • {lesson.videoUrl ? 'Có video' : 'Không có video'}
                            {lesson.duration && ` • ${lesson.duration}`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Thu gọn' : 'Chi tiết'}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-foreground hover:bg-foreground hover:text-background h-8 w-8 p-0"
                        onClick={() => onDelete(lesson.id)}
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
                                <Input
                                    placeholder="Chương 1: Mở đầu"
                                    className="h-8 text-sm flex-1"
                                    value={chapter}
                                    onChange={e => setChapter(e.target.value)}
                                    disabled={!isEditingChapter}
                                />
                                {isEditingChapter ? (
                                    <>
                                        <Button size="sm" className="h-8" onClick={handleSaveChapter}>Lưu</Button>
                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => {
                                            setChapter(lesson.chapter || '');
                                            setIsEditingChapter(false);
                                        }}>Hủy</Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditingChapter(true)}>Sửa</Button>
                                )}
                            </div>
                        </div>

                        {/* Section Part Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground">Phần (Section)</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Phần 1.1: Tổng quan"
                                    className="h-8 text-sm flex-1"
                                    value={section}
                                    onChange={e => setSection(e.target.value)}
                                    disabled={!isEditingSection}
                                />
                                {isEditingSection ? (
                                    <>
                                        <Button size="sm" className="h-8" onClick={handleSaveSection}>Lưu</Button>
                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => {
                                            setSection(lesson.section || '');
                                            setIsEditingSection(false);
                                        }}>Hủy</Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditingSection(true)}>Sửa</Button>
                                )}
                            </div>
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
            )}
        </div>
    );
}

