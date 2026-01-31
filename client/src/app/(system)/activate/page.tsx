'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import { CheckCircle2, Key, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SectionBackground } from '@/components/info/SectionBackground';
import { SectionTag } from '@/components/SectionTag';
import { Card, CardContent } from '@/components/Card';
import { FadeIn } from '@/components/animations/FadeIn';

export default function ActivatePage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);

    const handleRedeem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            addToast('Vui lòng nhập mã kích hoạt', 'warning');
            return;
        }

        setLoading(true);
        try {
            const result: any = await api.activationCodes.redeem(code.trim().toUpperCase());
            setSuccessData(result);
            addToast('Kích hoạt thành công!', 'success');
        } catch (error: any) {
            addToast(error.message || 'Mã kích hoạt không hợp lệ hoặc đã sử dụng', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-white">
                <SectionBackground backgroundTheme="light" showDotPattern={true} />
                <FadeIn direction="up">
                    <div className="max-w-md w-full relative z-10 text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center shadow-xl">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900">
                            Kích hoạt thành công
                        </h1>
                        <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
                            Chúc mừng bạn đã kích hoạt thành công {successData.type === 'COURSE' ? 'khoá học' : 'sản phẩm'}.
                            Bây giờ bạn có thể bắt đầu khám phá ngay nội dung của mình.
                        </p>
                        <Button
                            size="lg"
                            className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-zinc-200"
                            onClick={() => router.push(successData.type === 'COURSE' ? '/my-learning' : '/my-products')}
                        >
                            {successData.type === 'COURSE' ? 'Vào học ngay' : 'Xem sản phẩm ngay'}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </FadeIn>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center py-20 px-4 overflow-hidden bg-white">
            <SectionBackground backgroundTheme="light" showDotPattern={true} />

            <div className="max-w-3xl w-full relative z-10 flex flex-col items-center">
                <FadeIn direction="up">
                    <div className="text-center space-y-6 mb-12">
                        <SectionTag variant="default" size="lg" showDot={true} animate={true}>
                            Mở khoá nội dung
                        </SectionTag>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">
                            Kích hoạt tài khoản
                        </h1>
                        <p className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed">
                            Nhập mã kích hoạt của bạn để bắt đầu học tập và trải nghiệm các sản phẩm từ Tulie.
                        </p>
                    </div>
                </FadeIn>

                <div className="max-w-md w-full">
                    <FadeIn direction="up" delay={0.2}>
                        <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 md:p-10 shadow-2xl shadow-zinc-100">
                            <form onSubmit={handleRedeem} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-zinc-400 px-1">
                                        Mã kích hoạt của bạn
                                    </label>
                                    <Input
                                        placeholder="ABCD 1234"
                                        className="text-2xl font-mono uppercase text-center tracking-[0.2em] h-16 rounded-2xl border-zinc-200 focus:border-zinc-900 focus:ring-0 transition-all bg-zinc-50/50"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-16 rounded-2xl font-bold text-base shadow-xl shadow-zinc-200 transition-transform active:scale-[0.98]"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xác thực...' : 'Xác nhận kích hoạt'}
                                </Button>
                            </form>

                            <div className="mt-12 pt-8 border-t border-zinc-100">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                                        Hướng dẫn
                                    </h3>
                                    <ul className="text-xs text-zinc-500 space-y-3 pl-3.5 leading-relaxed">
                                        <li>Mã kích hoạt có giá trị sử dụng một lần cho một tài khoản.</li>
                                        <li>Nội dung sẽ được mở khoá vĩnh viễn sau khi kích hoạt thành công.</li>
                                        <li>Kiểm tra email hoặc thẻ quà tặng để lấy mã 8 ký tự.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.4}>
                        <div className="mt-10 text-center space-y-4">
                            <p className="text-sm text-zinc-400">
                                Chưa có mã? <button onClick={() => router.push('/shop')} className="text-zinc-900 hover:underline font-bold">Khám phá khoá học</button>
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
