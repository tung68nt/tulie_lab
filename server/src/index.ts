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
import { WhiteboardGateway } from './modules/system/whiteboard/whiteboard.gateway';
import { prisma } from './config/prisma';
import redisService from './services/redis.service';

// Set timezone to Vietnam (UTC+7) for consistent date/time display
process.env.TZ = 'Asia/Ho_Chi_Minh';

dotenv.config({ path: path.join(__dirname, '../.env') }); // Load .env from server root

const app = express();

// Trust Cloud Run's proxy (GFE)
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5001;

let isAppReady = false;

// --- CRITICAL: Register health check FIRST, before any blocking operations ---
// This ensures Cloud Run's health check always passes.
app.get('/api/health', async (req, res) => {
  const health: any = {
    status: isAppReady ? 'ok' : 'initializing',
    version: 'v1.1.2-audit-v1',
    timestamp: new Date().toISOString(),
    checks: {
      uptime: process.uptime(),
      readiness: isAppReady
    }
  };

  try {
    // 1. Check Database (Prisma)
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'connected';
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

// Swagger documentation route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- WebSocket & Services Initialization ---
let server: any;
if (process.env.NODE_ENV !== 'test') {
  // --- START LISTENING IMMEDIATELY ---
  // This is the definitive fix for "Container failed to start".
  server = app.listen(PORT, () => {
    loggerService.info(`Server listening on port ${PORT}. Initializing services...`, { reloadedAt: new Date().toISOString() });
    initializeApp();
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

  // Initialize Whiteboard Socket Gateway
  new WhiteboardGateway(io);

  // Pass io to app if needed for other modules
  app.set('io', io);
}

// --- Async App Initialization ---
async function initializeApp() {
  try {
    // Import middleware
    const { requestId } = await import('./middleware/request-id.middleware');
    const { sanitize } = await import('./middleware/validation.middleware');
    const { apiLimiter } = await import('./middleware/rate-limit.middleware');
    const { csrfProtection } = await import('./middleware/csrf.middleware');

    // Global Request Tracking
    let globalRequestCount = 0;
    setInterval(() => { globalRequestCount = 0; }, 60000);

    // Middleware order is important!
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
    app.use(express.json());
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
        { path: '/api', module: './modules/lms/journeys/journey.routes' }
      ];

      for (const route of routes) {
        try {
          const routeModule = (await import(route.module)).default;
          app.use(route.path, routeModule);
          console.log(`   - Mounted ${route.path}`);
        } catch (err: any) {
          console.error(`❌ Failed to mount ${route.path}:`, err.message);
          mountingErrors.push({ path: route.path, error: err.message, stack: err.stack });
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
    isAppReady = true;
  } catch (error: any) {
    console.error('❌ Fatal error during app initialization:', error);
  }
}

// Export for testing
export { app, server };
