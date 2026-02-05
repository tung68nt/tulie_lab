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
        const handleScroll = () => {
            const headingElements = headings
                .map(h => ({ id: h.id, element: document.getElementById(h.id) }))
                .filter(h => h.element);

            let currentActiveId = '';
            for (const h of headingElements) {
                const rect = h.element!.getBoundingClientRect();
                if (rect.top < 150) {
                    currentActiveId = h.id;
                } else {
                    break;
                }
            }
            if (currentActiveId && currentActiveId !== activeId) {
                setActiveId(currentActiveId);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        const timeout = setTimeout(handleScroll, 200);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeout);
        };
    }, [headings, activeId]);

    if (headings.length === 0) return null;

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-end gap-2.5 px-0.5 pb-2 border-b border-transparent">
                <List size={18} className="text-foreground shrink-0 mb-[3px]" />
                <h3 className="text-[15px] font-bold text-foreground">Mục lục tài liệu</h3>
            </div>
            <div className="h-[1px] w-full bg-border/40 mb-6" />



            <nav className="flex flex-col gap-0.5 pt-1">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(heading.id);
                            if (element) {
                                const offset = 100;
                                const elementPosition = element.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - offset;
                                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                            }
                            if (onItemClick) onItemClick();
                        }}
                        className={cn(
                            "group block py-1.5 px-3 text-[13px] leading-snug transition-all duration-200 rounded-md",
                            heading.level === 3 ? "pl-8" : "pl-4",
                            activeId === heading.id
                                ? "text-foreground font-bold"
                                : "text-muted-foreground/70 hover:text-foreground font-normal"
                        )}
                    >
                        <span className="transition-transform inline-block">
                            {heading.text}
                        </span>
                    </a>
                ))}
            </nav>
        </div>
    );
}
