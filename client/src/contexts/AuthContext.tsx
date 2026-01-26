'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
    id: string;
    email: string;
    name: string | null;
    role: 'USER' | 'ADMIN';
    avatar?: string | null;
    subscriptions?: Array<{
        status: string;
        endDate: string;
    }>;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    verifyGoogleToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            // Try to get user from API
            try {
                // Check if we have a probable session first
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

                if (!token) {
                    // No token, don't even try to fetch me
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                const response = await api.auth.getMe() as any;
                const userData = response?.user || response?.data?.user || response?.data;

                if (userData && userData.id) {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    // Invalid response pattern
                    throw new Error('Invalid user data');
                }
            } catch (error: any) {
                // Only clear session if explicitly 401 or Auth token invalid
                if (error?.status === 401 || error?.message?.includes('Not authenticated')) {
                    console.log('Session expired or invalid');
                    setUser(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                } else {
                    console.warn('Network/Server error during auth check, falling back to local storage:', error);
                    // Attempt to restore from local storage if API failed
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        try {
                            setUser(JSON.parse(storedUser));
                        } catch (e) {
                            // corrupted data
                            setUser(null);
                        }
                    } else {
                        // checking failed and no local data
                        setUser(null);
                    }
                }
            }
        } catch (error) {
            console.error('Unhandled auth error:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.auth.login({ email, password }) as any;
        // API returns { user: {...}, token: "..." } directly
        const userData = response?.user || response?.data?.user;
        const token = response?.token || response?.data?.token;

        if (userData && userData.id) {
            setUser(userData);
            if (token) localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            throw new Error(response?.message || 'Login failed');
        }
    };

    const logout = async () => {
        try {
            await api.auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const verifyGoogleToken = async (token: string) => {
        const response = await api.auth.verifyGoogleToken(token) as any;
        const userData = response?.user || response?.data?.user;
        const ownToken = response?.token || response?.data?.token;

        if (userData && userData.id) {
            setUser(userData);
            if (ownToken) localStorage.setItem('token', ownToken);
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            throw new Error(response?.message || 'Google verification failed');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'ADMIN',
                login,
                logout,
                refreshUser,
                verifyGoogleToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
