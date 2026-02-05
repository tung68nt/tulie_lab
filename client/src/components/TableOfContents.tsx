'use client';

import { useEffect, useState } from 'react';
import { cn, slugify } from '@/lib/utils';
import { List } from 'lucide-react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
    className?: string;
    onItemClick?: () => void;
}

export function TableOfContents({ content, className, onItemClick }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Extract headings from markdown content
        const lines = content.split('\n');
        const extractedHeadings: TOCItem[] = [];
        let inCodeBlock = false;

        lines.forEach(line => {
            const trimmedLine = line.trim();

            // Toggle code block state
            if (trimmedLine.startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                return;
            }

            // Skip if inside code block
            if (inCodeBlock) return;

            // Capture H1, H2, H3
            const match = line.match(/^(#{1,3})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                let rawText = match[2];

                // Clean Markdown and HTML
                rawText = rawText
                    .replace(/\[!.*?\]/g, '') // Remove Alerts
                    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove Bold/Italic
                    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove Links, keep text
                    .replace(/`([^`]+)`/g, '$1') // Remove Inline Code
                    .replace(/<[^>]*>/g, ''); // Remove HTML tags

                const text = rawText.trim();

                // Explicitly ignore "Good" and "Bad" labels
                if (text.toLowerCase() === 'good' || text.toLowerCase() === 'bad') return;

                // Generate ID similar to rehype-slug (naive approximation)
                const id = slugify(text);

                extractedHeadings.push({ id, text, level });
            }
        });

        setHeadings(extractedHeadings);
    }, [content]);

    useEffect(() => {
        const handleObserver = (entries: IntersectionObserverEntry[]) => {
            // Find all intersecting headers
            const intersecting = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            if (intersecting.length > 0) {
                // Pick the first one (closest to top)
                setActiveId(intersecting[0].target.id);
            }
        };

        const observer = new IntersectionObserver(handleObserver, {
            rootMargin: '-80px 0px -70% 0px', // Account for header and focus on top area
            threshold: [0, 1]
        });

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className={cn("space-y-4 pt-2", className)}>
            <p className="text-sm font-bold text-foreground flex items-center gap-2">
                <List className="w-4 h-4" />
                Mục lục bài học
            </p>
            <nav className="relative flex flex-col">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(heading.id);
                            if (element) {
                                const offset = 100; // Account for sticky header
                                const elementPosition = element.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - offset;

                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: 'smooth'
                                });
                            }
                            if (onItemClick) onItemClick();
                        }}
                        className={cn(
                            "group block py-2 px-3 text-[13px] leading-tight transition-all duration-200 font-normal rounded-lg",
                            heading.level === 3 ? "pl-6" : "",
                            heading.level === 1 ? "font-semibold text-foreground/90" : "",
                            activeId === heading.id
                                ? "text-primary bg-primary/5 font-bold shadow-sm"
                                : "text-muted-foreground/70 hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <span className={cn(
                            "transition-transform inline-block",
                            activeId === heading.id ? "translate-x-0.5" : "group-hover:translate-x-0.5"
                        )}>
                            {heading.text}
                        </span>
                    </a>
                ))}
            </nav>
        </div>
    );
}
