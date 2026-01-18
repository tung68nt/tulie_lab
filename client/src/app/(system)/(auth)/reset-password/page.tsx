'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import { Logo } from '@/components/Logo';
import { useToast } from '@/contexts/ToastContext';
import { CircleCheck, Eye, EyeOff, CircleX } from 'lucide-react';

function ResetPasswordContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const { addToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            addToast('Link không hợp lệ hoặc đã hết hạn', 'error');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const password = formData.get('password') as string;
            const confirmPassword = formData.get('confirmPassword') as string;

            if (password !== confirmPassword) {
                addToast('Mật khẩu xác nhận không khớp!', 'error');
                setIsLoading(false);
                return;
            }

            if (password.length < 6) {
                addToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
                setIsLoading(false);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            if (res.ok) {
                setSuccess(true);
                addToast('Đặt lại mật khẩu thành công!', 'success');
            } else {
                const data = await res.json();
                addToast(data.message || 'Đã xảy ra lỗi', 'error');
            }
        } catch (error) {
            addToast('Đã xảy ra lỗi. Vui lòng thử lại.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
                <Card className="shadow-xl border-0 bg-card/80 backdrop-blur max-w-md w-full">
                    <CardContent className="py-12 text-center">
                        <div className="flex justify-center mb-4">
                            <CircleX className="h-16 w-16 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Link không hợp lệ</h2>
                        <p className="text-muted-foreground mb-6">Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
                        <Link href="/forgot-password">
                            <Button>Yêu cầu link mới</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Logo />
                </div>

                <Card className="shadow-xl border-0 bg-card/80 backdrop-blur">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl text-center">Đặt lại mật khẩu</CardTitle>
                        <CardDescription className="text-center">
                            Nhập mật khẩu mới cho tài khoản của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {success ? (
                            <div className="text-center py-8">
                                <div className="flex justify-center mb-4">
                                    <CircleCheck className="h-16 w-16 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Thành công!</h3>
                                <p className="text-muted-foreground mb-6">
                                    Mật khẩu của bạn đã được đặt lại thành công.
                                </p>
                                <Link href="/login">
                                    <Button className="w-full">Đăng nhập ngay</Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium">
                                        Mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            placeholder="Tối thiểu 6 ký tự"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="h-12 pr-12"
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Nhập lại mật khẩu"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            className="h-12 pr-12"
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <Button className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                        </>
                                    ) : "Đặt lại mật khẩu"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-0">
                        <div className="text-center text-sm text-muted-foreground">
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                ← Quay lại đăng nhập
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
