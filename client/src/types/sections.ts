export type SectionType = 'hero' | 'stats' | 'process' | 'comparison' | 'projects' | 'testimonials' | 'cta' | 'features' | 'content' | 'instructor-grid' | 'benefits' | 'coding-methods' | 'sales-countdown' | 'upsell' | 'payment' | 'custom-html' | 'student-showcase' | 'content-block' | 'instructor-bio' | 'bonus' | 'faq' | 'history' | 'curriculum' | 'pricing' | 'calendar' | 'video' | 'video-text' | 'gallery';

export interface SectionItem {
    id?: string;
    title?: string;
    description?: string;
    icon?: string;
    image?: string;
    videoUrl?: string; // New: for gallery or individual video
    price?: string | number;
    originalPrice?: string | number;
    salePrice?: string | number; // For upsells
    productId?: string; // ID for backend order
    features?: string[] | string;
    [key: string]: any;
}

export interface TableRowConfig {
    key: string;
    label: string;
    icon?: string;
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
    videoUrl?: string; // New: link to video (youtube, mp4, etc)
    mediaAspectRatio?: '16/9' | '4/3' | '1/1' | 'auto' | 'original'; // New: fit original or specific ratio
    appearance?: 'standard' | 'glass'; // New: glassmorphism style
    animation?: 'none' | 'fade-up' | 'fade-in' | 'slide-up'; // New: entry animation
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
    trustIndicators?: string[]; // New: List of trust indicators for Hero section
    rowConfig?: TableRowConfig[]; // New: Dynamic row configuration for comparison tables
    className?: string; // Add className for custom styling
    backgroundImage?: string; // New: background image for the section
    backgroundTheme?: 'light' | 'dark' | 'auto'; // New: theme preference for content on background
    overlayOpacity?: number; // New: opacity of the background overlay
    align?: 'left' | 'center' | 'right'; // New: text alignment preference
    glowVariant?: number; // New: variant for background glow effects (0-15)
}
