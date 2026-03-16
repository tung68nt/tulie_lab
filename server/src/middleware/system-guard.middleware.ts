import { Request, Response, NextFunction } from 'express';
import os from 'os';
import { loggerService } from '../services/logger.service';

/**
 * System Guard Middleware
 * 
 * Monitors system resources (memory, CPU) and proactively returns 503
 * with a friendly message BEFORE the VPS crashes from overload.
 * 
 * This prevents Vietnix from detecting the VPS as "attacking" when it
 * actually just has too many outbound connections from being overwhelmed.
 * 
 * Response includes 'X-System-Status' header for client-side detection.
 */

// Configuration
const MEMORY_THRESHOLD_PERCENT = Number(process.env.MEMORY_THRESHOLD_PERCENT) || 90;
const HEAP_THRESHOLD_MB = Number(process.env.HEAP_THRESHOLD_MB) || 450; // Out of 512MB max
const CPU_THRESHOLD_PERCENT = Number(process.env.CPU_THRESHOLD_PERCENT) || 95;
const CHECK_INTERVAL_MS = 5000; // Check every 5 seconds
const BYPASS_PATHS = ['/api/health', '/api/check'];

// System status tracking
let systemStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
let lastCpuUsage = 0;
let lastMemoryPercent = 0;
let lastHeapUsedMB = 0;
let consecutiveHighCpu = 0;
let consecutiveHighMemory = 0;

// CPU measurement helpers
let previousCpuInfo = os.cpus();

function getCpuUsagePercent(): number {
    const currentCpuInfo = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (let i = 0; i < currentCpuInfo.length; i++) {
        const prevCpu = previousCpuInfo[i];
        const currCpu = currentCpuInfo[i];

        if (!prevCpu || !currCpu) continue;

        const prevTotal = Object.values(prevCpu.times).reduce((a, b) => a + b, 0);
        const currTotal = Object.values(currCpu.times).reduce((a, b) => a + b, 0);

        totalIdle += currCpu.times.idle - prevCpu.times.idle;
        totalTick += currTotal - prevTotal;
    }

    previousCpuInfo = currentCpuInfo;

    if (totalTick === 0) return 0;
    return Math.round(((totalTick - totalIdle) / totalTick) * 100);
}

// Background monitoring loop
const monitorInterval = setInterval(() => {
    try {
        // Memory check
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        lastMemoryPercent = Math.round(((totalMem - freeMem) / totalMem) * 100);

        // Heap check (Node.js specific)
        const heapUsed = process.memoryUsage().heapUsed;
        lastHeapUsedMB = Math.round(heapUsed / 1024 / 1024);

        // CPU check
        lastCpuUsage = getCpuUsagePercent();

        // Determine system status with hysteresis (need 3 consecutive high readings)
        const memoryHigh = lastMemoryPercent >= MEMORY_THRESHOLD_PERCENT || lastHeapUsedMB >= HEAP_THRESHOLD_MB;
        const cpuHigh = lastCpuUsage >= CPU_THRESHOLD_PERCENT;

        if (memoryHigh) {
            consecutiveHighMemory++;
        } else {
            consecutiveHighMemory = Math.max(0, consecutiveHighMemory - 1);
        }

        if (cpuHigh) {
            consecutiveHighCpu++;
        } else {
            consecutiveHighCpu = Math.max(0, consecutiveHighCpu - 1);
        }

        // Update status
        const prevStatus = systemStatus;
        if (consecutiveHighMemory >= 3 || consecutiveHighCpu >= 3) {
            systemStatus = 'critical';
        } else if (consecutiveHighMemory >= 1 || consecutiveHighCpu >= 1) {
            systemStatus = 'warning';
        } else {
            systemStatus = 'healthy';
        }

        // Log status changes
        if (prevStatus !== systemStatus) {
            const logData = {
                status: systemStatus,
                memory: `${lastMemoryPercent}%`,
                heap: `${lastHeapUsedMB}MB`,
                cpu: `${lastCpuUsage}%`,
            };

            if (systemStatus === 'critical') {
                loggerService.error('🔴 SYSTEM CRITICAL: Activating overload protection', logData);
            } else if (systemStatus === 'warning') {
                loggerService.warn('🟡 SYSTEM WARNING: Resources under pressure', logData);
            } else {
                loggerService.info('🟢 SYSTEM RECOVERED: Resources back to normal', logData);
            }
        }
    } catch {
        // Silent fail for monitoring
    }
}, CHECK_INTERVAL_MS);

// Cleanup on exit
process.on('SIGTERM', () => clearInterval(monitorInterval));
process.on('SIGINT', () => clearInterval(monitorInterval));

/**
 * Express middleware that rejects requests when system is overloaded
 */
export const systemGuard = (req: Request, res: Response, next: NextFunction) => {
    // Always allow health checks through
    if (BYPASS_PATHS.includes(req.path)) {
        return next();
    }

    // Add system status header to all responses
    res.setHeader('X-System-Status', systemStatus);

    if (systemStatus === 'critical') {
        loggerService.warn(`[SystemGuard] Rejecting request: System overloaded`, {
            path: req.path,
            method: req.method,
            memory: `${lastMemoryPercent}%`,
            heap: `${lastHeapUsedMB}MB`,
            cpu: `${lastCpuUsage}%`,
        });

        return res.status(503).json({
            status: 503,
            code: 'SYSTEM_OVERLOADED',
            message: 'Hệ thống đang quá tải. Vui lòng thử lại sau ít phút.',
            messageEn: 'System is currently overloaded. Please try again in a few minutes.',
            retryAfter: 30,
            systemStatus: {
                status: 'overloaded',
                memory: `${lastMemoryPercent}%`,
                cpu: `${lastCpuUsage}%`,
            },
        });
    }

    next();
};

/**
 * Get current system metrics (for health endpoint)
 */
export const getSystemMetrics = () => ({
    status: systemStatus,
    memory: {
        percent: lastMemoryPercent,
        heapUsedMB: lastHeapUsedMB,
        threshold: MEMORY_THRESHOLD_PERCENT,
        heapThreshold: HEAP_THRESHOLD_MB,
    },
    cpu: {
        percent: lastCpuUsage,
        threshold: CPU_THRESHOLD_PERCENT,
    },
    consecutiveHighCpu,
    consecutiveHighMemory,
});
