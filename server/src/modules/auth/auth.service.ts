import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '@prisma/client';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

/* 
 * Service for handling User Authentication
 * - Register: Hashes password, creates user
 * - Login: Verifies password, signs JWT
 */

export const register = async (email: string, password: string, name: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: Role.USER // Default role
        }
    });

    // Send welcome email (non-blocking)
    try {
        const { emailService } = await import('../../services/email.service');
        emailService.sendWelcomeEmail(email, name);
    } catch (error) {
        console.log('Welcome email skipped (SMTP not configured)');
    }

    return { id: user.id, email: user.email, name: user.name, role: user.role };
};

export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('User not found:', email); // DEBUG
        throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        console.log('Invalid password for:', email); // DEBUG
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token
    };
};

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) return null;

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// Password Reset Functions
export const sendPasswordResetEmail = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    // Don't reveal if user exists
    if (!user) {
        console.log('Password reset requested for non-existent email:', email);
        return;
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
        { userId: user.id, type: 'password_reset' },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Try to send email (if SMTP is configured)
    try {
        const { emailService } = await import('../../services/email.service');
        await emailService.sendPasswordResetEmail(email, resetToken, user.name || undefined);
    } catch (error) {
        console.log('Email service not available, reset token:', resetToken);
        // In development, log the token for testing
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Reset link: ${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);
        }
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };

        if (decoded.type !== 'password_reset') {
            throw new Error('Invalid token type');
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await prisma.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword }
        });

        return { success: true };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Reset token has expired');
        }
        throw new Error('Invalid reset token');
    }
};
