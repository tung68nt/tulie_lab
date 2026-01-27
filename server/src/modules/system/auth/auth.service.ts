import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, Prisma } from '@prisma/client';
import { IUserRepository } from '../users/interfaces/user.repository.interface';
import axios from 'axios';

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

        const fullUser = await this.userRepository.findById(user.id, {
            profile: true,
            subscriptions: {
                include: {
                    product: true
                }
            }
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: (fullUser as any)?.profile?.name,
                role: user.role,
                subscriptions: (fullUser as any)?.subscriptions
            },
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

        const fullUser = await this.userRepository.findById(user.id, {
            profile: true,
            subscriptions: {
                include: {
                    product: true
                }
            }
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: (fullUser as any)?.profile?.name,
                role: user.role,
                subscriptions: (fullUser as any)?.subscriptions
            },
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

    async getGoogleAuthUrl() {
        const supabaseUrl = process.env.SUPABASE_URL;
        if (!supabaseUrl) throw new Error('SUPABASE_URL is not defined');

        // This is the URL to trigger Supabase OAuth redirect to Google
        // Frontend will then receive code/token and send back to us to verify
        const url = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${process.env.CLIENT_URL}/auth/callback`;
        return { url };
    }

    async verifyGoogleToken(token: string) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error('Supabase configuration missing');

        try {
            // 1. Verify token with Supabase GET /auth/v1/user
            const response = await axios.get(`${supabaseUrl}/auth/v1/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'apikey': supabaseKey
                }
            });

            const supabaseUser = response.data;
            if (!supabaseUser || !supabaseUser.email) {
                throw new Error('Failed to get user data from Supabase');
            }

            // 2. Sync with Prisma
            let user = await this.userRepository.findByEmail(supabaseUser.email);

            if (!user) {
                // Create user if not exists
                const randomPassword = Math.random().toString(36).slice(-10);
                const hashedPassword = await bcrypt.hash(randomPassword, SALT_ROUNDS);

                user = await this.userRepository.create({
                    email: supabaseUser.email,
                    password: hashedPassword,
                    role: Role.USER,
                    profile: {
                        create: {
                            name: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
                            avatar: supabaseUser.user_metadata?.avatar_url || null
                        }
                    }
                });
            }

            // 3. Issue our own JWT
            const ownToken = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            const fullUser = await this.userRepository.findById(user.id, {
                profile: true,
                subscriptions: {
                    include: {
                        product: true
                    }
                }
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: (fullUser as any)?.profile?.name,
                    role: user.role,
                    subscriptions: (fullUser as any)?.subscriptions
                },
                token: ownToken
            };

        } catch (error: any) {
            console.error('Supabase verification error:', error.response?.data || error.message);
            throw new Error('Google authentication failed');
        }
    }
}
