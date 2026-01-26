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

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Tìm kiếm tệp tin..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 bg-zinc-50 border-zinc-100 rounded-[1.25rem] focus:ring-zinc-100 transition-all h-12 text-sm"
                        />
                    </div>

                    <div className="flex items-center bg-zinc-50 p-1.5 rounded-[1.25rem] border border-zinc-100 shadow-sm">
                        <button
                            onClick={() => setViewMode('icon')}
                            className={cn(
                                "p-2 rounded-xl transition-all duration-300",
                                viewMode === 'icon'
                                    ? "bg-white text-zinc-900 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-600"
                            )}
                            title="Dạng Grid"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-xl transition-all duration-300",
                                viewMode === 'list'
                                    ? "bg-white text-zinc-900 shadow-sm"
                                    : "text-zinc-400 hover:text-zinc-600"
                            )}
                            title="Dạng List"
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                </div>

                <div className="px-5 py-2.5 bg-zinc-50 rounded-2xl text-[11px] font-medium text-zinc-500 border border-zinc-100 whitespace-nowrap">
                    Tổng cộng: <span className="text-zinc-900 font-semibold">{files.length}</span> tệp tin
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
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-8">
                    {filteredFiles.map((file) => (
                        <div key={file.key} className="break-inside-avoid mb-8">
                            <Card
                                className="overflow-hidden group hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 border-zinc-100/60 hover:border-zinc-200 rounded-[2rem] cursor-pointer bg-white"
                                onClick={() => setSelectedFile(file)}
                            >
                                <div className="relative bg-zinc-50 flex items-center justify-center overflow-hidden">
                                    {isImage(file.key, file.mimeType) ? (
                                        <img
                                            src={file.url}
                                            alt={file.key}
                                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="h-56 flex flex-col items-center justify-center gap-4 w-full">
                                            <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-600 transition-colors">
                                                {getFileIcon(file)}
                                            </div>
                                            <Badge variant="outline" className="text-[9px] font-medium border-zinc-200 text-zinc-500 bg-white">
                                                {file.mimeType?.split('/').pop()?.toUpperCase() || 'FILE'}
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <CardContent className="p-5">
                                    <p className="text-[13px] font-semibold truncate mb-1.5 text-zinc-900 pr-2">
                                        {file.name || file.key.split('/').pop()}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-medium text-zinc-400">{formatSize(file.size)}</span>
                                            <div className="w-0.5 h-0.5 rounded-full bg-zinc-200" />
                                            <span className="text-[10px] font-medium text-zinc-400 lowercase">
                                                {file.mimeType?.split('/').pop() || 'file'}
                                            </span>
                                        </div>
                                        <Badge variant="secondary" className="px-1.5 py-0 h-4 text-[8px] font-semibold border-none bg-zinc-50 text-zinc-400 lowercase rounded-md">
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
                <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-50 bg-zinc-50/30">
                                    <th className="w-12 px-8 py-5">
                                        <input
                                            type="checkbox"
                                            className="rounded border-zinc-200 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                                            checked={selectedItems.length === filteredFiles.length && filteredFiles.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedItems(filteredFiles.map(f => f.key));
                                                else setSelectedItems([]);
                                            }}
                                        />
                                    </th>
                                    <th className="px-6 py-5 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Tệp tin</th>
                                    <th className="px-6 py-5 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Kích thước</th>
                                    <th className="px-6 py-5 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Loại tệp</th>
                                    <th className="px-6 py-5 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Nguồn</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFiles.map((file) => (
                                    <tr
                                        key={file.key}
                                        className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors group cursor-pointer"
                                        onClick={() => setSelectedFile(file)}
                                    >
                                        <td className="px-8 py-5" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="rounded border-zinc-200 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                                                checked={selectedItems.includes(file.key)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedItems([...selectedItems, file.key]);
                                                    else setSelectedItems(selectedItems.filter(id => id !== file.key));
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-100 group-hover:border-zinc-200 transition-colors">
                                                    {isImage(file.key, file.mimeType) ? (
                                                        <img src={file.url} className="w-full h-full object-contain p-1" alt="" />
                                                    ) : (
                                                        <div className="text-zinc-300 group-hover:text-zinc-500 transition-colors">
                                                            {getFileIcon(file)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-zinc-900 truncate max-w-[300px]">
                                                        {file.name || file.key.split('/').pop()}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[250px] mt-0.5">
                                                        {file.key}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs text-zinc-500 font-medium">{formatSize(file.size)}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-semibold text-zinc-400 lowercase tracking-wide">
                                                {file.mimeType?.split('/').pop() || 'file'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="secondary" className="px-2 py-0.5 h-auto text-[9px] font-medium border-none bg-zinc-50 text-zinc-400 lowercase rounded-md">
                                                {file.key.startsWith('imported') ? 'liên kết' : 'local'}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-9 h-9 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-all"
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
                                                    className="w-9 h-9 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-red-400"
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-zinc-900/10 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setSelectedFile(null)} />
                    <Card className="relative w-full max-w-5xl max-h-[90vh] overflow-visible flex flex-col md:flex-row shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[3rem] border-none animate-in zoom-in-95 duration-500">
                        {/* Close Button - Outside the box */}
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-white hover:bg-zinc-50 flex items-center justify-center transition-all border border-zinc-100 shadow-xl z-50 group/close"
                        >
                            <X size={20} className="text-zinc-400 group-hover/close:text-zinc-900 transition-colors" />
                        </button>
                        {/* Preview Area */}
                        <div className="w-full h-full p-12">
                            {isImage(selectedFile.key, selectedFile.mimeType) ? (
                                <img
                                    src={selectedFile.url}
                                    alt={selectedFile.key}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                />
                            ) : isVideo(selectedFile.key, selectedFile.mimeType) ? (
                                <video
                                    src={selectedFile.url}
                                    controls
                                    className="max-w-full max-h-full rounded-2xl"
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center gap-6">
                                    <div className="w-24 h-24 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-300">
                                        {getFileIcon(selectedFile)}
                                    </div>
                                    <span className="text-zinc-400 text-sm font-medium">Bản xem trước không khả dụng</span>
                                </div>
                            )}
                        </div>

                        {/* Info Area */}
                        <div className="w-full md:w-[24rem] p-10 flex flex-col justify-between bg-white border-l border-zinc-50">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 leading-tight">
                                        {selectedFile.name || selectedFile.key.split('/').pop()}
                                    </h2>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-[9px] font-semibold border-zinc-100 text-zinc-400 tracking-widest bg-zinc-50/50">
                                            {selectedFile.mimeType?.split('/').pop() || 'FILE'}
                                        </Badge>
                                        <Badge variant="outline" className="text-[9px] font-semibold border-zinc-100 text-zinc-400 tracking-widest bg-zinc-50/50">
                                            {formatSize(selectedFile.size)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] font-semibold text-zinc-400 tracking-widest">Đường dẫn tệp</span>
                                        <div className="group relative flex items-center">
                                            <code className="text-[11px] bg-zinc-50 px-4 py-3 rounded-2xl flex-1 truncate font-mono text-zinc-500 border border-zinc-100/50">
                                                {selectedFile.url}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(selectedFile.url)}
                                                className="absolute right-2 p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-zinc-100 hover:shadow-sm"
                                            >
                                                <Copy size={12} className="text-zinc-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-zinc-50/50 rounded-[1.5rem] border border-zinc-100/50 space-y-4">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-zinc-400 font-medium">Key:</span>
                                            <span className="text-zinc-600 font-mono truncate max-w-[150px]">{selectedFile.key}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-zinc-400 font-medium">Mime:</span>
                                            <span className="text-zinc-600 font-medium">{selectedFile.mimeType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-10 mt-10 border-t border-zinc-50">
                                <Button
                                    variant="inverted"
                                    className="w-full rounded-[1.25rem] h-14 font-semibold text-xs tracking-wider bg-zinc-950 text-white hover:bg-zinc-800 transition-all"
                                    onClick={() => window.open(selectedFile.url, '_blank')}
                                >
                                    <ExternalLink size={16} className="mr-2" />
                                    Mở tệp tin
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full rounded-[1.25rem] h-12 font-semibold text-[11px] text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                    onClick={() => handleDelete(selectedFile)}
                                >
                                    <Trash2 size={14} className="mr-2" />
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
                            <h3 className="text-xl font-bold tracking-tight">Import từ URL</h3>
                            <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">URL tệp tin</label>
                                <Input
                                    placeholder="https://"
                                    value={importUrl}
                                    onChange={(e) => setImportUrl(e.target.value)}
                                    className="rounded-2xl border-border/40 focus:ring-primary/10 h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Tên ghi nhớ (Tùy chọn)</label>
                                <Input
                                    placeholder="Thumbnail..."
                                    value={importName}
                                    onChange={(e) => setImportName(e.target.value)}
                                    className="rounded-2xl border-border/40 focus:ring-primary/10 h-12"
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
