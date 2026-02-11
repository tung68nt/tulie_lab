'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, AlertTriangle, FileJson } from 'lucide-react';
import { Button } from '@/components/Button';

interface CourseJsonEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { course: any, lessons: any[] }) => void;
    courseData: any;
    lessonsData: any[];
}

export function CourseJsonEditorModal({ isOpen, onClose, onSave, courseData, lessonsData }: CourseJsonEditorModalProps) {
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
            onClose();
        } catch (e: any) {
            setError(e.message || "Invalid JSON format");
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl h-[85vh] rounded-xl shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="text-zinc-900 dark:text-zinc-100">
                            <FileJson className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col -mt-0.5">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">Course JSON Editor</h2>
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
                <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="text-xs text-zinc-500 max-w-sm">
                        <span className="font-medium text-amber-600 dark:text-amber-500 flex items-center gap-1.5 mb-0.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Warning
                        </span>
                        Changes to structure and lessons will attempt to sync. New lessons (without IDs) will be created.
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => {
                                if (confirm("Bạn có chắc chắn muốn reset về cấu trúc JSON chuẩn? Toàn bộ nội dung hiện tại sẽ bị xóa.")) {
                                    setJsonValue(JSON.stringify(STANDARD_TEMPLATE, null, 2));
                                }
                            }}
                            className="text-zinc-500 hover:text-blue-600"
                        >
                            Reset to Standard JSON
                        </Button>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave} className="gap-2 min-w-[140px]">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

const STANDARD_TEMPLATE = {
    course: {
        title: "Course Title",
        slug: "course-slug",
        description: "",
        price: 0,
        isPublished: true,
        instructorId: "",
        categoryId: "",
        level: "ALL",
        thumbnail: "",
        introVideoUrl: "",
        learningOutcomes: "",
        deploymentStatus: "RELEASED",
        tag: "HOT",
        compareAtPrice: 0,
        addOnIds: [],
        structure: [
            {
                title: "Chương 1: ...",
                sections: ["Phần 1: ..."]
            }
        ]
    },
    lessons: [
        {
            title: "Bài 1: ...",
            slug: "bai-1",
            description: "",
            learningOutcomes: "",
            videoUrl: "",
            duration: "",
            content: "",
            guide: "",
            isFree: false,
            position: 1,
            chapter: "Chương 1: ...",
            section: "Phần 1: ...",
            thumbnail: ""
        }
    ]
};

// Helper to check if we are in browser environment for portal
const models = typeof document !== 'undefined';
