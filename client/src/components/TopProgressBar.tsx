'use client';

import { useEffect, useState, useRef, startTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previousPathRef = useRef(pathname);

  // Sync pathname to ref to detect changes correctly
  useEffect(() => {
    // Detect navigation start
    if (previousPathRef.current !== pathname) {
      previousPathRef.current = pathname;

      // Wrap state updates in transition to avoid blocking Next.js navigation transition
      startTransition(() => {
        setVisible(true);
        setProgress(30);
      });

      if (timerRef.current) clearTimeout(timerRef.current);

      const t1 = setTimeout(() => {
        startTransition(() => setProgress(60));
      }, 100);

      const t2 = setTimeout(() => {
        startTransition(() => setProgress(90));
      }, 300);

      const t3 = setTimeout(() => {
        startTransition(() => {
          setProgress(100);
          setTimeout(() => {
            setVisible(false);
            setProgress(0);
          }, 200);
        });
      }, 500);

      timerRef.current = t1; // Track for cleanup

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname]); // Only react to pathname changes to be more stable

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
