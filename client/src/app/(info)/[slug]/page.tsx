import { notFound } from 'next/navigation';
import { HeroSection } from '@/components/info/sections/HeroSection';
import { StatsSection } from '@/components/info/sections/StatsSection';
import { BenefitsSection } from '@/components/info/sections/BenefitsSection';
import { TestimonialsSection } from '@/components/info/sections/TestimonialsSection';
import { ContentSection } from '@/components/info/sections/ContentSection';
import { CTASection } from '@/components/info/sections/CTASection';
import { ComparisonSection } from '@/components/info/sections/ComparisonSection';
import { ProcessSection } from '@/components/info/sections/ProcessSection';
import { StudentProjectsSection } from '@/components/info/sections/StudentProjectsSection';
import { CurriculumSection } from '@/components/info/sections/CurriculumSection';
import { SalesCountdownSection } from '@/components/info/sections/SalesCountdownSection';
import { UpsellSection } from '@/components/info/sections/UpsellSection';
import { PaymentSection } from '@/components/info/sections/PaymentSection';
import { CustomHtmlSection } from '@/components/info/sections/CustomHtmlSection';
import { ExpertSection } from '@/components/info/sections/ExpertSection';
import { StudentShowcaseSection } from '@/components/info/sections/StudentShowcaseSection';
import { BonusSection } from '@/components/info/sections/BonusSection';
import { InstructorGridSection } from '@/components/info/sections/InstructorGridSection';
import { ContentBlockSection } from '@/components/info/sections/ContentBlockSection';
import { PricingSection } from '@/components/info/sections/PricingSection';
import { FAQSection } from '@/components/info/sections/FAQSection';
import { CodingMethodsSection } from '@/components/info/sections/CodingMethodsSection';
import { VideoSection } from '@/components/info/sections/VideoSection';
import { VideoTextSection } from '@/components/info/sections/VideoTextSection';
import { GallerySection } from '@/components/info/sections/GallerySection';
import { CalendarSection } from '@/components/info/sections/CalendarSection';
import { HeadingSection } from '@/components/info/sections/HeadingSection';
import { SystemCoursesSection } from '@/components/info/sections/SystemCoursesSection';
import { SystemShopSection } from '@/components/info/sections/SystemShopSection';
import { SystemBlogSection } from '@/components/info/sections/SystemBlogSection';
import { SystemCombosSection } from '@/components/info/sections/SystemCombosSection';
import { SystemInstructorsSection } from '@/components/info/sections/SystemInstructorsSection';
import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';

// Map section types to components - includes system sections
const SECTION_COMPONENTS: Record<string, any> = {
    hero: HeroSection,
    stats: StatsSection,
    features: BenefitsSection,
    benefits: BenefitsSection,
    testimonials: TestimonialsSection,
    content: ContentSection,
    cta: CTASection,
    comparison: ComparisonSection,
    process: ProcessSection,
    studentProjects: StudentProjectsSection,
    projects: StudentProjectsSection,
    curriculum: CurriculumSection,
    'sales-countdown': SalesCountdownSection,
    upsell: UpsellSection,
    payment: PaymentSection,
    'custom-html': CustomHtmlSection,
    'instructor-bio': ExpertSection,
    expert: ExpertSection,
    'student-showcase': StudentShowcaseSection,
    bonus: BonusSection,
    'instructor-grid': InstructorGridSection,
    pricing: PricingSection,
    calendar: CalendarSection,
    faq: FAQSection,
    video: VideoSection,
    'video-text': VideoTextSection,
    gallery: GallerySection,
    'coding-methods': CodingMethodsSection,
    'content-block': ContentBlockSection,
    // System sections
    heading: HeadingSection,
    'system-courses': SystemCoursesSection,
    'system-shop': SystemShopSection,
    'system-blog': SystemBlogSection,
    'system-combos': SystemCombosSection,
    'system-instructors': SystemInstructorsSection,
};

async function getSystemPage(slug: string) {
    try {
        const isServer = typeof window === 'undefined';
        const envUrl = (isServer && process.env.INTERNAL_API_URL) || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const baseUrl = envUrl.replace(/\/$/, '').replace(/\/api$/, '');
        const apiUrl = `${baseUrl}/api/landing-pages/${slug}`;

        console.log('[SystemPageRenderer] Fetching:', apiUrl);

        const res = await fetch(apiUrl, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) {
            console.warn(`[SystemPageRenderer] API returned ${res.status} for ${apiUrl}`);
            return null;
        }

        const page = await res.json();

        // Only return SYSTEM type pages, others should be accessed via /p/slug
        if (page.type !== 'SYSTEM') {
            console.log(`[SystemPageRenderer] Page ${slug} is type ${page.type}, not SYSTEM. Returning null.`);
            return null;
        }

        return page;
    } catch (error) {
        console.error('[SystemPageRenderer] Failed to fetch system page:', error);
        return null;
    }
}

// Next.js 15+: params is a Promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getSystemPage(slug);
    if (!page) return {};

    return {
        title: page.title,
        description: page.description || `Chi tiết về ${page.title}`,
    };
}

export default async function DynamicSystemPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getSystemPage(slug);

    if (!page) {
        notFound();
    }

    // Parse sections if it's a string
    let sections = page.sections;
    if (typeof sections === 'string') {
        try {
            sections = JSON.parse(sections);
            console.log(`[DynamicSystemPage] Parsed ${sections.length} sections for ${slug}`);
        } catch (e) {
            console.error('[DynamicSystemPage] Failed to parse sections JSON:', e);
            sections = [];
        }
    }

    if (!sections || !Array.isArray(sections)) {
        console.warn(`[DynamicSystemPage] No valid sections found for ${slug}`);
        return <div className="py-20 text-center">Trang chưa có nội dung.</div>;
    }

    console.log('[DynamicSystemPage] Valid sections:', sections.map((s: any) => s.type));

    return (
        <LandingPageRenderer slug={slug} />
    );
}
