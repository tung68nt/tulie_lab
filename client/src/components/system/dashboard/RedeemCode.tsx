'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';

export function RedeemCode() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const handleRedeem = async () => {
        if (!code) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activation-codes/redeem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Lỗi kích hoạt mã');
            }

            addToast(`Kích hoạt thành công khoá học: ${data.courseTitle}`, 'success');
            setCode('');
            // Optional: Refresh page or Redirect
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-dashed border-primary/20 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                        <DynamicIcon name="Ticket" className="w-5 h-5 text-primary" />
                        Kích hoạt khoá học
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Nếu bạn đã mua mã kích hoạt hoặc được tặng, hãy nhập vào đây để bắt đầu học ngay.
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        className="flex-1 md:w-64 h-11 rounded-xl border border-input bg-background px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-semibold"
                        placeholder="VD: ACT-XXXX-XXXX"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                    />
                    <Button
                        onClick={handleRedeem}
                        disabled={isLoading || !code}
                        className="h-11 px-6 font-bold shadow-lg shadow-primary/10"
                    >
                        {isLoading ? (
                            <DynamicIcon name="Loader2" className="w-4 h-4 animate-spin" />
                        ) : 'Kích hoạt'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
