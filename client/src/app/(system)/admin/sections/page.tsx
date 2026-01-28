'use client';

import { useState } from 'react';
import { SECTION_TEMPLATES } from '@/lib/section-templates';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Search, Grid, List as ListIcon, Layout, Copy, Eye } from 'lucide-react';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';

export default function SectionGalleryPage() {
    const { addToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredTemplates = SECTION_TEMPLATES.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.data.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = Array.from(new Set(SECTION_TEMPLATES.map(t => t.data.type))) as string[];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast('Đã sao chép ID vào bộ nhớ tạm', 'success');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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

            <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setSearchQuery('')}>Tất cả ({SECTION_TEMPLATES.length})</Badge>
                {categories.map(cat => (
                    <Badge
                        key={cat}
                        variant="secondary"
                        className="capitalize cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setSearchQuery(cat)}
                    >
                        {cat}
                    </Badge>
                ))}
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <Card key={template.id} className="overflow-hidden group flex flex-col h-full bg-background border-border hover:border-primary/50 transition-all duration-300">
                            <div className="aspect-video bg-muted flex items-center justify-center relative group-hover:bg-muted/50 transition-colors">
                                <Layout className="h-12 w-12 text-muted-foreground/30" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-[2px]">
                                    <Badge variant="outline" className="bg-background/80 shadow-sm border-primary/20">
                                        {template.data.type.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1 gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{template.name}</h3>
                                    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded w-fit">
                                        ID: {template.id}
                                        <button onClick={() => copyToClipboard(template.id)} className="hover:text-primary transition-colors">
                                            <Copy className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-auto flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Xem Chi Tiết
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="border rounded-lg divide-y bg-background overflow-hidden">
                    {filteredTemplates.map((template) => (
                        <div key={template.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-muted rounded flex items-center justify-center shrink-0">
                                    <Layout className="h-5 w-5 text-muted-foreground/50" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{template.name}</h3>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-xs text-muted-foreground font-mono">ID: {template.id}</span>
                                        <Badge variant="secondary" className="text-[10px] h-4 py-0 leading-none px-1.5 uppercase tracking-wider">{template.data.type}</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Copy ID" onClick={() => copyToClipboard(template.id)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 px-3 text-xs flex items-center gap-1.5 font-medium">
                                    <Eye className="h-3.5 w-3.5" />
                                    Xem mẫu
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredTemplates.length === 0 && (
                <div className="text-center py-20 border rounded-xl bg-muted/10 border-dashed">
                    <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Không tìm thấy section nào</h3>
                    <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác.</p>
                </div>
            )}
        </div>
    );
}
