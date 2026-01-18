import React from 'react';
import { Section } from '@/types/sections';

export function CustomHtmlSection({ section }: { section: Section }) {
    if (!section.html) return null;

    return (
        <div
            className="custom-html-section"
            dangerouslySetInnerHTML={{ __html: section.html }}
        />
    );
}
