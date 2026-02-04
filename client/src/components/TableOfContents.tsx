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
        <div className={cn("space-y-4", className)}>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">Mục lục</p>
            <nav className="space-y-1">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({
                                behavior: 'smooth'
                            });
                            if (onItemClick) onItemClick();
                        }}
                        className={cn(
                            "block py-1 text-sm transition-colors hover:text-foreground",
                            heading.level === 3 ? "pl-4" : "",
                            activeId === heading.id
                                ? "text-foreground font-medium border-l-2 border-primary pl-2 -ml-[2px]"
                                : "text-muted-foreground"
                        )}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
