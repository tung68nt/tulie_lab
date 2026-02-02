'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Textarea } from '@/components/Textarea';
import { Clock, CheckCircle, XCircle, FileText, Link as LinkIcon, User, Route, Eye, Send, Inbox } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';

interface Submission {
    id: string;
    submissionType: string;
    content: string;
    fileName?: string;
    status: string;
    feedback?: string;
    submittedAt: string;
    enrollment: {
        user: {
            id: string;
            email: string;
            profile: { name: string; avatar?: string };
        };
        journey: { id: string; title: string; slug: string };
    };
    step: {
        id: string;
        title: string;
        position: number;
        submissionType: string;
    };
}

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [feedback, setFeedback] = useState('');
    const [reviewing, setReviewing] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            const data = await api.journeys.admin.listSubmissions({ status: 'PENDING' });
            setSubmissions(data);
        } catch (error) {
            console.error('Failed to load submissions:', error);
            addToast('Không thể tải danh sách bài nộp', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (submissionId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            setReviewing(true);
            await api.journeys.admin.reviewSubmission(submissionId, { status, feedback: feedback || undefined });
            addToast(status === 'APPROVED' ? 'Đã duyệt bài nộp' : 'Đã từ chối bài nộp', 'success');
            setSelectedSubmission(null);
            setFeedback('');
            loadSubmissions();
        } catch (error) {
            console.error('Failed to review submission:', error);
            addToast('Không thể xử lý đánh giá', 'error');
        } finally {
            setReviewing(false);
        }
    };

    const getSubmissionIcon = (type: string) => {
        switch (type) {
            case 'FILE':
                return <FileText className="w-4 h-4" />;
            case 'URL':
                return <LinkIcon className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Duyệt Bài Nộp"
                subtitle="Xem xét và đánh giá bài nộp từ học viên"
                icon={<Clock className="w-8 h-8" />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
                {/* Submission List Panel */}
                <Card className="lg:col-span-1 flex flex-col h-full border-zinc-200 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="border-b bg-zinc-50/50 py-4 px-5 shrink-0">
                        <CardTitle className="text-base font-bold flex items-center justify-between">
                            <span>Danh sách chờ ({submissions.length})</span>
                            {loading && <div className="text-xs font-normal text-muted-foreground">Đang cập nhật...</div>}
                        </CardTitle>
                    </CardHeader>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-zinc-50/30">
                        {loading && submissions.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="animate-spin w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full mx-auto mb-3" />
                                <p className="text-xs text-muted-foreground">Đang tải dữ liệu...</p>
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center opacity-60">
                                <CheckCircle className="w-12 h-12 mb-3 stroke-1" />
                                <p className="font-medium">Đã duyệt hết!</p>
                                <p className="text-xs mt-1">Hiện không có bài nộp nào cần xử lý.</p>
                            </div>
                        ) : (
                            submissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${selectedSubmission?.id === submission.id
                                            ? 'bg-white border-zinc-900 ring-1 ring-zinc-900 shadow-md'
                                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                                        }`}
                                    onClick={() => setSelectedSubmission(submission)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {submission.enrollment.user.profile?.avatar ? (
                                                <img
                                                    src={submission.enrollment.user.profile.avatar}
                                                    alt={submission.enrollment.user.profile.name}
                                                    className="w-9 h-9 rounded-full object-cover border border-zinc-100"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                                                    <User className="w-4 h-4 text-zinc-500" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm truncate max-w-[140px]">
                                                    {submission.enrollment.user.profile?.name || 'Học viên'}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                                                    {submission.enrollment.user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 whitespace-nowrap">
                                            Chờ duyệt
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 pt-3 border-t border-dashed border-zinc-100">
                                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                                            <Route className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">{submission.enrollment.journey.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                                            <div className="w-4 h-4 rounded-full bg-zinc-100 text-zinc-600 text-[9px] flex items-center justify-center font-bold shrink-0">
                                                {submission.step.position}
                                            </div>
                                            <span className="truncate font-medium">{submission.step.title}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground pt-1 text-right">
                                            {formatDate(submission.submittedAt)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Review Panel */}
                <div className="lg:col-span-2 h-full flex flex-col">
                    {selectedSubmission ? (
                        <Card className="h-full border-zinc-200 shadow-sm flex flex-col overflow-hidden bg-white">
                            <CardHeader className="border-b py-4 px-6 bg-zinc-50/50 flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center border">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Chi tiết bài nộp</CardTitle>
                                        <p className="text-xs text-muted-foreground mt-0.5">ID: {selectedSubmission.id}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-yellow-700 bg-yellow-50 border-yellow-200">
                                    Status: PENDING
                                </Badge>
                            </CardHeader>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Student & Context Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg border bg-zinc-50/50 space-y-3">
                                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Học viên</h4>
                                        <div className="flex items-center gap-3">
                                            {selectedSubmission.enrollment.user.profile?.avatar ? (
                                                <img
                                                    src={selectedSubmission.enrollment.user.profile.avatar}
                                                    alt="Avatar"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center">
                                                    <User className="w-5 h-5 text-zinc-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-sm">{selectedSubmission.enrollment.user.profile?.name}</p>
                                                <p className="text-xs text-muted-foreground">{selectedSubmission.enrollment.user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg border bg-zinc-50/50 space-y-3">
                                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Bài tập</h4>
                                        <div>
                                            <p className="font-semibold text-sm line-clamp-1">{selectedSubmission.enrollment.journey.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px] h-5">Bước {selectedSubmission.step.position}</Badge>
                                                <p className="text-xs text-muted-foreground line-clamp-1">{selectedSubmission.step.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Display */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <Inbox className="w-4 h-4" />
                                        Nội dung bài làm
                                        <Badge variant="outline" className="text-[10px] h-5">{selectedSubmission.submissionType}</Badge>
                                    </h3>

                                    <div className="rounded-lg border bg-zinc-50 p-6 min-h-[120px]">
                                        {selectedSubmission.submissionType === 'URL' ? (
                                            <div className="flex items-center gap-3 p-4 bg-white rounded border">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0">
                                                    <LinkIcon className="w-5 h-5" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs text-muted-foreground mb-1">Link bài nộp</p>
                                                    <a
                                                        href={selectedSubmission.content}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-medium text-blue-600 hover:underline truncate block"
                                                    >
                                                        {selectedSubmission.content}
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="prose prose-sm max-w-none text-zinc-800 whitespace-pre-wrap">
                                                {selectedSubmission.content}
                                            </div>
                                        )}

                                        {selectedSubmission.fileName && (
                                            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-white p-2 rounded border inline-flex">
                                                <FileText className="w-3 h-3" />
                                                File đính kèm: <span className="font-medium text-foreground">{selectedSubmission.fileName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="p-6 border-t bg-zinc-50 space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Nhận xét / Feedback (Tùy chọn)</label>
                                    <Textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Nhập nhận xét của bạn để gửi cho học viên..."
                                        className="bg-white min-h-[80px]"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        className="min-w-[120px] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                        onClick={() => handleReview(selectedSubmission.id, 'REJECTED')}
                                        disabled={reviewing}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Từ chối
                                    </Button>
                                    <Button
                                        className="min-w-[120px] bg-zinc-900 text-white hover:bg-zinc-800"
                                        onClick={() => handleReview(selectedSubmission.id, 'APPROVED')}
                                        disabled={reviewing}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Duyệt bài
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-2 shadow-none bg-zinc-50/50">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border">
                                <Eye className="w-10 h-10 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Chưa chọn bài nộp</h3>
                            <p className="text-zinc-500 max-w-sm">
                                Vui lòng chọn một bài nộp từ danh sách bên trái để xem chi tiết và thực hiện đánh giá.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
