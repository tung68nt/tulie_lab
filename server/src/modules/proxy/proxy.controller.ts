import { Request, Response } from 'express';
import axios from 'axios';

export const ProxyController = {
    async streamVideo(req: Request, res: Response) {
        try {
            const videoUrl = req.query.url as string;

            if (!videoUrl) {
                return res.status(400).send('Missing video URL');
            }

            // Optional: Validate that URL points to a video or allowed domain
            // const allowedDomains = ['example.com'];
            // if (!allowedDomains.some(domain => videoUrl.includes(domain))) {
            //     return res.status(403).send('Domain not allowed');
            // }

            // Forward Range header for seeking support
            const range = req.headers.range;
            const headers: any = {};
            if (range) {
                headers['Range'] = range;
            }

            const response = await axios({
                method: 'GET',
                url: videoUrl,
                responseType: 'stream',
                headers: headers
            });

            // Forward relevant headers to client
            if (response.headers['content-range']) {
                res.status(206);
                res.setHeader('Content-Range', response.headers['content-range']);
            }
            if (response.headers['content-length']) {
                res.setHeader('Content-Length', response.headers['content-length']);
            }
            if (response.headers['content-type']) {
                res.setHeader('Content-Type', response.headers['content-type']);
            }
            if (response.headers['accept-ranges']) {
                res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
            }

            // Pipe the video stream to the response
            response.data.pipe(res);

            response.data.on('error', (err: any) => {
                console.error('Stream error:', err);
                res.end();
            });

        } catch (error: any) {
            console.error('Proxy error:', error.message);
            if (error.response) {
                res.status(error.response.status).send(error.response.statusText);
            } else {
                res.status(500).send('Failed to stream video');
            }
        }
    }
};
