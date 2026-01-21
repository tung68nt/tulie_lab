'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { ArrowUp, ArrowDown, Edit, Eye, EyeOff, Trash2, ArrowLeft, Save } from 'lucide-react';
import { DEFAULT_HOME_SECTIONS, DEFAULT_ABOUT_PAGE_SECTIONS, DEFAULT_INSTRUCTORS_PAGE_SECTIONS } from '@/lib/defaultContent';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { SectionLibraryModal } from '@/components/system/admin/SectionLibraryModal';
import { SectionEditorModal } from '@/components/system/admin/SectionEditorModal';
import { SectionTemplate } from '@/lib/section-templates';
import { Section } from '@/types/sections';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

interface CmsResponse {
    [key: string]: string;
}

// Map slug (cms-home) to DB Key and Title
const PAGE_CONFIG: Record<string, { key: string, title: string, defaultContent: any[] }> = {
    'cms-home': {
        key: 'home_page_sections',
        title: 'Trang chủ (Home)',
        defaultContent: DEFAULT_HOME_SECTIONS
    },
    'cms-about': {
        key: 'about_page_sections',
        title: 'Về chúng tôi (About)',
        defaultContent: DEFAULT_ABOUT_PAGE_SECTIONS
    },
    'cms-instructors': {
        key: 'instructors_sections',
        title: 'Giảng viên (Instructors)',
        defaultContent: DEFAULT_INSTRUCTORS_PAGE_SECTIONS
    }
};

export default function CmsPageEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
    const confirm = useConfirm();

    // Verify if this is a valid CMS page
    const config = PAGE_CONFIG[id];

    const [jsonContent, setJsonContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!config) {
            router.push('/admin/system-pages');
            return;
        }
        loadSettings();
    }, [id]);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await api.cms.get([config.key]) as CmsResponse;
            if (data && data[config.key]) {
                try {
                    const parsed = JSON.parse(data[config.key]);
                    setJsonContent(JSON.stringify(parsed, null, 2));
                } catch (parseError) {
                    console.warn('DB content corrupted, using default');
                    setJsonContent(JSON.stringify(config.defaultContent, null, 2));
                }
            } else {
                setJsonContent(JSON.stringify(config.defaultContent, null, 2));
            }
        } catch (error) {
            console.warn('Failed to load CMS content (using default)', error);
            setJsonContent(JSON.stringify(config.defaultContent, null, 2));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let contentToSave = jsonContent;

            // Validate JSON
            try {
                JSON.parse(contentToSave);
            } catch (e) {
                addToast('JSON không hợp lệ: ' + (e as Error).message, 'error');
                setSaving(false);
                return;
            }

            await api.admin.cms.update({ key: config.key, value: contentToSave, type: 'json' });
            addToast('Đã lưu thành công', 'success');
        } catch (error) {
            console.error(error);
            addToast('Lưu thất bại', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        const confirmed = await confirm({
            title: 'Reset Default Content?',
            message: 'Bạn có chắc chắn muốn reset về mặc định? Hành động này không thể hoàn tác.',
            variant: 'warning',
            confirmText: 'Reset',
            cancelText: 'Cancel'
        });

        if (confirmed) {
            setJsonContent(JSON.stringify(config.defaultContent, null, 2));
            addToast('Đã reset nội dung (Chưa lưu)', 'info');
        }
    };

    // Builder Helpers
    const getSections = (): Section[] => {
        try {
            const sections = JSON.parse(jsonContent);
            return Array.isArray(sections) ? sections : [];
        } catch {
            return [];
        }
    };

    const updateSections = (newSections: Section[]) => {
        setJsonContent(JSON.stringify(newSections, null, 2));
    };

    const sections = getSections();

    if (!config) return null;

    return (
        <div className="space-y-6 pb-20">
            <AdminPageHeader
                title={config.title}
                subtitle="Cấu hình các section hiển thị trên trang"
                backUrl="/admin/system-pages"
            >
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleReset}>Reset Mặc định</Button>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        <Save className="h-4 w-4" />
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </AdminPageHeader>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Page Builder (Kéo thả & Sắp xếp)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {sections.map((section, index) => (
                                <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${section.isVisible === false ? 'opacity-50 bg-muted' : 'bg-card'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs px-2 py-1 bg-muted rounded min-w-[24px] text-center">{index + 1}</span>
                                        <div>
                                            <p className="font-semibold capitalize flex items-center gap-2">
                                                {section.type} Section
                                                {section.isVisible === false && <span className="text-xs font-normal text-muted-foreground">(Đã ẩn)</span>}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">{section.title || section.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => setEditingSectionIndex(index)} title="Sửa nội dung">
                                            <Edit size={14} />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => {
                                            const newSections = [...sections];
                                            newSections[index].isVisible = !(newSections[index].isVisible ?? true);
                                            updateSections(newSections);
                                        }} title={section.isVisible === false ? 'Hiện' : 'Ẩn'}>
                                            {section.isVisible === false ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors" disabled={index === 0} onClick={() => {
                                                const newSections = [...sections];
                                                [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
                                                updateSections(newSections);
                                            }} title="Lên">
                                                <ArrowUp size={14} />
                                            </Button>
                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors" disabled={index === sections.length - 1} onClick={() => {
                                                const newSections = [...sections];
                                                [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                                                updateSections(newSections);
                                            }} title="Xuống">
                                                <ArrowDown size={14} />
                                            </Button>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
                                            onClick={async () => {
                                                const confirmed = await confirm({
                                                    title: 'Xóa Section?',
                                                    message: 'Bạn có chắc chắn muốn xóa section này?',
                                                    variant: 'danger',
                                                    confirmText: 'Xóa',
                                                });
                                                if (!confirmed) return;
                                                const newSections = [...sections];
                                                newSections.splice(index, 1);
                                                updateSections(newSections);
                                            }}
                                            title="Xóa"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Section Button */}
                        <div className="relative inline-block">
                            <Button onClick={() => setIsLibraryOpen(true)} variant="secondary" className="gap-2">
                                + Thêm Section Mới
                            </Button>

                            <SectionLibraryModal
                                isOpen={isLibraryOpen}
                                onClose={() => setIsLibraryOpen(false)}
                                onSelect={(template: SectionTemplate) => {
                                    const newSections = [...sections];
                                    newSections.push({
                                        ...template.data,
                                        id: `${template.data.type}-${Date.now()}`
                                    });
                                    updateSections(newSections);
                                    setIsLibraryOpen(false);
                                    addToast(`Đã thêm ${template.name}`, 'success');
                                }}
                            />

                            {editingSectionIndex !== null && (
                                <SectionEditorModal
                                    isOpen={editingSectionIndex !== null}
                                    section={sections[editingSectionIndex]}
                                    onClose={() => setEditingSectionIndex(null)}
                                    onSave={(updatedSection: Section) => {
                                        const newSections = [...sections];
                                        newSections[editingSectionIndex] = updatedSection;
                                        updateSections(newSections);
                                        setEditingSectionIndex(null);
                                        addToast('Đã cập nhật section', 'success');
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Advanced JSON Editor</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea
                        className="flex min-h-[400px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm font-mono"
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
