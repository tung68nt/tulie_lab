'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';

const FlipBook = HTMLFlipBook as any;
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Loader2, Maximize2, ZoomIn, ZoomOut, BookOpen, FileText, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { EbookProtector } from './EbookProtector';
import { EbookWatermark } from './EbookWatermark';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import { useTheme } from 'next-themes';
import Link from 'next/link';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface EbookViewerProps {
    pdfUrl: string;
    ebookId: string;
    title: string;
    userEmail: string;
    description?: string;
}

interface PageProps {
    pageNumber: number;
    children?: React.ReactNode;
}

// Ensure the page component can accept a ref from react-pageflip
const PageComponent = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
    return (
        <div className="bg-white border border-border/50 shadow-sm" ref={ref}>
            {props.children}
        </div>
    );
});
PageComponent.displayName = 'PageComponent';

export const EbookViewer: React.FC<EbookViewerProps> = ({
    pdfUrl,
    ebookId,
    title,
    userEmail
}) => {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'flipbook' | 'scroll'>('flipbook');
    const [scale, setScale] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const flipBookRef = useRef<any>(null);

    // Responsive dimensions for flipbook
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight - 80; // Minus toolbar

                // Adjust to standard ebook ratio
                const ratio = 1.414; // A4 ratio roughly

                let width = 450;
                let height = width * ratio;

                // Scale down if container is smaller
                if (containerWidth < 900) { // If it can't fit 2 pages (desktop layout)
                    if (viewMode === 'flipbook') {
                        // Switch to scroll mode on small screens to ensure readability
                        setViewMode('scroll');
                    }
                    width = Math.min(containerWidth - 40, 450);
                    height = width * ratio;
                } else {
                    // Maximum dimensions
                    height = Math.min(containerHeight - 40, 800);
                    width = height / ratio;
                }

                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, [viewMode]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
    const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleFlipEvent = (e: any) => {
        setPageNumber(e.data + 1);
    };

    // Component for Watermarked Page
    const WatermarkedPage = ({ width, index }: { width: number, index: number }) => {
        const height = width * 1.414;

        return (
            <div className="relative overflow-hidden w-full h-full flex items-center justify-center bg-white">
                <Document
                    file={pdfUrl}
                    loading={<div className="flex w-full h-full items-center justify-center bg-muted/20">...</div>}
                >
                    <Page
                        pageNumber={index}
                        width={width * 1.5} // Higher res for scaling
                        scale={scale / 1.5} // Compensate width increase
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="max-w-full max-h-full"
                    />
                </Document>
                <EbookWatermark
                    email={userEmail}
                    width={width * scale}
                    height={height * scale}
                    darkMode={false} // Pages are always white in PDF generally
                />
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col w-full h-screen bg-neutral-100 dark:bg-neutral-900 overflow-hidden font-sans"
        >
            <EbookProtector ebookId={ebookId} />

            {/* Hidden Document purely for loading overall status */}
            {pdfUrl && !error && (
                <div className="hidden">
                    <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={() => setError("Lỗi tải Ebook.")} />
                </div>
            )}

            {/* Top Toolbar */}
            <div className="h-16 shrink-0 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <Link href="/courses">
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                            <X className="w-4 h-4 mr-2" /> Đóng
                        </Button>
                    </Link>
                    <h1 className="font-bold text-lg md:text-xl text-foreground line-clamp-1">{title}</h1>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* View mode toggle */}
                    <div className="hidden md:flex items-center bg-muted rounded-md p-1 border border-border">
                        <Button
                            variant={viewMode === 'flipbook' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-8 rounded-sm font-medium"
                            onClick={() => setViewMode('flipbook')}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Lật sách
                        </Button>
                        <Button
                            variant={viewMode === 'scroll' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-8 rounded-sm font-medium"
                            onClick={() => setViewMode('scroll')}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Cuộn xuống
                        </Button>
                    </div>

                    <div className="flex items-center gap-1 border-l border-border pl-2 md:pl-4">
                        <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={scale <= 0.5} title="Thu nhỏ">
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-mono w-10 text-center">{Math.round(scale * 100)}%</span>
                        <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={scale >= 2.5} title="Phóng to">
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1" />
                        <Button variant="ghost" size="icon" onClick={toggleFullscreen} title="Toàn màn hình">
                            <Maximize2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto relative flex items-center justify-center p-4">
                {loading && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <span className="text-muted-foreground font-medium">Đang tải {title}...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-destructive/10 text-destructive p-4 border border-destructive/20 rounded-md max-w-md text-center">
                        <p className="font-bold">Không thể tải Ebook</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* FLIPBOOK MODE */}
                {!loading && !error && viewMode === 'flipbook' && dimensions.width > 0 && numPages && (
                    <div className="w-full h-full flex flex-col items-center justify-center pb-10">
                        <FlipBook
                            width={dimensions.width}
                            height={dimensions.height}
                            size="fixed"
                            minWidth={300}
                            maxWidth={1000}
                            minHeight={400}
                            maxHeight={1400}
                            maxShadowOpacity={0.5}
                            showCover={true}
                            mobileScrollSupport={true}
                            onFlip={handleFlipEvent}
                            className="flip-book-container mx-auto drop-shadow-2xl"
                            ref={flipBookRef}
                            style={{ margin: "0 auto" }}
                            startPage={0}
                            drawShadow={true}
                            flippingTime={1000}
                            usePortrait={false} // Force double pages
                            startZIndex={0}
                            autoSize={true}
                            clickEventForward={true}
                            useMouseEvents={true}
                            swipeDistance={30}
                            showPageCorners={true}
                            disableFlipByClick={false}
                        >
                            {Array.from(new Array(numPages), (_el, index) => (
                                <PageComponent key={`page_${index + 1}`} pageNumber={index + 1}>
                                    <WatermarkedPage width={dimensions.width} index={index + 1} />
                                </PageComponent>
                            ))}
                        </FlipBook>
                    </div>
                )}

                {/* SCROLL MODE */}
                {!loading && !error && viewMode === 'scroll' && numPages && (
                    <div className="w-full h-full overflow-y-auto pb-20 flex flex-col items-center gap-6">
                        {Array.from(new Array(numPages), (_el, index) => (
                            <div key={`page_${index + 1}`} className="shadow-lg border border-border bg-white" id={`page-${index + 1}`}>
                                <WatermarkedPage width={dimensions.width * 1.5} index={index + 1} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation for Flipbook */}
            {!loading && !error && viewMode === 'flipbook' && numPages && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-lg z-20">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-8 h-8"
                        onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
                        disabled={pageNumber <= 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium w-max px-2">
                        {pageNumber} / {numPages}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-8 h-8"
                        onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
                        disabled={pageNumber >= numPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};
