import { z } from 'zod';

export const SectionSchema = z.object({
    id: z.string().or(z.number()).transform((val: string | number) => String(val)), // Accept string or number id
    type: z.string(), // hero, stats, etc.
    isVisible: z.boolean().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    // Allow flexible properties for different section types
}).passthrough();

export const LandingPageSectionsSchema = z.array(SectionSchema);

export const SystemSettingSchema = z.object({
    key: z.string(),
    value: z.any(),
    type: z.enum(['text', 'json', 'image']).optional()
});
