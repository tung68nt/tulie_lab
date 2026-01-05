import crypto from 'crypto';

export enum VideoType {
    YOUTUBE = 'YOUTUBE',
    VIMEO = 'VIMEO',
    CLOUDFLARE_STREAM = 'CLOUDFLARE_STREAM',
    SELF_HOSTED = 'SELF_HOSTED',
    EXTERNAL = 'EXTERNAL'
}

/**
 * Detect video type from URL
 */
export const detectVideoType = (url: string): VideoType => {
    if (!url) return VideoType.EXTERNAL;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return VideoType.YOUTUBE;
    }
    if (url.includes('vimeo.com')) {
        return VideoType.VIMEO;
    }
    if (url.includes('cloudflarestream.com') || url.includes('videodelivery.net')) {
        return VideoType.CLOUDFLARE_STREAM;
    }
    if (url.startsWith('/uploads/') || url.includes(process.env.STORAGE_URL || 'localhost')) {
        return VideoType.SELF_HOSTED;
    }
    return VideoType.EXTERNAL;
};

/**
 * Generate embed URL for YouTube videos
 */
export const getYouTubeEmbedUrl = (url: string): string | null => {
    const patterns = [
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtu\.be\/([^?]+)/,
        /youtube\.com\/embed\/([^?]+)/,
        /youtube\.com\/shorts\/([^?]+)/,
        /youtube\.com\/v\/([^?]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
    }
    return null;
};

/**
 * Generate embed URL for Vimeo videos
 */
export const getVimeoEmbedUrl = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) {
        return `https://player.vimeo.com/video/${match[1]}`;
    }
    return null;
};

/**
 * Generate signed URL with expiration
 */
export const generateSignedUrl = async (
    url: string,
    type: VideoType,
    expiresInSeconds: number = 3600
): Promise<string> => {
    const expiry = Math.floor(Date.now() / 1000) + expiresInSeconds;

    switch (type) {
        case VideoType.CLOUDFLARE_STREAM:
            return generateCloudflareSignedUrl(url, expiry);
        case VideoType.SELF_HOSTED:
            return generateSelfHostedSignedUrl(url, expiry);
        case VideoType.YOUTUBE:
            return getYouTubeEmbedUrl(url) || url;
        case VideoType.VIMEO:
            return getVimeoEmbedUrl(url) || url;
        default:
            return url;
    }
};

/**
 * Generate Cloudflare Stream signed URL
 * Requires CLOUDFLARE_STREAM_SIGNING_KEY and CLOUDFLARE_STREAM_KEY_ID
 */
const generateCloudflareSignedUrl = (videoId: string, expiry: number): string => {
    const signingKey = process.env.CLOUDFLARE_STREAM_SIGNING_KEY;
    const keyId = process.env.CLOUDFLARE_STREAM_KEY_ID;

    if (!signingKey || !keyId) {
        console.warn('Cloudflare Stream signing keys not configured');
        return `https://videodelivery.net/${videoId}/manifest/video.m3u8`;
    }

    // Create signed token
    const token = crypto
        .createHmac('sha256', signingKey)
        .update(`${videoId}${expiry}`)
        .digest('hex');

    return `https://videodelivery.net/${videoId}/manifest/video.m3u8?token=${token}&exp=${expiry}`;
};

/**
 * Generate signed URL for self-hosted content
 * Requires URL_SIGNING_SECRET in env
 */
const generateSelfHostedSignedUrl = (url: string, expiry: number): string => {
    const secret = process.env.URL_SIGNING_SECRET;

    if (!secret) {
        console.warn('URL_SIGNING_SECRET not configured, returning original URL');
        return url;
    }

    // Generate signature
    const signature = crypto
        .createHmac('sha256', secret)
        .update(`${url}${expiry}`)
        .digest('hex');

    // Append signature and expiry to URL
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}sig=${signature}&exp=${expiry}`;
};

/**
 * Verify a signed URL
 */
export const verifySignedUrl = (url: string, signature: string, expiry: number): boolean => {
    const secret = process.env.URL_SIGNING_SECRET;
    if (!secret) return false;

    // Check expiry
    if (Date.now() / 1000 > expiry) {
        return false;
    }

    // Verify signature
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${url}${expiry}`)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
};

/**
 * Process lesson content with secure URLs
 */
export const secureLessonContent = async (lesson: any): Promise<any> => {
    if (!lesson) return lesson;

    const videoType = detectVideoType(lesson.videoUrl || '');
    const secureVideoUrl = lesson.videoUrl
        ? await generateSignedUrl(lesson.videoUrl, videoType)
        : null;

    // Sign attachment URLs
    const secureAttachments = await Promise.all(
        (lesson.attachments || []).map(async (att: any) => ({
            ...att,
            url: await generateSignedUrl(att.url, VideoType.SELF_HOSTED, 3600)
        }))
    );

    return {
        ...lesson,
        videoUrl: secureVideoUrl,
        videoType,
        attachments: secureAttachments
    };
};
