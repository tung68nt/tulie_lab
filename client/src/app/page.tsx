'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { api } from '@/lib/api';

import { Section } from '@/types/sections';
import { DEFAULT_LANDING_PAGE_SECTIONS } from '@/lib/defaultContent';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ComparisonSection } from '@/components/sections/ComparisonSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { CTASection } from '@/components/sections/CTASection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { StudentProjectsSection } from '@/components/sections/StudentProjectsSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ section: Section }>> = {
  hero: HeroSection,
  stats: StatsSection,
  comparison: ComparisonSection,
  process: ProcessSection,
  cta: CTASection,
  testimonials: TestimonialsSection,
  projects: StudentProjectsSection,
  benefits: BenefitsSection,
};

export default function Home() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_LANDING_PAGE_SECTIONS);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.cms.get(['home_page_sections']);
        if (data && (data as any).home_page_sections) {
          try {
            const parsed = JSON.parse((data as any).home_page_sections);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSections(parsed);
            }
          } catch (e) {
            console.error("Failed to parse home sections JSON", e);
          }
        }
      } catch (error) {
        console.warn('Backend currently unavailable or CMS content not found. Using default content.');
      }
    };
    loadContent();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {sections.map((section) => {
          if (section.isVisible === false) return null; // Respect visibility toggle
          const Component = SECTION_COMPONENTS[section.type];
          if (!Component) return null;
          return <Component key={section.id} section={section} />;
        })}
      </main>
    </div>
  );
}

