import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl as getPresignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

export class StorageService {
    private client: S3Client;
    private bucket: string;
    private publicDomain: string;

    constructor() {
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

        this.bucket = process.env.R2_BUCKET_NAME || 'academy-tulie-storage';
        this.publicDomain = process.env.R2_PUBLIC_DOMAIN || '';

        // Ensure we use the correct domain even if legacy one is provided in env
        if (this.publicDomain.includes('pub-d4a95eabdf153f73125f66e4c1557ab7.r2.dev')) {
            this.publicDomain = this.publicDomain.replace('pub-d4a95eabdf153f73125f66e4c1557ab7.r2.dev', 'pub-84306d90a5714d098ed77c04f4c85df2.r2.dev');
        }

        if (!accountId || !accessKeyId || !secretAccessKey) {
            console.warn('⚠️ R2 Storage configuration missing. Uploads will fail safely.');
            // Initialize with dummy creds to prevent crash, but operations will fail later
            this.client = new S3Client({
                region: 'auto',
                credentials: { accessKeyId: 'missing', secretAccessKey: 'missing' }
            });
            return;
        }

        try {
            this.client = new S3Client({
                region: 'auto',
                endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey
                }
            });
        } catch (error) {
            console.error('❌ Failed to initialize S3 Client:', error);
            // Fallback to prevent app crash
            this.client = new S3Client({ region: 'auto' });
        }
    }

    /**
     * Upload a file from local path to R2
     */
    async uploadFile(filePath: string, destinationKey: string, contentType?: string): Promise<string> {
        try {
            const fileStream = fs.createReadStream(filePath);
            const upload = new Upload({
                client: this.client,
                params: {
                    Bucket: this.bucket,
                    Key: destinationKey,
                    Body: fileStream,
                    ContentType: contentType || mime.lookup(filePath) || 'application/octet-stream'
                }
            });

            await upload.done();

            // Return public URL
            if (this.publicDomain) {
                // Ensure no double slashes
                const domain = this.publicDomain.endsWith('/') ? this.publicDomain.slice(0, -1) : this.publicDomain;
                const key = destinationKey.startsWith('/') ? destinationKey.slice(1) : destinationKey;
                return `${domain}/${key}`;
            }
            return `/${destinationKey.startsWith('/') ? destinationKey.slice(1) : destinationKey}`;
        } catch (error) {
            console.error('R2 Upload Error:', error);
            throw error;
        }
    }

    /**
     * Upload a buffer or stream directly
     */
    async uploadBuffer(buffer: Buffer, destinationKey: string, contentType: string): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: destinationKey,
                Body: buffer,
                ContentType: contentType
            });

            await this.client.send(command);

            if (this.publicDomain) {
                const domain = this.publicDomain.endsWith('/') ? this.publicDomain.slice(0, -1) : this.publicDomain;
                const key = destinationKey.startsWith('/') ? destinationKey.slice(1) : destinationKey;
                return `${domain}/${key}`;
            }
            return `/${destinationKey.startsWith('/') ? destinationKey.slice(1) : destinationKey}`;
        } catch (error) {
            console.error('R2 Buffer Upload Error:', error);
            throw error;
        }
    }

    /**
     * Delete file from R2
     */
    async deleteFile(key: string): Promise<void> {
        try {
            // Extract key from URL if full URL is passed
            if (key.startsWith('http')) {
                const urlObj = new URL(key);
                key = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
            }

            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key
            });
            await this.client.send(command);
        } catch (error) {
            console.error('Delete R2 File Error:', error);
            // Don't throw, just log
        }
    }

    /**
     * Get file stream from R2
     */
    async getFileStream(key: string): Promise<any> {
        try {
            // Extract key from URL if needed
            if (key.startsWith('http')) {
                const urlObj = new URL(key);
                key = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
            }
            // Handle /uploads/ prefix if passed
            if (key.startsWith('/uploads/')) {
                key = `uploads/${key.replace('/uploads/', '')}`;
            } else if (key.startsWith('uploads/')) {
                // already correct
            } else if (!key.includes('/')) {
                // assume uploads folder if just filename
                key = `uploads/${key}`;
            }

            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
            });

            const response = await this.client.send(command);
            return response.Body;
        } catch (error) {
            console.error('Get R2 File Error:', error);
            return null;
        }
    }

    /**
     * List files from R2
     */
    async listFiles(prefix?: string): Promise<any[]> {
        console.log(`[Storage] Listing files in bucket: ${this.bucket}, prefix: ${prefix || '(none)'}`);
        try {
            const command = new ListObjectsV2Command({
                Bucket: this.bucket,
                Prefix: prefix
            });

            const response = await this.client.send(command).catch(err => {
                console.error(`[Storage] SDK error listing files: ${err.message}`, {
                    bucket: this.bucket,
                    prefix: prefix,
                    code: err.code
                });
                throw err;
            });

            const items = (response.Contents || []).map(item => ({
                key: item.Key,
                size: item.Size,
                lastModified: item.LastModified,
                url: this.publicDomain
                    ? `${this.publicDomain.endsWith('/') ? this.publicDomain.slice(0, -1) : this.publicDomain}/${item.Key}`
                    : `/${item.Key}`
            })).sort((a, b) => (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0));

            console.log(`[Storage] Found ${items.length} items`);
            return items;
        } catch (error: any) {
            console.error('[Storage] List R2 Files Fatal Error:', error.message);
            // Return empty array instead of throwing to prevent UI crash
            return [];
        }
    }
    async getSignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
        try {
            // Extract key from URL if needed
            if (key.startsWith('http')) {
                const urlObj = new URL(key);
                key = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
            }
            // Handle /uploads/ prefix if passed
            if (key.startsWith('/uploads/')) {
                key = `uploads/${key.replace('/uploads/', '')}`;
            } else if (key.startsWith('uploads/')) {
                // already correct
            } else if (!key.includes('/')) {
                // assume uploads folder if just filename
                key = `uploads/${key}`;
            }

            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
            });

            // Sign the URL
            const url = await getPresignedUrl(this.client, command, { expiresIn: expiresInSeconds });
            return url;
        } catch (error) {
            console.error('Get Signed URL Error:', error);
            // Fallback to public URL or empty string
            return '';
        }
    }
}

export const storageService = new StorageService();
