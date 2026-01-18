'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { api } from '@/lib/api';

import { Section } from '@/types/sections';
import { DEFAULT_LANDING_PAGE_SECTIONS, DEFAULT_HOME_SECTIONS } from '@/lib/defaultContent';
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
const SECTION_COMPONENTS: Record<string, React.ComponentType<{ section: Section }>> = {
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



export default function Home() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_HOME_SECTIONS);

  /*
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
  */

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

