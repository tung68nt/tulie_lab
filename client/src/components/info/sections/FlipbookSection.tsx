'use client';

import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { Section } from '@/types/sections';
import { StandardSectionHeader } from '../StandardSectionHeader';
import { SectionBackground } from '../SectionBackground';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';

const FlipBook = HTMLFlipBook as any;
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ExternalLink, Lock, Loader2, Maximize2, ZoomIn, ZoomOut, Save } from 'lucide-react';
import Link from 'next/link';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageProps {
    pageNumber: number;
    children?: React.ReactNode;
}

// Ensure the page component can accept a ref from react-pageflip
const PageComponent = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
    return (
        <div className="bg-white" ref={ref}>
            {props.children}
        </div>
    );
});
PageComponent.displayName = 'PageComponent';

export const FlipbookSection: React.FC<{ section: Section }> = ({ section }) => {
    const isDarkBg = !section.backgroundTheme || section.backgroundTheme === 'dark';

    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageRatio, setPageRatio] = useState<number>(1.414); // Default to A4
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const flipBookRef = useRef<any>(null);

    const animationVariants = {
        none: {},
        'fade-up': { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 } },
        'fade-in': { initial: { opacity: 0 }, whileInView: { opacity: 1 } },
        'fade-left': { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 } },
        'fade-right': { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 } },
        'slide-up': { initial: { y: 50 }, whileInView: { y: 0 } }
    };

    const selectedAnimation = animationVariants[section.animation || 'fade-up'];

    const onDocumentLoadSuccess = (pdf: any) => {
        const { numPages } = pdf;
        // Limit to preview pages
        const limit = section.previewPages || 5;
        setNumPages(Math.min(numPages, limit));

        // Dynamic ratio detection from the first page
        pdf.getPage(1).then((page: any) => {
            const viewport = page.getViewport({ scale: 1 });
            const ratio = viewport.height / viewport.width;
            setPageRatio(ratio);
            setLoading(false);
        });
    };

    const onDocumentLoadError = (error: Error) => {
        console.error("PDF load error:", error);
        setError("Không thể tải tài liệu. Vui lòng thử lại sau.");
        setLoading(false);
    };

    const handlePageChange = (e: any) => {
        setPageNumber(e.data);
    };

    // Client-side anti-download protection (layer 2)
    useEffect(() => {
        const handleContextMenu = (e: globalThis.MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Block Ctrl+S, Ctrl+P
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
                e.preventDefault();
            }
        };

        // Attach to window during preview
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <section className={cn("py-10 md:py-16 relative overflow-hidden select-none", section.className)}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
                showDotPattern={section.showDotPattern}
                backgroundPattern={section.backgroundPattern}
            />

            <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-6">
                <StandardSectionHeader section={section} />

                <motion.div
                    {...selectedAnimation}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn(
                        "relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border", // Using rounded-2xl for soft corners
                        isDarkBg ? "bg-black/40 border-white/10" : "bg-white/60 border-black/5"
                    )}
                >
                    <div className="flex flex-col md:flex-row min-h-[600px]">
                        {/* Interactive Flipbook Container */}
                        <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 bg-black/5 backdrop-blur-sm min-h-[400px]">
                            {loading && !error && (
                                <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="text-sm font-medium">Đang tải bản xem thử...</span>
                                </div>
                            )}

                            {error && (
                                <div className="text-destructive/80 font-medium text-sm flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {!error && section.pdfUrl && (
                                <Document
                                    file={section.pdfUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                    className="hidden"
                                >
                                    {/* Invisible document just to load the pages and get numPages */}
                                </Document>
                            )}

                            {!loading && !error && numPages && numPages > 0 && (
                                <div className="animate-in fade-in zoom-in-95 duration-500 w-full h-full flex flex-col items-center justify-center">
                                    <div className="relative shadow-2xl rounded overflow-hidden bg-white/5 backdrop-blur-sm">
                                        <Document
                                            file={section.pdfUrl}
                                            loading={<Loader2 className="w-8 h-8 animate-spin text-primary" />}
                                        >
                                            <FlipBook
                                                width={600}
                                                height={Math.round(600 * pageRatio)}
                                                size="stretch"
                                                minWidth={300}
                                                maxWidth={1200}
                                                minHeight={300}
                                                maxHeight={1400}
                                                maxShadowOpacity={0.5}
                                                showCover={true}
                                                mobileScrollSupport={true}
                                                onFlip={handlePageChange}
                                                className="flip-book-container"
                                                ref={flipBookRef}
                                                style={{ margin: "0 auto" }}
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
                                                {Array.from(new Array(numPages), (_el, index) => (
                                                    <PageComponent key={`page_${index + 1}`} pageNumber={index + 1}>
                                                        <div className="w-full h-full relative group flex items-center justify-center bg-white overflow-hidden border border-black/5">
                                                            <Page
                                                                pageNumber={index + 1}
                                                                width={600} // Target width for the flipbook size
                                                                renderTextLayer={false}
                                                                renderAnnotationLayer={false}
                                                                className="max-w-full max-h-full transition-opacity duration-300"
                                                                loading={<div className="bg-muted animate-pulse w-[300px] h-[400px]" />}
                                                            />

                                                            {/* Watermark overlay - Diagonal text */}
                                                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-20">
                                                                <div className="transform -rotate-45 text-black/[0.03] text-xl md:text-2xl font-bold whitespace-nowrap">
                                                                    BẢN XEM THỬ • BẢN XEM THỬ
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </PageComponent>
                                                ))}
                                            </FlipBook>
                                        </Document>
                                    </div>

                                    <div className="mt-8 flex items-center gap-4 text-xs font-medium text-muted-foreground bg-background/50 px-4 py-2 rounded-full backdrop-blur-md border border-border">
                                        <button
                                            onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
                                            disabled={pageNumber === 0}
                                            className="hover:text-foreground disabled:opacity-50 transition-colors"
                                        >
                                            Trang trước
                                        </button>
                                        <span className="w-20 text-center">
                                            {typeof pageNumber === 'number' ? pageNumber + 1 : 1} / {numPages}
                                        </span>
                                        <button
                                            onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
                                            disabled={pageNumber >= numPages - 1}
                                            className="hover:text-foreground disabled:opacity-50 transition-colors"
                                        >
                                            Trang sau
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Fallback pattern / cover if no PDF provided */}
                            {!section.pdfUrl && (
                                <div className="w-[300px] h-[420px] bg-muted/50 rounded-lg border border-border flex flex-col items-center justify-center gap-4 shadow-lg">
                                    <BookPlaceholderIcon className="w-16 h-16 text-muted-foreground/30" />
                                    <span className="text-sm font-medium text-muted-foreground/50 truncate max-w-[80%]">
                                        Ebook Preview
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Info & Call to Action side */}
                        <div className="md:w-[400px] border-l border-border bg-card p-6 md:p-10 flex flex-col justify-center">
                            <Lock className="w-6 h-6 text-primary mb-4" />
                            <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground leading-snug">
                                Xem trọn bộ tài liệu
                            </h3>
                            <p className="text-muted-foreground mb-8 text-[15px] leading-relaxed">
                                Bạn đang xem {section.previewPages || 5} trang đầu tiên của ebook. Để xem bản đầy đủ và lưu trữ vĩnh viễn, vui lòng đặt mua sản phẩm.
                            </p>

                            <div className="space-y-3 mt-auto">
                                <Link href={section.ctaLink || "#"} className="w-full">
                                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                                        <Save className="w-4 h-4" />
                                        <span>{section.ctaText || "Mua ebook ngay"}</span>
                                    </button>
                                </Link>

                                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5 opacity-80 mt-4">
                                    <Lock className="w-3 h-3" />
                                    Giao dịch an toàn và bảo mật
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const BookPlaceholderIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
);
