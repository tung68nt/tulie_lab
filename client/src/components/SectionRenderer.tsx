import { createContext, useContext } from 'react';
import { HeroSection } from '@/components/info/sections/HeroSection';
import { StatsSection } from '@/components/info/sections/StatsSection';
import { BenefitsSection } from '@/components/info/sections/BenefitsSection';
import { ContentSection } from '@/components/info/sections/ContentSection';
import { CTASection } from '@/components/info/sections/CTASection';
import { ComparisonSection } from '@/components/info/sections/ComparisonSection';
import { ProcessSection } from '@/components/info/sections/ProcessSection';
import { StudentProjectsSection } from '@/components/info/sections/StudentProjectsSection';
import { SalesCountdownSection } from '@/components/info/sections/SalesCountdownSection';
import { UpsellSection } from '@/components/info/sections/UpsellSection';
import { CustomHtmlSection } from '@/components/info/sections/CustomHtmlSection';
import { ExpertSection } from '@/components/info/sections/ExpertSection';
import { HeadingSection } from '@/components/info/sections/HeadingSection';
import { CTABoxSection } from '@/components/info/sections/CTABoxSection';
import { SystemCoursesSection } from '@/components/info/sections/SystemCoursesSection';
import { SystemShopSection } from '@/components/info/sections/SystemShopSection';
import { SystemBlogSection } from '@/components/info/sections/SystemBlogSection';
import { SystemCombosSection } from '@/components/info/sections/SystemCombosSection';
import { SystemInstructorsSection } from '@/components/info/sections/SystemInstructorsSection';
import dynamic from 'next/dynamic';
import { FadeIn } from '@/components/animations/FadeIn';

const PaymentSection = dynamic(() => import('@/components/info/sections/PaymentSection').then((mod: any) => mod.PaymentSection));
const CurriculumSection = dynamic(() => import('@/components/info/sections/CurriculumSection').then((mod: any) => mod.CurriculumSection));
const TestimonialsSection = dynamic(() => import('@/components/info/sections/TestimonialsSection').then((mod: any) => mod.TestimonialsSection));
const BonusSection = dynamic(() => import('@/components/info/sections/BonusSection').then((mod: any) => mod.BonusSection));
const FAQSection = dynamic(() => import('@/components/info/sections/FAQSection').then((mod: any) => mod.FAQSection));
const GallerySection = dynamic(() => import('@/components/info/sections/GallerySection').then((mod: any) => mod.GallerySection));
const StudentShowcaseSection = dynamic(() => import('@/components/info/sections/StudentShowcaseSection').then((mod: any) => mod.StudentShowcaseSection));
const PricingSection = dynamic(() => import('@/components/info/sections/PricingSection').then((mod: any) => mod.PricingSection));
const InstructorGridSection = dynamic(() => import('@/components/info/sections/InstructorGridSection').then((mod: any) => mod.InstructorGridSection));
const CodingMethodsSection = dynamic(() => import('@/components/info/sections/CodingMethodsSection').then((mod: any) => mod.CodingMethodsSection));
const CalendarSection = dynamic(() => import('@/components/info/sections/CalendarSection').then((mod: any) => mod.CalendarSection));
const VideoSection = dynamic(() => import('@/components/info/sections/VideoSection').then((mod: any) => mod.VideoSection));
const VideoTextSection = dynamic(() => import('@/components/info/sections/VideoTextSection').then((mod: any) => mod.VideoTextSection));

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
    heading: HeadingSection,
    'cta-box': CTABoxSection,
    'system-courses': SystemCoursesSection,
    'system-shop': SystemShopSection,
    'system-blog': SystemBlogSection,
    'system-combos': SystemCombosSection,
    'system-instructors': SystemInstructorsSection,
};

// Context for checking if section is in preview mode (e.g. editor)
import { SectionPreviewContext } from '@/contexts/SectionPreviewContext';

export const SectionRenderer = ({ section, isPreview = false }: { section: any; isPreview?: boolean }) => {
    const Component = SECTION_COMPONENTS[section.type];
    if (!Component) {
        // Fallback or Null
        return <div className="p-4 border border-dashed border-red-500 rounded text-red-500 text-xs text-center">Unknown Section: {section.type}</div>;
    }

    // Don't animate in preview mode for better UX in editor
    if (isPreview) {
        return (
            <SectionPreviewContext.Provider value={isPreview}>
                <Component section={section} />
            </SectionPreviewContext.Provider>
        );
    }

    // Special case for Hero: show immediately or with very short delay
    const isHero = section.type === 'hero';

    return (
        <SectionPreviewContext.Provider value={isPreview}>
            <FadeIn
                direction={isHero ? 'none' : 'up'}
                delay={isHero ? 0 : 0.1}
                duration={0.6}
            >
                <Component section={section} />
            </FadeIn>
        </SectionPreviewContext.Provider>
    );
};
