'use client';
import { createContext, useContext } from 'react';

// Context for checking if section is in preview mode (e.g. editor)
export const SectionPreviewContext = createContext<boolean>(false);

export const useSectionPreview = () => useContext(SectionPreviewContext);
