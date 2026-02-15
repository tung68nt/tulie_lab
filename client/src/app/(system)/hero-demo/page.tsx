"use client";

import HeroCircleSection from "@/components/info/sections/HeroCircleSection";

export default function HeroDemoPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Placeholder */}
            <header className="h-16 border-b bg-white flex items-center px-8">
                <span className="font-bold text-lg">Tulie Academy Demo</span>
            </header>

            {/* Hero Section Demo */}
            <HeroCircleSection />

            {/* Content Placeholder */}
            <div className="flex-1 p-8 text-center text-gray-400">
                (Other content sections would go here)
            </div>
        </main>
    );
}
