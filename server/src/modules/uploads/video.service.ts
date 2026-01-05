import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { storageService } from '../../services/storage.service';

// Set ffmpeg path from the installer
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

export const VideoService = {
    /**
     * Convert an MP4 file to HLS (m3u8) format
     * @param filePath Absolute path to the source MP4 file
     * @param uploadDir Absolute path to the uploads directory
     * @returns Relative path to the generated m3u8 file (e.g., /uploads/hls/xyz/master.m3u8)
     */
    processVideo: (filePath: string, uploadDir: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileName = path.basename(filePath, path.extname(filePath));
            // Local temp dir for processing
            const hlsOutputDir = path.join(uploadDir, 'hls', fileName);

            // Ensure output directory exists locally first
            if (!fs.existsSync(hlsOutputDir)) {
                fs.mkdirSync(hlsOutputDir, { recursive: true });
            }

            const outputM3u8 = path.join(hlsOutputDir, 'master.m3u8');

            ffmpeg(filePath)
                .outputOptions([
                    '-profile:v baseline', // Baseline profile for compatibility
                    '-level 3.0',
                    '-start_number 0',
                    '-hls_time 10', // 10 second segments
                    '-hls_list_size 0', // Include all segments in the playlist
                    '-f hls'
                ])
                .output(outputM3u8)
                .on('end', async () => {
                    console.log(`HLS conversion finished locally: ${outputM3u8}`);

                    try {
                        // Upload all generated files to R2
                        const files = fs.readdirSync(hlsOutputDir);
                        const r2Folder = `uploads/hls/${fileName}`; // Key prefix in R2

                        // Upload segments and playlist
                        for (const file of files) {
                            const localFilePath = path.join(hlsOutputDir, file);
                            const r2Key = `${r2Folder}/${file}`;

                            await storageService.uploadFile(localFilePath, r2Key);

                            // Optional: Delete local file after upload to save space (important for Cloud Run)
                            fs.unlinkSync(localFilePath);
                        }

                        // Also delete the original uploaded file if needed
                        // fs.unlinkSync(filePath); 

                        // Clean up temp folder
                        fs.rmdirSync(hlsOutputDir);

                        // Return the Public URL for the master playlist
                        // If R2_PUBLIC_DOMAIN is set, storageService handles it, otherwise we might need to construct it
                        const masterPlaylistKey = `${r2Folder}/master.m3u8`;
                        let publicUrl = masterPlaylistKey;

                        if (process.env.R2_PUBLIC_DOMAIN) {
                            const domain = process.env.R2_PUBLIC_DOMAIN.endsWith('/')
                                ? process.env.R2_PUBLIC_DOMAIN.slice(0, -1)
                                : process.env.R2_PUBLIC_DOMAIN;
                            publicUrl = `${domain}/${masterPlaylistKey}`;
                        } else {
                            // Fallback to relative path if no domain (for local testing without R2 setup)
                            // But since we are moving to R2, we expect a domain.
                            // However, let's keep relative /uploads/... if we want to proxy? 
                            // No, best to return full URL.
                            publicUrl = `/${masterPlaylistKey}`;
                        }

                        resolve(publicUrl);

                    } catch (uploadErr) {
                        console.error('Error uploading HLS to R2:', uploadErr);
                        reject(uploadErr);
                    }
                })
                .on('error', (err) => {
                    console.error('Error converting to HLS:', err);
                    reject(err);
                })
                .run();
        });
    }
};
