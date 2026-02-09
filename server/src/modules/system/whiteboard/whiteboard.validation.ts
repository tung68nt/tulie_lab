import { z } from 'zod';
import { WhiteboardStatus } from '@prisma/client';

export const createWhiteboardSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
});

export const updateWhiteboardSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    status: z.nativeEnum(WhiteboardStatus).optional(),
    thumbnail: z.string().optional(), // Base64 string
});

export const addArtboardSchema = z.object({
    name: z.string().min(1).max(100).optional(),
});

export const saveArtboardSchema = z.object({
    elements: z.array(z.any()).optional(), // We allow array of any for elements for now, but ensure it IS an array
    appState: z.record(z.string(), z.any()).optional(), // Fixed: z.record requires key schema or value schema
});

export const saveSnapshotSchema = z.object({
    artboardId: z.string().uuid(),
    elements: z.array(z.any()).optional(),
});
