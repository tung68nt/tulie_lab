import { LandingPageRenderer } from '@/components/info/LandingPageRenderer';
import { DEFAULT_HOME_SECTIONS } from '@/lib/defaultContent';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <LandingPageRenderer
      slug="home"
      forceFallback={false}
    />
  );
}

