import { z } from 'zod';

const envSchema = z.object({
    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000'),

    // Database (required)
    DATABASE_URL: z.string().url().min(1, 'DATABASE_URL is required'),
    DIRECT_URL: z.string().url().optional(),

    // Auth (required)
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),

    // CORS
    CLIENT_URL: z.string().url().default('http://localhost:3000'),

    // Redis (optional)
    REDIS_URL: z.string().url().optional(),

    // R2 Storage (optional)
    R2_ACCOUNT_ID: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_BUCKET_NAME: z.string().optional(),
    R2_PUBLIC_DOMAIN: z.string().optional(),

    // Email (optional)
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().email().optional(),

    // Payment (optional)
    SEPAY_API_KEY: z.string().optional(),
    SEPAY_SECRET_KEY: z.string().optional(),

    // Supabase Auth (optional)
    SUPABASE_URL: z.string().url().or(z.literal('')).optional(),
    SUPABASE_ANON_KEY: z.string().optional(),

    // AI Proxy (optional)
    ANTHROPIC_BASE_URL: z.string().url().or(z.literal('')).optional(),
    ANTHROPIC_MODEL: z.string().optional(),
    ANTHROPIC_AUTH_TOKEN: z.string().optional(),

    // Logging
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
    try {
        const env = envSchema.parse(process.env);
        console.log('✅ Environment variables validated successfully');
        return env;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Environment variable validation failed:');
            error.issues.forEach((err: z.ZodIssue) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
}

// Export validated env
export const env = validateEnv();
