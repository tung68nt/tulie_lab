import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { DEFAULT_INSTRUCTORS_PAGE_SECTIONS } from '@/lib/defaultContent';

export default function InstructorsPage() {
    return (
        <LandingPageRenderer
            slug="instructors"
            fallbackSections={DEFAULT_INSTRUCTORS_PAGE_SECTIONS}
            forceFallback={false}
        />
    );
}
