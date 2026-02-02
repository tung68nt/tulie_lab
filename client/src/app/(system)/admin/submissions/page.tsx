'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Textarea } from '@/components/Textarea';
import { Clock, CheckCircle, XCircle, FileText, Link as LinkIcon, User, Route, Eye, Send } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

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
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Clock className="w-8 h-8" />
                <div>
                    <h1 className="text-2xl font-bold">Duyệt Bài Nộp</h1>
                    <p className="text-muted-foreground">Xem xét và đánh giá bài nộp từ học viên</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Submission List */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Bài nộp chờ duyệt ({submissions.length})</h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-muted-foreground">Đang tải...</p>
                        </div>
                    ) : submissions.length === 0 ? (
                        <Card className="p-12 text-center">
                            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                            <h3 className="text-lg font-semibold mb-2">Không có bài nộp chờ duyệt</h3>
                            <p className="text-muted-foreground">Tất cả bài nộp đã được xử lý.</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {submissions.map((submission) => (
                                <Card
                                    key={submission.id}
                                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedSubmission?.id === submission.id ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => setSelectedSubmission(submission)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            {submission.enrollment.user.profile?.avatar ? (
                                                <img
                                                    src={submission.enrollment.user.profile.avatar}
                                                    alt={submission.enrollment.user.profile.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium">{submission.enrollment.user.profile?.name || 'N/A'}</p>
                                                <p className="text-xs text-muted-foreground">{submission.enrollment.user.email}</p>
                                            </div>
                                        </div>
                                        <Badge variant="default">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Chờ duyệt
                                        </Badge>
                                    </div>
                                    <div className="mt-3 pt-3 border-t">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Route className="w-4 h-4" />
                                            <span>{submission.enrollment.journey.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                                                {submission.step.position}
                                            </span>
                                            <span>{submission.step.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Nộp lúc: {formatDate(submission.submittedAt)}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Review Panel */}
                <div>
                    {selectedSubmission ? (
                        <Card className="p-6 sticky top-6">
                            <h2 className="text-lg font-semibold mb-4">Chi Tiết Bài Nộp</h2>

                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-4">
                                {selectedSubmission.enrollment.user.profile?.avatar ? (
                                    <img
                                        src={selectedSubmission.enrollment.user.profile.avatar}
                                        alt={selectedSubmission.enrollment.user.profile.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <User className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold">{selectedSubmission.enrollment.user.profile?.name || 'N/A'}</p>
                                    <p className="text-sm text-muted-foreground">{selectedSubmission.enrollment.user.email}</p>
                                </div>
                            </div>

                            {/* Journey & Step Info */}
                            <div className="bg-muted rounded-lg p-3 mb-4">
                                <p className="text-sm font-medium">{selectedSubmission.enrollment.journey.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    Bước {selectedSubmission.step.position}: {selectedSubmission.step.title}
                                </p>
                            </div>

                            {/* Submission Content */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {getSubmissionIcon(selectedSubmission.submissionType)}
                                    <span className="text-sm font-medium">Nội dung bài nộp</span>
                                    <Badge variant="outline">{selectedSubmission.submissionType}</Badge>
                                </div>

                                <div className="bg-muted rounded-lg p-4 max-h-[200px] overflow-y-auto">
                                    {selectedSubmission.submissionType === 'URL' ? (
                                        <a
                                            href={selectedSubmission.content}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline break-all"
                                        >
                                            {selectedSubmission.content}
                                        </a>
                                    ) : (
                                        <p className="whitespace-pre-wrap text-sm">{selectedSubmission.content}</p>
                                    )}
                                </div>

                                {selectedSubmission.fileName && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        File: {selectedSubmission.fileName}
                                    </p>
                                )}
                            </div>

                            {/* Feedback */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Nhận xét (tùy chọn)</label>
                                <Textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Viết nhận xét cho học viên..."
                                    rows={3}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                                    onClick={() => handleReview(selectedSubmission.id, 'REJECTED')}
                                    disabled={reviewing}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Từ chối
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => handleReview(selectedSubmission.id, 'APPROVED')}
                                    disabled={reviewing}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Duyệt
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-12 text-center">
                            <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">Chọn bài nộp để xem</h3>
                            <p className="text-muted-foreground">Nhấp vào một bài nộp bên trái để xem chi tiết và đánh giá.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
