import { Section } from '@/types/sections';

export const ProcessSection = ({ section }: { section: Section }) => {
    if (!section.items) return null;

    return (
        <section className="py-20 bg-background bg-dot-pattern">
            <div className="container px-4 mx-auto">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                    <p className="text-muted-foreground">{section.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {section.items.map((item, index) => (
                        <div key={index} className="relative">
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-primary opacity-20 mr-2">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <h3 className="text-xl font-bold inline-block">{item.title}</h3>
                            </div>
                            <p className="text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
