'use client';

import React, { useEffect, useState } from 'react';
import { api, getMediaUrl } from '@/lib/api';
import { Instructor, ApiResponse } from '@/types/api';
import { Section } from '@/types/sections';
import { SectionBackground } from '../SectionBackground';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { Twitter, Linkedin, Github, ExternalLink, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';

export const SystemInstructorsSection = ({ section }: { section: Section }) => {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const res = await api.instructors.list() as ApiResponse<Instructor[]>;
                setInstructors(res.data || []);
            } catch (error) {
                console.error('Failed to fetch instructors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInstructors();
    }, []);

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                <p className="text-muted-foreground animate-pulse">Đang tải đội ngũ giảng viên...</p>
            </div>
        );
    }

    const isDark = section.backgroundTheme === 'dark';

    return (
        <section className={cn(
            "py-24 relative overflow-hidden",
            isDark ? "bg-[#050505] text-white" : "bg-background"
        )}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme || 'light'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={section.glowVariant}
            />

            <div className="container px-6 mx-auto relative z-10 max-w-[1240px]">
                <StandardSectionHeader section={section} align={section.align || "center"} />

                <FadeIn direction="up" delay={0.4} duration={0.6}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 mt-16">
                        {instructors.map((instructor, index) => (
                            <div key={instructor.id || index} className={cn(
                                "group flex flex-col items-center h-full backdrop-blur-sm border border-border/50 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2",
                                isDark ? "bg-white/5" : "bg-card/50"
                            )}>
                                {/* Avatar Section */}
                                <div className="relative mb-10 w-44 h-44 mx-auto">
                                    <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />
                                    <div className="relative w-full h-full rounded-full border-4 border-background shadow-2xl overflow-hidden ring-1 ring-border/50 z-10">
                                        {instructor.avatar ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={getMediaUrl(instructor.avatar)}
                                                    alt={instructor?.name || 'Instructor'}
                                                    fill
                                                    className="object-cover transition-all duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                                <span className="text-4xl font-bold text-muted-foreground">{instructor?.name?.charAt(0) || 'G'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col text-center">
                                    <div className="relative z-10">
                                        <Link href={`/instructors/${instructor.slug || instructor.id}`} className="group/name">
                                            <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover/name:text-primary transition-colors duration-300 hover:underline decoration-2 underline-offset-4">{String(instructor.name || '')}</h3>
                                        </Link>
                                    </div>
                                    <p className="text-primary/60 text-xs font-bold mb-6">{String(instructor.role || 'Expert Instructor')}</p>

                                    <p className={cn(
                                        "text-[15px] leading-relaxed mb-10 line-clamp-3 transition-all duration-500",
                                        isDark ? "text-zinc-400" : "text-muted-foreground"
                                    )}>
                                        {(instructor.bio || '').split('\n')[0]}
                                    </p>

                                    <div className="mt-auto pt-8 border-t border-border/50 flex items-center justify-center gap-5 text-muted-foreground">
                                        <button className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                            <Mail className="w-4 h-4" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all">
                                            <Linkedin className="w-4 h-4" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-[#333] hover:text-white transition-all">
                                            <Github className="w-4 h-4" />
                                        </button>
                                        <button className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", isDark ? "bg-white/10 hover:bg-white hover:text-black" : "bg-muted/30 hover:bg-primary hover:text-white")}>
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                {/* Bottom CTA for Instructors Page */}
                <div className="mt-24 text-center">
                    <div className="inline-flex flex-col items-center">
                        <p className="text-muted-foreground mb-6 font-medium">Bạn muốn trở thành giảng viên tại Tulie Academy?</p>
                        <Button variant="outline" className="rounded-full px-10 h-14 font-bold gap-2">
                            Gia nhập đội ngũ <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
