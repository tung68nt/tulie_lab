
import { BENEFITS_DATA } from '@/lib/benefits';
import { DynamicIcon } from '@/components/DynamicIcon';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BenefitPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return BENEFITS_DATA.map((benefit) => ({
        slug: benefit.slug,
    }));
}

export default async function BenefitPage({ params }: BenefitPageProps) {
    const { slug } = await params;

    // Find the benefit data
    const benefit = BENEFITS_DATA.find((item) => item.slug === slug);

    if (!benefit) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container">
                <Link
                    href="/#benefits"
                    className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại trang chủ
                </Link>

                <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            {benefit.icon && (
                                <DynamicIcon name={benefit.icon} className="w-10 h-10 md:w-12 md:h-12" />
                            )}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                                {benefit.title}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                {benefit.description}
                            </p>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="leading-relaxed">
                                    {benefit.content}
                                </p>
                                <p className="mt-4">
                                    Tại Tulie Academy, chúng tôi cam kết mang lại giá trị thực tế nhất cho học viên.
                                    {benefit.title} là một trong những ưu điểm vượt trội giúp bạn tự tin hơn trên con đường sự nghiệp.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
