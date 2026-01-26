import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

dotenv.config({ path: path.join(__dirname, '../.env') }); // Load .env from server root

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy is required for Cloud Run to see the real user IP
app.set('trust proxy', true);

// --- CRITICAL: Register health check FIRST, before any blocking operations ---
// This ensures Cloud Run's health check always passes.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: 'v1.0.6-security-enhancements', timestamp: new Date().toISOString() });
});

app.get('/api/check', (req, res) => {
  res.json({ message: 'Deployment Success', version: 'v1.0.6-security-enhancements', time: new Date().toISOString() });
});

// --- START LISTENING IMMEDIATELY ---
// This is the definitive fix for "Container failed to start".
// We bind to the port first, then initialize heavy dependencies asynchronously.
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}. Initializing services... [Reloaded: ${new Date().toISOString()}]`);
  initializeApp();
});

// --- Async App Initialization ---
async function initializeApp() {
  try {
    // Import middleware
    const { requestId } = await import('./middleware/request-id.middleware');
    const { sanitize } = await import('./middleware/validation.middleware');
    const { apiLimiter } = await import('./middleware/rate-limit.middleware');

    // Global Request Tracking
    let globalRequestCount = 0;
    setInterval(() => { globalRequestCount = 0; }, 60000);

    // Middleware order is important!
    app.use(requestId); // Add request ID to all requests
    app.use((req, res, next) => { globalRequestCount++; next(); });
    const { metrics } = await import('./metrics');
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api/system/stats')) { metrics.requestsPerMinute++; }
      next();
    });

    app.use(helmet()); // Security headers
    app.use('/api', apiLimiter); // Global rate limiting (only for /api routes)
    app.use(cors({
      origin: (origin, callback) => {
        if (!origin) { callback(null, true); return; }
        const cleanOrigin = origin.replace(/\/$/, '');
        const allowed = [
          process.env.CLIENT_URL,
          'https://academy.tulie.vn',
          'https://www.academy.tulie.vn',
          'https://thelab.tulie.vn',
          'https://www.thelab.tulie.vn',
          'https://beta.thelab.tulie.vn',
          'https://academy-web-863772349164.asia-southeast1.run.app',
          'https://academy-web-beta-863772349164.asia-southeast1.run.app',
          'https://academy-api-863772349164.asia-southeast1.run.app',
          'https://academy-api-beta-863772349164.asia-southeast1.run.app',
          'https://the-tulie-lab.vercel.app',
          'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003',
          'http://127.0.0.1:3000'
        ].filter((o): o is string => !!o).map(o => o.replace(/\/$/, ''));
        if (allowed.includes(cleanOrigin) || cleanOrigin.endsWith('.run.app') || cleanOrigin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          console.warn(`[CORS] Blocked request from origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(sanitize); // Sanitize input to prevent XSS

    // Logging middleware with request ID
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.id}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
      });
      next();
    });

    // Custom Middleware to serve uploads from Local or Proxy R2
    app.use('/uploads', async (req, res, next) => {
      // 1. Try serving from local filesystem first
      const filePath = path.join(__dirname, '../uploads', req.path);

      if (require('fs').existsSync(filePath)) {
        return res.sendFile(filePath);
      }

      // 2. If missing, try proxying from R2
      try {
        console.log(`[Proxy] File not found locally, trying R2: ${req.path}`);

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
      // If we call next(), it goes to the next middleware which might be 404 handler
      // But express.static usually terminates. Here we want to terminate with 404 if R2 fails?
      // Or let global 404 handle it.
      next();
    });

    // --- Initialize Dependency Injection ---
    try {
      console.log('📦 Initializing Dependency Injection...');
      const { bootstrapDI } = await import('./bootstrap');
      bootstrapDI();
      console.log('✅ Dependency Injection initialized.');
    } catch (error: any) {
      console.error('❌ DI Initialization Failed:', error);
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
        { path: '/api/events', module: './modules/lms/events/events.routes' },
        { path: '/api/crm', module: './modules/system/crm/crm.routes' }
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

      // Basic Diagnostic Endpoint
      app.get('/api/diag', async (req, res) => {
        let dbStatus = 'checking...';
        let mediaModelStatus = 'unknown';
        try {
          const prisma = (await import('./config/prisma')).default;
          await prisma.$queryRaw`SELECT 1`;
          dbStatus = 'connected';
          // @ts-ignore
          mediaModelStatus = prisma.media ? 'exists' : 'missing';
        } catch (error: any) {
          dbStatus = `error: ${error.message}`;
        }
        res.json({
          status: 'online',
          database: dbStatus,
          mediaModel: mediaModelStatus,
          mountingErrors: mountingErrors,
          timestamp: new Date().toISOString(),
          env: process.env.NODE_ENV,
          version: 'v1.0.9-debug-mount'
        });
      });

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
      console.error('[Global Error]', err);
      const status = err.status || err.statusCode || 500;
      res.status(status).json({
        message: err.message || 'Internal Server Error',
        error: err.message || 'Internal Server Error',
        status
      });
    });

    console.log('🏁 Initialization sequence complete.');
  } catch (error: any) {
    console.error('❌ Fatal error during app initialization:', error);
  }
}

// Export for testing
export { app, server };
