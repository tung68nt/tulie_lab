'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import { Mail, Eye, Code, Save, Settings, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';
import { Switch } from '@/components/Switch';
import { api } from '@/lib/api';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

// Default email templates
const defaultTemplates: Record<string, { subject: string; html: string }> = {
    passwordReset: {
        subject: 'Đặt lại mật khẩu - The Tulie Lab',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fff;">
    <div style="border: 1px solid #e0e0e0; padding: 40px;">
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 30px 0; color: #000;">The Tulie Lab</h1>
        <p style="font-size: 16px; margin: 0 0 20px 0;">Xin chào \${userName},</p>
        <p style="font-size: 14px; color: #333; margin: 0 0 10px 0;">Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
        <p style="font-size: 14px; color: #333; margin: 0 0 30px 0;">Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
        <div style="margin: 30px 0;">
            <a href="\${resetLink}" style="background-color: #000; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                Đặt lại mật khẩu
            </a>
        </div>
        <p style="font-size: 13px; color: #666; margin: 30px 0 10px 0;">Link này sẽ hết hạn sau 1 giờ.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
        <p style="font-size: 12px; color: #999; margin: 0;">© 2024 The Tulie Lab. Học để làm được, không chỉ để biết.</p>
    </div>
</body>
</html>`
    },
    welcomeEmail: {
        subject: 'Chào mừng đến với The Tulie Lab',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fff;">
    <div style="border: 1px solid #e0e0e0; padding: 40px;">
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 30px 0; color: #000;">The Tulie Lab</h1>
        <p style="font-size: 16px; margin: 0 0 20px 0;">Chào mừng \${userName}!</p>
        <p style="font-size: 14px; color: #333; margin: 0 0 10px 0;">Cảm ơn bạn đã đăng ký tài khoản tại The Tulie Lab.</p>
        <p style="font-size: 14px; color: #333; margin: 0 0 30px 0;">Bạn đã sẵn sàng bắt đầu hành trình học tập của mình.</p>
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
            <p style="font-weight: 600; margin: 0 0 15px 0; font-size: 14px;">Bắt đầu ngay:</p>
            <ul style="color: #333; padding-left: 20px; margin: 0; font-size: 14px;">
                <li style="margin-bottom: 8px;">Khám phá các khóa học chất lượng cao</li>
                <li style="margin-bottom: 8px;">Học từ giảng viên giàu kinh nghiệm</li>
                <li>Thực hành với các dự án thực tế</li>
            </ul>
        </div>
        <div style="margin: 30px 0;">
            <a href="\${loginLink}" style="background-color: #000; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                Khám phá khóa học
            </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
        <p style="font-size: 12px; color: #999; margin: 0;">© 2024 The Tulie Lab. Học để làm được, không chỉ để biết.</p>
    </div>
</body>
</html>`
    },
    paymentSuccess: {
        subject: 'Thanh toán thành công - The Tulie Lab',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fff;">
    <div style="border: 1px solid #e0e0e0; padding: 40px;">
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 30px 0; color: #000;">The Tulie Lab</h1>
        <p style="font-size: 16px; margin: 0 0 20px 0;">Xin chào \${userName},</p>
        <p style="font-size: 14px; color: #333; margin: 0 0 20px 0;">Thanh toán của bạn đã được xác nhận thành công!</p>
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
            <p style="font-weight: 600; margin: 0 0 10px 0; font-size: 14px;">Thông tin đơn hàng:</p>
            <p style="font-size: 14px; margin: 0;">Mã đơn: <strong>\${orderCode}</strong></p>
            <p style="font-size: 14px; margin: 10px 0 0 0;">Khóa học: <strong>\${courses}</strong></p>
        </div>
        <div style="margin: 30px 0;">
            <a href="\${dashboardLink}" style="background-color: #000; color: #fff; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                Vào học ngay
            </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
        <p style="font-size: 12px; color: #999; margin: 0;">© 2024 The Tulie Lab. Học để làm được, không chỉ để biết.</p>
    </div>
</body>
</html>`
    },
    orderConfirmation: {
        subject: 'Xác nhận đơn hàng #${orderCode} - The Tulie Lab',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="border: 1px solid #e0e0e0; padding: 40px;">
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 30px 0;">The Tulie Lab</h1>
        <p style="font-size: 16px; margin: 0 0 20px 0;">Xác nhận đơn hàng #\${orderCode}</p>
        <p style="font-size: 14px; color: #333;">Cảm ơn bạn đã đặt hàng. Vui lòng thanh toán để hoàn tất đăng ký.</p>
        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
            <p style="font-size: 14px; margin: 0;"><strong>Tổng tiền:</strong> \${amount}</p>
            <p style="font-size: 14px; margin: 10px 0 0 0;"><strong>Khóa học:</strong> \${courses}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0 20px 0;">
        <p style="font-size: 12px; color: #999; margin: 0;">© 2024 The Tulie Lab</p>
    </div>
</body>
</html>`
    },
};

const templateList = [
    { id: 'passwordReset', name: 'Đặt lại mật khẩu', variables: ['userName', 'resetLink'] },
    { id: 'welcomeEmail', name: 'Chào mừng thành viên', variables: ['userName', 'loginLink'] },
    { id: 'paymentSuccess', name: 'Thanh toán thành công', variables: ['userName', 'orderCode', 'courses', 'dashboardLink'] },
    { id: 'orderConfirmation', name: 'Xác nhận đơn hàng', variables: ['orderCode', 'amount', 'courses'] },
];

export default function AdminEmailsPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [activeTab, setActiveTab] = useState<'templates' | 'smtp'>('templates');
    const [selectedTemplate, setSelectedTemplate] = useState(templateList[0].id);
    const [templates, setTemplates] = useState<Record<string, { subject: string; html: string }>>(defaultTemplates);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    // SMTP Settings
    const [smtpSettings, setSmtpSettings] = useState({
        smtp_host: 'smtp.gmail.com',
        smtp_port: '587',
        smtp_user: '',
        smtp_pass: '',
        smtp_from: '',
        smtp_secure: 'false',
        admin_notification_email: '',
    });

    // Load saved templates and SMTP from settings
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings: any = await api.admin.settings.get();

                // Load SMTP
                setSmtpSettings({
                    smtp_host: settings.smtp_host || 'smtp.gmail.com',
                    smtp_port: settings.smtp_port || '587',
                    smtp_user: settings.smtp_user || '',
                    smtp_pass: settings.smtp_pass || '',
                    smtp_from: settings.smtp_from || '',
                    smtp_secure: settings.smtp_secure || 'false',
                    admin_notification_email: settings.admin_notification_email || '',
                });

                // Load saved templates
                const loadedTemplates = { ...defaultTemplates };
                templateList.forEach(t => {
                    const savedSubject = settings[`email_${t.id}_subject`];
                    const savedHtml = settings[`email_${t.id}_html`];
                    if (savedSubject || savedHtml) {
                        loadedTemplates[t.id] = {
                            subject: savedSubject || defaultTemplates[t.id]?.subject || '',
                            html: savedHtml || defaultTemplates[t.id]?.html || '',
                        };
                    }
                });
                setTemplates(loadedTemplates);
            } catch (error) {
                console.error('Failed to load settings', error);
            }
        };
        loadSettings();
    }, []);

    const handleSaveTemplate = async () => {
        setLoading(true);
        try {
            const current = templates[selectedTemplate];
            await api.admin.settings.update({
                [`email_${selectedTemplate}_subject`]: current.subject,
                [`email_${selectedTemplate}_html`]: current.html,
            });
            addToast('Đã lưu template email', 'success');
        } catch (error) {
            addToast('Lỗi khi lưu template', 'error');
        } finally {
            setLoading(false);
        }
    };

    const [emailTestLoading, setEmailTestLoading] = useState(false);

    const handleSaveSMTP = async () => {
        setLoading(true);
        try {
            await api.admin.settings.update(smtpSettings);
            addToast('Đã lưu cấu hình SMTP', 'success');
        } catch (error) {
            addToast('Lỗi khi lưu SMTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTestEmail = async () => {
        setEmailTestLoading(true);
        try {
            const res = await api.admin.settings.testEmail(smtpSettings.admin_notification_email);
            addToast(res.message || 'Đã gửi email thử nghiệm thành công!', 'success');
        } catch (error: any) {
            addToast(error.message || 'Lỗi gửi email thử nghiệm', 'error');
        } finally {
            setEmailTestLoading(false);
        }
    };

    const handleResetTemplate = async () => {
        const confirmed = await confirm({
            title: 'Khôi phục template',
            message: 'Bạn có chắc muốn khôi phục template về mặc định? Các thay đổi sẽ bị mất.',
            variant: 'warning',
            confirmText: 'Khôi phục',
            cancelText: 'Hủy'
        });

        if (confirmed) {
            setTemplates(prev => ({
                ...prev,
                [selectedTemplate]: defaultTemplates[selectedTemplate],
            }));
            addToast('Đã khôi phục template mặc định', 'info');
        }
    };

    const currentTemplate = templates[selectedTemplate] || { subject: '', html: '' };
    const currentInfo = templateList.find(t => t.id === selectedTemplate);

    // Preview with sample variables
    const getPreviewHtml = () => {
        let html = currentTemplate.html;
        const sampleData: Record<string, string> = {
            userName: 'Nguyễn Văn A',
            resetLink: 'https://example.com/reset/abc123',
            loginLink: 'https://example.com/login',
            orderCode: 'ORD-2024-001',
            amount: '1,500,000đ',
            courses: 'Khóa học AI cơ bản',
            dashboardLink: 'https://example.com/dashboard',
        };
        Object.entries(sampleData).forEach(([key, value]) => {
            html = html.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
        });
        return html;
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Emails & Templates"
                subtitle="Quản lý template email và cấu hình gửi mail (SMTP)"
                icon={<Mail className="w-8 h-8" />}
            />

            {/* Tabs */}
            <div className="flex gap-6 border-b">
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'templates' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Email Templates
                </button>
                <button
                    onClick={() => setActiveTab('smtp')}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'smtp' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Cấu hình SMTP
                </button>
            </div>

            {activeTab === 'templates' && (
                <div className="grid lg:grid-cols-[280px_1fr] gap-6">
                    {/* Template List */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground mb-3">Chọn template</p>
                        {templateList.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${selectedTemplate === t.id ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted border-border'}`}
                            >
                                <span className="font-medium text-sm">{t.name}</span>
                                <span className="block text-xs opacity-70 mt-0.5">{t.id}</span>
                            </button>
                        ))}
                    </div>

                    {/* Editor */}
                    <div className="space-y-4">
                        {/* Subject */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tiêu đề email (Subject)</label>
                            <Input
                                value={currentTemplate.subject}
                                onChange={(e) => setTemplates(prev => ({
                                    ...prev,
                                    [selectedTemplate]: { ...prev[selectedTemplate], subject: e.target.value }
                                }))}
                                placeholder="Tiêu đề email"
                            />
                        </div>

                        {/* Variables hint */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-muted-foreground">Variables:</span>
                            {currentInfo?.variables.map(v => (
                                <code key={v} className="text-xs bg-muted px-2 py-0.5 rounded">{`\${${v}}`}</code>
                            ))}
                        </div>

                        {/* Toggle Preview */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground"
                            >
                                {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                {showPreview ? 'Ẩn' : 'Hiện'} Preview
                            </button>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleResetTemplate}>
                                    Reset mặc định
                                </Button>
                                <Button size="sm" onClick={handleSaveTemplate} disabled={loading}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Lưu template
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Code Editor */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Code className="w-4 h-4" />
                                    <span className="text-sm font-medium">HTML Code</span>
                                </div>
                                <textarea
                                    value={currentTemplate.html}
                                    onChange={(e) => setTemplates(prev => ({
                                        ...prev,
                                        [selectedTemplate]: { ...prev[selectedTemplate], html: e.target.value }
                                    }))}
                                    className="w-full h-[300px] font-mono text-xs p-4 border rounded-lg bg-zinc-950 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
                                    spellCheck={false}
                                />
                            </div>

                            {/* Preview */}
                            {showPreview && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm font-medium">Preview</span>
                                    </div>
                                    <div className="border rounded-lg overflow-hidden bg-white h-[650px]">
                                        <iframe
                                            srcDoc={getPreviewHtml()}
                                            className="w-full h-full"
                                            title="Email Preview"
                                            sandbox=""
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'smtp' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Cấu hình SMTP</CardTitle>
                        <CardDescription>Thiết lập server gửi email</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SMTP Host</label>
                                <Input
                                    value={smtpSettings.smtp_host}
                                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                                    placeholder="smtp.gmail.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SMTP Port</label>
                                <Input
                                    value={smtpSettings.smtp_port}
                                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
                                    placeholder="587"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SMTP User (Email)</label>
                                <Input
                                    value={smtpSettings.smtp_user}
                                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_user: e.target.value }))}
                                    placeholder="your-email@gmail.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SMTP Password (App Password)</label>
                                <Input
                                    type="password"
                                    value={smtpSettings.smtp_pass}
                                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_pass: e.target.value }))}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email gửi đi (From)</label>
                                <Input
                                    value={smtpSettings.smtp_from}
                                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_from: e.target.value }))}
                                    placeholder="The Tulie Lab <noreply@tulielab.com>"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email nhận thông báo Admin</label>
                                <Input
                                    value={smtpSettings.admin_notification_email}
                                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, admin_notification_email: e.target.value }))}
                                    placeholder="admin@tulielab.com"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="smtp_secure"
                                    checked={smtpSettings.smtp_secure === 'true'}
                                    onCheckedChange={(checked) => setSmtpSettings(prev => ({ ...prev, smtp_secure: checked ? 'true' : 'false' }))}
                                />
                                <label htmlFor="smtp_secure" className="text-sm cursor-pointer select-none font-medium">
                                    SSL/TLS (Port 465)
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between gap-2 border-t">
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    disabled={emailTestLoading || !smtpSettings.smtp_host || !smtpSettings.smtp_user}
                                    onClick={handleTestEmail}
                                >
                                    {emailTestLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={14} />}
                                    Gửi email thử nghiệm
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    Gửi email test tới Admin Email.
                                </p>
                            </div>
                            <Button onClick={handleSaveSMTP} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" />
                                Lưu cấu hình SMTP
                            </Button>
                        </div>

                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium mb-2">Hướng dẫn cấu hình Gmail:</p>
                            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                                <li>Bật xác thực 2 bước trong Google Account</li>
                                <li>Tạo App Password: Google Account → Security → App passwords</li>
                                <li>Chọn "Mail" và tạo password 16 ký tự</li>
                                <li>Điền password đó vào ô SMTP Password ở trên</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
