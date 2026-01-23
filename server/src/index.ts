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
  console.log(`Server listening on port ${PORT}. Initializing services...`);
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

    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // --- Initialize Dependency Injection (Heavy) ---
    console.log('Initializing Dependency Injection...');
    const { bootstrapDI } = await import('./bootstrap');
    bootstrapDI();
    console.log('Dependency Injection initialized.');

    // --- Mount Routes (After DI) ---
    const authRoutes = (await import('./modules/system/auth/auth.routes')).default;
    const userRoutes = (await import('./modules/system/users/users.routes')).default;
    const courseRoutes = (await import('./modules/lms/courses/courses.routes')).default;
    const paymentRoutes = (await import('./modules/shop/payments/payments.routes')).default;
    const cmsRoutes = (await import('./modules/info/cms/cms.routes')).default;
    const instructorRoutes = (await import('./modules/lms/instructors/instructors.routes')).default;
    const uploadRoutes = (await import('./modules/system/uploads/uploads.routes')).default;
    const blogRoutes = (await import('./modules/info/blog/blog.routes')).default;
    const notificationRoutes = (await import('./modules/system/notifications/notifications.routes')).default;
    const categoryRoutes = (await import('./modules/lms/categories/categories.routes')).default;
    const bundleRoutes = (await import('./modules/shop/bundles/bundles.routes')).default;
    const couponRoutes = (await import('./modules/shop/coupons/coupons.routes')).default;
    const contactRoutes = (await import('./modules/info/contact/contact.routes')).default;
    const settingsRoutes = (await import('./modules/system/settings/settings.routes')).default;
    const securityRoutes = (await import('./modules/system/security/security.routes')).default;
    const activityRoutes = (await import('./modules/lms/activity/activity.routes')).default;
    const proxyRoutes = (await import('./modules/system/proxy/proxy.routes')).default;
    const landingPageRoutes = (await import('./modules/info/landing-pages/landing-pages.routes')).default;
    const systemRoutes = (await import('./modules/system/system/system.routes')).default;
    const activationCodeRoutes = (await import('./modules/shop/activation-codes/activation-codes.routes')).default;
    const productRoutes = (await import('./modules/shop/products/products.routes')).default;
    const eventRoutes = (await import('./modules/lms/events/events.routes')).default;

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/cms', cmsRoutes);
    app.use('/api/instructors', instructorRoutes);
    app.use('/api/uploads', uploadRoutes);
    app.use('/api/blog', blogRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/bundles', bundleRoutes);
    app.use('/api/coupons', couponRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/api/security', securityRoutes);
    app.use('/api/activity', activityRoutes);
    app.use('/api/proxy', proxyRoutes);
    app.use('/api/landing-pages', landingPageRoutes);
    app.use('/api/system', systemRoutes);
    app.use('/api/activation-codes', activationCodeRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/events', eventRoutes);

    // Basic Diagnostic Endpoint (safe to keep)
    app.get('/api/diag', async (req, res) => {
      let dbStatus = 'checking...';
      try {
        const prisma = (await import('./config/prisma')).default;
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
      } catch (error: any) {
        dbStatus = `error: ${error.message}`;
      }
      res.json({
        status: 'online', database: dbStatus, timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
      });
    });

    // NOTE: Dangerous debug endpoints removed for security:
    // - /api/diag/schema - Lists DB columns
    // - /api/diag/update-test/:id - Modifies data
    // - /api/diag/fix-schema - DANGEROUS: Runs ALTER TABLE

    // JSON 404 Handler - MUST be after all routes
    app.use('/api', (req, res) => {
      console.warn(`[404] Route not found: ${req.method} ${req.originalUrl}`);
      res.status(404).json({ error: 'Endpoint not found', method: req.method, path: req.originalUrl });
    });

    // Global Error Handler - MUST be last
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('[Global Error]', err);
      const status = err.status || err.statusCode || 500;
      res.status(status).json({ error: err.message || 'Internal Server Error', status });
    });

    console.log('✅ All routes and services initialized successfully.');

  } catch (error) {
    console.error('❌ Fatal error during app initialization:', error);
    // Optionally, could shut down server here, but for resilience, keep health check alive.
  }
}

// Export for testing
export { app, server };
