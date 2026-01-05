import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

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
            const hlsOutputDir = path.join(uploadDir, 'hls', fileName);

            // Ensure output directory exists
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
                .on('end', () => {
                    console.log(`HLS conversion finished: ${outputM3u8}`);
                    // Return relative path for the frontend
                    const relativePath = `/uploads/hls/${fileName}/master.m3u8`;
                    resolve(relativePath);
                })
                .on('error', (err) => {
                    console.error('Error converting to HLS:', err);
                    reject(err);
                })
                .run();
        });
    }
};
