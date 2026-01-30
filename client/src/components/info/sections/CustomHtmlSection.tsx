import React from 'react';
import { Section } from '@/types/sections';
import { cn } from '@/lib/utils';

import { SectionBackground } from '../SectionBackground';
import { motion } from 'framer-motion';

export function CustomHtmlSection({ section }: { section: Section }) {
    if (!section.html) return null;

    return (
        <section className={cn("relative overflow-hidden", section.className)}>
            <SectionBackground
                backgroundImage={section.backgroundImage}
                backgroundTheme={section.backgroundTheme || 'light'}
                overlayOpacity={section.overlayOpacity}
                glowVariant={section.glowVariant}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 custom-html-section"
                dangerouslySetInnerHTML={{ __html: section.html }}
            />
        </section>
    );
}
