'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { ArrowLeft, Users, CheckCircle, Clock, XCircle, Route, User } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

interface DashboardData {
    journey: {
        id: string;
        title: string;
        totalSteps: number;
    };
    students: Array<{
        id: string;
        user: {
            id: string;
            email: string;
            profile: { name: string; avatar?: string };
        };
        currentStep: number;
        status: string;
        startedAt: string;
        completedAt?: string;
        progress: number;
        stepStatuses: Array<{
            stepId: string;
            stepTitle: string;
            position: number;
            status: string;
            submittedAt?: string;
        }>;
    }>;
    summary: {
        totalEnrolled: number;
        inProgress: number;
        completed: number;
    };
}

export default function JourneyDashboardPage() {
    const params = useParams();
    const journeyId = params?.id as string;
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        loadDashboard();
    }, [journeyId]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const result = await api.journeys.admin.getDashboard(journeyId);
            setData(result);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            addToast('Không thể tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Đã duyệt</Badge>;
            case 'PENDING':
                return <Badge variant="default"><Clock className="w-3 h-3 mr-1" />Chờ duyệt</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Từ chối</Badge>;
            case 'NOT_SUBMITTED':
                return <Badge variant="outline">Chưa nộp</Badge>;
            case 'LOCKED':
                return <Badge variant="outline">Đã khóa</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6">
                <p className="text-muted-foreground">Không tìm thấy dữ liệu</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/journeys">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <Users className="w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold">Tiến Độ Học Viên</h1>
                        <p className="text-muted-foreground">{data.journey.title}</p>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-500" />
                        <div>
                            <p className="text-2xl font-bold">{data.summary.totalEnrolled}</p>
                            <p className="text-sm text-muted-foreground">Tổng ghi danh</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-8 h-8 text-yellow-500" />
                        <div>
                            <p className="text-2xl font-bold">{data.summary.inProgress}</p>
                            <p className="text-sm text-muted-foreground">Đang học</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <div>
                            <p className="text-2xl font-bold">{data.summary.completed}</p>
                            <p className="text-sm text-muted-foreground">Hoàn thành</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <Route className="w-8 h-8 text-purple-500" />
                        <div>
                            <p className="text-2xl font-bold">{data.journey.totalSteps}</p>
                            <p className="text-sm text-muted-foreground">Số bước</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Students Table */}
            {data.students.length === 0 ? (
                <Card className="p-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có học viên</h3>
                    <p className="text-muted-foreground">Chưa có ai ghi danh vào lộ trình này.</p>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium">Học viên</th>
                                    <th className="text-center py-3 px-4 font-medium">Bước hiện tại</th>
                                    <th className="text-center py-3 px-4 font-medium">Tiến độ</th>
                                    {Array.from({ length: data.journey.totalSteps }, (_, i) => (
                                        <th key={i} className="text-center py-3 px-2 font-medium text-sm">
                                            B{i + 1}
                                        </th>
                                    ))}
                                    <th className="text-center py-3 px-4 font-medium">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.students.map((student) => (
                                    <tr key={student.id} className="hover:bg-muted/50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                {student.user.profile?.avatar ? (
                                                    <img
                                                        src={student.user.profile.avatar}
                                                        alt={student.user.profile.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{student.user.profile?.name || 'N/A'}</p>
                                                    <p className="text-xs text-muted-foreground">{student.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center py-3 px-4">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                                                {student.currentStep}
                                            </span>
                                        </td>
                                        <td className="text-center py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-primary h-full rounded-full transition-all"
                                                        style={{ width: `${student.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-muted-foreground w-10">{student.progress}%</span>
                                            </div>
                                        </td>
                                        {student.stepStatuses.map((step) => (
                                            <td key={step.stepId} className="text-center py-3 px-2">
                                                {step.status === 'APPROVED' && (
                                                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                                )}
                                                {step.status === 'PENDING' && (
                                                    <Clock className="w-4 h-4 text-yellow-500 mx-auto" />
                                                )}
                                                {step.status === 'REJECTED' && (
                                                    <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                                                )}
                                                {step.status === 'NOT_SUBMITTED' && (
                                                    <div className="w-4 h-4 border-2 border-muted-foreground rounded-full mx-auto" />
                                                )}
                                                {step.status === 'LOCKED' && (
                                                    <div className="w-4 h-4 border border-muted rounded-full mx-auto" />
                                                )}
                                            </td>
                                        ))}
                                        <td className="text-center py-3 px-4">
                                            {student.status === 'COMPLETED' ? (
                                                <Badge variant="secondary">Hoàn thành</Badge>
                                            ) : (
                                                <Badge variant="outline">Đang học</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
