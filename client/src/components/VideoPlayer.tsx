'use client';
import { Loader2 } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

import { api } from '@/lib/api';

type VideoType = 'YOUTUBE' | 'VIMEO' | 'CLOUDFLARE_STREAM' | 'SELF_HOSTED' | 'EXTERNAL';

interface VideoPlayerProps {
    url: string;
    type?: VideoType;
    title?: string;
    thumbnail?: string;
    className?: string;
}

/**
 * Multi-source Video Player
 * Supports: YouTube, Vimeo, Cloudflare Stream (HLS), Self-hosted
 * Wrapped in a premium macOS-style window frame.
 */
export function VideoPlayer({ url, type, title, thumbnail, className = '' }: VideoPlayerProps) {
    const [error, setError] = useState(false);
    const { user } = useAuth();

    // Auto-detect type if not provided
    const videoType = type || detectVideoType(url);
    const [resolvedUrl, setResolvedUrl] = useState(url);
    const [isResolving, setIsResolving] = useState(false);

    // Fetch Signed URL for R2/Self-hosted content
    useEffect(() => {
        const fetchSignedUrl = async () => {
            // Only sign if it looks like an R2/Upload URL and not already signed (check for signature param)
            const needsSigning = (videoType === 'CLOUDFLARE_STREAM' || videoType === 'SELF_HOSTED') &&
                (url.includes('/uploads/') || url.includes('r2.dev')) &&
                !url.includes('X-Amz-Signature');

            if (needsSigning && user) {
                try {
                    setIsResolving(true);
                    // Extract key from URL
                    let key = url;
                    if (url.includes('/uploads/')) {
                        key = url.split('/uploads/')[1];
                        if (!key.startsWith('uploads/')) key = 'uploads/' + key;
                    } else if (url.includes('r2.dev')) {
                        const parts = url.split('.r2.dev/');
                        if (parts.length > 1) key = parts[1];
                    }

                    const res = await api.media.getSignedUrl(key) as any;
                    if (res.success && res.url) {
                        setResolvedUrl(res.url);
                    }
                } catch (e) {
                    console.error('Failed to sign video URL', e);
                } finally {
                    setIsResolving(false);
                }
            } else {
                setResolvedUrl(url);
            }
        };

        fetchSignedUrl();
    }, [url, videoType, user]);

    const renderContent = () => {
        if (error) {
            return (
                <div className="flex items-center justify-center bg-zinc-900 text-zinc-400 absolute inset-0">
                    <div className="text-center p-8">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p>Không thể tải video</p>
                    </div>
                </div>
            );
        }

        if (videoType === 'YOUTUBE') {
            const embedUrl = getYouTubeEmbedUrl(url);
            return (
                <div className="relative w-full h-full">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        title={title || 'Video'}
                        onError={() => setError(true)}
                    />
                    <Watermark user={user} />
                </div>
            );
        }

        if (videoType === 'VIMEO') {
            const embedUrl = getVimeoEmbedUrl(url);
            return (
                <div className="relative w-full h-full">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="fullscreen; picture-in-picture"
                        title={title || 'Video'}
                        onError={() => setError(true)}
                    />
                    <Watermark user={user} />
                </div>
            );
        }

        if (videoType === 'CLOUDFLARE_STREAM' || url.includes('.m3u8')) {
            return (
                <div className="relative w-full h-full">
                    {isResolving ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg">
                            <Loader2 className="animate-spin w-8 h-8 text-primary " />
                        </div>
                    ) : (
                        <HLSPlayer src={resolvedUrl} title={title} thumbnail={thumbnail} onError={() => setError(true)} />
                    )}
                    <Watermark user={user} />
                </div>
            );
        }

        // Direct video (self-hosted or external)
        return (
            <div className="relative w-full h-full group/video">
                <FullscreenVideoWrapper className="w-full h-full" user={user}>
                    {(containerRef, isFullscreen, toggleFullscreen) => (
                        <>
                            <video
                                src={resolvedUrl}
                                className="w-full h-full object-contain bg-black"
                                controls
                                controlsList="nodownload nofullscreen"
                                onContextMenu={(e) => e.preventDefault()}
                                onError={() => setError(true)}
                                title={title}
                                poster={thumbnail}
                            >
                                Your browser does not support video playback.
                            </video>
                            <FullscreenButton isFullscreen={isFullscreen} onClick={toggleFullscreen} />
                        </>
                    )}
                </FullscreenVideoWrapper>
            </div>
        );
    };

    return (
        <div className={`overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300 ${className}`}>
            {/* macOS Title Bar - Synced with VideoSection style */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500 transition-transform hover:scale-110"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 transition-transform hover:scale-110"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 transition-transform hover:scale-110"></div>
                </div>
                {title && (
                    <div className="ml-2 md:ml-4 flex flex-1 items-center gap-2 rounded-md bg-background/80 px-2 md:px-3 py-1 md:py-1.5 min-w-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock h-3 w-3 md:h-3.5 md:w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <span className="text-[10px] md:text-xs text-muted-foreground font-medium truncate pr-1">
                            {title}
                        </span>
                    </div>
                )}
                <div className="w-12 h-4 bg-white/10 dark:bg-black/10 rounded-md md:rounded-lg backdrop-blur-sm px-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-zinc-400 animate-pulse" />
                </div>
            </div>

            {/* Video Content Area */}
            <div className="relative aspect-video w-full bg-black">
                {renderContent()}
            </div>
        </div>
    );
}

/**
 * Watermark component for embedded players
 */
function Watermark({ user }: { user: any }) {
    if (!user) return null;
    return (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none opacity-20 flex flex-col justify-between p-4">
            <div className="flex justify-between">
                <div className="text-white text-[10px] md:text-sm font-bold rotate-[-15deg]">{user.email}</div>
                <div className="text-white text-[10px] md:text-sm font-bold rotate-[15deg]">{user.id.slice(0, 8)}</div>
            </div>
            <div className="self-center">
                <div className="text-white text-[10px] md:text-sm font-bold opacity-10">{user.email} - {user.id}</div>
            </div>
            <div className="flex justify-between">
                <div className="text-white text-[10px] md:text-sm font-bold rotate-[15deg]">{user.id.slice(0, 8)}</div>
                <div className="text-white text-[10px] md:text-sm font-bold rotate-[-15deg]">{user.email}</div>
            </div>
        </div>
    );
}

/**
 * Fullscreen Video Wrapper - adds custom fullscreen with watermark support
 */
function FullscreenVideoWrapper({
    children,
    className = '',
    user
}: {
    children: (containerRef: React.RefObject<HTMLDivElement | null>, isFullscreen: boolean, toggleFullscreen: () => void) => React.ReactNode;
    className?: string;
    user: any;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err: any) => {
                console.error('Error entering fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const WrapperWatermark = () => {
        let displayUser = user;
        if (!displayUser) {
            try {
                const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                if (storedUser) {
                    displayUser = JSON.parse(storedUser);
                }
            } catch (e) { }
        }

        if (!displayUser || (!displayUser.email && !displayUser.id)) return null;

        const watermarkText = `${displayUser.email || 'user'} - ${displayUser.id || ''}`;
        return (
            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden select-none">
                <div className={`animate-float opacity-30 text-white font-bold absolute top-4 left-4 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {watermarkText}
                </div>
                <div className={`animate-float-delayed opacity-25 text-white font-bold absolute top-4 right-4 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {displayUser.email}
                </div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15 text-white font-semibold ${isFullscreen ? 'text-xl' : 'text-sm'}`}>
                    {watermarkText}
                </div>
                {isFullscreen && (
                    <>
                        <div className="opacity-20 text-white text-base font-bold absolute top-1/4 left-1/4 whitespace-nowrap">
                            {displayUser.email}
                        </div>
                        <div className="opacity-20 text-white text-base font-bold absolute top-3/4 right-1/4 whitespace-nowrap">
                            {displayUser.id}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div ref={containerRef} className={`relative bg-black ${className} ${isFullscreen ? 'w-screen h-screen flex items-center justify-center' : ''}`}>
            {children(containerRef, isFullscreen, toggleFullscreen)}
            <WrapperWatermark />
        </div>
    );
}

/**
 * Custom Fullscreen Button
 */
function FullscreenButton({ isFullscreen, onClick }: { isFullscreen: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="absolute top-4 right-4 z-20 p-2 bg-black/70 hover:bg-black/90 rounded transition-colors"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        >
            {isFullscreen ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
            )}
        </button>
    );
}

/**
 * HLS Player using hls.js
 */
function HLSPlayer({
    src,
    title,
    thumbnail,
    className,
    onError
}: {
    src: string;
    title?: string;
    thumbnail?: string;
    className?: string;
    onError?: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { user } = useAuth();

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch((err: any) => {
                console.error('Error entering fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: any = null;

        const initPlayer = async () => {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.addEventListener('loadedmetadata', () => setIsLoading(false));
                return;
            }

            try {
                const Hls = (await import('hls.js')).default;

                if (Hls.isSupported()) {
                    hls = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                    });

                    hls.loadSource(src);
                    hls.attachMedia(video);

                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        setIsLoading(false);
                    });

                    hls.on(Hls.Events.ERROR, (event: any, data: any) => {
                        if (data.fatal) {
                            console.error('HLS fatal error:', data);
                            onError?.();
                        }
                    });
                } else {
                    onError?.();
                }
            } catch (err) {
                video.src = src;
            }
        };

        initPlayer();

        return () => {
            if (hls) hls.destroy();
        };
    }, [src, onError]);

    return (
        <div ref={containerRef} className={`relative bg-black w-full h-full ${isFullscreen ? 'w-screen h-screen flex items-center justify-center' : ''}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-30">
                    <Loader2 className="animate-spin w-8 h-8 text-white " />
                </div>
            )}
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                controlsList="nodownload nofullscreen"
                onContextMenu={(e) => e.preventDefault()}
                title={title}
                poster={thumbnail}
            />
            <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-20 p-2 bg-black/70 hover:bg-black/90 rounded transition-colors"
                title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            >
                {isFullscreen ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                )}
            </button>
        </div>
    );
}

/**
 * Detect video type from URL
 */
function detectVideoType(url: string): VideoType {
    if (!url) return 'EXTERNAL';

    if (url.includes('youtube.com/watch') ||
        url.includes('youtube.com/embed') ||
        url.includes('youtu.be') ||
        url.includes('youtube.com/shorts') ||
        url.includes('youtube.com/v/')) {
        return 'YOUTUBE';
    }
    if (url.includes('vimeo.com') || url.includes('player.vimeo.com')) {
        return 'VIMEO';
    }
    if (url.includes('cloudflarestream.com') || url.includes('videodelivery.net') || url.includes('.m3u8')) {
        return 'CLOUDFLARE_STREAM';
    }
    if (url.startsWith('/uploads/') || url.includes('localhost')) {
        return 'SELF_HOSTED';
    }
    return 'EXTERNAL';
}

/**
 * Convert YouTube URL to embed URL
 */
function getYouTubeEmbedUrl(url: string): string {
    let videoId = '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.searchParams.get('v')) {
                videoId = urlObj.searchParams.get('v') || '';
            } else if (urlObj.pathname.startsWith('/embed/')) {
                videoId = urlObj.pathname.split('/embed/')[1];
            } else if (urlObj.pathname.startsWith('/shorts/')) {
                videoId = urlObj.pathname.split('/shorts/')[1];
            }
        } else if (urlObj.hostname.includes('youtu.be')) {
            videoId = urlObj.pathname.slice(1);
        }
    } catch (e) { }

    if (videoId) {
        videoId = videoId.split('?')[0].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
}

/**
 * Convert Vimeo URL to embed URL
 */
function getVimeoEmbedUrl(url: string): string {
    if (url.includes('player.vimeo.com')) return url;
    const match = url.match(/vimeo\.com\/(?:channels\/[\w]+\/)?(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
}

/**
 * Empty state when no video
 */
export function VideoPlayerEmpty({ className = '' }: { className?: string }) {
    return (
        <div className={`overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-background shadow-2xl transition-all duration-300 ${className}`}>
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-100/80 dark:bg-zinc-900/80 border-b border-zinc-200/50 dark:border-zinc-800/50 h-10">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
            </div>
            <div className="aspect-video flex items-center justify-center bg-zinc-900 text-zinc-500">
                <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-zinc-400">Chưa có video cho bài học này</p>
                </div>
            </div>
        </div>
    );
}
