'use client';

import { VIBE_CODING_SECTIONS } from '@/lib/vibeCodingContent';
import { HeroSection } from '@/components/info/sections/HeroSection';
import { StatsSection } from '@/components/info/sections/StatsSection';
import { ComparisonSection } from '@/components/info/sections/ComparisonSection';
import { FeatureGridSection } from '@/components/info/sections/FeatureGridSection';
import { CurriculumSection } from '@/components/info/sections/CurriculumSection';
import { BonusSection } from '@/components/info/sections/BonusSection';
import { InstructorBioSection } from '@/components/info/sections/InstructorBioSection';
import { FAQSection } from '@/components/info/sections/FAQSection';
import { DarkCTASection } from '@/components/info/sections/DarkCTASection';
import { Section } from '@/types/sections';

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ section: Section }>> = {
    hero: HeroSection,
    features: FeatureGridSection,
    comparison: ComparisonSection,
    curriculum: CurriculumSection,
    stats: StatsSection,
    bonus: BonusSection,
    'instructor-bio': InstructorBioSection,
    faq: FAQSection,
    cta: DarkCTASection,
};

export default function VibeCodingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {VIBE_CODING_SECTIONS.map((section) => {
                    const Component = SECTION_COMPONENTS[section.type];
                    if (!Component) return null;
                    return <Component key={section.id} section={section} />;
                })}
            </main>
        </div>
    );
}
