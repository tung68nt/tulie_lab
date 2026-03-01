'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Custom progress bar that does NOT proxy pushState or intercept anchor clicks.
 * It only reacts to pathname/searchParams changes via Next.js hooks.
 * This avoids the bug in next-nprogress-bar where pushState proxy interferes
 * with Next.js 15 App Router navigation.
 */
export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    // Skip on initial mount
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;

    // Start progress
    setVisible(true);
    setProgress(30);

    timerRef.current = setTimeout(() => {
      setProgress(60);
    }, 100);

    const t2 = setTimeout(() => {
      setProgress(90);
    }, 300);

    const t3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '3px',
        backgroundColor: 'hsl(var(--primary))',
        zIndex: 99999,
        transition: progress === 0 ? 'none' : 'width 300ms ease, opacity 200ms ease',
        opacity: progress >= 100 ? 0 : 1,
      }}
    />
  );
}
