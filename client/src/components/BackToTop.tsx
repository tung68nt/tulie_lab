'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
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
                "fixed bottom-4 right-4 z-[100] w-9 h-9 flex items-center justify-center rounded-full shadow-sm transition-all duration-300 group",
                "bg-background border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
            )}
            aria-label="Back to top"
        >
            <ArrowUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
        </button>
    );
}
