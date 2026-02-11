'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, AlertTriangle, FileJson, Copy } from 'lucide-react';
import { Button } from '@/components/Button';
import { useConfirm } from '@/components/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';

interface CourseJsonEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { course: any, lessons: any[] }) => void;
    courseData: any;
    lessonsData: any[];
    instructors?: any[];
    categories?: any[];
    allAddOns?: any[];
}

export function CourseJsonEditorModal({
    isOpen,
    onClose,
    onSave,
    courseData,
    lessonsData,
    instructors = [],
    categories = [],
    allAddOns = []
}: CourseJsonEditorModalProps) {
    const confirm = useConfirm();
    const { addToast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [jsonValue, setJsonValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            try {
                // Ensure lessons are sorted by position for easier reading/editing
                const sortedLessons = [...lessonsData].sort((a, b) => a.position - b.position);

                const data = {
                    course: courseData,
                    lessons: sortedLessons
                };
                setJsonValue(JSON.stringify(data, null, 2));
                setError(null);
            } catch (e) {
                console.error("Failed to stringify course data", e);
                setJsonValue("{}");
            }
        }
    }, [isOpen, courseData, lessonsData]);

    if (!mounted || !isOpen) return null;

    // Use createPortal to render modal at document body level
    if (typeof document === 'undefined') return null;

    const handleSave = () => {
        try {
            const parsed = JSON.parse(jsonValue);

            // Basic validation
            if (!parsed.course) throw new Error("Missing 'course' object in JSON");

            // Prepare data for save
            onSave(parsed);
            addToast("Cập nhật cấu trúc JSON thành công", "success");
            onClose();
        } catch (e: any) {
            const msg = e.message || "Invalid JSON format";
            setError(msg);
            addToast(msg, "error");
        }
    };

    const handleReset = async () => {
        const isConfirmed = await confirm({
            title: "Reset cấu trúc JSON",
            message: "Bạn có chắc chắn muốn reset về cấu trúc JSON chuẩn? Toàn bộ nội dung hiện tại sẽ bị xóa và không thể khôi phục.",
            variant: 'warning',
            confirmText: 'Reset ngay',
            cancelText: 'Hủy'
        });

        if (isConfirmed) {
            setJsonValue(JSON.stringify(generateStandardTemplate(instructors, categories, allAddOns), null, 2));
            addToast("Đã reset về cấu trúc JSON chuẩn", "info");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonValue);
        addToast("Đã sao chép JSON vào bộ nhớ tạm", "success");
    };

    return createPortal(
        <div className="fixed inset-0 z-[15000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex items-start gap-4">
                        <div className="text-zinc-900 dark:text-zinc-100 shrink-0 mt-1">
                            <FileJson className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">Course JSON Editor</h2>
                            <p className="text-xs text-zinc-500 leading-tight">Edit entire course structure and content via JSON.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <X className="w-4 h-4 text-zinc-500" />
                    </Button>
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-0 overflow-hidden flex flex-col relative bg-zinc-50 dark:bg-zinc-950">
                    {error && (
                        <div className="absolute top-4 left-4 right-4 z-10 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2 border border-red-100 dark:border-red-900/30 shadow-sm animate-in slide-in-from-top-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}
                    <textarea
                        value={jsonValue}
                        onChange={(e) => {
                            setJsonValue(e.target.value);
                            if (error) setError(null);
                        }}
                        className="flex-1 w-full h-full bg-zinc-50 dark:bg-zinc-950 p-6 font-mono text-xs leading-relaxed resize-none focus:outline-none text-zinc-800 dark:text-zinc-300 selection:bg-blue-100 dark:selection:bg-blue-900/30"
                        spellCheck={false}
                        placeholder="{ 'course': ... }"
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-xs text-zinc-500 max-w-[280px] shrink-0">
                        <span className="font-medium text-amber-600 dark:text-amber-500 flex items-center gap-1.5 mb-0.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Warning
                        </span>
                        Changes to structure and lessons will attempt to sync. New lessons (without IDs) will be created.
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center w-full sm:w-auto justify-end">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={handleReset}
                            className="text-zinc-500 hover:text-blue-600 text-xs whitespace-nowrap px-2"
                        >
                            Reset JSON
                        </Button>
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={handleCopy}
                            className="text-zinc-500 hover:text-blue-600 text-xs whitespace-nowrap px-2"
                        >
                            <Copy className="w-4 h-4 mr-2" /> Copy JSON
                        </Button>
                        <Button variant="outline" onClick={onClose} className="text-xs px-3">Cancel</Button>
                        <Button onClick={handleSave} className="gap-2 min-w-[120px] text-xs">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

const generateStandardTemplate = (instructors: any[], categories: any[], allAddOns: any[]) => {
    return {
        __TEMPLATE_GUIDE__: {
            instructions: "Use this JSON to update or create course content. Fields with specific options are listed below.",
            options: {
                level: ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"],
                deploymentStatus: ["RELEASED", "COMING_SOON", "UPDATING"],
                tag: ["NONE", "BEST_SELLER", "HOT", "NEW", "DISCOUNT"],
                categories: categories.map(c => ({ id: c.id, name: c.name })),
                instructors: instructors.map(i => ({ id: i.id, name: i.name })),
                availableAddOns: allAddOns.map(a => ({ id: a.id, name: a.name, price: a.priceAddon }))
            },
            notes: "Adding a lesson without an 'id' will create a new lesson. Existing 'id' or 'slug' will update existing lessons."
        },
        course: {
            title: "Course Title",
            slug: "course-slug",
            description: "Detailed course description...",
            price: 299000,
            compareAtPrice: 500000,
            isPublished: false,
            instructorId: instructors[0]?.id || "instructor-uuid",
            categoryId: categories[0]?.id || "category-uuid",
            level: "ALL",
            thumbnail: "https://example.com/thumb.jpg",
            introVideoUrl: "https://youtube.com/watch?v=...",
            learningOutcomes: "- Outcome 1\n- Outcome 2",
            deploymentStatus: "RELEASED",
            tag: "NEW",
            addOnIds: [],
            structure: [
                {
                    title: "Chương 1: Giới thiệu",
                    sections: ["Phần 1: Tổng quan"]
                }
            ]
        },
        lessons: [
            {
                title: "Bài 1: Chào mừng",
                slug: "bai-1-chao-mung",
                description: "Mô tả bài học",
                learningOutcomes: "Kết quả đạt được",
                videoUrl: "https://vimeo.com/...",
                duration: "10:00",
                content: "Nội dung bài học (Markdown/HTML supported)",
                guide: "Hướng dẫn thực hành",
                isFree: true,
                position: 1,
                chapter: "Chương 1: Giới thiệu",
                section: "Phần 1: Tổng quan",
                thumbnail: ""
            }
        ]
    };
};

// Helper to check if we are in browser environment for portal
const models = typeof document !== 'undefined';
