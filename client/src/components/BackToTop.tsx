'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                "fixed bottom-8 right-8 z-[100] p-3 rounded-full shadow-2xl transition-all duration-500 transform",
                "bg-background/40 backdrop-blur-xl border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
            )}
            aria-label="Back to top"
        >
            <ChevronUp size={24} strokeWidth={2.5} />

            {/* Optional: Subtle Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
