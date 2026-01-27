import { createContext, useContext } from 'react';
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
import { VideoSection } from '@/components/info/sections/VideoSection';
import { VideoTextSection } from '@/components/info/sections/VideoTextSection';
import { GallerySection } from '@/components/info/sections/GallerySection';
import dynamic from 'next/dynamic';

const CodingMethodsSection = dynamic(() => import('@/components/info/sections/CodingMethodsSection').then(mod => mod.CodingMethodsSection), {
    loading: () => <div>Loading...</div>
});
import { InstructorGridSection } from '@/components/info/sections/InstructorGridSection';

import { FAQSection } from '@/components/info/sections/FAQSection';
import { PricingSection } from '@/components/info/sections/PricingSection';
import { CalendarSection } from '@/components/info/sections/CalendarSection';

// Map section types to components
export const SECTION_COMPONENTS: Record<string, any> = {
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
    pricing: PricingSection,
    'custom-html': CustomHtmlSection,

    // New Sections
    'instructor-bio': ExpertSection,
    expert: ExpertSection,
    'student-showcase': StudentShowcaseSection,
    bonus: BonusSection,
    'instructor-grid': InstructorGridSection,
    'coding-methods': CodingMethodsSection,
    faq: FAQSection,
    calendar: CalendarSection,
    video: VideoSection,
    'video-text': VideoTextSection,
    gallery: GallerySection,
};

// Context for checking if section is in preview mode (e.g. editor)
import { SectionPreviewContext } from '@/contexts/SectionPreviewContext';

export const SectionRenderer = ({ section, isPreview = false }: { section: any; isPreview?: boolean }) => {
    // HOTFIX: Force "Phương Pháp Đào Tạo Độc Quyền" to use CodingMethodsSection
    // The database has this section with a different type (likely 'content'), preventing the table from rendering.
    if (section.title && (section.title.includes('Phương Pháp Đào Tạo Độc Quyền') || section.title.includes('Vibe Coding'))) {
        section.type = 'coding-methods';
    }

    const Component = SECTION_COMPONENTS[section.type];
    if (!Component) {
        // Fallback or Null
        return <div className="p-4 border border-dashed border-red-500 rounded text-red-500 text-xs text-center">Unknown Section: {section.type}</div>;
    }
    return (
        <SectionPreviewContext.Provider value={isPreview}>
            <Component section={section} />
        </SectionPreviewContext.Provider>
    );
};
