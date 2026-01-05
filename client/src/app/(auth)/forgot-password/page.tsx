'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import { Logo } from '@/components/Logo';
import { useToast } from '@/contexts/ToastContext';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setEmailSent(true);
                addToast('Email đặt lại mật khẩu đã được gửi!', 'success');
            } else {
                addToast('Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email.', 'error');
            }
        } catch (error) {
            addToast('Đã xảy ra lỗi. Vui lòng thử lại sau.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Logo />
                </div>

                <Card className="shadow-xl border-0 bg-card/80 backdrop-blur">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl text-center">Quên mật khẩu?</CardTitle>
                        <CardDescription className="text-center">
                            Nhập email của bạn để nhận link đặt lại mật khẩu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {emailSent ? (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">📧</div>
                                <h3 className="text-xl font-semibold mb-2">Kiểm tra email của bạn!</h3>
                                <p className="text-muted-foreground mb-4">
                                    Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn.
                                    Vui lòng kiểm tra hộp thư (và cả thư rác).
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setEmailSent(false)}
                                    className="mt-2"
                                >
                                    Gửi lại email
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        required
                                        className="h-12"
                                    />
                                </div>
                                <Button className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang gửi...
                                        </>
                                    ) : "Gửi link đặt lại mật khẩu"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-0">
                        <div className="text-center text-sm text-muted-foreground">
                            Nhớ mật khẩu rồi?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
