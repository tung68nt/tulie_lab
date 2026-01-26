export type SectionType = 'hero' | 'stats' | 'process' | 'comparison' | 'projects' | 'testimonials' | 'cta' | 'features' | 'content' | 'instructor-grid' | 'benefits' | 'coding-methods' | 'sales-countdown' | 'upsell' | 'payment' | 'custom-html' | 'student-showcase' | 'content-block' | 'instructor-bio' | 'bonus' | 'faq' | 'history' | 'curriculum' | 'pricing' | 'calendar';

export interface SectionItem {
    id?: string;
    title?: string;
    description?: string;
    icon?: string;
    image?: string;
    price?: string | number;
    originalPrice?: string | number;
    salePrice?: string | number; // For upsells
    productId?: string; // ID for backend order
    features?: string[] | string;
    [key: string]: any;
}

export interface Section {
    id: string;
    type: SectionType;
    name?: string; // Descriptive name for templates
    title?: string;
    subtitle?: string;
    tag?: string;
    content?: string;
    items?: SectionItem[];
    variant?: string;
    image?: string;
    ctaText?: string;
    ctaLink?: string;
    isVisible?: boolean;
    highlight?: string; // Used for countdown deadline or special highlight text
    html?: string; // Raw HTML content
    price?: string | number;
    oldPrice?: string | number;
    icon?: string;
    buttons?: any[];
    imagePosition?: 'left' | 'right';
    statsTitle?: string;
    statsValue?: string;
    statsIcon?: string;
    order?: number;
    showDotPattern?: boolean; // New: Toggle dot pattern visibility
    className?: string; // Add className for custom styling
}
