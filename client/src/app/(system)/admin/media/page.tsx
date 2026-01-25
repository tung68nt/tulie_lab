'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import {
    Search,
    Upload,
    Trash2,
    Copy,
    ExternalLink,
    FileText,
    FileVideo,
    FileImage,
    Loader2,
    MoreVertical,
    Check
} from 'lucide-react';
import { Badge } from '@/components/Badge';

interface MediaFile {
    key: string;
    url: string;
    size: number;
    lastModified: string;
}

export default function MediaManagerPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const { addToast } = useToast();
    const confirm = useConfirm();

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const res = await api.admin.media.list();
            if (res.success) {
                setFiles(res.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch media:', error);
            addToast('Không thể tải danh sách tệp tin', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        setUploading(true);
        try {
            const res = await api.uploads.multiple(selectedFiles);
            if (res.success) {
                addToast(`Đã tải lên ${res.data.length} tệp tin`, 'success');
                fetchFiles();
            }
        } catch (error: any) {
            addToast(error.message || 'Lỗi khi tải tệp tin lên', 'error');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (file: MediaFile) => {
        const confirmed = await confirm({
            title: 'Xóa tệp tin?',
            message: 'Hành động này không thể hoàn tác. Mọi liên kết đến tệp này sẽ bị hỏng.',
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });

        if (!confirmed) return;

        try {
            await api.admin.media.delete(file.key);
            addToast('Định dạng tệp đã được xóa', 'success');
            setFiles(files.filter(f => f.key !== file.key));
        } catch (error) {
            addToast('Có lỗi xảy ra khi xóa tệp', 'error');
        }
    };

    const copyToClipboard = (file: MediaFile) => {
        navigator.clipboard.writeText(file.url);
        setCopiedKey(file.key);
        addToast('Đã sao chép liên kết vào bộ nhớ tạm', 'success');
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filteredFiles = files.filter(file =>
        file.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFileIcon = (key: string) => {
        const ext = key.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return <FileImage className="w-8 h-8 text-neutral-400" />;
        if (['mp4', 'webm', 'mov'].includes(ext || '')) return <FileVideo className="w-8 h-8 text-neutral-400" />;
        return <FileText className="w-8 h-8 text-neutral-400" />;
    };

    const isImage = (key: string) => {
        const ext = key.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý media"
                subtitle="Xem và quản lý tất cả các tệp tin đã tải lên hệ thống."
            >
                <div className="flex gap-2">
                    <input
                        type="file"
                        id="media-upload"
                        className="hidden"
                        multiple
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <Button
                        variant="inverted"
                        onClick={() => document.getElementById('media-upload')?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4 mr-2" />
                        )}
                        Tải lên mới
                    </Button>
                </div>
            </AdminPageHeader>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm tệp tin..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Hiện có {files.length} tệp tin
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                    <p className="text-muted-foreground">Không tìm thấy tệp tin nào.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredFiles.map((file) => (
                        <Card key={file.key} className="overflow-hidden group hover:border-foreground/30 transition-all border-border/50">
                            <div className="aspect-square relative bg-muted/30 flex items-center justify-center overflow-hidden border-b">
                                {isImage(file.key) ? (
                                    <img
                                        src={file.url}
                                        alt={file.key}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                ) : (
                                    getFileIcon(file.key)
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                                    <button
                                        onClick={() => copyToClipboard(file)}
                                        className="p-1.5 bg-background rounded-md shadow-lg hover:scale-110 transition-transform"
                                        title="Sao chép URL"
                                    >
                                        {copiedKey === file.key ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => window.open(file.url, '_blank')}
                                        className="p-1.5 bg-background rounded-md shadow-lg hover:scale-110 transition-transform"
                                        title="Xem trực tiếp"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file)}
                                        className="p-1.5 bg-background text-red-600 rounded-md shadow-lg hover:scale-110 transition-transform"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <CardContent className="p-3">
                                <p className="text-xs font-medium truncate mb-1" title={file.key}>
                                    {file.key.replace('uploads/', '')}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground">{formatSize(file.size)}</span>
                                    {isImage(file.key) && <Badge variant="outline" className="text-[8px] px-1 h-3 uppercase border-muted-foreground/30 text-muted-foreground">Image</Badge>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
