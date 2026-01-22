'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { ArrowUp, ArrowDown, X, Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { DEFAULT_LANDING_PAGE_SECTIONS, DEFAULT_HOME_SECTIONS, DEFAULT_ABOUT_PAGE_SECTIONS, DEFAULT_INSTRUCTORS_PAGE_SECTIONS } from '@/lib/defaultContent';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { SectionLibraryModal } from '@/components/system/admin/SectionLibraryModal';
import { SectionEditorModal } from '@/components/system/admin/SectionEditorModal';
import { SectionTemplate } from '@/lib/section-templates';
import { Section } from '@/types/sections';

interface CmsResponse {
    [key: string]: string;
}

// Helper functions
const getCmsKey = (tab: string) => {
    switch (tab) {
        case 'home': return 'home_page_sections';
        case 'about': return 'about_page_sections';
        case 'instructors': return 'instructors_sections';
        default: return 'home_page_sections';
    }
};

const getDefaultContent = (tab: string) => {
    switch (tab) {
        case 'home': return DEFAULT_HOME_SECTIONS;
        case 'about': return DEFAULT_ABOUT_PAGE_SECTIONS;
        case 'instructors': return DEFAULT_INSTRUCTORS_PAGE_SECTIONS;
        default: return [];
    }
};




export default function AdminContentPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [activeTab, setActiveTab] = useState<'home' | 'about' | 'instructors'>('home');
    const [jsonContent, setJsonContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

    useEffect(() => {
        loadSettings(activeTab);
    }, [activeTab]);

    const handleSave = async () => {
        setSaving(true);
        try {
            let contentToSave = jsonContent;

            // Try parsing
            try {
                JSON.parse(contentToSave);
            } catch (e) {
                // Heuristic: Check for duplicate object copy-paste error (e.g. }{ or } {)
                if (contentToSave.match(/}\s*{/)) {
                    const confirmed = await confirm({
                        title: 'Duplicate JSON Objects',
                        message: 'JSON appears to be duplicated (two objects found). Do you want to automatically fix it by keeping only the first one?',
                        variant: 'warning',
                        confirmText: 'Fix Automatically',
                        cancelText: 'Cancel'
                    });

                    if (confirmed) {
                        const parts = contentToSave.split(/}\s*{/);
                        contentToSave = parts[0] + '}';
                        try {
                            // Verify fix
                            JSON.parse(contentToSave);
                            setJsonContent(contentToSave); // Update UI
                        } catch (fixErr) {
                            addToast('Không thể tự động sửa. Vui lòng reset về mặc định.', 'error');
                            setSaving(false);
                            return;
                        }
                    } else {
                        setSaving(false);
                        return;
                    }
                } else {
                    addToast('JSON không hợp lệ: ' + (e as Error).message, 'error');
                    setSaving(false);
                    return;
                }
            }

            await api.admin.cms.update({ key: getCmsKey(activeTab), value: contentToSave, type: 'json' });
            addToast('Đã lưu thành công', 'success');
        } catch (error) {
            console.error(error);
            addToast('Lưu thất bại', 'error');
        } finally {
            setSaving(false);
        }
    };

    const loadSettings = async (tab: string) => {
        setLoading(true);
        try {
            const key = getCmsKey(tab);
            const data = await api.cms.get([key]) as CmsResponse;

            // Race condition check: Ensure we are still on the same tab
            if (tab !== activeTab) return;

            if (data && data[key]) {
                try {
                    const parsed = JSON.parse(data[key]);
                    setJsonContent(JSON.stringify(parsed, null, 2));
                } catch (parseError) {
                    console.warn('DB content corrupted, using default');
                    setJsonContent(JSON.stringify(getDefaultContent(tab), null, 2));
                }
            } else {
                setJsonContent(JSON.stringify(getDefaultContent(tab), null, 2));
            }
        } catch (error) {
            if (tab !== activeTab) return;
            console.warn('Failed to load CMS content (using default)', error);
            setJsonContent(JSON.stringify(getDefaultContent(tab), null, 2));
        } finally {
            if (tab === activeTab) setLoading(false);
        }
    };

    const handleReset = async () => {
        const confirmed = await confirm({
            title: 'Reset Default Content?',
            message: 'Are you sure you want to reset the content to default? This action cannot be undone.',
            variant: 'warning',
            confirmText: 'Reset',
            cancelText: 'Cancel'
        });

        if (confirmed) {
            setJsonContent(JSON.stringify(getDefaultContent(activeTab), null, 2));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Content Management</h1>
                <div className="space-x-2">
                    <Button variant="outline" onClick={handleReset}>Reset Default</Button>
                    <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
            </div>

            <div className="flex gap-2 border-b pb-2">
                <Button variant={activeTab === 'home' ? 'default' : 'ghost'} onClick={() => setActiveTab('home')}>Home Page</Button>
                <Button variant={activeTab === 'about' ? 'default' : 'ghost'} onClick={() => setActiveTab('about')}>About Page</Button>
                <Button variant={activeTab === 'instructors' ? 'default' : 'ghost'} onClick={() => setActiveTab('instructors')}>Instructors</Button>
            </div>

            {/* Page Builder UI - Enabled for all tabs */}
            {(activeTab === 'home' || activeTab === 'about' || activeTab === 'instructors') && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Page Builder (Structure & Ordering)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {(() => {
                                try {
                                    const sections: any[] = JSON.parse(jsonContent || '[]');
                                    if (!Array.isArray(sections)) return <p className="font-bold">Invalid JSON structure</p>;

                                    const moveSection = (index: number, direction: 'up' | 'down') => {
                                        const newSections = [...sections];
                                        if (direction === 'up' && index > 0) {
                                            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
                                        } else if (direction === 'down' && index < newSections.length - 1) {
                                            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
                                        }
                                        setJsonContent(JSON.stringify(newSections, null, 2));
                                    };

                                    const toggleVisibility = (index: number) => {
                                        const newSections = [...sections];
                                        newSections[index].isVisible = !(newSections[index].isVisible ?? true); // Default to true if undefined
                                        setJsonContent(JSON.stringify(newSections, null, 2));
                                    };



                                    const deleteSection = async (index: number) => {
                                        const confirmed = await confirm({
                                            title: 'Remove Section?',
                                            message: 'Are you sure you want to remove this section?',
                                            variant: 'danger',
                                            confirmText: 'Remove',
                                            cancelText: 'Cancel'
                                        });
                                        if (!confirmed) return;
                                        const newSections = [...sections];
                                        newSections.splice(index, 1);
                                        setJsonContent(JSON.stringify(newSections, null, 2));
                                    };

                                    return (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                {sections.map((section, index) => (
                                                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${section.isVisible === false ? 'opacity-50 bg-muted' : 'bg-card'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs px-2 py-1 bg-muted rounded min-w-[24px] text-center">{index + 1}</span>
                                                            <div>
                                                                <p className="font-semibold capitalize flex items-center gap-2">
                                                                    {section.type} Section
                                                                    {section.isVisible === false && <span className="text-xs font-normal text-muted-foreground">(Hidden)</span>}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground truncate max-w-[300px]">{section.title || section.id}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => setEditingSectionIndex(index)} title="Edit Section">
                                                                <Edit size={14} />
                                                            </Button>
                                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => toggleVisibility(index)} title={section.isVisible === false ? 'Show' : 'Hide'}>
                                                                {section.isVisible === false ? <EyeOff size={14} /> : <Eye size={14} />}
                                                            </Button>
                                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors" disabled={index === 0} onClick={() => moveSection(index, 'up')} title="Move Up">
                                                                <ArrowUp size={14} />
                                                            </Button>
                                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors" disabled={index === sections.length - 1} onClick={() => moveSection(index, 'down')} title="Move Down">
                                                                <ArrowDown size={14} />
                                                            </Button>
                                                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors" onClick={() => deleteSection(index)} title="Delete">
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add Section Button */}
                                            <div className="relative inline-block">
                                                <Button onClick={() => setIsLibraryOpen(true)} variant="secondary" className="gap-2">
                                                    + Add New Section
                                                </Button>

                                                <SectionLibraryModal
                                                    isOpen={isLibraryOpen}
                                                    onClose={() => setIsLibraryOpen(false)}
                                                    onSelect={(template: SectionTemplate) => {
                                                        const newSections = [...sections];
                                                        newSections.push({
                                                            ...template.data,
                                                            id: `${template.data.type}-${Date.now()}` // Unique ID
                                                        });
                                                        setJsonContent(JSON.stringify(newSections, null, 2));
                                                        setIsLibraryOpen(false);
                                                        addToast(`Added ${template.name}`, 'success');
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
                                                            setJsonContent(JSON.stringify(newSections, null, 2));
                                                            setEditingSectionIndex(null);
                                                            addToast('Section updated', 'success');
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                } catch (e) {
                                    return <p className="text-muted-foreground">Valid JSON required to use Builder</p>;
                                }
                            })()}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Advanced JSON Editor ({activeTab})</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea
                        className="flex min-h-[600px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm font-semibold"
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
