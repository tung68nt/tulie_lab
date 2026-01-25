import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { IUserRepository } from '../users/interfaces/user.repository.interface';

const SALT_ROUNDS = 10;
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET is not defined in environment variables.');
}
const JWT_SECRET = process.env.JWT_SECRET;

export class AuthService {
    constructor(
        private userRepository: IUserRepository,
        private emailService?: any
    ) { }

    async register(email: string, password: string, name: string) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await this.userRepository.create({
            email,
            password: hashedPassword,
            role: Role.USER,
            profile: {
                create: { name }
            }
        });

        // Send welcome email
        if (this.emailService) {
            try {
                await this.emailService.sendWelcomeEmail(email, name);
            } catch (error) {
                console.log('Welcome email skipped');
            }
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            user: { id: user.id, email: user.email, name: (user as any).profile?.name, role: user.role },
            token
        };
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            user: { id: user.id, email: user.email, name: (user as any).profile?.name, role: user.role },
            token
        };
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findById(id, {
            profile: true,
            subscriptions: {
                include: {
                    product: true
                }
            }
        });
        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async sendPasswordResetEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) return; // Silent fail

        const resetToken = jwt.sign(
            { userId: user.id, type: 'password_reset' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        if (this.emailService) {
            try {
                await this.emailService.sendPasswordResetEmail(email, resetToken, (user as any).profile?.name || undefined);
            } catch (error) {
                console.log('Email service not available');
            }
        }
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
            if (decoded.type !== 'password_reset') {
                throw new Error('Invalid token type');
            }

            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            await this.userRepository.update(decoded.userId, { password: hashedPassword });

            return { success: true };
        } catch (error: any) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Reset token has expired');
            }
            throw new Error('Invalid reset token');
        }
    }
}
