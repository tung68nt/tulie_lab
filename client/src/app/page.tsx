import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { DEFAULT_HOME_SECTIONS } from '@/lib/defaultContent';

export default function Home() {
  return (
    <LandingPageRenderer
      slug="home"
      fallbackSections={DEFAULT_HOME_SECTIONS}
      forceFallback={false}
    />
  );
}

