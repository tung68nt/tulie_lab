'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Section } from '@/types/sections';
import { DEFAULT_ABOUT_PAGE_SECTIONS } from '@/lib/defaultContent';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';

import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';

import { ComparisonSection } from '@/components/sections/ComparisonSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { StudentProjectsSection } from '@/components/sections/StudentProjectsSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ section: Section }>> = {
    hero: HeroSection,
    stats: StatsSection,
    content: ContentSection,
    cta: CTASection,
    comparison: ComparisonSection,
    process: ProcessSection,
    testimonials: TestimonialsSection,
    projects: StudentProjectsSection,
    benefits: BenefitsSection as any,
};

export default function AboutPage() {
    const [sections, setSections] = useState<Section[]>(DEFAULT_ABOUT_PAGE_SECTIONS);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const data = await api.cms.get(['about_page_sections']);
                if (data && (data as any).about_page_sections) {
                    try {
                        const parsed = JSON.parse((data as any).about_page_sections);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setSections(parsed);
                        }
                    } catch (e) {
                        console.warn("Using default about content");
                    }
                }
            } catch (error) {
                console.warn("Using default about content");
            }
        };
        loadContent();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 py-6 md:py-12">
                {sections.map((section) => {
                    if (section.isVisible === false) return null;
                    const Component = SECTION_COMPONENTS[section.type] || SECTION_COMPONENTS['hero']; // Fallback
                    // Allow simple fallback mapping if types don't match exactly or create specific generic components

                    // For now, mapping 'hero' to HeroSection and 'values' (stats) to StatsSection works well.
                    // If type is unknown, maybe skip or render a generic block.
                    if (!SECTION_COMPONENTS[section.type]) return null;

                    return <Component key={section.id} section={section} />;
                })}
            </main>
        </div>
    );
}
