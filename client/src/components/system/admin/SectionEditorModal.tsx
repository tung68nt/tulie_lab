import { useState, useEffect } from 'react';
import { X, Save, RefreshCw, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from '@/components/Button';
import { SectionRenderer } from '@/components/SectionRenderer';
import { Section } from '@/types/sections';

interface SectionEditorModalProps {
    section: Section | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedSection: Section) => void;
}

export function SectionEditorModal({ section, isOpen, onClose, onSave }: SectionEditorModalProps) {
    const [editedSection, setEditedSection] = useState<Section | null>(null);
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Zoom State
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    // Viewport State
    const [viewportWidth, setViewportWidth] = useState<string>('100%');

    useEffect(() => {
        if (section) {
            setEditedSection(JSON.parse(JSON.stringify(section))); // Deep copy
            setJsonError(null);
            setViewportWidth('100%'); // Reset viewport on open
            setZoomLevel(1); // Reset zoom on open
        }
    }, [section, isOpen]);

    if (!isOpen || !editedSection) return null;

    const handleChange = (field: keyof Section, value: any) => {
        setEditedSection(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleItemsJsonChange = (json: string) => {
        try {
            const parsed = JSON.parse(json);
            handleChange('items', parsed);
            setJsonError(null);
        } catch (e) {
            setJsonError((e as Error).message);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Edit {editedSection.type} Section
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={() => onSave(editedSection)} disabled={!!jsonError} className="gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel: Form */}
                    <div className="w-1/3 min-w-[350px] border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto p-6 bg-neutral-50 dark:bg-neutral-900/50">
                        <div className="space-y-6">

                            {/* Standard Fields */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Content</h3>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Title</label>
                                    <input
                                        type="text"
                                        value={editedSection.title || ''}
                                        onChange={e => handleChange('title', e.target.value)}
                                        className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm"
                                        placeholder="Section Title"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Subtitle</label>
                                    <textarea
                                        value={editedSection.subtitle || ''}
                                        onChange={e => handleChange('subtitle', e.target.value)}
                                        rows={2}
                                        className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-sans"
                                        placeholder="Section Subtitle"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Content / Description</label>
                                    <textarea
                                        value={editedSection.content || ''}
                                        onChange={e => handleChange('content', e.target.value)}
                                        rows={4}
                                        className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-sans"
                                        placeholder="Main content text..."
                                    />
                                </div>
                            </div>

                            {/* Media & CTA */}
                            <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Media & Actions</h3>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Image URL</label>
                                    <input
                                        type="text"
                                        value={editedSection.image || ''}
                                        onChange={e => handleChange('image', e.target.value)}
                                        className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">CTA Text</label>
                                        <input
                                            type="text"
                                            value={editedSection.ctaText || ''}
                                            onChange={e => handleChange('ctaText', e.target.value)}
                                            className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm"
                                            placeholder="Button Label"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">CTA Link</label>
                                        <input
                                            type="text"
                                            value={editedSection.ctaLink || ''}
                                            onChange={e => handleChange('ctaLink', e.target.value)}
                                            className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm"
                                            placeholder="/path"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Items (JSON Editor) */}
                            {editedSection.items && (
                                <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Items (JSON Data)</label>
                                        {jsonError && <span className="text-xs text-red-500 font-medium">{jsonError}</span>}
                                    </div>
                                    <p className="text-xs text-neutral-500 mb-2">Edit complex items structure here. Ensure valid JSON.</p>
                                    <textarea
                                        defaultValue={JSON.stringify(editedSection.items, null, 2)}
                                        onChange={e => handleItemsJsonChange(e.target.value)}
                                        rows={10}
                                        className={`w-full p-2 rounded-md border bg-neutral-100 dark:bg-neutral-950 text-xs font-mono ${jsonError ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300 dark:border-neutral-700'}`}
                                        spellCheck={false}
                                    />
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Right Panel: Preview */}
                    <div className="flex-1 bg-neutral-100 dark:bg-black overflow-y-auto relative flex flex-col">
                        <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 whitespace-nowrap">Live Preview</span>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Zoom Controls */}
                                <div className="flex items-center gap-2 border-r border-neutral-300 dark:border-neutral-700 pr-4">
                                    <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">Zoom: {Math.round(zoomLevel * 100)}%</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="1.5"
                                            step="0.05"
                                            value={zoomLevel}
                                            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                                            className="w-24 h-1 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-neutral-100 h-1"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setZoomLevel(1)}
                                            className="h-6 text-xs px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                            title="Reset Zoom"
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </div>

                                {/* Viewport Controls */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-neutral-500 font-medium w-24 text-right">
                                        Width: {viewportWidth === '100%' ? 'Full' : viewportWidth}
                                    </span>
                                    <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-md p-0.5">
                                        <button
                                            onClick={() => setViewportWidth('375px')}
                                            className={`p-1.5 rounded-sm transition-colors ${viewportWidth === '375px' ? 'bg-white dark:bg-neutral-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                                            title="Mobile (375px)"
                                        >
                                            <Smartphone className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewportWidth('768px')}
                                            className={`p-1.5 rounded-sm transition-colors ${viewportWidth === '768px' ? 'bg-white dark:bg-neutral-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                                            title="Tablet (768px)"
                                        >
                                            <Tablet className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewportWidth('100%')}
                                            className={`p-1.5 rounded-sm transition-colors ${viewportWidth === '100%' ? 'bg-white dark:bg-neutral-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                                            title="Desktop (Full)"
                                        >
                                            <Monitor className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
                                    {/* Width Slider */}
                                    <div className="flex items-center gap-2 max-w-[200px]">
                                        <input
                                            type="range"
                                            min="320"
                                            max="1200"
                                            step="10"
                                            value={viewportWidth === '100%' ? 1200 : parseInt(viewportWidth)}
                                            onChange={(e) => setViewportWidth(`${e.target.value}px`)}
                                            className="w-32 h-1 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-neutral-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-neutral-200/50 dark:bg-neutral-900/50 p-8 flex justify-center items-start">
                            {/* Outer Frame - This stays fixed on screen (at viewportWidth) */}
                            <div
                                style={{
                                    width: viewportWidth,
                                    maxWidth: '100%',
                                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                className={`bg-white dark:bg-black shadow-xl mx-auto flex-shrink-0 overflow-hidden relative ${viewportWidth !== '100%' ? 'border border-neutral-300 dark:border-neutral-700' : 'w-full'}`}
                            >
                                {/* Inner Scored Content - This scales but its visual bounds match the parent because of 100%/zoom width */}
                                <div
                                    className="origin-top"
                                    style={{
                                        transform: `scale(${zoomLevel})`,
                                        width: `calc(100% / ${zoomLevel})`,
                                        height: 'auto',
                                        transition: 'transform 0.2s ease-out'
                                    }}
                                >
                                    <SectionRenderer section={editedSection} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
