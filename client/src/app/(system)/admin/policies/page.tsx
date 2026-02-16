'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { useToast } from '@/contexts/ToastContext';
import { FileText } from 'lucide-react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

interface Policy {
    id: string;
    key: string;
    title: string;
    description: string;
}

const POLICIES: Policy[] = [
    { id: 'terms', key: 'policy_terms', title: 'Điều khoản sử dụng', description: 'Quy định và điều kiện sử dụng dịch vụ' },
    { id: 'privacy', key: 'policy_privacy', title: 'Chính sách bảo mật', description: 'Cách thức thu thập và bảo vệ dữ liệu người dùng' },
    { id: 'refund', key: 'policy_refund', title: 'Chính sách hoàn tiền', description: 'Điều kiện và quy trình hoàn trả học phí' },
    { id: 'payment', key: 'policy_payment_guide', title: 'Hướng dẫn thanh toán', description: 'Hướng dẫn các bước thanh toán đơn hàng' },
];

export default function AdminPoliciesPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState(POLICIES[0].id);
    const [contents, setContents] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadPolicies = async () => {
            try {
                const keys = POLICIES.map(p => p.key);
                const cms = await api.cms.get(keys) as Record<string, string>;
                setContents(cms || {});
            } catch (e) {
                console.error('Failed to load policies:', e);
                addToast('Không thể tải nội dung chính sách', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadPolicies();
    }, []);

    const handleSave = async () => {
        const activePolicy = POLICIES.find(p => p.id === activeTab);
        if (!activePolicy) return;

        setSaving(true);
        try {
            await api.admin.cms.update({
                key: activePolicy.key,
                value: contents[activePolicy.key] || '',
                type: 'markdown'
            });
            addToast(`Đã lưu ${activePolicy.title}!`, 'success');
        } catch (e) {
            console.error(e);
            addToast('Lưu thất bại', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-pulse text-muted-foreground">Đang tải...</div>
            </div>
        );
    }

    const currentPolicy = POLICIES.find(p => p.id === activeTab);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Chính sách & Điều khoản"
                subtitle="Quản lý các trang chính sách (Privacy, Terms, Refund...)"
                icon={<FileText className="w-8 h-8" />}
            >
                <Button onClick={handleSave} disabled={saving} className="font-semibold">
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </AdminPageHeader>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 space-y-1">
                    {POLICIES.map((policy) => (
                        <button
                            key={policy.id}
                            onClick={() => setActiveTab(policy.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === policy.id
                                ? 'bg-muted text-foreground border border-border/50 shadow-sm'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                }`}
                        >
                            {policy.title}
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="flex-1">
                    {currentPolicy && (
                        <Card className="border-zinc-200">
                            <CardHeader className="pb-4">
                                <CardTitle>{currentPolicy.title}</CardTitle>
                                <CardDescription>{currentPolicy.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-semibold text-foreground">Nội dung (Markdown)</label>
                                        <span className="text-[10px] text-muted-foreground font-mono">Hỗ trợ Markdown</span>
                                    </div>
                                    <textarea
                                        value={contents[currentPolicy.key] || ''}
                                        onChange={(e) => setContents({ ...contents, [currentPolicy.key]: e.target.value })}
                                        placeholder={`Nhập nội dung ${currentPolicy.title.toLowerCase()} tại đây...`}
                                        className="w-full min-h-[500px] p-4 text-sm font-mono border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring bg-muted/20 resize-y"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        * Bạn có thể sử dụng các ký tự Markdown như # H1, ## H2, - Danh sách, **Chữ đậm**, v.v.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
