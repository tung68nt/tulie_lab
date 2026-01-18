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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            // Try to get user from API (checks both Cookie and Headers)
            try {
                const response = await api.auth.getMe() as any;
                // API returns { user: {...} } directly
                const userData = response?.user || response?.data?.user || response?.data;

                if (userData && userData.id) {
                    setUser(userData);
                    // If we recovered session via cookie but lost local token, restore it if possible (API doesn't return token on getMe usually though)
                } else {
                    setUser(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                // Only clear if actually failed
                // console.log('Not authenticated');
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.log('Not authenticated');
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
