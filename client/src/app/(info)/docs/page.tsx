'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TableOfContents } from '@/components/TableOfContents';
import { Loader2, BookOpen, ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';

export default function PublicDocsPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

    useEffect(() => {
        const loadDocs = async () => {
            try {
                const settings = await api.admin.settings.get();
                if (settings) {
                    setTitle(settings.SYSTEM_DOC_TITLE || 'Hướng dẫn sử dụng hệ thống');
                    setContent(settings.SYSTEM_DOC_CONTENT || '');
                }
            } catch (error) {
                console.error('Failed to load docs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDocs();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Đang tải tài liệu...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background">
                <div className="container py-8 md:py-12">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground font-medium">Tài liệu</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                {title}
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">
                                Hướng dẫn chi tiết cách sử dụng các tính năng trên hệ thống Tulie Academy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Sidebar / TOC */}
                    <div className="lg:col-span-3 lg:border-r border-border/60 lg:pr-8">
                        <aside className="sticky top-24 space-y-6">
                            {/* Mobile TOC Toggle */}
                            {content && (
                                <div className="lg:hidden mb-6">
                                    <button
                                        onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-background text-sm font-medium"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Menu className="w-4 h-4" />
                                            Mục lục tài liệu
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${isMobileTocOpen ? 'rotate-90' : ''}`} />
                                    </button>

                                    {isMobileTocOpen && (
                                        <div className="mt-2 p-4 rounded-lg bg-background border border-border shadow-md animate-in slide-in-from-top-2">
                                            <TableOfContents
                                                content={content}
                                                onItemClick={() => setIsMobileTocOpen(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {content && (
                                <div className="hidden lg:block">
                                    <TableOfContents content={content} />
                                </div>
                            )}
                        </aside>
                    </div>

                    {/* Documentation Content */}
                    <div className="lg:col-span-9">
                        <div className="prose-premium min-h-[500px]">
                            {content ? (
                                <MarkdownRenderer content={content} />
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground italic">Nội dung đang được cập nhật...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
