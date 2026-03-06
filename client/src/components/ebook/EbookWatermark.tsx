'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface EbookWatermarkProps {
    email: string;
    width: number;
    height: number;
    className?: string;
    darkMode?: boolean;
}

export const EbookWatermark: React.FC<EbookWatermarkProps> = ({
    email,
    width,
    height,
    className,
    darkMode = false
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ensure canvas width and height match CSS size (avoid blur)
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);

        // Watermark settings
        const textColor = darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        ctx.fillStyle = textColor;
        ctx.font = 'bold 20px sans-serif'; // Must not use italic as per UI guidelines
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Get today's date
        const dateStr = new Date().toISOString().split('T')[0];
        const watermarkText = `${email} • ${dateStr}`;

        // Add 45 degree rotation
        ctx.translate(width / 2, height / 2);
        ctx.rotate(-Math.PI / 4);

        // Draw multiple copies across the canvas to ensure full coverage
        const spacing = 180; // Distance between texts
        const rows = Math.ceil(width / spacing) * 2;
        const cols = Math.ceil(height / spacing) * 2;

        for (let i = -rows; i <= rows; i++) {
            for (let j = -cols; j <= cols; j++) {
                // Stagger rows for better coverage
                const xOffset = j % 2 === 0 ? 0 : spacing / 2;
                ctx.fillText(
                    watermarkText,
                    i * spacing + xOffset,
                    j * spacing
                );
            }
        }

        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);

    }, [email, width, height, darkMode]);

    return (
        <canvas
            ref={canvasRef}
            className={cn(
                "absolute inset-0 z-50 pointer-events-none select-none",
                className
            )}
            style={{ width: `${width}px`, height: `${height}px` }}
            aria-hidden="true"
        />
    );
};
