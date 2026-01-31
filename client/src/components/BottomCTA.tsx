'use client';

import Link from 'next/link';
import { DotPatternBackground } from '@/components/ui/DotPatternBackground';
import { Button } from '@/components/Button';

interface BottomCTAProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonHref?: string;
}

export function BottomCTA({
    title = "Sẵn sàng bắt đầu?",
    subtitle = "Tham gia cùng 1000+ Member đã thay đổi sự nghiệp với Vibe Coding.",
    buttonText = "Đăng ký tham dự Khoá học miễn phí",
    buttonHref = "/courses"
}: BottomCTAProps) {
    return (
        <section className="py-12 md:py-16 bg-foreground text-background relative overflow-hidden">
            <DotPatternBackground className="text-background/20" />

            <div className="container text-center max-w-3xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    {title}
                </h2>
                <p className="text-lg md:text-xl text-background/80 mb-8 max-w-2xl mx-auto">
                    {subtitle}
                </p>
                <Link href={buttonHref}>
                    <Button
                        variant="light"
                        size="lg"
                        className="text-lg px-8 py-6 font-semibold text-foreground"
                    >
                        {buttonText}
                    </Button>
                </Link>
            </div>
        </section>
    );
}
