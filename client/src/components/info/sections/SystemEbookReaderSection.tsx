'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Section } from '@/types/sections';
import { SectionBackground } from '../SectionBackground';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { api } from '@/lib/api';
import { Loader2, Lock, BookOpen, AlertCircle } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageProps {
    pageNumber: number;
    children?: React.ReactNode;
}

const PageComponent = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
    return (
        <div className="bg-white shadow-inner" ref={ref}>
            {props.children}
        </div>
    );
});
PageComponent.displayName = 'PageComponent';

export const SystemEbookReaderSection = ({ section }: { section: Section }) => {
    const ebookSlug = section.ebookSlug || section.data?.ebookSlug;

    const [ebook, setEbook] = useState<any>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchEbookAndAccess = async () => {
            if (!ebookSlug) {
                setError("Ebook không được cấu hình");
                setLoading(false);
                return;
            }

            try {
                // 1. Get Ebook info
                const ebookRes = await api.ebooks.getBySlug(ebookSlug);
                if (!ebookRes.data) throw new Error("Không tìm thấy ebook");
                const ebookData = ebookRes.data;
                setEbook(ebookData);

                // 2. Check access
                try {
                    const accessRes = await api.ebooks.checkAccess(ebookData.id);
                    if (accessRes.hasAccess && accessRes.presignedUrl) {
                        setHasAccess(true);
                        setPdfUrl(accessRes.presignedUrl);
                    } else {
                        // Use public cover/preview if provided in section or logic
                        // For now we just use a placeholder or the preview URL if we define one
                        setHasAccess(false);
                        // In a real app, maybe we'd have a public preview PDF URL
                    }
                } catch (e) {
                    // Probably not logged in or no access
                    setHasAccess(false);
                }
            } catch (err: any) {
                console.error("Reader load error:", err);
                setError(err.message || "Lỗi tải ebook");
            } finally {
                setLoading(false);
            }
        };

        fetchEbookAndAccess();
    }, [ebookSlug]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        // If no access, limit to preview pages
        const limit = hasAccess ? numPages : (ebook?.previewPages || 5);
        setNumPages(Math.min(numPages, limit));
    };

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Đang mở sách...</p>
            </div>
        );
    }

    const MAX_WIDTH = 450;
    const MAX_HEIGHT = 630;

    return (
        <section className={cn("py-12 md:py-24 relative overflow-hidden select-none", section.className)}>
            <SectionBackground
                backgroundTheme={section.backgroundTheme || 'light'}
                showDotPattern={section.showDotPattern}
                backgroundPattern={section.backgroundPattern}
            />

            <div className="container relative z-10 mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    {section.tag && <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">{section.tag}</span>}
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{section.title || ebook?.title}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">{section.subtitle || ebook?.description}</p>
                </div>

                <div className={cn(
                    "max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border flex flex-col md:flex-row min-h-[600px]",
                    section.backgroundTheme === 'dark' ? "bg-zinc-900/80 border-white/10" : "bg-white/80 border-black/5"
                )}>
                    {/* Reader Side */}
                    <div className="flex-[3] relative bg-black/5 flex items-center justify-center p-4 min-h-[500px]">
                        {!pdfUrl && !hasAccess ? (
                            <div className="flex flex-col items-center text-center p-8">
                                <Lock className="w-16 h-16 text-muted-foreground/30 mb-6" />
                                <h3 className="text-xl font-bold mb-2">Bạn chưa có quyền đọc toàn bộ ebook này</h3>
                                <p className="text-sm text-muted-foreground mb-6">Vui lòng mua hoặc đăng nhập để tiếp tục lật trang.</p>
                                {ebook?.price && (
                                    <button className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-transform">
                                        Mua ngay - {new Intl.NumberFormat('vi-VN').format(ebook.price)}đ
                                    </button>
                                )}
                            </div>
                        ) : error ? (
                            <div className="text-destructive flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        ) : (
                            <>
                                <Document
                                    file={pdfUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={<Loader2 className="w-8 h-8 animate-spin" />}
                                    className="hidden"
                                />
                                {numPages && (
                                    <div className="w-full flex justify-center">
                                        <HTMLFlipBook
                                            width={MAX_WIDTH}
                                            height={MAX_HEIGHT}
                                            size="stretch"
                                            minWidth={300}
                                            maxWidth={500}
                                            minHeight={400}
                                            maxHeight={700}
                                            maxShadowOpacity={0.5}
                                            showCover={true}
                                            mobileScrollSupport={true}
                                            className="ebook-reader-pageflip"
                                            style={{ backgroundColor: 'transparent', margin: '0 auto' }}
                                            startPage={0}
                                            drawShadow={true}
                                            flippingTime={1000}
                                            usePortrait={false}
                                            startZIndex={0}
                                            autoSize={true}
                                            clickEventForward={true}
                                            useMouseEvents={true}
                                            swipeDistance={3}
                                            showPageCorners={true}
                                            disableFlipByClick={false}
                                        >
                                            {[...Array(numPages)].map((_, i) => (
                                                <PageComponent key={i} pageNumber={i + 1}>
                                                    <Page
                                                        pageNumber={i + 1}
                                                        width={MAX_WIDTH}
                                                        renderAnnotationLayer={false}
                                                        renderTextLayer={false}
                                                    />
                                                </PageComponent>
                                            ))}
                                        </HTMLFlipBook>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Info Side (hidden on small) */}
                    <div className="flex-1 p-8 border-l border-border/50 bg-muted/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4 uppercase tracking-tighter">
                                <BookOpen className="w-4 h-4" />
                                <span>Reader Mode</span>
                            </div>
                            <h4 className="text-lg font-bold mb-4 line-clamp-2">{ebook?.title}</h4>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tác giả:</span>
                                    <span className="font-medium text-right">Tulie Academy</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tổng số trang:</span>
                                    <span className="font-medium">{ebook?.totalPages || '...'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Trạng thái:</span>
                                    <span className={cn("font-bold px-2 py-0.5 rounded-full text-[10px]", hasAccess ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>
                                        {hasAccess ? "FULL ACCESS" : "PREVIEW MODE"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-border/50">
                            {hasAccess ? (
                                <button className="w-full py-4 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                                    <span>Tải về PDF</span>
                                </button>
                            ) : (
                                <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all">
                                    <span>Mở khóa toàn bộ</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .ebook-reader-pageflip {
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    border-radius: 4px;
                }
            `}</style>
        </section>
    );
};
