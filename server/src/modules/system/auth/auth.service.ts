import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, Prisma } from '@prisma/client';
import { IUserRepository } from '../users/interfaces/user.repository.interface';
import axios from 'axios';

const SALT_ROUNDS = 10;
if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL: JWT_SECRET is not defined. Authentication will fail.');
}
const JWT_SECRET = process.env.JWT_SECRET || 'temporary-secret-for-startup-safety';

export class AuthService {
    constructor(
        private userRepository: IUserRepository,
        private emailService?: any
    ) { }

    private async getAuthenticatedUserResponse(user: any) {
        const fullUser = await this.userRepository.findById(user.id, {
            profile: true,
            subscriptions: {
                include: {
                    product: true
                }
            }
        });

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

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

        return this.getAuthenticatedUserResponse(user);
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

        return this.getAuthenticatedUserResponse(user);
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
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId) throw new Error('GOOGLE_CLIENT_ID is not defined');

        const redirectUri = `${process.env.CLIENT_URL}/auth/callback`;
        const scope = encodeURIComponent('openid email profile');
        const state = jwt.sign({ ts: Date.now() }, JWT_SECRET, { expiresIn: '10m' });

        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;

        return { url };
    }

    async verifyGoogleCode(code: string) {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        if (!clientId || !clientSecret) throw new Error('Google OAuth configuration missing');

        const redirectUri = `${process.env.CLIENT_URL}/auth/callback`;

        try {
            // 1. Exchange authorization code for tokens
            const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            });

            const { access_token } = tokenResponse.data;
            if (!access_token) {
                throw new Error('Failed to get access token from Google');
            }

            // 2. Get user info from Google
            const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            const googleUser = userInfoResponse.data;
            if (!googleUser || !googleUser.email) {
                throw new Error('Failed to get user data from Google');
            }

            // 3. Sync with Prisma database
            let user = await this.userRepository.findByEmail(googleUser.email);

            if (!user) {
                // Create user if not exists
                const randomPassword = Math.random().toString(36).slice(-10);
                const hashedPassword = await bcrypt.hash(randomPassword, SALT_ROUNDS);

                user = await this.userRepository.create({
                    email: googleUser.email,
                    password: hashedPassword,
                    role: Role.USER,
                    profile: {
                        create: {
                            name: googleUser.name || googleUser.email.split('@')[0],
                            avatar: googleUser.picture || null
                        }
                    }
                });
            }

            return this.getAuthenticatedUserResponse(user);

        } catch (error: any) {
            console.error('Google OAuth error:', error.response?.data || error.message);
            throw new Error('Google authentication failed');
        }
    }

    // Keep backward compatibility - alias for the old method name
    async verifyGoogleToken(tokenOrCode: string) {
        return this.verifyGoogleCode(tokenOrCode);
    }
}
