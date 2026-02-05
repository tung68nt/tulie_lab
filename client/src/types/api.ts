
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
    slug?: string;
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
        description?: string;
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
    compareAtPrice?: number;
    releaseDate?: string;
    lessons?: Lesson[];
    instructor?: Instructor;
    lessonsCount?: number;
    level?: string;
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
    status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'PAID' | 'COMPLETED';
    items?: unknown[];
    user?: User;
    products?: Product[];
    [key: string]: unknown;
}

export interface Product {
    id: string;
    title: string;
    slug: string;
    price: number | string;
    compareAtPrice?: number | string;
    type: string;
    field: string;
    thumbnail?: string;
    description?: string;
    [key: string]: unknown;
}

export interface Bundle {
    id: string;
    name: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    price: number;
    salePrice?: number;
    originalPrice?: number;
    discountPercent?: number;
    isActive: boolean;
    courses?: Array<{
        courseId: string;
        course: Course;
    }>;
    startDate?: string;
    endDate?: string;
    [key: string]: unknown;
}

export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    thumbnail?: string;
    category?: string;
    author?: string;
    createdAt?: string;
    [key: string]: unknown;
}

export interface Event {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    type?: string;
    link?: string;
    isActive?: boolean;
    createdAt?: string;
    [key: string]: unknown;
}

export interface SearchParams {
    page?: number;
    limit?: number;
    search?: string;
    [key: string]: unknown;
}
