'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import dynamic from 'next/dynamic';

const BlockNoteEditor = dynamic(() => import('@/components/Editor/BlockNoteEditor'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-md" />
});

export default function DocsPage() {
    const { addToast } = useToast();
    const [title, setTitle] = useState('Hướng dẫn sử dụng hệ thống');
    const [content, setContent] = useState('# Chào mừng bạn đến với hệ thống Docs chuyên nghiệp\n\nĐây là trình soạn thảo **BlockNote** mới được tích hợp. Bạn có thể:\n\n- Soạn thảo kiểu Notion với dấu `/` (Slash commands)\n- Hỗ trợ định dạng văn bản chuyên nghiệp\n- Kéo thả các khối nội dung\n- Hỗ trợ Markdown và HTML');

    const handleSave = () => {
        // Here you would call your API to save the doc
        console.log('Saving Doc:', { title, content });
        addToast('Đã lưu tài liệu thành công!', 'success');
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Hệ thống Documentation"
                subtitle="Tạo và quản lý hướng dẫn, tài liệu chuyên nghiệp cho website"
            >
                <Button onClick={handleSave}>Lưu tài liệu</Button>
            </AdminPageHeader>

            <div className="grid gap-6">
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
            </div>
        </div>
    );
}
