import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\u00C0-\u1EF9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
