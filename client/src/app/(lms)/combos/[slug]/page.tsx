'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { HeroSection } from '@/components/info/sections/HeroSection';
import { CurriculumSection } from '@/components/info/sections/CurriculumSection';
import { DarkCTASection } from '@/components/info/sections/DarkCTASection';

export default function ComboLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
    const [bundle, setBundle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [data, userProfile] = await Promise.all([
                    api.bundles.get(slug),
                    api.users.getProfile().catch(() => null)
                ]);
                setBundle(data);
                setIsLoggedIn(!!userProfile);
            } catch (e) {
                console.error(e);
                addToast('Không tìm thấy thông tin combo', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    if (loading) return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    );

    if (!bundle) return <div className="container py-20 text-center text-xl">Không tìm thấy combo</div>;

    const courses = bundle.courses?.map((bc: any) => bc.course) || [];

    // Map bundle data to section props
    const heroSection = {
        title: bundle.name,
        subtitle: bundle.description,
        tag: "🚀 Combo Lộ trình Chuyên sâu",
        ctaText: "Đăng ký Combo ngay",
        backgroundImage: "",
        showDotPattern: true,
        backgroundTheme: 'dark',
        overlayOpacity: 0.5,
        trustIndicators: ['Truy cập trọn đời', 'Hỗ trợ 24/7', 'Chứng chỉ hoàn thành']
    };

    const curriculumSection: any = {
        title: "Lộ trình học tập Chuyên sâu",
        subtitle: "Các khóa học được sắp xếp theo trình tự logic, giúp bạn nắm vững kiến thức từ nền tảng đến chuyên sâu theo lộ trình bài bản.",
        items: courses.map((course: any) => ({
            title: course.title,
            description: course.description,
            image: course.thumbnail,
            lessons: course.lessons?.map((l: any) => l.title) || []
        }))
    };

    const ctaSection = {
        title: "Bắt đầu hành trình của bạn ngay hôm nay",
        subtitle: `Sở hữu trọn bộ ${courses.length} khóa học chuyên sâu với lộ trình được thiết kế tối ưu, giúp bạn đạt mục tiêu nhanh hơn.`,
        ctaText: "Đăng ký ngay",
        ctaLink: "#payment-section",
        backgroundTheme: 'dark'
    };

    return (
        <div className="min-h-screen bg-background">
            <HeroSection section={heroSection} mainCourse={bundle} />

            <CurriculumSection section={curriculumSection} />

            <div id="payment-section">
                <DarkCTASection section={ctaSection} mainCourse={bundle} />
            </div>
        </div>
    );
}
