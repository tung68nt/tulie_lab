'use client';
import { useEffect, useState } from 'react';

interface WatermarkProps {
    text: string;
    mode?: 'fixed' | 'absolute';
}

export function Watermark({ text, mode = 'fixed' }: WatermarkProps) {
    const [offset, setOffset] = useState(0);

    // Slowly move watermark to make it harder to ignore/remove? 
    // Or just static repeated pattern. Static is usually enough.
    // Let's make a grid.

    return (
        <div
            className={`${mode} inset-0 pointer-events-none z-[9999] overflow-hidden select-none`}
            aria-hidden="true"
        >
            <div
                className="absolute inset-0 flex flex-wrap content-start items-start opacity-[0.15] rotate-[-12deg] scale-110 origin-center"
                style={{ gap: '150px 100px', padding: '50px' }}
            >
                {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap font-bold text-xl text-black dark:text-white">
                        {text}
                    </div>
                ))}
            </div>
        </div>
    );
}
