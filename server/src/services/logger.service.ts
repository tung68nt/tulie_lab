import winston from 'winston';
import path from 'path';

/**
 * Custom format to extract requestId from metadata if available
 */
const requestTrackingFormat = winston.format((info) => {
    // If we passed a requestId in metadata, promote it to the top level
    if (info.requestId) {
        info.requestId = info.requestId;
    }
    return info;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        requestTrackingFormat(),
        process.env.NODE_ENV === 'production'
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, requestId, stack }) => {
                    const reqId = requestId ? ` [${requestId}]` : '';
                    const logStack = stack ? `\n${stack}` : '';
                    return `${timestamp} ${level}${reqId}: ${message}${logStack}`;
                })
            )
    ),
    transports: [
        new winston.transports.Console(),
        // Production might log to a file as well, or just let Cloud Run handle stdout/stderr
    ],
});

export class LoggerService {
    info(message: string, meta?: any) {
        logger.info(message, meta);
    }

    error(message: string, meta?: any) {
        logger.error(message, meta);
    }

    warn(message: string, meta?: any) {
        logger.warn(message, meta);
    }

    debug(message: string, meta?: any) {
        logger.debug(message, meta);
    }

    /**
     * Helper to create a child logger or context-aware log
     * Useful for request-scoped logging
     */
    forRequest(requestId: string) {
        return {
            info: (msg: string, meta?: any) => this.info(msg, { ...meta, requestId }),
            error: (msg: string, meta?: any) => this.error(msg, { ...meta, requestId }),
            warn: (msg: string, meta?: any) => this.warn(msg, { ...meta, requestId }),
            debug: (msg: string, meta?: any) => this.debug(msg, { ...meta, requestId }),
        };
    }
}

export const loggerService = new LoggerService();
