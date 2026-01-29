import { Section } from '@/types/sections';
import { BookOpen, FileText, PlayCircle, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import { SectionBackground } from '../SectionBackground';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { cn } from '@/lib/utils';

export const CurriculumSection = ({ section }: { section: Section }) => {
    const modules = section.items || [];

    return (
        <section className="py-24 md:py-32 relative overflow-hidden bg-background">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
            />

            <div className="container px-4 mx-auto relative z-10">
                <StandardSectionHeader section={section} align="center" className="mb-16 md:mb-24" />

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent -translate-x-1/2" />

                    <div className="space-y-16 md:space-y-24">
                        {modules.map((module: any, index: number) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={index} className={cn(
                                    "relative flex flex-col md:flex-row items-start gap-8 md:gap-0",
                                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                                )}>
                                    {/* Date/Order Badge for Desktop (Center) */}
                                    <span className="text-xs md:text-sm font-bold text-primary">{index + 1}</span>

                                    {/* Content Card */}
                                    <div className={cn(
                                        "w-full md:w-[45%] pl-12 md:pl-0",
                                        isEven ? "md:pr-12" : "md:pl-12"
                                    )}>
                                        <div className="group bg-card border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-white/5">
                                            {/* Optional Image */}
                                            {module.image && (
                                                <div className="relative aspect-video overflow-hidden">
                                                    <Image
                                                        src={module.image}
                                                        alt={module.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                                    <div className="absolute bottom-4 left-4">
                                                        <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1 rounded-full border border-white/20">
                                                            MODULE {index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-6 md:p-8">
                                                <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">
                                                    {module.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 font-medium opacity-80">
                                                    {module.description}
                                                </p>

                                                <div className="space-y-4">
                                                    {module.lessons?.map((lesson: string, i: number) => (
                                                        <div key={i} className="flex items-start gap-3 group/lesson p-2 -ml-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all">
                                                            <div className="mt-1 h-5 w-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/lesson:bg-primary group-hover/lesson:text-white transition-all">
                                                                {lesson.toLowerCase().includes('tài liệu') ? (
                                                                    <FileText size={12} strokeWidth={3} />
                                                                ) : (
                                                                    <PlayCircle size={12} strokeWidth={3} />
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-semibold text-foreground/80 group-hover/lesson:text-foreground transition-colors">
                                                                {lesson}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Spacer for Desktop */}
                                    <div className="hidden md:block w-[45%]" />
                                </div>
                            );
                        })}
                    </div>

                    {/* End Signal */}
                    <div className="absolute -bottom-12 left-4 md:left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-primary animate-ping" />
                        <div className="mt-2 text-[10px] font-bold uppercase text-primary">Finish line</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
