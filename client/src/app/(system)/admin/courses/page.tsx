'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Pagination } from '@/components/Pagination';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { useConfirm } from '@/components/ConfirmDialog';
import { AdminPageHeader } from '@/components/system/admin/AdminPageHeader';
import { TableActions } from '@/components/system/admin/TableActions';

import { BookOpen } from 'lucide-react';

export default function AdminCoursesPage() {
    const { addToast } = useToast();
    const confirm = useConfirm();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch all courses (including unpublished ones if the API supports it)
                const res: any = await api.admin.courses.list();
                setCourses(res.data || []);
            } catch (e: any) {
                console.error('Failed to fetch courses (Admin)', e);
                addToast(`Lỗi tải khóa học: ${e?.message || 'Unknown error'}`, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Delete Course?',
            message: 'Are you sure you want to delete this course?',
            variant: 'danger',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });
        if (!confirmed) return;
        try {
            await api.admin.courses.delete(id);
            setCourses(courses.filter(c => c.id !== id));
        } catch (e) {
            console.error('Failed to delete course', e);
            addToast('Xóa khóa học thất bại', 'error');
        }
    };

    // Pagination Logic
    const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
    const paginatedCourses = courses.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Quản lý khóa học"
                subtitle="Quản lý danh sách khóa học và nội dung đào tạo"
                icon={<BookOpen className="w-8 h-8" />}
            >
                <Link href="/admin/courses/new">
                    <Button as="div">Tạo khóa học</Button>
                </Link>
            </AdminPageHeader>

            <Card className="border border-border shadow-none bg-card">
                <CardHeader className="border-b border-border bg-muted/20 py-4 px-6 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground">Danh sách khóa học ({courses.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-[13px] border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="text-left font-semibold text-muted-foreground py-3 px-6 pl-6">Tên khóa học</th>
                                    <th className="text-left font-semibold text-muted-foreground py-3 px-4 w-[180px]">Combo / Lộ trình</th>
                                    <th className="text-left font-semibold text-muted-foreground py-3 px-4 w-[150px]">Đường dẫn (Slug)</th>
                                    <th className="text-right font-semibold text-muted-foreground py-3 px-4">Giá</th>
                                    <th className="text-center font-semibold text-muted-foreground py-3 px-4">Status</th>
                                    <th className="text-right font-semibold text-muted-foreground py-3 px-6">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCourses.map((course) => (
                                    <tr key={course.id} className="group border-b border-border hover:bg-muted/50 transition-colors">
                                        <td className="py-4 px-6 font-medium align-middle">{course.title}</td>
                                        <td className="py-4 px-4 align-middle max-w-[180px]">
                                            <div className="flex flex-wrap gap-1">
                                                {course.bundles?.length > 0 ? (
                                                    course.bundles.map((bc: any) => (
                                                        <Link key={bc.bundleId} href={`/admin/bundles/${bc.bundleId}`}>
                                                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                                                                {bc.bundle?.name || 'Loading...'}
                                                            </span>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Không có</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 align-middle max-w-[150px] break-words" title={course.slug}>{course.slug}</td>
                                        <td className="py-4 px-4 align-middle font-medium text-right">
                                            {course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                                        </td>
                                        <td className="py-4 px-4 align-middle text-center">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${course.isPublished ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                                                {course.isPublished ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 align-middle text-right">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                <TableActions
                                                    viewUrl={`/courses/${course.slug}`}
                                                    editUrl={`/admin/courses/${course.id}`}
                                                    onDelete={() => handleDelete(course.id)}
                                                    className="justify-end"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {courses.length === 0 && !loading && (
                            <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <BookOpen className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <p className="text-sm font-medium text-foreground">Chưa có khóa học nào</p>
                                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">Tạo khóa học mới để bắt đầu giảng dạy</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="p-4">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={courses.length}
                            onPageChange={setPage}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
