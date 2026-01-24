'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { CheckCircle2, Key, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ActivatePage() {
    const router = useRouter();
    const { addToast } = useToast();
    const { user } = useAuth();
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
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <Card className="max-w-md w-full border-primary/20 bg-primary/[0.02] text-center p-8">
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 rounded-full bg-emerald-100 text-emerald-600">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl mb-2">Kích hoạt thành công!</CardTitle>
                    <p className="text-muted-foreground mb-8">
                        Chúc mừng bạn đã kích hoạt thành công {successData.type === 'COURSE' ? 'khoá học' : 'sản phẩm'}.
                        Bạn có thể bắt đầu sử dụng ngay bây giờ.
                    </p>
                    <Button
                        size="lg"
                        className="w-full gap-2"
                        onClick={() => router.push(successData.type === 'COURSE' ? '/my-learning' : '/my-products')}
                    >
                        {successData.type === 'COURSE' ? 'Vào học ngay' : 'Xem sản phẩm ngay'}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] relative flex items-center justify-center px-4 overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-lg w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3 h-3" />
                        Mở khoá nội dung
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Kích hoạt tài khoản</h1>
                    <p className="text-muted-foreground">
                        Nhập mã kích hoạt bạn đã nhận được qua email hoặc thẻ quà tặng để bắt đầu học tập.
                    </p>
                </div>

                <Card className="border-border shadow-xl">
                    <CardContent className="pt-6">
                        <form onSubmit={handleRedeem} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold flex items-center gap-2">
                                    <Key className="w-4 h-4 text-primary" />
                                    Mã kích hoạt của bạn
                                </label>
                                <Input
                                    placeholder="Nhập mã gồm 8 ký tự (VD: ABCD1234)"
                                    className="text-lg font-mono uppercase text-center tracking-widest h-14 border-primary/20 focus:border-primary"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full font-bold h-12"
                                disabled={loading}
                            >
                                {loading ? 'Đang kiểm tra...' : 'Xác nhận kích hoạt'}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-dashed">
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                                <span className="p-1 rounded bg-zinc-100 dark:bg-zinc-800">💡</span>
                                Hướng dẫn nhanh
                            </h3>
                            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                                <li>Mã kích hoạt thường đi kèm khi bạn mua khoá học qua đối tác hoặc nhận quà tặng.</li>
                                <li>Mỗi mã chỉ có giá trị sử dụng một lần duy nhất cho một tài khoản.</li>
                                <li>Sau khi kích hoạt, nội dung sẽ được mở khoá vĩnh viễn trong tài khoản của bạn.</li>
                                <li>Nếu gặp khó khăn, vui lòng liên hệ <span className="text-primary font-medium">Hỗ trợ kỹ thuật</span>.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    Chưa có mã kích hoạt? <button onClick={() => router.push('/shop')} className="text-primary hover:underline font-medium">Khám phá khoá học & templates</button>
                </p>
            </div>
        </div>
    );
}
