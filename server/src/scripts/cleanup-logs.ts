import prisma from '../config/prisma';
import { loggerService } from '../services/logger.service';

/**
 * DB Cleanup Script
 * 
 * Removes activity and security logs older than 30 days to save space and 
 * maintain query performance on small VPS.
 */

async function cleanupOldLogs() {
    loggerService.info('🧹 Starting log cleanup...');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
        // 1. Cleanup Activity Logs
        const activityResult = await prisma.activityLog.deleteMany({
            where: {
                createdAt: {
                    lt: thirtyDaysAgo
                }
            }
        });
        loggerService.info(`   - Deleted ${activityResult.count} old activity logs.`);

        // 2. Cleanup Security Logs
        const securityResult = await prisma.securityLog.deleteMany({
            where: {
                createdAt: {
                    lt: thirtyDaysAgo
                }
            }
        });
        loggerService.info(`   - Deleted ${securityResult.count} old security logs.`);

        loggerService.info('✅ Log cleanup complete.');
    } catch (error: any) {
        loggerService.error('❌ Log cleanup failed:', { error: error.message });
    }
}

// If running directly
if (require.main === module) {
    cleanupOldLogs().then(() => process.exit(0)).catch(() => process.exit(1));
}

export { cleanupOldLogs };
