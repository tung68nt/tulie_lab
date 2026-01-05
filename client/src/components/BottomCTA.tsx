'use client';

import Link from 'next/link';
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
    buttonText = "Đăng ký tham dự Workshop miễn phí",
    buttonHref = "/courses"
}: BottomCTAProps) {
    return (
        <section className="py-12 md:py-16 bg-foreground text-background relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.1)_35%,rgba(255,255,255,0.1)_65%,transparent_65%)] bg-[length:20px_20px]"></div>
            </div>

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
                        className="text-lg px-8 py-6 font-semibold"
                    >
                        {buttonText}
                    </Button>
                </Link>
            </div>
        </section>
    );
}
