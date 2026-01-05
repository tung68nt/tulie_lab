'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { DEFAULT_LANDING_PAGE_SECTIONS, DEFAULT_ABOUT_PAGE_SECTIONS, DEFAULT_INSTRUCTORS_PAGE_SECTIONS } from '@/lib/defaultContent';
import { useToast } from '@/contexts/ToastContext';

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
        case 'home': return DEFAULT_LANDING_PAGE_SECTIONS;
        case 'about': return DEFAULT_ABOUT_PAGE_SECTIONS;
        case 'instructors': return DEFAULT_INSTRUCTORS_PAGE_SECTIONS;
        default: return [];
    }
};


const SECTION_TEMPLATES: Record<string, any> = {
    hero: {
        type: 'hero',
        title: 'New Hero Section',
        subtitle: 'Hero subtitle goes here',
        ctaText: 'Call to Action',
        ctaLink: '/',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c'
    },
    stats: {
        type: 'stats',
        title: 'New Stats Section',
        subtitle: 'Stats subtitle',
        content: 'Description text',
        items: [
            { title: 'Stat 1', description: 'Description 1', icon: 'Chart' },
            { title: 'Stat 2', description: 'Description 2', icon: 'Users' }
        ]
    },
    comparison: {
        type: 'comparison',
        title: 'Comparison',
        subtitle: 'Compare features',
        content: 'Comparison description',
        items: [
            {
                title: 'Option A',
                description: 'Description A',
                features: ['Feature 1', 'Feature 2']
            },
            {
                title: 'Option B',
                description: 'Description B',
                price: 'Best Value',
                features: ['Feature 1', 'Feature 2', 'Feature 3']
            }
        ]
    },
    process: {
        type: 'process',
        title: 'Process Section',
        subtitle: 'How it works',
        items: [
            { title: 'Step 1', description: 'Do this first' },
            { title: 'Step 2', description: 'Do this second' }
        ]
    },
    testimonials: {
        type: 'testimonials',
        title: 'Testimonials',
        subtitle: 'What people say'
    },
    projects: {
        type: 'projects',
        title: 'Our Projects',
        subtitle: 'Featured work'
    },
    benefits: {
        type: 'benefits',
        title: 'Benefits',
        subtitle: 'Why choose us'
    },
    cta: {
        type: 'cta',
        title: 'Ready to start?',
        subtitle: 'Join us today',
        ctaText: 'Get Started',
        ctaLink: '/register'
    },
    content: {
        type: 'content',
        title: 'Content Section',
        subtitle: 'Subtitle',
        content: 'Long content goes here...',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978'
    }
};

export default function AdminContentPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'home' | 'about' | 'instructors'>('home');
    const [jsonContent, setJsonContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

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
                    if (confirm('JSON appears to be duplicated (two objects found). Do you want to automatically fix it by keeping only the first one?')) {
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

    const handleReset = () => {
        if (confirm('Are you sure?')) {
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

                                    const addSection = (type: string) => {
                                        const newSections = [...sections];
                                        const template = SECTION_TEMPLATES[type];
                                        if (template) {
                                            newSections.push({
                                                ...template,
                                                id: `${type}-${Date.now()}` // Unique ID
                                            });
                                            setJsonContent(JSON.stringify(newSections, null, 2));
                                            setIsAddMenuOpen(false);
                                            addToast(`Added ${type} section`, 'success');
                                        }
                                    };

                                    const deleteSection = (index: number) => {
                                        if (!confirm('Are you sure you want to remove this section?')) return;
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
                                                        <div className="flex items-center gap-2">
                                                            <Button size="sm" variant="ghost" onClick={() => toggleVisibility(index)} title="Toggle Visibility">
                                                                {section.isVisible === false ? 'Show' : 'Hide'}
                                                            </Button>
                                                            <div className="flex gap-1">
                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" disabled={index === 0} onClick={() => moveSection(index, 'up')}>↑</Button>
                                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" disabled={index === sections.length - 1} onClick={() => moveSection(index, 'down')}>↓</Button>
                                                            </div>
                                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 ml-2 hover:bg-muted" onClick={() => deleteSection(index)} title="Delete">
                                                                ✕
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add Section Button */}
                                            <div className="relative inline-block">
                                                <Button onClick={() => setIsAddMenuOpen(!isAddMenuOpen)} variant="secondary" className="gap-2">
                                                    + Add New Section
                                                </Button>

                                                {isAddMenuOpen && (
                                                    <div className="absolute top-full left-0 mt-2 w-56 rounded-md border bg-popover p-1 shadow-md z-50">
                                                        <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Select Type</p>
                                                        {Object.keys(SECTION_TEMPLATES).map((type) => (
                                                            <button
                                                                key={type}
                                                                className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground capitalize"
                                                                onClick={() => addSection(type)}
                                                            >
                                                                {type === 'cta' ? 'CTA' : type}
                                                            </button>
                                                        ))}
                                                    </div>
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
                        className="flex min-h-[600px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm font-mono"
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
