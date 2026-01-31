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
import { api } from '@/lib/api';
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

// Map section types to components
const SECTION_COMPONENTS: Record<string, any> = {
    hero: HeroSection,
    stats: StatsSection,
    features: BenefitsSection, // Mapped to Benefits
    benefits: BenefitsSection,
    testimonials: TestimonialsSection,
    content: ContentSection,
    cta: CTASection,
    comparison: ComparisonSection,
    process: ProcessSection,
    studentProjects: StudentProjectsSection,
    projects: StudentProjectsSection, // Alias for seed data
    curriculum: CurriculumSection,
    'sales-countdown': SalesCountdownSection,
    upsell: UpsellSection,
    payment: PaymentSection,
    'custom-html': CustomHtmlSection,
    // New Sections
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
    'content-block': ContentBlockSection, // Added missing
};

async function getLandingPage(slug: string) {
    try {
        // Construct API URL same way as api.ts does
        const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        // Strip trailing slash and /api suffix to get a clean base URL
        const baseUrl = envUrl.replace(/\/$/, '').replace(/\/api$/, '');
        const apiUrl = `${baseUrl}/api/landing-pages/${slug}`;

        console.log('[LandingPageRenderer] Fetching:', apiUrl);

        const res = await fetch(apiUrl, {
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!res.ok) {
            console.warn(`[LandingPageRenderer] API returned ${res.status} for ${apiUrl}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('[LandingPageRenderer] Failed to fetch landing page:', error);
        return null;
    }
}

// Next.js 15+: params is a Promise
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getLandingPage(slug);
    if (!page) return {};

    return {
        title: page.title,
        description: page.description || `Chi tiết về ${page.title}`,
    };
}

export default async function DynamicLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getLandingPage(slug);

    if (!page) {
        notFound();
    }

    // Parse sections if it's a string (API might return object or string depending on implementation)
    let sections = page.sections;
    if (typeof sections === 'string') {
        try {
            sections = JSON.parse(sections);
        } catch (e) {
            console.error('[DynamicLandingPage] Failed to parse sections JSON:', e);
            sections = [];
        }
    }

    if (!sections || !Array.isArray(sections)) {
        return <div className="py-20 text-center">Trang chưa có nội dung.</div>;
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            {sections.filter((s: any) => s.isVisible !== false).map((section: any, index: number) => {
                const Component = SECTION_COMPONENTS[section.type];
                if (!Component) {
                    console.warn(`Unknown section type: ${section.type}`);
                    return null;
                }
                return <Component key={section.id || index} section={section} mainCourse={page.course} upsellCourse={page.upsellCourse} mainProduct={page.product} upsellProduct={page.upsellProduct} upsellPrice={page.upsellPrice} allSections={sections} />;
            })}
        </main>
    );
}
