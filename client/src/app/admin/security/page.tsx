'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function AdminSecurityPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'security' | 'activity'>('security');
    const { addToast } = useToast();

    // Pagination state
    const [securityPage, setSecurityPage] = useState(1);
    const [activityPage, setActivityPage] = useState(1);

    const formatActionLabel = (action: string) => {
        if (!action) return '';
        const words = action.toLowerCase().split('_');
        const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        return [firstWord, ...words.slice(1)].join(' ');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [securityData, activityLogData] = await Promise.all([
                    api.security.list().catch(() => ({ logs: [], total: 0 })),
                    api.activity.list().then(res => (res as any).logs).catch(() => [])
                ]);

                const securityLogs = Array.isArray(securityData) ? securityData : (securityData as any).logs || [];
                setLogs(securityLogs);
                setActivities(activityLogData as any[]);
            } catch (e) {
                console.error('Failed to fetch logs', e);
                addToast('Lỗi tải nhật ký', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addToast]);

    // Export CSV function
    const exportToCSV = (data: any[], filename: string, type: 'security' | 'activity') => {
        if (data.length === 0) {
            addToast('Không có dữ liệu để xuất', 'warning');
            return;
        }

        let csvContent = '';

        if (type === 'security') {
            csvContent = 'Hành động,Chi tiết,IP,User,Email,Thời gian\n';
            data.forEach(log => {
                csvContent += `"${formatActionLabel(log.action)}","${log.details || ''}","${log.ipAddress || ''}","${log.user?.name || 'Guest'}","${log.user?.email || ''}","${new Date(log.createdAt).toLocaleString('vi-VN')}"\n`;
            });
        } else {
            csvContent = 'Hành động,Đường dẫn,Thiết bị,IP,Địa điểm,User,Email,Thời gian\n';
            data.forEach(log => {
                csvContent += `"${formatActionLabel(log.action)}","${log.path || ''}","${log.device || ''}","${log.ipAddress || ''}","${log.location || ''}","${log.user?.name || 'Guest'}","${log.user?.email || ''}","${new Date(log.createdAt).toLocaleString('vi-VN')}"\n`;
            });
        }

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        addToast('Đã xuất file CSV', 'success');
    };

    // Pagination helpers
    const getPaginatedData = (data: any[], page: number) => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return data.slice(start, end);
    };

    const getTotalPages = (data: any[]) => Math.ceil(data.length / ITEMS_PER_PAGE);

    const paginatedLogs = getPaginatedData(logs, securityPage);
    const paginatedActivities = getPaginatedData(activities, activityPage);
    const totalSecurityPages = getTotalPages(logs);
    const totalActivityPages = getTotalPages(activities);

    if (loading) return <div className="p-10 text-center">Đang tải...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Trung tâm giám sát</h1>

            {/* Tabs with Export Button */}
            <div className="flex items-center justify-between border-b">
                <div className="flex">
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setActiveTab('security')}
                    >
                        Cảnh báo bảo mật (Security)
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        Nhật ký hoạt động (Activity)
                    </button>
                </div>
                <button
                    onClick={() => activeTab === 'security'
                        ? exportToCSV(logs, 'security_logs', 'security')
                        : exportToCSV(activities, 'activity_logs', 'activity')
                    }
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors pb-2"
                >
                    <Download className="w-4 h-4" />
                    Xuất CSV
                </button>
            </div>

            {activeTab === 'security' ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Lịch sử cảnh báo vi phạm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            {logs.length === 0 ? (
                                <p className="text-muted-foreground text-center py-10">Chưa có ghi nhận nào.</p>
                            ) : (
                                <>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">Hành động</th>
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">Chi tiết</th>
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">IP</th>
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">User</th>
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">Thời gian</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedLogs.map((log) => (
                                                <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                    <td className="py-3 px-2">
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${log.action === 'SUSPICIOUS_REQUEST' ? 'bg-red-100 text-red-800' :
                                                            log.action === 'COPY_PASTE' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {formatActionLabel(log.action)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-2 text-muted-foreground max-w-xs truncate" title={log.details}>{log.details}</td>
                                                    <td className="py-3 px-2 font-mono text-xs">{log.ipAddress}</td>
                                                    <td className="py-3 px-2">
                                                        <div className="font-medium text-xs">
                                                            {log.user ? (
                                                                <div className="flex flex-col">
                                                                    <span>{log.user.name || 'Unnamed'}</span>
                                                                    <span className="text-muted-foreground text-[10px]">{log.user.email}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground">Guest</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2 text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {totalSecurityPages > 1 && (
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                            <span className="text-sm text-muted-foreground">
                                                Trang {securityPage} / {totalSecurityPages} ({logs.length} bản ghi)
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={securityPage === 1}
                                                    onClick={() => setSecurityPage(p => p - 1)}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={securityPage === totalSecurityPages}
                                                    onClick={() => setSecurityPage(p => p + 1)}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Nhật ký truy cập & hành vi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            {activities.length === 0 ? (
                                <p className="text-muted-foreground text-center py-10">Chưa có hoạt động nào.</p>
                            ) : (
                                <>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">Hành động</th>
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">Đường dẫn</th>
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">Thiết bị</th>
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">IP / Địa điểm</th>
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">User</th>
                                                <th className="py-2 px-2 font-semibold whitespace-nowrap">Thời gian</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedActivities.map((log) => (
                                                <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                    <td className="py-3 px-2">
                                                        <span className="font-medium text-primary whitespace-nowrap text-xs">{formatActionLabel(log.action)}</span>
                                                    </td>
                                                    <td className="py-3 px-2 text-muted-foreground max-w-xs truncate text-xs" title={log.path}>{log.path || '-'}</td>
                                                    <td className="py-3 px-2 text-xs max-w-[150px] truncate" title={log.device}>{log.device || '-'}</td>
                                                    <td className="py-3 px-2 font-mono text-xs">
                                                        <div>{log.ipAddress}</div>
                                                        {log.location && <div className="text-muted-foreground">{log.location}</div>}
                                                    </td>
                                                    <td className="py-3 px-2">
                                                        <div className="font-medium text-xs">
                                                            {log.user ? (
                                                                <div className="flex flex-col">
                                                                    <span>{log.user.name || 'Unnamed'}</span>
                                                                    <span className="text-muted-foreground text-[10px]">{log.user.email}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground">Guest</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2 text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {totalActivityPages > 1 && (
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                            <span className="text-sm text-muted-foreground">
                                                Trang {activityPage} / {totalActivityPages} ({activities.length} bản ghi)
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={activityPage === 1}
                                                    onClick={() => setActivityPage(p => p - 1)}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={activityPage === totalActivityPages}
                                                    onClick={() => setActivityPage(p => p + 1)}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
