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
            {/* Header / Breadcrumbs */}
            <div className="border-b bg-muted/30">
                <div className="container py-8 md:py-12">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground font-medium">Tài liệu</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
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
            <div className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / TOC - Moved to Left */}
                    <div className="lg:col-span-3">
                        <aside className="sticky top-24 space-y-6">
                            {/* Mobile TOC Toggle */}
                            {content && (
                                <div className="lg:hidden mb-6">
                                    <button
                                        onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50 text-sm font-bold uppercase tracking-widest"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Menu className="w-4 h-4" />
                                            Mục lục tài liệu
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${isMobileTocOpen ? 'rotate-90' : ''}`} />
                                    </button>

                                    {isMobileTocOpen && (
                                        <div className="mt-2 p-6 rounded-2xl bg-card border border-border shadow-lg animate-in slide-in-from-top-2">
                                            <TableOfContents
                                                content={content}
                                                onItemClick={() => setIsMobileTocOpen(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {content && (
                                <div className="hidden lg:block p-6 rounded-3xl bg-muted/30 border border-border/50 backdrop-blur-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70 mb-4">
                                        Mục lục
                                    </h3>
                                    <TableOfContents content={content} />
                                </div>
                            )}

                            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Hỗ trợ nhanh</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    Nếu bạn gặp khó khăn trong quá trình sử dụng, đừng ngần ngại liên hệ với đội ngũ hỗ trợ.
                                </p>
                                <Link href="/contact">
                                    <span className="text-primary font-semibold hover:underline flex items-center gap-2">
                                        Liên hệ hỗ trợ <ChevronRight className="w-4 h-4" />
                                    </span>
                                </Link>
                            </div>
                        </aside>
                    </div>

                    {/* Documentation Content - Moved to Right */}
                    <div className="lg:col-span-9">
                        <div className="prose-premium bg-card rounded-3xl border border-border/50 p-6 md:p-10 shadow-sm min-h-[500px]">
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
