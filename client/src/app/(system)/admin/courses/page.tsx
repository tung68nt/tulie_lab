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
            >
                <Link href="/admin/courses/new">
                    <Button as="div">Tạo khóa học</Button>
                </Link>
            </AdminPageHeader>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách khóa học ({courses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Tên khóa học</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Đường dẫn (Slug)</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Giá</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {paginatedCourses.map((course) => (
                                    <tr key={course.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{course.title}</td>
                                        <td className="p-4 align-middle">{course.slug}</td>
                                        <td className="p-4 align-middle font-medium text-right">
                                            {course.price === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${course.isPublished ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
                                                {course.isPublished ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <TableActions
                                                viewUrl={`/courses/${course.slug}`}
                                                editUrl={`/admin/courses/${course.id}`}
                                                onDelete={() => handleDelete(course.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {courses.length === 0 && !loading && (
                            <div className="p-4 text-center text-muted-foreground">Chưa có khóa học nào. Hãy tạo mới ngay!</div>
                        )}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItems={courses.length}
                        onPageChange={setPage}
                        className="mt-6"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
