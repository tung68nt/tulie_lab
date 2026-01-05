import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { VideoService } from './video.service';
import { storageService } from '../../services/storage.service';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../uploads'));
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
                const uploadDir = path.join(__dirname, '../../../uploads');
                // processVideo now uploads to R2 and returns the public URL
                const hlsUrl = await VideoService.processVideo(localFilePath, uploadDir);
                fileUrl = hlsUrl;
                isHls = true;

                // processVideo logic might handle deletion, but let's be safe.
                // Actually VideoService deletes the HLS folder, but maybe not the original input file?
                // Let's check VideoService again. It says "// fs.unlinkSync(filePath);" is commented out.
                // So we should delete the original input file here.
                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } catch (error) {
                console.error('Failed to process video to HLS:', error);

                // Fallback: Upload original MP4 to R2 if HLS fails
                const r2Key = `uploads/${req.file.filename}`;
                fileUrl = await storageService.uploadFile(localFilePath, r2Key, req.file.mimetype);

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            }
        } else {
            // Normal file upload -> Upload to R2 directly
            const r2Key = `uploads/${req.file.filename}`;
            fileUrl = await storageService.uploadFile(localFilePath, r2Key, req.file.mimetype);

            // Delete local temp file
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        }

        res.json({
            success: true,
            file: {
                originalName: req.file.originalname,
                filename: req.file.filename,
                url: fileUrl,
                size: req.file.size,
                mimetype: isHls ? 'application/x-mpegURL' : req.file.mimetype,
                isHls
            }
        });
    } catch (error: any) {
        console.error('Upload processing error:', error);
        // Clean up even on error
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
                const url = await storageService.uploadFile(localFilePath, r2Key, file.mimetype);

                // Delete local temp file
                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }

                return {
                    originalName: file.originalname,
                    filename: file.filename,
                    url: url,
                    size: file.size,
                    mimetype: file.mimetype
                };
            } catch (err) {
                console.error(`Failed to upload file ${file.originalname}:`, err);
                return null;
            }
        }));

        const successfulUploads = uploadedFiles.filter(f => f !== null);

        res.json({
            success: true,
            files: successfulUploads,
            failedCount: files.length - successfulUploads.length
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Multiple upload processing failed', error: error.message });
    }
});

export default router;
