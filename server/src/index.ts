import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per IP
  message: 'Too many requests from this IP, please try again later'
});

dotenv.config({ path: path.join(__dirname, '../.env') }); // Load .env from server root

import { bootstrapDI } from './bootstrap';

// Initialize Dependency Injection
bootstrapDI();

const app = express();
const PORT = process.env.PORT || 5001;

// Global Request Tracking
export let globalRequestCount = 0;
// Reset count every minute to get simplified RPM
setInterval(() => {
  globalRequestCount = 0;
}, 60000);

// Middleware
app.use((req, res, next) => {
  globalRequestCount++;
  next();
});
// Middleware
import { metrics } from './metrics';
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/system/stats')) { // Don't count stats polling itself
    metrics.requestsPerMinute++;
  }
  next();
});

app.use(helmet());
app.use('/api', limiter); // Apply rate limiting to API routes
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL,
      // Production Domains
      'https://thelab.tulie.vn',
      'https://www.thelab.tulie.vn',
      'https://beta.thelab.tulie.vn',
      'https://the-tulie-lab.vercel.app',
      // Development Domains
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://127.0.0.1:3000'
    ].filter((origin): origin is string => !!origin); // Type-safe filter

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowed.includes(origin)) {
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
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
import authRoutes from './modules/system/auth/auth.routes';
import userRoutes from './modules/system/users/users.routes';
import courseRoutes from './modules/lms/courses/courses.routes';
import paymentRoutes from './modules/shop/payments/payments.routes';
import cmsRoutes from './modules/info/cms/cms.routes';
import instructorRoutes from './modules/lms/instructors/instructors.routes';
// import promoCodeRoutes from './modules/promo-codes/promo-codes.routes'; // Temporarily disabled - replaced by Coupon
import uploadRoutes from './modules/system/uploads/uploads.routes';
import blogRoutes from './modules/info/blog/blog.routes';
import notificationRoutes from './modules/system/notifications/notifications.routes';
import categoryRoutes from './modules/lms/categories/categories.routes';
import bundleRoutes from './modules/shop/bundles/bundles.routes';
import couponRoutes from './modules/shop/coupons/coupons.routes';
import contactRoutes from './modules/info/contact/contact.routes';
import settingsRoutes from './modules/system/settings/settings.routes';
import securityRoutes from './modules/system/security/security.routes';
import activityRoutes from './modules/lms/activity/activity.routes';
import proxyRoutes from './modules/system/proxy/proxy.routes';

// Health check endpoint (for Cloud Run)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes
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
import landingPageRoutes from './modules/info/landing-pages/landing-pages.routes';
app.use('/api/landing-pages', landingPageRoutes);
import systemRoutes from './modules/system/system/system.routes';
app.use('/api/system', systemRoutes);
import activationCodeRoutes from './modules/shop/activation-codes/activation-codes.routes';
app.use('/api/activation-codes', activationCodeRoutes);

import productRoutes from './modules/shop/products/products.routes';
app.use('/api/products', productRoutes);

// Start Server
// Force restart for bundle routes
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Trigger restart for Schema update - Timestamp: 5678
