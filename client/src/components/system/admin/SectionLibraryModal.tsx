'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SECTION_TEMPLATES, SectionTemplate } from '@/lib/section-templates';
import { Button } from '@/components/Button';
import { Plus, X, Layout, Users, Zap, Star, Monitor, Settings } from 'lucide-react';
import { DynamicIcon } from '@/components/DynamicIcon';
import { SectionRenderer } from '@/components/SectionRenderer';

interface SectionLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: SectionTemplate) => void;
}

export function SectionLibraryModal({ isOpen, onClose, onSelect }: SectionLibraryModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!isOpen || !mounted) return null;

    const categories = ['All', ...Array.from(new Set(SECTION_TEMPLATES.map(t => t.category)))];
    const filteredTemplates = selectedCategory === 'All'
        ? SECTION_TEMPLATES
        : SECTION_TEMPLATES.filter(t => t.category === selectedCategory);

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'Hero': return <Layout className="w-4 h-4" />;
            case 'Content': return <Monitor className="w-4 h-4" />;
            case 'Social Proof': return <Users className="w-4 h-4" />;
            case 'Conversion': return <Zap className="w-4 h-4" />;
            case 'Special': return <Star className="w-4 h-4" />;
            case 'System': return <Settings className="w-4 h-4" />;
            default: return <Layout className="w-4 h-4" />;
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 rounded-none md:rounded-xl shadow-2xl w-full h-full md:w-[95vw] md:max-w-7xl md:h-[90vh] flex flex-col overflow-hidden border-0 md:border border-neutral-200 dark:border-neutral-800">

                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold">Thư viện Section</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Chọn mẫu có sẵn để thêm vào Landing Page của bạn</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Sidebar & Grid */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Categories */}
                    <div className="w-40 md:w-52 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto p-4 flex flex-col gap-2 bg-neutral-50 dark:bg-neutral-900/50">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${selectedCategory === cat
                                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md font-medium'
                                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                    }`}
                            >
                                {cat !== 'All' && getCategoryIcon(cat)}
                                <span>{cat === 'All' ? 'Tất cả' : cat}</span>
                            </button>
                        ))}
                    </div>

                    {/* Template Grid */}
                    <div className="flex-1 overflow-y-auto p-6 bg-neutral-100 dark:bg-neutral-950">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                            {filteredTemplates.map(template => (
                                <div key={template.id} className="group bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 flex flex-col h-full">
                                    {/* Preview Area (Placeholder for now) */}
                                    {/* Preview Area */}
                                    <div className="h-48 bg-neutral-100 dark:bg-neutral-800 relative group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800/80 transition-colors overflow-hidden">

                                        {/* Scaled Preview - Fits 100% width of the card */}
                                        <div className="absolute top-0 left-0 w-[500%] origin-top-left transform scale-[0.2] pointer-events-none select-none bg-white dark:bg-black">
                                            <SectionRenderer section={template.data} />
                                        </div>

                                        {/* Tag Overlay */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-md shadow-sm leading-none">
                                                {getCategoryIcon(template.category)}
                                                <span className="text-neutral-600 dark:text-neutral-300">{template.category}</span>
                                            </span>
                                        </div>

                                        {/* Overlay Button */}
                                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-lg">{template.name}</h3>
                                        </div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2">
                                            {template.description}
                                        </p>
                                        <div className="mt-auto">
                                            <Button
                                                onClick={() => onSelect(template)}
                                                className="w-full bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Thêm vào trang
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
