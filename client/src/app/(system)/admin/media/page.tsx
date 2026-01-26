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
    Check,
    Link,
    X,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react';
import { Badge } from '@/components/Badge';
import { cn } from '@/lib/utils';

interface MediaFile {
    key: string;
    url: string;
    size: number;
    mimeType?: string;
    name?: string;
}

export default function MediaManagerPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
    const [viewMode, setViewMode] = useState<'icon' | 'list'>('icon');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
            addToast('Đã xóa tệp tin thành công', 'success');
            setFiles(files.filter(f => f.key !== file.key));
            if (selectedFile?.key === file.key) setSelectedFile(null);
        } catch (error) {
            addToast('Có lỗi xảy ra khi xóa tệp', 'error');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast('Đã sao chép liên kết vào bộ nhớ tạm', 'success');
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isImage = (key: string, mimeType?: string) => {
        if (mimeType?.startsWith('image/')) return true;
        const ext = key.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
    };

    const isVideo = (key: string, mimeType?: string) => {
        if (mimeType?.startsWith('video/') || mimeType === 'application/x-mpegURL') return true;
        const ext = key.split('.').pop()?.toLowerCase();
        return ['mp4', 'webm', 'mov', 'm3u8'].includes(ext || '');
    };

    const getFileIcon = (file: MediaFile) => {
        if (isImage(file.key, file.mimeType)) return <FileImage className="w-10 h-10 text-primary/30" />;
        if (isVideo(file.key, file.mimeType)) return <FileVideo className="w-10 h-10 text-primary/30" />;
        return <FileText className="w-10 h-10 text-muted-foreground/30" />;
    };

    const filteredFiles = files.filter(file =>
        file.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const [showImportModal, setShowImportModal] = useState(false);
    const [importUrl, setImportUrl] = useState('');
    const [importName, setImportName] = useState('');
    const [importing, setImporting] = useState(false);

    const handleImportUrl = async () => {
        if (!importUrl) return;
        try {
            setImporting(true);
            const res = await api.uploads.importUrl({
                url: importUrl,
                name: importName || undefined
            });
            if (res.success) {
                addToast('Import media thành công', 'success');
                setShowImportModal(false);
                setImportUrl('');
                setImportName('');
                fetchFiles();
            }
        } catch (error: any) {
            addToast(error.message || 'Lỗi khi import media', 'error');
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý Media"
                subtitle="Xem và quản lý tất cả các tệp tin đã tải lên hệ thống."
            >
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowImportModal(true)}
                        disabled={uploading}
                        className="rounded-2xl shadow-sm"
                    >
                        <Link className="w-4 h-4 mr-2" />
                        Import URL
                    </Button>

                    <input
                        type="file"
                        id="media-upload"
                        className="hidden"
                        multiple
                        onChange={handleUpload}
                    />
                    <Button
                        variant="inverted"
                        onClick={() => document.getElementById('media-upload')?.click()}
                        disabled={uploading}
                        className="rounded-2xl shadow-md"
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4 mr-2" />
                        )}
                        Tải lên
                    </Button>
                </div>
            </AdminPageHeader>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                        <Input
                            placeholder="Tìm kiếm tệp tin..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 bg-muted/30 border-none rounded-2xl focus:ring-primary/10 transition-all h-12 text-sm"
                        />
                    </div>

                    <div className="flex items-center bg-muted/30 p-1.5 rounded-2xl border border-border/10 shadow-sm">
                        <button
                            onClick={() => setViewMode('icon')}
                            className={cn(
                                "p-2 rounded-xl transition-all duration-300",
                                viewMode === 'icon'
                                    ? "bg-background text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Dạng Icon"
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-xl transition-all duration-300",
                                viewMode === 'list'
                                    ? "bg-background text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Dạng Danh sách"
                        >
                            <ListIcon size={20} />
                        </button>
                    </div>
                </div>

                <div className="px-5 py-2.5 bg-muted/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border border-border/10 whitespace-nowrap">
                    Tổng cộng: <span className="text-foreground font-black">{files.length}</span> tệp tin
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="aspect-square bg-muted/40 rounded-[2rem] animate-pulse" />
                    ))}
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="text-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground font-medium">Không tìm thấy tệp tin nào.</p>
                </div>
            ) : viewMode === 'icon' ? (
                /* Pinterest-style Masonry Layout (B&W Simple Style) */
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6">
                    {filteredFiles.map((file) => (
                        <div key={file.key} className="break-inside-avoid mb-6">
                            <Card
                                className="overflow-hidden group hover:shadow-xl transition-all border-border/40 hover:border-foreground/20 rounded-2xl cursor-pointer bg-card/50"
                                onClick={() => setSelectedFile(file)}
                            >
                                <div className="relative bg-muted/5 flex items-center justify-center overflow-hidden">
                                    {isImage(file.key, file.mimeType) ? (
                                        <img
                                            src={file.url}
                                            alt={file.key}
                                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-48 flex flex-col items-center justify-center gap-3 w-full">
                                            {getFileIcon(file)}
                                            <Badge variant="outline" className="text-[10px] font-black border-muted-foreground/20 opacity-60">
                                                {file.mimeType?.split('/').pop()?.toUpperCase() || 'FILE'}
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <CardContent className="p-4">
                                    <p className="text-sm font-bold truncate mb-1 text-foreground/90">
                                        {file.name || file.key.split('/').pop()}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-muted-foreground/50">{formatSize(file.size)}</span>
                                        <Badge variant="secondary" className="px-2 py-0.5 h-auto text-[9px] font-black border-none bg-muted text-muted-foreground/80 lowercase">
                                            {file.key.startsWith('imported') ? 'liên kết' : 'local'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            ) : (
                /* WordPress-style List View (Elegant B&W) */
                <div className="bg-background border border-border/40 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/40 bg-muted/10">
                                    <th className="w-12 px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-border/50 text-foreground focus:ring-foreground cursor-pointer"
                                            checked={selectedItems.length === filteredFiles.length && filteredFiles.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedItems(filteredFiles.map(f => f.key));
                                                else setSelectedItems([]);
                                            }}
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Tệp tin</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Kích thước</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Loại tệp</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Nguồn</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFiles.map((file) => (
                                    <tr
                                        key={file.key}
                                        className="border-b border-border/10 hover:bg-muted/5 transition-colors group cursor-pointer"
                                        onClick={() => setSelectedFile(file)}
                                    >
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="rounded border-border/50 text-foreground focus:ring-foreground cursor-pointer"
                                                checked={selectedItems.includes(file.key)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedItems([...selectedItems, file.key]);
                                                    else setSelectedItems(selectedItems.filter(id => id !== file.key));
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl bg-muted/20 flex items-center justify-center overflow-hidden shrink-0 border border-border/10 group-hover:border-foreground/20 transition-colors">
                                                    {isImage(file.key, file.mimeType) ? (
                                                        <img src={file.url} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                                                            {getFileIcon(file)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-bold text-foreground/90 group-hover:text-foreground transition-colors truncate max-w-[300px]">
                                                        {file.name || file.key.split('/').pop()}
                                                    </span>
                                                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider truncate max-w-[250px] opacity-60">
                                                        {file.key}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-muted-foreground font-black">{formatSize(file.size)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                                                {file.mimeType?.split('/').pop() || 'FILE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className="px-2 py-0.5 h-auto text-[9px] font-black border-none bg-muted text-muted-foreground/80 lowercase">
                                                {file.key.startsWith('imported') ? 'liên kết' : 'local'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 duration-300">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 rounded-lg hover:bg-foreground hover:text-background transition-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyToClipboard(file.url);
                                                    }}
                                                >
                                                    <Copy size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 rounded-lg hover:bg-red-500 hover:text-white transition-all text-red-500"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(file);
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Media Details Modal */}
            {selectedFile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedFile(null)} />
                    <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-[3rem] border-border/50 animate-in zoom-in-95 duration-300">
                        {/* Preview Area */}
                        <div className="flex-1 bg-black/5 flex items-center justify-center min-h-[300px] relative overflow-hidden">
                            {isImage(selectedFile.key, selectedFile.mimeType) ? (
                                <img
                                    src={selectedFile.url}
                                    alt={selectedFile.key}
                                    className="w-full h-full object-contain"
                                />
                            ) : isVideo(selectedFile.key, selectedFile.mimeType) ? (
                                <video
                                    src={selectedFile.url}
                                    controls
                                    className="max-w-full max-h-full"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    {getFileIcon(selectedFile)}
                                    <span className="text-muted-foreground font-medium">Bản xem trước không khả dụng cho loại tệp này</span>
                                </div>
                            )}

                            <button
                                onClick={() => setSelectedFile(null)}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-background/50 hover:bg-background backdrop-blur-md flex items-center justify-center transition-all border border-black/5 shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Info Area */}
                        <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-card">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Badge className="bg-foreground/5 text-foreground border-none text-[10px] font-black tracking-[0.2em] uppercase px-3">
                                        Chi tiết tệp
                                    </Badge>
                                    <h2 className="text-lg font-black tracking-tight leading-snug line-clamp-3 text-foreground/90">
                                        {selectedFile.name || selectedFile.key.split('/').pop()}
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Kích thước</span>
                                        <p className="text-sm font-bold">{formatSize(selectedFile.size)}</p>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Loại tệp (MIME)</span>
                                        <p className="text-sm font-bold">{selectedFile.mimeType || 'N/A'}</p>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Đường dẫn đầy đủ</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <code className="text-[10px] bg-muted px-2 py-1.5 rounded-lg flex-1 truncate font-mono text-muted-foreground/70">
                                                {selectedFile.url}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(selectedFile.url)}
                                                className="p-2 hover:bg-muted rounded-xl transition-colors shrink-0 border border-border/40"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-8 border-t border-border/50">
                                <Button
                                    variant="inverted"
                                    className="w-full rounded-2xl h-12 font-black tracking-widest uppercase text-xs shadow-lg shadow-black/5"
                                    onClick={() => window.open(selectedFile.url, '_blank')}
                                >
                                    <ExternalLink size={16} className="mr-2" />
                                    Mở tab mới
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-2xl h-12 font-black tracking-widest uppercase text-xs text-red-500 hover:text-white hover:bg-red-500 border-red-100 hover:border-red-500 transition-all"
                                    onClick={() => handleDelete(selectedFile)}
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Xóa vĩnh viễn
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Existing Import Modal (Refined) */}
            {showImportModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowImportModal(false)} />
                    <div className="relative bg-card border rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 space-y-6 animate-in zoom-in-95">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black tracking-tight uppercase">Import từ URL</h3>
                            <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-muted rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">URL tệp tin</label>
                                <Input
                                    placeholder="https://"
                                    value={importUrl}
                                    onChange={(e) => setImportUrl(e.target.value)}
                                    className="rounded-xl border-border/40 focus:ring-primary/10 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Tên ghi nhớ (Tùy chọn)</label>
                                <Input
                                    placeholder="Thumbnail..."
                                    value={importName}
                                    onChange={(e) => setImportName(e.target.value)}
                                    className="rounded-xl border-border/40 focus:ring-primary/10 h-11"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1 rounded-2xl h-12" onClick={() => setShowImportModal(false)}>Hủy</Button>
                            <Button className="flex-1 rounded-2xl h-12 font-bold" onClick={handleImportUrl} disabled={!importUrl || importing}>
                                {importing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Link size={16} className="mr-2" />}
                                Bắt đầu Import
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
