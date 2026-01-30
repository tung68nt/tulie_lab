'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
    fullWidth?: boolean;
}

export function FadeIn({
    children,
    delay = 0,
    className = "",
    direction = 'up',
    duration = 0.5,
    fullWidth = false
}: FadeInProps) {
    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: -40, y: 0 },
        right: { x: 40, y: 0 },
        none: { x: 0, y: 0 }
    };

    const initial = {
        opacity: 0,
        ...directions[direction]
    };

    return (
        <motion.div
            initial={initial}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
                duration: duration,
                delay: delay,
                ease: "easeOut"
            }}
            className={className}
            style={{ width: fullWidth ? '100%' : 'auto' }}
        >
            {children}
        </motion.div>
    );
}
