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

// Map section types to components
const SECTION_COMPONENTS: Record<string, any> = {
    hero: HeroSection,
    stats: StatsSection,
    features: BenefitsSection, // Mapped to Benefits
    benefits: BenefitsSection,
    testimonials: TestimonialsSection,
    content: ContentSection,
    'content-block': ContentSection, // Alias for seed data
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
    'coding-methods': ContentSection, // Fallback for coding-methods if no specific component
};

async function getLandingPage(slug: string) {
    try {
        // In a real implementation, use the API client to fetch data
        // const page = await api.get(`/landing-pages/${slug}`);
        // return page;

        // For now, fetch from the new API endpoint we just created
        // We can't use the 'api' helper if it's client-side only or requires auth headers we don't have yet SS/
        // So we fetch directly from absolute URL or use a server-side helper

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing-pages/${slug}`, {
            next: { revalidate: 60 } // Revalidate every minute
        });

        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Failed to fetch landing page:', error);
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
    const sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;

    if (!sections || !Array.isArray(sections)) {
        return <div className="py-20 text-center">Trang chưa có nội dung.</div>;
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            {sections.map((section: any, index: number) => {
                const Component = SECTION_COMPONENTS[section.type];
                if (!Component) {
                    console.warn(`Unknown section type: ${section.type}`);
                    return null;
                }
                return <Component key={section.id || index} section={section} mainCourse={page.course} upsellCourse={page.upsellCourse} upsellPrice={page.upsellPrice} allSections={sections} />;
            })}
        </main>
    );
}
