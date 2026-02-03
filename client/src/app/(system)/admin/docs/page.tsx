'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const BlockNoteEditor = dynamic(() => import('@/components/Editor/BlockNoteEditor'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-md" />
});

export default function DocsPage() {
    const { addToast } = useToast();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadDocs = async () => {
            try {
                const settings = await api.admin.settings.get();
                if (settings) {
                    setTitle(settings.SYSTEM_DOC_TITLE || 'Hướng dẫn sử dụng hệ thống');
                    setContent(settings.SYSTEM_DOC_CONTENT || '# Chào mừng bạn đến với hệ thống Docs chuyên nghiệp\n\n...');
                }
            } catch (error) {
                console.error('Failed to load docs:', error);
                addToast('Không thể tải tài liệu', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        loadDocs();
    }, [addToast]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.admin.settings.update({
                SYSTEM_DOC_TITLE: title,
                SYSTEM_DOC_CONTENT: content
            });
            addToast('Đã lưu tài liệu thành công!', 'success');
        } catch (error) {
            console.error('Failed to save docs:', error);
            addToast('Lỗi khi lưu tài liệu', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Hệ thống Documentation"
                subtitle="Tạo và quản lý hướng dẫn, tài liệu chuyên nghiệp cho website"
            >
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang lưu...
                        </>
                    ) : (
                        'Lưu tài liệu'
                    )}
                </Button>
            </AdminPageHeader>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Đang tải tài liệu...</p>
                </div>
            ) : (
                <div className="grid gap-6 animate-in fade-in duration-500">
                    <Card>
                        <CardHeader>
                            <CardTitle>Biên tập tài liệu</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tiêu đề tài liệu</label>
                                <Input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề hướng dẫn..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nội dung chi tiết</label>
                                <div className="min-h-[500px]">
                                    <BlockNoteEditor
                                        initialContent={content}
                                        onChange={setContent}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
            )}
                </div>
            );
}
