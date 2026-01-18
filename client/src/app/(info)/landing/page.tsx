'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { api } from '@/lib/api';

import { Section } from '@/types/sections';
import { DEFAULT_LANDING_PAGE_SECTIONS } from '@/lib/defaultContent';
import { HeroSection } from '@/components/info/sections/HeroSection';
import { StatsSection } from '@/components/info/sections/StatsSection';
import { ComparisonSection } from '@/components/info/sections/ComparisonSection';
import { ProcessSection } from '@/components/info/sections/ProcessSection';
import { CTASection } from '@/components/info/sections/CTASection';
import { TestimonialsSection } from '@/components/info/sections/TestimonialsSection';
import { StudentProjectsSection } from '@/components/info/sections/StudentProjectsSection';
import { BenefitsSection } from '@/components/info/sections/BenefitsSection';
import { CodingMethodsSection } from '@/components/info/sections/CodingMethodsSection';

import { SalesCountdownSection } from '@/components/info/sections/SalesCountdownSection';
import { UpsellSection } from '@/components/info/sections/UpsellSection';
import { PaymentSection } from '@/components/info/sections/PaymentSection';
import { CustomHtmlSection } from '@/components/info/sections/CustomHtmlSection';
import { ExpertSection } from '@/components/info/sections/ExpertSection';
import { StudentShowcaseSection } from '@/components/info/sections/StudentShowcaseSection';
import { BonusSection } from '@/components/info/sections/BonusSection';
import { ContentBlockSection } from '@/components/info/sections/ContentBlockSection';
import { FAQSection } from '@/components/info/sections/FAQSection';
import { InstructorBioSection } from '@/components/info/sections/InstructorBioSection';
import { InstructorGridSection } from '@/components/info/sections/InstructorGridSection';

// Map section types to components
const SECTION_COMPONENTS: Record<string, React.ComponentType<{ section: Section; variant?: string }>> = {
    hero: HeroSection,
    stats: StatsSection,
    comparison: ComparisonSection,
    process: ProcessSection,
    cta: CTASection,
    testimonials: TestimonialsSection,
    projects: StudentProjectsSection,
    benefits: BenefitsSection,
    'coding-methods': CodingMethodsSection,
    'sales-countdown': SalesCountdownSection,
    upsell: UpsellSection,
    payment: PaymentSection,
    'custom-html': CustomHtmlSection,
    'student-showcase': StudentShowcaseSection,
    'content-block': ContentBlockSection,
    'instructor-bio': InstructorBioSection,
    'instructor-grid': InstructorGridSection,
    'expert': ExpertSection,
    'bonus': BonusSection,
    'faq': FAQSection,
};

export default function LandingPage() {
    const [sections, setSections] = useState<Section[]>(DEFAULT_LANDING_PAGE_SECTIONS);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {sections.map((section) => {
                    if (section.isVisible === false) return null;
                    const Component = SECTION_COMPONENTS[section.type];
                    if (!Component) return null;

                    // Inject special props for Landing Page specific styles
                    const extraProps: any = {};
                    if (section.type === 'process') {
                        extraProps.variant = 'snake';
                    }

                    return <Component key={section.id} section={section} {...extraProps} />;
                })}
            </main>
        </div>
    );
}
