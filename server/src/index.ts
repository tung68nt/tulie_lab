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

dotenv.config(); // Load .env from current working directory (server/)

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use('/api', limiter); // Apply rate limiting to API routes
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [process.env.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback for development if needed, originally: callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import courseRoutes from './modules/courses/courses.routes';
import paymentRoutes from './modules/payments/payments.routes';
import cmsRoutes from './modules/cms/cms.routes';
import instructorRoutes from './modules/instructors/instructors.routes';
// import promoCodeRoutes from './modules/promo-codes/promo-codes.routes'; // Temporarily disabled - replaced by Coupon
import uploadRoutes from './modules/uploads/uploads.routes';
import blogRoutes from './modules/blog/blog.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import categoryRoutes from './modules/categories/categories.routes';
import bundleRoutes from './modules/bundles/bundles.routes';
import couponRoutes from './modules/coupons/coupons.routes';
import contactRoutes from './modules/contact/contact.routes';
import settingsRoutes from './modules/settings/settings.routes';
import securityRoutes from './modules/security/security.routes';
import activityRoutes from './modules/activity/activity.routes';
import proxyRoutes from './modules/proxy/proxy.routes';

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

// Start Server
// Force restart for bundle routes
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Trigger restart for Schema update
