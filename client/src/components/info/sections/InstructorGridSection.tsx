'use client';

import { Section } from '@/types/sections';
import { Twitter, Linkedin, Github, ExternalLink } from 'lucide-react';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { SectionBackground } from '../SectionBackground';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/Badge';
import { getMediaUrl } from '@/lib/api';

export const InstructorGridSection = ({ section }: { section: Section }) => {
    if (!section.items) return null;
    const isDark = section.backgroundTheme === 'dark';

    return (
        <section className={cn(
            "py-24 relative overflow-hidden",
            isDark ? "bg-[#050505] text-white" : "bg-background"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
            />

            <div className="container px-4 mx-auto relative z-10">
                <StandardSectionHeader section={section} align={section.align || "left"} />

                <div className="flex flex-wrap justify-center gap-10 md:gap-12">
                    {section.items.map((item, index) => (
                        <div key={index} className="group relative w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-md bg-card border border-border/40 p-8 md:p-10 rounded-3xl transition-all duration-500 hover:border-primary/30 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col">
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                            {/* Image Container */}
                            <div className="relative mx-auto mb-10 w-44 h-44">
                                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary to-blue-600 opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700 scale-75 group-hover:scale-110" />
                                {(() => {
                                    const imageUrl = getMediaUrl(item.image || (item as any).avatar || '');
                                    return imageUrl ? (
                                        <div className="w-full h-full rounded-full border-[6px] border-background shadow-2xl relative z-10 overflow-hidden ring-1 ring-border/50">
                                            <img
                                                src={imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    // Hide image and show fallback if possible, or simpler: just clear source to show broken image default (which is ugly)
                                                    // Better: Set to a transparent pixel or hide parent?
                                                    // For now, let's just accept that if URL exists it should load. 
                                                    // If we really want to fallback to initials, we need state.
                                                    // Given constraints, I'll stick to just fixing the URL logic.
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center border-[6px] border-background shadow-2xl relative z-10 ring-1 ring-border/50">
                                            <span className={cn("text-5xl font-bold", isDark ? "text-zinc-500" : "text-muted-foreground")}>{item.title?.charAt(0) || '?'}</span>
                                        </div>
                                    );
                                })()}

                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col flex-1 items-center text-center">
                                <Link href={`/instructors/${(item as any).slug || (item as any).id || '#'}`} className="group/name hover:no-underline">
                                    <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover/name:text-primary transition-colors duration-300">{String(item.title || '')}</h3>
                                </Link>
                                <div className="mb-6">
                                    <Badge variant="secondary" showDot={false} className={cn(
                                        "border-border/50",
                                        isDark ? "bg-white/10 text-zinc-300" : "bg-muted text-muted-foreground"
                                    )}>
                                        {String(item.subtitle || '')}
                                    </Badge>
                                </div>
                                <p className={cn(
                                    "leading-relaxed mb-8 text-sm md:text-base line-clamp-4 group-hover:line-clamp-none transition-all duration-500",
                                    isDark ? "text-zinc-400" : "text-muted-foreground"
                                )}>
                                    {String(item.description || '')}
                                </p>

                                {/* Social Links */}
                                <div className="flex justify-center gap-5 pt-4 border-t border-border/40 mt-auto w-full">
                                    {[
                                        { icon: Twitter, label: 'Twitter' },
                                        { icon: Linkedin, label: 'LinkedIn' },
                                        { icon: Github, label: 'GitHub' }
                                    ].map((social, i) => (
                                        <button
                                            key={i}
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                                isDark ? "bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white" : "bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            )}
                                            title={social.label}
                                        >
                                            <social.icon className="w-4 h-4" />
                                        </button>
                                    ))}
                                    <button className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                        isDark ? "bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white" : "bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    )} title="Portfolio">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
