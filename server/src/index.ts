import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { loggerService } from './services/logger.service';
import redisService from './services/redis.service';

// Lazy load prisma to avoid top-level crash
let prisma: any = null;

// Set timezone to Vietnam (UTC+7) for consistent date/time display
process.env.TZ = 'Asia/Ho_Chi_Minh';

dotenv.config({ path: path.join(__dirname, '../.env') }); // Load .env from server root

let globalRequestCount = 0;
setInterval(() => { globalRequestCount = 0; }, 60000);

const app = express();

// Trust Cloud Run's proxy (GFE)
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 5001;

// Global startup error
let startupError: string | null = null;
let isAppReady = false;

// --- CRITICAL: Register health check FIRST, before any blocking operations ---
// This ensures Cloud Run's health check always passes.
app.get('/api/health', async (req, res) => {
  const health: any = {
    status: startupError ? 'error' : (isAppReady ? 'ok' : 'initializing'),
    version: 'v1.1.3-debug',
    timestamp: new Date().toISOString(),
    checks: {
      uptime: process.uptime(),
      readiness: isAppReady
    }
  };

  // Return error if startup failed
  if (startupError) {
    health.error = startupError;
    return res.status(503).json(health);
  }

  // Skip deep checks during initialization to satisfy startup probe immediately
  if (!isAppReady) {
    return res.status(200).json(health);
  }

  try {
    // 1. Check Database (Prisma)
    if (prisma) {
      await prisma.$queryRaw`SELECT 1`;
      health.checks.database = 'connected';
    } else {
      health.checks.database = 'initializing (waiting for prisma)';
    }
  } catch (error: any) {
    health.status = 'error';
    health.checks.database = `disconnected: ${error.message}`;
  }

  try {
    // 2. Check Redis
    if (redisService.getClient() && (redisService as any).isConnected) {
      await redisService.getClient().ping();
      health.checks.redis = 'connected';
    } else {
      health.checks.redis = 'disconnected (not initialized)';
    }
  } catch (error: any) {
    health.checks.redis = `disconnected: ${error.message}`;
  }

  res.status(health.status === 'error' ? 503 : 200).json(health);
});

app.get('/api/check', (req, res) => {
  res.json({ message: 'Deployment Success', version: 'v1.1.2-audit-v1', time: new Date().toISOString() });
});

// Swagger documentation route (Safeguarded)
try {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (err: any) {
  console.error('⚠️ Failed to initialize Swagger:', err.message);
}

// --- WebSocket & Services Initialization ---
let server: any;
if (process.env.NODE_ENV !== 'test') {
  // --- START LISTENING IMMEDIATELY ---
  // This is the definitive fix for "Container failed to start".
  server = app.listen(PORT, '0.0.0.0', () => {
    loggerService.info(`Server listening on port ${PORT} at 0.0.0.0. Initializing services...`, { reloadedAt: new Date().toISOString() });
    initializeApp().catch(err => {
      console.error('❌ CRITICAL: initializeApp failed to start:', err);
    });
  });

  // --- WebSocket Initialization ---
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = (socket.handshake.auth.token || socket.handshake.headers['x-auth-token'] || socket.handshake.headers['token']) as string;
      if (!token) return next(new Error('Authentication failed: No token provided'));

      const jwtModule = await import('jsonwebtoken');
      const verify = (jwtModule.default?.verify || jwtModule.verify) as any;
      const secret = process.env.JWT_SECRET || 'temporary-secret-for-startup-safety';

      try {
        const decoded = verify(token, secret);
        if (!decoded || !decoded.id) return next(new Error('Authentication failed: Invalid token'));
        socket.data.userId = decoded.id;
        next();
      } catch (err) {
        return next(new Error('Authentication failed: Invalid token'));
      }
    } catch (err) {
      next(new Error('Authentication internal error'));
    }
  });

  // Initialize Whiteboard Socket Gateway (Dynamic load to avoid top-level crash)
  const initializeSockets = async () => {
    try {
      const { WhiteboardGateway } = await import('./modules/system/whiteboard/whiteboard.gateway');
      new WhiteboardGateway(io);
      loggerService.info('🎙️  Whiteboard Gateway initialized.');
    } catch (err: any) {
      loggerService.error('❌ Failed to initialize Whiteboard Gateway:', { error: err.message });
    }
  };

  initializeSockets();

  // Pass io to app if needed for other modules
  app.set('io', io);
}

// --- Async App Initialization ---
async function initializeApp() {
  try {
    // --- Startup Diagnostics ---
    const coreEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'REDIS_URL', 'CLIENT_URL'];
    loggerService.info('🔍 Environment Check:', {
      vars: coreEnvVars.reduce((acc, v) => ({ ...acc, [v]: process.env[v] ? 'Present' : 'MISSING' }), {}),
      nodeEnv: process.env.NODE_ENV,
      cwd: process.cwd()
    });

    if (!process.env.DATABASE_URL) {
      loggerService.warn('⚠️  CRITICAL: DATABASE_URL is not defined in environment!');
    }

    // Import middleware
    const { requestId } = await import('./middleware/request-id.middleware');
    const { sanitize } = await import('./middleware/validation.middleware');
    const { apiLimiter } = await import('./middleware/rate-limit.middleware');
    const { csrfProtection } = await import('./middleware/csrf.middleware');

    // --- Security Middleware ---
    app.use(requestId); // Add request ID to all requests

    // Recovery middleware: Return 503 while app is initializing
    app.use((req, res, next) => {
      const bypassPaths = ['/api/health', '/api/check', '/api/docs'];
      if (!isAppReady && req.path.startsWith('/api') && !bypassPaths.includes(req.path)) {
        return res.status(503).json({
          status: 503,
          message: 'Server is initializing, please try again in a few seconds.',
          retryAfter: 5
        });
      }
      next();
    });

    app.use((req, res, next) => { globalRequestCount++; next(); });
    const { metrics } = await import('./metrics');
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api/system/stats')) { metrics.requestsPerMinute++; }
      next();
    });

    // --- Security Middleware ---
    app.use(helmet()); // Enable all standard security headers

    // Strict CORS configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'https://thelab.tulie.vn', 'https://academy_tulie.vn'];

    app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }));

    app.use(compression()); // Gzip compression
    app.use(csrfProtection); // Custom header-based CSRF protection
    app.use('/api', apiLimiter); // Global rate limiting (only for /api routes)
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(cookieParser());
    // Global sanitization removed in favor of targeted validation (Audit P1)
    // app.use(sanitize()); 

    // Logging middleware with request ID
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[${req.id}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
        }
      });
      next();
    });

    // Custom Middleware to serve uploads from Local or Proxy R2
    app.use('/uploads', async (req, res, next) => {
      // Security: Prevent path traversal
      if (req.path.includes('..') || req.path.includes('//')) {
        console.warn(`[Security] Blocked potential path traversal: ${req.path}`);
        return res.status(403).json({ error: 'Security violation: Invalid path.' });
      }

      // 1. Try serving from local filesystem first
      const filePath = path.join(__dirname, '../uploads', req.path);

      if (require('fs').existsSync(filePath)) {
        return res.sendFile(filePath);
      }

      // 2. If missing, try proxying from R2
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[Proxy] File not found locally, trying R2: ${req.path}`);
        }

        // Remove leading slash for key
        const key = req.path.startsWith('/') ? req.path.slice(1) : req.path;

        // Lazy load storage service
        const { storageService } = await import('./services/storage.service');
        const fileStream = await storageService.getFileStream(key);

        if (fileStream) {
          // Determine content type
          const mime = (await import('mime-types')).default;
          const contentType = mime.lookup(key) || 'application/octet-stream';
          res.setHeader('Content-Type', contentType);
          // Pipe the stream to response
          // Type assertion for NodeJS helper
          (fileStream as any).pipe(res);
          return;
        }
      } catch (err) {
        console.warn(`[Proxy] Failed to proxy from R2: ${req.path}`, err);
      }

      // 3. Fallback to 404 handled by loop or next()
      next();
    });

    // --- Initialize Dependency Injection ---
    try {
      loggerService.info('📦 Initializing Dependency Injection...');
      const { bootstrapDI } = await import('./bootstrap');
      await bootstrapDI(); // Awaited now that it's async
      loggerService.info('✅ Dependency Injection initialized.');
    } catch (error: any) {
      loggerService.error('❌ DI Initialization Failed:', { error });
    }

    // Capture mounting errors
    const mountingErrors: any[] = [];

    // --- Mount Routes ---
    console.log('🛣️  Mounting routes...');
    try {
      const routes = [
        { path: '/api/auth', module: './modules/system/auth/auth.routes' },
        { path: '/api/users', module: './modules/system/users/users.routes' },
        { path: '/api/courses', module: './modules/lms/courses/courses.routes' },
        { path: '/api/payments', module: './modules/shop/payments/payments.routes' },
        { path: '/api/cms', module: './modules/info/cms/cms.routes' },
        { path: '/api/instructors', module: './modules/lms/instructors/instructors.routes' },
        { path: '/api/uploads', module: './modules/system/uploads/uploads.routes' },
        { path: '/api/blog', module: './modules/info/blog/blog.routes' },
        { path: '/api/notifications', module: './modules/system/notifications/notifications.routes' },
        // ... other routes
        { path: '/api/categories', module: './modules/lms/categories/categories.routes' },
        { path: '/api/bundles', module: './modules/shop/bundles/bundles.routes' },
        { path: '/api/coupons', module: './modules/shop/coupons/coupons.routes' },
        { path: '/api/contact', module: './modules/info/contact/contact.routes' },
        { path: '/api/settings', module: './modules/system/settings/settings.routes' },
        { path: '/api/security', module: './modules/system/security/security.routes' },
        { path: '/api/activity', module: './modules/lms/activity/activity.routes' },
        { path: '/api/proxy', module: './modules/system/proxy/proxy.routes' },
        { path: '/api/landing-pages', module: './modules/info/landing-pages/landing-pages.routes' },
        { path: '/api/system', module: './modules/system/system/system.routes' },
        { path: '/api/activation-codes', module: './modules/shop/activation-codes/activation-codes.routes' },
        { path: '/api/products', module: './modules/shop/products/products.routes' },
        { path: '/api/pricing-addons', module: './modules/shop/pricing-addons/pricing-addons.routes' },
        { path: '/api/events', module: './modules/lms/events/events.routes' },
        { path: '/api/crm', module: './modules/system/crm/crm.routes' },
        { path: '/api/admin/lms/analytics', module: './modules/lms/analytics/analytics.routes' },
        { path: '/api/mentoring', module: './modules/lms/mentoring/mentoring.routes' },
        { path: '/api/whiteboards', module: './modules/system/whiteboard/whiteboard.routes' },
        { path: '/api/short-links', module: './modules/system/short-link/short-link.routes' },
        { path: '/api/facebook', module: './modules/system/facebook/facebook.routes' },
        { path: '/api', module: './modules/lms/journeys/journey.routes' }
      ];

      console.log(`🛣️  Mounting ${routes.length} route modules...`);
      for (const route of routes) {
        try {
          // Use dynamic import to catch errors per module
          const routeModule = (await import(route.module)).default;
          if (!routeModule) {
            throw new Error(`Module ${route.module} has no default export`);
          }
          app.use(route.path, routeModule);
          if (process.env.NODE_ENV !== 'production') {
            console.log(`   - Mounted ${route.path}`);
          }
        } catch (err: any) {
          console.error(`❌ ERROR mounting ${route.path} (${route.module}):`, err.message);
          mountingErrors.push({ path: route.path, module: route.module, error: err.message });
        }
      }

      // JSON 404 Handler - MUST be after all routes
      app.use('/api', (req, res) => {
        console.warn(`[404] Route not found: ${req.method} ${req.originalUrl}`);
        res.status(404).json({
          message: 'Endpoint not found',
          error: 'Endpoint not found',
          method: req.method,
          path: req.originalUrl
        });
      });

      console.log('✅ All possible routes mounted.');
    } catch (error: any) {
      console.error('❌ Fatal error during route mounting:', error);
    }

    // Global Error Handler - MUST be last
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const isProd = process.env.NODE_ENV === 'production';
      const reqId = (req as any).id;

      loggerService.error(`[Global Error] ${req.method} ${req.path}`, {
        requestId: reqId,
        status,
        error: err.message,
        stack: err.stack
      });

      res.status(status).json({
        message: (status >= 500 && isProd) ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
        error: (status >= 500 && isProd) ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
        status,
        requestId: reqId
      });
    });

    console.log('🏁 Initialization sequence complete.');
    // Initialize Core DB
    try {
      const prismaModule = await import('./config/prisma');
      prisma = prismaModule.prisma || prismaModule.default;
      loggerService.info('🐘 Database Client initialized.');

      // --- FAIL-SAFE: Database Schema Synchronization ---
      // This ensures the Whiteboard enum is updated even if migrations fail
      const syncDB = async () => {
        try {
          // 1. Identify which tables/columns still use the old type
          const oldColumns: any[] = await prisma.$queryRawUnsafe(`
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE udt_name = 'WhiteboardStatus_old'
            AND table_schema = 'public'
          `);

          if (oldColumns && oldColumns.length > 0) {
            loggerService.info(`🔄 DB SYNC: Found ${oldColumns.length} columns using legacy WhiteboardStatus_old. Converting...`);

            // Ensure the new type exists
            const typeExists: any[] = await prisma.$queryRawUnsafe(`
              SELECT 1 FROM pg_type WHERE typname = 'WhiteboardStatus'
            `);
            if (!typeExists || typeExists.length === 0) {
              await prisma.$executeRawUnsafe(`CREATE TYPE "WhiteboardStatus" AS ENUM ('PUBLIC', 'PRIVATE')`);
            }

            for (const col of oldColumns) {
              const table = col.table_name;
              const column = col.column_name;

              loggerService.info(`   - Converting "${table}"."${column}" to new WhiteboardStatus...`);

              await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ALTER COLUMN "${column}" DROP DEFAULT`);
              await prisma.$executeRawUnsafe(`
                  ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE "WhiteboardStatus" USING 
                    CASE 
                      WHEN "${column}"::text = 'PUBLISHED' THEN 'PUBLIC'::"WhiteboardStatus"
                      ELSE 'PRIVATE'::"WhiteboardStatus"
                    END
                `);
              await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ALTER COLUMN "${column}" SET DEFAULT 'PRIVATE'`);
            }

            await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "WhiteboardStatus_old"`);
            loggerService.info('✅ DB SYNC: Column conversion complete.');
          } else {
            // Also check if legacy labels exist in the current type
            const draftExists: any[] = await prisma.$queryRawUnsafe(`
              SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid 
              WHERE t.typname = 'WhiteboardStatus' AND e.enumlabel = 'DRAFT'
            `);

            if (draftExists && draftExists.length > 0) {
              loggerService.info('🔄 DB SYNC: Found legacy DRAFT label, performing transition...');
              await prisma.$executeRawUnsafe(`ALTER TYPE "WhiteboardStatus" RENAME TO "WhiteboardStatus_old"`);
              await syncDB(); // Recurse to handle the renamed type
              return;
            }
          }

          // 2. Unblock Prisma Migrations
          await prisma.$executeRawUnsafe(`DELETE FROM "_prisma_migrations" WHERE status = 'failed'`);

        } catch (syncErr: any) {
          loggerService.warn('⚠️ DB SYNC Warning:', { error: syncErr.message });
        }
      };
      await syncDB();
    } catch (dbErr: any) {
      console.error('❌ Failed to initialize Prisma Client:', dbErr.message);
      startupError = `Prisma Init Failed: ${dbErr.message}`;
    }

    isAppReady = true;
    loggerService.info('🚀 SYSTEM READY');
  } catch (error: any) {
    console.error('❌ Fatal error during app initialization:', error);
    startupError = `Fatal Init Error: ${(error as Error).message}`;
  }
}

// Export for testing
export { app, server };
