import { Section } from '@/types/sections';
import Image from 'next/image';
import { DynamicIcon } from '@/components/DynamicIcon';
import { SectionBackground } from '../SectionBackground';
import { cn } from '@/lib/utils';
import { StandardSectionHeader } from '@/components/info/StandardSectionHeader';

export function InstructorBioSection({ section }: { section: Section }) {
    // Expecting items[0] to be the main instructor data
    const instructor = section.items?.[0];
    if (!instructor) return null;

    return (
        <section className="py-24 relative overflow-hidden">
            <SectionBackground
                backgroundImage={section.backgroundImage}
                showDotPattern={section.showDotPattern}
                backgroundTheme={section.backgroundTheme}
                overlayOpacity={section.overlayOpacity}
            />
            <div className="container relative z-10 px-4 mx-auto">
                <StandardSectionHeader section={section} align="left" />

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl mx-auto">
                    {/* Visual - Circular Portrait */}
                    <div className="w-full lg:w-1/3 flex justify-center">
                        <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-4 rounded-full border border-dashed border-primary/40 animate-[spin_15s_linear_infinite_reverse]" />
                            <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl border-4 border-background">
                                <Image
                                    src={instructor.image || '/placeholder-avatar.jpg'}
                                    alt={instructor.title || 'Instructor'}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Name Badge */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card text-card-foreground px-6 py-3 rounded-full shadow-xl border text-center whitespace-nowrap flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <DynamicIcon name="Check" className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-sm tracking-wide">Verified Expert</span>
                            </div>
                        </div>
                    </div>

                    {/* Content - Experience Bubbles */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        {/* Instructor Identity (Name & Role) */}
                        <div className="space-y-2">
                            {instructor.subtitle && (
                                <h3 className="text-xl text-primary font-bold">{instructor.subtitle}</h3>
                            )}
                            {instructor.title && (
                                <h2 className="text-3xl md:text-4xl font-bold">{instructor.title}</h2>
                            )}
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="lead">{instructor.description}</p>
                        </div>

                        {instructor.features && Array.isArray(instructor.features) && (
                            <div className="grid gap-4">
                                {instructor.features.map((exp: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                            <DynamicIcon name={['Briefcase', 'Award', 'Star', 'TrendingUp'][i % 4]} className="h-6 w-6" />
                                        </div>
                                        <span className="font-bold text-lg">{exp}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
