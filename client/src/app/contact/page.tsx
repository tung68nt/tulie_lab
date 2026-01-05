'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Loader2 } from 'lucide-react';

export default function ContactPage() {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState<any>({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        industry: '',
        message: ''
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res: any = await api.settings.getPublic();
                setSettings(res);
            } catch (error) {
                console.error('Failed to load settings', error);
            }
        };
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('Submitting contact form...', formData);
        try {
            await api.contact.submit(formData);
            console.log('Submission successful, attempting to show toast');
            addToast("Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất có thể.", 'success');
            setFormData({ name: '', email: '', phone: '', industry: '', message: '' });
        } catch (error: any) {
            console.error('Submission failed', error);
            addToast(error.message || "Không thể gửi tin nhắn. Vui lòng thử lại sau.", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container pt-6 md:pt-12" style={{ paddingBottom: '120px' }}>
            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Liên hệ với chúng tôi</CardTitle>
                        <CardDescription>
                            Bạn có câu hỏi? Chúng tôi rất muốn nghe từ bạn. Gửi tin nhắn và chúng tôi sẽ phản hồi sớm nhất có thể.
                            <br />
                            <span className="text-xs text-muted-foreground/70 mt-2 inline-block">(* là trường bắt buộc cần điền)</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Họ và tên <span className="text-foreground">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        placeholder="Nhập họ và tên"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email <span className="text-foreground">*</span>
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Nhập địa chỉ email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Số điện thoại <span className="text-foreground">*</span>
                                    </label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Nhập số điện thoại"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="industry" className="text-sm font-medium">
                                        Ngành nghề / Lĩnh vực
                                    </label>
                                    <Input
                                        id="industry"
                                        placeholder="VD: Marketing, IT, Giáo dục..."
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">
                                    Tin nhắn <span className="text-foreground">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Chúng tôi có thể giúp gì cho bạn?"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <Button className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Gửi tin nhắn
                            </Button>
                        </form>

                        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                            <p>Hoặc liên hệ trực tiếp qua:</p>
                            <div className="mt-2 font-medium text-foreground">
                                {settings.contact_hotline && (
                                    <>Hotline: {settings.contact_hotline} <br /></>
                                )}
                                {settings.contact_zalo && (
                                    <>Zalo: {settings.contact_zalo} <br /></>
                                )}
                                {settings.contact_email_public && (
                                    <>Email: {settings.contact_email_public}</>
                                )}
                                {!settings.contact_hotline && !settings.contact_zalo && !settings.contact_email_public && (
                                    <>
                                        Hotline: 1800-TULIE-ACADEMY (Default) <br />
                                        Zalo: 0999-999-999 (Default)
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
