
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

// Map section types to components
const SECTION_COMPONENTS: Record<string, any> = {
    hero: HeroSection,
    stats: StatsSection,
    features: BenefitsSection,
    benefits: BenefitsSection,
    testimonials: TestimonialsSection,
    content: ContentSection,
    'content-block': ContentBlockSection,
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
    faq: FAQSection,
    'coding-methods': CodingMethodsSection,
    video: VideoSection,
    'video-text': VideoTextSection,
    gallery: GallerySection,
};

async function getLandingPage(slug: string) {
    try {
        // Match the URL pattern from api.ts
        const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const baseUrl = envUrl.replace(/\/$/, '').replace(/\/api$/, '');
        const url = `${baseUrl}/api/landing-pages/${slug}`;

        console.log('[LandingPageRenderer] Fetching:', url);

        const res = await fetch(url, {
            next: { revalidate: 60 }, // Revalidate every minute
        });

        if (!res.ok) {
            console.error('[LandingPageRenderer] Fetch failed:', res.status, res.statusText);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('[LandingPageRenderer] Failed to fetch landing page:', error);
        return null;
    }
}


interface LandingPageRendererProps {
    slug: string;
    fallbackSections?: any[];
    forceFallback?: boolean;
}

export async function LandingPageRenderer({ slug, fallbackSections, forceFallback }: LandingPageRendererProps) {
    const page = await getLandingPage(slug);

    // If no page from DB and no fallback, 404
    if (!page && !fallbackSections) {
        notFound();
    }

    // Use DB sections if available and not empty, otherwise fallback
    let sections = page?.sections;

    // Parse if string
    if (typeof sections === 'string') {
        sections = JSON.parse(sections);
    }

    // If forceFallback is true, OR if sections is null/undefined or empty, use fallback
    if (forceFallback && fallbackSections) {
        sections = fallbackSections;
    } else if ((!sections || (Array.isArray(sections) && sections.length === 0)) && fallbackSections) {
        sections = fallbackSections;
    }

    if (!sections || !Array.isArray(sections)) {
        return <div className="py-20 text-center">Trang cập nhật nội dung.</div>;
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            {sections.map((section: any, index: number) => {
                const Component = SECTION_COMPONENTS[section.type] || SECTION_COMPONENTS['content']; // Fallback to content
                if (!Component) {
                    console.warn(`Unknown section type: ${section.type}`);
                    return null;
                }
                return <Component key={section.id || index} section={section} mainCourse={page?.course} upsellCourse={page?.upsellCourse} upsellPrice={page?.upsellPrice} allSections={sections} />;
            })}
        </main>
    );
}
