import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { VideoService } from './video.service';

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

    let fileUrl = `/uploads/${req.file.filename}`;
    let isHls = false;

    // Process video files to HLS
    if (req.file.mimetype.startsWith('video/')) {
        try {
            const uploadDir = path.join(__dirname, '../../../uploads');
            const hlsUrl = await VideoService.processVideo(req.file.path, uploadDir);
            fileUrl = hlsUrl;
            isHls = true;
        } catch (error) {
            console.error('Failed to process video to HLS, falling back to original MP4:', error);
            // Fallback to original fileUrl if HLS conversion fails
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
});

// Multiple file upload
router.post('/multiple', authenticate, authorize([Role.ADMIN]), upload.array('files', 10), (req, res) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded or file types not allowed' });
    }

    const uploadedFiles = files.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
    }));

    res.json({
        success: true,
        files: uploadedFiles
    });
});

export default router;
