import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS_DATA } from '@/lib/projects';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';
import { SectionBackground } from '../SectionBackground';

export const StudentProjectsSection = ({ section }: { section: Section }) => {
    return (
        <section
            className={cn(
                "py-20 md:py-32 relative overflow-hidden transition-colors duration-300",
                section.backgroundTheme === 'dark'
                    ? "bg-[#050505] text-white"
                    : section.backgroundTheme === 'light'
                        ? "bg-white dark:bg-[#050505] text-zinc-950 dark:text-white"
                        : "bg-background"
            )}
        >
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme || 'light'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={9}
            />

            <div className="container relative z-10 mx-auto px-4">
                {/* Header */}
                <StandardSectionHeader section={section} align="left" tagOverride="Thành tựu" />

                {/* Projects grid - Added p-4 -mx-4 to allow shadow overflow without Scrollbar */}
                <div className="flex flex-wrap justify-center gap-8 -mx-4 pb-4">
                    {(section.items || PROJECTS_DATA).map((project, index) => (
                        <div
                            key={index}
                            className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] flex flex-col"
                        >
                            <Link
                                href={`/projects/${project.slug}`}
                                className={cn(
                                    "group relative flex flex-col h-full border border-border/40 rounded-2xl overflow-hidden hover:shadow-lg dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300 hover:border-primary/50",
                                    section.backgroundTheme === 'dark'
                                        ? "bg-zinc-900"
                                        : section.backgroundTheme === 'light'
                                            ? "bg-white dark:bg-zinc-900"
                                            : "bg-card"
                                )}
                            >
                                {/* Project image */}
                                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                                    <Image
                                        src={project.image || ''}
                                        alt={project.title || 'Project Image'}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-background text-black rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            Xem chi tiết
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className={cn(
                                    "flex flex-col flex-1 p-6 md:p-8",
                                    section.backgroundTheme === 'dark'
                                        ? "bg-gradient-to-b from-zinc-900 to-zinc-950"
                                        : section.backgroundTheme === 'light'
                                            ? "bg-white dark:bg-zinc-900"
                                            : "bg-gradient-to-b from-card to-secondary/10"
                                )}>
                                    <div className="mb-4">
                                        <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1 text-foreground dark:text-white">
                                            {String(project.title || '')}
                                        </h3>
                                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors dark:text-zinc-400">
                                            Bởi <span className="text-foreground font-semibold dark:text-white">{String(project.student || 'Thành viên Tulie')}</span>
                                        </p>
                                    </div>

                                    <p className="text-muted-foreground dark:text-zinc-400 mb-6 line-clamp-2 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Tech tags */}
                                    <div className="mt-auto pt-6 border-t border-border/50 flex flex-wrap gap-2">
                                        {Array.isArray(project.tech) && project.tech.map((tech: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 bg-background border border-border/50 rounded-md text-xs font-semibold text-muted-foreground group-hover:border-primary/30 group-hover:text-primary transition-colors"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Call to Demo Action - Styled differently to separate from grid */}
                <div className="mt-20 md:mt-32 relative">
                    <div className="relative bg-background border border-border rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl">


                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-bold mb-4">
                                    Demo Day & Weekly Showcase
                                </h3>
                                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                    Tham gia buổi livestream hàng tuần để xem các thành viên demo sản phẩm, nhận feedback trực tiếp từ Mentor và các Senior Developer.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center gap-3 bg-secondary/30 px-4 py-3 rounded-xl border border-border/50">
                                        <div className="w-10 h-10 flex items-center justify-center font-bold border border-border rounded-lg">T7</div>
                                        <div>
                                            <div className="font-bold text-sm">Thứ 7 Hàng Tuần</div>
                                            <div className="text-xs text-muted-foreground">20:00 - 22:00</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-secondary/30 px-4 py-3 rounded-xl border border-border/50">
                                        <div className="w-10 h-10 flex items-center justify-center font-bold border border-border rounded-lg">Free</div>
                                        <div>
                                            <div className="font-bold text-sm">Miễn Phí</div>
                                            <div className="text-xs text-muted-foreground">Dành cho cộng đồng</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", text: "Demo trực tiếp" },
                                    { icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z", text: "Q&A Mentor" },
                                    { icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", text: "Networking" },
                                    { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Code Review" }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center p-6 bg-background rounded-2xl border border-border/50 shadow-sm text-center gap-3">
                                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                        </svg>
                                        <span className="font-medium text-sm">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
