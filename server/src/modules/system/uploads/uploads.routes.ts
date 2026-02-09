import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { VideoService } from './video.service';
import { storageService } from '../../../services/storage.service';
import { prisma } from '../../../config/prisma';
import { loggerService } from '../../../services/logger.service';

const router = express.Router();

console.log('📂 Uploads module loaded. StorageService status:', storageService ? 'Active' : 'Missing');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`✅ Created uploads directory at: ${uploadsDir}`);
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../../uploads'));
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// File filter for allowed types
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-zip-compressed',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/x-icon',
        'image/vnd.microsoft.icon',
        'image/webp',
        'video/mp4',
        'video/webm',
        'text/plain',
        'application/json'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Generate Presigned URL
router.get('/sign', authenticate, async (req, res) => {
    try {
        const key = req.query.key as string;
        if (!key) return res.status(400).json({ message: 'Key is required' });

        const url = await storageService.getSignedUrl(key);
        res.json({ success: true, url });
    } catch (error: any) {
        console.error('Sign URL Error:', error);
        res.status(500).json({ message: 'Failed to sign URL', error: error.message });
    }
});

// List all files (Admin only) - FROM DB
router.get('/', authenticate, authorize([Role.ADMIN]), async (req, res) => {
    try {
        const files = await prisma.media.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Map to expected format if needed, but DB fields match frontend well
        const mappedFiles = files.map(f => ({
            key: f.key,
            url: f.url,
            // Add size/lastModified if frontend needs specifically named fields
            size: f.size,
            lastModified: f.createdAt,
            name: f.name,
            mimeType: f.mimeType
        }));

        res.json({
            success: true,
            data: mappedFiles,
            meta: {
                total: files.length
            }
        });
    } catch (error: any) {
        console.error('List Files Error:', error);
        res.status(500).json({ message: 'Failed to list files', error: error.message });
    }
});

// Delete a file (Admin only) - DB + S3
// Delete a file (Admin only) - DB + S3
// Delete a file (Admin only) - DB + S3
router.delete('/', authenticate, authorize([Role.ADMIN]), async (req, res) => {
    try {
        const key = req.query.key as string;

        if (!key) {
            return res.status(400).json({ message: 'File key is required' });
        }

        // Delete from S3
        await storageService.deleteFile(key);

        // Delete from DB
        await prisma.media.deleteMany({
            where: { key: key }
        });

        res.json({ success: true, message: 'File deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to delete file', error: error.message });
    }
});

// Single file upload
router.post('/', authenticate, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded or file type not allowed' });
    }

    let fileUrl = '';
    let isHls = false;
    const localFilePath = req.file.path;

    try {
        // Process video files to HLS
        if (req.file.mimetype.startsWith('video/')) {
            try {
                const uploadDir = path.join(__dirname, '../../../../uploads');
                const hlsUrl = await VideoService.processVideo(localFilePath, uploadDir);
                fileUrl = hlsUrl;
                isHls = true;

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } catch (error) {
                console.error('Failed to process video to HLS:', error);
                const r2Key = `uploads/${req.file.filename}`;
                fileUrl = await storageService.uploadFile(localFilePath, r2Key, req.file.mimetype);

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            }
        } else {
            // Normal file upload
            // Re-enabled R2 storage for persistence across redeploys
            const r2Key = `uploads/${req.file.filename}`;
            fileUrl = await storageService.uploadFile(localFilePath, r2Key, req.file.mimetype);

            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }

            console.log(`✅ File saved to R2: ${fileUrl}`);
        }

        // Save to DB
        const finalKey = `uploads/${req.file.filename}`;

        const media = await prisma.media.create({
            data: {
                key: finalKey,
                url: fileUrl,
                name: req.file.originalname,
                mimeType: isHls ? 'application/x-mpegURL' : req.file.mimetype,
                size: req.file.size
            }
        });

        res.json({
            success: true,
            data: {
                originalName: media.name,
                filename: media.key,
                url: media.url,
                size: media.size,
                mimetype: media.mimeType,
                isHls
            }
        });
    } catch (error: any) {
        console.error('Upload processing error:', error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        res.status(500).json({ message: 'File upload processed failed', error: error.message });
    }
});

// Multiple file upload
router.post('/multiple', authenticate, authorize([Role.ADMIN]), upload.array('files', 10), async (req, res) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded or file types not allowed' });
    }

    try {
        const uploadedFiles = await Promise.all(files.map(async (file) => {
            const localFilePath = file.path;
            const r2Key = `uploads/${file.filename}`;

            try {
                // Re-enabled R2 storage for persistence
                const url = await storageService.uploadFile(localFilePath, r2Key, file.mimetype);
                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }

                // Save to DB
                const media = await prisma.media.create({
                    data: {
                        key: r2Key,
                        url: url,
                        name: file.originalname,
                        mimeType: file.mimetype,
                        size: file.size
                    }
                });

                return {
                    originalName: media.name,
                    filename: media.key,
                    url: media.url,
                    size: media.size,
                    mimetype: media.mimeType
                };
            } catch (err) {
                console.error(`Failed to handle file ${file.originalname}:`, err);
                return null;
            }
        }));

        const successfulUploads = uploadedFiles.filter(f => f !== null);

        res.json({
            success: true,
            data: successfulUploads,
            meta: {
                total: files.length,
                successCount: successfulUploads.length,
                failedCount: files.length - successfulUploads.length
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Multiple upload processing failed', error: error.message });
    }
});

// Import by URL
router.post('/import-url', authenticate, authorize([Role.ADMIN]), async (req, res) => {
    try {
        const { url, name, mimeType } = req.body;

        if (!url) {
            return res.status(400).json({ message: 'URL is required' });
        }

        // --- SSRF Protection (Audit Priority 2) ---
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();

            // Block direct local access
            const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'];
            // Block private IP ranges (basic check)
            const isPrivate = hostname.startsWith('10.') ||
                hostname.startsWith('192.168.') ||
                hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
                hostname.endsWith('.local') ||
                hostname === 'internal';

            if (blockedHosts.includes(hostname) || isPrivate) {
                loggerService.warn(`SSRF attempt blocked for URL: ${url}`, {
                    userId: (req as any).user?.id,
                    requestId: (req as any).id
                });
                return res.status(403).json({ message: 'Access to internal or local URLs is prohibited' });
            }
        } catch (e) {
            return res.status(400).json({ message: 'Invalid URL provided' });
        }

        let finalName = name;
        let finalMimeType = mimeType || 'application/octet-stream';
        let size = 0;

        // Try to fetch metadata
        try {
            const headRes = await fetch(url, { method: 'HEAD' });
            if (headRes.ok) {
                finalMimeType = headRes.headers.get('content-type') || finalMimeType;
                const contentLength = headRes.headers.get('content-length');
                if (contentLength) size = parseInt(contentLength, 10);
            }
        } catch (err) {
            console.warn('Failed to fetch metadata for URL:', url);
            // Ignore error, proceed with user provided or default values
        }

        // Generate filename if not provided
        if (!finalName) {
            try {
                const urlObj = new URL(url);
                finalName = path.basename(urlObj.pathname) || 'imported-file';
            } catch {
                finalName = 'imported-file';
            }
        }

        // Generate a unique key for DB reference (not real S3 key)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const key = `imported/${uniqueSuffix}/${finalName}`;

        const media = await prisma.media.create({
            data: {
                key: key,
                url: url,
                name: finalName,
                mimeType: finalMimeType,
                size: size
            }
        });

        res.json({
            success: true,
            data: {
                originalName: media.name,
                filename: media.key,
                url: media.url,
                size: media.size,
                mimetype: media.mimeType
            }
        });

    } catch (error: any) {
        console.error('Import URL Error:', error);
        res.status(500).json({ message: 'Failed to import URL', error: error.message });
    }
});

export default router;
