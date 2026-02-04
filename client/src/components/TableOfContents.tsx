'use client';

import { useEffect, useState } from 'react';
import { cn, slugify } from '@/lib/utils';

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

        lines.forEach(line => {
            const match = line.match(/^(#{2,3})\s+(.+)$/);
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

                // Generate ID similar to rehype-slug (naive approximation)
                const id = slugify(text);

                extractedHeadings.push({ id, text, level });
            }
        });

        setHeadings(extractedHeadings);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0% 0% -80% 0%' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className={cn("space-y-6", className)}>
            <p className="text-sm font-bold text-muted-foreground/80 pl-1">Mục lục bài học</p>
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
                            "group block py-2.5 px-4 text-[14px] leading-snug border-l-2 transition-all duration-200",
                            heading.level === 3 ? "pl-8" : "font-medium",
                            activeId === heading.id
                                ? "text-primary border-primary bg-primary/5"
                                : "text-muted-foreground/70 border-transparent hover:text-foreground hover:bg-muted/30"
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
