'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import {  Plus, Edit2, Trash2, Users, BookOpen, Eye, EyeOff, Route , Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useConfirm } from '@/components/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

interface Journey {
    id: string;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    isPublished: boolean;
    isAddOn: boolean;
    price: number;
    course?: { id: string; title: string; slug: string };
    steps: any[];
    _count: { enrollments: number };
    createdAt: string;
}

export default function JourneyListPage() {
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const confirm = useConfirm();

    const fetchJourneys = async () => {
        try {
            setLoading(true);
            const data = await api.journeys.admin.list();
            setJourneys(data);
        } catch (error) {
            console.error('Failed to load journeys:', error);
            addToast('Không thể tải danh sách lộ trình', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJourneys();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Xóa lộ trình?',
            message: 'Bạn có chắc muốn xóa lộ trình này? Hành động này không thể hoàn tác.',
            variant: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy'
        });

        if (!confirmed) return;

        try {
            await api.journeys.admin.delete(id);
            addToast('Đã xóa lộ trình', 'success');
            fetchJourneys();
        } catch (error) {
            console.error('Failed to delete journey:', error);
            addToast('Không thể xóa lộ trình', 'error');
        }
    };

    const handleTogglePublish = async (journey: Journey) => {
        try {
            await api.journeys.admin.update(journey.id, { isPublished: !journey.isPublished });
            addToast(journey.isPublished ? 'Đã ẩn lộ trình' : 'Đã xuất bản lộ trình', 'success');
            fetchJourneys();
        } catch (error) {
            console.error('Failed to toggle publish:', error);
            addToast('Không thể cập nhật trạng thái', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Lộ Trình Học"
                subtitle="Quản lý các lộ trình học thực hành"
                icon={<Route className="w-8 h-8" />}
            >
                <Link href="/admin/journeys/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo Lộ Trình
                    </Button>
                </Link>
            </AdminPageHeader>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Route className="w-8 h-8" />
                        <div>
                            <p className="text-2xl font-bold">{journeys.length}</p>
                            <p className="text-sm text-muted-foreground">Tổng số lộ trình</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Eye className="w-8 h-8" />
                        <div>
                            <p className="text-2xl font-bold">{journeys.filter(j => j.isPublished).length}</p>
                            <p className="text-sm text-muted-foreground">Đã xuất bản</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8" />
                        <div>
                            <p className="text-2xl font-bold">
                                {journeys.reduce((acc, curr) => acc + (curr._count?.enrollments || 0), 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">Tổng học viên</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Journey List */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            ) : journeys.length === 0 ? (
                <Card className="p-12 text-center">
                    <Route className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có lộ trình nào</h3>
                    <p className="text-muted-foreground mb-4">Bắt đầu bằng cách tạo lộ trình học đầu tiên.</p>
                    <Link href="/admin/journeys/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo Lộ Trình
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {journeys.map((journey) => (
                        <Card key={journey.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {journey.thumbnail ? (
                                        <img
                                            src={journey.thumbnail}
                                            alt={journey.title}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                            <Route className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{journey.title}</h3>
                                            {journey.isPublished ? (
                                                <Badge variant="secondary">Công khai</Badge>
                                            ) : (
                                                <Badge variant="secondary">Nháp</Badge>
                                            )}
                                            {journey.isAddOn && <Badge variant="outline">Add-on</Badge>}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {journey.steps.length} bước • {journey._count.enrollments} học viên
                                        </p>
                                        {journey.course && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <BookOpen className="w-3 h-3" />
                                                Liên kết: {journey.course.title}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleTogglePublish(journey)}
                                        title={journey.isPublished ? 'Ẩn' : 'Xuất bản'}
                                    >
                                        {journey.isPublished ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Link href={`/admin/journeys/${journey.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit2 className="w-4 h-4 mr-1" />
                                            Chỉnh sửa
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/journeys/${journey.id}/dashboard`}>
                                        <Button variant="secondary" size="sm">
                                            <Users className="w-4 h-4 mr-1" />
                                            Học viên
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(journey.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
