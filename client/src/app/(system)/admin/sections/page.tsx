'use client';

import { useState } from 'react';
import { SECTION_TEMPLATES, SectionTemplate } from '@/lib/section-templates';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Search, Grid, List as ListIcon, Layout, Copy, Eye, Users, Zap, Star, Monitor, Settings, Plus, Compass, FileText, MessageSquare, TrendingUp, Sparkles, Layers, Folder, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';
import { SectionRenderer } from '@/components/SectionRenderer';

export default function SectionGalleryPage() {
    const { addToast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [previewTemplate, setPreviewTemplate] = useState<SectionTemplate | null>(null);

    const categories = ['All', ...Array.from(new Set(SECTION_TEMPLATES.map(t => t.category)))];

    const filteredTemplates = SECTION_TEMPLATES.filter(template => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.data.type.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'Hero': return <Compass className="w-4 h-4" />;
            case 'Content': return <FileText className="w-4 h-4" />;
            case 'Social Proof': return <MessageSquare className="w-4 h-4" />;
            case 'Conversion': return <TrendingUp className="w-4 h-4" />;
            case 'Special': return <Sparkles className="w-4 h-4" />;
            case 'System': return <Layers className="w-4 h-4" />;
            default: return <Folder className="w-4 h-4" />;
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast('Đã sao chép ID vào bộ nhớ tạm', 'success');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kho Section</h1>
                    <p className="text-muted-foreground mt-1">
                        Thư viện các mẫu section có sẵn để sử dụng cho Landing Pages.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm section..."
                            className="w-full pl-9 pr-4 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex border rounded-md overflow-hidden h-10">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'bg-background text-muted-foreground hover:bg-muted/50'}`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-muted text-foreground' : 'bg-background text-muted-foreground hover:bg-muted/50'}`}
                        >
                            <ListIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area with Sidebar */}
            <div className="flex flex-1 overflow-hidden border rounded-xl bg-background shadow-sm">
                {/* Sidebar Categories */}
                <aside className="w-40 md:w-52 border-r border-border overflow-y-auto p-4 flex flex-col gap-2 bg-muted/20">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${selectedCategory === cat
                                ? 'bg-foreground text-background shadow-md font-medium'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {cat !== 'All' && getCategoryIcon(cat)}
                            <span className="text-sm">{cat === 'All' ? 'Tất cả' : cat}</span>
                        </button>
                    ))}
                </aside>

                {/* Template Grid/List */}
                <main className="flex-1 overflow-y-auto p-6 bg-muted/5">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            {filteredTemplates.map((template) => (
                                <div key={template.id} className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                                    {/* Preview Area */}
                                    <div className="h-48 bg-muted relative group-hover:bg-muted/80 transition-colors overflow-hidden border-b">
                                        {/* Scaled Preview */}
                                        <div className="absolute top-0 left-0 w-[500%] origin-top-left transform scale-[0.2] pointer-events-none select-none bg-background">
                                            <SectionRenderer section={template.data} />
                                        </div>

                                        {/* Tag Overlay */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <Badge variant="outline" className="text-[10px] font-bold px-2 py-1 bg-background/90 backdrop-blur-sm border-border shadow-sm flex items-center gap-1.5 capitalize">
                                                {getCategoryIcon(template.category)}
                                                {template.data.type}
                                            </Badge>
                                        </div>

                                        {/* ID Overlay on Hover - Simplified */}
                                        <div className="absolute inset-0 bg-background/20 backdrop-blur-[0.5px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                            <button
                                                onClick={() => copyToClipboard(template.id)}
                                                className="bg-background/95 hover:bg-background text-foreground px-3 py-1.5 rounded-full shadow-lg border border-border flex items-center gap-2 text-[10px] font-mono transition-all transform hover:scale-105 active:scale-95"
                                                title="Copy Template ID"
                                            >
                                                <Copy className="h-3 w-3" />
                                                <span>{template.id}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-base tracking-tight group-hover:text-primary transition-colors">{template.name}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                            {template.description}
                                        </p>
                                        <div className="mt-auto flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full flex items-center gap-2 h-8 text-xs font-semibold"
                                                onClick={() => setPreviewTemplate(template)}
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Xem mẫu
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-border rounded-lg divide-y bg-background overflow-hidden shadow-sm">
                            {filteredTemplates.map((template) => (
                                <div key={template.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-16 bg-muted rounded border overflow-hidden relative shrink-0">
                                            <div className="absolute top-0 left-0 w-[1000%] origin-top-left transform scale-[0.1] pointer-events-none bg-background">
                                                <SectionRenderer section={template.data} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">{template.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">ID: {template.id}</span>
                                                <Badge variant="secondary" className="text-[10px] h-5 py-0 px-2 leading-none flex items-center gap-1.5 capitalize">
                                                    {getCategoryIcon(template.category)}
                                                    {template.data.type}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground italic truncate max-w-[200px]">{template.description}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Copy ID" onClick={() => copyToClipboard(template.id)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-3 text-xs flex items-center gap-1.5 font-medium"
                                            onClick={() => setPreviewTemplate(template)}
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            Xem mẫu
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-20 bg-muted/10 border-2 border-dashed rounded-xl">
                            <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-lg font-medium">Không tìm thấy section nào</h3>
                            <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Preview Modal */}
            {previewTemplate && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-background w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">
                        <div className="flex items-center justify-between p-4 border-b shrink-0">
                            <div>
                                <h3 className="font-bold text-lg">{previewTemplate.name}</h3>
                                <p className="text-xs text-muted-foreground">{previewTemplate.description}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewTemplate(null)} className="rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-black p-8">
                            <div className="max-w-5xl mx-auto shadow-2xl rounded-lg overflow-hidden border">
                                <SectionRenderer section={previewTemplate.data} />
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-between items-center bg-muted/20 shrink-0">
                            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                <span className="bg-muted px-2 py-1 rounded">ID: {previewTemplate.id}</span>
                                <span className="bg-muted px-2 py-1 rounded capitalize">Type: {previewTemplate.data.type}</span>
                            </div>
                            <Button onClick={() => setPreviewTemplate(null)}>Đóng bản xem trước</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
