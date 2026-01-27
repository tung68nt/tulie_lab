import { Section } from '@/types/sections';
import { Twitter, Linkedin, Github, ExternalLink } from 'lucide-react';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';

export const InstructorGridSection = ({ section }: { section: Section }) => {
    if (!section.items) return null;

    return (
        <section className="py-24 bg-background overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

            <div className="container px-4 mx-auto">
                <StandardSectionHeader section={section} />

                <div className={`grid gap-10 md:gap-12 ${section.items.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                    section.items.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    } justify-items-center`}>
                    {section.items.map((item, index) => (
                        <div key={index} className="group relative w-full max-w-md bg-card border border-border/40 p-8 md:p-10 rounded-[2.5rem] transition-all duration-500 hover:border-primary/30 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />

                            {/* Image Container */}
                            <div className="relative mx-auto mb-10 w-44 h-44">
                                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary to-blue-600 opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700 scale-75 group-hover:scale-110" />
                                {item.image ? (
                                    <div className="w-full h-full rounded-full border-[6px] border-background shadow-2xl relative z-10 overflow-hidden ring-1 ring-border/50">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center border-[6px] border-background shadow-2xl relative z-10 ring-1 ring-border/50">
                                        <span className="text-5xl font-bold text-muted-foreground">{item.title?.charAt(0) || '?'}</span>
                                    </div>
                                )}

                                {/* Floating Badge */}
                                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-20 border-2 border-background transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    EXPERT
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                                <div className="inline-flex items-center px-4 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-border/50">
                                    {item.subtitle}
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-8 text-sm md:text-base line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                                    {item.description}
                                </p>

                                {/* Social Links */}
                                <div className="flex justify-center gap-5 pt-4 border-t border-border/40">
                                    {[
                                        { icon: Twitter, label: 'Twitter' },
                                        { icon: Linkedin, label: 'LinkedIn' },
                                        { icon: Github, label: 'GitHub' }
                                    ].map((social, i) => (
                                        <button
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                                            title={social.label}
                                        >
                                            <social.icon className="w-4 h-4" />
                                        </button>
                                    ))}
                                    <button className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300" title="Portfolio">
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
