'use client';

import { useEffect, useRef, useState } from 'react';

type VideoType = 'YOUTUBE' | 'VIMEO' | 'CLOUDFLARE_STREAM' | 'SELF_HOSTED' | 'EXTERNAL';

interface VideoPlayerProps {
    url: string;
    type?: VideoType;
    title?: string;
    className?: string;
}

/**
 * Multi-source Video Player
 * Supports: YouTube, Vimeo, Cloudflare Stream (HLS), Self-hosted
 */
import { useAuth } from '@/contexts/AuthContext';

/**
 * Multi-source Video Player
 * Supports: YouTube, Vimeo, Cloudflare Stream (HLS), Self-hosted
 */
export function VideoPlayer({ url, type, title, className = '' }: VideoPlayerProps) {
    const [error, setError] = useState(false);
    const { user } = useAuth();

    // Auto-detect type if not provided
    const videoType = type || detectVideoType(url);
    const PROXY_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-zinc-900 text-zinc-400 ${className}`}>
                <div className="text-center p-8">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p>Không thể tải video</p>
                </div>
            </div>
        );
    }

    const Watermark = () => {
        if (!user) return null;

        // Random position logic could be added here, 
        // for now simple absolute positioning with some animation
        return (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
                <div className="animate-float opacity-20 text-white text-sm font-bold absolute top-4 left-4 whitespace-nowrap">
                    {user.email} - {user.id.slice(0, 8)}
                </div>
                <div className="animate-float-delayed opacity-20 text-white text-sm font-bold absolute bottom-8 right-8 whitespace-nowrap">
                    {user.email}
                </div>
                {/* Center random floating element */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 text-white text-xs font-mono pointer-events-none">
                    {user.id}
                </div>
            </div>
        );
    };

    // YouTube embed
    if (videoType === 'YOUTUBE') {
        const embedUrl = getYouTubeEmbedUrl(url);
        return (
            <div className={`relative ${className}`}>
                <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={title || 'Video'}
                    onError={() => setError(true)}
                />
                {/* Note: YouTube iframes capture clicks so overlay might not be fully effective or visible if z-index isn't handled by parent, 
                     but standard iframe prevents overlays from intercepting interactions easily. 
                     For strictly secure watermark on YouTube, it's hard. But we add it anyway. */}
                <Watermark />
            </div>
        );
    }

    // Vimeo embed
    if (videoType === 'VIMEO') {
        const embedUrl = getVimeoEmbedUrl(url);
        return (
            <div className={`relative ${className}`}>
                <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="fullscreen; picture-in-picture"
                    title={title || 'Video'}
                    onError={() => setError(true)}
                />
                <Watermark />
            </div>
        );
    }

    // Cloudflare Stream or HLS content
    if (videoType === 'CLOUDFLARE_STREAM' || url.includes('.m3u8')) {
        return (
            <div className={`relative ${className}`}>
                <HLSPlayer src={url} title={title} onError={() => setError(true)} />
                <Watermark />
            </div>
        );
    }

    // Direct video (self-hosted or external) - with custom fullscreen
    const videoSource = url;

    return (
        <FullscreenVideoWrapper className={className} user={user}>
            {(containerRef, isFullscreen, toggleFullscreen) => (
                <>
                    <video
                        src={videoSource}
                        className="w-full h-full"
                        controls
                        controlsList="nodownload nofullscreen"
                        onContextMenu={(e) => e.preventDefault()}
                        onError={() => setError(true)}
                        title={title}
                    >
                        Your browser does not support video playback.
                    </video>
                    <FullscreenButton isFullscreen={isFullscreen} onClick={toggleFullscreen} />
                </>
            )}
        </FullscreenVideoWrapper>
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
            }).catch(err => {
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
        // Get user from props or try localStorage fallback
        let displayUser = user;
        if (!displayUser) {
            try {
                const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                if (storedUser) {
                    displayUser = JSON.parse(storedUser);
                }
            } catch (e) {
                // Ignore parse errors
            }
        }

        if (!displayUser || (!displayUser.email && !displayUser.id)) return null;

        const watermarkText = `${displayUser.email || 'user'} - ${displayUser.id || ''}`;
        return (
            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden select-none">
                {/* Top left */}
                <div className={`animate-float opacity-30 text-white font-bold absolute top-4 left-4 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {watermarkText}
                </div>
                {/* Top right */}
                <div className={`animate-float-delayed opacity-25 text-white font-bold absolute top-4 right-4 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {displayUser.email}
                </div>
                {/* Center */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15 text-white font-mono ${isFullscreen ? 'text-xl' : 'text-sm'}`}>
                    {watermarkText}
                </div>
                {/* Bottom left */}
                <div className={`animate-float opacity-25 text-white font-bold absolute bottom-16 left-8 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {displayUser.id}
                </div>
                {/* Bottom right */}
                <div className={`animate-float-delayed opacity-30 text-white font-bold absolute bottom-16 right-8 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {watermarkText}
                </div>
                {/* Additional scattered watermarks for fullscreen */}
                {isFullscreen && (
                    <>
                        <div className="opacity-20 text-white text-base font-bold absolute top-1/4 left-1/4 whitespace-nowrap">
                            {displayUser.email}
                        </div>
                        <div className="opacity-20 text-white text-base font-bold absolute top-3/4 right-1/4 whitespace-nowrap">
                            {displayUser.id}
                        </div>
                        <div className="opacity-15 text-white text-base font-mono absolute top-1/3 right-1/3 whitespace-nowrap">
                            {watermarkText}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div ref={containerRef} className={`relative bg-black ${className} ${isFullscreen ? 'w-screen h-screen' : ''}`}>
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
            className="absolute top-4 right-4 z-50 p-2 bg-black/70 hover:bg-black/90 rounded transition-colors"
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
    className,
    onError
}: {
    src: string;
    title?: string;
    className?: string;
    onError?: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { user } = useAuth();

    // Handle custom fullscreen toggle
    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(err => {
                console.error('Error entering fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    // Listen for fullscreen changes
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
            // Check for native HLS support (Safari, iOS)
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.addEventListener('loadedmetadata', () => setIsLoading(false));
                return;
            }

            // Use hls.js for other browsers
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
                    console.error('HLS is not supported in this browser');
                    onError?.();
                }
            } catch (err) {
                console.error('Failed to load hls.js:', err);
                // Fallback: try direct playback
                video.src = src;
            }
        };

        initPlayer();

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src, onError]);

    // Watermark component for HLS Player
    const HLSWatermark = () => {
        // Get user from props or try localStorage fallback
        let displayUser = user;
        if (!displayUser) {
            try {
                const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
                if (storedUser) {
                    displayUser = JSON.parse(storedUser);
                }
            } catch (e) {
                // Ignore parse errors
            }
        }

        if (!displayUser || (!displayUser.email && !displayUser.id)) return null;

        const watermarkText = `${displayUser.email || 'user'} - ${displayUser.id || ''}`;
        return (
            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden select-none">
                {/* Top left */}
                <div className={`animate-float opacity-30 text-white font-bold absolute top-4 left-4 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {watermarkText}
                </div>
                {/* Top right */}
                <div className={`animate-float-delayed opacity-25 text-white font-bold absolute top-4 right-4 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {displayUser.email}
                </div>
                {/* Center */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-15 text-white font-mono ${isFullscreen ? 'text-xl' : 'text-sm'}`}>
                    {watermarkText}
                </div>
                {/* Bottom left */}
                <div className={`animate-float opacity-25 text-white font-bold absolute bottom-16 left-8 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {displayUser.id}
                </div>
                {/* Bottom right */}
                <div className={`animate-float-delayed opacity-30 text-white font-bold absolute bottom-16 right-8 whitespace-nowrap ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
                    {watermarkText}
                </div>
                {/* Additional scattered watermarks for fullscreen */}
                {isFullscreen && (
                    <>
                        <div className="opacity-20 text-white text-base font-bold absolute top-1/4 left-1/4 whitespace-nowrap">
                            {displayUser.email}
                        </div>
                        <div className="opacity-20 text-white text-base font-bold absolute top-3/4 right-1/4 whitespace-nowrap">
                            {displayUser.id}
                        </div>
                        <div className="opacity-15 text-white text-base font-mono absolute top-1/3 right-1/3 whitespace-nowrap">
                            {watermarkText}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div ref={containerRef} className={`relative bg-black ${className} ${isFullscreen ? 'w-screen h-screen' : ''}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-30">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <video
                ref={videoRef}
                className="w-full h-full"
                controls
                controlsList="nodownload nofullscreen"
                onContextMenu={(e) => e.preventDefault()}
                title={title}
            />
            {/* Watermark overlay - visible in both normal and fullscreen */}
            <HLSWatermark />
            {/* Custom fullscreen button */}
            <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-50 p-2 bg-black/70 hover:bg-black/90 rounded transition-colors"
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

    // YouTube - various formats
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

        // youtube.com variants
        if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.searchParams.get('v')) {
                videoId = urlObj.searchParams.get('v') || '';
            } else if (urlObj.pathname.startsWith('/embed/')) {
                videoId = urlObj.pathname.split('/embed/')[1];
            } else if (urlObj.pathname.startsWith('/shorts/')) {
                videoId = urlObj.pathname.split('/shorts/')[1];
            } else if (urlObj.pathname.startsWith('/v/')) {
                videoId = urlObj.pathname.split('/v/')[1];
            }
        }
        // youtu.be variants
        else if (urlObj.hostname.includes('youtu.be')) {
            videoId = urlObj.pathname.slice(1);
        }
    } catch (e) {
        // Fallback for partial URLs if any
        console.warn('Invalid URL:', url);
    }

    if (videoId) {
        // Clean videoId (remove query params if any stuck)
        videoId = videoId.split('?')[0].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
}

/**
 * Convert Vimeo URL to embed URL
 */
function getVimeoEmbedUrl(url: string): string {
    // Already embed format
    if (url.includes('player.vimeo.com')) return url;

    // vimeo.com/VIDEO_ID or vimeo.com/channels/staffpicks/VIDEO_ID
    const match = url.match(/vimeo\.com\/(?:channels\/[\w]+\/)?(\d+)/);
    if (match) {
        return `https://player.vimeo.com/video/${match[1]}`;
    }
    return url;
}

/**
 * Empty state when no video
 */
export function VideoPlayerEmpty({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center bg-zinc-900 text-zinc-500 ${className}`}>
            <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-zinc-400">Chưa có video cho bài học này</p>
            </div>
        </div>
    );
}
