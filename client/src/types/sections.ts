export type SectionType = 'hero' | 'stats' | 'process' | 'comparison' | 'projects' | 'testimonials' | 'cta' | 'features' | 'content' | 'instructor-grid' | 'benefits';

export interface SectionItem {
    id?: string;
    title?: string;
    description?: string;
    icon?: string;
    image?: string;
    price?: string;
    features?: string[];
    [key: string]: any;
}

export interface Section {
    id: string;
    type: SectionType;
    title?: string;
    subtitle?: string;
    content?: string;
    items?: SectionItem[];
    variant?: string;
    image?: string;
    ctaText?: string;
    ctaLink?: string;
    isVisible?: boolean;
}
