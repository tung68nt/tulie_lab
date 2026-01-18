
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success?: boolean;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role?: 'user' | 'admin' | 'instructor';
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
}

export interface Instructor {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
    bio?: string;
    studentCount?: number;
    courseCount?: number;
    experiences?: Array<{
        id: string;
        company: string;
        position: string;
        period?: string;
        icon?: string;
    }>;
    [key: string]: unknown;
}

export interface Course {
    id: string;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    lessons?: Lesson[];
    instructor?: Instructor;
    [key: string]: unknown;
}

export interface Lesson {
    id: string;
    title: string;
    content?: string;
    duration?: number;
    isCompleted?: boolean;
    [key: string]: unknown;
}

export interface Order {
    id: string;
    code: string;
    total: number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    items?: unknown[];
    user?: User;
    [key: string]: unknown;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    [key: string]: unknown;
}

export interface SearchParams {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: unknown;
}
