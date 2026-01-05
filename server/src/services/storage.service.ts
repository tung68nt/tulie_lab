import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
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

        if (!accountId || !accessKeyId || !secretAccessKey) {
            console.warn('⚠️ R2 Storage configuration missing. Uploads may fail.');
        }

        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: accessKeyId || '',
                secretAccessKey: secretAccessKey || ''
            }
        });
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
            return destinationKey;
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
            return destinationKey;
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
}

export const storageService = new StorageService();
